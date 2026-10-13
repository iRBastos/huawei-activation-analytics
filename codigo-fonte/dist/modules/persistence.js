// File-open edition: prefer IndexedDB; fall back only if it cannot be opened.
const IS_FILE=globalThis.location?.protocol==='file:';
const filePath=IS_FILE?globalThis.location.href.split(/[?#]/)[0]:'';
let hash=2166136261;
for(const c of filePath)hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0;
const DATABASE='huawei-activation-analytics-v1'+(IS_FILE?'-file-'+hash.toString(16):'');
const STORAGE_KEY=DATABASE+'-state';
let backendPromise,mode='opening',memoryState=null,local;

function openDatabase(){return new Promise((resolve,reject)=>{
  if(!globalThis.indexedDB){reject(new Error('IndexedDB is unavailable.'));return;}
  const request=indexedDB.open(DATABASE,1);
  request.onupgradeneeded=()=>request.result.createObjectStore('application');
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error??new Error('Could not open browser storage.'));
  request.onblocked=()=>reject(new Error('Close other tabs using this workspace and reopen it.'));
});}

function selectBackend(){return backendPromise??=(async()=>{
  try{const db=await openDatabase();mode='indexeddb';return db;}
  catch(error){
    if(!IS_FILE)throw error;
    try{
      local=globalThis.localStorage;
      const existing=local.getItem(STORAGE_KEY);
      if(existing===null){const probe=STORAGE_KEY+'-probe';local.setItem(probe,'1');local.removeItem(probe);}
      mode='localstorage';
    }catch{local=null;mode='memory';}
    return null;
  }
})();}

export function storageInfo(){return {mode,persistent:mode==='indexeddb'||mode==='localstorage'};}

export async function loadState(){
  const db=await selectBackend();
  if(mode==='localstorage'){const value=local.getItem(STORAGE_KEY);return value===null?null:JSON.parse(value);}
  if(mode==='memory')return memoryState===null?null:structuredClone(memoryState);
  return new Promise((resolve,reject)=>{const tx=db.transaction('application','readonly'),q=tx.objectStore('application').get('state');q.onsuccess=()=>resolve(q.result??null);q.onerror=()=>reject(q.error);});
}

export async function saveState(state){
  const db=await selectBackend();
  if(mode==='localstorage'){local.setItem(STORAGE_KEY,JSON.stringify(state));return;}
  if(mode==='memory'){memoryState=structuredClone(state);return;}
  // A failed write never silently falls back or replaces the previous saved state.
  return new Promise((resolve,reject)=>{const tx=db.transaction('application','readwrite');tx.objectStore('application').put(state,'state');tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error??new Error('Local storage failed. Your previous data has been retained.'));tx.onabort=()=>reject(tx.error??new Error('Save aborted. Your previous data has been retained.'));});
}
