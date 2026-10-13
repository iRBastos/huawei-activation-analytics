import test from 'node:test';
import assert from 'node:assert/strict';
import {makeDemo} from '../dist/modules/demo.js';
import {freshState,overview,latestComplete,validateBackup} from '../dist/modules/domain.js';
import {lineChart} from '../dist/modules/charts.js';
test('fictional demo is isolated, clearly named and mathematically complete',()=>{const real=freshState(),before=JSON.stringify(real),demo=makeDemo();assert.equal(JSON.stringify(real),before);assert.equal(Object.keys(demo.records).length,24*8);assert.ok(Object.values(demo.records).every(r=>r.source.filename.startsWith('FICTIONAL_DEMO_')));assert.equal(latestComplete(demo),demo.preferences.end);assert.ok(overview(demo,demo.preferences).attachment.value>0);assert.deepEqual(validateBackup(JSON.parse(JSON.stringify(demo))),demo);});
test('all-hidden chart retains series controls so users can turn a series back on',()=>{const html=lineChart([{name:'Inverter',points:[{label:'2025-01',start:'2025-01',value:100,complete:true}]}],{hidden:new Set(['Inverter'])});assert.match(html,/data-toggle-series="Inverter"/);assert.match(html,/aria-pressed="false"/);});
