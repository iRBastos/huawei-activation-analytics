import {columnName} from './domain.js';
// OOXML reader for activation matrices. JSZip is vendored; all bytes stay local.
const decode=s=>String(s??'').replace(/&#x([0-9a-f]+);|&#(\d+);|&(amp|lt|gt|quot|apos);/gi,(_,h,d,n)=>h?String.fromCodePoint(parseInt(h,16)):d?String.fromCodePoint(+d):({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[n.toLowerCase()]));
function attrs(s){const out={};for(const m of s.matchAll(/([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g))out[m[1]]=decode(m[2]??m[3]);return out;}
function elements(xml,tag){const re=new RegExp(`<((?:[\\w.-]+:)?${tag})\\b([^>]*?)(?:\\/>|>([\\s\\S]*?)<\\/\\1\\s*>)`,'g');return [...xml.matchAll(re)].map(m=>({attrs:attrs(m[2]),body:m[3]??''}));}
function textRuns(xml){return elements(xml,'t').map(t=>decode(t.body)).join('');}
function safeXml(xml){if(/<!DOCTYPE|<!ENTITY/i.test(xml))throw new Error('Unsupported XML declarations. Export a standard .xlsx workbook.');return xml;}
function resolvePath(base,target){const result=target.startsWith('/')?[]:base.split('/').slice(0,-1);for(const p of target.replace(/^\//,'').split('/')){if(p==='..')result.pop();else if(p&&p!=='.')result.push(p);}return result.join('/');}
const colIndex=ref=>{const m=/^([A-Z]+)\d+$/.exec(ref);if(!m)return null;return [...m[1]].reduce((n,c)=>n*26+c.charCodeAt(0)-64,0)-1;};
export function parseWorksheet(xml,strings=[]) {
  safeXml(xml);const rows=[];
  for(const [ri,row]of elements(xml,'row').entries()){
    const rowIndex=Number(row.attrs.r??ri+1)-1;
    if(!Number.isInteger(rowIndex)||rowIndex<0||rowIndex>100000)throw new Error('Worksheet exceeds the supported 100,000-row limit.');
    const cells=[];
    for(const [ci,c]of elements(row.body,'c').entries()){
      const ref=c.attrs.r??`${columnName(ci)}${rowIndex+1}`,col=colIndex(ref);
      if(col===null||col>2000)throw new Error('Invalid cell reference or more than 2,001 columns.');
      const type=c.attrs.t??'n',raw=elements(c.body,'v')[0]?.body,f=elements(c.body,'f')[0]?.body;
      let v=null;
      if(type==='inlineStr')v=textRuns(c.body);
      else if(type==='s'){const index=Number(raw);if(raw!==undefined&&Number.isInteger(index)&&index>=0&&index<strings.length)v=strings[index];else throw new Error(`Invalid shared string reference at ${ref}.`);}
      else if(type==='e')v=decode(raw??'#ERROR');
      else if(type==='str'||type==='d')v=raw===undefined?null:decode(raw);
      else if(type==='b')v=raw==='1';
      else if(raw!==undefined&&raw.trim()!==''){const n=Number(raw);v=Number.isFinite(n)?n:decode(raw);}
      cells[col]={v,type,ref,f:f!==undefined?decode(f)||'(shared formula)':null};
    }
    rows[rowIndex]=cells;
  }
  return Array.from({length:rows.length},(_,i)=>rows[i]??[]);
}
export function parseCsv(text){
  const rows=[];let row=[],value='',quoted=false;
  text=text.replace(/^\uFEFF/,'');
  for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else if(quoted)quoted=false;else if(value==='')quoted=true;else throw new Error('Invalid quote in CSV.');}else if(c===','&&!quoted){row.push(value);value='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(value);rows.push(row);row=[];value='';}else value+=c;}
  if(quoted)throw new Error('CSV contains an unclosed quoted field.');if(value!==''||row.length){row.push(value);rows.push(row);}
  return rows.map((r,ri)=>r.map((v,ci)=>({v:v.trim()===''?null:/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(v.trim())?Number(v.trim()):v,type:'csv',ref:`${columnName(ci)}${ri+1}`})));
}
export async function readWorkbook(bytes,filename,zipLibrary=globalThis.JSZip){
  if(bytes.byteLength>30*1024*1024)throw new Error('Maximum workbook size is 30 MB. Export a compact activation matrix.');
  if(/\.csv$/i.test(filename)){const rows=parseCsv(new TextDecoder().decode(bytes));return {names:['CSV'],sheet:async()=>rows};}
  if(!/\.xlsx$/i.test(filename))throw new Error('Choose an .xlsx or comma-separated .csv file. Legacy .xls files must be saved as .xlsx.');
  if(!zipLibrary)throw new Error('The bundled Excel reader did not load. Refresh the page.');
  let zip;try{zip=await zipLibrary.loadAsync(bytes,{checkCRC32:true});}catch{throw new Error('Could not open this Excel file. Check that it is a valid, unencrypted .xlsx workbook.');}
  const entries=Object.values(zip.files);if(entries.length>10000||entries.reduce((s,e)=>s+(e._data?.uncompressedSize??0),0)>120*1024*1024)throw new Error('Workbook is too large when expanded. Export only the activation worksheets.');
  async function read(name){const f=zip.file(name);if(!f)throw new Error(`Required Excel component missing: ${name}.`);return safeXml(await f.async('string'));}
  const workbookPath='xl/workbook.xml',workbook=await read(workbookPath),rels=await read('xl/_rels/workbook.xml.rels'),relations={};
  for(const r of elements(rels,'Relationship'))if(r.attrs.TargetMode!=='External')relations[r.attrs.Id]=resolvePath(workbookPath,r.attrs.Target);
  const sharedPath=elements(rels,'Relationship').find(r=>r.attrs.Type?.endsWith('/sharedStrings'))?.attrs.Target;
  const shared=sharedPath?await read(resolvePath(workbookPath,sharedPath)):zip.file('xl/sharedStrings.xml')?await read('xl/sharedStrings.xml'):'';
  const strings=elements(shared,'si').map(x=>textRuns(x.body));
  const sheets=elements(workbook,'sheet').map(s=>({name:s.attrs.name,path:relations[s.attrs['r:id']??Object.entries(s.attrs).find(([k])=>k.endsWith(':id'))?.[1]]}));
  if(!sheets.length)throw new Error('No readable worksheets were found.');
  return {names:sheets.map(s=>s.name),sheet:async(name)=>{const s=sheets.find(x=>x.name===name);if(!s?.path)throw new Error('Worksheet relationship is missing.');return parseWorksheet(await read(s.path),strings);}};
}
