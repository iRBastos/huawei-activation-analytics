import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dist/modules/domain.js';

function legacyBackup(){
 const state=D.freshState();
 state.schemaVersion=1;delete state.installers;
 state.catalog=Object.fromEntries(Object.entries(state.catalog).filter(([,p])=>p.category!=='Inverter'));
 assert.equal(Object.keys(state.catalog).length,5);
 return state;
}

test('schema-1 LUNA-only backup migrates to the complete catalogue without changing its other data',()=>{
 const original=legacyBackup();
 original.events=[{id:'event-1',date:'2025-09-14',title:'Historical promotion',type:'Promotion',notes:'old source'}];
 original.records[D.keyOf('2025-08','LUNA2000-5-E1')]={
   month:'2025-08',model:'LUNA2000-5-E1',quantity:37,
   source:{filename:'archive.xlsx',sheet:'Battery',cell:'B2'}
 };
 original.coverage['2025-08|Battery module']={
   month:'2025-08',category:'Battery module',expected:['LUNA2000-5-E1'],confirmed:true
 };
 const snapshot=structuredClone(original);
 const imported=D.validateBackup(original);
 imported.catalog=D.mergeInverterCatalog(imported.catalog);
 assert.equal(Object.values(imported.catalog).filter(p=>p.category==='Inverter').length,86);
 assert.equal(imported.catalog['SUN2000-12KTL-M5(MBUS)'].powerKw,12);
 assert.equal(imported.catalog['SUN2000-12KTL-M5(MBUS)'].phase,'Three-phase');
 assert.deepEqual(imported.records,original.records);
 assert.deepEqual(imported.coverage,original.coverage);
 assert.deepEqual(imported.events,original.events);
 assert.deepEqual(original,snapshot,'migration must never mutate a caller-owned backup');
 assert.doesNotThrow(()=>D.validateBackup(imported));
});

test('migrating the same backup repeatedly is idempotent',()=>{
 const first=legacyBackup();
 const upgraded=D.mergeInverterCatalog(first.catalog);
 assert.equal(Object.keys(upgraded).length,91);
 assert.equal(D.mergeInverterCatalog(upgraded),upgraded);
 assert.equal(Object.keys(first.catalog).length,5);
});

test('standard model metadata in existing backups is not overwritten when explicitly edited',()=>{
 const source=D.freshState().catalog;
 const model='SUN2000-5K-LB0';
 const edited=structuredClone(source);
 edited[model].powerKw=4.9;
 edited[model].phase='Three-phase';
 const merged=D.mergeInverterCatalog(edited);
 assert.equal(merged[model].powerKw,4.9);
 assert.equal(merged[model].phase,'Three-phase');
});

test('missing standard model power and phase are backfilled when restoring',()=>{
 const source=structuredClone(D.freshState().catalog);
 const model='SUN2000-5K-LB0';
 delete source[model].powerKw;delete source[model].phase;
 const merged=D.mergeInverterCatalog(source);
 assert.equal(merged[model].powerKw,5);
 assert.equal(merged[model].phase,'Single-phase');
});

test('F3: installer reporting choices never change the equipment period',()=>{
 const s=D.freshState(),equipment=structuredClone(s.preferences);
 s.installerPreferences={...s.installerPreferences,start:'2025-01',end:'2025-04',aggregation:'quarter'};
 assert.deepEqual(s.preferences,equipment);
 assert.equal(D.installerFilters(s).start,'2025-01');
 assert.notStrictEqual(s.installerPreferences,s.preferences);
 assert.doesNotThrow(()=>D.validateBackup(s));
});
test('F3: older schema-2 backup migrates installer dates without touching product filters',()=>{
 const s=D.freshState();
 Object.assign(s.preferences,{start:'2024-01',end:'2024-12',aggregation:'half',compareStart:'2023-01',compareEnd:'2023-12'});
 delete s.installerPreferences;
 const before=structuredClone(s),migrated=D.validateBackup(s);
 assert.deepEqual(s,before);
 assert.equal(migrated.installerPreferences.start,'2024-01');
 assert.equal(migrated.installerPreferences.end,'2024-12');
 assert.equal(migrated.installerPreferences.aggregation,'month');
 assert.equal(migrated.preferences.aggregation,'half');
 migrated.preferences.start='2026-03';
 assert.equal(migrated.installerPreferences.start,'2024-01');
 assert.deepEqual(D.validateBackup(migrated).installerPreferences,migrated.installerPreferences);
});
test('F3: schema-1 backups get standalone installer preferences',()=>{
 const original=legacyBackup();
 original.preferences.start='2024-07';original.preferences.end='2024-08';
 const migrated=D.validateBackup(original);
 assert.deepEqual(migrated.installerPreferences,D.installerPreferenceDefaults(migrated.preferences));
 assert.equal(migrated.schemaVersion,2);
});
test('F3: bad saved installer filters are rejected',()=>{
 for(const mutate of [
   p=>p.start='2025-13',p=>p.end='2023-01',p=>p.compareStart='2026-12',p=>p.aggregation='bad',p=>p.comparison='bad'
 ]){
  const s=D.freshState();mutate(s.installerPreferences);
  assert.throws(()=>D.validateBackup(s),/Invalid installer reporting preferences/);
 }
});
