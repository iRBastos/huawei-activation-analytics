import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dist/modules/domain.js';
import {templateRows} from '../dist/modules/exports.js';
import * as V from '../dist/modules/views.js';

const INV='SUN2000-5K-LB0',BAT='LUNA2000-7-E1',BMS='LUNA2000-10KW-C1';
const rows=[
 ['index',202501,202502],
 [INV,10,0],
 [BAT,5,4],
 [BMS,3,2],
 ['Total',18,6]
];
function validate(input=rows,dataset='unified',state=D.freshState()) {
 return D.validateMatrix({rows:input,filename:'Unified_2025.xlsx',sheet:'All Equipment',dataset,catalog:state.catalog});
}

test('unified one-sheet matrix recognises the three equipment categories and reconciles totals',()=>{
 const result=validate();
 assert.deepEqual(result.errors,[]);
 assert.deepEqual(result.unknown,[]);
 assert.equal(result.records.length,6);
 assert.equal(result.totalsFound,1);
 assert.deepEqual(result.months,['2025-01','2025-02']);
 assert.deepEqual(new Set(result.models),new Set([INV,BAT,BMS]));
});
test('unified import commits all three categories in one undoable transaction',()=>{
 const before=D.freshState();
 const after=D.commitImport(before,validate(),{confirmedCategories:D.CATEGORIES});
 assert.equal(Object.keys(before.records).length,0,'input state must not change');
 assert.equal(Object.keys(after.records).length,6);
 assert.equal(after.history.length,1);
 assert.equal(after.history[0].dataset,'unified');
 assert.equal(after.history[0].changes.length,6);
 assert.equal(after.records[D.keyOf('2025-01',INV)].quantity,10);
 assert.equal(after.records[D.keyOf('2025-01',BAT)].quantity,5);
 assert.equal(after.records[D.keyOf('2025-01',BMS)].quantity,3);
 assert.deepEqual(after.coverage['2025-01|Inverter'].expected,[INV]);
 assert.deepEqual(after.coverage['2025-01|Battery module'].expected,[BAT]);
 assert.deepEqual(after.coverage['2025-01|BMS'].expected,[BMS]);
 assert.equal(D.metric(after,'2025-01','2025-01','Inverter').complete,true);
 assert.equal(D.overview(after,{...after.preferences,start:'2025-01',end:'2025-01',category:'All',model:'All',family:'All'}).attachment.value,30);
 const undone=D.undoImport(after,after.history[0].id);
 assert.deepEqual(undone.records,{});
 assert.deepEqual(undone.coverage,{});
});
test('identical unified reimport does not double-count activations',()=>{
 const first=D.commitImport(D.freshState(),validate(),{confirmedCategories:D.CATEGORIES});
 const second=D.commitImport(first,validate(),{confirmedCategories:D.CATEGORIES});
 assert.equal(Object.keys(second.records).length,6);
 assert.equal(second.records[D.keyOf('2025-01',INV)].quantity,10);
 assert.equal(second.history[1].changes.length,0);
 assert.equal(second.history[1].unchanged,6);
 assert.equal(second.history[1].coverageChanges.length,0);
});
test('one corrected category replaces only its matching model/month and can be undone',()=>{
 const first=D.commitImport(D.freshState(),validate(),{confirmedCategories:D.CATEGORIES});
 const correction=rows.map(row=>[...row]);
 correction[2][1]=7;
 correction[4][1]=20;
 const second=D.commitImport(first,validate(correction),{confirmedCategories:D.CATEGORIES});
 assert.equal(second.history[1].changes.length,1);
 assert.equal(second.records[D.keyOf('2025-01',BAT)].quantity,7);
 assert.equal(second.records[D.keyOf('2025-01',INV)].quantity,10);
 const restored=D.undoImport(second,second.history[1].id);
 assert.equal(restored.records[D.keyOf('2025-01',BAT)].quantity,5);
});
test('invalid quantity and mismatched grand total block the entire mixed import',()=>{
 for(const edit of [{row:1,column:1,value:-1},{row:4,column:1,value:999}]){
  const invalid=rows.map(row=>[...row]);
  invalid[edit.row][edit.column]=edit.value;
  const v=validate(invalid);
  assert.notEqual(v.errors.length,0);
  const before=D.freshState(),snapshot=structuredClone(before);
  assert.throws(()=>D.commitImport(before,v,{confirmedCategories:D.CATEGORIES}));
  assert.deepEqual(before,snapshot,'failed import must not mutate existing workspace');
 }
});
test('multiple grand totals and unsupported dataset names are blocked',()=>{
 const extra=rows.map(r=>[...r]);
 extra.push(['Grand Total',18,6]);
 assert.match(validate(extra).errors.join(' '),/at most one grand total/);
 assert.match(validate(rows,'wrong-mode').errors.join(' '),/supported dataset/);
 assert.throws(()=>D.commitImport(D.freshState(),{...validate(),dataset:'wrong-mode'},{confirmedCategories:D.CATEGORIES}));
});
test('legacy import modes continue rejecting cross-category models',()=>{
 assert.match(validate(rows,'inverters').errors.join(' '),/does not belong/);
 assert.match(validate(rows,'batteries').errors.join(' '),/does not belong/);
 const onlyInverters=validate([['index',202501],[INV,10],['Total',10]],'inverters');
 const onlyBatteries=validate([['index',202501],[BAT,5],[BMS,3],['Total',8]],'batteries');
 assert.deepEqual(onlyInverters.errors,[]);
 assert.deepEqual(onlyBatteries.errors,[]);
});
test('unrecognised models must be explicitly classified before a unified commit',()=>{
 const unknown='SUN2000-UNKNOWN-REV',newRows=[['index',202501],[INV,10],[unknown,1],['Total',11]];
 const validation=validate(newRows);
 assert.deepEqual(validation.unknown,[unknown]);
 assert.throws(()=>D.commitImport(D.freshState(),validation));
 const classification={model:unknown,category:'Inverter',family:'',capacity:null,bms:null,from:null,to:null};
 const committed=D.commitImport(D.freshState(),validation,{classifications:{[unknown]:classification}});
 assert.equal(committed.records[D.keyOf('2025-01',unknown)].quantity,1);
});
test('blank cells preserve earlier values rather than replacing them with zero',()=>{
 const first=D.commitImport(D.freshState(),validate(),{confirmedCategories:D.CATEGORIES});
 const blankRows=rows.map(r=>[...r]);
 blankRows[1][1]='';
 const validation=validate(blankRows);
 assert.equal(validation.records.find(r=>r.month==='2025-01'&&r.model===INV).quantity,null);
 const second=D.commitImport(first,validation,{confirmedCategories:D.CATEGORIES});
 assert.equal(second.records[D.keyOf('2025-01',INV)].quantity,10);
});
test('unified CSV template and import screen include all three equipment categories',()=>{
 const sample=templateRows('unified',['2025-01']);
 const listed=new Set(sample.slice(1,-1).map(x=>x[0]));
 for(const model of [INV,BAT,BMS])assert.ok(listed.has(model));
 const view=V.dataView(D.freshState(),{dataTab:'import',dataset:'unified',loading:false,moreFilters:false});
 assert.match(view,/Unified — all equipment/);
 assert.match(view,/template-unified/);
});

