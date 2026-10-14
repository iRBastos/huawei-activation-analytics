import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dist/modules/domain.js';
import * as V from '../dist/modules/views.js';
import * as IV from '../dist/modules/installer-views.js';

test('F3: installer import controls only live in the Data workspace',()=>{
 const state=D.freshState(),ui={dataTab:'installer-import',installerPending:null,installerLoading:false,installerError:null,hiddenSeries:new Set()};
 const data=V.dataView(state,ui),installers=IV.installerView(state,ui);
 assert.ok(V.DATA_TABS.some(([key])=>key==='installer-import'));
 assert.match(data,/id="installer-file"/);
 assert.match(data,/Installer import history/);
 assert.match(data,/=== 总计 ===/);
 assert.match(installers,/data-action="installer-open-import"/);
 assert.doesNotMatch(installers,/id="installer-file"/);
 assert.doesNotMatch(installers,/data-form="installer-import"/);
});
test('F3: Data import preview preserves manual worksheet and coverage confirmation controls',()=>{
 const state=D.freshState(),rows=[['Installer',202501],['Alpha Solar',3],['=== 总计 ===',3]];
 const validation=D.validateInstallerMatrix({rows,filename:'fixture.csv',sheet:'CSV'});
 const ui={dataTab:'installer-import',installerPending:{validation,filename:'fixture.csv',sheet:'CSV',rows,headerRow:0,nameColumn:0,workbook:{names:['CSV']}},installerLoading:false,hiddenSeries:new Set()};
 const html=V.dataView(state,ui);
 assert.match(html,/data-form="installer-import"/);
 assert.match(html,/name="fullScopeConfirmed"/);
 assert.match(html,/id="installer-header"/);
 assert.match(html,/id="installer-name-column"/);
 assert.match(html,/Ignored summary row 3/);
});
test('F3: installer import history and source audit are shown in Data rather than ranking',()=>{
 let state=D.freshState();
 const v=D.validateInstallerMatrix({rows:[['Installer',202501],['Alpha Solar',3]],filename:'fixture.csv',sheet:'CSV'});
 state=D.commitInstallerImport(state,v);
 const ui={dataTab:'installer-import',installerPending:null,hiddenSeries:new Set()};
 const data=V.dataView(state,ui),installers=IV.installerView(state,ui);
 assert.match(data,/fixture.csv/);
 assert.match(data,/data-installer-undo-import/);
 assert.doesNotMatch(installers,/data-installer-undo-import/);
});
