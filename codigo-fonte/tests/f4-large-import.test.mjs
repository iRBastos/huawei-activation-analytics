import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dist/modules/domain.js';

test('large synthetic full-snapshot import validates all source months, sums and replaces without multiplying accounts',()=>{
 const months=D.monthsBetween('2023-01','2026-12'),count=300;
 const rows=[['Installer',...months.map(m=>Number(m.replace('-','')))],
  ...Array.from({length:count},(_,i)=>['FAKE_TEST_ACCOUNT_'+String(i).padStart(4,'0'),...months.map((_,j)=>(i*3+j*5)%31)])];
 const validation=D.validateInstallerMatrix({rows,filename:'fake-bulk-performance.csv',sheet:'Synthetic'});
 assert.deepEqual(validation.errors,[]);
 assert.equal(validation.sources.length,count);
 const one=D.commitInstallerImport(D.freshState(),validation,{scope:'full',fullScopeConfirmed:true});
 assert.equal(Object.keys(one.installers.accounts).length,count);
 const idx=D.installerIndex(one);
 assert.equal(idx.length,count);
 for(const position of [0,149,299]){
  const name='FAKE_TEST_ACCOUNT_'+String(position).padStart(4,'0');
  const account=idx.find(x=>x.name===name);
  assert.ok(account,name);
  const result=D.installerMonthly(one,account.id);
  assert.equal(result['2023-01'],(position*3)%31);
  assert.equal(result['2026-12'],(position*3+47*5)%31);
 }
 const again=D.commitInstallerImport(one,validation,{scope:'full',fullScopeConfirmed:true});
 assert.equal(Object.keys(again.installers.accounts).length,count);
 assert.equal(again.installers.imports.length,2);
 assert.equal(D.installerIndex(again).length,count);
 for(const position of [0,299]){
  const name='FAKE_TEST_ACCOUNT_'+String(position).padStart(4,'0');
  const account=D.installerIndex(again).find(x=>x.name===name);
  assert.ok(account);
  assert.equal(D.installerMonthly(again,account.id)['2026-12'],(position*3+47*5)%31);
 }
});
