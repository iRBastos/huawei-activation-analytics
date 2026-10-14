import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as D from '../dist/modules/domain.js';
import * as V from '../dist/modules/views.js';
import * as IV from '../dist/modules/installer-views.js';
import {toCsv} from '../dist/modules/exports.js';
const ui=(tab='import',more={})=>({page:'data',dataTab:tab,dataset:'unified',hiddenSeries:new Set(),...more});

test('F5: Data workspace groups all seven original destinations, preserves route controls and accessible tabs',()=>{
 const html=V.dataView(D.freshState(),ui('history'));
 const paths=[...html.matchAll(/data-data-tab="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual([...paths].sort(),V.DATA_TABS.map(x=>x[0]).sort());
 assert.deepEqual(paths,['import','installer-import','records','coverage','history','catalogue','backup']);
 for(const g of ['Import','Inspect','Configure','Protect'])assert.match(html,new RegExp(`class="data-tab-label"[^>]*>${g}</span>`));
 assert.match(html,/id="data-workspace-content" role="tabpanel" aria-labelledby="data-tab-history"/);
 assert.match(html,/id="data-tab-history"[^>]*aria-selected="true"[^>]*tabindex="0"/);
 assert.equal((html.match(/role="tab"/g)||[]).length,7);
});

test('F5: equipment preview renders at most 200 values, but full 364 values remain validated and CSV-exportable',()=>{
 const state=D.freshState(),months=['202601','202602','202603','202604'];
 const rows=[['index',...months],...Object.keys(state.catalog).map((m,i)=>[m,...months.map((_,j)=>i+j)])];
 const validation=D.validateMatrix({rows,filename:'fictional.csv',sheet:'fixture',dataset:'unified',catalog:state.catalog});
 assert.deepEqual(validation.errors,[]);assert.equal(validation.records.length,364);
 const pending={filename:'fictional.csv',sheet:'fixture',rows,headerRow:0,workbook:{names:['fixture']},classifications:{},validation};
 const rendered=V.dataView(state,ui('import',{pending}));
 assert.match(rendered,/Review incoming values and changes \(364\)/);
 assert.match(rendered,/Showing the first 200 of 364 values for performance/);
 assert.equal((rendered.match(/<tr><td>2026-0[1-4]<\/td>/g)||[]).length,200);
 assert.match(rendered,/data-action="equipment-preview-export"/);
 assert.match(rendered,/name="approved" required/);
 assert.match(rendered,/name="coverage"/);
 const preview=D.importPreview(state,validation);
 assert.equal(preview.length,364);
 const csv=toCsv([['Month','Model','Quantity'],...preview.map(x=>[x.month,x.model,x.quantity])]);
 assert.equal(csv.trim().split('\n').length,365);
 const code=readFileSync(new URL('../dist/modules/app.js',import.meta.url),'utf8');
 assert.match(code,/case 'equipment-preview-export':/);
 assert.match(code,/D\.importPreview\(state,p\.validation\)\.map/);
});

test('F5: monthly target editor is contextual but remains accessible, with unchanged review form and category hierarchy',()=>{
 const initial=D.freshState();initial.preferences.start=initial.preferences.end;
 const empty=V.targetsView(initial);
 assert.match(empty,/class="data-editor target-editor editing" open/);
 assert.match(empty,/data-form="target"/);
 assert.match(empty,/Review target/);
 const saved=D.saveTarget(initial,{month:initial.preferences.end,scope:'Inverter',value:0});
 const view=V.targetsView(saved);
 assert.match(view,/class="data-editor target-editor editing" >/);
 assert.match(view,/How target hierarchy and missing months are calculated/);
 assert.match(view,/Category override/);
 assert.match(view,/No % baseline/);
 assert.equal(saved.targets[D.targetKey(initial.preferences.end,'Inverter')].value,0);
});

test('F5: coverage editing is deliberate; existing scope and inspection remain visible',()=>{
 const s=D.freshState();s.preferences.start=s.preferences.end='2025-01';let html=V.dataView(s,ui('coverage'));
 assert.match(html,/class="data-editor coverage-editor editing" open/);
 assert.match(html,/data-form="coverage"/);
 assert.match(html,/name="confirmed" type="checkbox" checked/);
 const changed=D.setCoverage(s,{category:'Inverter',start:'2025-01',end:'2025-01',expected:['SUN2000-5K-LB0'],confirmed:true});
 html=V.dataView(changed,ui('coverage'));
 assert.match(html,/class="data-editor coverage-editor editing" >/);
 assert.match(html,/Review coverage change/);
 assert.match(html,/2025-01/);
});

test('F5: installer full/partial requirements and backup safety prompts are unchanged',()=>{
 const s=D.freshState(),v=D.validateInstallerMatrix({rows:[['Installer',202501],['Fictional Solar',5]],filename:'synthetic.csv',sheet:'CSV'});
 const pending={validation:v,filename:'synthetic.csv',sheet:'CSV',rows:[['Installer',202501],['Fictional Solar',5]],headerRow:0,nameColumn:0,workbook:{names:['CSV']}};
 const html=IV.installerImportView(s,ui('installer-import',{installerPending:pending}));
 assert.match(html,/Choose reporting scope deliberately/);
 assert.match(html,/option value="partial"/);
 assert.match(html,/option value="full"/);
 assert.match(html,/name="fullScopeConfirmed"/);
 assert.match(html,/name="approved" required/);
 const backup=V.dataView(s,ui('backup'));
 assert.match(backup,/Protect your workspace/);
 assert.match(backup,/data-action="backup"/);
 assert.match(backup,/id="restore-file"/);
 const app=readFileSync(new URL('../dist/modules/app.js',import.meta.url),'utf8');
 assert.match(app,/Replace this workspace with the backup\?/);
 assert.match(app,/D\.validateBackup\(/);
});

test('F5: Data tab keyboard uses the real visible order and does not mutate stored preferences',()=>{
 const source=readFileSync(new URL('../dist/modules/app.js',import.meta.url),'utf8');
 assert.match(source,/document\.querySelectorAll\('\.data-workspace-tabs \[data-data-tab\]'\)/);
 assert.match(source,/\['ArrowRight','ArrowLeft','Home','End'\]/);
 assert.match(source,/navigate\('data',id\)/);
 const state=D.freshState(),before=JSON.stringify(state);
 for(const tab of V.DATA_TABS) V.dataView(state,ui(tab[0]));
 assert.equal(JSON.stringify(state),before);
});
