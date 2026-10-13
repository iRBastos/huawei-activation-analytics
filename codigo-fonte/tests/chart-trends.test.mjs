import test from 'node:test';
import assert from 'node:assert/strict';
import {lineChart,indexedSeries} from '../dist/modules/charts.js';
import * as D from '../dist/modules/domain.js';
import * as V from '../dist/modules/views.js';

const point=(label,value,complete,status=complete?'Complete':'Coverage unconfirmed')=>({
 label,start:label,end:label,value,complete,status
});
test('hollow partial monthly points are joined by DASHED lines rather than disappearing',()=>{
 const series=[{name:'Single-phase',model:'All',points:[
  point('2025-10',600,false),point('2025-11',510,false),point('2025-12',340,false)
 ]}];
 const svg=lineChart(series,{unit:'activations'});
 assert.match(svg,/stroke-dasharray="7 5"/);
 assert.equal((svg.match(/stroke-width="2\.7"/g)||[]).length,2);
 assert.match(svg,/provisional observations/);
 assert.match(svg,/fill="white"/);
});
test('complete consecutive points have SOLID lines; missing months are not bridged',()=>{
 const html=lineChart([{name:'BMS',points:[
  point('2025-01',30,true),point('2025-02',35,true),
  point('2025-03',null,false),point('2025-04',40,true)
 ]}]);
 assert.equal((html.match(/stroke-width="2\.7"/g)||[]).length,1);
 assert.doesNotMatch(html,/stroke-dasharray="7 5"/);
});
test('auto focus reveals small trends without modifying the numeric data',()=>{
 const points=[point('2025 Q4',45,true),point('2026 Q1',46,true),point('2026 Q2',51,true),point('2026 Q3',56,true)];
 const svg=lineChart([{name:'BMS / Inverter',points}],{unit:'%'});
 assert.match(svg,/Focused y-axis: it does not start at zero/);
 assert.match(svg,/56\.0%/);
 assert.equal(points[0].value,45);
 const zero=lineChart([{name:'BMS / Inverter',points}],{scale:'zero',unit:'%'});
 assert.doesNotMatch(zero,/Focused y-axis/);
});
test('base-100 phase normalization uses one shared period and retains raw activations',()=>{
 const original=[
  {name:'Single-phase',points:[point('2025-10',600,false),point('2025-11',420,false)]},
  {name:'Three-phase',points:[point('2025-10',60,false),point('2025-11',90,false)]}
 ];
 const indexed=indexedSeries(original);
 assert.equal(indexed.baseLabel,'2025-10');
 assert.equal(indexed.provisional,true);
 assert.deepEqual(indexed.series.map(s=>s.points.map(p=>p.value)),[[100,70],[100,150]]);
 assert.equal(indexed.series[0].points[0].rawValue,600);
 assert.equal(original[0].points[0].value,600);
 const html=lineChart(indexed.series,{unit:'index (base 100)'});
 assert.match(html,/actual 600 activations/);
 assert.match(html,/stroke-dasharray/);
});
test('indexing requires a positive OBSERVED common baseline, without artificial interpolation',()=>{
 const missing=indexedSeries([
  {name:'A',points:[point('2025-10',10,false),point('2025-11',0,false)]},
  {name:'B',points:[point('2025-10',null,false),point('2025-11',5,false)]}
 ]);
 assert.deepEqual(missing.series,[]);
 assert.equal(missing.baseLabel,null);
});
test('inverter view exposes the relative/absolute selector and explicitly labels provisional trends',()=>{
 const state=D.freshState();
 state.preferences={...state.preferences,start:'2025-01',end:'2025-03'};
 for(const [model,quantity] of [['SUN2000-5K-LB0',100],['SUN2000-10KTL-M1',25]]){
  const month='2025-01';
  state.records[D.keyOf(month,model)]={month,model,quantity,source:{filename:'test.xlsx',sheet:'All',cell:'B2'}};
 }
 state.coverage['2025-01|Inverter']={month:'2025-01',category:'Inverter',expected:['SUN2000-5K-LB0','SUN2000-10KTL-M1'],confirmed:true};
 const html=V.inverterView(state,{gridPhase:'All',phaseChartMode:'indexed',hiddenSeries:new Set(),moreFilters:false});
 assert.match(html,/id="phase-chart-mode"/);
 assert.match(html,/Trend index \(base 100\)/);
 assert.match(html,/Absolute activations/);
 assert.match(html,/Single-phase vs Three-phase/);
});

test('percentage ratio labels are rendered as 40.1% (not per 100 units) on chart tooltips and axis',()=>{
 const series=[{name:'BMS / Inverter',model:'All',points:[point('2025 Q4',40.1,true),point('2026 Q1',41.4,true)]}];
 const html=lineChart(series,{unit:'%',title:'BMS / Inverter'});
 assert.match(html,/BMS \/ Inverter 2025 Q4: 40\.1%/);
 assert.match(html,/41\.4%/);
 assert.doesNotMatch(html,/BMS per 100| per 100 inverters/);
 assert.equal(series[0].points[0].value,40.1);
});
test('overview displays ratio as percentage and preserves underlying calculation',()=>{
 const state=D.freshState(),month='2025-01';
 state.preferences={...state.preferences,start:month,end:month};
 const tuples=[['Inverter','SUN2000-5K-LB0',1000],['BMS','LUNA2000-10KW-C1',401],['Battery module','LUNA2000-7-E1',500]];
 for(const [category,model,quantity] of tuples){
  state.records[D.keyOf(month,model)]={month,model,quantity,source:{filename:'test.xlsx',sheet:'test',cell:'B2'}};
  state.coverage[month+'|'+category]={month,category,expected:[model],confirmed:true};
 }
 const ratio=D.overview(state,state.preferences).attachment;
 assert.equal(ratio.value,40.1);
 const html=V.overviewView(state,{trendMetric:'volume',hiddenSeries:new Set()});
 assert.match(html,/BMS \/ Inverter/);
 assert.match(html,/40\.1%/);
 assert.match(html,/Rolling 3 months/);
 assert.doesNotMatch(html,/BMS per 100 inverters/);
});
