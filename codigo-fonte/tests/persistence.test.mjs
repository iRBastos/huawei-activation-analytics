import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../dist/modules/domain.js';
// Tests the adapter transaction protocol using a deterministic IndexedDB test double.
// This is not a claim of end-to-end verification in a real browser.
const values=new Map();let failNext=false;
globalThis.indexedDB={open(){const request={};queueMicrotask(()=>{request.result={createObjectStore(){},transaction(name,mode){const tx={};tx.objectStore=()=>({get(key){const q={};queueMicrotask(()=>{q.result=structuredClone(values.get(key));q.onsuccess?.();});return q;},put(value,key){const copy=structuredClone(value);queueMicrotask(()=>{if(failNext){failNext=false;tx.error=new Error('Quota simulation');tx.onabort?.();}else{values.set(key,copy);tx.oncomplete?.();}});}});return tx;}};request.onsuccess?.();});return request;}};
test('persistence adapter commits state and reloads through a fresh module instance',async()=>{const a=await import('../dist/modules/persistence.js?instance=one'),s=freshState();s.events.push({id:'x',date:'2025-01-01',title:'Persistence fixture'});await a.saveState(s);const b=await import('../dist/modules/persistence.js?instance=two');assert.deepEqual(await b.loadState(),s);});
test('failed storage transaction rejects and retains the previously committed state',async()=>{const a=await import('../dist/modules/persistence.js?instance=three'),s=freshState();await a.saveState(s);const modified=structuredClone(s);modified.updatedAt='changed';failNext=true;await assert.rejects(a.saveState(modified),/Quota/);assert.deepEqual(await a.loadState(),s);});
