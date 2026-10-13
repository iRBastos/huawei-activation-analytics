import {CATEGORIES,canonical,totalLabel,monthValue,isBlank,cellValue,columnName,keyOf,applicable} from './model.js';

// Unified imports share the exact same model catalogue and numeric validation as legacy datasets.
export const IMPORT_DATASETS = ['unified','inverters','batteries'];
export function datasetAcceptsCategory(dataset,category) {
  if(!IMPORT_DATASETS.includes(dataset)||!CATEGORIES.includes(category))return false;
  return dataset==='unified'||dataset==='inverters'&&category==='Inverter'||dataset==='batteries'&&category!=='Inverter';
}

export function validateProduct(p,catalog={}) {
  const errors=[];
  if(!canonical(p.model)||totalLabel(p.model)||p.model.includes('|'))errors.push('Use a non-empty model code without |.');
  if(!CATEGORIES.includes(p.category))errors.push('Choose a product category.');
  if(p.category==='Battery module'&&(!Number.isFinite(p.capacity)||p.capacity<=0))errors.push('Battery capacity must be a positive number in kWh.');
  if(p.category!=='Battery module'&&p.capacity!==null)errors.push('Only battery modules have capacity.');
  if(p.bms && (!catalog[p.bms] || catalog[p.bms].category!=='BMS'))errors.push('Compatible BMS must be a classified BMS model.');
  if(p.from&&!monthValue(p.from)||p.to&&!monthValue(p.to)||p.from&&p.to&&p.from>p.to)errors.push('Check the applicability dates.');
  return errors;
}
export function validateMatrix({rows,filename,sheet,headerRow=0,dataset,catalog}) {
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
    else if(!datasetAcceptsCategory(dataset,p.category))errors.push(`${model} (${p.category}) does not belong to the selected ${dataset} dataset. Choose Unified to import all categories together.`);
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
