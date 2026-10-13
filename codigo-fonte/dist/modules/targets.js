import {CATEGORIES,clone,monthValue,monthsBetween,applicable} from './model.js';
import {metric} from './calculations.js';

export function targetKey(month,scope) {return `${month}|${scope}`;}
export function saveTarget(state,{month,scope,value}) {
  if(!monthValue(month)||!Number.isSafeInteger(value)||value<0)throw new Error('Targets require a valid month and a non-negative whole number.');
  const category=CATEGORIES.includes(scope)?scope:state.catalog[scope]?.category;if(!category)throw new Error('Unknown target scope.');
  const next=clone(state);next.targets[targetKey(month,scope)]={month,scope,category,value};next.updatedAt=new Date().toISOString();return next;
}
export function targetSummary(state,start,end,category,model='All',family='All') {
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
