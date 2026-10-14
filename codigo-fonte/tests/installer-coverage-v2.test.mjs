import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dist/modules/domain.js';
import {parseCsv} from '../dist/modules/parser.js';
const now=new Date('2026-10-14T12:00:00Z');
const filters={start:'2025-01',end:'2025-02',comparison:'year',aggregation:'month'};
const file=(s,csv,options)=>D.commitInstallerImport(s,D.validateInstallerMatrix({rows:parseCsv(csv),filename:'synthetic.csv',sheet:'CSV'}),options);
const full={scope:'full',fullScopeConfirmed:true};
const aliasCsv='Installer,202401,202402,202501,202502\nAlpha Energy,10,10,,\nAlpha Energy Solar,,,15,15\nBeta Solar,5,5,3,3';
test('full monthly snapshot fixes alias churn without losing additive account totals',()=>{
  const s=file(D.freshState(),aliasCsv,full);
  const a=Object.keys(s.installers.accounts);
  const alpha=a.filter(id=>s.installers.accounts[id].name.startsWith('Alpha'));
  const merged=D.mergeInstallers(s,alpha,'Alpha Energy');
  const r=D.installerAnalysis(merged,filters,{now});
  assert.equal(r.current.complete,true);
  assert.equal(r.previous.complete,true);
  assert.equal(r.current.value,36);
  assert.equal(r.previous.value,30);
  assert.equal(r.change.delta,6);
  assert.equal(r.change.pct,20);
  assert.equal(r.rows.find(x=>x.name==='Alpha Energy').current.value,30);
  assert.equal(r.rows.find(x=>x.name==='Alpha Energy').previous.value,20);
  assert.equal(r.rows.find(x=>x.name==='Alpha Energy').current.fullScopeMonths,2);
});
test('partial scope remains conservative: missing aliases do not become zero',()=>{
  const s=file(D.freshState(),'Installer,202401,202402,202501,202502\nAlpha Energy,10,10,,\nAlpha Energy Solar,,,15,15');
  const merged=D.mergeInstallers(s,Object.keys(s.installers.accounts),'Alpha');
  const r=D.installerAnalysis(merged,filters,{now});
  assert.equal(Object.keys(merged.installers.coverage).length,0);
  assert.equal(r.current.complete,true); // blanks in provided month columns were observed zeros
  assert.equal(r.previous.complete,true);
  // A truly missing source-month in a partial import remains unknown:
  delete merged.installers.sources['name:alpha energy solar'].months['2024-01'];
  assert.equal(D.installerAnalysis(merged,filters,{now}).previous.complete,false);
});
test('a full snapshot confirms absent accounts as zero, but partial month stays unknown',()=>{
  let s=file(D.freshState(),'Installer,202401,202402\nAlpha Solar,5,6',full);
  s=file(s,'Installer,202501,202502\nBeta Solar,2,4',full);
  const accounts=D.installerIndex(s),alpha=accounts.find(x=>x.name==='Alpha Solar'),beta=accounts.find(x=>x.name==='Beta Solar');
  assert.equal(D.installerMeasure([alpha],'2025-01','2025-02',now).value,0);
  assert.equal(D.installerMeasure([alpha],'2025-01','2025-02',now).complete,true);
  assert.equal(D.installerMeasure([beta],'2024-01','2024-02',now).value,0);
  assert.equal(D.installerMeasure(accounts,'2025-01','2025-02',now).value,6);
  assert.equal(D.installerAnalysis(s,filters,{now}).retention,0);
  const partial=file(D.freshState(),'Installer,202501\nAlpha Solar,3');
  assert.equal(D.installerMeasure(D.installerIndex(partial),'2025-02','2025-02',now).value,null);
});
test('full requires positive confirmation and rejects invalid scope',()=>{
  const v=D.validateInstallerMatrix({rows:parseCsv('Installer,202501\nAlpha Solar,5'),filename:'synthetic.csv',sheet:'CSV'});
  assert.throws(()=>D.commitInstallerImport(D.freshState(),v,{scope:'full'}),/Explicitly confirm/);
  assert.throws(()=>D.commitInstallerImport(D.freshState(),v,{scope:'incorrect'}),/Unknown installer reporting scope/);
});
test('partial corrections preserve full scope, while undo restores original source snapshots',()=>{
  const base=file(D.freshState(),'Installer,202501,202502\nAlpha Solar,4,3',full);
  const corrected=file(base,'Installer,202501\nAlpha Solar,8'); // partial
  assert.equal(corrected.installers.coverage['2025-01'].importId,base.installers.coverage['2025-01'].importId);
  const restored=D.undoInstallerImport(corrected,corrected.installers.imports.at(-1).id);
  assert.equal(D.installerMeasure(D.installerIndex(restored),'2025-01','2025-01',now).value,4);
  assert.equal(restored.installers.coverage['2025-01'].mode,'full');
});
test('overlapping full scope changes block old undo, and reverse undo restores scope',()=>{
  const original=file(D.freshState(),'Installer,202501\nAlpha Solar,2',full);
  const updated=file(original,'Installer,202501\nAlpha Solar,3',full);
  assert.throws(()=>D.undoInstallerImport(updated,original.installers.imports[0].id),/overlap/);
  const reverted=D.undoInstallerImport(updated,updated.installers.imports[1].id);
  assert.deepEqual(reverted.installers.coverage['2025-01'],original.installers.coverage['2025-01']);
  const cleared=D.undoInstallerImport(reverted,reverted.installers.imports[0].id);
  assert.equal(cleared.installers.coverage['2025-01'],undefined);
});
test('old schema-2 backup without a coverage ledger migrates without modifying original',()=>{
  const prior=file(D.freshState(),'Installer,202501\nAlpha Solar,5');
  delete prior.installers.coverage;
  const backup=D.validateBackup(prior);
  assert.deepEqual(backup.installers.coverage,{});
  assert.equal(prior.installers.coverage,undefined);
  assert.equal(D.installerIndex(backup)[0].cells['2025-01'].value,5);
});
test('malformed coverage ledgers and tampered history cannot restore',()=>{
  const clean=file(D.freshState(),'Installer,202501\nAlpha Solar,5',full);
  for(const mutate of [
    x=>x.installers.coverage['2025-01'].mode='guess',
    x=>x.installers.coverage['2025-01'].month='2024-01',
    x=>x.installers.imports[0].coverageChanges[0].after.importId='bad-id'
  ]){
    const s=structuredClone(clean);mutate(s);assert.throws(()=>D.validateBackup(s));
  }
});
