import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dist/modules/domain.js';
import * as V from '../dist/modules/views.js';
import * as IA from '../dist/modules/installer-analytics-views.js';

const data=D.freshState();
const scope={page:'overview',moreAnalysis:false,moreFilters:false,gridPhase:'All'};

test('F2: navigation groups retain all seven original routes, without duplicates',()=>{
 const html=V.navigation('installers');
 assert.deepEqual([...html.matchAll(/data-nav="([^"]+)"/g)].map(x=>x[1]),['overview','inverters','batteries','comparisons','targets','installers','data']);
 for(const group of ['Market intelligence','Installer intelligence','Data & administration'])assert.ok(html.includes(`aria-label="${group}"`));
 assert.match(html,/data-nav="installers" class="active" aria-current="page"/);
 assert.equal((html.match(/aria-current="page"/g)||[]).length,1);
 assert.equal((V.navigation('overview').match(/aria-current="page"/g)||[]).length,1);
 assert.equal(V.breadcrumb('data','coverage'),'Ireland / Data & administration / Coverage');
});

test('F2: equipment toolbar keeps period visible and exposes secondary controls with valid ARIA targets',()=>{
 const closed=V.filters(data,scope);
 assert.match(closed,/id="shortcut"/);
 assert.match(closed,/data-filter="start"/);
 assert.match(closed,/data-filter="end"/);
 assert.match(closed,/aria-expanded="false" aria-controls="equipment-analysis-options"/);
 assert.match(closed,/id="equipment-analysis-options" hidden/);
 assert.match(closed,/id="equipment-product-options" hidden/);
 assert.match(closed,/data-filter="aggregation"/);
 assert.match(closed,/data-filter="comparison"/);
 const opened=V.filters(data,{...scope,page:'inverters',moreAnalysis:true,moreFilters:true,gridPhase:'Three-phase'});
 assert.doesNotMatch(opened,/id="equipment-analysis-options" hidden/);
 assert.doesNotMatch(opened,/id="equipment-product-options" hidden/);
 assert.match(opened,/id="grid-phase"/);
 assert.match(opened,/Three-phase/);
 assert.doesNotMatch(V.filters(data,{...scope,page:'batteries',moreFilters:true}),/id="grid-phase"/);
});

test('F2: coverage filter is period-only; records can retain scope; installer preferences remain separate',()=>{
 const coverage=V.filters(data,{...scope,page:'data'},{periodOnly:true});
 assert.match(coverage,/id="shortcut"/);
 assert.doesNotMatch(coverage,/data-filter="aggregation"|data-filter="model"|data-filter="comparison"/);
 const installer=IA.installerAnalyticsFilters(data,{moreInstallerOptions:false,installerCohort:'all'});
 assert.match(installer,/data-action="toggle-installer-options" aria-expanded="false"/);
 assert.match(installer,/id="installer-analysis-options" hidden/);
 assert.match(installer,/id="installer-cohort"/);
 assert.match(installer,/Product filters do not apply/);
 const comparable=IA.installerAnalyticsFilters(data,{moreInstallerOptions:true,installerCohort:'comparable'});
 assert.doesNotMatch(comparable,/id="installer-analysis-options" hidden/);
 assert.match(comparable,/Same comparable installers/);
 assert.match(comparable,/data-filter="aggregation"/);
});

test('F2: view generation does not mutate stored reporting preferences',()=>{
 const before=structuredClone(data);
 V.navigation('data');
 V.filters(data,{...scope,moreAnalysis:true,moreFilters:true});
 IA.installerAnalyticsFilters(data,{moreInstallerOptions:true});
 assert.deepEqual(data,before);
});
