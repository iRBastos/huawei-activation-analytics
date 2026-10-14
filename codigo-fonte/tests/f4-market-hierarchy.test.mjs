import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dist/modules/domain.js';
import * as V from '../dist/modules/views.js';
import {makeDemo} from '../dist/modules/demo.js';
const ui={hiddenSeries:new Set(),trendMetric:'volume',mixBasis:'modules',compareMetric:'Inverter',gridPhase:'All',phaseChartMode:'indexed',quarter:3};
const section=(html,title)=>html.indexOf('>'+title+'</h2>');
const sample=()=>makeDemo();
test('market overview puts volume/capacity evidence ahead of supplementary ratios and preserves KPI readings',()=>{
 const state=sample(),html=V.overviewView(state,ui),a=D.overview(state,state.preferences);
 assert.ok(html.indexOf('kpi-grid-primary')<section(html,'What changed'));
 assert.ok(section(html,'What changed')<section(html,'Battery attachment indicators'));
 assert.ok(section(html,'Battery attachment indicators')<section(html,'Activation trend'));
 assert.match(html,/Equipment activity highlights/);
 for(const name of ['Inverter activations','BMS activations','Battery modules','Activated battery capacity','BMS / Inverter','Activated kWh per BMS'])assert.ok(html.includes(name),name);
 assert.ok(a.inverter.value>0 && a.bms.value>0 && a.capacity.value>0);
});
test('inverter model ranking and signed change contribution precede detailed historical charts without truncating picker',()=>{
 const html=V.inverterView(sample(),{...ui,inverterPickerOpen:true,inverterModelSearch:'',inverterSelectedModels:null});
 assert.ok(section(html,'Volume ranking')<section(html,'Single-phase vs Three-phase'));
 assert.ok(section(html,'Contribution to change')<section(html,'Inverter activations by model'));
 assert.match(html,/Search all inverter models/);
 assert.match(html,/Select up to 16 at once/);
 assert.match(html,/Product mix/);
});
test('battery family summaries and product mix precede historical trend; underlying BMS & module tables remain',()=>{
 const html=V.batteriesView(sample(),ui);
 assert.ok(section(html,'S0 family')<section(html,'Product mix'));
 assert.ok(section(html,'Product mix')<section(html,'Equipment activation trend'));
 assert.ok(section(html,'Battery module mix')<section(html,'Equipment activation trend'));
 assert.ok(section(html,'BMS product mix')<section(html,'Equipment activation trend'));
 assert.match(html,/Battery module model detail/);
 assert.match(html,/BMS model detail/);
 assert.match(html,/not verified installation configurations/);
});
test('comparisons opens with metric and primary evidence, keeps coverage and quarterly intelligence as secondary review',()=>{
 const html=V.comparisonsView(sample(),ui);
 assert.ok(html.indexOf('compare-metric')<html.indexOf('kpi-grid'));
 assert.ok(section(html,'Period totals')<section(html,'Comparison evidence'));
 assert.ok(section(html,'Comparison evidence')<section(html,'Monthly profile'));
 assert.ok(section(html,'Monthly contribution to change')<section(html,'Quarterly Intelligence'));
 assert.ok(!html.includes('NaN')&&!html.includes('Infinity'));
 assert.match(html,/Same-quarter KPI year by year/);
 assert.match(html,/Current month/);
 assert.match(html,/Comparison month/);
});
