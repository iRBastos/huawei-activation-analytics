import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {pathToFileURL,fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url)).replace(/[\\/]$/,'');
const html=await fs.readFile(root+'/index.html','utf8');
const scripts=[...html.matchAll(/<script>\s*([\s\S]*?)<\/script>/g)].map(m=>m[1]);
assert.equal(scripts.length,2);
assert.ok(!/<script[^>]+(?:src=|type="module")/.test(html));
assert.ok(!/<link[^>]+rel="stylesheet"/.test(html));
const values=new Map();
const local={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
async function boot(storage=local){
  const listeners={},nodes=new Map(),errors=[],blobs=new Map(),downloads=[];
  function node(){return {innerHTML:'',textContent:'',style:{},open:false,dataset:{},classList:{add(){},remove(){},toggle(){}},showModal(){this.open=true;},close(){this.open=false;},remove(){},append(){},querySelectorAll(){return [];},click(){downloads.push(this);}};}
  const document={title:'',body:node(),querySelector(selector){if(!nodes.has(selector))nodes.set(selector,node());return nodes.get(selector);},getElementById(id){return this.querySelector('#'+id);},addEventListener:(name,fn)=>listeners[name]=fn,createElement:()=>node()};
  const context={document,location:{protocol:'file:',href:'file:///C:/Huawei/index.html',hash:''},localStorage:storage,history:{replaceState(_a,_b,hash){context.location.hash=hash;}},console:{error:(...args)=>errors.push(args.join(' ')),log(){}},structuredClone,Intl,Date,Blob,setImmediate,clearImmediate,ArrayBuffer,Uint8Array,Uint16Array,Uint32Array,Int32Array,DataView,TextEncoder,TextDecoder,URL:{createObjectURL(blob){const key='blob:check-'+blobs.size;blobs.set(key,blob);return key;},revokeObjectURL(){}},setTimeout(fn,ms){const t=setTimeout(fn,ms);if(ms>1000)t.unref();return t;},clearTimeout,addEventListener(){},scrollTo(){},print(){},FormData:class{constructor(form){this.data=form.fields;}has(k){return Object.hasOwn(this.data,k);}get(k){return this.data[k]??null;}getAll(k){const value=this.data[k];return value===undefined?[]:Array.isArray(value)?value:[value];}}};
  context.window=context;context.self=context;
  const ctx=vm.createContext(context);
  vm.runInContext(scripts[0],ctx);
  const instrumented=scripts[1].replace('// MODULE: app.js','globalThis.__testModules=__modules;\n// MODULE: app.js');
  await vm.runInContext(instrumented,ctx);
  assert.deepEqual(errors,[]);
  const click=async data=>listeners.click({target:{closest:()=>({dataset:data,disabled:false})}});
  return {ctx,listeners,nodes,errors,blobs,downloads,click};
}
const app=await boot();
assert.match(app.nodes.get('#main').innerHTML,/Ready for your activation data/);
const modules=app.ctx.__testModules;
for(const [name,module] of Object.entries(modules)){
  const source=await import(pathToFileURL(root+'/codigo-fonte/dist/modules/'+name).href);
  assert.deepEqual(Object.keys(module).sort(),Object.keys(source).sort(),name+' exports');
}
const sourceViews=await import(pathToFileURL(root+'/codigo-fonte/dist/modules/views.js').href);
const fixture=modules['demo.js'].makeDemo();
const ui={hiddenSeries:new Set(),trendMetric:'volume',mixBasis:'modules',compareMetric:'Inverter',coverageCategory:'Inverter',dataTab:'backup',recordPage:0};
for(const fn of ['overviewView','inverterView','batteriesView','comparisonsView','targetsView','dataView'])assert.equal(modules['views.js'][fn](fixture,ui),sourceViews[fn](fixture,ui),fn+' unchanged');
await app.click({action:'demo'});
assert.match(app.nodes.get('#main').innerHTML,/<svg/);
for(const nav of ['inverters','batteries','comparisons','targets','data']){await app.click({nav});assert.ok(app.nodes.get('#main').innerHTML.length>500);}
await app.click({action:'exit-demo'});
assert.match(app.nodes.get('#main').innerHTML,/Ready for your activation data/);
// Acceptance regression: an old schema-1 backup has only the original five LUNA products.
const legacy=modules['model.js'].freshState();
legacy.schemaVersion=1;delete legacy.installers;
legacy.catalog=Object.fromEntries(Object.entries(legacy.catalog).filter(([,p])=>p.category!=='Inverter'));
assert.equal(Object.keys(legacy.catalog).length,5);
const legacyJson=JSON.stringify(legacy);
await app.listeners.change({target:{id:'restore-file',dataset:{},files:[{name:'legacy-backup.json',size:legacyJson.length,text:async()=>legacyJson}]}});
assert.equal(app.nodes.get('#modal').open,true);
await app.click({action:'dialog-confirm'});
const migrated=await modules['persistence.js'].loadState();
assert.equal(Object.values(migrated.catalog).filter(p=>p.category==='Inverter').length,86);
assert.equal(migrated.catalog['SUN2000-17KTL-M5(MBUS)'].powerKw,17);
assert.equal(migrated.catalog['SUN2000-17KTL-M5(MBUS)'].phase,'Three-phase');
const json=JSON.stringify(fixture);
await app.listeners.change({target:{id:'restore-file',dataset:{},files:[{name:'fixture.json',size:json.length,text:async()=>json}]}});
assert.equal(app.nodes.get('#modal').open,true);
await app.click({action:'dialog-confirm'});
assert.equal(app.nodes.get('#modal').open,false);
assert.match(app.nodes.get('#main').innerHTML,/<svg/);
await app.listeners.change({target:{dataset:{filter:'category'},value:'Battery module'}});
const saved=await modules['persistence.js'].loadState();
assert.equal(saved.preferences.category,'Battery module');
await app.click({action:'backup'});
const last=app.downloads.at(-1);assert.match(last.download,/Backup/);
const exported=JSON.parse(await app.blobs.get(last.href).text());assert.deepEqual(exported,JSON.parse(JSON.stringify(saved)));
const reloaded=await boot();assert.match(reloaded.nodes.get('#main').innerHTML,/<svg/);
assert.equal((await reloaded.ctx.__testModules['persistence.js'].loadState()).preferences.category,'Battery module');
await app.click({action:'import'});
await app.listeners.change({target:{id:'dataset',dataset:{},value:'batteries'}});
const csv='index,202501\nLUNA2000-5-E0,12\nTotal,12';
await app.listeners.change({target:{id:'import-file',dataset:{},files:[{name:'offline.csv',arrayBuffer:async()=>new TextEncoder().encode(csv).buffer}]}});
assert.match(app.nodes.get('#main').innerHTML,/offline.csv/);
const form={dataset:{form:'commit-import'},fields:{approved:'on'},querySelector(){return {disabled:false};}};
await app.listeners.submit({target:form,preventDefault(){}});
const imported=await modules['persistence.js'].loadState();
assert.equal(imported.records['2025-01|LUNA2000-5-E0'].quantity,12);
for(const name of ['Inverter_Import_Template.xlsx','Battery_BMS_Import_Template.xlsx']){
  const bytes=await fs.readFile(root+'/templates/'+name);
  const array=new Uint8Array(bytes).buffer;
  const book=await modules['parser.js'].readWorkbook(array,name,app.ctx.JSZip);
  const rows=await book.sheet('Activation matrix');assert.ok(rows.length>1);
}
const memory=await boot({getItem(){throw new Error('Browser blocks persistence');}});
assert.match(memory.nodes.get('#main').innerHTML,/Session-only workspace/);
await memory.click({action:'demo'});assert.match(memory.nodes.get('#main').innerHTML,/<svg/);
assert.deepEqual(app.errors,[]);assert.deepEqual(reloaded.errors,[]);assert.deepEqual(memory.errors,[]);
console.log(JSON.stringify({inlineScripts:scripts.length,moduleExportParity:Object.keys(modules).length,viewParity:6,simulatedAppChecks:['boot','demo','six areas','legacy-backup-migration','restore','filters','backup','reload','CSV import commit','two XLSX templates','blocked-storage session'],realBrowser:false}));
