import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dist/modules/domain.js';

const now=new Date('2026-10-14T12:00:00Z');
const months=['2025-01','2025-02','2025-03','2025-04','2025-05','2025-06'];
const f={start:'2025-06',end:'2025-06',comparison:'previous',
  aggregation:'month',compareStart:'2025-05',compareEnd:'2025-05'};
function fullState(){
 const data={
  Inactive:[10,0,0,0,0,0],
  Reactivated:[8,0,0,0,0,9],
  First:[0,0,0,0,0,7],
  Declining:[0,0,0,0,20,10],
  Growing:[0,0,0,0,10,20],
  Steady:[0,0,0,0,8,9],
  Zero:[0,0,0,0,0,0]
 };
 const rows=[['Installer',...months.map(x=>Number(x.replace('-','')))],...Object.entries(data).map(([name,values])=>[name,...values]),['=== 总计 ===',0,0,0,0,38,55]];
 let state=D.freshState();
 const validation=D.validateInstallerMatrix({rows,filename:'synthetic.csv',sheet:'CSV'});
 assert.deepEqual(validation.errors,[]);
 state=D.commitInstallerImport(state,validation,{scope:'full',fullScopeConfirmed:true});
 state.installerPreferences={...state.installerPreferences,...f,insightMinVolume:5,insightThresholdPct:20};
 return state;
}
const typeMap=state=>Object.fromEntries(D.installerInsights(state,f,{now}).rows.map(r=>[r.name,r]));
test('F5: signals distinguish inactivity, reactivation, first record, commercial change and zero',()=>{
 const rows=typeMap(fullState());
 assert.equal(rows.Inactive.type,'inactive');
 assert.equal(rows.Reactivated.type,'reactivated');
 assert.equal(rows.First.type,'first');
 assert.equal(rows.Declining.type,'declining');
 assert.equal(rows.Growing.type,'growing');
 assert.equal(rows.Steady.type,'steady');
 assert.equal(rows.Zero.type,'zero');
 assert.match(rows.Inactive.evidence,/3 consecutive fully reported zero months/);
 assert.match(rows.Reactivated.evidence,/2025-03–2025-05: confirmed zero/);
 assert.match(rows.First.label,/First recorded/);
 assert.equal(rows.Growing.delta,10);
 assert.equal(rows.Declining.delta,-10);
});
test('F5: incomplete monthly coverage withholds decline and yields a data check',()=>{
 const state=fullState();
 delete state.installers.coverage['2025-05'];
 delete state.installers.sources['name:declining'].months['2025-05'];
 const r=typeMap(state).Declining;
 assert.equal(r.type,'coverage');
 assert.equal(r.priority,'Data check');
 assert.equal(r.score,null);
 assert.match(r.evidence,/Partial/);
});
test('F5: partial months never generate false three-month inactivity or reactivation',()=>{
 const state=fullState();
 delete state.installers.coverage['2025-04'];
 delete state.installers.sources['name:inactive'].months['2025-04'];
 delete state.installers.sources['name:reactivated'].months['2025-04'];
 const map=typeMap(state);
 assert.notEqual(map.Inactive.type,'inactive');
 assert.notEqual(map.Reactivated.type,'reactivated');
});
test('F5: any open or future reporting month cannot be called inactive',()=>{
 const state=fullState();
 const future={...f,start:'2026-10',end:'2026-10',comparison:'previous'};
 const report=D.installerInsights(state,future,{now});
 assert.equal(report.rows.find(r=>r.name==='Inactive').type,'coverage');
 assert.equal(report.rows.find(r=>r.name==='Inactive').priority,'Data check');
});
test('F5: minimum volume and growth thresholds suppress insignificant changes',()=>{
 const state=fullState();
 const strict=D.installerInsights(state,f,{now,minVolume:25,thresholdPct:50});
 assert.equal(strict.rows.find(r=>r.name==='Declining').type,'steady');
 assert.equal(strict.rows.find(r=>r.name==='Growing').type,'steady');
 const growth=D.installerInsights(state,f,{now,minVolume:5,thresholdPct:20});
 assert.equal(growth.rows.find(r=>r.name==='Growing').type,'growing');
 assert.throws(()=>D.installerInsights(state,f,{now,minVolume:0}),/Unsupported/);
 assert.throws(()=>D.installerInsights(state,f,{now,thresholdPct:0}),/Unsupported/);
});
test('F5: scoring is deterministic and CSV/priority filters match evidence',()=>{
 const state=fullState(),original=structuredClone(state);
 const a=D.installerInsights(state,f,{now}),b=D.installerInsights(state,f,{now});
 assert.deepEqual(a,b);
 assert.equal(a.total,7);
 assert.equal(a.rows.reduce((count,row)=>count+(row.priority==='High'),0),a.priorities.High);
 assert.ok(a.rows.every(row=>row.priority!=='Data check'||row.score===null));
 const csv=D.installerInsightsCsv(a);
 assert.equal(csv.length,a.rows.length+1);
 assert.equal(csv[0].length,csv[1].length);
 assert.deepEqual(csv.slice(1).map(row=>row[0]),a.rows.map(row=>row.name));
 assert.equal(csv[1][11],a.rows[0].evidence);
 assert.equal(csv[1][12],a.rows[0].action);
 assert.deepEqual(state,original,'analytics must not mutate saved state');
});
test('F5: legacy backup restores insight thresholds while preserving installer dates',()=>{
 const before=fullState(),original=structuredClone(before);
 delete before.installerPreferences.insightMinVolume;
 delete before.installerPreferences.insightThresholdPct;
 const restored=D.validateBackup(before);
 assert.deepEqual(restored.installerPreferences.insightMinVolume,5);
 assert.deepEqual(restored.installerPreferences.insightThresholdPct,20);
 assert.equal(restored.installerPreferences.start,'2025-06');
 assert.equal(restored.installerPreferences.end,'2025-06');
 assert.deepEqual(original.preferences,restored.preferences);
 const modified=structuredClone(restored);modified.installerPreferences.insightMinVolume=25;
 assert.equal(D.validateBackup(modified).installerPreferences.insightMinVolume,25);
 modified.installerPreferences.insightMinVolume=999;
 assert.throws(()=>D.validateBackup(modified),/Invalid installer reporting preferences/);
});
test('F5: missing account data is never silently classified as declining',()=>{
 const state=fullState();
 const unobserved=D.validateInstallerMatrix({rows:[['Installer',202506],['No Evidence',0]],
  filename:'partial.csv',sheet:'CSV'});
 const partial=D.commitInstallerImport(state,unobserved);
 const result=D.installerInsights(partial,f,{now});
 const entry=result.rows.find(r=>r.name==='No Evidence');
 assert.equal(entry.type,'zero'); // full population in existing May/June supplies 0.
 assert.equal(entry.current.complete,true);
});

test('F5: zero previous baseline is an observable activation signal, not infinite growth',()=>{
 const state=fullState();
 const row=D.installerInsights(state,f,{now}).rows.find(r=>r.name==='First');
 assert.equal(row.type,'first');
 assert.equal(row.growthPct,null);
 const alt=fullState();
 delete alt.installers.coverage['2025-03'];
 const signal=D.installerInsights(alt,f,{now}).rows.find(r=>r.name==='First');
 assert.equal(signal.type,'zeroBase');
 assert.equal(signal.growthPct,null);
 assert.match(signal.action,/zero baseline/);
});
test('F5: an account with meaningful historical volume earns a higher inactivity priority',()=>{
 const report=D.installerInsights(fullState(),f,{now});
 const row=report.rows.find(r=>r.name==='Inactive');
 assert.equal(row.type,'inactive');
 assert.equal(row.priority,'High');
 assert.ok(row.score>=60);
});
