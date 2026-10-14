import {clone,uid,cellValue,isBlank,monthValue,columnName,monthsBetween} from './model.js';

// Source-name snapshots survive account merges. Reimports replace a source/month,
// never the already consolidated account total. Equipment records stay separate.
export function emptyInstallers(){return {accounts:{},sources:{},imports:[],merges:[],coverage:{}};}
export function installerSourceKey(name){return 'name:'+String(name).trim().replace(/\s+/g,' ').toLocaleLowerCase('en-IE');}
export function installerMonth(value){
  const direct=monthValue(value);if(direct)return direct;
  const s=String(value??'').trim();
  const iso=/^(\d{4})-(\d{2})-\d{2}(?:T.*)?$/.exec(s);if(iso)return monthValue(iso[1]+iso[2]);
  const names=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const word=/^([a-z]+)[\s\-/]+(\d{4})$/i.exec(s);
  if(word){const i=names.indexOf(word[1].slice(0,3).toLowerCase());if(i>=0)return monthValue(word[2]+String(i+1).padStart(2,'0'));}
  // Excel 1900 date-system serials, used only in explicitly selected headers.
  if(typeof value==='number'&&Number.isInteger(value)&&value>=30000&&value<=80000)return new Date(Date.UTC(1899,11,30)+value*86400000).toISOString().slice(0,7);
  return null;
}
export function suggestInstallerHeader(rows){
  let index=0,count=0;rows.slice(0,40).forEach((row,i)=>{const n=row.filter(c=>installerMonth(cellValue(c))).length;if(n>count){count=n;index=i;}});
  return {index,count};
}
export function validateInstallerMatrix({rows,filename,sheet,headerRow=0,nameColumn=0}){
  const errors=[],warnings=[],months=[],columns=[],sources={},header=rows[headerRow]??[];
  if(!filename||!sheet)errors.push('Filename and worksheet are required.');
  const width=rows.slice(headerRow).reduce((max,row)=>Math.max(max,row.reduce((last,c,i)=>!isBlank(cellValue(c))||c?.f?i+1:last,0)),0);
  if(!Number.isInteger(nameColumn)||nameColumn<0||nameColumn>=width)errors.push('Select the installer-name column.');
  if(!Number.isInteger(headerRow)||headerRow<0||headerRow>=rows.length)errors.push('Select the header row.');
  let ignoredTotal=false;
  for(let c=0;c<width;c++){
    if(c===nameColumn)continue;
    const h=cellValue(header[c]);
    if(c===width-1&&/^(?:grand\s*)?total$/i.test(String(h??'').trim())){ignoredTotal=true;continue;}
    if(isBlank(h)&&rows.slice(headerRow+1).every(r=>isBlank(cellValue(r[c]))))continue;
    const month=installerMonth(h);
    if(!month){errors.push(`Unrecognised column ${columnName(c)}: ${h??'(blank)'}. Select the correct header/name columns.`);continue;}
    if(months.includes(month))errors.push(`Duplicate month: ${month}.`);
    months.push(month);columns.push({c,month});
  }
  if(!columns.length)errors.push('No monthly columns found.');
  let duplicates=0,blankZeros=0;
  for(let r=headerRow+1;r<rows.length;r++){
    const row=rows[r]??[];if(row.every(c=>isBlank(cellValue(c))))continue;
    const raw=cellValue(row[nameColumn]),label=String(raw??'').trim().replace(/\s+/g,' ');
    if(!label){if(columns.some(({c})=>!isBlank(cellValue(row[c]))))errors.push(`Missing installer name on row ${r+1}.`);continue;}
    if(/^(?:grand\s*)?total$/i.test(label)){warnings.push(`Ignored summary row ${r+1}.`);continue;}
    if(label.length>200){errors.push(`Installer name on row ${r+1} exceeds 200 characters.`);continue;}
    const key=installerSourceKey(label);
    if(Object.hasOwn(sources,key))duplicates++;else sources[key]={key,label,months:{}};
    for(const {c,month} of columns){
      const cell=row[c],value=cellValue(cell),ref=cell?.ref??`${columnName(c)}${r+1}`;
      if(cell?.type==='e'||cell?.f&&isBlank(value)){errors.push(`Excel error or formula without a saved result at ${ref}. Recalculate and save the file.`);continue;}
      const quantity=isBlank(value)?0:value;if(isBlank(value))blankZeros++;
      if(!Number.isSafeInteger(quantity)||quantity<0){errors.push(`Invalid activation count at ${ref}. Use a non-negative whole number.`);continue;}
      const old=sources[key].months[month]??{quantity:0,cells:[]};
      const sum=old.quantity+quantity;if(!Number.isSafeInteger(sum)){errors.push(`Activation total exceeds the safe numeric limit for ${label}, ${month}.`);continue;}
      sources[key].months[month]={quantity:sum,cells:[...old.cells,{cell:ref,label:String(raw),quantity,blank:isBlank(value)}]};
    }
  }
  if(!Object.keys(sources).length)errors.push('No installer rows found.');
  if(!ignoredTotal)warnings.push('No trailing Total column detected. Only monthly columns will be imported.');
  return {filename,sheet,months:[...new Set(months)].sort(),sources:Object.values(sources),errors:[...new Set(errors)],warnings,duplicates,blankZeros,ignoredTotal};
}
export function installerImportPreview(state,validation){
  const data=state.installers??emptyInstallers();
  return validation.sources.flatMap(s=>Object.entries(s.months).map(([month,r])=>{
    const old=data.sources[s.key],previous=old?.months[month]?.quantity??null;
    return {key:s.key,label:s.label,account:old?data.accounts[old.accountId].name:s.label,month,previous,quantity:r.quantity,action:previous===null?'New':previous===r.quantity?'Unchanged':'Replace'};
  }));
}
export function commitInstallerImport(state,validation,{scope='partial',fullScopeConfirmed=false}={}){
  if(validation.errors.length)throw new Error('Resolve import errors first.');
  if(!['partial','full'].includes(scope))throw new Error('Unknown installer reporting scope.');
  if(scope==='full'&&!fullScopeConfirmed)throw new Error('Explicitly confirm that all installers are covered before marking a full snapshot.');
  const next=clone(state);next.installers??=emptyInstallers();
  const d=next.installers,id=uid(),timestamp=new Date().toISOString(),changes=[],created=[],coverageChanges=[];
  d.coverage??={};
  for(const incoming of validation.sources){
    let source=d.sources[incoming.key];
    if(!source){const accountId=uid();d.accounts[accountId]={id:accountId,name:incoming.label,notes:''};source=d.sources[incoming.key]={key:incoming.key,label:incoming.label,accountId,months:{}};created.push(incoming.key);}
    for(const [month,r] of Object.entries(incoming.months)){
      const before=source.months[month]??null;
      // Preserve provenance on an exact repeated value/source-cell snapshot.
      const evidence={filename:validation.filename,sheet:validation.sheet,cells:clone(r.cells)};
      if(before?.quantity===r.quantity&&JSON.stringify(before.source)===JSON.stringify(evidence))continue;
      const after={quantity:r.quantity,source:evidence,importId:id};changes.push({key:incoming.key,month,before,after});source.months[month]=after;
    }
  }
  // A full snapshot is an explicit, per-month declaration about the complete
  // tracked installer population. Later partial corrections preserve it.
  if(scope==='full')for(const month of validation.months){
    const before=d.coverage[month]??null;
    const after={mode:'full',month,filename:validation.filename,sheet:validation.sheet,importId:id,timestamp};
    coverageChanges.push({month,before,after});d.coverage[month]=after;
  }
  // Check aggregate overflow too (different aliases may have been merged).
  for(const account of Object.values(d.accounts))installerMonthly(next,account.id);
  d.imports.push({id,timestamp,filename:validation.filename,sheet:validation.sheet,months:validation.months,scope,created,changes,coverageChanges,undone:false});
  next.updatedAt=timestamp;return next;
}
export function installerMonthly(state,accountId){
  const result={};
  for(const source of Object.values(state.installers?.sources??{}))if(source.accountId===accountId)for(const [month,r]of Object.entries(source.months)){
    const sum=(result[month]??0)+r.quantity;if(!Number.isSafeInteger(sum))throw new Error('Consolidated activation total exceeds the safe numeric limit.');result[month]=sum;
  }
  return result;
}
export function installerRows(state,start,end){
  const months=monthsBetween(start,end);
  return Object.values(state.installers?.accounts??{}).map(a=>{
    const monthly=installerMonthly(state,a.id),observed=months.filter(m=>Object.hasOwn(monthly,m));
    const total=observed.reduce((sum,m)=>sum+monthly[m],0);
    if(!Number.isSafeInteger(total))throw new Error('Selected total exceeds the safe numeric limit.');
    return {...a,monthly,total:observed.length?total:null,observed:observed.length,expected:months.length,aliases:Object.values(state.installers.sources).filter(s=>s.accountId===a.id).map(s=>s.label)};
  }).sort((a,b)=>(b.total??-1)-(a.total??-1)||a.name.localeCompare(b.name));
}
function similarityName(name){return name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\b(?:solar|limited|ltd)\b/g,'').replace(/[^a-z0-9]/g,'');}
export function installerSuggestions(state){
  const accounts=Object.values(state.installers?.accounts??{}),out=[];
  const labels=a=>[a.name,...Object.values(state.installers.sources).filter(s=>s.accountId===a.id).map(s=>s.label)].map(similarityName).filter(s=>s.length>=5);
  const indexed=accounts.map(a=>({account:a,labels:labels(a)}));
  for(let i=0;i<indexed.length;i++)for(let j=i+1;j<indexed.length;j++){
    if(indexed[i].labels.some(a=>indexed[j].labels.some(b=>a===b)))out.push({ids:[accounts[i].id,accounts[j].id],names:[accounts[i].name,accounts[j].name],reason:'Similar spelling after spaces, accents and common suffixes are removed'});
    if(out.length>=20)return out;
  }
  return out;
}
export function mergeInstallers(state,ids,name){
  ids=[...new Set(ids)];name=String(name??'').trim();
  if(ids.length<2||!name||name.length>200||ids.some(id=>!state.installers?.accounts[id]))throw new Error('Select at least two existing installers and a name (maximum 200 characters).');
  const next=clone(state),d=next.installers,target=ids[0],before=ids.map(id=>clone(d.accounts[id])),assignments={};
  for(const source of Object.values(d.sources))if(ids.includes(source.accountId)){assignments[source.key]=source.accountId;source.accountId=target;}
  d.accounts[target]={...d.accounts[target],name,notes:before.map(a=>a.notes).filter(Boolean).join('\n\n')};for(const id of ids.slice(1))delete d.accounts[id];
  installerMonthly(next,target);
  d.merges.push({id:uid(),timestamp:new Date().toISOString(),target,before,after:clone(d.accounts[target]),assignments,undone:false});next.updatedAt=new Date().toISOString();return next;
}
export function undoInstallerMerge(state,id){
  const next=clone(state),d=next.installers,h=d.merges.find(m=>m.id===id);
  if(!h||h.undone)throw new Error('This merge is not available to undo.');
  const assigned=Object.values(d.sources).filter(s=>s.accountId===h.target).map(s=>s.key).sort();
  if(JSON.stringify(d.accounts[h.target])!==JSON.stringify(h.after)||JSON.stringify(assigned)!==JSON.stringify(Object.keys(h.assignments).sort())||Object.entries(h.assignments).some(([key])=>d.sources[key]?.accountId!==h.target))throw new Error('Later changes overlap this merge. Undo later merges first.');
  for(const a of h.before)d.accounts[a.id]=a;
  for(const [key,accountId]of Object.entries(h.assignments))d.sources[key].accountId=accountId;
  h.undone=true;next.updatedAt=new Date().toISOString();return next;
}
export function undoInstallerImport(state,id){
  const next=clone(state),d=next.installers,h=d.imports.find(i=>i.id===id);
  if(!h||h.undone)throw new Error('This import is not available to undo.');
  if(h.changes.some(c=>JSON.stringify(d.sources[c.key]?.months[c.month]??null)!==JSON.stringify(c.after))||
    (h.coverageChanges??[]).some(c=>JSON.stringify(d.coverage?.[c.month]??null)!==JSON.stringify(c.after)))
      throw new Error('Later imports overlap these values or reporting scope. Undo later imports first.');
  for(const c of h.changes){if(c.before)d.sources[c.key].months[c.month]=c.before;else delete d.sources[c.key].months[c.month];}
  for(const c of h.coverageChanges??[]){if(c.before)d.coverage[c.month]=c.before;else delete d.coverage[c.month];}
  // Keep identities and aliases: later merges and notes may depend on them.
  h.undone=true;next.updatedAt=new Date().toISOString();return next;
}
export function validateInstallerState(d){
  const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
  const validId=x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(x)&&!['__proto__','constructor','prototype'].includes(x);
  const account=a=>object(a)&&validId(a.id)&&typeof a.name==='string'&&!!a.name.trim()&&a.name.length<=200&&typeof a.notes==='string';
  const record=r=>object(r)&&Number.isSafeInteger(r.quantity)&&r.quantity>=0&&typeof r.source?.filename==='string'&&!!r.source.filename&&typeof r.source?.sheet==='string'&&!!r.source.sheet&&Array.isArray(r.source.cells)&&r.source.cells.length>0&&r.source.cells.every(c=>typeof c.cell==='string'&&typeof c.label==='string'&&Number.isSafeInteger(c.quantity)&&c.quantity>=0)&&r.source.cells.reduce((sum,c)=>sum+c.quantity,0)===r.quantity;
  const validCoverage=(c,month)=>object(c)&&c.mode==='full'&&c.month===month&&monthValue(month)===month&&
    typeof c.filename==='string'&&!!c.filename&&typeof c.sheet==='string'&&!!c.sheet&&
    validId(c.importId)&&typeof c.timestamp==='string'&&!!c.timestamp;
  if(!object(d)||!object(d.accounts)||!object(d.sources)||!object(d.coverage)||!Array.isArray(d.imports)||!Array.isArray(d.merges))throw new Error('Invalid installer data.');
  for(const [month,c]of Object.entries(d.coverage))if(!validCoverage(c,month))throw new Error('Invalid installer reporting coverage.');
  for(const [id,a] of Object.entries(d.accounts))if(!account(a)||a.id!==id)throw new Error('Invalid installer account.');
  for(const [key,s]of Object.entries(d.sources)){
    if(!object(s)||s.key!==key||typeof s.label!=='string'||!s.label.trim()||key!==installerSourceKey(s.label)||!Object.hasOwn(d.accounts,s.accountId)||!object(s.months))throw new Error('Invalid installer source or account reference.');
    for(const [month,r]of Object.entries(s.months))if(!monthValue(month)||!record(r))throw new Error('Invalid installer monthly record.');
  }
  for(const h of d.imports)if(!object(h)||!validId(h.id)||!Array.isArray(h.changes)||!Array.isArray(h.created)||!Array.isArray(h.months)||h.months.some(m=>!monthValue(m))||
    (h.scope!==undefined&&!['partial','full'].includes(h.scope))||
    h.changes.some(c=>!object(c)||!Object.hasOwn(d.sources,c.key)||!monthValue(c.month)||!record(c.after)||(c.before!==null&&!record(c.before)))||
    !Array.isArray(h.coverageChanges??[])||
    (h.coverageChanges??[]).some(c=>!object(c)||!validCoverage(c.after,c.month)||(c.before!==null&&!validCoverage(c.before,c.month))||c.after.importId!==h.id||!h.months.includes(c.month)))
      throw new Error('Invalid installer import history.');
  for(const h of d.merges)if(!object(h)||!validId(h.id)||!Array.isArray(h.before)||h.before.length<2||!object(h.assignments)||!account(h.after)||h.after.id!==h.target||!h.before.some(a=>a.id===h.target)||h.before.some(a=>!account(a))||Object.entries(h.assignments).some(([key,id])=>!Object.hasOwn(d.sources,key)||!h.before.some(a=>a.id===id)))throw new Error('Invalid installer merge history.');
  for(const a of Object.values(d.accounts))installerMonthly({installers:d},a.id);
  return d;
}
