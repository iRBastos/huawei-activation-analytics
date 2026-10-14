import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import * as D from '../dist/modules/domain.js';
import * as V from '../dist/modules/installer-views.js';
const start=performance.now(),months=D.monthsBetween('2022-10','2026-09');
assert.equal(months.length,48);
const cols=months.map(x=>Number(x.replace('-','')));
// One real validated import supplies the canonical source/evidence schema.
// Replicate its already-validated synthetic row to benchmark 1000×48 rendering
// without re-running the importer's quadratic account-history reindex for every row.
const rows=[['Installer',...cols],['Fictional Installer 0000 · Trading as Example Renewables 0',...months.map((_,j)=>j%13===0?'':(j*7)%23)]];
const source=D.validateInstallerMatrix({rows,filename:'ux-f3-fake-1000x48.csv',sheet:'Synthetic'});
assert.deepEqual(source.errors,[]);
let state=D.commitInstallerImport(D.freshState(),source,{scope:'full',fullScopeConfirmed:true});
const [seedAccount]=Object.values(state.installers.accounts),[seedSource]=Object.values(state.installers.sources);
for(let i=1;i<1000;i++){
 const id='fake-account-'+String(i).padStart(4,'0'),key='fake-source-'+i;
 const name='Fictional Installer '+String(i).padStart(4,'0')+' · Trading as Example Renewables '+(i%11);
 state.installers.accounts[id]={...seedAccount,id,name};
 state.installers.sources[key]={...seedSource,key,label:name,accountId:id,months:Object.fromEntries(Object.entries(seedSource.months).map(([m,v])=>[m,{...v,quantity:(i*3+Number(m.slice(-2))*7)%23}]))};
}
const prefs={start:'2025-07',end:'2026-06',aggregation:'month',comparison:'year',compareStart:'2024-07',compareEnd:'2025-06'};
state.installerPreferences={...state.installerPreferences,...prefs};
const accounts=D.installerIndex(state);
assert.equal(accounts.length,1000);
const selections=accounts.slice(993,999).map(x=>x.id);
const overview=V.installerView(state,{installerTab:'overview',installerSelected:new Set(selections),hiddenSeries:new Set()});
assert.match(overview,/Installer ranking \(1000\)/);
assert.match(overview,/data-action="installer-compare-from-selected"/);
assert.match(overview,/data-action="installer-merge"/);
assert.ok(overview.indexOf('Installer ranking')<overview.indexOf('Installer activation trend'));
const compare=V.installerView(state,{installerTab:'compare',installerCompareIds:selections,installerCompareEditorOpen:true});
assert.match(compare,/6 installers selected/);
assert.ok(compare.includes('data-installer-compare-pick="'+accounts[999].id+'"'));
assert.match(compare,/disabled/);
const search=V.installerView(state,{installerTab:'compare',installerCompareIds:selections,installerCompareSearch:'Installer 0999'});
assert.match(search,/matching accounts/);
const profile=V.installerView(state,{installerTab:'profile',installerProfileId:accounts[999].id,installerProfileSearch:'Installer 0999'});
assert.ok(profile.includes('value="'+accounts[999].id+'" selected'));
assert.match(profile,/Historical monthly evidence/);
const insights=V.installerView(state,{installerTab:'insights',installerInsightPriority:'Data check'});
assert.match(insights,/Coverage checks indicate insufficient reporting/);
const result={accounts:accounts.length,months:months.length,sourceRows:rows.length,confirmedBlankCells:source.blankZeros,selectedComparison:selections.length,durationSeconds:Math.round((performance.now()-start)/100)/10,htmlLengths:[overview.length,compare.length,profile.length,insights.length]};
console.log(JSON.stringify(result));
