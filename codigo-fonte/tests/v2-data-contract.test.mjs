import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dist/modules/domain.js';
import {parseCsv} from '../dist/modules/parser.js';

// V2 baseline: behavioral contracts before changing UI or persisted data.
const NOW=new Date('2026-10-14T12:00:00Z');
const parse=csv=>D.validateInstallerMatrix({rows:parseCsv(csv),filename:'fictional-v2-fixture.csv',sheet:'CSV'});
const importCsv=(state,csv)=>{const v=parse(csv);assert.deepEqual(v.errors,[],v.errors.join('; '));return D.commitInstallerImport(state,v);};
const ids=s=>Object.keys(s.installers.accounts);

test('V2 baseline: duplicate rows are additive but reimport is a replacement',()=>{
  const csv='Installer,202501,202502,Total\nAlpha Solar,8,5,999\nAlpha Solar,2,,123';
  const v=parse(csv);
  assert.equal(v.duplicates,1);
  assert.equal(v.ignoredTotal,true);
  assert.equal(v.sources[0].months['2025-01'].quantity,10);
  assert.equal(v.sources[0].months['2025-02'].quantity,5);
  const first=D.commitInstallerImport(D.freshState(),v);
  const second=D.commitInstallerImport(first,v);
  assert.deepEqual(D.installerMonthly(second,ids(second)[0]),{'2025-01':10,'2025-02':5});
  assert.equal(second.installers.imports.at(-1).changes.length,0);
});

test('V2 baseline: a blank cell means recorded zero, not missing month',()=>{
  const state=importCsv(D.freshState(),'Installer,202501,202503,Total\nAlpha Solar,,3,600');
  const account=D.installerIndex(state)[0];
  assert.equal(account.cells['2025-01'].value,0);
  assert.equal(account.cells['2025-02'],undefined);
  assert.equal(D.installerMeasure([account],'2025-01','2025-01',NOW).complete,true);
  assert.equal(D.installerMeasure([account],'2025-02','2025-02',NOW).value,null);
  assert.equal(D.installerMeasure([account],'2025-01','2025-03',NOW).complete,false);
});

test('V2 baseline: manually consolidated aliases sum independently',()=>{
  const initial=importCsv(D.freshState(),'Installer,202501,202502,Total\nAlpha Solar,5,2,7\nAlpha Solar Limited,4,3,7');
  const merged=D.mergeInstallers(initial,ids(initial),'Alpha Solar');
  assert.equal(ids(merged).length,1);
  assert.deepEqual(D.installerMonthly(merged,ids(merged)[0]),{'2025-01':9,'2025-02':5});
  assert.equal(Object.keys(merged.installers.sources).length,2);
  assert.equal(D.installerSuggestions(initial).length,1);
  const correction=importCsv(merged,'Installer,202501\nAlpha Solar Limited,6');
  assert.equal(D.installerMonthly(correction,ids(correction)[0])['2025-01'],11);
});

test('V2 baseline: partial comparison never creates fabricated growth',()=>{
  const state=importCsv(D.freshState(),'Installer,202401,202402,202501,202502\nAlpha Solar,8,8,10,10\nBeta Solar,2,2,0,0');
  delete state.installers.sources['name:beta solar'].months['2024-02'];
  const filters={start:'2025-01',end:'2025-02',comparison:'year',aggregation:'month'};
  const report=D.installerAnalysis(state,filters,{now:NOW});
  assert.equal(report.previous.complete,false);
  assert.equal(report.change.delta,null);
  assert.equal(report.change.pct,null);
  const common=D.installerAnalysis(state,filters,{now:NOW,cohort:'comparable'});
  assert.equal(common.eligibleCount,1);
  assert.equal(common.current.value,20);
  assert.equal(common.previous.value,16);
  assert.equal(common.change.delta,4);
  assert.equal(common.change.pct,25);
});

test('V2 baseline: zero previous volume never yields infinite growth',()=>{
  const state=importCsv(D.freshState(),'Installer,202401,202402,202501,202502\nAlpha Solar,0,0,8,7');
  const report=D.installerAnalysis(state,{start:'2025-01',end:'2025-02',comparison:'year',aggregation:'month'},{now:NOW});
  assert.equal(report.change.delta,15);
  assert.equal(report.change.pct,null);
});

test('V2 baseline: old backup migrates and installer/equipment collections stay separate',()=>{
  const old=D.freshState();
  old.schemaVersion=1;
  delete old.installers;
  const migrated=D.validateBackup(old);
  assert.equal(migrated.schemaVersion,2);
  assert.deepEqual(migrated.installers,D.emptyInstallers());
  const populated=importCsv(migrated,'Installer,202501\nAlpha Solar,4');
  const restored=D.validateBackup(JSON.parse(JSON.stringify(populated)));
  assert.deepEqual(restored.installers,populated.installers);
  assert.deepEqual(restored.records,old.records);
  assert.deepEqual(restored.coverage,old.coverage);
});
