import {CATEGORIES,clone,uid,canonical,monthsBetween,applicable} from './model.js';
import {validateProduct,IMPORT_DATASETS,datasetAcceptsCategory} from './validation.js';

export function importPreview(state,validation) {
  return validation.records.map(r=>{const previous=state.records[r.key];let action=r.quantity===null?'Missing — retain existing':!previous||previous.quantity===null?'New':previous.quantity===r.quantity?'Unchanged':'Replace';return {...r,previous:previous?.quantity??null,difference:r.quantity!==null&&previous?.quantity!==null&&previous?.quantity!==undefined?r.quantity-previous.quantity:null,action};});
}
export function commitImport(state,validation,{classifications={},confirmedCategories=[]}={}) {
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
export function undoConflicts(state,id) {
  const h=state.history.find(x=>x.id===id);if(!h||h.undone)throw new Error('This import cannot be undone.');
  const conflicts=[];
  for(const c of h.changes)if(JSON.stringify(state.records[c.key]??null)!==JSON.stringify(c.after))conflicts.push({type:'record',key:c.key});
  for(const c of h.coverageChanges??[])if(JSON.stringify(state.coverage[c.key]??null)!==JSON.stringify(c.after))conflicts.push({type:'coverage',key:c.key});
  for(const c of h.catalogChanges??[])if(JSON.stringify(state.catalog[c.model]??null)!==JSON.stringify(c.after))conflicts.push({type:'catalogue',key:c.model});
  return conflicts;
}
export function undoImport(state,id,skipConflicts=false) {
  const conflicts=undoConflicts(state,id);if(conflicts.length&&!skipConflicts)throw new Error(`${conflicts.length} later changes overlap this import. Review conflicts before undoing.`);
  const next=clone(state),h=next.history.find(x=>x.id===id),blocked=(type,key)=>conflicts.some(x=>x.type===type&&x.key===key);
  for(const c of h.changes)if(!blocked('record',c.key)){if(c.before)next.records[c.key]=c.before;else delete next.records[c.key];}
  for(const c of h.coverageChanges??[])if(!blocked('coverage',c.key)){if(c.before)next.coverage[c.key]=c.before;else delete next.coverage[c.key];}
  for(const c of h.catalogChanges??[])if(!blocked('catalogue',c.model)&&!Object.values(next.records).some(r=>r.model===c.model)&&!Object.values(next.coverage).some(v=>v.expected.includes(c.model))&&!Object.values(next.targets).some(t=>t.scope===c.model)&&!Object.values(next.catalog).some(p=>p.bms===c.model))delete next.catalog[c.model];
  h.undone=true;h.undoAt=new Date().toISOString();h.skippedConflicts=conflicts;next.updatedAt=h.undoAt;return next;
}
export function setCoverage(state,{category,start,end,expected,confirmed}) {
  if(!CATEGORIES.includes(category)||!monthsBetween(start,end).length||!expected.length)throw new Error('Choose a category, valid dates and the expected models.');
  if(expected.some(m=>state.catalog[m]?.category!==category))throw new Error('Expected models must belong to the chosen category.');
  const next=clone(state),id=uid(),changes=[];
  for(const month of monthsBetween(start,end)){const key=`${month}|${category}`,after={month,category,expected:[...new Set(expected)].sort(),confirmed:!!confirmed,updatedBy:id};changes.push({key,before:next.coverage[key]??null,after});next.coverage[key]=after;}
  next.coverageLog.push({id,timestamp:new Date().toISOString(),changes});next.updatedAt=new Date().toISOString();return next;
}
export function productImpact(state,product) {
  const p={...product,model:canonical(product.model)},errs=validateProduct(p,{...state.catalog,[p.model]:p});if(errs.length)throw new Error(errs.join(' '));
  const rs=Object.values(state.records).filter(r=>r.model===p.model),old=state.catalog[p.model];
  if(rs.length&&old?.category!==p.category)throw new Error('Category changes for recorded models are blocked. Undo the source imports before reclassifying.');
  if(rs.some(r=>r.quantity>0&&!applicable(p,r.month)))throw new Error('The proposed applicability period excludes recorded non-zero quantities.');
  const units=rs.reduce((a,r)=>a+r.quantity,0);
  return {product:p,records:rs.length,units,oldKwh:units*(old?.capacity??0),newKwh:units*(p.capacity??0)};
}
export function updateProduct(state,product) {const impact=productImpact(state,product),next=clone(state);next.catalogLog.push({id:uid(),timestamp:new Date().toISOString(),before:next.catalog[impact.product.model]??null,after:impact.product,impact});next.catalog[impact.product.model]=impact.product;next.updatedAt=new Date().toISOString();return next;}
