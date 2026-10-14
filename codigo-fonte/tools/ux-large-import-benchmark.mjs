// Reproducible synthetic, end-to-end large installer import. No customer data.
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import * as D from '../dist/modules/domain.js';
const t=performance.now();
const n=Number(process.argv[2]??1000);
const months=D.monthsBetween('2022-10','2026-09');
const rows=[['Installer',...months.map(m=>Number(m.replace('-','')))],
 ...Array.from({length:n},(_,i)=>['SYNTHETIC_TEST_COMPANY_'+String(i).padStart(5,'0'),...months.map((m,j)=>(i*3+j*7)%26)])];
const validation=D.validateInstallerMatrix({rows,filename:'synthetic-performance-test.csv',sheet:'Synthetic benchmark'});
assert.deepEqual(validation.errors,[]);
const validated=performance.now();
const state=D.commitInstallerImport(D.freshState(),validation,{scope:'full',fullScopeConfirmed:true});
const committed=performance.now();
const index=D.installerIndex(state);
const indexed=performance.now();
assert.equal(index.length,n);
assert.equal(Object.keys(state.installers.accounts).length,n);
assert.equal(state.installers.imports.length,1);
assert.equal(validation.sources.length,n);
const repeated=D.commitInstallerImport(state,validation,{scope:'full',fullScopeConfirmed:true});
const reimported=performance.now();
assert.equal(repeated.installers.imports.length,2);
assert.equal(Object.keys(repeated.installers.accounts).length,n);
assert.equal(D.installerIndex(repeated).length,n);
console.log(JSON.stringify({accounts:n,months:months.length,cells:n*months.length,validationErrors:validation.errors.length,
  validationMs:Math.round(validated-t),firstCommitMs:Math.round(committed-validated),indexMs:Math.round(indexed-committed),repeatCommitMs:Math.round(reimported-indexed),totalMs:Math.round(reimported-t),
  fullSnapshot:true,sourceRows:validation.sources.length}));
