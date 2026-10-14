import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dist/modules/domain.js';
import * as X from '../dist/modules/installer-experiences.js';
import * as V from '../dist/modules/installer-views.js';
const clock=new Date('2026-10-14T12:00:00Z');
const filters={start:'2025-01',end:'2025-02',aggregation:'month',comparison:'year',compareStart:'2024-01',compareEnd:'2024-02'};
function seed(){
  let state=D.freshState();
  const v=D.validateInstallerMatrix({rows:[
    ['Installer',202401,202402,202501,202502],
    ['Alpha Solar',7,8,10,12],['Beta Power',4,5,3,5],['Gamma Energy',1,1,0,0],
    ['=== 总计 ===',12,14,13,17]
  ],filename:'synthetic-fixture.csv',sheet:'CSV'});
  assert.deepEqual(v.errors,[]);
  state=D.commitInstallerImport(state,v,{scope:'full',fullScopeConfirmed:true});
  state.installerPreferences={...state.installerPreferences,...filters};
  return state;
}
const ids=state=>Object.values(state.installers.accounts).sort((a,b)=>a.name.localeCompare(b.name,'en-IE')).map(a=>a.id);
test('F4: dedicated installer section has three tabs and preserves legacy quick-view controls',()=>{
  const state=seed(),ui={installerTab:'overview',hiddenSeries:new Set()};
  const screen=V.installerView(state,ui);
  assert.match(screen,/data-installer-tab="overview"/);
  assert.match(screen,/data-installer-tab="profile"/);
  assert.match(screen,/data-installer-tab="compare"/);
  assert.match(screen,/data-installer-detail=/);
  assert.match(screen,/data-installer-fullprofile=/);
  assert.match(screen,/data-action="installer-compare-from-selected"/);
  assert.doesNotMatch(screen,/id="installer-file"/);
});
test('F4: profile includes three historic charts, recorded monthly table, filters, and export',()=>{
  const state=seed(),ui={installerTab:'profile',hiddenSeries:new Set(),installerProfileId:ids(seed())[0]};
  const html=V.installerView(state,ui);
  assert.match(html,/id="installer-profile-picker"/);
  assert.match(html,/id="installer-profile-search"/);
  assert.match(html,/Monthly history/);
  assert.match(html,/Quarterly history/);
  assert.match(html,/Annual history/);
  assert.match(html,/Historical monthly evidence/);
  assert.equal((html.match(/<svg class="line-chart"/g)??[]).length,3);
  assert.match(html,/data-installer-point=/);
  assert.match(html,/data-action="installer-profile-export"/);
  assert.match(html,/data-action="installer-profile-compare"/);
  assert.match(html,/Peak confirmed month/);
  assert.match(html,/Evidence-based account insight/);
  assert.match(html,/Suggested next action/);
});
test('F4: 2–6 comparison shows full numeric table, two chart types and CSV export',()=>{
  const state=seed(),accounts=ids(state);
  const ui={installerTab:'compare',hiddenSeries:new Set(),installerCompareIds:accounts.slice(0,2)};
  const html=V.installerView(state,ui);
  assert.match(html,/data-installer-compare-pick=/);
  assert.match(html,/aria-pressed="true"/);
  assert.match(html,/Absolute activation trends/);
  assert.match(html,/Indexed trend · baseline 100/);
  assert.match(html,/Account-by-account comparison/);
  assert.match(html,/Underlying period values/);
  assert.match(html,/data-action="installer-compare-export"/);
  assert.match(html,/data-installer-fullprofile=/);
  assert.ok((html.match(/<svg class="line-chart"/g)??[]).length>=2);
  assert.deepEqual(D.installerComparisonCsv(D.installerComparison(state,filters,accounts.slice(0,2),{now:clock}))[0].slice(-2),['2025-01','2025-02']);
});
test('F4: comparison fails safe when selection has only one or zero-baseline accounts',()=>{
  const state=seed(),accounts=ids(state),one=V.installerView(state,{installerTab:'compare',installerCompareIds:accounts.slice(0,1)});
  assert.match(one,/Select at least two installers/);
  const zero=V.installerView(state,{installerTab:'compare',installerCompareIds:[accounts[0],accounts[2]]});
  assert.match(zero,/Indexed comparison unavailable/);
  assert.match(zero,/Absolute activation trends/);
  assert.ok((zero.match(/<svg class="line-chart"/g)??[]).length===1);
});
test('F4: profile and comparison never alter saved reporting preferences',()=>{
 const state=seed(),original=structuredClone(state);
 const selected=ids(state);
 V.installerView(state,{installerTab:'profile',installerProfileId:selected[1]});
 V.installerView(state,{installerTab:'compare',installerCompareIds:selected.slice(0,3)});
 assert.deepEqual(state,original);
});

test('F4: six-account selection disables further additions but retains removals',()=>{
 let state=seed();
 const additional=D.validateInstallerMatrix({rows:[
   ['Installer',202401,202402,202501,202502],
   ['Delta Solar',1,2,3,4],['Epsilon Solar',2,2,4,4],['Zeta Solar',5,5,5,5],
   ['Eta Solar',3,3,3,3]
 ],filename:'more-fixture.csv',sheet:'CSV'});
 state=D.commitInstallerImport(state,additional,{scope:'full',fullScopeConfirmed:true});
 const options=ids(state),ui={installerTab:'compare',installerCompareIds:options.slice(0,6)};
 const html=V.installerView(state,ui);
 assert.match(html,/6 of 6 selected/);
 assert.equal((html.match(/aria-pressed="true" data-installer-compare-pick=/g)??[]).length,6);
 assert.match(html,/data-installer-compare-pick="[^"]+" disabled/);
 assert.match(html,/Account-by-account comparison/);
 assert.equal(D.installerComparison(state,filters,options.slice(0,6),{now:clock}).rows.length,6);
});

test('F5: insights tab displays evidence, saved thresholds, priorities and export',()=>{
 const state=seed(),html=V.installerView(state,{installerTab:'insights',hiddenSeries:new Set()});
 assert.match(html,/data-installer-tab="insights"/);
 assert.match(html,/Account insights & priorities/);
 assert.match(html,/id="installer-insight-volume"/);
 assert.match(html,/id="installer-insight-pct"/);
 assert.match(html,/id="installer-insight-priority"/);
 assert.match(html,/id="installer-insight-type"/);
 assert.match(html,/id="installer-insight-search"/);
 assert.match(html,/data-action="installer-insights-export"/);
 assert.match(html,/Suggested next action/);
 assert.match(html,/How prioritisation works/);
 assert.match(html,/data-installer-fullprofile=/);
});
test('F5: filtering insights never mutates records or saved thresholds',()=>{
 const state=seed(),before=structuredClone(state);
 const html=V.installerView(state,{installerTab:'insights',installerInsightPriority:'Data check',
  installerInsightType:'coverage',installerInsightSearch:'Alpha'});
 assert.match(html,/No accounts match these filters|Verify reporting coverage/);
 assert.deepEqual(state,before);
});
