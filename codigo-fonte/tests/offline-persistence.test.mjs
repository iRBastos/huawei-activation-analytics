import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../dist/modules/model.js';

const values=new Map();
let failWrite=false;
const local={getItem:key=>values.get(key)??null,setItem(key,value){if(failWrite)throw new Error('Quota exceeded');values.set(key,value);},removeItem:key=>values.delete(key)};
function environment(path='index.html'){
  globalThis.location={protocol:'file:',href:'file:///C:/Huawei/'+path};
  globalThis.indexedDB=undefined;
  globalThis.localStorage=local;
  failWrite=false;
}
let instance=0;
const adapter=()=>import('../dist/modules/persistence.js?offline='+ ++instance);

test('file-open fallback restores complete data through a fresh adapter',async()=>{
  environment();values.clear();const a=await adapter();const state=freshState();
  state.events.push({id:'offline-check',date:'2025-01-01',title:'Offline fixture'});
  await a.saveState(state);assert.equal(a.storageInfo().mode,'localstorage');
  const b=await adapter();assert.deepEqual(await b.loadState(),state);
});
test('file paths isolate copies while navigation hashes retain the workspace',async()=>{
  environment();const a=await adapter();const expected=await a.loadState();
  assert.ok(expected?.events.length);
  globalThis.location.href+='\u0023data';const same=await adapter();
  assert.deepEqual(await same.loadState(),expected);
  environment('other/index.html');const other=await adapter();assert.equal(await other.loadState(),null);
});
test('failed local fallback write retains prior data and rejects the mutation',async()=>{
  environment();const a=await adapter();const before=await a.loadState();
  failWrite=true;await assert.rejects(a.saveState({...before,updatedAt:'changed'}),/Quota/);
  assert.deepEqual(await a.loadState(),before);failWrite=false;
});
test('blocked browser storage enables an explicitly nonpersistent isolated session',async()=>{
  environment();globalThis.localStorage={getItem(){throw new Error('Blocked');}};
  const a=await adapter();assert.equal(await a.loadState(),null);
  assert.deepEqual(a.storageInfo(),{mode:'memory',persistent:false});
  const state=freshState();await a.saveState(state);state.updatedAt='not committed';
  assert.notEqual((await a.loadState()).updatedAt,'not committed');
  const b=await adapter();assert.equal(await b.loadState(),null);
});
