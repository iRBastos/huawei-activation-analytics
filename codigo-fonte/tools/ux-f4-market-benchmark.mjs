// Reproducible, fictional 48-month market benchmark. Optional snapshot argument:
// node tools/ux-f4-market-benchmark.mjs views.f4-baseline.js
// node tools/ux-f4-market-benchmark.mjs views.js
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import * as D from '../dist/modules/domain.js';
const source=process.argv[2]||'views.js';
if(!/^views(?:\.f4-baseline)?\.js$/.test(source))throw Error('Invalid benchmark source');
const V=await import('../dist/modules/'+source);
const months=D.monthsBetween('2022-10','2026-09');
assert.equal(months.length,48);
const state=D.freshState(),products=Object.values(state.catalog).filter(p=>['Inverter','Battery module','BMS'].includes(p.category));
const expected={Inverter:[], 'Battery module':[], BMS:[]};
for(const p of products)expected[p.category].push(p.model);
for(const month of months){
 for(const cat of D.CATEGORIES)state.coverage[month+'|'+cat]={month,category:cat,expected:expected[cat],confirmed:true};
 for(let i=0;i<products.length;i++){
  const p=products[i],quantity=(i*13+Number(month.slice(-2))*7)%240;
  state.records[D.keyOf(month,p.model)]={month,model:p.model,quantity,source:{filename:'FICTITIOUS_BENCHMARK.xlsx',sheet:'Synthetic',cell:'B'+String(i+2)}};
 }
}
state.preferences={...state.preferences,start:'2025-10',end:'2026-09',compareStart:'2024-10',compareEnd:'2025-09',comparison:'custom',aggregation:'month'};
const ui={hiddenSeries:new Set(),trendMetric:'volume',mixBasis:'modules',compareMetric:'Inverter',gridPhase:'All',phaseChartMode:'indexed',quarter:3};
const calls=[['overview',V.overviewView],['inverters',V.inverterView],['batteries',V.batteriesView],['comparisons',V.comparisonsView]];
const results={source,models:products.length,months:months.length,records:Object.keys(state.records).length,times:{},sizes:{},cards:{}};
for(const [name,fn] of calls){
 const before=performance.now(),html=fn(state,ui);results.times[name]=Math.round(performance.now()-before);results.sizes[name]=html.length;
 assert.ok(html.includes('<h1>')&&!html.includes('NaN')&&!html.includes('Infinity'),name);
 results.cards[name]=(html.match(/<div class="kpi-value">([^<]+)/g)||[]).map(x=>x.replace('<div class="kpi-value">',''));
}
results.totalMs=Object.values(results.times).reduce((a,b)=>a+b,0);
console.log(JSON.stringify(results));
