import * as D from './domain.js';
// Deliberately fictional and isolated. Never persisted to the real database.
export function makeDemo(){
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
