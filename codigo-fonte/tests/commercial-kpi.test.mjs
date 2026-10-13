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

test('all inverter phase classifications are resolved, including legacy and MBUS',()=>{
 const inverters=Object.values(D.INITIAL_CATALOG).filter(p=>p.category==='Inverter');
 assert.equal(inverters.length,86);
 assert.equal(inverters.filter(p=>p.phase==='Single-phase').length,26);
 assert.equal(inverters.filter(p=>p.phase==='Three-phase').length,60);
 assert.equal(D.inverterPhase('SUN2000-3.68KTL'),'Single-phase');
 assert.equal(D.inverterPhase('SUN2000-5KTL-M1-EU(MBUS)'),'Three-phase');
 assert.equal(D.inverterPhase('SUN2000-10KTL-M1(MBUS)'),'Three-phase');
 assert.equal(D.inverterPhase('UNKNOWN-MODEL'),null);
});

test('M2 and M5 EU/MBUS variants retain exact names and correct three-phase ratings',()=>{
 const expected={
  'SUN2000-20KTL-M2-EU(MBUS)':{family:'M2',powerKw:20},
  'SUN2000-12KTL-M5(MBUS)':{family:'M5',powerKw:12},
  'SUN2000-17KTL-M5(MBUS)':{family:'M5',powerKw:17}
 };
 for(const [model,info] of Object.entries(expected)){
  const found=D.INITIAL_CATALOG[model];
  assert.ok(found,'Missing exact model '+model);
  assert.equal(found.category,'Inverter');
  assert.equal(found.family,info.family);
  assert.equal(found.phase,'Three-phase');
  assert.equal(found.powerKw,info.powerKw);
 }
});
