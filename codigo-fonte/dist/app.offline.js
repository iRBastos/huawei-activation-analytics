(async()=>{
'use strict';
const __modules=Object.create(null);

// MODULE: inverter-catalog.js
__modules["inverter-catalog.js"]=(()=>{
// Curated inverter model names supplied for Huawei Activation Analytics.
// powerKw is the rating encoded in the model identifier, not a verified grid export limit.
// Never infer power from an unlisted/unrecognised string or silently merge variants.
const INVERTER_MODELS = Object.freeze(`SUN2000-4.6KTL-L1
SUN2000-5KTL-L1
SUN2000-4KTL-L1
SUN2000-3KTL-L1
SUN2000-8KTL-M1
SUN2000-5KTL-M1
SUN2000-6KTL-M1
SUN2000-4.6K-LB0
SUN2000-5K-LB0
SUN2000-2KTL-L1
SUN2000-10KTL-BEM1
SUN2000-3.68KTL-L1
SUN2000-4KTL-M1
SUN2000-10KTL-M1
SUN2000-3K-LB0
SUN2000-3KTL-M1
SUN2000-4K-LB0
SUN2000-25K-MB0
SUN2000-12K-MB0
SUN2000-5K-MAP0
SUN2000-20K-MB0
SUN2000-15K-MB0
SUN2000-10K-MAP0-BE
SUN2000-8K-MAP0
SUN2000-3.68K-LB0
SUN2000-6K-MAP0
SUN2000-10K-MAP0
SUN2000-12K-MAP0
SUN2000-17K-MB0
SUN2000-12KTL-M5
SUN2000-20KTL-M5
SUN2000-15KTL-M5
SUN2000-6KTL-L1
SUN2000-25KTL-M5
SUN2000-17KTL-M5
SUN2000-10K-LC0
SUN2000-20KTL
SUN2000-6K-LB0
SUN2000-8K-LC0
SUN2000-20KTL-M2
SUN2000-17KTL-M2
SUN2000-12KTL-M2
SUN2000-17KTL
SUN2000-15KTL-M2
SUN2000L-4.6KTL
SUN2000-6KTL-M0
SUN2000-12KTL
SUN2000L-3KTL
SUN2000-20KTL-M0
SUN2000-6KTL-M1-EU(MBUS)
SUN2000L-4KTL
SUN2000L-2KTL
SUN2000-12KTL-M0
SUN2000-5KTL-M1-EU(MBUS)
SUN2000-8KTL-M1-EU(MBUS)
SUN2000-17KTL-M0
SUN2000-8KTL
SUN2000-3.68KTL
SUN2000-8KTL-M0
SUN2000-2KTL
SUN2000L-5KTL
SUN2000-3KTL-M0
SUN2000-15KTL-M0
SUN5000-12K-MAP0
SUN2000L-3.68KTL
SUN2000-8KTL-M0-EU
SUN2000-10KTL-M1-EU(MBUS)
SUN2000-4KTL-M1-EU(MBUS)
SUN2000-5KTL-L0
SUN2000-3KTL-L0
SUN2000-3KTL-M1-EU(MBUS)
SUN2000-12KTL-M0-EU
SUN2000-6KTL-M0-EU
SUN2000-4KTL-L0
SUN2000-10KTL-M0
SUN2000-12KTL-M2-EU(MBUS)
SUN2000-15KTL-M2-EU(MBUS)
SUN2000-10KTL
SUN2000-10KTL-M1(MBUS)
SUN2000-15KTL-M5(MBUS)
SUN2000-17KTL-M2-EU(MBUS)
SUN2000-20KTL-M2-EU(MBUS)
SUN2000-12KTL-M5(MBUS)
SUN2000-17KTL-M5(MBUS)
SUN5000-25K-MB0
SUN5000-8K-MAP0`.trim().split('\n'));
const POWER_PATTERN = /^(?:SUN2000L?-|SUN5000-)(\d+(?:\.\d+)?)K(?:TL)?(?:-|$)/;
const INVERTER_POWER_KW = Object.freeze(Object.fromEntries(INVERTER_MODELS.map(model => {
  const match = POWER_PATTERN.exec(model);
  if (!match) throw new Error(`Unknown inverter naming structure: ${model}`);
  return [model, Number(match[1])];
})));
function inverterPowerKw(model) {
  return INVERTER_POWER_KW[String(model ?? '').trim().toUpperCase()] ?? null;
}

// Electrical grid connection inferred from the Huawei product series.
// These are product AC phases, not the phase count of backup outputs.
const SINGLE_PHASE_FAMILIES = new Set(['L0','L1','LB0','LC0']);
const THREE_PHASE_FAMILIES = new Set(['M0','M1','M2','M5','MB0','MAP0','BEM1']);
function inverterPhase(model) {
  const name=String(model??'').trim().toUpperCase();
  if (!Object.hasOwn(INVERTER_POWER_KW,name)) return null;
  if (name.startsWith('SUN2000L-')) return 'Single-phase';
  const family=name.match(/-(L0|L1|LB0|LC0|M0|M1|M2|M5|MB0|MAP0|BEM1)(?:-|\(|$)/)?.[1];
  if (SINGLE_PHASE_FAMILIES.has(family)) return 'Single-phase';
  if (THREE_PHASE_FAMILIES.has(family)) return 'Three-phase';
  // Legacy un-suffixed SUN2000 models: 2/3/3.68 kW are single phase;
  // 8/10/12/17/20 kW belong to the three-phase commercial generation.
  if (/^SUN2000-(2|3\.68)KTL$/.test(name)) return 'Single-phase';
  if (/^SUN2000-(8|10|12|17|20)KTL$/.test(name)) return 'Three-phase';
  return null;
}

function defaultInverterCatalog() {
  return Object.fromEntries(INVERTER_MODELS.map(model => [model, {
    model, category: 'Inverter', family: model.match(/-(L1|L0|LB0|LC0|M0|M1|M2|M5|MB0|MAP0|BEM1)(?:-|\(|$)/)?.[1] ?? '',
    capacity: null, bms: null, from: null, to: null, powerKw: INVERTER_POWER_KW[model], phase: inverterPhase(model)
  }]));
}
// Add missing standard inverter definitions without replacing customer-edited metadata.
function mergeInverterCatalog(catalog) {
  const defaults = defaultInverterCatalog(), next = {...catalog};
  let changed = false;
  for (const [model, definition] of Object.entries(defaults)) {
    if (!next[model]) { next[model] = definition; changed = true; }
    else if (next[model].category === 'Inverter' && (next[model].powerKw == null || next[model].phase == null)) {
      // Only backfill absent metadata. Never overwrite customer-edited values.
      next[model] = {...next[model], powerKw: next[model].powerKw ?? definition.powerKw, phase: next[model].phase ?? definition.phase}; changed = true;
    }
  }
  return changed ? next : catalog;
}

return Object.assign({},{INVERTER_MODELS,INVERTER_POWER_KW,inverterPowerKw,inverterPhase,defaultInverterCatalog,mergeInverterCatalog});
})();

// MODULE: model.js
__modules["model.js"]=(()=>{
const {defaultInverterCatalog}=__modules["inverter-catalog.js"];
// Catalogue, canonical keys, calendar utilities and record scope.

const CATEGORIES = ['Inverter', 'Battery module', 'BMS'];
const INITIAL_CATALOG = {
  ...defaultInverterCatalog(),
  'LUNA2000-5-E0': {model:'LUNA2000-5-E0',category:'Battery module',family:'S0',capacity:5,bms:'LUNA2000-5KW-C0',from:null,to:null},
  'LUNA2000-5-E1': {model:'LUNA2000-5-E1',category:'Battery module',family:'S1',capacity:5,bms:'LUNA2000-10KW-C1',from:null,to:null},
  'LUNA2000-7-E1': {model:'LUNA2000-7-E1',category:'Battery module',family:'S1',capacity:7,bms:'LUNA2000-10KW-C1',from:null,to:null},
  'LUNA2000-5KW-C0': {model:'LUNA2000-5KW-C0',category:'BMS',family:'S0',capacity:null,bms:null,from:null,to:null},
  'LUNA2000-10KW-C1': {model:'LUNA2000-10KW-C1',category:'BMS',family:'S1',capacity:null,bms:null,from:null,to:null}
};
const clone = x => structuredClone(x);
const canonical = x => String(x ?? '').trim().toUpperCase();
const keyOf = (month,model) => `${month}|${canonical(model)}`;
const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
function monthValue(value) {
  const s=String(value??'').trim();
  const m=/^(\d{4})-?(\d{2})$/.exec(s);
  return m && +m[1]>=1900 && +m[1]<=9999 && +m[2]>=1 && +m[2]<=12 ? `${m[1]}-${m[2]}` : null;
}
function shiftMonth(m,n) {
  if(!monthValue(m)) throw new Error('Invalid calendar month.');
  const [y,k]=m.split('-').map(Number), d=new Date(Date.UTC(y,k-1+n,1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`;
}
function monthsBetween(start,end) {
  if(!monthValue(start)||!monthValue(end)||start>end) return [];
  const n=(+end.slice(0,4)-+start.slice(0,4))*12+(+end.slice(5)-+start.slice(5))+1;
  if(n>1200) throw new Error('Select at most 100 years per report.');
  return Array.from({length:n},(_,i)=>shiftMonth(start,i));
}
function currentDublinMonth(now=new Date()) {
  const parts=new Intl.DateTimeFormat('en-IE',{timeZone:'Europe/Dublin',year:'numeric',month:'2-digit'}).formatToParts(now);
  return `${parts.find(p=>p.type==='year').value}-${parts.find(p=>p.type==='month').value}`;
}
const closedMonth=(now=new Date())=>shiftMonth(currentDublinMonth(now),-1);
const applicable=(p,m)=>(!p.from||m>=p.from)&&(!p.to||m<=p.to);
const totalLabel=x=>/^(total|grand\s*total|sum|总计|合计)$/i.test(String(x??'').replace(/[=＊*：:]/g,'').trim());
const isBlank=x=>x===null||x===undefined||typeof x==='string'&&x.trim()==='';
const cellValue=c=>c && typeof c==='object' && ('v' in c || 'type' in c || 'f' in c) ? c.v : c;
function columnName(i) {let s=''; for(i++;i;i=Math.floor((i-1)/26))s=String.fromCharCode(65+(i-1)%26)+s;return s;}
function freshState() {
  const end=closedMonth();
  return {schemaVersion:2,installers:{accounts:{},sources:{},imports:[],merges:[],coverage:{}},records:{},catalog:clone(INITIAL_CATALOG),coverage:{},targets:{},events:[],history:[],catalogLog:[],coverageLog:[],preferences:{start:shiftMonth(end,-5),end,aggregation:'month',category:'All',model:'All',family:'All',comparison:'year',compareStart:shiftMonth(end,-17),compareEnd:shiftMonth(end,-12)},updatedAt:null};
}
function suggestHeader(rows) {
  let index=0,score=0,ties=0;
  rows.slice(0,40).forEach((r,i)=>{const n=r.slice(1).filter(c=>monthValue(cellValue(c))).length;if(n>score){score=n;index=i;ties=1;}else if(n&&n===score)ties++;});
  return {index,score,uncertain:!score||ties>1};
}
function selectModels(state,{category='All',model='All',family='All'}={}) {return Object.values(state.catalog).filter(p=>(category==='All'||p.category===category)&&(model==='All'||p.model===model)&&(family==='All'||p.family===family));}

return Object.assign({},{CATEGORIES,INITIAL_CATALOG,clone,canonical,keyOf,uid,monthValue,shiftMonth,monthsBetween,currentDublinMonth,closedMonth,applicable,totalLabel,isBlank,cellValue,columnName,freshState,suggestHeader,selectModels});
})();

// MODULE: validation.js
__modules["validation.js"]=(()=>{
const {CATEGORIES,canonical,totalLabel,monthValue,isBlank,cellValue,columnName,keyOf,applicable}=__modules["model.js"];
// Unified imports share the exact same model catalogue and numeric validation as legacy datasets.
const IMPORT_DATASETS = ['unified','inverters','batteries'];
function datasetAcceptsCategory(dataset,category) {
  if(!IMPORT_DATASETS.includes(dataset)||!CATEGORIES.includes(category))return false;
  return dataset==='unified'||dataset==='inverters'&&category==='Inverter'||dataset==='batteries'&&category!=='Inverter';
}

function validateProduct(p,catalog={}) {
  const errors=[];
  if(!canonical(p.model)||totalLabel(p.model)||p.model.includes('|'))errors.push('Use a non-empty model code without |.');
  if(!CATEGORIES.includes(p.category))errors.push('Choose a product category.');
  if(p.category==='Battery module'&&(!Number.isFinite(p.capacity)||p.capacity<=0))errors.push('Battery capacity must be a positive number in kWh.');
  if(p.category!=='Battery module'&&p.capacity!==null)errors.push('Only battery modules have capacity.');
  if(p.category==='Inverter'&&p.powerKw!=null&&(!Number.isFinite(p.powerKw)||p.powerKw<=0))errors.push('Inverter rated power must be a positive kW value.');
  if(p.category==='Inverter'&&p.phase!=null&&!['Single-phase','Three-phase'].includes(p.phase))errors.push('Inverter grid phase must be Single-phase or Three-phase.');
  if(p.category!=='Inverter'&&(p.powerKw!=null||p.phase!=null))errors.push('Inverter power and phase apply only to inverter models.');
  if(p.bms && (!catalog[p.bms] || catalog[p.bms].category!=='BMS'))errors.push('Compatible BMS must be a classified BMS model.');
  if(p.from&&!monthValue(p.from)||p.to&&!monthValue(p.to)||p.from&&p.to&&p.from>p.to)errors.push('Check the applicability dates.');
  return errors;
}
function validateMatrix({rows,filename,sheet,headerRow=0,dataset,catalog}) {
  const errors=[],warnings=[],records=[],unknown=new Set(),models=new Set(),months=[],totals=[];
  if(!IMPORT_DATASETS.includes(dataset))errors.push('Choose a supported dataset: Unified, Inverters, or Battery modules & BMS.');
  const header=rows[headerRow]??[];
  const width=Math.max(header.length,...rows.slice(headerRow).map(r=>r.length));
  const populatedCols=Array.from({length:width},(_,i)=>i).filter(i=>i>0 && rows.slice(headerRow).some(r=>!isBlank(cellValue(r[i]))));
  const cols=[];
  for(const c of populatedCols){const m=monthValue(cellValue(header[c]));if(!m){errors.push(`Invalid month header at ${columnName(c)}${headerRow+1}: ${String(cellValue(header[c])??'(blank)')}. Use YYYYMM.`);continue;}if(months.includes(m))errors.push(`Duplicate month header: ${m}.`);months.push(m);cols.push({c,m});}
  if(!cols.length)errors.push('No valid YYYYMM month columns found. Confirm the header row.');
  const seen=new Set();
  for(let r=headerRow+1;r<rows.length;r++) {
    const row=rows[r]??[];
    if(row.every(c=>isBlank(cellValue(c))))continue;
    const originalLabel=String(cellValue(row[0])??''),label=originalLabel.trim();
    if(!label){errors.push(`Missing product model at A${r+1}.`);continue;}
    if(totalLabel(label)){totals.push({row:r,label});continue;}
    const model=canonical(label); models.add(model);
    if(model.includes('|'))errors.push(`Unsupported | in model ${label}.`);
    const p=catalog[model];
    if(!p)unknown.add(model);
    else if(!datasetAcceptsCategory(dataset,p.category))errors.push(`${model} (${p.category}) does not belong to the selected ${dataset} dataset (it belongs to the other dataset). Choose Unified to import all categories together.`);
    for(const {c,m} of cols){
      const cell=row[c],v=cellValue(cell),ref=cell?.ref??`${columnName(c)}${r+1}`,key=keyOf(m,model);
      if(seen.has(key))errors.push(`Duplicate model/month: ${model}, ${m} (${ref}).`);seen.add(key);
      const record={key,month:m,model,quantity:null,source:{filename,sheet,cell:ref,originalLabel,formula:cell?.f??null}};
      if(cell?.type==='e'){errors.push(`Excel error at ${ref}. Correct the workbook and save it again.`);continue;}
      if(cell?.f&&isBlank(v)){errors.push(`Formula at ${ref} has no saved numeric result. Recalculate and save the workbook in Excel.`);continue;}
      if(isBlank(v)){warnings.push(`Missing: ${model}, ${m} (${ref}). Existing values will be retained.`);records.push(record);continue;}
      if(typeof v!=='number'||!Number.isSafeInteger(v)||v<0){errors.push(`Invalid quantity at ${ref}: ${String(v)}. Use a numeric, non-negative whole number.`);continue;}
      record.quantity=v;records.push(record);
      if(p&&!applicable(p,m)&&v!==0)errors.push(`${model} has ${v} activations in ${m}, outside its declared applicability period.`);
    }
  }
  if(!models.size)errors.push('No product rows found.');
  if(dataset==='unified'&&totals.length>1)errors.push('Unified imports support at most one grand total row covering all categories; remove per-category total rows.');
  for(const total of totals)for(const {c,m} of cols){
    const cell=rows[total.row]?.[c],v=cellValue(cell),ref=cell?.ref??`${columnName(c)}${total.row+1}`;
    if(cell?.type==='e'||cell?.f&&isBlank(v)){errors.push(`Total ${ref} has an error or uncached formula. Recalculate and save in Excel.`);continue;}
    if(isBlank(v)){warnings.push(`Supplied total missing for ${m} (${ref}).`);continue;}
    if(typeof v!=='number'||!Number.isSafeInteger(v)||v<0){errors.push(`Invalid total at ${ref}.`);continue;}
    const rs=records.filter(x=>x.month===m),sum=rs.reduce((a,x)=>a+(x.quantity??0),0);
    if(rs.some(x=>x.quantity===null)||rs.length!==models.size){warnings.push(`Cannot fully reconcile ${m}: at least one product value is missing or invalid. Recorded subtotal ${sum}; supplied total ${v}.`);}
    else if(sum!==v)errors.push(`Total mismatch for ${m}: products sum to ${sum}; supplied total ${v} (${ref}).`);
  }
  if(!totals.length)warnings.push('No supplied total row. Arithmetic reconciliation is unavailable.');
  return {filename,sheet,dataset,headerRow,records,models:[...models],months:[...new Set(months)].sort(),unknown:[...unknown],errors:[...new Set(errors)],warnings,totalsFound:totals.length};
}

return Object.assign({},{IMPORT_DATASETS,datasetAcceptsCategory,validateProduct,validateMatrix});
})();

// MODULE: imports.js
__modules["imports.js"]=(()=>{
const {CATEGORIES,clone,uid,canonical,monthsBetween,applicable}=__modules["model.js"];
const {validateProduct,IMPORT_DATASETS,datasetAcceptsCategory}=__modules["validation.js"];
function importPreview(state,validation) {
  return validation.records.map(r=>{const previous=state.records[r.key];let action=r.quantity===null?'Missing — retain existing':!previous||previous.quantity===null?'New':previous.quantity===r.quantity?'Unchanged':'Replace';return {...r,previous:previous?.quantity??null,difference:r.quantity!==null&&previous?.quantity!==null&&previous?.quantity!==undefined?r.quantity-previous.quantity:null,action};});
}
function commitImport(state,validation,{classifications={},confirmedCategories=[]}={}) {
  if(!IMPORT_DATASETS.includes(validation.dataset)||validation.errors.length||validation.unknown.some(m=>!classifications[m]&&!state.catalog[m]))throw new Error('Resolve validation errors and classify every model before importing.');
  if(confirmedCategories.some(c=>!CATEGORIES.includes(c)))throw new Error('Invalid reporting coverage category.');
  const next=clone(state),id=uid(),timestamp=new Date().toISOString(),changes=[],coverageChanges=[],catalogChanges=[];
  for(const [model,p]of Object.entries(classifications))if(!next.catalog[model]){const errs=validateProduct(p,{...next.catalog,...classifications});if(errs.length)throw new Error(errs.join(' '));next.catalog[model]=clone(p);catalogChanges.push({model,before:null,after:clone(p)});}
  for(const r of validation.records){
    const p=next.catalog[r.model];if(!p)throw new Error(`Unclassified model: ${r.model}.`);
    if(!datasetAcceptsCategory(validation.dataset,p.category))throw new Error(`Dataset category conflict for ${r.model}.`);
    if(r.quantity===null)continue;
    if(!Number.isSafeInteger(r.quantity)||r.quantity<0)throw new Error('Invalid quantity.');
    const old=next.records[r.key];if(old?.quantity===r.quantity)continue;
    const after={...clone(r),importId:id,updatedAt:timestamp};delete after.key;
    changes.push({key:r.key,before:old??null,after});next.records[r.key]=after;
  }
  for(const category of confirmedCategories){
    const expected=validation.models.filter(m=>next.catalog[m]?.category===category);
    if(!expected.length)continue;
    for(const month of validation.months){const k=`${month}|${category}`,before=next.coverage[k]??null;
      // Preserve previously declared expected models; narrowing needs the coverage editor.
      const after={month,category,expected:[...new Set([...(before?.expected??[]),...expected])].sort(),confirmed:true,updatedBy:id};
      if(before?.confirmed&&JSON.stringify([...before.expected].sort())===JSON.stringify(after.expected))continue;
      coverageChanges.push({key:k,before,after});next.coverage[k]=after;
    }
  }
  next.history.push({id,timestamp,filename:validation.filename,sheet:validation.sheet,dataset:validation.dataset,months:validation.months,changes,coverageChanges,catalogChanges,missing:validation.records.filter(r=>r.quantity===null).map(r=>({month:r.month,model:r.model,source:r.source})),warnings:validation.warnings,recordCount:validation.records.length,unchanged:validation.records.filter(r=>r.quantity!==null&&state.records[r.key]?.quantity===r.quantity).length,undone:false});
  next.updatedAt=timestamp;return next;
}
function undoConflicts(state,id) {
  const h=state.history.find(x=>x.id===id);if(!h||h.undone)throw new Error('This import cannot be undone.');
  const conflicts=[];
  for(const c of h.changes)if(JSON.stringify(state.records[c.key]??null)!==JSON.stringify(c.after))conflicts.push({type:'record',key:c.key});
  for(const c of h.coverageChanges??[])if(JSON.stringify(state.coverage[c.key]??null)!==JSON.stringify(c.after))conflicts.push({type:'coverage',key:c.key});
  for(const c of h.catalogChanges??[])if(JSON.stringify(state.catalog[c.model]??null)!==JSON.stringify(c.after))conflicts.push({type:'catalogue',key:c.model});
  return conflicts;
}
function undoImport(state,id,skipConflicts=false) {
  const conflicts=undoConflicts(state,id);if(conflicts.length&&!skipConflicts)throw new Error(`${conflicts.length} later changes overlap this import. Review conflicts before undoing.`);
  const next=clone(state),h=next.history.find(x=>x.id===id),blocked=(type,key)=>conflicts.some(x=>x.type===type&&x.key===key);
  for(const c of h.changes)if(!blocked('record',c.key)){if(c.before)next.records[c.key]=c.before;else delete next.records[c.key];}
  for(const c of h.coverageChanges??[])if(!blocked('coverage',c.key)){if(c.before)next.coverage[c.key]=c.before;else delete next.coverage[c.key];}
  for(const c of h.catalogChanges??[])if(!blocked('catalogue',c.model)&&!Object.values(next.records).some(r=>r.model===c.model)&&!Object.values(next.coverage).some(v=>v.expected.includes(c.model))&&!Object.values(next.targets).some(t=>t.scope===c.model)&&!Object.values(next.catalog).some(p=>p.bms===c.model))delete next.catalog[c.model];
  h.undone=true;h.undoAt=new Date().toISOString();h.skippedConflicts=conflicts;next.updatedAt=h.undoAt;return next;
}
function setCoverage(state,{category,start,end,expected,confirmed}) {
  if(!CATEGORIES.includes(category)||!monthsBetween(start,end).length||!expected.length)throw new Error('Choose a category, valid dates and the expected models.');
  if(expected.some(m=>state.catalog[m]?.category!==category))throw new Error('Expected models must belong to the chosen category.');
  const next=clone(state),id=uid(),changes=[];
  for(const month of monthsBetween(start,end)){const key=`${month}|${category}`,after={month,category,expected:[...new Set(expected)].sort(),confirmed:!!confirmed,updatedBy:id};changes.push({key,before:next.coverage[key]??null,after});next.coverage[key]=after;}
  next.coverageLog.push({id,timestamp:new Date().toISOString(),changes});next.updatedAt=new Date().toISOString();return next;
}
function productImpact(state,product) {
  const p={...product,model:canonical(product.model)},errs=validateProduct(p,{...state.catalog,[p.model]:p});if(errs.length)throw new Error(errs.join(' '));
  const rs=Object.values(state.records).filter(r=>r.model===p.model),old=state.catalog[p.model];
  if(rs.length&&old?.category!==p.category)throw new Error('Category changes for recorded models are blocked. Undo the source imports before reclassifying.');
  if(rs.some(r=>r.quantity>0&&!applicable(p,r.month)))throw new Error('The proposed applicability period excludes recorded non-zero quantities.');
  const units=rs.reduce((a,r)=>a+r.quantity,0);
  return {product:p,records:rs.length,units,oldKwh:units*(old?.capacity??0),newKwh:units*(p.capacity??0)};
}
function updateProduct(state,product) {const impact=productImpact(state,product),next=clone(state);next.catalogLog.push({id:uid(),timestamp:new Date().toISOString(),before:next.catalog[impact.product.model]??null,after:impact.product,impact});next.catalog[impact.product.model]=impact.product;next.updatedAt=new Date().toISOString();return next;}

return Object.assign({},{importPreview,commitImport,undoConflicts,undoImport,setCoverage,productImpact,updateProduct});
})();

// MODULE: calculations.js
__modules["calculations.js"]=(()=>{
const {CATEGORIES,monthsBetween,selectModels,closedMonth,keyOf,applicable,shiftMonth}=__modules["model.js"];
function metric(state,start,end,category,{model='All',family='All',capacity=false,now=new Date()}={}) {
  const months=monthsBetween(start,end),products=selectModels(state,{category,model,family}),lastClosed=closedMonth(now);
  let value=0,observed=0,expected=0,missing=0,unconfirmed=0,outsideScope=0,notApplicable=0;
  for(const month of months){
    const cover=state.coverage[`${month}|${category}`];
    if(!cover?.confirmed)unconfirmed++;
    let scope=cover?.expected??products.map(p=>p.model);
    scope=scope.filter(m=>products.some(p=>p.model===m));
    if(model!=='All'&&!scope.includes(model)&&products.some(p=>p.model===model&&applicable(p,month)))outsideScope++;
    for(const m of scope){const p=state.catalog[m];if(!p||p.category!==category){missing++;continue;}if(!applicable(p,month)){notApplicable++;continue;}expected++;const r=state.records[keyOf(month,m)];if(!r||r.quantity===null){missing++;continue;}if(capacity&&(!p.capacity||p.category!=='Battery module')){missing++;continue;}}
    // Count every observed product in the selected scope. Undeclared rows invalidate completeness.
    for(const p of products){if(!applicable(p,month))continue;const r=state.records[keyOf(month,p.model)];if(!r||r.quantity===null)continue;if(capacity&&!p.capacity)continue;observed++;value+=r.quantity*(capacity?p.capacity:1);if(cover?.confirmed&&!cover.expected.includes(p.model))outsideScope++;}
  }
  const closed=months.length>0&&end<=lastClosed;
  const hasScope=months.length>0&&months.every(m=>{const c=state.coverage[`${m}|${category}`];return c?.expected.some(k=>products.some(p=>p.model===k));});
  const allNotApplicable=expected===0&&observed===0&&notApplicable>0;
  const complete=closed&&hasScope&&!missing&&!unconfirmed&&!outsideScope&&!allNotApplicable;
  const status=!months.length?'Invalid period':!products.length?'Outside selected scope':allNotApplicable?'Not applicable':!closed?'Partial — open month':unconfirmed?'Coverage unconfirmed':missing?'Partial — missing values':outsideScope?'Scope needs review':complete?'Complete':'No reporting scope';
  return {value:observed?value:complete?0:null,complete,status,observed,expected,missing,unconfirmed,outsideScope,notApplicable,months:months.length,category,unit:capacity?'kWh':'activations'};
}
function difference(current,previous) {
  if(!current?.complete||!previous?.complete||current.value===null||previous.value===null)return {delta:null,pct:null,label:'Complete comparable data required'};
  const delta=current.value-previous.value;return {delta,pct:previous.value===0?null:(current.value/previous.value-1)*100,label:previous.value===0?'No percentage baseline':''};
}
function ratio(numerator,denominator,multiplier=1) {
  const complete=!!numerator.complete&&!!denominator.complete;
  return {value:complete&&denominator.value>0&&numerator.value!==null?numerator.value/denominator.value*multiplier:null,complete,status:!complete?'Complete coverage required':denominator.value===0?'Not calculable — zero denominator':'Complete',numerator:numerator.value,denominator:denominator.value};
}
function comparisonPeriod(f) {
  if(f.comparison==='custom')return {start:f.compareStart,end:f.compareEnd};
  if(f.comparison==='previous'){const length=monthsBetween(f.start,f.end).length;return {start:shiftMonth(f.start,-length),end:shiftMonth(f.start,-1)};}
  return {start:shiftMonth(f.start,-12),end:shiftMonth(f.end,-12)};
}
function overview(state,f) {
  const opts={model:f.model,family:f.family};
  const get=(category,capacity=false)=>f.category!=='All'&&f.category!==category?{value:null,complete:false,status:'Outside selected scope'}:metric(state,f.start,f.end,category,{...opts,capacity});
  const inverter=get('Inverter'),bms=get('BMS'),battery=get('Battery module'),capacity=get('Battery module',true);
  const overall=f.model==='All'&&f.category==='All'&&f.family==='All';
  const blocked={value:null,complete:false,status:'Requires all models, categories and families'};
  return {inverter,bms,battery,capacity,attachment:overall?ratio(bms,inverter,100):blocked,kwhPerBms:overall?ratio(capacity,bms):blocked};
}
function latestComplete(state,categories=CATEGORIES) {
  const months=[...new Set(Object.values(state.coverage).map(c=>c.month))].sort().reverse();
  return months.find(m=>categories.every(c=>metric(state,m,m,c).complete))??null;
}
function aggregationKey(m,aggregation) {const y=m.slice(0,4),n=+m.slice(5);return aggregation==='quarter'?`${y} Q${Math.ceil(n/3)}`:aggregation==='half'?`${y} H${Math.ceil(n/6)}`:aggregation==='year'?y:m;}
function trend(state,f,category,capacity=false,model=f.model) {
  const groups=new Map();for(const m of monthsBetween(f.start,f.end)){const key=aggregationKey(m,f.aggregation);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(m);}
  return [...groups].map(([label,ms])=>({label,start:ms[0],end:ms.at(-1),...metric(state,ms[0],ms.at(-1),category,{model,family:f.family,capacity})}));
}
function movingAverage(state,month,category,opts={},width=3) {const m=metric(state,shiftMonth(month,1-width),month,category,opts);return {...m,value:m.complete?m.value/width:null};}
function ranking(state,f,category) {
  const comp=comparisonPeriod(f);
  const products=selectModels(state,{category,model:f.model,family:f.family});
  const total=metric(state,f.start,f.end,category,{model:f.model,family:f.family});
  return products.map(p=>{const current=metric(state,f.start,f.end,category,{model:p.model,family:f.family}),previous=metric(state,comp.start,comp.end,category,{model:p.model,family:f.family});return {model:p.model,family:p.family,current,previous,...difference(current,previous),share:total.complete&&current.complete&&total.value>0?current.value/total.value*100:null};}).sort((a,b)=>(b.current.value??-1)-(a.current.value??-1));
}
function familyRatios(state,f,family) {
  const opts={family},b=metric(state,f.start,f.end,'Battery module',opts),c=metric(state,f.start,f.end,'Battery module',{...opts,capacity:true}),bmsModel=family==='S0'?'LUNA2000-5KW-C0':'LUNA2000-10KW-C1',bms=metric(state,f.start,f.end,'BMS',{model:bmsModel});
  const products=selectModels(state,{category:'Battery module',family});
  const sumCompatible=capacity=>{const unknown=products.some(p=>!p.bms&&Object.values(state.records).some(r=>r.model===p.model&&r.month>=f.start&&r.month<=f.end));const items=products.filter(p=>p.bms===bmsModel).map(p=>metric(state,f.start,f.end,'Battery module',{model:p.model,capacity})).filter(m=>m.status!=='Not applicable');return {value:items.some(m=>m.value!==null)?items.reduce((s,m)=>s+(m.value??0),0):null,complete:!unknown&&items.length>0&&items.every(m=>m.complete),status:unknown?'Module compatibility requires classification':items.length?'Complete compatible module scope':'No compatible module scope'};};
  const compatibleModules=sumCompatible(false),compatibleCapacity=sumCompatible(true);
  return {battery:b,capacity:c,bms,modulesPerBms:ratio(compatibleModules,bms),kwhPerBms:ratio(compatibleCapacity,bms)};
}
function findings(state,f) {
  const comp=comparisonPeriod(f),out=[];
  if(monthsBetween(f.start,f.end).length!==monthsBetween(comp.start,comp.end).length)return [{title:'Different interval lengths',text:'Use monthly averages alongside totals. Contribution findings are withheld for unequal durations.'}];
  for(const category of CATEGORIES.filter(c=>f.category==='All'||c===f.category)){
    const ranks=ranking(state,f,category).filter(r=>r.delta!==null),total=metric(state,f.start,f.end,category,{model:f.model,family:f.family}),previous=metric(state,comp.start,comp.end,category,{model:f.model,family:f.family}),d=difference(total,previous);
    if(d.delta===null||d.delta===0||!ranks.length)continue;
    const main=[...ranks].sort((a,b)=>d.delta<0?a.delta-b.delta:b.delta-a.delta)[0];
    if(Math.abs(main.delta)<5)continue;
    out.push({title:`${main.model} contributes most to ${category.toLowerCase()} ${d.delta<0?'decline':'growth'}`,text:`${main.previous.value.toLocaleString('en-IE')} → ${main.current.value.toLocaleString('en-IE')} activations (${main.delta>0?'+':''}${main.delta}). Category change: ${d.delta>0?'+':''}${d.delta}. ${f.start}–${f.end} versus ${comp.start}–${comp.end}.`});
  }
  if(f.model==='All'&&f.family==='All'&&(f.category==='All'||f.category==='Battery module')){
    const all=metric(state,f.start,f.end,'Battery module'),a=metric(state,f.start,f.end,'Battery module',{family:'S1'}),old=metric(state,comp.start,comp.end,'Battery module'),b=metric(state,comp.start,comp.end,'Battery module',{family:'S1'});
    if([all,a,old,b].every(x=>x.complete)&&all.value>0&&old.value>0){const pp=(a.value/all.value-b.value/old.value)*100;if(Math.abs(pp)>=3)out.push({title:`S1 module share ${pp>0?'increased':'decreased'} ${Math.abs(pp).toFixed(1)} percentage points`,text:`${b.value}/${old.value} modules (${(b.value/old.value*100).toFixed(1)}%) → ${a.value}/${all.value} (${(a.value/all.value*100).toFixed(1)}%). ${f.start}–${f.end} versus ${comp.start}–${comp.end}.`});}
  }
  return out.slice(0,3);
}
function filteredRecords(state,f) {const models=new Set(selectModels(state,f).map(p=>p.model));return Object.values(state.records).filter(r=>r.month>=f.start&&r.month<=f.end&&models.has(r.model)).sort((a,b)=>a.month.localeCompare(b.month)||a.model.localeCompare(b.model));}

/** Shared KPI resolver: reuse metric/ratio/familyRatios, never count configurations as installations. */
function commercialKpi(state,start,end,id,{family='All'}={}){
 const inv=()=>metric(state,start,end,'Inverter');
 const bms=()=>metric(state,start,end,'BMS');
 const modules=()=>metric(state,start,end,'Battery module');
 const capacity=()=>metric(state,start,end,'Battery module',{capacity:true});
 if(id==='inverters')return inv();
 if(id==='bms')return bms();
 if(id==='modules')return modules();
 if(id==='capacity')return capacity();
 if(id==='bmsPer100')return ratio(bms(),inv(),100);
 if(id==='modulesPerBms')return family==='All'?ratio(modules(),bms()):familyRatios(state,{start,end},family).modulesPerBms;
 if(id==='kwhPerBms')return family==='All'?ratio(capacity(),bms()):familyRatios(state,{start,end},family).kwhPerBms;
 throw new Error('Unknown commercial KPI');
}
function sameQuarterYears(state,{quarter,years,kpi='inverters',family='All'}){
 if(!Number.isInteger(quarter)||quarter<1||quarter>4)throw new Error('Select a quarter from Q1 to Q4');
 if(!Array.isArray(years)||!years.length||years.length>30||years.some(y=>!Number.isInteger(y)||y<1900||y>9999))throw new Error('Select valid comparison years');
 return [...new Set(years)].sort((a,b)=>a-b).map(year=>{
  const first=String(year)+'-'+String((quarter-1)*3+1).padStart(2,'0');
  const last=shiftMonth(first,2);
  const result=commercialKpi(state,first,last,kpi,{family});
  return {year,quarter,start:first,end:last,label:'Q'+quarter+' '+year,...result};
 });
}
function kpiTrend(state,{start,end,aggregation='month',kpi='bmsPer100',family='All'}){
 const buckets=new Map();
 for(const m of monthsBetween(start,end)){const key=aggregationKey(m,aggregation);if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(m);}
 return [...buckets].map(([label,ms])=>({label,start:ms[0],end:ms.at(-1),...commercialKpi(state,ms[0],ms.at(-1),kpi,{family})}));
}

return Object.assign({},{metric,difference,ratio,comparisonPeriod,overview,latestComplete,aggregationKey,trend,movingAverage,ranking,familyRatios,findings,filteredRecords,commercialKpi,sameQuarterYears,kpiTrend});
})();

// MODULE: targets.js
__modules["targets.js"]=(()=>{
const {CATEGORIES,clone,monthValue,monthsBetween,applicable}=__modules["model.js"];
const {metric}=__modules["calculations.js"];
function targetKey(month,scope) {return `${month}|${scope}`;}
function saveTarget(state,{month,scope,value}) {
  if(!monthValue(month)||!Number.isSafeInteger(value)||value<0)throw new Error('Targets require a valid month and a non-negative whole number.');
  const category=CATEGORIES.includes(scope)?scope:state.catalog[scope]?.category;if(!category)throw new Error('Unknown target scope.');
  const next=clone(state);next.targets[targetKey(month,scope)]={month,scope,category,value};next.updatedAt=new Date().toISOString();return next;
}
function targetSummary(state,start,end,category,model='All',family='All') {
  let value=0,count=0;const missing=[];
  for(const m of monthsBetween(start,end)){
    const explicit=state.targets[targetKey(m,category)];
    if(model==='All'&&family==='All'&&explicit){value+=explicit.value;count++;continue;}
    const cover=state.coverage[`${m}|${category}`],models=model==='All'?(cover?.expected??[]).filter(k=>state.catalog[k]?.category===category&&(family==='All'||state.catalog[k].family===family)&&applicable(state.catalog[k],m)):[model];
    if(!models.length){missing.push(m);continue;}
    const targets=models.map(k=>state.targets[targetKey(m,k)]);
    if(targets.some(t=>!t)){missing.push(m);continue;}
    value+=targets.reduce((s,t)=>s+t.value,0);count++;
  }
  const actual=metric(state,start,end,category,{model,family}),target=missing.length||!count?null:value;
  return {target,actual,missing,gap:target!==null&&actual.complete?actual.value-target:null,attainment:target>0&&actual.complete?actual.value/target*100:null};
}

return Object.assign({},{targetKey,saveTarget,targetSummary});
})();

// MODULE: installers.js
__modules["installers.js"]=(()=>{
const {clone,uid,cellValue,isBlank,monthValue,columnName,monthsBetween,totalLabel}=__modules["model.js"];
// Source-name snapshots survive account merges. Reimports replace a source/month,
// never the already consolidated account total. Equipment records stay separate.
function emptyInstallers(){return {accounts:{},sources:{},imports:[],merges:[],coverage:{}};}
function installerSourceKey(name){return 'name:'+String(name).trim().replace(/\s+/g,' ').toLocaleLowerCase('en-IE');}
function installerMonth(value){
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
function suggestInstallerHeader(rows){
  let index=0,count=0;rows.slice(0,40).forEach((row,i)=>{const n=row.filter(c=>installerMonth(cellValue(c))).length;if(n>count){count=n;index=i;}});
  return {index,count};
}
function validateInstallerMatrix({rows,filename,sheet,headerRow=0,nameColumn=0}){
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
    if(totalLabel(label)){warnings.push(`Ignored summary row ${r+1}: ${label}.`);continue;}
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
// Full imports establish a source-month boundary, not a destructive deletion.
// Older omitted source snapshots stay available for audit and undo.
function installerImportOrder(state){
  return new Map((state.installers?.imports??[]).map((h,i)=>[h.id,i]));
}
function installerEffectiveRecord(state,source,month,order=installerImportOrder(state)){
  const record=source?.months?.[month]??null;
  if(!record)return null;
  const full=state.installers?.coverage?.[month];
  if(full?.mode!=='full')return record;
  const boundary=order.get(full.importId);
  return boundary!==undefined&&(order.get(record.importId)??-1)>=boundary?record:null;
}
function installerImportPreview(state,validation){
  const data=state.installers??emptyInstallers();
  return validation.sources.flatMap(s=>Object.entries(s.months).map(([month,r])=>{
    const old=data.sources[s.key],active=installerEffectiveRecord(state,old,month);
    const previous=active?.quantity??(data.coverage?.[month]?.mode==='full'?0:null);
    return {key:s.key,label:s.label,account:old?data.accounts[old.accountId].name:s.label,month,previous,quantity:r.quantity,action:previous===null?'New':previous===r.quantity?'Unchanged':'Replace'};
  }));
}
function commitInstallerImport(state,validation,{scope='partial',fullScopeConfirmed=false}={}){
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
      // Re-affirmed full reports and previously omitted source rows need a new
      // import position even when their quantities/evidence match older data.
      if(scope!=='full'&&before?.quantity===r.quantity&&JSON.stringify(before.source)===JSON.stringify(evidence)&&
         installerEffectiveRecord(next,source,month)!==null)continue;
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
  d.imports.push({id,timestamp,filename:validation.filename,sheet:validation.sheet,months:validation.months,scope,created,changes,coverageChanges,undone:false});
  // The new import must be in history before precedence / totals are resolved.
  for(const account of Object.values(d.accounts))installerMonthly(next,account.id);
  next.updatedAt=timestamp;return next;
}
function installerMonthly(state,accountId){
  const result={},order=installerImportOrder(state);
  let hasSources=false;
  for(const source of Object.values(state.installers?.sources??{}))if(source.accountId===accountId){
    hasSources=true;
    for(const month of Object.keys(source.months)){
      const record=installerEffectiveRecord(state,source,month,order);
      if(!record)continue;
      const sum=(result[month]??0)+record.quantity;
      if(!Number.isSafeInteger(sum))throw new Error('Consolidated activation total exceeds the safe numeric limit.');
      result[month]=sum;
    }
  }
  if(hasSources)for(const month of Object.keys(state.installers?.coverage??{}))result[month]??=0;
  return result;
}
function installerRows(state,start,end){
  const months=monthsBetween(start,end);
  return Object.values(state.installers?.accounts??{}).map(a=>{
    const monthly=installerMonthly(state,a.id),observed=months.filter(m=>Object.hasOwn(monthly,m));
    const total=observed.reduce((sum,m)=>sum+monthly[m],0);
    if(!Number.isSafeInteger(total))throw new Error('Selected total exceeds the safe numeric limit.');
    return {...a,monthly,total:observed.length?total:null,observed:observed.length,expected:months.length,aliases:Object.values(state.installers.sources).filter(s=>s.accountId===a.id).map(s=>s.label)};
  }).sort((a,b)=>(b.total??-1)-(a.total??-1)||a.name.localeCompare(b.name));
}
function similarityName(name){return name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\b(?:solar|limited|ltd)\b/g,'').replace(/[^a-z0-9]/g,'');}
function installerSuggestions(state){
  const accounts=Object.values(state.installers?.accounts??{}),out=[];
  const labels=a=>[a.name,...Object.values(state.installers.sources).filter(s=>s.accountId===a.id).map(s=>s.label)].map(similarityName).filter(s=>s.length>=5);
  const indexed=accounts.map(a=>({account:a,labels:labels(a)}));
  for(let i=0;i<indexed.length;i++)for(let j=i+1;j<indexed.length;j++){
    if(indexed[i].labels.some(a=>indexed[j].labels.some(b=>a===b)))out.push({ids:[accounts[i].id,accounts[j].id],names:[accounts[i].name,accounts[j].name],reason:'Similar spelling after spaces, accents and common suffixes are removed'});
    if(out.length>=20)return out;
  }
  return out;
}
function mergeInstallers(state,ids,name){
  ids=[...new Set(ids)];name=String(name??'').trim();
  if(ids.length<2||!name||name.length>200||ids.some(id=>!state.installers?.accounts[id]))throw new Error('Select at least two existing installers and a name (maximum 200 characters).');
  const next=clone(state),d=next.installers,target=ids[0],before=ids.map(id=>clone(d.accounts[id])),assignments={};
  for(const source of Object.values(d.sources))if(ids.includes(source.accountId)){assignments[source.key]=source.accountId;source.accountId=target;}
  d.accounts[target]={...d.accounts[target],name,notes:before.map(a=>a.notes).filter(Boolean).join('\n\n')};for(const id of ids.slice(1))delete d.accounts[id];
  installerMonthly(next,target);
  d.merges.push({id:uid(),timestamp:new Date().toISOString(),target,before,after:clone(d.accounts[target]),assignments,undone:false});next.updatedAt=new Date().toISOString();return next;
}
function undoInstallerMerge(state,id){
  const next=clone(state),d=next.installers,h=d.merges.find(m=>m.id===id);
  if(!h||h.undone)throw new Error('This merge is not available to undo.');
  const assigned=Object.values(d.sources).filter(s=>s.accountId===h.target).map(s=>s.key).sort();
  if(JSON.stringify(d.accounts[h.target])!==JSON.stringify(h.after)||JSON.stringify(assigned)!==JSON.stringify(Object.keys(h.assignments).sort())||Object.entries(h.assignments).some(([key])=>d.sources[key]?.accountId!==h.target))throw new Error('Later changes overlap this merge. Undo later merges first.');
  for(const a of h.before)d.accounts[a.id]=a;
  for(const [key,accountId]of Object.entries(h.assignments))d.sources[key].accountId=accountId;
  h.undone=true;next.updatedAt=new Date().toISOString();return next;
}
function undoInstallerImport(state,id){
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
function validateInstallerState(d){
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

return Object.assign({},{emptyInstallers,installerSourceKey,installerMonth,suggestInstallerHeader,validateInstallerMatrix,installerImportOrder,installerEffectiveRecord,installerImportPreview,commitInstallerImport,installerMonthly,installerRows,installerSuggestions,mergeInstallers,undoInstallerMerge,undoInstallerImport,validateInstallerState});
})();

// MODULE: backup.js
__modules["backup.js"]=(()=>{
const {emptyInstallers,validateInstallerState}=__modules["installers.js"];
const {CATEGORIES,clone,canonical,monthValue,keyOf,freshState}=__modules["model.js"];
const {validateProduct}=__modules["validation.js"];
const {targetKey}=__modules["targets.js"];
function validateBackup(input) {
  if(!input||![1,2].includes(input.schemaVersion)||!input.records||!input.catalog||!input.coverage||!input.targets||!Array.isArray(input.history)||!Array.isArray(input.events)||!Array.isArray(input.catalogLog)||!Array.isArray(input.coverageLog))throw new Error('This is not a compatible full application backup (schema versions 1 or 2).');
  for(const [k,p]of Object.entries(input.catalog)){if(canonical(k)!==k||p.model!==k||validateProduct(p,input.catalog).length)throw new Error(`Invalid catalogue entry: ${k}.`);}
  for(const [k,r]of Object.entries(input.records)){if(!input.catalog[r.model]||k!==keyOf(r.month,r.model)||!monthValue(r.month)||!Number.isSafeInteger(r.quantity)||r.quantity<0||!r.source?.filename||!r.source?.cell)throw new Error(`Invalid activation record: ${k}.`);}
  for(const [k,c]of Object.entries(input.coverage)){if(k!==`${c.month}|${c.category}`||!monthValue(c.month)||!CATEGORIES.includes(c.category)||!Array.isArray(c.expected)||c.expected.some(m=>input.catalog[m]?.category!==c.category))throw new Error('Invalid reporting coverage.');}
  for(const [k,t]of Object.entries(input.targets)){if(k!==targetKey(t.month,t.scope)||!monthValue(t.month)||!Number.isSafeInteger(t.value)||t.value<0||!(CATEGORIES.includes(t.scope)||input.catalog[t.scope]))throw new Error('Invalid target.');}
  for(const h of input.history){if(!h.id||!Array.isArray(h.changes)||!Array.isArray(h.coverageChanges??[])||!Array.isArray(h.catalogChanges??[]))throw new Error('Invalid import history.');}
  for(const e of input.events)if(!e.id||!/^\d{4}-\d{2}-\d{2}$/.test(e.date)||typeof e.title!=='string')throw new Error('Invalid timeline event.');
  const next=clone(input);if(input.schemaVersion===1){next.installers=emptyInstallers();}
  // Schema-2 backups created before the V2 scope ledger had no coverage field.
  if(next.installers&&next.installers.coverage===undefined)next.installers.coverage={};
  validateInstallerState(next.installers);next.schemaVersion=2;next.preferences={...freshState().preferences,...input.preferences};if(!monthValue(next.preferences.start)||!monthValue(next.preferences.end)||next.preferences.start>next.preferences.end)throw new Error('Invalid saved reporting period.');return next;
}

return Object.assign({},{validateBackup});
})();

// MODULE: installer-analytics.js
__modules["installer-analytics.js"]=(()=>{
const {monthsBetween,shiftMonth,closedMonth}=__modules["model.js"];
const {installerEffectiveRecord,installerImportOrder}=__modules["installers.js"];
const {comparisonPeriod,aggregationKey,difference}=__modules["calculations.js"];
// Build once per render. Source aliases retain independent coverage after a union.
function installerIndex(state){
  const coverage=state.installers.coverage??{};
  const grouped=new Map(Object.values(state.installers.accounts).map(a=>[a.id,{...a,coverage,sourceCount:0,aliases:[],cells:{}}]));
  const order=installerImportOrder(state);
  for(const source of Object.values(state.installers.sources)){
    if(!Object.keys(source.months).length)continue; // An undone import is not a zero-volume account.
    const account=grouped.get(source.accountId);if(!account)continue;
    account.sourceCount++;account.aliases.push(source.label);
    for(const month of Object.keys(source.months)){
      const r=installerEffectiveRecord(state,source,month,order);
      if(!r)continue;
      const cell=account.cells[month]??{value:0,observed:0};cell.value+=r.quantity;cell.observed++;
      if(!Number.isSafeInteger(cell.value))throw new Error('Installer monthly total exceeds the safe numeric limit.');
      account.cells[month]=cell;
    }
  }
  return [...grouped.values()].filter(a=>a.sourceCount>0);
}
function installerMeasure(accounts,start,end,now=new Date()){
  const months=monthsBetween(start,end);let value=0,observed=0,expected=0,fullScopeMonths=0;
  for(const a of accounts)for(const month of months){
    const cell=a.cells[month],full=a.coverage?.[month]?.mode==='full';
    if(full){
      // One verified account-month, even when a company changes source labels
      // or was absent in an explicitly confirmed full-population snapshot.
      expected++;observed++;fullScopeMonths++;
      value+=cell?.value??0;
    }else{
      // Older / partial imports remain conservative: each source alias needs
      // its own observation; unknown must never become an inferred zero.
      expected+=a.sourceCount;
      if(cell){observed+=cell.observed;value+=cell.value;}
    }
  }
  if(!Number.isSafeInteger(value))throw new Error('Installer period total exceeds the safe numeric limit.');
  const complete=expected>0&&observed===expected&&end<=closedMonth(now);
  const status=!months.length?'Invalid period':!expected?'No tracked data':end>closedMonth(now)?'Provisional — open/future month':observed!==expected?'Partial — missing source months':'Complete';
  return {value:observed?value:null,complete,status,observed,expected,months:months.length,fullScopeMonths};
}
function latestInstallerMonth(state,now=new Date()){
  const index=installerIndex(state),months=[...new Set([...Object.keys(state.installers.coverage??{}),...index.flatMap(a=>Object.keys(a.cells))])].sort().reverse();
  return months.find(m=>installerMeasure(index,m,m,now).complete)??null;
}
function installerAnalysis(state,f,{cohort='all',now=new Date()}={}){
  const all=installerIndex(state),comparison=comparisonPeriod(f),measure=(accounts,s,e)=>installerMeasure(accounts,s,e,now);
  const equalDuration=monthsBetween(f.start,f.end).length===monthsBetween(comparison.start,comparison.end).length;
  const eligible=all.filter(a=>measure([a],f.start,f.end).complete&&measure([a],comparison.start,comparison.end).complete);
  const accounts=cohort==='comparable'?eligible:all;
  const current=measure(accounts,f.start,f.end),previous=measure(accounts,comparison.start,comparison.end);
  const change=(a,b)=>equalDuration?difference(a,b):{delta:null,pct:null,label:'Use equal-length periods'};
  const current3Start=shiftMonth(f.end,-2),prior3Start=shiftMonth(f.end,-5),prior3End=shiftMonth(f.end,-3);
  const rows=accounts.map(a=>{
    const current=measure([a],f.start,f.end),previous=measure([a],comparison.start,comparison.end);
    const recent3=measure([a],current3Start,f.end),prior3=measure([a],prior3Start,prior3End);
    const lastActive=Object.keys(a.cells).filter(m=>m<=f.end&&a.cells[m].value>0).sort().at(-1)??null;
    return {id:a.id,name:a.name,aliases:a.aliases,cells:a.cells,current,previous,...change(current,previous),recent3,prior3,momentum:difference(recent3,prior3),lastActive,share:null,rank:null};
  }).sort((a,b)=>(b.current.value??-1)-(a.current.value??-1)||a.name.localeCompare(b.name));
  rows.forEach((r,i)=>{r.rank=r.current.value===null?null:i&&r.current.value===rows[i-1].current.value?rows[i-1].rank:i+1;r.share=current.complete&&current.value>0?r.current.value/current.value*100:null;});
  const observedActive=rows.filter(r=>r.current.value>0).length,previousActive=rows.filter(r=>r.previous.value>0).length,retained=rows.filter(r=>r.current.value>0&&r.previous.value>0).length;
  const active=current.complete?observedActive:null;
  const retention=current.complete&&previous.complete&&equalDuration&&previousActive>0?retained/previousActive*100:null;
  const top5=current.complete&&current.value>0?rows.slice(0,5).reduce((n,r)=>n+r.current.value,0)/current.value*100:null;
  const hhi=current.complete&&current.value>0?rows.reduce((n,r)=>n+(r.current.value/current.value)**2,0)*10000:null;
  const groups=new Map();for(const m of monthsBetween(f.start,f.end)){const key=aggregationKey(m,f.aggregation??'month');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(m);}
  const trend=[...groups].map(([label,ms])=>({label,start:ms[0],end:ms.at(-1),...measure(accounts,ms[0],ms.at(-1))}));
  const ytdStart=f.end.slice(0,4)+'-01',ytd=measure(accounts,ytdStart,f.end),priorYtd=measure(accounts,shiftMonth(ytdStart,-12),shiftMonth(f.end,-12));
  return {rows,accounts,allCount:all.length,eligibleCount:eligible.length,cohort,comparison,equalDuration,current,previous,change:change(current,previous),active,observedActive,previousActive,retained,retention,top5,hhi,trend,ytd,priorYtd,ytdChange:difference(ytd,priorYtd),current3Start,prior3Start,prior3End};
}
function sortInstallerRanking(rows,sort='volume'){
  const val=r=>sort==='change'?r.delta:sort==='growth'?r.pct:sort==='momentum'?r.momentum.pct:r.current.value;
  return [...rows].sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):val(a)===null&&val(b)===null?a.name.localeCompare(b.name):val(a)===null?1:val(b)===null?-1:val(b)-val(a)||a.name.localeCompare(b.name));
}
function installerAnalyticsCsv(analysis,f){
  return [['Installer','From','To','Comparison from','Comparison to','Cohort','Current activations','Current status','Previous activations','Previous status','Change units','Change %','Share %','Rank by reported volume','3M change %','Last active month'],...analysis.rows.map(r=>[r.name,f.start,f.end,analysis.comparison.start,analysis.comparison.end,analysis.cohort,r.current.value,r.current.status,r.previous.value,r.previous.status,r.delta,r.pct,r.share,r.rank,r.momentum.pct,r.lastActive])];
}

return Object.assign({},{installerIndex,installerMeasure,latestInstallerMonth,installerAnalysis,sortInstallerRanking,installerAnalyticsCsv});
})();

// MODULE: domain.js
__modules["domain.js"]=(()=>{

// Stable public API for the separated, browser-independent domain modules.








return Object.assign({},__modules["inverter-catalog.js"],__modules["model.js"],__modules["validation.js"],__modules["imports.js"],__modules["calculations.js"],__modules["targets.js"],__modules["backup.js"],__modules["installers.js"],__modules["installer-analytics.js"],{});
})();

// MODULE: exports.js
__modules["exports.js"]=(()=>{
const {filteredRecords,overview,comparisonPeriod,selectModels}=__modules["domain.js"];
const escapeHtml=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function csvCell(v){const s=String(v??'');const safe=/^[=+@\-\t\r]/.test(s)&&typeof v!=='number'?"'"+s:s;return /[",\n\r]/.test(safe)?`"${safe.replace(/"/g,'""')}"`:safe;}
const toCsv=rows=>'\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');
function exportRows(state,f){return [['Month','Model','Category','Family','Quantity','Activated capacity (kWh)','File','Worksheet','Cell','Original label','Import ID','Last update'],...filteredRecords(state,f).map(r=>{const p=state.catalog[r.model];return [r.month,r.model,p.category,p.family,r.quantity,p.category==='Battery module'?r.quantity*p.capacity:'',r.source.filename,r.source.sheet,r.source.cell,r.source.originalLabel,r.importId,r.updatedAt];})];}
function summaryRows(state,f){const period=comparisonPeriod(f),a=overview(state,f),b=overview(state,{...f,start:period.start,end:period.end});return [['Metric','Current start','Current end','Comparison start','Comparison end','Current value','Comparison value','Current coverage','Comparison coverage','Category filter','Model filter','Family filter'],...Object.keys(a).map(k=>[k,f.start,f.end,period.start,period.end,a[k].value,b[k].value,a[k].status,b[k].status,f.category,f.model,f.family])];}
function download(content,name,type='text/plain'){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
function templateRows(dataset,months){const models=dataset==='unified'?['SUN2000-5K-LB0','SUN2000-10KTL-M1','LUNA2000-5-E0','LUNA2000-5-E1','LUNA2000-7-E1','LUNA2000-5KW-C0','LUNA2000-10KW-C1']:dataset==='inverters'?['REPLACE-WITH-INVERTER-MODEL']:['LUNA2000-5-E0','LUNA2000-5-E1','LUNA2000-7-E1','LUNA2000-5KW-C0','LUNA2000-10KW-C1'];return [['index',...months.map(m=>m.replace('-',''))],...models.map(m=>[m,...months.map(()=>'')]),['Total',...months.map(()=>'')]];}

return Object.assign({},{escapeHtml,csvCell,toCsv,exportRows,summaryRows,download,templateRows});
})();

// MODULE: charts.js
__modules["charts.js"]=(()=>{
const {escapeHtml:e}=__modules["exports.js"];
const COLORS={'Inverter':'#ca1827','Battery module':'#176b78','BMS':'#827344','S0':'#697e8d','S1':'#b2182b','LUNA2000-5-E0':'#657d8c','LUNA2000-5-E1':'#c01835','LUNA2000-7-E1':'#e88738','LUNA2000-5KW-C0':'#8a76a1','LUNA2000-10KW-C1':'#226c8d'};
const palette=['#136e7b','#724685','#ad5727','#296046','#346faf','#9e2455','#766315','#46596d'];
function color(name){return COLORS[name]??palette[[...name].reduce((n,c)=>n+c.charCodeAt(0),0)%palette.length];}
const fmt=v=>Math.abs(v)>=1000000?(v/1000000).toFixed(1)+'m':Math.abs(v)>=1000?(v/1000).toFixed(1)+'k':Number.isInteger(v)?String(v):v.toFixed(1);
// Trend-only transformation: the underlying activation totals and coverage remain unchanged.
// All series use the SAME first observed period, rather than independently chosen baselines.
function indexedSeries(series) {
  if(!series.length)return {series:[],baseLabel:null,provisional:false};
  const first=series[0].points??[];
  const baselineIndex=first.findIndex((p,i)=>series.every(s=>{
    const candidate=s.points?.[i];
    return candidate?.label===p.label && Number.isFinite(candidate.value)&&candidate.value>0;
  }));
  if(baselineIndex<0)return {series:[],baseLabel:null,provisional:false};
  const provisional=series.some(s=>!s.points[baselineIndex].complete);
  return {baseLabel:first[baselineIndex].label,provisional,series:series.map(s=>{
    const baseline=s.points[baselineIndex].value;
    return {...s,points:s.points.map(p=>({...p,rawValue:p.value,
      value:Number.isFinite(p.value)?p.value/baseline*100:null}))};
  })};
}
function lineChart(series,{unit='activations',title='Activation trend',hidden=new Set(),id='main',scale='auto',installer=false,showLegend=true}={}){
  const visible=series.filter(s=>!hidden.has(s.name)),points=series[0]?.points??[],n=points.length;
  const vals=visible.flatMap(s=>s.points.map(p=>p.value)).filter(v=>v!==null&&Number.isFinite(v));
  const legend=()=>!showLegend?'':'<div class="legend">'+series.map(s=>`<button class="legend-item ${hidden.has(s.name)?'muted':''}" data-toggle-series="${e(s.name)}" data-chart="${e(id)}" aria-pressed="${!hidden.has(s.name)}"><i style="background:${s.color??color(s.name)}"></i>${e(s.name)}</button>`).join('')+'</div>';
  if(!n||!vals.length)return '<div class="chart-empty">No visible values for this selection. Adjust the legend or confirm reporting coverage.</div>'+legend();
  const W=1000,H=300,L=64,R=24,T=22,B=48,pw=W-L-R,ph=H-T-B;
  const min=Math.min(...vals),max=Math.max(...vals),spread=max-min;
  const focused=min>0&&(scale==='focus'||scale==='auto'&&spread>0&&spread/Math.max(max,1e-9)<.7);
  const margin=Math.max(spread*.15,Math.abs(max)*.025,.05);
  const bottom=focused?Math.max(0,min-margin):Math.min(0,min);
  const top=focused?max+margin:Math.max(1,max*1.14);
  const range=Math.max(top-bottom,1e-9);
  const x=i=>L+(n===1?pw/2:i/(n-1)*pw),y=v=>T+ph-(v-bottom)/range*ph;
  const showValue=v=>unit==='%'?v.toFixed(1)+'%':fmt(v);
  let svg=`<svg class="line-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${e(title)} in ${e(unit)}"><title>${e(title)} — ${e(unit)}</title>`;
  for(let i=0;i<=4;i++){
    const v=bottom+range*i/4,yy=y(v);
    svg+=`<line x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}" class="gridline"/><text x="${L-12}" y="${yy+4}" text-anchor="end" class="axis">${showValue(v)}</text>`;
  }
  const step=Math.max(1,Math.ceil(n/10));
  points.forEach((p,i)=>{if(i%step===0||i===n-1)svg+=`<text x="${x(i)}" y="${H-15}" text-anchor="middle" class="axis">${e(p.label)}</text>`;});
  let provisionalCount=0;
  for(const s of visible){
    const c=s.color??color(s.name),sp=s.points;
    for(let i=1;i<sp.length;i++){
      const from=sp[i-1],to=sp[i];
      if(!Number.isFinite(from.value)||!Number.isFinite(to.value))continue;
      const partial=!from.complete||!to.complete;
      if(partial)provisionalCount++;
      svg+=`<line x1="${x(i-1)}" y1="${y(from.value)}" x2="${x(i)}" y2="${y(to.value)}" stroke="${c}" stroke-width="2.7" stroke-linecap="round" ${partial?'stroke-dasharray="7 5"':''}/>`;
    }
    sp.forEach((p,i)=>{
      if(!Number.isFinite(p.value))return;
      const raw=Number.isFinite(p.rawValue)?` · actual ${fmt(p.rawValue)} activations`:'';
      const description=`${s.name} ${p.label}: ${showValue(p.value)}${unit==='%'?'':' '+unit}${raw} · ${p.status??'Complete'}`;
      svg+=`<g tabindex="0" role="button" aria-label="${e(description)}" data-month="${e(p.start??p.label)}" data-end="${e(p.end??p.start??p.label)}" data-model="${e(s.model??'All')}"${installer?` data-installer-point="${e(s.accountId??'portfolio')}"`:""}><title>${e(description)}</title><circle cx="${x(i)}" cy="${y(p.value)}" r="12" fill="transparent"/><circle cx="${x(i)}" cy="${y(p.value)}" r="4" fill="${p.complete?c:'white'}" stroke="${c}" stroke-width="2"/></g>`;
    });
  }
  svg+='</svg>'+legend();
  const note=provisionalCount?'Dashed lines and hollow markers indicate provisional observations; gaps are not connected.':'Solid lines indicate complete periods.';
  const zoom=focused?' Focused y-axis: it does not start at zero. Use actual values for volume comparisons.':'';
  return svg+`<p class="chart-note">${e(note+zoom)} Select a point for recorded evidence.</p>`;
}
function barChart(rows,{unit='activations',signed=false,empty='No complete comparison available.'}={}){
  const valid=rows.filter(r=>r.value!==null&&Number.isFinite(r.value));if(!valid.length)return `<div class="chart-empty">${e(empty)}</div>`;
  const max=Math.max(1,...valid.map(r=>Math.abs(r.value)));
  return `<div class="bars" aria-label="${e(unit)}">${valid.map(r=>`<button class="bar-row" data-model-detail="${e(r.model??r.label)}"><span class="bar-label">${e(r.label)}</span><span class="bar-track ${signed?'signed':''}"><i style="${signed?(r.value<0?'right:50%;':'left:50%;'):''}width:${Math.abs(r.value)/max*(signed?48:100)}%;background:${r.color??(signed?(r.value<0?'#9f4e3c':'#286c56'):color(r.label))}"></i></span><strong>${r.value>0&&signed?'+':''}${r.value.toLocaleString('en-IE',{maximumFractionDigits:1})}</strong></button>`).join('')}</div>`;
}
function stackedMix(items,unit='activations'){
  const valid=items.filter(x=>x.value!==null&&x.value>=0),total=valid.reduce((a,r)=>a+r.value,0);
  if(!total)return '<div class="chart-empty compact">No positive recorded volume in this selection.</div>';
  return `<div class="stack" role="img" aria-label="Product mix in ${e(unit)}">${valid.map(r=>`<button data-model-detail="${e(r.model??r.label)}" style="width:${r.value/total*100}%;background:${color(r.label)}" title="${e(r.label)}: ${r.value.toLocaleString('en-IE')} ${e(unit)} (${(r.value/total*100).toFixed(1)}%)"><span class="sr-only">${e(r.label)} ${(r.value/total*100).toFixed(1)}%</span></button>`).join('')}</div><div class="mix-key">${valid.map(r=>`<button data-model-detail="${e(r.model??r.label)}"><i style="background:${color(r.label)}"></i><span>${e(r.label)}</span><strong>${(r.value/total*100).toFixed(1)}%</strong></button>`).join('')}</div>`;
}

return Object.assign({},{COLORS,color,indexedSeries,lineChart,barChart,stackedMix});
})();

// MODULE: installer-analytics-views.js
__modules["installer-analytics-views.js"]=(()=>{
const D=__modules["domain.js"];
const {escapeHtml:e}=__modules["exports.js"];
const {lineChart}=__modules["charts.js"];
const n=(v,d=0)=>v==null?'—':v.toLocaleString('en-IE',{maximumFractionDigits:d});
const signed=(v,d=0)=>v==null?'—':`${v>0?'+':''}${n(v,d)}`;
const pct=v=>v==null?'—':n(v,1)+'%';
const card=(title,value,note)=>`<article class="installer-kpi"><span>${e(title)}</span><strong>${e(value)}</strong><p>${e(note)}</p></article>`;
const panel=(title,body)=>`<section class="panel installer-analysis-panel"><div class="panel-head"><h2>${e(title)}</h2></div>${body}</section>`;
function installerAnalyticsFilters(state,ui){
  const f=state.preferences,opt=(v,t,current)=>`<option value="${v}" ${current===v?'selected':''}>${t}</option>`;
  return `<div class="filter-main"><label class="field">Period<select id="installer-period"><option value="custom">Custom period</option><option value="month">Latest complete month</option><option value="3">Last 3 months</option><option value="12">Last 12 months</option><option value="ytd">Year to date</option></select></label><label class="field">From<input type="month" data-filter="start" value="${e(f.start)}"></label><label class="field">To<input type="month" data-filter="end" value="${e(f.end)}"></label><label class="field">Chart view<select data-filter="aggregation">${[['month','Monthly'],['quarter','Quarterly'],['year','Annual']].map(([v,t])=>opt(v,t,f.aggregation)).join('')}</select></label><label class="field">Compare with<select data-filter="comparison">${[['year','Same months last year'],['previous','Previous equal interval'],['custom','Custom interval']].map(([v,t])=>opt(v,t,f.comparison)).join('')}</select></label><label class="field">Account base<select id="installer-cohort">${opt('all','All tracked installers',ui.installerCohort??'all')}${opt('comparable','Same comparable installers',ui.installerCohort)}</select></label></div>${f.comparison==='custom'?`<div class="filter-extra"><label class="field">Comparison from<input type="month" data-filter="compareStart" value="${e(f.compareStart)}"></label><label class="field">Comparison to<input type="month" data-filter="compareEnd" value="${e(f.compareEnd)}"></label></div>`:''}<p class="table-note">Installer inverter activations only. Product filters do not apply. Blank imported cells = zero. Full-population snapshots confirm absent accounts as zero; otherwise missing source/month records remain unavailable. Search changes the table and heatmap, not portfolio KPI denominators.</p>`;
}
function installerDashboard(state,ui,report){
  if(!report.allCount)return '<div class="notice"><p>Import installer activations to see trends, rankings and monthly activity.</p></div>';
  const f=state.preferences,r=report,series=[{name:'Selected period',color:'#c71932',points:r.trend}];
  if(r.equalDuration){const monthOffset=(+r.comparison.start.slice(0,4)-+f.start.slice(0,4))*12+(+r.comparison.start.slice(5)-+f.start.slice(5));
    series.push({name:'Comparison period',color:'#237687',points:r.trend.map(p=>{const start=D.shiftMonth(p.start,monthOffset),end=D.shiftMonth(p.end,monthOffset);return {...p,start,end,...D.installerMeasure(r.accounts,start,end),status:`${start}–${end} · ${D.installerMeasure(r.accounts,start,end).status}`};})});
  }
  const comparisonText=`${f.start}–${f.end} vs ${r.comparison.start}–${r.comparison.end}`;
  const cards=`<div class="installer-kpis">${card('Inverter activations',n(r.current.value),r.current.status)}${card('Change vs comparison',r.change.pct==null?'—':signed(r.change.pct,1)+'%',r.change.delta==null?r.change.label:signed(r.change.delta)+' activations')}${card('Active installers',n(r.active),r.active===null?`${r.observedActive} observed active; incomplete period`:'Distinct accounts with activations > 0')}${card('Top 5 concentration',pct(r.top5),'Share of tracked activations in this account base')}</div>`;
  const contributions=r.current.complete&&r.previous.complete&&r.equalDuration?r.rows.filter(row=>row.delta!==null&&row.delta!==0).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta)).slice(0,10):[];
  const max=Math.max(1,...contributions.map(row=>Math.abs(row.delta)));
  const bars=contributions.length?`<div class="bars">${contributions.map(row=>`<button class="bar-row" data-installer-detail="${e(row.id)}"><span class="bar-label">${e(row.name)}</span><span class="bar-track signed"><i style="${row.delta<0?'right:50%':'left:50%'};width:${Math.abs(row.delta)/max*48}%;background:${row.delta<0?'#9f4e3c':'#286c56'}"></i></span><strong>${signed(row.delta)}</strong></button>`).join('')}</div>`:`<p class="table-note">${r.current.complete&&r.previous.complete&&r.equalDuration?'No change in account activations.':'Complete equal-length periods are required to attribute the portfolio change.'}</p>`;
  return `<div class="installer-analysis-summary"><p><strong>${e(comparisonText)}</strong> · ${r.accounts.length} / ${r.allCount} tracked accounts included</p><p class="table-note">${r.cohort==='comparable'?`Same-base comparison: ${r.allCount-r.eligibleCount} accounts excluded because source/month coverage is incomplete in one of the two periods.`:'All tracked accounts. A new or incompletely reported source can make comparisons unavailable; use the same comparable installers option to inspect the common base.'}</p>${!r.equalDuration?'<p class="notice">The selected intervals have different lengths. Growth and contribution are withheld. Use equal-length intervals for comparison.</p>':''}</div>${cards}${panel('Installer activation trend',`<div class="chart-scroll">${lineChart(series,{id:'installer-trend',title:'Installer inverter activations',hidden:ui.hiddenSeries,installer:true,scale:'zero'})}</div><details><summary>Underlying trend values</summary><div class="table-wrap"><table><thead><tr><th>Selected period</th><th>Activations</th><th>Status</th><th>Comparison dates</th><th>Comparison activations</th></tr></thead><tbody>${r.trend.map((p,i)=>`<tr><td>${e(p.start)}–${e(p.end)}</td><td>${n(p.value)}</td><td>${e(p.status)}</td><td>${series[1]?e(series[1].points[i].start)+'–'+e(series[1].points[i].end):'—'}</td><td>${n(series[1]?.points[i].value)}</td></tr>`).join('')}</tbody></table></div></details>`)}<div class="grid-equal">${panel('Largest contributions to change',`<p class="table-note">Top 10 by absolute impact · signed activation changes · net portfolio change: ${signed(r.change.delta)}</p>${bars}`)}${panel('Portfolio measures',`<dl class="installer-measures"><dt>Active-account retention</dt><dd>${pct(r.retention)}</dd><dt>Retained / previously active</dt><dd>${r.retention===null?'—':`${r.retained} / ${r.previousActive}`}</dd><dt>HHI concentration (0–10,000)</dt><dd>${n(r.hhi)}</dd><dt>YTD activations (${e(f.end.slice(0,4))})</dt><dd>${n(r.ytd.value)}${r.ytd.complete?'':' *'}</dd><dt>YTD change vs same months last year</dt><dd>${r.ytdChange.pct==null?'—':signed(r.ytdChange.pct,1)+'%'}</dd><dt>Confirmed / expected coverage units</dt><dd>${r.current.observed} / ${r.current.expected}</dd></dl><p class="table-note">YTD ends at ${e(f.end)}. * Partial subtotal. HHI uses squared account shares. These are Huawei activations tracked here, not Irish market share.</p>`)}</div>`;
}
function installerHeatmap(rows,f,report){
  const months=D.monthsBetween(f.start,f.end),max=report.rows.reduce((max,r)=>months.reduce((max,m)=>Math.max(max,r.cells[m]?.value??0),max),1);
  // Paginated accounts, one common absolute scale; zero, missing and partial differ.
  return panel('Monthly activity heatmap',`<p class="table-note">Same accounts and order as the table page. One shared scale for activation counts. 0 = confirmed zero; — = no record; striped cells = partial/open period. Select a cell for evidence.</p><div class="table-wrap installer-heatmap"><table><thead><tr><th>Installer</th>${months.map(m=>`<th>${e(m)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><th><button class="quiet" data-installer-detail="${e(r.id)}">${e(r.name)}</button></th>${months.map(m=>{const a=report.accounts.find(a=>a.id===r.id),metric=D.installerMeasure([a],m,m),v=metric.value,level=v==null?'missing':v===0?'zero':String(Math.max(1,Math.ceil(Math.sqrt(v/max)*5)));return `<td><button class="heat-cell heat-${level}${v!==null&&!metric.complete?' heat-partial':''}" data-installer-point="${e(r.id)}" data-month="${m}" data-end="${m}" aria-label="${e(r.name+' '+m+': '+n(v)+' activations, '+metric.status)}" title="${e(metric.status)}">${n(v)}${v!==null&&!metric.complete?'*':''}</button></td>`;}).join('')}</tr>`).join('')||`<tr><td colspan="${months.length+1}">No matching installers.</td></tr>`}</tbody></table></div><div class="heat-legend"><span class="heat-missing">— No record</span><span class="heat-zero">0 Zero</span><span class="heat-1">Low</span><span class="heat-3">Medium</span><span class="heat-5">${n(max)} Max</span></div>`);
}
function installerProfile(state,id,ui){
  const f=state.preferences,report=D.installerAnalysis(state,f,{cohort:ui.installerCohort??'all'}),row=report.rows.find(r=>r.id===id),account=D.installerIndex(state).find(a=>a.id===id);
  if(!account)return '<p>No activation records for this account.</p>';
  const measure=D.installerMeasure([account],f.start,f.end),prev=D.installerMeasure([account],report.comparison.start,report.comparison.end),change=report.equalDuration?D.difference(measure,prev):{delta:null,pct:null};
  const momentum=D.difference(D.installerMeasure([account],D.shiftMonth(f.end,-2),f.end),D.installerMeasure([account],D.shiftMonth(f.end,-5),D.shiftMonth(f.end,-3)));
  const points=D.monthsBetween(f.start,f.end).map(m=>({label:m,start:m,end:m,...D.installerMeasure([account],m,m)}));
  return `<div class="installer-kpis">${card('Activations',n(measure.value),measure.status)}${card('Change',change.pct==null?'—':signed(change.pct,1)+'%',signed(change.delta)+' activations')}${card('Share of selected account base',pct(row?.share),'Tracked Huawei activations only')}${card('3-month momentum',momentum.pct==null?'—':signed(momentum.pct,1)+'%',`${D.shiftMonth(f.end,-2)}–${f.end} vs ${D.shiftMonth(f.end,-5)}–${D.shiftMonth(f.end,-3)}`)}</div><p class="table-note">${e(f.start)}–${e(f.end)} versus ${e(report.comparison.start)}–${e(report.comparison.end)}. Volume rank: ${n(row?.rank)}${measure.complete?'':' (provisional)'}. Base: ${report.cohort==='comparable'?'same comparable accounts':'all tracked accounts'}.</p><div class="chart-scroll">${lineChart([{name:account.name,accountId:id,points}],{showLegend:false,id:'installer-profile',title:account.name+' monthly activations',installer:true,scale:'zero'})}</div>`;
}
function installerPointEvidence(state,id,start,end,ui){
  const report=D.installerAnalysis(state,state.preferences,{cohort:ui.installerCohort??'all'}),accounts=id==='portfolio'?report.accounts:D.installerIndex(state).filter(a=>a.id===id),metric=D.installerMeasure(accounts,start,end);
  const monthSet=new Set(D.monthsBetween(start,end)),accountIds=new Set(accounts.map(a=>a.id));
  const sources=Object.values(state.installers.sources).filter(s=>accountIds.has(s.accountId)&&Object.keys(s.months).length);
  return `<p><strong>${e(start)}–${e(end)}: ${n(metric.value)} inverter activations</strong></p><p>${e(metric.status)} · ${metric.observed} / ${metric.expected} reporting coverage units confirmed.</p><p class="table-note">${id==='portfolio'?'Portfolio evidence uses the selected account base.':'Installer source evidence.'} Blank imported cells are zero. Months declared as full-population snapshots confirm zero for absent companies; partial months without source evidence remain unknown.</p><div class="table-wrap"><table><thead><tr><th>Source name</th><th>Month</th><th>Activations</th><th>Evidence</th></tr></thead><tbody>${sources.flatMap(s=>[...monthSet].map(m=>{const r=s.months[m],active=D.installerEffectiveRecord(state,s,m),full=state.installers.coverage?.[m]?.mode==='full',superseded=!!r&&!active;return `<tr><td>${e(s.label)}</td><td>${e(m)}</td><td>${n(active?.quantity??(full?0:null))}</td><td>${active?`${e(active.source.filename)} / ${e(active.source.sheet)} / ${active.source.cells.map(c=>e(c.cell)+': '+n(c.quantity)+(c.blank?' (blank → 0)':'')).join(', ')}`:superseded?`Historical ${n(r.quantity)} superseded by full snapshot · ${e(r.source.filename)} / ${e(r.source.sheet)}`:full?'Confirmed zero by full-population snapshot':'No source record (unknown)'}</td></tr>`;})).join('')}</tbody></table></div>`;
}

return Object.assign({},{installerAnalyticsFilters,installerDashboard,installerHeatmap,installerProfile,installerPointEvidence});
})();

// MODULE: installer-views.js
__modules["installer-views.js"]=(()=>{
const A=__modules["installer-analytics-views.js"];
const D=__modules["domain.js"];
const {escapeHtml:e}=__modules["exports.js"];
const n=x=>x==null?'—':x.toLocaleString('en-IE');
function installerView(state,ui){
  const d=state.installers,f=state.preferences,report=D.installerAnalysis(state,f,{cohort:ui.installerCohort??'all'}),rows=D.sortInstallerRanking(report.rows,ui.installerSort??'volume').map(r=>({...r,total:r.current.value,observed:r.current.observed,expected:r.current.expected})),query=(ui.installerSearch??'').toLowerCase(),filtered=rows.filter(r=>r.name.toLowerCase().includes(query)||r.aliases.some(a=>a.toLowerCase().includes(query))),page=Math.min(ui.installerPage??0,Math.max(0,Math.ceil(filtered.length/50)-1)),shown=filtered.slice(page*50,page*50+50),selected=ui.installerSelected??new Set(),suggestions=D.installerSuggestions(state),pending=ui.installerPending;
  const table=`<div class="table-wrap"><table><thead><tr><th>Select</th><th>Installer</th><th class="num">Reported activations</th><th>Previous</th><th>Change</th><th>Growth</th><th>Share</th><th>Rank</th><th>3M momentum</th><th>Reporting coverage</th><th>Source names</th></tr></thead><tbody>${shown.map(r=>`<tr><td><input type="checkbox" data-installer-select="${e(r.id)}" aria-label="Select ${e(r.name)}" ${selected.has(r.id)?'checked':''}></td><td><button class="quiet" data-installer-detail="${e(r.id)}">${e(r.name)}</button></td><td class="num">${n(r.total)}</td><td>${n(r.previous.value)}</td><td>${n(r.delta)}</td><td>${r.pct==null?'—':n(Math.round(r.pct*10)/10)+'%'}</td><td>${r.share==null?'—':n(Math.round(r.share*10)/10)+'%'}</td><td>${n(r.rank)}</td><td>${r.momentum.pct==null?'—':n(Math.round(r.momentum.pct*10)/10)+'%'}</td><td>${r.observed} / ${r.expected}${r.current.complete?'':' *'}</td><td>${r.aliases.map(e).join('<br>')}</td></tr>`).join('')||'<tr><td colspan="11">No installers in this view. Import a monthly matrix to start.</td></tr>'}</tbody></table></div>`;
  return `<div class="page-title"><div><div class="eyebrow">Ireland · Digital Power</div><h1>Installers</h1><p>Track activity, compare performance and inspect the accounts behind the change.</p></div><div class="panel-actions"><button data-action="installer-analytics-export">Export KPI table</button><button data-action="installer-export">Export monthly totals</button></div></div>
${A.installerDashboard(state,ui,report)}<section class="panel"><details ${!rows.length||pending||ui.installerLoading||ui.installerError?'open':''}><summary>Import installer activations</summary><p class="table-note">One installer per row, monthly columns and an optional trailing Total column (ignored). Blank monthly cells = zero. Repeated names are summed. Summary rows such as === 总计 === are ignored. Reimporting replaces source/month snapshots. Full reporting scope requires explicit confirmation; partial imports never infer zero from absent companies.</p><label class="field">Excel or CSV file<input id="installer-file" type="file" accept=".xlsx,.csv" ${ui.demo||ui.installerLoading?'disabled':''}></label>${ui.installerLoading?'<p role="status">Reading worksheet…</p>':''}${ui.installerError?`<p class="notice error" role="alert">${e(ui.installerError)}</p>`:''}${pending?installerPreview(state,pending):''}</details></section>
<section class="panel"><div class="panel-head"><h2>Installer ranking (${rows.length})</h2><button class="primary" data-action="installer-merge" ${selected.size<2?'disabled':''}>Unify selected (${selected.size})</button></div><label class="field">Search installer or source name<input id="installer-search" type="search" value="${e(ui.installerSearch??'')}" placeholder="e.g. Bord Gáis"></label><label class="field">Sort ranking<select id="installer-sort">${[['volume','Activations'],['change','Change in units'],['growth','Growth %'],['momentum','3M momentum'],['name','Name']].map(([v,t])=>`<option value="${v}" ${(ui.installerSort??'volume')===v?'selected':''}>${t}</option>`).join('')}</select></label>${table}<div class="panel-actions"><button data-installer-page="${page-1}" ${page===0?'disabled':''}>Previous</button><span>${filtered.length} matches · page ${page+1} of ${Math.max(1,Math.ceil(filtered.length/50))}</span><button data-installer-page="${page+1}" ${(page+1)*50>=filtered.length?'disabled':''}>Next</button></div><p class="table-note">Select two or more accounts to sum their monthly activations. Click an installer to inspect its source values. Rank uses reported volume, with tied values sharing a rank. * Incomplete source coverage or open period. Shares require a complete selected base. 3M momentum compares the last three months ending at the selected end with the previous three.</p></section>
${A.installerHeatmap(shown,f,report)}<section class="panel"><div class="panel-head"><h2>Suggested matches</h2></div><p class="table-note">Spelling suggestions only. Confirm which names belong to the same installer. All confirmed matches are summed.</p>${suggestions.map(s=>`<div class="installer-suggestion"><div><strong>${s.names.map(e).join(' + ')}</strong><p class="table-note">${e(s.reason)}</p></div><button data-installer-suggest="${e(s.ids.join(','))}">Review union</button></div>`).join('')||'<p>No similar names awaiting review.</p>'}${suggestions.length===20?'<p class="table-note">Showing the first 20 suggestions. More may appear after these are resolved.</p>':''}</section>
<section class="panel"><div class="panel-head"><h2>Installer history</h2></div>${[...d.merges].reverse().slice(0,10).map(h=>`<p>${e(h.before.map(a=>a.name).join(' + '))} → <strong>${e(h.after.name)}</strong> · ${e(h.timestamp)} ${h.undone?'(undone)':`<button class="small" data-installer-unmerge="${e(h.id)}">Undo union</button>`}</p>`).join('')}${[...d.imports].reverse().slice(0,10).map(h=>`<p>${e(h.filename)} · ${h.changes.length} changed monthly values · ${e(h.timestamp)} ${h.undone?'(undone)':`<button class="small" data-installer-undo-import="${e(h.id)}">Undo import</button>`}</p>`).join('')||'<p class="table-note">No installer imports yet.</p>'}</section>`;
}
function installerPreview(state,p){
  const v=p.validation,preview=D.installerImportPreview(state,v),changes=preview.filter(r=>r.action!=='Unchanged');
  return `<div class="form-row"><label class="field">Worksheet<select id="installer-sheet">${p.workbook.names.map(name=>`<option ${name===p.sheet?'selected':''}>${e(name)}</option>`).join('')}</select></label><label class="field">Header row<input id="installer-header" type="number" min="1" max="${p.rows.length}" value="${p.headerRow+1}"></label><label class="field">Installer-name column<select id="installer-name-column">${(p.rows[p.headerRow]??[]).map((c,i)=>`<option value="${i}" ${i===p.nameColumn?'selected':''}>${D.columnName(i)}: ${e(D.cellValue(c)??'')}</option>`).join('')}</select></label></div><p>${v.sources.length} source names · ${v.months.length} months · ${v.duplicates} repeated rows summed · ${v.blankZeros} blanks converted to zero · ${changes.length} changed values</p><p>${v.ignoredTotal?'Trailing Total column ignored.':''}</p>${v.errors.length?`<div class="notice error"><ul>${v.errors.slice(0,20).map(x=>`<li>${e(x)}</li>`).join('')}</ul><p>${v.errors.length} errors; nothing has been saved.</p></div>`:''}${v.warnings.map(w=>`<p class="table-note">${e(w)}</p>`).join('')}<details><summary>Review monthly changes (${changes.length})</summary><div class="table-wrap"><table><thead><tr><th>Source → Account</th><th>Month</th><th>Previous</th><th>Incoming</th><th>Action</th></tr></thead><tbody>${changes.slice(0,200).map(r=>`<tr><td>${e(r.label)} → ${e(r.account)}</td><td>${e(r.month)}</td><td>${n(r.previous)}</td><td>${n(r.quantity)}</td><td>${e(r.action)}</td></tr>`).join('')}</tbody></table></div>${changes.length>200?'<p>First 200 changes shown. Download the full preview to review every value.</p>':''}</details><button data-action="installer-preview-export">Download full preview CSV</button><form data-form="installer-import"><label class="field">Reporting coverage<select name="scope" required><option value="partial">Partial update / coverage not confirmed (default)</option><option value="full">Full installer population for all imported months</option></select></label><p class="table-note">Only select Full when every installer in the reporting population is represented, and absent installers genuinely have zero activations for each imported month. Full scope can make previously missing aliases interpretable; this affects growth and retention.</p><label><input type="checkbox" name="fullScopeConfirmed"> If selecting Full, I confirm the file covers the full installer population and absent companies had zero activations in those months.</label><label><input type="checkbox" name="approved" required> I reviewed the import. Blank monthly cells replace previous values with zero; repeated names are summed.</label><div class="dialog-actions"><button type="button" data-action="installer-cancel">Cancel</button><button type="submit" class="primary" ${v.errors.length?'disabled':''}>Confirm installer import</button></div></form>`;
}
function installerMergePreview(state,ids){
  const accounts=ids.map(id=>state.installers.accounts[id]).filter(Boolean),months=[...new Set(accounts.flatMap(a=>Object.keys(D.installerMonthly(state,a.id))))].sort();
  return `<form data-form="installer-merge"><label class="field">Consolidated installer name<input name="name" required maxlength="200" value="${e(accounts[0]?.name??'')}"></label><p>Monthly values will be summed. Original source records remain available, and future imports replace their corresponding source/month snapshots.</p><div class="table-wrap"><table><thead><tr><th>Month</th>${accounts.map(a=>`<th>${e(a.name)}</th>`).join('')}<th>Consolidated</th></tr></thead><tbody>${months.map(month=>{const values=accounts.map(a=>D.installerMonthly(state,a.id)[month]);return `<tr><td>${e(month)}</td>${values.map(v=>`<td>${n(v)}</td>`).join('')}<td><strong>${n(values.reduce((sum,v)=>sum+(v??0),0))}</strong></td></tr>`;}).join('')}</tbody></table></div><p class="table-note">— means that source has no record for that month. Consolidation sums available values and preserves that distinction in source evidence.</p><div class="dialog-actions"><button type="button" data-close="modal">Cancel</button><button type="submit" class="primary">Unify and sum activations</button></div></form>`;
}
function installerDetail(state,id){
  const sources=Object.values(state.installers.sources).filter(s=>s.accountId===id),monthly=D.installerMonthly(state,id);
  return `<p>All available months. Original source quantities are preserved.</p><div class="table-wrap"><table><thead><tr><th>Month</th>${sources.map(s=>`<th>${e(s.label)}</th>`).join('')}<th>Consolidated</th></tr></thead><tbody>${Object.keys(monthly).sort().map(month=>`<tr><td>${e(month)}</td>${sources.map(s=>{const r=s.months[month],active=D.installerEffectiveRecord(state,s,month),superseded=!!r&&!active;return `<td>${n(active?.quantity??(state.installers.coverage?.[month]?.mode==='full'?0:null))}${r?`<details><summary>${superseded?'Historical — superseded':'Source'}</summary>${e(r.source.filename)} · ${e(r.source.sheet)}<br>${r.source.cells.map(c=>`${e(c.cell)}: ${n(c.quantity)}${c.blank?' (blank → zero)':''}`).join('<br>')}</details>`:''}</td>`;}).join('')}<td>${n(monthly[month])}</td></tr>`).join('')}</tbody></table></div>`;
}

return Object.assign({},{installerView,installerPreview,installerMergePreview,installerDetail});
})();

// MODULE: views.js
__modules["views.js"]=(()=>{
const D=__modules["domain.js"];
const {escapeHtml:e}=__modules["exports.js"];
const {lineChart,indexedSeries,barChart,stackedMix,color}=__modules["charts.js"];
const NAV=['Overview','Inverters','Batteries & BMS','Comparisons','Targets','Data','Installers'];
const ROUTES=['overview','inverters','batteries','comparisons','targets','data','installers'];
const ICONS=['M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z','M4 4h16v16H4zM8 8h8M8 12h8M8 16h4','M3 7h17v12H3zM7 7V4h8v3M8 10v6M5 13h6M14 13h3','M4 20V10h5v10M10 20V4h5v16M16 20v-8h5v8','M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10M12 10v4M10 12h4','M3 6c0-4 18-4 18 0s-18 4-18 0v12c0 4 18 4 18 0V6M3 12c0 4 18 4 18 0'];
const number=(v,d=0)=>v===null||v===undefined?'—':v.toLocaleString('en-IE',{maximumFractionDigits:d});
const signed=(v,d=0)=>v===null||v===undefined?'—':`${v>0?'+':''}${number(v,d)}`;
const labelMonth=m=>m?new Intl.DateTimeFormat('en-IE',{month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(`${m}-01T00:00:00Z`)):'—';
const rangeLabel=(s,en)=>s===en?labelMonth(s):`${labelMonth(s)} – ${labelMonth(en)}`;
const option=(value,label,selected)=>`<option value="${e(value)}" ${value===selected?'selected':''}>${e(label??value)}</option>`;
function badge(status){const good=status==='Complete';return `<span class="badge ${good?'good':'warn'}">${e(status)}</span>`;}
function navigation(active){return NAV.map((n,i)=>`<button data-nav="${ROUTES[i]}" class="${ROUTES[i]===active?'active':''}" ${ROUTES[i]===active?'aria-current="page"':''}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[i]??ICONS[5]}"/></svg>${n}</button>`).join('');}
function filters(state,ui){const f=state.preferences,c=D.comparisonPeriod(f),last=D.latestComplete(state),models=D.selectModels(state,{category:f.category,family:f.family});return `<div class="filter-main">
<label class="field period-select">Reporting period<select id="shortcut"><option value="custom">Custom period</option><option value="month">Latest complete month</option><option value="quarter">Latest complete quarter</option><option value="ytd">Year to date</option><option value="3">Last 3 complete months</option><option value="6">Last 6 complete months</option><option value="12">Last 12 complete months</option></select></label>
<label class="field">From<input type="month" data-filter="start" value="${f.start}" required></label><label class="field">To<input type="month" data-filter="end" value="${f.end}" required></label>
<label class="field">View<select data-filter="aggregation">${[['month','Monthly'],['quarter','Quarterly'],['half','Half-year'],['year','Annual']].map(([v,t])=>option(v,t,f.aggregation)).join('')}</select></label>
<label class="field">Compare with<select data-filter="comparison">${[['year','Same months last year'],['previous','Previous equal interval'],['custom','Custom interval']].map(([v,t])=>option(v,t,f.comparison)).join('')}</select></label>
<button class="filter-toggle quiet" data-action="toggle-filters" aria-expanded="${ui.moreFilters}">Product filters ${ui.moreFilters?'−':'＋'}${f.category!=='All'||f.model!=='All'||f.family!=='All'?' •':''}</button></div>
${f.comparison==='custom'?`<div class="filter-extra"><label class="field">Comparison from<input type="month" data-filter="compareStart" value="${f.compareStart}"></label><label class="field">Comparison to<input type="month" data-filter="compareEnd" value="${f.compareEnd}"></label></div>`:''}
${ui.moreFilters?`<div class="filter-extra"><label class="field">Category<select data-filter="category">${['All',...D.CATEGORIES].map(v=>option(v,v==='All'?'All categories':v,f.category)).join('')}</select></label><label class="field">Model<select data-filter="model">${option('All','All models',f.model)}${models.map(p=>option(p.model,p.model,f.model)).join('')}</select></label><label class="field">Grid Phase<select id="grid-phase">${[["All","All phases"],["Single-phase","Single-phase"],["Three-phase","Three-phase"]].map(([v,t])=>option(v,t,ui.gridPhase??"All")).join("")}</select></label><label class="field">Family<select data-filter="family">${['All',...[...new Set(Object.values(state.catalog).map(p=>p.family).filter(Boolean))].sort()].map(v=>option(v,v==='All'?'All families':v,f.family)).join('')}</select></label><button class="quiet" data-action="reset-filters">Reset product filters</button></div>`:''}
<div class="filter-caption"><span><strong>${e(rangeLabel(f.start,f.end))}</strong> versus <strong>${e(rangeLabel(c.start,c.end))}</strong> · ${f.category==='All'?'All categories':e(f.category)} · ${f.model==='All'?'All models':e(f.model)} · ${f.family==='All'?'All families':e(f.family)}</span><span>Latest complete integrated month: ${last?labelMonth(last):'not yet confirmed'}</span></div>`;}
function heading(state,title,subtitle){const f=state.preferences,c=D.comparisonPeriod(f);return `<div class="page-title"><div><div class="eyebrow">Ireland · Digital Power</div><h1>${e(title)}</h1><p>${e(subtitle)}</p></div><div class="page-meta">${e(rangeLabel(f.start,f.end))}<br>vs ${e(rangeLabel(c.start,c.end))}<br>${e(f.category)} · ${e(f.model)} · ${e(f.family)}<br>Updated ${state.updatedAt?new Date(state.updatedAt).toLocaleString('en-IE',{timeZone:'Europe/Dublin',dateStyle:'medium',timeStyle:'short'}):'no imports yet'} · Dublin</div></div>`;}
function emptyView(state){return heading(state,'Activation overview','A clear view of equipment activity, product mix and change.')+`<section class="empty-hero"><div class="empty-copy"><div class="eyebrow">Ready for your activation data</div><h2>From monthly files<br>to a clear market view.</h2><p>Import your inverter and battery worksheets to investigate trends, compare periods and prepare your next management review.</p><div class="empty-actions"><button class="primary" data-action="import">Import your first Excel file →</button><button class="quiet" data-action="demo">Explore fictional demo</button></div><div class="empty-facts">Excel matrices accepted directly · No restructuring needed<br>Files are processed on this device · No AI service required</div></div><div class="empty-steps"><div class="empty-step"><span>1</span><div><h3>Import & validate</h3><p>Choose the worksheet, check models and reconcile monthly totals.</p></div></div><div class="empty-step"><span>2</span><div><h3>Confirm your coverage</h3><p>Declare the expected models. Missing values remain distinct from zero.</p></div></div><div class="empty-step"><span>3</span><div><h3>Explore & present</h3><p>See product trends, explain changes and export the evidence.</p></div></div></div></section><div class="feature-row"><div><h3>Volumes & capacity</h3><p>Inverters, BMS and battery modules are reported separately. Capacity uses each module’s catalogue definition.</p></div><div><h3>Transparent comparisons</h3><p>Compare calendar periods, isolate the largest changes and inspect the original source cells.</p></div><div><h3>Context you can trust</h3><p>BMS ratios remain activation ratios. There is no assumed pairing between individual devices.</p></div></div>`;}
function card(title,m,prev,{unit='',ratio=false,digits=0}={}){const d=ratio?{delta:m.complete&&prev?.complete&&m.value!==null&&prev.value!==null?m.value-prev.value:null,pct:null}:D.difference(m,prev);return `<div class="kpi"><div class="kpi-label">${e(title)}<span class="badge">${ratio?'Ratio':'Calculated'}</span></div><div class="kpi-value">${number(m.value,digits)}<small>${e(unit)}</small></div><div class="kpi-foot">${d.delta!==null?`<strong class="${d.delta>=0?'up':'down'}">${signed(d.delta,ratio?1:0)}${ratio?(unit==='per 100'||unit==='%'?' pp':` ${e(unit)}`):''}${d.pct!==null?` (${signed(d.pct,1)}%)`:''}</strong>${d.label??''}`:e(m.value===null?m.status:'Recorded subtotal · '+m.status)}<br>${prev?.value!==null&&prev?.value!==undefined?`Comparison: ${number(prev.value,digits)}${unit==='%'?'':' '}${e(unit)}${prev.complete?'':' · '+e(prev.status)}`:'No complete comparison available'}</div></div>`;}
function notes(f){return `<details class="table-note"><summary>How to interpret these metrics</summary><p>Activations are recorded equipment activity, not sales, revenue, households or verified installations. One BMS per battery-equipped inverter is a user-provided analytical assumption. Retrofits, replacements, expansions and activation timing can distort BMS/inverter ratios. No individual equipment pairing is available. S1 module quantities cannot identify the number or configuration of installations.</p></details>`;}
function coverageNotice(state,f){const a=D.overview(state,f),needed=['inverter','bms','battery'].filter(k=>f.category==='All'||({inverter:'Inverter',bms:'BMS',battery:'Battery module'})[k]===f.category);if(needed.every(k=>a[k].complete))return '';return `<div class="notice"><p><strong>Reporting coverage needs attention.</strong> Available values are recorded subtotals. Complete growth statements and cross-category ratios are withheld until all required values and scope are confirmed.</p><button class="small" data-data-tab="coverage">Review coverage</button></div>`;}
const panel=(title,sub,body,actions='')=>`<section class="panel"><div class="panel-head"><div><h2>${title}</h2><p>${sub}</p></div>${actions}</div>${body}</section>`;
function eventsTimeline(state,f){const es=state.events.filter(x=>x.date.slice(0,7)>=f.start&&x.date.slice(0,7)<=f.end).sort((a,b)=>a.date.localeCompare(b.date));return es.length?`<div class="event-strip">${es.map(x=>`<button class="event-chip" data-event-detail="${e(x.id)}"><strong>${e(x.date)}</strong>${e(x.title)}</button>`).join('')}</div><p class="chart-note">Dated context. Timing alone does not establish causation.</p>`:'';}
function overviewView(state,ui){if(!Object.keys(state.records).length)return emptyView(state);const f=state.preferences,c=D.comparisonPeriod(f),a=D.overview(state,f),b=D.overview(state,{...f,start:c.start,end:c.end}),fs=D.findings(state,f);const cats=D.CATEGORIES.filter(x=>f.category==='All'||f.category===x),series=ui.trendMetric==='capacity'?[{name:'Battery capacity',color:'#176b78',points:D.trend(state,f,'Battery module',true)}]:cats.map(category=>({name:category,points:D.trend(state,f,category)}));const ratioScope=f.category==='All'&&f.family==='All'&&f.model==='All';return heading(state,'Activation overview','Equipment activity, product mix and the changes that matter.')+coverageNotice(state,f)+
`<div class="kpi-grid">${card('Inverter activations',a.inverter,b.inverter)}${card('BMS activations',a.bms,b.bms)}${card('Battery modules',a.battery,b.battery)}${card('Activated battery capacity',a.capacity,b.capacity,{unit:'kWh'})}${card('BMS / Inverter',a.attachment,b.attachment,{unit:'%',ratio:true,digits:1})}${card('Activated kWh per BMS',a.kwhPerBms,b.kwhPerBms,{unit:'kWh/BMS',ratio:true,digits:1})}</div>`+
(fs.length?`<div class="section-label"><h2>What changed</h2><small>Rule-based findings · validated comparisons</small></div><div class="findings">${fs.map(x=>`<article class="finding"><h3>${e(x.title)}</h3><p>${e(x.text)}</p></article>`).join('')}</div>`:'')+
(a.attachment.value>100?'<div class="notice"><p><strong>BMS activations exceed inverter activations.</strong> Review retrofits, replacements and activation timing. The ratio is intentionally not capped at 100.</p></div>':'')+panel('Activation trend',`${e(rangeLabel(f.start,f.end))} · ${e(f.aggregation)} aggregation · ${ui.trendMetric==='capacity'?'kWh':'activations'} · ${e(f.model==='All'?'All selected models':f.model)}`,`<div class="chart-scroll">${lineChart(series,{hidden:ui.hiddenSeries,unit:ui.trendMetric==='capacity'?'kWh':'activations',id:'overview'})}</div>${eventsTimeline(state,f)}<details class="table-note"><summary>Underlying values</summary>${trendTable(series)}</details>`,`<div class="panel-actions"><select id="trend-metric" aria-label="Trend metric">${option('volume','Equipment volumes',ui.trendMetric)}${option('capacity','Battery capacity (kWh)',ui.trendMetric)}</select><button class="small editing" data-action="event">Add event</button></div>`)+
(ratioScope?[['bmsPer100','BMS / Inverter','%'],['modulesPerBms','Battery modules per BMS','modules/BMS'],['kwhPerBms','Activated kWh per BMS','kWh/BMS']].map(([key,label,unit])=>panel(label,'Historical aggregate activation ratio',`<div class="chart-scroll">${lineChart([{name:label,model:'All',points:D.kpiTrend(state,{...f,kpi:key})}],{id:'kpi-'+key,unit,title:label,hidden:ui.hiddenSeries})}</div>`)).join(''):'')+`<div class="grid-equal">${panel('Longer-term view',`Windows ending ${e(labelMonth(f.end))} · selected product filters`,rollingTable(state,f))}${panel('BMS / Inverter','Aggregate BMS ÷ aggregate inverter activations · expressed as %',ratioScope?rollingRatios(state,f):'<p class="table-note">Reset product filters to analyse this overall ratio. BMS units cannot be allocated to individual inverter models.</p>')}</div>`+notes(f);
}
function trendTable(series){const ps=series[0]?.points??[];return `<div class="table-wrap"><table><thead><tr><th>Period</th>${series.map(s=>`<th class="num">${e(s.name)}</th>`).join('')}</tr></thead><tbody>${ps.map((p,i)=>`<tr><td>${e(p.label)}</td>${series.map(s=>`<td class="num">${number(s.points[i]?.value,1)} ${s.points[i]?.complete?'':'*'}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p>* Incomplete observation; see reporting coverage.</p>`;}
function rollingTable(state,f){const rows=D.CATEGORIES.filter(c=>f.category==='All'||c===f.category).map(c=>{const opts={model:f.model,family:f.family},ytd=D.metric(state,`${f.end.slice(0,4)}-01`,f.end,c,opts),r=D.metric(state,D.shiftMonth(f.end,-11),f.end,c,opts),p=D.metric(state,D.shiftMonth(f.end,-23),D.shiftMonth(f.end,-12),c,opts),ma=D.movingAverage(state,f.end,c,opts),d=D.difference(r,p);return `<tr><td>${e(c)}</td><td class="num">${number(ytd.value)}${ytd.complete?'':'*'}</td><td class="num">${number(r.value)}${r.complete?'':'*'}</td><td class="num">${number(p.value)}${p.complete?'':'*'}</td><td class="num">${signed(d.delta)}</td><td class="num">${number(ma.value,1)}</td></tr>`;});return `<div class="table-wrap"><table><thead><tr><th>Activations</th><th class="num">YTD</th><th class="num">Last 12m</th><th class="num">Prior 12m</th><th class="num">Δ</th><th class="num">3m average</th></tr></thead><tbody>${rows.join('')}</tbody></table></div><p class="table-note">* Recorded subtotal. Moving averages require 3 complete months.<br>Last 12m: ${rangeLabel(D.shiftMonth(f.end,-11),f.end)}. Prior 12m: ${rangeLabel(D.shiftMonth(f.end,-23),D.shiftMonth(f.end,-12))}.</p>`;}
function rollingRatios(state,f){return `<div class="ratios">${[3,12].map(n=>{const s=D.shiftMonth(f.end,1-n),b=D.metric(state,s,f.end,'BMS'),i=D.metric(state,s,f.end,'Inverter'),r=D.ratio(b,i,100);return `<div class="ratio-stat"><small>Rolling ${n} months</small><strong>${number(r.value,1)}%</strong><p>${rangeLabel(s,f.end)}<br>${number(b.value)} BMS / ${number(i.value)} inverters<br>${e(r.status)}${r.value>100?' · Above 100: review retrofits, replacements and timing.':''}</p></div>`;}).join('')}</div><p class="table-note">Longer windows reduce timing effects. They do not eliminate retrofit or replacement effects.</p>`;}
function inverterPhaseTrend(state,f,selected='All') {
 const months=D.monthsBetween(f.start,f.end);
 return ['Single-phase','Three-phase'].filter(phase=>selected==='All'||phase===selected).map(phase=>({
 name:phase,model:'All',points:months.map(month=>{
  const products=D.selectModels(state,{category:'Inverter',model:f.model,family:f.family}).filter(p=>p.phase===phase&&D.applicable(p,month));
  const cover=state.coverage[month+'|Inverter'];
  const expected=products.filter(p=>cover?.expected?.includes(p.model));
  const records=products.map(p=>({model:p.model,value:state.records[D.keyOf(month,p.model)]?.quantity})).filter(r=>Number.isSafeInteger(r.value));
  const undeclared=records.some(r=>!cover?.expected?.includes(r.model));
  const complete=!!cover?.confirmed && month<=D.closedMonth() && expected.length>0 && !undeclared &&
    expected.every(p=>Number.isSafeInteger(state.records[D.keyOf(month,p.model)]?.quantity));
  return {label:month,value:records.length?records.reduce((sum,r)=>sum+r.value,0):complete?0:null,
    complete,status:complete?'Complete':'Partial / check scope',start:month,end:month};
 })
 }));
}
function phaseComparisonPanel(state,f,ui){
 const raw=inverterPhaseTrend(state,f,ui.gridPhase??'All');
 const mode=ui.phaseChartMode??'indexed',index=indexedSeries(raw),normalized=mode==='indexed';
 const selected=normalized?index.series:raw;
 const subtitle=normalized?'Relative activation trend · common start = 100 (not absolute volume)':'Observed inverter activations by grid phase · absolute number of units';
 const info=normalized&&index.baseLabel?`<p class="chart-note">Both series use ${e(index.baseLabel)} as the same 100-point baseline. ${index.provisional?'The baseline contains provisional observations. ':''}Actual activation counts are available in each point’s tooltip and in Absolute activations mode.</p>`:
 normalized?'<p class="chart-note">A normalized comparison needs at least one period with positive observations in every visible phase. Switch to absolute values to inspect available data.</p>':'<p class="chart-note">The two phases share an absolute scale. Check the original volumes before drawing conclusions about market size.</p>';
 const control=`<label class="field editing">View<select id="phase-chart-mode">${option('indexed','Trend index (base 100)',mode)}${option('absolute','Absolute activations',mode)}</select></label>`;
 return panel('Single-phase vs Three-phase',subtitle,
 `<div class="chart-scroll">${lineChart(selected,{hidden:ui.hiddenSeries,id:'phase',title:'Inverter activations by grid phase',unit:normalized?'index (base 100)':'activations'})}</div>${info}`,
 control);
}
const INVERTER_CHART_MAX=16;
function selectedInverterModels(rows,selection=null){
  if(selection===null)return rows.slice(0,8);
  if(!Array.isArray(selection))return [];
  const names=new Set(selection);
  return rows.filter(row=>names.has(row.model));
}
function inverterChartPicker(rows,selected,ui){
 const open=!!ui.inverterPickerOpen,query=(ui.inverterModelSearch??'').trim().toLowerCase(),selectedNames=new Set(selected.map(row=>row.model));
 const matches=rows.filter(row=>row.model.toLowerCase().includes(query));
 const actions=`<div class="panel-actions editing"><span class="model-count">${selected.length} / ${rows.length} models plotted</span><button class="small" data-action="inverter-chart-picker" aria-expanded="${open}">${open?'Close selector':'Choose models'}</button><button class="small" data-action="inverter-chart-top">Reset to Top 8</button></div>`;
 const form=open?`<section class="model-picker editing" aria-label="Select inverter models"><div class="model-picker-toolbar"><label class="field">Search all inverter models<input id="inverter-model-search" type="search" value="${e(ui.inverterModelSearch??'')}" placeholder="Model code, e.g. SUN2000-17K…" autocomplete="off"></label><button class="small" data-action="inverter-chart-clear">Clear all</button></div>
  <p class="table-note">All ${rows.length} in-scope inverter models are available, not just the Top 8. Select up to ${INVERTER_CHART_MAX} at once.</p>
  <div class="model-picker-list" role="group" aria-label="Inverter models">${matches.map(row=>`<button type="button" class="model-picker-choice ${selectedNames.has(row.model)?'selected':''}" data-inverter-chart-model="${e(row.model)}" aria-pressed="${selectedNames.has(row.model)}"><span class="model-picker-indicator" aria-hidden="true">${selectedNames.has(row.model)?'✓':'+'}</span><span class="model-picker-name">${e(row.model)}</span><span class="model-picker-volume">${row.current.value===null?'No observations':number(row.current.value)+' activations'}</span></button>`).join('')||'<p class="table-note">No model matches your search.</p>'}</div></section>`:'';
 return {actions,form};
}
function inverterView(state,ui){const f={...state.preferences},phase=ui.gridPhase??'All',phaseRows=D.ranking(state,f,'Inverter').filter(x=>phase==='All'||state.catalog[x.model]?.phase===phase),phaseTotal=phaseRows.every(x=>x.current.complete)?phaseRows.reduce((n,x)=>n+(x.current.value??0),0):null,r=phaseRows.map(x=>({...x,share:phaseTotal>0?x.current.value/phaseTotal*100:null})),show=selectedInverterModels(r,ui.inverterSelectedModels??null),picker=inverterChartPicker(r,show,ui),series=show.map(row=>({name:row.model,model:row.model,points:D.trend(state,f,'Inverter',false,row.model)}));if(f.category!=='All'&&f.category!=='Inverter')return heading(state,'Inverters','Trends, product mix and contributions to change.')+'<div class="notice">The category filter excludes inverters. Select Inverter or All categories.</div>';return heading(state,'Inverters','Trends, product mix and contributions to change.')+coverageNotice(state,{...f,category:'Inverter'})+
phaseComparisonPanel(state,f,ui)+panel('Inverter activations by model',`${e(rangeLabel(f.start,f.end))} · activations · ${e(f.aggregation)} · ${ui.inverterSelectedModels===null?'Top 8 default':show.length+' selected model(s)'}`,`${picker.form}<div class="chart-scroll">${lineChart(series,{hidden:ui.hiddenSeries,id:'inverters',title:'Inverter activations by model'})}</div><p class="table-note">This model selection changes only this chart. Rankings, product mix and KPIs keep their existing filters.</p>`,picker.actions)+`<div class="grid-equal">${panel('Volume ranking','Recorded activations · selected period',barChart(r.slice(0,12).map(x=>({label:x.model,model:x.model,value:x.current.value}))))}${panel('Contribution to change','Signed absolute change · complete periods only',barChart([...r].sort((a,b)=>Math.abs(b.delta??0)-Math.abs(a.delta??0)).slice(0,12).map(x=>({label:x.model,model:x.model,value:x.delta})),{signed:true}))}</div>`+
panel('Product mix','Share of recorded inverter activations · partial data can change these shares',stackedMix(r.map(x=>({label:x.model,model:x.model,value:x.current.value}))))+rankingTable(r,ui,'Inverter')+notes(f);}
function rankingTable(rows,ui,category){const filtered=rows.filter(r=>r.model.toLowerCase().includes((ui.tableSearch??'').toLowerCase()));return panel(`${e(category)} model detail`,'Every row opens source evidence and calculations',`<div class="table-wrap"><table><thead><tr><th>Product model</th><th class="num">Current</th><th class="num">Comparison</th><th class="num">Absolute Δ</th><th class="num">Change</th><th class="num">Share</th><th>Coverage</th></tr></thead><tbody>${filtered.map(r=>`<tr><td><button class="text-button" data-model-detail="${e(r.model)}">${e(r.model)}</button></td><td class="num">${number(r.current.value)}</td><td class="num">${number(r.previous.value)}</td><td class="num">${signed(r.delta)}</td><td class="num">${r.pct===null?(r.previous.value===0&&r.previous.complete?'No % baseline':'—'):signed(r.pct,1)+'%'}</td><td class="num">${r.share===null?'—':number(r.share,1)+'%'}</td><td>${badge(r.current.status)}</td></tr>`).join('')||'<tr><td colspan="7">No matching product records.</td></tr>'}</tbody></table></div>`,`<input class="editing" id="table-search" type="search" placeholder="Search model…" aria-label="Search product models" value="${e(ui.tableSearch??'')}">`);}
function batteriesView(state,ui){const f=state.preferences,c=D.comparisonPeriod(f),r=D.ranking(state,f,'Battery module'),b=D.ranking(state,f,'BMS'),capacity=ui.mixBasis==='capacity';if(f.category==='Inverter')return heading(state,'Batteries & BMS','Activated capacity, family mix and compatible BMS ratios.')+'<div class="notice">The category filter excludes batteries and BMS. Select All categories, Battery module or BMS.</div>';const selectedCats=['Battery module','BMS'].filter(x=>f.category==='All'||f.category===x),series=selectedCats.flatMap(cat=>D.selectModels(state,{category:cat,model:f.model,family:f.family}).map(p=>({name:p.model,model:p.model,points:D.trend(state,f,cat,false,p.model)})));const families=['S0','S1'].filter(fam=>f.family==='All'||f.family===fam);return heading(state,'Batteries & BMS','Module volume, activated capacity and family-specific activation ratios.')+coverageNotice(state,f)+
`<div class="grid-equal">${families.map(fam=>{const a=D.familyRatios(state,f,fam),p=D.familyRatios(state,{...f,start:c.start,end:c.end},fam),allowed=f.model==='All'&&f.category==='All';return panel(`${fam} family`,`Compatible BMS: ${fam==='S0'?'LUNA2000-5KW-C0':'LUNA2000-10KW-C1'}`,allowed?`<div class="ratios"><div class="ratio-stat"><small>Activated capacity</small><strong>${number(a.capacity.value)} <small>kWh</small></strong><p>${number(a.battery.value)} modules · ${number(a.bms.value)} BMS<br>${e(a.capacity.status)}</p></div><div class="ratio-stat"><small>Activation ratios</small><strong>${number(a.kwhPerBms.value,1)} <small>kWh / BMS</small></strong><p>${number(a.modulesPerBms.value,2)} modules / BMS<br>${e(a.kwhPerBms.status)}</p></div></div><p class="table-note">Comparison capacity: ${number(p.capacity.value)} kWh. Ratios use only modules explicitly compatible with this BMS. They are activation ratios, not verified installation configurations.</p>`:'<p class="table-note">Select All categories and All models to calculate family activation ratios with the correct module and BMS scope.</p>');}).join('')}</div>`+
panel('Equipment activation trend',`${e(rangeLabel(f.start,f.end))} · activations · selected models and families`,`<div class="chart-scroll">${lineChart(series,{hidden:ui.hiddenSeries,id:'batteries'})}</div>`)+
(f.category!=='BMS'?panel('Battery module mix',`${capacity?'Activated capacity (kWh)':'Number of modules'} · share of recorded subtotal`,stackedMix(r.map(x=>({label:x.model,model:x.model,value:x.current.value===null?null:x.current.value*(capacity?state.catalog[x.model].capacity:1)})),capacity?'kWh':'modules'),`<select id="mix-basis" aria-label="Battery share basis">${option('modules','By number of modules',ui.mixBasis)}${option('capacity','By activated capacity',ui.mixBasis)}</select>`)+rankingTable(r,ui,'Battery module'):'')+
(f.category!=='Battery module'?panel('BMS product mix','C0 and C1 share of recorded BMS activations',stackedMix(b.map(x=>({label:x.model,model:x.model,value:x.current.value}))))+rankingTable(b,ui,'BMS'):'')+notes(f);}
function quarterlyIntelligence(state,ui){
 const years=[...new Set(Object.keys(state.coverage).map(x=>Number(x.slice(0,4))))].filter(y=>Number.isInteger(y)&&y>=1900&&y<=9999).sort((a,b)=>a-b);
 const selected=years.length?years:[],q=ui.quarter??3,kpi=ui.quarterMetric??'inverters';
 const points=selected.length?D.sameQuarterYears(state,{quarter:q,years:selected,kpi}):[];
 const prior=points.slice(0,-1),last=points.at(-1),prev=prior.at(-1);
 const valueOf=x=>x?.complete?x.value:null;
 const d=last&&prev&&kpi!=='bmsPer100'&&kpi!=='modulesPerBms'&&kpi!=='kwhPerBms'?D.difference(last,prev):null;
 return panel('Quarterly Intelligence','Compare the same calendar quarter across available years, without mixing Q1 with Q2',
 `<div class="form-row editing"><label class="field">Quarter<select id="quarter-select">${[1,2,3,4].map(n=>option(String(n),'Q'+n,String(q))).join('')}</select></label><label class="field">Metric<select id="quarter-metric">${[['inverters','Inverter activations'],['bms','BMS activations'],['modules','Battery modules'],['capacity','Battery capacity (kWh)'],['bmsPer100','BMS / Inverter (%)'],['modulesPerBms','Modules per BMS'],['kwhPerBms','kWh per BMS']].map(([v,l])=>option(v,l,kpi)).join('')}</select></label></div>`+
 (points.length?`<div class="chart-scroll">${lineChart([{name:kpi==='bmsPer100'?'BMS / Inverter':kpi,model:'All',points}],{id:'quarterly',title:'Same-quarter KPI year by year',unit:kpi==='capacity'?'kWh':kpi==='kwhPerBms'?'kWh/BMS':kpi==='bmsPer100'?'%':'ratio or activations',hidden:ui.hiddenSeries})}</div><div class="table-wrap"><table><thead><tr><th>Quarter</th><th class="num">KPI</th><th>Status</th><th class="num">Year-on-year change</th></tr></thead><tbody>${points.map((p,i)=>{const previous=points.find(x=>x.year===p.year-1),delta=previous&&valueOf(p)!==null&&valueOf(previous)!==null?p.value-previous.value:null;return `<tr><td>${e(p.label)}</td><td class="num">${number(p.value,kpi==='bmsPer100'?1:2)}${kpi==='bmsPer100'&&p.value!==null?'%':''}</td><td>${badge(p.complete?'Complete':p.status)}</td><td class="num">${delta===null?'—':signed(delta,kpi==='bmsPer100'?1:2)+(kpi==='bmsPer100'?' pp':'')}</td></tr>`}).join('')}</tbody></table></div>`:'<p class="table-note">Import activation records and confirm coverage to compare quarters.</p>')+
 '<p class="table-note">Ratios use aggregate equipment activations, not verified installation pairings. Incomplete quarters are shown as provisional observations; definitive changes require complete coverage. An open quarter is never complete.</p>');
}
// This visualization uses the EXACT monthly pairs already computed for the evidence table.
// Position on the x-axis is current-window month; comparison tooltips carry their actual month.
function comparisonEvidenceSeries(rows,{model='All'}={}){
 const point=(row,item,isComparison)=>({
   label:labelMonth(isComparison?row.comparison:row.month),
   value:item?.value??null,complete:!!item?.complete,status:item?.status??'No matching month',
   start:isComparison?row.comparison:row.month,end:isComparison?row.comparison:row.month
 });
 return [
 {name:'Current period',color:'#c8102e',model,points:rows.map(row=>point(row,row.x,false))},
 {name:'Comparison period',color:'#176b78',model,points:rows.map(row=>point(row,row.y,true))}
 ];
}
function comparisonsView(state,ui){const f=state.preferences,c=D.comparisonPeriod(f),category=ui.compareMetric==='capacity'?'Battery module':ui.compareMetric,capacity=ui.compareMetric==='capacity',opts={model:f.model,family:f.family,capacity},a=D.metric(state,f.start,f.end,category,opts),b=D.metric(state,c.start,c.end,category,opts),ms=D.monthsBetween(f.start,f.end),cs=D.monthsBetween(c.start,c.end),d=D.difference(a,b),unit=capacity?'kWh':'activations';if(f.category!=='All'&&f.category!==category)return heading(state,'Period comparisons','Compare like-for-like periods and locate the changes.')+`<div class="notice">Select a metric that matches the category filter.</div>${metricSelect(ui.compareMetric)}`;
const rows=Array.from({length:Math.max(ms.length,cs.length)},(_,i)=>{const x=ms[i]?D.metric(state,ms[i],ms[i],category,opts):null,y=cs[i]?D.metric(state,cs[i],cs[i],category,opts):null;return {month:ms[i],comparison:cs[i],x,y,d:D.difference(x,y)};});
return heading(state,'Period comparisons','Compare like-for-like periods and locate the changes.')+quarterlyIntelligence(state,ui)+`<div class="form-row editing">${metricSelect(ui.compareMetric)}</div>`+(ms.length!==cs.length?`<div class="notice"><strong>Different durations:</strong> ${ms.length} current months versus ${cs.length} comparison months. Monthly averages are shown alongside totals.</div>`:'')+`<div class="kpi-grid">${card('Current period',a,b,{unit})}<div class="kpi"><div class="kpi-label">Current monthly average</div><div class="kpi-value">${number(a.value===null?null:a.value/ms.length,1)}<small>${unit}</small></div><div class="kpi-foot">${ms.length} months · ${e(a.status)}</div></div><div class="kpi"><div class="kpi-label">Comparison monthly average</div><div class="kpi-value">${number(b.value===null?null:b.value/cs.length,1)}<small>${unit}</small></div><div class="kpi-foot">${cs.length} months · ${e(b.status)}</div></div></div>`+
panel('Period totals',`${e(rangeLabel(f.start,f.end))} versus ${e(rangeLabel(c.start,c.end))} · ${unit}`,barChart([{label:'Current period',value:a.value,color:'#c8102e',model:'All'},{label:'Comparison period',value:b.value,color:'#8293a0',model:'All'}]))+
panel('Monthly profile',`${unit} · months in the current and comparison windows · gaps remain missing`,heatmap(state,ms,cs,category,opts))+
panel('Monthly contribution to change','Paired months · signed absolute differences · complete observations only',ms.length===cs.length?barChart(rows.map(r=>({label:`${labelMonth(r.month)} vs ${labelMonth(r.comparison)}`,value:r.d.delta,model:'All'})),{signed:true,unit}):'<p class="table-note">Contribution bars are withheld for unequal interval lengths. Use the table below.</p>')+
panel('Comparison evidence',`${e(category)} · ${unit} · ${e(f.model)} · ${e(f.family)}`,`<p class="table-note">Lines compare months by their position in the selected windows, not by matching calendar month. The horizontal axis uses current-period months; hover/select a comparison point to see its actual historical month. Hollow points and dashed segments indicate partial coverage. Missing values remain gaps.</p><div class="chart-scroll">${lineChart(comparisonEvidenceSeries(rows,{model:f.model}),{unit,title:'Current versus comparison monthly activation evidence',id:'comparison-evidence'})}</div><div class="table-wrap"><table><thead><tr><th>Current month</th><th class="num">Current</th><th>Comparison month</th><th class="num">Comparison</th><th class="num">Absolute Δ</th><th class="num">Change</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.month?`<button class="text-button" data-month="${r.month}">${labelMonth(r.month)}</button>`:'—'}</td><td class="num">${number(r.x?.value)}${r.x&&!r.x.complete?'*':''}</td><td>${labelMonth(r.comparison)}</td><td class="num">${number(r.y?.value)}${r.y&&!r.y.complete?'*':''}</td><td class="num">${signed(r.d.delta)}</td><td class="num">${r.d.pct===null?(r.y?.complete&&r.y?.value===0?'No % baseline':'—'):signed(r.d.pct,1)+'%'}</td></tr>`).join('')}</tbody></table></div><p class="table-note">* Incomplete observed subtotal. No definitive growth calculation is made for an incomplete pair.</p>`);
}
function metricSelect(selected){return `<label class="field">Comparison metric<select id="compare-metric">${[...D.CATEGORIES,'capacity'].map(x=>option(x,x==='capacity'?'Activated battery capacity':x,selected)).join('')}</select></label>`;}
function heatmap(state,ms,cs,category,opts){const all=[...new Set([...ms,...cs])],years=[...new Set(all.map(m=>m.slice(0,4)))].sort(),data=all.map(m=>({month:m,...D.metric(state,m,m,category,opts)})),max=Math.max(1,...data.map(x=>x.value??0));return `<div class="table-wrap"><table class="heatmap"><thead><tr><th>Year</th>${Array.from({length:12},(_,i)=>`<th>${new Intl.DateTimeFormat('en',{month:'short',timeZone:'UTC'}).format(new Date(Date.UTC(2024,i,1)))}</th>`).join('')}</tr></thead><tbody>${years.map(y=>`<tr><th>${y}</th>${Array.from({length:12},(_,i)=>{const month=`${y}-${String(i+1).padStart(2,'0')}`,m=data.find(x=>x.month===month);return `<td><button ${m?'':'disabled'} data-month="${month}" class="heat-cell" style="--heat:${m?.value===null||!m?'#f5f6f8':`rgba(182,16,42,${.06+(m.value/max)*.76})`};--heattext:${m?.value/max>.5?'white':'#35404c'}" title="${month}: ${m?number(m.value)+' · '+m.status:'Outside selected periods'}">${m?number(m.value)+(m.complete?'':'*'):'—'}</button></td>`;}).join('')}</tr>`).join('')}</tbody></table></div><p class="chart-note">Darker cells indicate higher volume. * Incomplete data. A recorded zero displays 0.</p>`;}

function targetsView(state){const f=state.preferences,products=D.selectModels(state,f),categories=D.CATEGORIES.filter(c=>f.category==='All'||c===f.category),ts=Object.values(state.targets).filter(t=>t.month>=f.start&&t.month<=f.end&&categories.includes(t.category)&&(f.model==='All'||t.scope===f.model)&&(f.family==='All'||state.catalog[t.scope]?.family===f.family)).sort((a,b)=>a.month.localeCompare(b.month)||a.scope.localeCompare(b.scope));return heading(state,'Performance targets','Monthly activation targets with an explicit category-first hierarchy.')+
`<div class="notice info"><p>For an unfiltered category, its explicit monthly target takes priority over model targets. Without a category target, all expected model targets must be present. Model or family filters use model targets only. Missing targets are never treated as zero.</p></div>`+
panel('Target attainment',`${rangeLabel(f.start,f.end)} · activations · applied product filters`,`<div class="table-wrap"><table><thead><tr><th>Category</th><th class="num">Actual</th><th class="num">Target</th><th class="num">Attainment</th><th class="num">Actual − target</th><th>Coverage</th></tr></thead><tbody>${categories.map(c=>{const s=D.targetSummary(state,f.start,f.end,c,f.model,f.family);return `<tr><td>${c}</td><td class="num">${number(s.actual.value)}</td><td class="num">${number(s.target)}</td><td class="num">${s.attainment===null?(s.target===0?'No % baseline':'—'):number(s.attainment,1)+'%'}</td><td class="num">${signed(s.gap)}</td><td>${s.missing.length?'Missing targets: '+e(s.missing.join(', ')):e(s.actual.status)}</td></tr>`;}).join('')}</tbody></table></div>`)+
panel('Add or replace a monthly target','A value of zero is allowed and has no attainment percentage.',`<form data-form="target" class="editing"><div class="form-row"><label class="field">Month<input type="month" name="month" value="${f.end}" required></label><label class="field">Category or model<select name="scope">${D.CATEGORIES.map(c=>option(c,c,'')).join('')}${Object.values(state.catalog).map(p=>option(p.model,p.model,'')).join('')}</select></label><label class="field">Target activations<input name="value" type="number" min="0" step="1" required placeholder="Enter target"></label><button class="primary" type="submit">Review target</button></div></form>`)+
panel('Saved monthly targets','Selected period and scope',`<div class="table-wrap"><table><thead><tr><th>Month</th><th>Scope</th><th class="num">Target</th><th>Hierarchy</th><th class="editing">Action</th></tr></thead><tbody>${ts.map(t=>{const parent=state.targets[D.targetKey(t.month,t.category)];return `<tr><td>${labelMonth(t.month)}</td><td>${e(t.scope)}</td><td class="num">${number(t.value)}</td><td>${D.CATEGORIES.includes(t.scope)?'Category override':parent?'Model target; category override also exists':'Model target'}</td><td class="editing"><button class="small" data-delete-target="${e(D.targetKey(t.month,t.scope))}">Remove</button></td></tr>`;}).join('')||'<tr><td colspan="5">No targets in this period. Add your first monthly target above.</td></tr>'}</tbody></table></div>`);}

const DATA_TABS=[['import','Import centre'],['records','Recorded data'],['coverage','Coverage'],['catalogue','Product catalogue'],['history','History'],['backup','Backup & guide']];
function dataView(state,ui){const bodies={import:importView,records:recordsView,coverage:coverageView,catalogue:catalogueView,history:historyView,backup:backupView};return heading(state,'Data workspace','Import snapshots, confirm reporting scope and inspect your evidence.')+`<div class="tabs editing" role="tablist" aria-label="Data workspace">${DATA_TABS.map(([v,t])=>`<button role="tab" aria-selected="${ui.dataTab===v}" class="${ui.dataTab===v?'active':''}" data-data-tab="${v}">${t}</button>`).join('')}</div>`+(bodies[ui.dataTab]??importView)(state,ui);}
function importView(state,ui){const p=ui.pending,v=p?.validation,preview=v?D.importPreview(state,v):[],counts={};preview.forEach(r=>counts[r.action]=(counts[r.action]??0)+1);return `<div class="import-progress"><span class="${!p?'active':''}">1 · Choose dataset & file</span><span class="${p&&!v?'active':''}">2 · Confirm worksheet</span><span class="${v?'active':''}">3 · Validate & review</span><span>4 · Confirm import</span></div><div class="import-grid"><section class="panel"><div class="panel-head"><div><h2>Import a monthly snapshot</h2><p>Excel .xlsx or CSV · models in rows, YYYYMM months in columns</p></div></div><div class="form-row"><label class="field">Dataset<select id="dataset">${option('unified','Unified — all equipment',ui.dataset)}${option('inverters','Inverters only (legacy)',ui.dataset)}${option('batteries','Battery modules & BMS (legacy)',ui.dataset)}</select></label></div><label class="dropzone" id="dropzone"><strong>Drop your workbook here</strong><span>Or choose a file from your device · maximum 30 MB</span><input id="import-file" type="file" accept=".xlsx,.csv" aria-label="Choose activation workbook" ${ui.loading?'disabled':''}></label>${ui.loading?'<div class="notice info" style="margin-top:16px">Reading and validating your workbook…</div>':''}${ui.importError?`<div class="notice error" style="margin-top:16px">${e(ui.importError)}</div>`:''}<p class="table-note">Files stay in your browser. One confirmed import updates all included categories together. Identical reimports do not duplicate quantities. Blank incoming cells retain previously recorded values.</p></section><section class="panel"><div class="panel-head"><div><h2>Expected structure</h2><p>Unified uses one worksheet with inverter, battery module and BMS rows.</p></div></div><div class="table-wrap"><table><thead><tr><th>index</th><th>202601</th><th>202602</th></tr></thead><tbody><tr><td>Product model</td><td>Quantity</td><td>Quantity</td></tr><tr><td>=== 总计 ===</td><td>Total</td><td>Total</td></tr></tbody></table></div><p class="table-note">Unified: list all three equipment categories in any order, using exact model codes. Add at most one grand Total row combining all products. Totals are controls, never activations. Blank means missing; 0 means confirmed zero. Formulas need saved numeric results.</p><div class="panel-actions"><a class="download-link" href="templates/Inverter_Import_Template.xlsx" download>Inverter .xlsx template</a><a class="download-link" href="templates/Battery_BMS_Import_Template.xlsx" download>Battery & BMS .xlsx template</a></div><p class="table-note"><button class="text-button" data-action="template-unified">Download Unified CSV (opens in Excel)</button> · <button class="text-button" data-action="template-inverters">Inverter CSV</button> · <button class="text-button" data-action="template-batteries">Battery & BMS CSV</button></p></section></div>`+
(p?panel('Confirm the source table',`${e(p.filename)} · ${e(p.sheet)}`,`<div class="form-row"><label class="field">Worksheet<select id="worksheet">${p.workbook.names.map(n=>option(n,n,p.sheet)).join('')}</select></label><label class="field">Header row (Excel row number)<input id="header-row" type="number" min="1" max="${Math.max(1,p.rows.length)}" value="${p.headerRow+1}"></label><button data-action="revalidate">Validate table</button></div>${p.headerUncertain?'<div class="notice">Header detection is uncertain. Confirm the correct row above.</div>':''}<div class="table-wrap import-review"><table><thead><tr><th>Excel row</th>${(p.rows[p.headerRow]??[]).map((x,i)=>`<th>${e(D.columnName(i))}: ${e(D.cellValue(x))}</th>`).join('')}</tr></thead><tbody>${p.rows.slice(p.headerRow+1,p.headerRow+9).map((r,i)=>`<tr><th>${p.headerRow+i+2}</th>${Array.from({length:p.rows[p.headerRow]?.length??0},(_,j)=>`<td>${e(D.cellValue(r[j])??'Missing')}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="table-note">Preview: first 8 product rows. Validation reads the full selected worksheet.</p>`):'')+
(v?panel('Validation & proposed changes','No data is saved until you confirm the import.',`<div class="preview-stats"><span><strong>${v.months.length}</strong>months</span><span><strong>${v.models.length}</strong>models</span>${D.CATEGORIES.map(cat=>`<span><strong>${v.models.filter(m=>({...state.catalog,...p.classifications})[m]?.category===cat).length}</strong>${e(cat)}</span>`).join("")}<span><strong>${counts.New??0}</strong>new values</span><span><strong>${counts.Replace??0}</strong>replacements</span><span><strong>${counts.Unchanged??0}</strong>unchanged</span><span><strong>${v.records.filter(r=>r.quantity===null).length}</strong>missing cells</span></div>
${v.unknown.length?`<div class="validation-box warning"><h3>Classify ${v.unknown.length} new product model${v.unknown.length===1?'':'s'}</h3><p class="table-note">Choose Inverter, Battery module or BMS for each unknown model. Selecting a category outside a legacy dataset switches this import to Unified after confirmation. For new inverters enter rated kW and grid phase.</p><form data-form="classify">${v.unknown.map((m,i)=>`<div class="form-row"><label class="field">${e(m)}<select name="category-${i}" required>${option('','Choose category','')}${D.CATEGORIES.map(c=>option(c,c,'')).join('')}</select></label><label class="field">Family (optional)<input name="family-${i}" placeholder="e.g. S1"></label><label class="field">Capacity (battery modules only)<input name="capacity-${i}" type="number" step="any" min="0.001" placeholder="kWh"></label><label class="field">Compatible BMS (optional)<select name="bms-${i}">${option('','Not specified','')}${Object.values({...state.catalog,...p.classifications}).filter(x=>x.category==='BMS').map(x=>option(x.model,x.model,'')).join('')}</select></label><label class="field">Inverter rated power (kW)<input name="power-${i}" type="number" min="0.001" step="any" placeholder="Inverter only"></label><label class="field">Inverter grid phase<select name="phase-${i}">${option('','Choose for inverter','')}${option('Single-phase','Single-phase','')}${option('Three-phase','Three-phase','')}</select></label></div>`).join('')}<button class="primary" type="submit">Confirm classifications & revalidate</button></form></div>`:''}
${v.errors.length?`<div class="validation-box error"><h3>${v.errors.length} blocking validation error${v.errors.length===1?'':'s'}</h3><ul class="validation-list">${v.errors.map(x=>`<li>${e(x)}</li>`).join('')}</ul></div>`:`<div class="validation-box"><h3>Quantity and total checks passed</h3><p class="table-note">${v.totalsFound} supplied total row${v.totalsFound===1?'':'s'} recognised. ${v.unknown.length?'Model classification is still required.':'All models are classified.'}</p></div>`}
${v.warnings.length?`<details class="validation-box warning"><summary>${v.warnings.length} warning${v.warnings.length===1?'':'s'} / missing-value notes</summary><ul class="validation-list">${v.warnings.map(x=>`<li>${e(x)}</li>`).join('')}</ul></details>`:''}
<details ${counts.Replace?'open':''}><summary>Review all incoming values and changes (${preview.length})</summary><div class="table-wrap import-review"><table><thead><tr><th>Month</th><th>Model</th><th>Category</th><th class="num">Previous</th><th class="num">Incoming</th><th class="num">Difference</th><th>Proposed action</th><th>Source cell</th></tr></thead><tbody>${preview.map(r=>`<tr><td>${r.month}</td><td>${e(r.model)}</td><td>${e(({...state.catalog,...p.classifications})[r.model]?.category??'Unclassified')}</td><td class="num">${number(r.previous)}</td><td class="num">${r.quantity===null?'Missing':number(r.quantity)}</td><td class="num">${signed(r.difference)}</td><td>${r.action}</td><td>${e(r.source.cell)}</td></tr>`).join('')}</tbody></table></div></details>
<form data-form="commit-import"><div class="validation-box"><h3>Confirm reporting coverage</h3><p class="table-note">Tick a category only if the worksheet includes every model expected for that category across these months. Missing cells still prevent completeness. Existing expected models are retained; narrow scope separately in Coverage.</p>${[...new Set(v.models.map(m=>({...state.catalog,...p.classifications})[m]?.category).filter(Boolean))].map(c=>`<label class="check"><input type="checkbox" name="coverage" value="${e(c)}"><span>This source covers the complete expected <strong>${e(c)}</strong> model scope for ${rangeLabel(v.months[0],v.months.at(-1))}.</span></label>`).join('')}</div><label class="check"><input type="checkbox" name="approved" required><span>I reviewed the validation results and proposed values, including ${counts.Replace??0} replacement${counts.Replace===1?'':'s'}. I understand that incoming values replace matching snapshots rather than add to them.</span></label><div class="panel-actions"><button type="submit" class="primary" ${v.errors.length||v.unknown.length||ui.loading?'disabled':''}>Confirm import</button><button type="button" data-action="cancel-import">Cancel preview</button></div></form>`):'');}
function recordsView(state,ui){const rows=D.filteredRecords(state,state.preferences).filter(r=>[r.model,r.month,r.source.filename,r.source.sheet].join(' ').toLowerCase().includes((ui.recordSearch??'').toLowerCase())),page=ui.recordPage??0,shown=rows.slice(page*100,(page+1)*100);return panel('Recorded activation values',`${rows.length.toLocaleString('en-IE')} rows in the selected period and product scope`, `<div class="table-wrap"><table><thead><tr><th>Month</th><th>Model</th><th>Category</th><th class="num">Quantity</th><th class="num">kWh</th><th>Filename</th><th>Worksheet</th><th>Cell</th></tr></thead><tbody>${shown.map(r=>{const p=state.catalog[r.model];return `<tr><td><button class="text-button" data-month="${r.month}" data-model="${e(r.model)}">${labelMonth(r.month)}</button></td><td>${e(r.model)}</td><td>${e(p.category)}</td><td class="num">${number(r.quantity)}</td><td class="num">${p.category==='Battery module'?number(r.quantity*p.capacity,1):'—'}</td><td>${e(r.source.filename)}</td><td>${e(r.source.sheet)}</td><td>${e(r.source.cell)}</td></tr>`;}).join('')||'<tr><td colspan="8">No matching recorded values. Missing cells are documented in import history and coverage.</td></tr>'}</tbody></table></div><div class="panel-actions editing" style="margin-top:15px"><button class="small" data-page="${page-1}" ${page===0?'disabled':''}>Previous</button><span class="muted">Page ${page+1} of ${Math.max(1,Math.ceil(rows.length/100))}</span><button class="small" data-page="${page+1}" ${(page+1)*100>=rows.length?'disabled':''}>Next</button></div><p class="table-note">Export includes the full period and product filter selection. This table search narrows the on-screen lookup only.</p>`,`<div class="panel-actions editing"><input id="record-search" type="search" placeholder="Search source or model…" aria-label="Search recorded data" value="${e(ui.recordSearch??'')}"><button class="small" data-action="export-records">Export filtered records</button><button class="small" data-action="export-summary">Export metric summary</button></div>`);}
function coverageView(state,ui){const f=state.preferences,category=ui.coverageCategory??'Inverter',months=D.monthsBetween(f.start,f.end),products=Object.values(state.catalog).filter(p=>p.category===category);return `<div class="notice info"><p><strong>Completeness is declared, then checked.</strong> A month closes in Europe/Dublin. Complete coverage also requires every applicable expected model to have a numeric record. A blank source cell is missing; only an explicit 0 is a confirmed zero. Applicability dates are managed in the catalogue.</p></div>`+panel('Coverage by category',`${rangeLabel(f.start,f.end)} · independent checks; global product filters do not narrow this audit`, `<div class="table-wrap"><table><thead><tr><th>Month</th>${D.CATEGORIES.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${months.map(m=>`<tr><td><button class="text-button" data-month="${m}">${labelMonth(m)}</button></td>${D.CATEGORIES.map(c=>{const a=D.metric(state,m,m,c),cover=state.coverage[`${m}|${c}`];return `<td>${badge(a.status)}<div class="muted" style="margin-top:5px">${a.observed} observed / ${a.expected} expected${a.missing?' · '+a.missing+' missing':''}<br>${cover?e(cover.expected.join(', ')):'No expected scope declared'}</div></td>`;}).join('')}</tr>`).join('')}</tbody></table></div>`)+panel('Declare or revise expected scope','This declaration is explicit; existing activation quantities are not altered.',`<form data-form="coverage" class="editing"><div class="form-row"><label class="field">Category<select id="coverage-category" name="category">${D.CATEGORIES.map(c=>option(c,c,category)).join('')}</select></label><label class="field">From<input type="month" name="start" value="${f.start}" required></label><label class="field">To<input type="month" name="end" value="${f.end}" required></label></div><h3>Expected models in every selected month</h3><div class="coverage-grid">${products.map(p=>`<label class="check"><input type="checkbox" name="expected" value="${e(p.model)}"><span>${e(p.model)}</span></label>`).join('')||'<p class="table-note">Add or import products in this category first.</p>'}</div><label class="check"><input name="confirmed" type="checkbox" checked><span>I confirm this is the complete expected product scope for the selected category and months.</span></label><button class="primary" type="submit">Review coverage change</button></form>`);}
function catalogueView(state){return panel('Product catalogue','Exact model codes only · nominal inverter power (kW) and battery module capacity (kWh) are distinct',`<div class="table-wrap"><table><thead><tr><th>Model</th><th>Category</th><th>Family</th><th class="num">Inverter kW</th><th>Grid phase</th><th class="num">Module kWh</th><th>Compatible BMS</th><th>Applicable from</th><th>Applicable to</th><th class="editing"></th></tr></thead><tbody>${Object.values(state.catalog).sort((a,b)=>a.category.localeCompare(b.category)||a.model.localeCompare(b.model)).map(p=>`<tr><td>${e(p.model)}</td><td>${e(p.category)}</td><td>${e(p.family||'—')}</td><td class="num">${number(p.powerKw,2)}</td><td>${e(p.phase??"Not classified")}</td><td class="num">${number(p.capacity,2)}</td><td>${e(p.bms??'—')}</td><td>${p.from??'No lower limit'}</td><td>${p.to??'No upper limit'}</td><td class="editing"><button class="small" data-edit-product="${e(p.model)}">Edit</button></td></tr>`).join('')}</tbody></table></div><p class="table-note">The initial five LUNA definitions follow the supplied brief. Applicability is explicitly declared, never inferred from the first activation. Every saved change has an impact preview and audit entry.</p>`,`<button class="small editing" data-action="add-product">Add model</button>`);}
function historyView(state){return panel('Import history','Snapshots, source provenance and conflict-aware undo',state.history.length?[...state.history].reverse().map(h=>`<article class="history-item"><div class="history-title"><div><h3>${e(h.filename)} ${h.undone?'<span class="badge">Undone</span>':''}</h3><p>${e(h.sheet)} · ${e(h.dataset)} · ${new Date(h.timestamp).toLocaleString('en-IE',{timeZone:'Europe/Dublin'})}<br>${h.changes.length} changed records · ${h.unchanged} unchanged · ${h.missing?.length??0} missing incoming cells</p></div><button class="small editing" data-undo="${e(h.id)}" ${h.undone?'disabled':''}>Review undo</button></div><details><summary>Source changes and missing cells</summary><div class="table-wrap import-review"><table><thead><tr><th>Record</th><th class="num">Before</th><th class="num">After</th><th>Source cell</th></tr></thead><tbody>${h.changes.map(c=>`<tr><td>${e(c.key)}</td><td class="num">${number(c.before?.quantity)}</td><td class="num">${number(c.after.quantity)}</td><td>${e(c.after.source.cell)}</td></tr>`).join('')}${(h.missing??[]).map(r=>`<tr><td>${e(r.month+' | '+r.model)}</td><td colspan="2">Incoming value missing; existing value retained</td><td>${e(r.source.cell)}</td></tr>`).join('')}</tbody></table></div></details>${h.skippedConflicts?.length?`<p class="table-note">${h.skippedConflicts.length} overlapping later changes were retained when undoing.</p>`:''}</article>`).join(''):'<p class="table-note">No imports yet.</p>')+panel('Catalogue & coverage audit','Historical calculation changes and scope declarations',`<div class="table-wrap"><table><thead><tr><th>When</th><th>Type</th><th>Change</th></tr></thead><tbody>${[...state.catalogLog.map(x=>({time:x.timestamp,type:'Catalogue',text:`${x.after.model}: ${x.impact?.records??0} records affected; capacity ${x.impact?.oldKwh??0} → ${x.impact?.newKwh??0} kWh`})),...state.coverageLog.map(x=>({time:x.timestamp,type:'Coverage',text:x.changes.map(c=>`${c.key}: ${c.after.expected.join(', ')} (${c.after.confirmed?'confirmed':'unconfirmed'})`).join('; ')}))].sort((a,b)=>b.time.localeCompare(a.time)).map(x=>`<tr><td>${e(new Date(x.time).toLocaleString('en-IE'))}</td><td>${x.type}</td><td class="wrap">${e(x.text)}</td></tr>`).join('')||'<tr><td colspan="3">No catalogue or coverage edits.</td></tr>'}</tbody></table></div>`);}
function backupView(state){return `<div class="grid-equal">${panel('Back up your workspace','Full JSON backup · portable between browsers and devices',`<p class="table-note">Includes activation records, catalogue, coverage, targets, events, import history and saved filters. Browser storage belongs to this browser/device and may be cleared. Keep a backup of important work.</p><button class="primary editing" data-action="backup">Download full backup</button>`)}${panel('Restore a backup','Review the contents before replacing this browser’s workspace.',`<p class="table-note">Restore is an atomic replacement of the full workspace. Download a backup first if you need to retain the current state.</p><label class="field editing">Choose backup JSON<input id="restore-file" type="file" accept=".json,application/json"></label>`)}</div>`+panel('Working with the app','Methodology, setup, acceptance tests and source code',`<div class="help-copy"><h3>Import all categories together or separately</h3><p class="table-note">Use Unified for one worksheet containing inverter, battery module and BMS rows; legacy separate matrices are also supported. Confirm model classifications and reporting coverage. Choose a complete period before making definitive comparisons.</p><h3>Calculations and assumptions</h3><ul><li>Snapshot key = month + exact canonical product model. Identical reimports do not add units.</li><li>Battery capacity = recorded modules × catalogue kWh. C0/C1 BMS model numbers are never used as capacity.</li><li>Percentage change = (current ÷ comparison − 1) × 100. A zero comparison has no percentage baseline.</li><li>Ratios use sums of numerators ÷ sums of denominators. No averaging of monthly percentages.</li><li>Missing values remain missing. Open months and incomplete coverage prevent definitive growth claims.</li><li>BMS / Inverter (%) is an observed ratio: BMS activations ÷ inverter activations × 100. It does not verify the percentage of newly installed systems with batteries.</li><li>Scope-specific targets override only at their defined level. Category targets and child targets are never summed together.</li></ul><div class="panel-actions"><a href="documentacao/guia.html" target="_blank" rel="noopener">Full guide & limitations ↗</a><button class="text-button" data-action="demo">Explore fictional demo</button><a href="documentacao/test-results.txt" target="_blank" rel="noopener">Test results ↗</a><a href="codigo-fonte.zip" download>Download organised source code</a></div></div>`)+panel('Commercial events','Dates and observations · no causation inferred',`<div class="context-list">${[...state.events].sort((a,b)=>b.date.localeCompare(a.date)).map(x=>`<div class="event-row"><span class="event-date">${e(x.date)}</span><div><strong>${e(x.title)}</strong><p>${e(x.type)} · ${e(x.notes??'')}</p></div><button class="small editing" data-delete-event="${e(x.id)}">Remove</button></div>`).join('')||'<p class="table-note">Add promotions, training, launches, stock issues or pricing changes to the timeline.</p>'}</div>`,`<button class="small editing" data-action="event">Add event</button>`);}

function detailView(state,{start,end,model='All'}){const f={...state.preferences,start,end,model},c=D.comparisonPeriod(f),rows=D.filteredRecords(state,f),a=D.overview(state,f),b=D.overview(state,{...f,start:c.start,end:c.end}),products=D.selectModels(state,f);const missing=[];for(const month of D.monthsBetween(start,end))for(const p of products){const r=state.records[D.keyOf(month,p.model)],cover=state.coverage[`${month}|${p.category}`];if(cover?.expected.includes(p.model)&&!r)missing.push({month,model:p.model,status:D.applicable(p,month)?'Missing':'Not applicable'});}
return `<div class="dialog-head"><div><div class="eyebrow">Recorded evidence</div><h2 id="drawer-title">${model==='All'?rangeLabel(start,end):e(model)}</h2></div><button data-close="drawer" aria-label="Close detail drawer">×</button></div><p class="table-note">${rangeLabel(start,end)} versus ${rangeLabel(c.start,c.end)}<br>Category: ${e(f.category)} · Model: ${e(model)} · Family: ${e(f.family)}</p><div class="kpi-grid">${card('Inverters',a.inverter,b.inverter)}${card('Battery modules',a.battery,b.battery)}${card('BMS',a.bms,b.bms)}${card('Capacity',a.capacity,b.capacity,{unit:'kWh'})}</div><section><h3>Source records and calculations</h3><div class="table-wrap"><table><thead><tr><th>Month / model</th><th class="num">Recorded</th><th>Calculation</th><th>Provenance</th></tr></thead><tbody>${rows.map(r=>{const p=state.catalog[r.model];return `<tr><td>${r.month}<br>${e(r.model)}</td><td class="num">${number(r.quantity)}</td><td>${p.category==='Battery module'?`${r.quantity} × ${p.capacity} = ${number(r.quantity*p.capacity)} kWh`:'Quantity as recorded'}</td><td class="wrap">${e(r.source.filename)}<br>${e(r.source.sheet)}!${e(r.source.cell)}<br><small>Source label: ${e(r.source.originalLabel)}${r.source.formula?'<br>Cached formula: '+e(r.source.formula):''}</small></td></tr>`;}).join('')}${missing.map(r=>`<tr><td>${r.month}<br>${e(r.model)}</td><td colspan="3">${r.status}</td></tr>`).join('')||'<tr><td colspan="4">No records in this scope.</td></tr>'}</tbody></table></div></section><section><h3>Comparison records</h3><div class="table-wrap"><table><thead><tr><th>Month</th><th>Model</th><th class="num">Quantity</th><th>Source</th></tr></thead><tbody>${D.filteredRecords(state,{...f,start:c.start,end:c.end}).map(r=>`<tr><td>${r.month}</td><td>${e(r.model)}</td><td class="num">${number(r.quantity)}</td><td class="wrap">${e(r.source.filename)} · ${e(r.source.sheet)}!${e(r.source.cell)}</td></tr>`).join('')||'<tr><td colspan="4">No comparison records available.</td></tr>'}</tbody></table></div></section>${notes(f)}`;}

return Object.assign({},{NAV,ROUTES,number,signed,labelMonth,rangeLabel,option,badge,navigation,filters,heading,emptyView,overviewView,INVERTER_CHART_MAX,selectedInverterModels,inverterView,batteriesView,comparisonEvidenceSeries,comparisonsView,targetsView,DATA_TABS,dataView,detailView});
})();

// MODULE: parser.js
__modules["parser.js"]=(()=>{
const {columnName}=__modules["domain.js"];
// OOXML reader for activation matrices. JSZip is vendored; all bytes stay local.
const decode=s=>String(s??'').replace(/&#x([0-9a-f]+);|&#(\d+);|&(amp|lt|gt|quot|apos);/gi,(_,h,d,n)=>h?String.fromCodePoint(parseInt(h,16)):d?String.fromCodePoint(+d):({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[n.toLowerCase()]));
function attrs(s){const out={};for(const m of s.matchAll(/([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g))out[m[1]]=decode(m[2]??m[3]);return out;}
function elements(xml,tag){const re=new RegExp(`<((?:[\\w.-]+:)?${tag})\\b([^>]*?)(?:\\/>|>([\\s\\S]*?)<\\/\\1\\s*>)`,'g');return [...xml.matchAll(re)].map(m=>({attrs:attrs(m[2]),body:m[3]??''}));}
function textRuns(xml){return elements(xml,'t').map(t=>decode(t.body)).join('');}
function safeXml(xml){if(/<!DOCTYPE|<!ENTITY/i.test(xml))throw new Error('Unsupported XML declarations. Export a standard .xlsx workbook.');return xml;}
function resolvePath(base,target){const result=target.startsWith('/')?[]:base.split('/').slice(0,-1);for(const p of target.replace(/^\//,'').split('/')){if(p==='..')result.pop();else if(p&&p!=='.')result.push(p);}return result.join('/');}
const colIndex=ref=>{const m=/^([A-Z]+)\d+$/.exec(ref);if(!m)return null;return [...m[1]].reduce((n,c)=>n*26+c.charCodeAt(0)-64,0)-1;};
function parseWorksheet(xml,strings=[]) {
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
function parseCsv(text){
  const rows=[];let row=[],value='',quoted=false;
  text=text.replace(/^\uFEFF/,'');
  for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else if(quoted)quoted=false;else if(value==='')quoted=true;else throw new Error('Invalid quote in CSV.');}else if(c===','&&!quoted){row.push(value);value='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(value);rows.push(row);row=[];value='';}else value+=c;}
  if(quoted)throw new Error('CSV contains an unclosed quoted field.');if(value!==''||row.length){row.push(value);rows.push(row);}
  return rows.map((r,ri)=>r.map((v,ci)=>({v:v.trim()===''?null:/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(v.trim())?Number(v.trim()):v,type:'csv',ref:`${columnName(ci)}${ri+1}`})));
}
async function readWorkbook(bytes,filename,zipLibrary=globalThis.JSZip){
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

return Object.assign({},{parseWorksheet,parseCsv,readWorkbook});
})();

// MODULE: persistence.js
__modules["persistence.js"]=(()=>{
// File-open edition: prefer IndexedDB; fall back only if it cannot be opened.
const IS_FILE=globalThis.location?.protocol==='file:';
const filePath=IS_FILE?globalThis.location.href.split(/[?#]/)[0]:'';
let hash=2166136261;
for(const c of filePath)hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0;
const DATABASE='huawei-activation-analytics-v1'+(IS_FILE?'-file-'+hash.toString(16):'');
const STORAGE_KEY=DATABASE+'-state';
let backendPromise,mode='opening',memoryState=null,local;

function openDatabase(){return new Promise((resolve,reject)=>{
  if(!globalThis.indexedDB){reject(new Error('IndexedDB is unavailable.'));return;}
  const request=indexedDB.open(DATABASE,1);
  request.onupgradeneeded=()=>request.result.createObjectStore('application');
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error??new Error('Could not open browser storage.'));
  request.onblocked=()=>reject(new Error('Close other tabs using this workspace and reopen it.'));
});}

function selectBackend(){return backendPromise??=(async()=>{
  try{const db=await openDatabase();mode='indexeddb';return db;}
  catch(error){
    if(!IS_FILE)throw error;
    try{
      local=globalThis.localStorage;
      const existing=local.getItem(STORAGE_KEY);
      if(existing===null){const probe=STORAGE_KEY+'-probe';local.setItem(probe,'1');local.removeItem(probe);}
      mode='localstorage';
    }catch{local=null;mode='memory';}
    return null;
  }
})();}

function storageInfo(){return {mode,persistent:mode==='indexeddb'||mode==='localstorage'};}

async function loadState(){
  const db=await selectBackend();
  if(mode==='localstorage'){const value=local.getItem(STORAGE_KEY);return value===null?null:JSON.parse(value);}
  if(mode==='memory')return memoryState===null?null:structuredClone(memoryState);
  return new Promise((resolve,reject)=>{const tx=db.transaction('application','readonly'),q=tx.objectStore('application').get('state');q.onsuccess=()=>resolve(q.result??null);q.onerror=()=>reject(q.error);});
}

async function saveState(state){
  const db=await selectBackend();
  if(mode==='localstorage'){local.setItem(STORAGE_KEY,JSON.stringify(state));return;}
  if(mode==='memory'){memoryState=structuredClone(state);return;}
  // A failed write never silently falls back or replaces the previous saved state.
  return new Promise((resolve,reject)=>{const tx=db.transaction('application','readwrite');tx.objectStore('application').put(state,'state');tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error??new Error('Local storage failed. Your previous data has been retained.'));tx.onabort=()=>reject(tx.error??new Error('Save aborted. Your previous data has been retained.'));});
}

return Object.assign({},{storageInfo,loadState,saveState});
})();

// MODULE: demo.js
__modules["demo.js"]=(()=>{
const D=__modules["domain.js"];
// Deliberately fictional and isolated. Never persisted to the real database.
function makeDemo(){
  let state=D.freshState();const end=D.closedMonth(),months=D.monthsBetween(D.shiftMonth(end,-23),end);
  const inverterModels=['DEMO-INVERTER-A','DEMO-INVERTER-B','DEMO-INVERTER-C'];
  for(const model of inverterModels)state.catalog[model]={model,category:'Inverter',family:'Demo',capacity:null,bms:null,from:null,to:null};
  const header=['index',...months.map(m=>+m.replace('-',''))];
  const inverterRows=inverterModels.map((model,j)=>[model,...months.map((m,i)=>Math.max(0,Math.round((j===0?235:j===1?93:32)*(1+.18*Math.sin(i/2))*(i>16?(j===0?.65:j===1?1.4:1.1):1))))]);
  const batteryModels=['LUNA2000-5-E0','LUNA2000-5-E1','LUNA2000-7-E1','LUNA2000-5KW-C0','LUNA2000-10KW-C1'];
  const batteryRows=batteryModels.map((model,j)=>[model,...months.map((m,i)=>Math.max(0,Math.round((j===0?90:j===1?25:j===2?45:j===3?48:32)*(1+.1*Math.sin(i/3))*(i>16?(j===0||j===3?.65:1.6):1))))]);
  for(const [dataset,rows,categories]of [['inverters',inverterRows,['Inverter']],['batteries',batteryRows,['Battery module','BMS']]]){
    const total=['Total',...months.map((_,i)=>rows.reduce((a,r)=>a+r[i+1],0))];
    const v=D.validateMatrix({rows:[header,...rows,total],filename:`FICTIONAL_DEMO_${dataset}.xlsx`,sheet:'Fictional example',dataset,catalog:state.catalog});
    state=D.commitImport(state,v,{confirmedCategories:categories});
  }
  for(const month of months.slice(-6))for(const [scope,value]of [['Inverter',400],['Battery module',200],['BMS',100]])state=D.saveTarget(state,{month,scope,value});
  state.events=[{id:'demo-event',date:months.at(-4)+'-01',type:'Promotion',title:'Fictional campaign example',notes:'Demonstrates timeline context only. No real promotion or causal claim.'}];
  state.preferences={...state.preferences,start:months.at(-6),end};return state;
}

return Object.assign({},{makeDemo});
})();

// MODULE: app.js
const IA=__modules["installer-analytics-views.js"];
const IV=__modules["installer-views.js"];
const D=__modules["domain.js"];
const V=__modules["views.js"];
const {readWorkbook}=__modules["parser.js"];
const {loadState,saveState,storageInfo}=__modules["persistence.js"];
const {escapeHtml:e,download,toCsv,exportRows,summaryRows,templateRows}=__modules["exports.js"];
const {makeDemo}=__modules["demo.js"];
let state=D.freshState();
let realState=null;
const ui={page:V.ROUTES.includes(location.hash.slice(1))?location.hash.slice(1):'overview',dataTab:'import',moreFilters:false,gridPhase:'All',inverterSelectedModels:null,inverterPickerOpen:false,inverterModelSearch:'',phaseChartMode:'indexed',quarter:3,quarterMetric:'inverters',dataset:'unified',pending:null,hiddenSeries:new Set(),trendMetric:'volume',mixBasis:'modules',compareMetric:'Inverter',coverageCategory:'Inverter',recordPage:0,loading:false,saving:false,storageError:null};
const $=s=>document.querySelector(s);
let toastTimer;
function toast(text,error=false){const el=$('#toast');el.textContent=text;el.style.background=error?'#8b352c':'#26343c';el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),error?10000:5500);}
function render(){
  $('#navigation').innerHTML=V.navigation(ui.page);
  $('#breadcrumb').textContent=`Ireland / ${V.NAV[V.ROUTES.indexOf(ui.page)]}`;
  $('#global-filters').innerHTML=ui.page==='installers'?IA.installerAnalyticsFilters(state,ui):V.filters(state,ui);
  const pages={overview:V.overviewView,inverters:V.inverterView,batteries:V.batteriesView,comparisons:V.comparisonsView,targets:V.targetsView,data:V.dataView,installers:IV.installerView};
  const storage=storageInfo();
  const sessionNotice=!ui.demo&&storage.mode==='memory'?'<div class="notice"><p><strong>Session-only workspace.</strong> This browser does not allow this file to save automatically. Import and analyse normally, then download a full backup before closing.</p><button class="small" data-action="backup">Download full backup</button></div>':'';
  $('#main').innerHTML=sessionNotice+(ui.demo?'<div class="notice demo-notice"><p><strong>Fictional demo.</strong> These quantities and findings are illustrative. Your real workspace is unchanged. Imports and exports are disabled in demo mode.</p><button class="small" data-action="exit-demo">Return to real workspace</button></div>':'')+(ui.storageError?`<div class="notice error"><p>${e(ui.storageError)}. Saving is unavailable until local browser storage works.</p></div>`:'')+pages[ui.page](state,ui);
  $('#footer-status').textContent=`${Object.keys(state.records).length.toLocaleString('en-IE')} ${ui.demo?'fictional demo':storage.mode==='memory'?'session':'saved'} equipment records · ${Object.keys(state.installers.accounts).length} installer accounts · Europe/Dublin calendar · ${ui.demo?'Demo changes are not saved':storage.mode==='memory'?'Download a full backup before closing':'Data stays in this browser'}`;
  document.title=`${V.NAV[V.ROUTES.indexOf(ui.page)]} · Huawei Activation Analytics`;
}
async function commit(next,message){
  if(ui.saving)throw new Error('A save is already in progress. Please wait.');ui.saving=true;
  try{if(!ui.demo)await saveState(next);state=next;ui.storageError=null;render();if(message)toast(ui.demo?'Demo only: '+message:message);}finally{ui.saving=false;}
}
function navigate(page,tab){ui.page=page;ui.tableSearch='';ui.recordPage=0;ui.hiddenSeries.clear();if(tab)ui.dataTab=tab;try{history.replaceState(null,'',`#${page}`);}catch{if(location.hash!==`#${page}`)location.hash=page;}render();window.scrollTo({top:0,behavior:'instant'});}
window.addEventListener('hashchange',()=>{const p=location.hash.slice(1);if(V.ROUTES.includes(p))navigate(p);});
function openModal(title,body,action=null,confirmText='Confirm'){
  const modal=$('#modal');ui.dialogAction=action;
  modal.innerHTML=`<div class="dialog-head"><h2 id="modal-title">${e(title)}</h2><button data-close="modal" aria-label="Close dialog">×</button></div>${body}<p class="dialog-error" id="dialog-error" role="alert"></p>${action?`<div class="dialog-actions"><button data-close="modal">Cancel</button><button class="primary" data-action="dialog-confirm">${e(confirmText)}</button></div>`:''}`;
  if(!modal.open)modal.showModal();
}
function detail(start=state.preferences.start,end=state.preferences.end,model=state.preferences.model){const drawer=$('#drawer');drawer.innerHTML=V.detailView(state,{start,end,model});if(!drawer.open)drawer.showModal();}
function validatePending(){if(!ui.pending)return;const p=ui.pending;p.validation=D.validateMatrix({rows:p.rows,filename:p.filename,sheet:p.sheet,headerRow:p.headerRow,dataset:ui.dataset,catalog:{...state.catalog,...p.classifications}});}
async function chooseWorksheet(name){const p=ui.pending;if(!p)return;ui.loading=true;render();try{p.sheet=name;p.rows=await p.workbook.sheet(name);const h=D.suggestHeader(p.rows);p.headerRow=h.index;p.headerUncertain=h.uncertain;validatePending();}finally{ui.loading=false;render();}}
async function importFile(file){if(!file)return;if(ui.demo){toast('Return to your real workspace before importing data.',true);return;}ui.importError=null;ui.loading=true;ui.pending=null;ui.page='data';ui.dataTab='import';render();try{const workbook=await readWorkbook(await file.arrayBuffer(),file.name);ui.pending={filename:file.name,workbook,sheet:workbook.names[0],rows:[],headerRow:0,classifications:{}};await chooseWorksheet(workbook.names[0]);}catch(err){ui.pending=null;ui.importError=err.message;}finally{ui.loading=false;render();}}
function template(dataset){const end=D.closedMonth(),months=D.monthsBetween(D.shiftMonth(end,-5),end);download(toCsv(templateRows(dataset,months)),`${dataset==='unified'?'Unified_Equipment':dataset==='inverters'?'Inverter':'Battery_BMS'}_Import_Template.csv`,'text/csv;charset=utf-8');}
function showProduct(model=null){const p=model?state.catalog[model]:{model:'',category:'Battery module',family:'',capacity:null,bms:null,from:null,to:null};ui.editProduct=model;
  openModal(model?'Edit product definition':'Add product model',`<form data-form="product"><div class="form-row"><label class="field">Exact model code<input name="model" value="${e(p.model)}" ${model?'readonly':''} required></label><label class="field">Category<select name="category">${D.CATEGORIES.map(c=>V.option(c,c,p.category)).join('')}</select></label></div><div class="form-row"><label class="field">Family<input name="family" value="${e(p.family)}" placeholder="Optional"></label><label class="field">Module capacity (kWh)<input name="capacity" type="number" min="0.001" step="any" value="${p.capacity??''}" placeholder="Battery modules only"></label></div><div class="form-row"><label class="field">Inverter rated power (kW)<input name="powerKw" type="number" min="0.001" step="any" value="${p.powerKw??''}" placeholder="Inverters only"></label><label class="field">Inverter grid phase<select name="phase">${V.option('','Not specified',p.phase??'')}${V.option('Single-phase','Single-phase',p.phase)}${V.option('Three-phase','Three-phase',p.phase)}</select></label></div><label class="field">Compatible BMS<select name="bms">${V.option('','Not specified',p.bms??'')}${Object.values(state.catalog).filter(x=>x.category==='BMS').map(x=>V.option(x.model,x.model,p.bms)).join('')}</select></label><div class="form-row" style="margin-top:18px"><label class="field">Reporting applicability from<input name="from" type="month" value="${p.from??''}"></label><label class="field">Reporting applicability to<input name="to" type="month" value="${p.to??''}"></label></div><p class="table-note">Blank applicability dates mean no explicit bound. They do not indicate a launch date. Capacity changes recalculate historical battery capacity; review the impact before saving.</p><div class="dialog-actions"><button type="button" data-close="modal">Cancel</button><button type="submit" class="primary">Preview impact</button></div></form>`);
}
function eventForm(){openModal('Add commercial context',`<form data-form="event"><div class="form-row"><label class="field">Date<input type="date" name="date" value="${state.preferences.end}-01" required></label><label class="field">Event type<select name="type">${['Promotion','Training','Product launch','Stock availability','Pricing change','Other context'].map(x=>V.option(x,x,'')).join('')}</select></label></div><label class="field">Title<input name="title" maxlength="140" required placeholder="e.g. Installer training session"></label><label class="field" style="margin-top:16px">Notes<textarea name="notes" maxlength="3000" placeholder="Record what happened. Timing alone does not establish its impact."></textarea></label><div class="dialog-actions"><button type="button" data-close="modal">Cancel</button><button type="submit" class="primary">Save event</button></div></form>`);}
async function applyShortcut(value){if(value==='custom')return;const categories=state.preferences.category==='All'?D.CATEGORIES:[state.preferences.category],latest=D.latestComplete(state,categories);if(!latest){toast('No complete month is available for this category scope. Import data and confirm coverage.',true);return;}let start=latest,end=latest;
  if(value==='quarter'){let found=null;for(let i=0;i<120;i++){const m=D.shiftMonth(latest,-i);if(+m.slice(5)%3!==0)continue;const s=D.shiftMonth(m,-2);if(D.monthsBetween(s,m).every(x=>categories.every(c=>D.metric(state,x,x,c).complete))){found={start:s,end:m};break;}}if(!found){toast('No complete quarter is available.',true);return;}({start,end}=found);}
  else if(value==='ytd')start=`${latest.slice(0,4)}-01`;else if(/^\d+$/.test(value))start=D.shiftMonth(latest,1-Number(value));
  if(!D.monthsBetween(start,end).every(m=>categories.every(c=>D.metric(state,m,m,c).complete))){toast('This full interval contains incomplete months. Review Coverage or choose a custom period.',true);return;}
  const next=D.clone(state);next.preferences={...next.preferences,start,end};await commit(next);}

function validateInstallerPending(){const p=ui.installerPending;if(p)p.validation=D.validateInstallerMatrix({rows:p.rows,filename:p.filename,sheet:p.sheet,headerRow:p.headerRow,nameColumn:p.nameColumn});}
async function chooseInstallerSheet(name){const p=ui.installerPending;if(!p)return;p.sheet=name;p.rows=await p.workbook.sheet(name);p.headerRow=D.suggestInstallerHeader(p.rows).index;p.nameColumn=0;validateInstallerPending();}
async function importInstallerFile(file){if(!file)return;if(ui.demo)throw new Error('Exit demo before importing.');ui.installerLoading=true;ui.installerPending=null;ui.installerError=null;render();try{const workbook=await readWorkbook(await file.arrayBuffer(),file.name);ui.installerPending={workbook,filename:file.name};await chooseInstallerSheet(workbook.names[0]);}catch(error){ui.installerPending=null;ui.installerError=error.message;}finally{ui.installerLoading=false;render();}}
function reviewInstallerMerge(ids){if(ui.demo)throw new Error('Exit demo before merging installers.');ui.installerMergeIds=ids;openModal('Unify installers',IV.installerMergePreview(state,ids));}

document.addEventListener('click',async event=>{
  const el=event.target.closest('button,a[data-action],g[role="button"]');if(!el||el.disabled)return;
  try{
    if(ui.demo&&['print','export-records','export-summary','backup'].includes(el.dataset.action)){toast('Exports are disabled for fictional data. Return to your real workspace to report actual values.',true);return;}
    if(el.dataset.installerDetail){const id=el.dataset.installerDetail;openModal(state.installers.accounts[id].name,IA.installerProfile(state,id,ui)+'<details><summary>All original monthly source values</summary>'+IV.installerDetail(state,id)+'</details>');return;}
    if(el.dataset.installerSuggest){reviewInstallerMerge(el.dataset.installerSuggest.split(','));return;}
    if(el.dataset.installerPage){ui.installerPage=Number(el.dataset.installerPage);render();return;}
    if(el.dataset.installerUnmerge){const id=el.dataset.installerUnmerge;openModal('Undo installer union?', '<p>Restore the original account identities. Any monthly values updated since the union will be retained.</p>',async()=>{await commit(D.undoInstallerMerge(state,id),'Installer union undone.');ui.installerSelected=new Set();render();});return;}
    if(el.dataset.installerUndoImport){const id=el.dataset.installerUndoImport;openModal('Undo installer import?', '<p>Restore the previous source/month values. Later overlapping imports must be undone first. Account identities and unions are preserved.</p>',async()=>commit(D.undoInstallerImport(state,id),'Installer import undone.'));return;}
    if(el.dataset.close){$('#'+el.dataset.close).close();return;}
    if(el.dataset.nav){navigate(el.dataset.nav);return;}
    if(el.dataset.dataTab){navigate('data',el.dataset.dataTab);return;}
    if(el.dataset.installerPoint){openModal('Installer activation evidence',IA.installerPointEvidence(state,el.dataset.installerPoint,el.dataset.month,el.dataset.end??el.dataset.month,ui));return;}
    if(el.dataset.month){detail(el.dataset.month,el.dataset.end??el.dataset.month,el.dataset.model??state.preferences.model);return;}
    if(el.dataset.modelDetail){const model=state.catalog[el.dataset.modelDetail]?el.dataset.modelDetail:state.preferences.model;detail(state.preferences.start,state.preferences.end,model);return;}
    if(el.dataset.inverterChartModel){
      const model=el.dataset.inverterChartModel,preferences=state.preferences;
      const allowed=D.selectModels(state,{category:'Inverter',model:preferences.model,family:preferences.family})
        .some(p=>p.model===model&&((ui.gridPhase??'All')==='All'||p.phase===ui.gridPhase));
      if(!allowed)throw new Error('This inverter is not in the current reporting scope.');
      const initial=ui.inverterSelectedModels??D.ranking(state,preferences,'Inverter')
        .filter(x=>(ui.gridPhase??'All')==='All'||state.catalog[x.model]?.phase===ui.gridPhase)
        .slice(0,8).map(x=>x.model);
      if(initial.includes(model))ui.inverterSelectedModels=initial.filter(x=>x!==model);
      else{
        if(initial.length>=V.INVERTER_CHART_MAX)throw new Error('Select up to '+V.INVERTER_CHART_MAX+' inverter models at a time. Remove a model to add another.');
        ui.inverterSelectedModels=[...initial,model];
        ui.hiddenSeries.delete(model);
      }
      render();
      return;
    }
    if(el.dataset.toggleSeries){const key=el.dataset.toggleSeries;ui.hiddenSeries.has(key)?ui.hiddenSeries.delete(key):ui.hiddenSeries.add(key);render();return;}
    if(el.dataset.editProduct){showProduct(el.dataset.editProduct);return;}
    if(el.dataset.page){ui.recordPage=Math.max(0,+el.dataset.page);render();return;}
    if(el.dataset.eventDetail){const x=state.events.find(x=>x.id===el.dataset.eventDetail);openModal(x.title,`<p class="table-note">${e(x.date)} · ${e(x.type)}</p><p>${e(x.notes??'')}</p><p class="table-note">This is dated context, not a causal conclusion.</p>`);return;}
    if(el.dataset.deleteEvent){const id=el.dataset.deleteEvent,x=state.events.find(x=>x.id===id);openModal('Remove event?',`<p>${e(x.title)} · ${e(x.date)}</p>`,async()=>{const next=D.clone(state);next.events=next.events.filter(x=>x.id!==id);next.updatedAt=new Date().toISOString();await commit(next,'Event removed.');});return;}
    if(el.dataset.deleteTarget){const key=el.dataset.deleteTarget,t=state.targets[key];openModal('Remove monthly target?',`<p>${e(t.month)} · ${e(t.scope)} · ${V.number(t.value)} activations</p>`,async()=>{const next=D.clone(state);delete next.targets[key];next.updatedAt=new Date().toISOString();await commit(next,'Target removed.');});return;}
    if(el.dataset.undo){const id=el.dataset.undo,h=state.history.find(x=>x.id===id),conflicts=D.undoConflicts(state,id);openModal('Review import undo',`<p>${e(h.filename)} · ${e(h.sheet)}</p><p class="table-note">This import changed ${h.changes.length} records and ${h.coverageChanges?.length??0} coverage declarations.</p>${conflicts.length?`<div class="notice"><p><strong>${conflicts.length} overlapping later changes will be retained.</strong> Only non-conflicting changes can be reversed. This undo is marked complete afterward.</p></div><ul class="validation-list">${conflicts.map(x=>`<li>${e(x.type)}: ${e(x.key)}</li>`).join('')}</ul>`:'<p class="table-note">No overlapping later edits. Previous values and coverage will be restored.</p>'}`,async()=>commit(D.undoImport(state,id,conflicts.length>0),'Import undo saved.'),conflicts.length?'Undo non-conflicting changes':'Undo import');return;}
    switch(el.dataset.action){
      case 'installer-merge':reviewInstallerMerge([...(ui.installerSelected??[])]);break;
      case 'installer-cancel':ui.installerPending=null;ui.installerError=null;render();break;
      case 'installer-preview-export':{const p=ui.installerPending;if(p)download(toCsv([['Source name','Account','Month','Previous','Incoming','Action'],...D.installerImportPreview(state,p.validation).map(r=>[r.label,r.account,r.month,r.previous,r.quantity,r.action])]),'installer-import-preview.csv','text/csv;charset=utf-8');break;}
      case 'installer-analytics-export':{if(ui.demo)throw new Error('Exit demo before exporting.');download(toCsv(D.installerAnalyticsCsv(D.installerAnalysis(state,state.preferences,{cohort:ui.installerCohort??'all'}),state.preferences)),'installer-kpis.csv','text/csv;charset=utf-8');break;}
      case 'installer-export':{if(ui.demo)throw new Error('Exit demo before exporting.');const f=state.preferences,months=D.monthsBetween(f.start,f.end);download(toCsv([['Installer',...months,'Reported total'],...D.installerAnalysis(state,f,{cohort:ui.installerCohort??'all'}).rows.map(r=>[r.name,...months.map(m=>D.installerMeasure([D.installerIndex(state).find(a=>a.id===r.id)],m,m).value),r.current.value])]),`installers_${f.start}_${f.end}.csv`,'text/csv;charset=utf-8');break;}
      case 'import':navigate('data','import');break;
      case 'demo':if(!ui.demo){realState=state;state=makeDemo();ui.demo=true;ui.pending=null;ui.installerPending=null;ui.installerSelected=new Set();navigate('overview');}break;
      case 'exit-demo':if(ui.demo){state=realState;realState=null;ui.demo=false;ui.pending=null;ui.installerPending=null;ui.installerSelected=new Set();navigate('overview');}break;
      case 'help':navigate('data','backup');break;
      case 'templates':navigate('data','import');toast('Both Excel templates are available beside the import area.');break;
      case 'inverter-chart-picker':ui.inverterPickerOpen=!ui.inverterPickerOpen;render();break;
      case 'inverter-chart-top':ui.inverterSelectedModels=null;ui.hiddenSeries.clear();render();break;
      case 'inverter-chart-clear':ui.inverterSelectedModels=[];render();break;
      case 'toggle-filters':ui.moreFilters=!ui.moreFilters;render();break;
      case 'reset-filters':{ui.gridPhase='All';const next=D.clone(state);Object.assign(next.preferences,{category:'All',model:'All',family:'All'});await commit(next);break;}
      case 'presentation':document.body.classList.toggle('presentation');break;
      case 'print':{const previous=ui.page;ui.page='overview';render();$('#main').querySelectorAll('details').forEach(x=>x.open=true);window.print();ui.page=previous;render();break;}
      case 'event':eventForm();break;
      case 'add-product':showProduct();break;
      case 'revalidate':validatePending();render();break;
      case 'cancel-import':ui.pending=null;ui.importError=null;render();break;
      case 'template-unified':template('unified');break;
      case 'template-inverters':template('inverters');break;
      case 'template-batteries':template('batteries');break;
      case 'export-records':download(toCsv(exportRows(state,state.preferences)),`activation-records_${state.preferences.start}_${state.preferences.end}.csv`,'text/csv;charset=utf-8');break;
      case 'export-summary':download(toCsv(summaryRows(state,state.preferences)),`activation-summary_${state.preferences.start}_${state.preferences.end}.csv`,'text/csv;charset=utf-8');break;
      case 'backup':download(JSON.stringify(state,null,2),`Huawei_Activation_Backup_${new Date().toISOString().slice(0,10)}.json`,'application/json');break;
      case 'dialog-confirm':{if(!ui.dialogAction)break;el.disabled=true;try{await ui.dialogAction();$('#modal').close();}catch(err){$('#dialog-error').textContent=err.message;}finally{el.disabled=false;}break;}
    }
  }catch(err){toast(err.message,true);}
});
document.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.matches('g[role="button"]')){event.preventDefault();event.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});

document.addEventListener('change',async event=>{const el=event.target;try{
  if(el.dataset.installerSelect){ui.installerSelected??=new Set();el.checked?ui.installerSelected.add(el.dataset.installerSelect):ui.installerSelected.delete(el.dataset.installerSelect);render();return;}
  if(el.dataset.filter){const next=D.clone(state),f=next.preferences;f[el.dataset.filter]=el.value;if(!D.monthValue(f.start)||!D.monthValue(f.end)||f.start>f.end||!D.monthValue(f.compareStart)||!D.monthValue(f.compareEnd)||f.compareStart>f.compareEnd)throw new Error('Choose valid month ranges with start on or before end.');D.monthsBetween(f.start,f.end);D.monthsBetween(f.compareStart,f.compareEnd);if(['category','family'].includes(el.dataset.filter))f.model='All';ui.recordPage=0;await commit(next);return;}
  switch(el.id){
    case 'installer-cohort':ui.installerCohort=el.value;ui.installerPage=0;ui.installerSelected=new Set();render();break;
    case 'installer-sort':ui.installerSort=el.value;ui.installerPage=0;render();break;
    case 'installer-period':{if(el.value==='custom')break;const end=D.latestInstallerMonth(state);if(!end)throw new Error('No complete closed installer month is available.');const start=el.value==='ytd'?end.slice(0,4)+'-01':el.value==='month'?end:D.shiftMonth(end,1-Number(el.value));const next=D.clone(state);Object.assign(next.preferences,{start,end});await commit(next);break;}
    case 'installer-file':await importInstallerFile(el.files[0]);break;
    case 'installer-sheet':await chooseInstallerSheet(el.value);render();break;
    case 'installer-header':{const p=ui.installerPending;if(!p||!Number.isInteger(+el.value)||+el.value<1||+el.value>p.rows.length)throw new Error('Select a valid header row.');p.headerRow=+el.value-1;validateInstallerPending();render();break;}
    case 'installer-name-column':ui.installerPending.nameColumn=Number(el.value);validateInstallerPending();render();break;
    case 'shortcut':await applyShortcut(el.value);break;
    case 'quarter-select':ui.quarter=Number(el.value);render();break;
    case 'quarter-metric':ui.quarterMetric=el.value;render();break;
    case 'phase-chart-mode':ui.phaseChartMode=el.value;ui.hiddenSeries.clear();render();break;
    case 'grid-phase':ui.gridPhase=el.value;ui.inverterSelectedModels=null;ui.hiddenSeries.clear();render();break;
    case 'dataset':ui.dataset=el.value;if(ui.pending){ui.pending.classifications={};validatePending();}render();break;
    case 'import-file':await importFile(el.files[0]);break;
    case 'worksheet':await chooseWorksheet(el.value);break;
    case 'header-row':if(!Number.isInteger(+el.value)||+el.value<1||+el.value>ui.pending.rows.length)throw new Error('Choose a valid worksheet header row.');ui.pending.headerRow=+el.value-1;ui.pending.headerUncertain=false;validatePending();render();break;
    case 'trend-metric':ui.trendMetric=el.value;render();break;
    case 'mix-basis':ui.mixBasis=el.value;render();break;
    case 'compare-metric':ui.compareMetric=el.value;render();break;
    case 'coverage-category':ui.coverageCategory=el.value;render();break;
    case 'restore-file':{if(ui.demo)throw new Error('Exit the fictional demo before restoring a real backup.');const file=el.files[0];if(!file)break;if(file.size>80*1024*1024)throw new Error('Backup exceeds 80 MB.');let restored;try{restored=D.validateBackup(JSON.parse(await file.text()));restored.catalog=D.mergeInverterCatalog(restored.catalog);}catch(err){throw new Error('Backup not restored: '+err.message);}openModal('Replace this workspace with the backup?',`<p><strong>${e(file.name)}</strong></p><div class="preview-stats"><span><strong>${Object.keys(restored.records).length}</strong>records</span><span><strong>${Object.keys(restored.catalog).length}</strong>models</span><span><strong>${restored.history.length}</strong>equipment imports</span><span><strong>${Object.keys(restored.installers.accounts).length}</strong>installer accounts</span><span><strong>${restored.events.length}</strong>events</span></div><p class="table-note">This will replace ${Object.keys(state.records).length} current equipment records, installer accounts and activations, targets, events, coverage and history in this browser. It will not upload the backup anywhere.</p>`,async()=>{await commit(restored,'Backup restored successfully.');ui.pending=null;ui.installerPending=null;ui.installerSelected=new Set();navigate('overview');},'Restore full backup');break;}
  }
}catch(err){toast(err.message,true);render();}});

document.addEventListener('input',event=>{const el=event.target;if(el.id==='installer-search'){const cursor=el.selectionStart;ui.installerSearch=el.value;ui.installerPage=0;render();const input=$('#installer-search');input?.focus();input?.setSelectionRange(cursor,cursor);return;}if(el.id==='inverter-model-search'){
    ui.inverterModelSearch=el.value;
    const cursor=el.selectionStart;
    render();
    const current=$('#inverter-model-search');
    if(current){current.focus();try{current.setSelectionRange(cursor,cursor);}catch{}}
    return;
  }
  if(el.id==='table-search'||el.id==='record-search'){const id=el.id,value=el.value;ui[id==='table-search'?'tableSearch':'recordSearch']=value;ui.recordPage=0;const caret=el.selectionStart;render();const replacement=$('#'+id);replacement?.focus();replacement?.setSelectionRange(caret,caret);}});
document.addEventListener('dragover',event=>{const z=event.target.closest('#dropzone');if(z){event.preventDefault();z.classList.add('drag');}});
document.addEventListener('dragleave',event=>{event.target.closest('#dropzone')?.classList.remove('drag');});
document.addEventListener('drop',async event=>{if(event.target.closest('#dropzone')){event.preventDefault();await importFile(event.dataTransfer.files[0]);}});

document.addEventListener('submit',async event=>{
  const form=event.target;if(!form.dataset.form)return;event.preventDefault();const data=new FormData(form);const button=form.querySelector('button[type="submit"]');if(button)button.disabled=true;
  try{switch(form.dataset.form){
    case 'installer-import':{if(ui.demo)throw new Error('Exit demo before importing.');if(!data.has('approved'))throw new Error('Review and approve the import.');validateInstallerPending();const p=ui.installerPending;if(!p)throw new Error('Select a file.');const scope=String(data.get('scope')??'partial'),fullScopeConfirmed=data.has('fullScopeConfirmed');
    const next=D.commitInstallerImport(state,p.validation,{scope,fullScopeConfirmed});Object.assign(next.preferences,{start:p.validation.months[0],end:p.validation.months.at(-1)});await commit(next,'Installer activations imported. Repeated names were summed.');ui.installerPending=null;render();break;}
    case 'installer-merge':{await commit(D.mergeInstallers(state,ui.installerMergeIds,data.get('name')),'Installers unified. Monthly values were summed.');ui.installerSelected=new Set();$('#modal').close();render();break;}
    case 'classify':{
      const p=ui.pending,classes={...p.classifications};
      p.validation.unknown.forEach((model,i)=>{
        const category=data.get(`category-${i}`),powerInput=String(data.get(`power-${i}`)??'').trim(),phase=data.get(`phase-${i}`)||null;
        if(category==='Inverter'&&(!powerInput||!phase))throw new Error(`${model}: Provide rated kW and grid phase for a new inverter model.`);
        classes[model]={model,category,family:String(data.get(`family-${i}`)??'').trim(),
          capacity:category==='Battery module'?Number(data.get(`capacity-${i}`)):null,
          bms:category==='Battery module'?data.get(`bms-${i}`)||null:null,
          powerKw:category==='Inverter'?Number(powerInput):null,phase:category==='Inverter'?phase:null,from:null,to:null};
      });
      for(const product of Object.values(classes)){
        const errs=D.validateProduct(product,{...state.catalog,...classes});
        if(errs.length)throw new Error(`${product.model}: ${errs.join(' ')}`);
      }
      const switchToUnified=Object.values(classes).some(product=>!D.datasetAcceptsCategory(ui.dataset,product.category));
      p.classifications=classes;
      if(switchToUnified)ui.dataset='unified';
      validatePending();render();
      toast(switchToUnified?'Switched to Unified Import to include every selected equipment category.':'Model classifications confirmed for this preview.');
      break;
    }
    case 'commit-import':{if(!data.has('approved'))throw new Error('Confirm that you reviewed the proposed values.');const p=ui.pending;validatePending();const next=D.commitImport(state,p.validation,{classifications:p.classifications,confirmedCategories:data.getAll('coverage')});const last=D.latestComplete(next);if(last)Object.assign(next.preferences,{start:last,end:last});else if(p.validation.months.length)Object.assign(next.preferences,{start:p.validation.months[0],end:p.validation.months.at(-1)});await commit(next,'Import saved. Identical values were retained without duplication.');ui.pending=null;ui.installerPending=null;ui.installerSelected=new Set();navigate('overview');break;}
    case 'target':{const value={month:data.get('month'),scope:data.get('scope'),value:Number(data.get('value'))};D.saveTarget(state,value);const old=state.targets[D.targetKey(value.month,value.scope)];openModal('Review monthly target',`<p>${e(value.scope)} · ${V.labelMonth(value.month)}</p><p>Previous target: <strong>${old?V.number(old.value):'Not set'}</strong><br>New target: <strong>${V.number(value.value)}</strong> activations</p>`,async()=>commit(D.saveTarget(state,value),'Monthly target saved.'));break;}
    case 'coverage':{const value={category:data.get('category'),start:data.get('start'),end:data.get('end'),expected:data.getAll('expected'),confirmed:data.has('confirmed')};D.setCoverage(state,value);openModal('Review reporting scope',`<p>${e(value.category)} · ${V.rangeLabel(value.start,value.end)}</p><p class="table-note">Expected models: ${value.expected.map(e).join(', ')}<br>Coverage: ${value.confirmed?'Confirmed':'Unconfirmed'}</p><p class="table-note">This replaces scope declarations for ${D.monthsBetween(value.start,value.end).length} months. Recorded quantities remain intact. Completeness and comparisons will be recalculated.</p>`,async()=>commit(D.setCoverage(state,value),'Coverage saved and metrics recalculated.'));break;}
    case 'product':{const category=data.get('category'),p={model:D.canonical(data.get('model')),category,family:String(data.get('family')??'').trim(),capacity:category==='Battery module'?Number(data.get('capacity')):null,bms:category==='Battery module'?data.get('bms')||null:null,powerKw:category==='Inverter'&&String(data.get('powerKw')??'').trim()?Number(data.get('powerKw')):null,phase:category==='Inverter'?data.get('phase')||null:null,from:data.get('from')||null,to:data.get('to')||null};if(category==='Inverter'&&!ui.editProduct&&(!p.powerKw||!p.phase))throw new Error('Provide rated kW and grid phase for a new inverter.');if(!ui.editProduct&&state.catalog[p.model])throw new Error('This model already exists. Edit its existing catalogue entry.');const impact=D.productImpact(state,p),old=state.catalog[p.model];openModal('Confirm catalogue impact',`<p><strong>${e(p.model)}</strong></p><div class="table-wrap"><table><thead><tr><th>Field</th><th>Before</th><th>After</th></tr></thead><tbody>${['category','family','powerKw','phase','capacity','bms','from','to'].map(k=>`<tr><td>${k}</td><td>${e(old?.[k]??'Not set')}</td><td>${e(p[k]??'Not set')}</td></tr>`).join('')}</tbody></table></div><p class="table-note">${impact.records} recorded cells · ${V.number(impact.units)} units affected.<br>Historical capacity: ${V.number(impact.oldKwh,1)} → ${V.number(impact.newKwh,1)} kWh.<br>Family, compatibility and applicability changes may also change mix, coverage and ratios. The full change will be logged.</p>`,async()=>commit(D.updateProduct(state,p),'Catalogue updated with an audit entry.'));break;}
    case 'event':{const date=data.get('date'),title=String(data.get('title')).trim();if(!date||!title)throw new Error('Provide an event date and title.');const next=D.clone(state);next.events.push({id:D.uid(),date,title,type:data.get('type'),notes:String(data.get('notes')??'').trim()});next.updatedAt=new Date().toISOString();await commit(next,'Timeline event saved.');$('#modal').close();break;}
  }}catch(err){const errbox=$('#modal').open?$('#dialog-error'):null;if(errbox)errbox.textContent=err.message;else toast(err.message,true);}finally{if(button)button.disabled=false;}
});

try{const saved=await loadState();if(saved){state=D.validateBackup(saved);const merged=D.mergeInverterCatalog(state.catalog);if(merged!==state.catalog){state.catalog=merged;await saveState(state);}}render();}catch(err){ui.storageError=err.message;render();toast('Could not open saved workspace: '+err.message,true);}

})().catch(error=>{console.error(error);const target=document.getElementById('main');if(target){target.textContent='Could not open the dashboard: '+error.message;}});
