import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dist/modules/domain.js';
import * as V from '../dist/modules/views.js';
import {lineChart} from '../dist/modules/charts.js';

test('inverter model selection defaults to top eight and accepts later ranking models',()=>{
 const rows=Array.from({length:18},(_,i)=>({model:'INV-'+String(i+1).padStart(2,'0'),current:{value:100-i}}));
 assert.deepEqual(V.selectedInverterModels(rows).map(x=>x.model),rows.slice(0,8).map(x=>x.model));
 assert.deepEqual(V.selectedInverterModels(rows,[]),[]);
 assert.deepEqual(V.selectedInverterModels(rows,['INV-15','INV-02']).map(x=>x.model),['INV-02','INV-15']);
 assert.equal(V.INVERTER_CHART_MAX,16);
});

function report(){
 const state=D.freshState(),month='2025-01';
 state.preferences={...state.preferences,start:month,end:month,compareStart:'2024-01',compareEnd:'2024-01',comparison:'custom'};
 const inv=Object.values(state.catalog).filter(p=>p.category==='Inverter').slice(0,11);
 inv.forEach((p,i)=>{state.records[D.keyOf(month,p.model)]={
   month,model:p.model,quantity:11-i,source:{filename:'test.xlsx',sheet:'Sheet1',cell:'B2'}
 };});
 state.coverage[month+'|Inverter']={month,category:'Inverter',expected:inv.map(x=>x.model),confirmed:true};
 return {state,models:inv.map(x=>x.model)};
}

test('inverter page offers any catalog model in searchable picker, not only the top 8',()=>{
 const {state,models}=report(),late=models[10];
 const ui={gridPhase:'All',inverterPickerOpen:true,inverterModelSearch:'',inverterSelectedModels:[late],hiddenSeries:new Set()};
 const html=V.inverterView(state,ui);
 assert.match(html,/Choose models/);
 assert.match(html,/inverter-model-search/);
 assert.match(html,/data-inverter-chart-model=/);
 assert.match(html,/Reset to Top 8/);
 assert.ok(html.includes('data-inverter-chart-model="'+late+'"'));
 const start=html.indexOf('Inverter activations by model'),end=html.indexOf('Volume ranking',start);
 assert.ok(html.slice(start,end).includes('data-toggle-series="'+late+'"'), 'selected model must be charted');
 assert.deepEqual(state.preferences.model,'All');
});

test('comparison evidence series respects EXACT table month pairings and missing data',()=>{
 const rows=[
  {month:'2026-01',comparison:'2025-04',x:{value:456,complete:true,status:'Complete'},y:{value:887,complete:true,status:'Complete'}},
  {month:'2026-02',comparison:'2025-05',x:{value:475,complete:false,status:'Coverage unconfirmed'},y:{value:null,complete:false,status:'Missing values'}},
  {month:'2026-03',comparison:'2025-06',x:{value:529,complete:true,status:'Complete'},y:{value:735,complete:true,status:'Complete'}}
 ];
 const [current,comparison]=V.comparisonEvidenceSeries(rows);
 assert.deepEqual(current.points.map(p=>p.start),['2026-01','2026-02','2026-03']);
 assert.deepEqual(comparison.points.map(p=>p.start),['2025-04','2025-05','2025-06']);
 assert.deepEqual(comparison.points.map(p=>p.value),[887,null,735]);
 assert.equal(current.points[1].complete,false);
 const html=lineChart([current,comparison],{id:'comparison-evidence'});
 assert.match(html,/Current period/);
 assert.match(html,/Comparison period/);
 assert.match(html,/data-month="2025-04"/);
 assert.match(html,/stroke-dasharray="7 5"/);
 assert.equal((html.match(/stroke-width="2\.7"/g)||[]).length,2,'missing comparison month cannot be bridged');
});

test('comparison evidence chart appears ABOVE existing evidence table without changing its data',()=>{
 const {state}=report();
 const html=V.comparisonsView(state,{compareMetric:'Inverter',quarter:1,hiddenSeries:new Set()});
 const begin=html.indexOf('Comparison evidence');
 assert.ok(begin>=0);
 const section=html.slice(begin);
 assert.ok(section.indexOf('comparison-evidence')>0);
 assert.ok(section.indexOf('comparison-evidence')<section.indexOf('<table>'));
 assert.match(section,/Current month/);
 assert.match(section,/Comparison month/);
 assert.match(section,/Absolute Δ/);
});
