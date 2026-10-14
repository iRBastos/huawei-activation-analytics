import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dist/modules/domain.js';
import * as V from '../dist/modules/installer-views.js';
import * as X from '../dist/modules/installer-experiences.js';
import {readFileSync} from 'node:fs';

const selectedPeriod={start:'2025-01',end:'2025-03',aggregation:'month',comparison:'year',compareStart:'2024-01',compareEnd:'2024-03'};
const base=()=>{
 let s=D.freshState();
 const v=D.validateInstallerMatrix({rows:[['Installer',202401,202402,202403,202501,202502,202503],['Alpha Solar',5,7,9,8,10,12],['Beta Installers',8,5,6,3,0,1],['Gamma Energy',0,0,0,1,1,1]],filename:'f3-synthetic.csv',sheet:'CSV'});
 assert.deepEqual(v.errors,[]);
 s=D.commitInstallerImport(s,v,{scope:'full',fullScopeConfirmed:true});
 s.installerPreferences={...s.installerPreferences,...selectedPeriod};
 return s;
};
test('F3 installer overview prioritises KPIs, evidence and ranking before history, and isolates account unions',()=>{
 const state=base(),html=V.installerView(state,{installerTab:'overview',hiddenSeries:new Set(),installerSelected:new Set()});
 const pos=t=>html.indexOf(t);
 assert.ok(pos('Inverter activations')<pos('Largest contributions to change'));
 assert.ok(pos('Largest contributions to change')<pos('Installer ranking'));
 assert.ok(pos('Installer ranking')<pos('Installer activation trend'));
 assert.ok(pos('Installer activation trend')<pos('Monthly activity heatmap'));
 assert.ok(pos('Monthly activity heatmap')<pos('id="installer-account-management"'));
 const ranking=html.slice(pos('Installer ranking'),pos('Monthly activity heatmap'));
 assert.match(ranking,/data-action="installer-compare-from-selected"/);
 assert.doesNotMatch(ranking,/data-action="installer-merge"/);
 assert.match(html,/<details class="installer-account-management panel editing"/);
 assert.match(html,/data-action="installer-merge"/);
 assert.match(html,/Suggested matches/);
 assert.match(html,/Account union history/);
 assert.match(html,/Identity unions are reviewed separately under Account management/);
});
test('F3 compare displays full precise table above charts, retains all modes, and keeps editor open while adding',()=>{
 const state=base(),ids=D.installerIndex(state).slice(0,2).map(a=>a.id);
 const ui={installerTab:'compare',installerCompareIds:ids,installerCompareEditorOpen:true};
 const html=V.installerView(state,ui);
 assert.match(html,/<details class="installer-compare-edit editing" open>/);
 assert.ok(html.indexOf('Account-by-account comparison')<html.indexOf('Absolute activation trends'));
 assert.match(html,/data-installer-compare-mode="indexed"/);
 assert.equal((html.match(/<svg class="line-chart"/g)??[]).length,1);
 const indexed=V.installerView(state,{...ui,installerCompareMode:'indexed'});
 assert.match(indexed,/Indexed trend · baseline 100/);
 assert.equal((indexed.match(/<svg class="line-chart"/g)??[]).length,1);
 assert.deepEqual(state.installerPreferences,{...state.installerPreferences,...selectedPeriod});
});
test('F3 insights surfaces account priorities before tuning rules, keeping Data check separate',()=>{
 const state=base(),html=X.installerInsightsPage(state,{installerInsightPriority:'All'});
 assert.ok(html.indexOf('Account priorities')<html.indexOf('Evidence thresholds'));
 assert.match(html,/Coverage checks indicate insufficient reporting evidence, not commercial opportunities/);
 assert.match(html,/Priority = Data check/);
 assert.match(html,/<details class="panel installer-analysis-panel installer-insight-rules editing"/);
 for(const control of ['installer-insight-volume','installer-insight-pct','installer-insight-priority','installer-insight-type','installer-insight-search']) assert.ok(html.includes(`id="${control}"`));
 assert.match(html,/data-action="installer-insights-export"/);
});
test('F3 changes stay in the UI layer; mode switch and editor keep view-local state',()=>{
 const code=readFileSync(new URL('../dist/modules/app.js',import.meta.url),'utf8');
 assert.match(code,/el\.dataset\.installerCompareMode/);
 assert.match(code,/ui\.installerCompareMode=el\.dataset\.installerCompareMode/);
 assert.match(code,/ui\.installerCompareEditorOpen=true/);
 assert.match(code,/ui\.installerCompareEditorOpen=event\.target\.open/);
});