test('new M2/M5 MBUS inverter models are auto-recognised in a combined workbook',()=>{
 const models=['SUN2000-20KTL-M2-EU(MBUS)','SUN2000-12KTL-M5(MBUS)','SUN2000-17KTL-M5(MBUS)'];
 const worksheet=[['index',202501],...models.map((model,i)=>[model,i+1]),[BAT,4],[BMS,5],['Total',15]];
 const result=validate(worksheet);
 assert.deepEqual(result.errors,[]);
 assert.deepEqual(result.unknown,[]);
 assert.equal(result.models.length,5);
 const state=D.commitImport(D.freshState(),result,{confirmedCategories:D.CATEGORIES});
 assert.equal(Object.keys(state.records).length,5);
 for(const model of models){
   assert.equal(state.catalog[model].category,'Inverter');
   assert.equal(state.catalog[model].phase,'Three-phase');
 }
});
test('unknown-model validation offers Inverter even when legacy battery mode was selected',()=>{
 const state=D.freshState(),unknown='UNREGISTERED-INVERTER-TEST';
 const sheet=[['index',202501],[unknown,2],['Total',2]];
 const validation=validate(sheet,'batteries');
 const html=V.dataView(state,{
  dataTab:'import',dataset:'batteries',loading:false,
  pending:{validation,filename:'test.xlsx',sheet:'Sheet1',headerRow:0,rows:sheet,
   classifications:{},workbook:{names:['Sheet1']},headerUncertain:false}
 });
 assert.match(html,/option value="Inverter"/);
 assert.match(html,/Inverter rated power/);
 assert.match(html,/Inverter grid phase/);
 assert.match(html,/switches this import to Unified/);
});
test('manual inverter metadata is validated, and legacy inverter entries remain accepted',()=>{
 const model='SUN2000-CUSTOM';
 const base={model,category:'Inverter',family:'M2',capacity:null,bms:null,from:null,to:null};
 assert.deepEqual(D.validateProduct(base,D.INITIAL_CATALOG),[]);
 assert.deepEqual(D.validateProduct({...base,powerKw:12,phase:'Three-phase'},D.INITIAL_CATALOG),[]);
 assert.match(D.validateProduct({...base,powerKw:-3,phase:'Other'},D.INITIAL_CATALOG).join(' '),/rated power/);
 assert.match(D.validateProduct({...base,powerKw:12,phase:'Other'},D.INITIAL_CATALOG).join(' '),/grid phase/);
});
