import {CATEGORIES,monthsBetween,selectModels,closedMonth,keyOf,applicable,shiftMonth} from './model.js';

export function metric(state,start,end,category,{model='All',family='All',capacity=false,now=new Date()}={}) {
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
export function difference(current,previous) {
  if(!current?.complete||!previous?.complete||current.value===null||previous.value===null)return {delta:null,pct:null,label:'Complete comparable data required'};
  const delta=current.value-previous.value;return {delta,pct:previous.value===0?null:(current.value/previous.value-1)*100,label:previous.value===0?'No percentage baseline':''};
}
export function ratio(numerator,denominator,multiplier=1) {
  const complete=!!numerator.complete&&!!denominator.complete;
  return {value:complete&&denominator.value>0&&numerator.value!==null?numerator.value/denominator.value*multiplier:null,complete,status:!complete?'Complete coverage required':denominator.value===0?'Not calculable — zero denominator':'Complete',numerator:numerator.value,denominator:denominator.value};
}
export function comparisonPeriod(f) {
  if(f.comparison==='custom')return {start:f.compareStart,end:f.compareEnd};
  if(f.comparison==='previous'){const length=monthsBetween(f.start,f.end).length;return {start:shiftMonth(f.start,-length),end:shiftMonth(f.start,-1)};}
  return {start:shiftMonth(f.start,-12),end:shiftMonth(f.end,-12)};
}
export function overview(state,f) {
  const opts={model:f.model,family:f.family};
  const get=(category,capacity=false)=>f.category!=='All'&&f.category!==category?{value:null,complete:false,status:'Outside selected scope'}:metric(state,f.start,f.end,category,{...opts,capacity});
  const inverter=get('Inverter'),bms=get('BMS'),battery=get('Battery module'),capacity=get('Battery module',true);
  const overall=f.model==='All'&&f.category==='All'&&f.family==='All';
  const blocked={value:null,complete:false,status:'Requires all models, categories and families'};
  return {inverter,bms,battery,capacity,attachment:overall?ratio(bms,inverter,100):blocked,kwhPerBms:overall?ratio(capacity,bms):blocked};
}
export function latestComplete(state,categories=CATEGORIES) {
  const months=[...new Set(Object.values(state.coverage).map(c=>c.month))].sort().reverse();
  return months.find(m=>categories.every(c=>metric(state,m,m,c).complete))??null;
}
export function aggregationKey(m,aggregation) {const y=m.slice(0,4),n=+m.slice(5);return aggregation==='quarter'?`${y} Q${Math.ceil(n/3)}`:aggregation==='half'?`${y} H${Math.ceil(n/6)}`:aggregation==='year'?y:m;}
export function trend(state,f,category,capacity=false,model=f.model) {
  const groups=new Map();for(const m of monthsBetween(f.start,f.end)){const key=aggregationKey(m,f.aggregation);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(m);}
  return [...groups].map(([label,ms])=>({label,start:ms[0],end:ms.at(-1),...metric(state,ms[0],ms.at(-1),category,{model,family:f.family,capacity})}));
}
export function movingAverage(state,month,category,opts={},width=3) {const m=metric(state,shiftMonth(month,1-width),month,category,opts);return {...m,value:m.complete?m.value/width:null};}
export function ranking(state,f,category) {
  const comp=comparisonPeriod(f);
  const products=selectModels(state,{category,model:f.model,family:f.family});
  const total=metric(state,f.start,f.end,category,{model:f.model,family:f.family});
  return products.map(p=>{const current=metric(state,f.start,f.end,category,{model:p.model,family:f.family}),previous=metric(state,comp.start,comp.end,category,{model:p.model,family:f.family});return {model:p.model,family:p.family,current,previous,...difference(current,previous),share:total.complete&&current.complete&&total.value>0?current.value/total.value*100:null};}).sort((a,b)=>(b.current.value??-1)-(a.current.value??-1));
}
export function familyRatios(state,f,family) {
  const opts={family},b=metric(state,f.start,f.end,'Battery module',opts),c=metric(state,f.start,f.end,'Battery module',{...opts,capacity:true}),bmsModel=family==='S0'?'LUNA2000-5KW-C0':'LUNA2000-10KW-C1',bms=metric(state,f.start,f.end,'BMS',{model:bmsModel});
  const products=selectModels(state,{category:'Battery module',family});
  const sumCompatible=capacity=>{const unknown=products.some(p=>!p.bms&&Object.values(state.records).some(r=>r.model===p.model&&r.month>=f.start&&r.month<=f.end));const items=products.filter(p=>p.bms===bmsModel).map(p=>metric(state,f.start,f.end,'Battery module',{model:p.model,capacity})).filter(m=>m.status!=='Not applicable');return {value:items.some(m=>m.value!==null)?items.reduce((s,m)=>s+(m.value??0),0):null,complete:!unknown&&items.length>0&&items.every(m=>m.complete),status:unknown?'Module compatibility requires classification':items.length?'Complete compatible module scope':'No compatible module scope'};};
  const compatibleModules=sumCompatible(false),compatibleCapacity=sumCompatible(true);
  return {battery:b,capacity:c,bms,modulesPerBms:ratio(compatibleModules,bms),kwhPerBms:ratio(compatibleCapacity,bms)};
}
export function findings(state,f) {
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
export function filteredRecords(state,f) {const models=new Set(selectModels(state,f).map(p=>p.model));return Object.values(state.records).filter(r=>r.month>=f.start&&r.month<=f.end&&models.has(r.model)).sort((a,b)=>a.month.localeCompare(b.month)||a.model.localeCompare(b.model));}
