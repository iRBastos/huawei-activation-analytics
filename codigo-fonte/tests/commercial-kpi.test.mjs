import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dist/modules/domain.js';

function fixture() {
 const state=D.freshState();
 const models={inverter:'SUN2000-5K-LB0',bms:'LUNA2000-10KW-C1',battery:'LUNA2000-7-E1'};
 for (const [year,factor] of [[2024,1],[2025,2]]) {
  for (const n of [7,8,9]) {
   const month=year+'-'+String(n).padStart(2,'0');
   for (const [category,model,base] of [['Inverter',models.inverter,100],['BMS',models.bms,20],['Battery module',models.battery,40]]) {
    state.records[D.keyOf(month,model)]={month,model,quantity:base*factor,source:{filename:'fixture.xlsx',sheet:'test',cell:'B2'}};
    state.coverage[month+'|'+category]={month,category,expected:[model],confirmed:true};
   }
  }
 }
 // The initial catalogue also includes S0 and S1 variants; declare narrow valid scopes
 // only where the fixture has data.
 return state;
}
test('quarter boundaries are exact and same-quarter values are not mixed',()=>{
 const rows=D.sameQuarterYears(fixture(),{quarter:3,years:[2025,2024],kpi:'inverters'});
 assert.deepEqual(rows.map(r=>[r.start,r.end]),[['2024-07','2024-09'],['2025-07','2025-09']]);
 assert.deepEqual(rows.map(r=>r.value),[300,600]);
});
test('quarterly BMS-per-100 and modules-per-BMS reuse existing ratios',()=>{
 const state=fixture();
 const rows=D.sameQuarterYears(state,{quarter:3,years:[2024,2025],kpi:'bmsPer100'});
 assert.deepEqual(rows.map(r=>r.value),[20,20]);
 assert.equal(D.commercialKpi(state,'2024-07','2024-09','modulesPerBms').value,2);
 assert.equal(D.commercialKpi(state,'2024-07','2024-09','kwhPerBms').value,14);
});
test('open quarters are not declared complete',()=>{
 const state=fixture(),rows=D.sameQuarterYears(state,{quarter:4,years:[2026],kpi:'inverters'});
 assert.equal(rows[0].complete,false);
});
test('unknown KPI and invalid quarter are rejected',()=>{
 const state=fixture();
 assert.throws(()=>D.commercialKpi(state,'2024-07','2024-09','imaginary'));
 assert.throws(()=>D.sameQuarterYears(state,{quarter:5,years:[2024]}));
});
