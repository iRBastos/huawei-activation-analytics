import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dist/modules/domain.js';
import * as V from '../dist/modules/installer-analytics-views.js';
const now=new Date('2026-10-14T12:00:00Z'),f={start:'2025-01',end:'2025-02',comparison:'year',aggregation:'month'};
const seed=()=>{const s=D.freshState();s.preferences={...s.preferences,...f};s.installerPreferences={...s.installerPreferences,...f};for(const [id,values] of Object.entries({Alpha:[10,10,20,20],Beta:[10,10,0,0],Gamma:[0,0,10,10]})){s.installers.accounts[id]={id,name:id};s.installers.sources[id]={label:id,accountId:id,months:Object.fromEntries(['2024-01','2024-02','2025-01','2025-02'].map((m,i)=>[m,{quantity:values[i],source:{filename:'test.csv',sheet:'CSV',cells:[]}}]))};}return s;};
const analyze=(s=seed(),filter=f,options={})=>D.installerAnalysis(s,filter,{now,...options});
test('installer totals, distinct activity, retention, concentration and growth reconcile',()=>{const r=analyze();assert.equal(r.current.value,60);assert.equal(r.previous.value,40);assert.equal(r.change.delta,20);assert.equal(r.change.pct,50);assert.equal(r.active,2);assert.equal(r.retention,50);assert.equal(r.top5,100);assert.ok(Math.abs(r.hhi-5555.55555556)<1e-5);assert.equal(r.rows.reduce((n,x)=>n+x.delta,0),20);assert.ok(Math.abs(r.rows.reduce((n,x)=>n+x.share,0)-100)<1e-9);assert.equal(r.ytdChange.pct,50);});
test('zero baseline has units but no infinite percent',()=>{const r=analyze().rows.find(r=>r.id==='Gamma');assert.equal(r.delta,20);assert.equal(r.pct,null);});
test('missing months suppress comparisons; comparable cohort reconciles',()=>{const s=seed();delete s.installers.sources.Beta.months['2024-02'];const all=analyze(s),same=analyze(s,f,{cohort:'comparable'});assert.equal(all.previous.complete,false);assert.equal(all.change.delta,null);assert.equal(same.eligibleCount,2);assert.equal(same.previous.value,20);assert.equal(same.current.value,60);assert.equal(same.change.pct,200);assert.equal(same.rows.reduce((n,r)=>n+r.delta,0),same.change.delta);});
test('recorded zero differs from missing and an open month is provisional',()=>{const s=seed(),a=D.installerIndex(s).find(a=>a.id==='Beta');assert.equal(D.installerMeasure([a],'2025-01','2025-01',now).value,0);assert.equal(D.installerMeasure([a],'2025-03','2025-03',now).value,null);assert.equal(D.installerMeasure([a],'2025-01','2025-01',new Date('2025-01-20')).complete,false);assert.equal(D.latestInstallerMonth(s,now),'2025-02');});
test('alias union preserves sums and individual source coverage',()=>{const s=seed();s.installers.sources.Beta.accountId='Alpha';delete s.installers.accounts.Beta;const r=analyze(s);assert.equal(r.current.value,60);assert.equal(r.previous.value,40);assert.equal(r.rows.find(r=>r.id==='Alpha').previous.value,40);delete s.installers.sources.Beta.months['2025-02'];assert.equal(analyze(s).current.complete,false);});
test('unequal custom periods withhold growth and retention',()=>{const r=analyze(seed(),{...f,comparison:'custom',compareStart:'2024-01',compareEnd:'2024-01'});assert.equal(r.equalDuration,false);assert.equal(r.change.delta,null);assert.equal(r.retention,null);assert.equal(r.previous.value,20);});
test('3M momentum uses totals across consecutive windows and ranks handle ties',()=>{const s=seed();for(const source of Object.values(s.installers.sources))for(let m=1;m<=6;m++)source.months[`2025-0${m}`]={quantity:m<=3?10:20};const r=analyze(s,{...f,start:'2025-04',end:'2025-06',aggregation:'quarter',comparison:'previous'});assert.equal(r.trend.length,1);assert.equal(r.active,3);assert.equal(r.rows[0].recent3.value,60);assert.equal(r.rows[0].prior3.value,30);assert.equal(r.rows[0].momentum.pct,100);assert.equal(r.change.pct,100);assert.equal(r.rows[0].rank,1);assert.equal(r.rows[2].rank,1);});
test('ranking puts unavailable growth last and CSV records comparison context',()=>{const r=analyze();assert.equal(D.sortInstallerRanking(r.rows,'growth').at(-1).id,'Gamma');const csv=D.installerAnalyticsCsv(r,f);assert.equal(csv[1][3],'2024-01');assert.equal(csv[1][5],'all');assert.equal(csv[0].length,csv[1].length);});
test('visuals route installer evidence separately and mark zero',()=>{const s=seed(),r=analyze(),ui={hiddenSeries:new Set()};assert.match(V.installerDashboard(s,ui,r),/data-installer-point="portfolio"/);assert.match(V.installerHeatmap(r.rows,f,r),/heat-zero/);const profile=V.installerProfile(s,'Alpha',ui);assert.match(profile,/data-installer-point="Alpha"/);assert.doesNotMatch(profile,/data-toggle-series/);assert.match(V.installerPointEvidence(s,'Alpha','2025-01','2025-01',ui),/test.csv/);});
test('undone empty sources do not create tracked zero-volume accounts',()=>{const s=seed();s.installers.sources.Gamma.months={};assert.equal(analyze(s).allCount,2);});

test('F2: shared series matches each monthly account and portfolio measure',()=>{
 const s=seed(),r=analyze(s),accounts=D.installerIndex(s);
 const portfolio=D.installerSeries(accounts,'2025-01','2025-02',{now});
 assert.deepEqual(portfolio.map(p=>p.value),[30,30]);
 assert.deepEqual(portfolio.map(p=>p.value),r.trend.map(p=>p.value));
 assert.deepEqual(r.comparisonTrend.map(p=>p.value),[20,20]);
 assert.equal(r.comparisonTrend[0].start,'2024-01');
 assert.equal(r.comparisonTrend[1].end,'2024-02');
 assert.equal(r.comparisonTrend.reduce((n,p)=>n+p.value,0),r.previous.value);
 const quarter=D.installerSeries(accounts,'2025-01','2025-02',{aggregation:'quarter',now});
 assert.equal(quarter.length,1);
 assert.equal(quarter[0].value,r.current.value);
});
test('F2: individual selector reconciles to ranking, evidence and monthly export',()=>{
 const s=seed(),r=analyze(s);
 const detail=D.installerAccountAnalysis(s,f,'Alpha',{analysis:r});
 const ranking=r.rows.find(x=>x.id==='Alpha');
 assert.equal(detail.current.value,ranking.current.value);
 assert.equal(detail.previous.value,ranking.previous.value);
 assert.equal(detail.change.delta,ranking.delta);
 assert.equal(detail.share,ranking.share);
 assert.equal(detail.points.reduce((sum,p)=>sum+p.value,0),detail.current.value);
 assert.deepEqual(detail.points.map(p=>p.value),[20,20]);
 assert.equal(detail.row.rank,ranking.rank);
 const sheet=D.installerMonthlyCsv(r,f),line=sheet.find(x=>x[0]==='Alpha');
 assert.deepEqual(line.slice(1,3),detail.points.map(p=>p.value));
 assert.equal(line.at(-2),detail.current.value);
 assert.equal(line.at(-1),'Complete');
 assert.equal(D.installerAccountAnalysis(s,f,'untracked',{analysis:r}),null);
});
test('F2: 2–6 installer selector has stable order and same totals as the portfolio',()=>{
 const s=seed(),r=analyze(s),ids=r.accounts.map(a=>a.id);
 const pair=D.installerComparison(s,f,['Alpha','Beta'],{now});
 assert.deepEqual(pair.ids,['Alpha','Beta']);
 assert.equal(pair.current.value,40);
 assert.equal(pair.previous.value,40);
 assert.equal(pair.change.delta,0);
 assert.equal(pair.rows.reduce((sum,row)=>sum+row.current.value,0),pair.current.value);
 assert.equal(pair.rows.reduce((sum,row)=>sum+row.change.delta,0),pair.change.delta);
 assert.equal(pair.trend.reduce((sum,p)=>sum+p.value,0),pair.current.value);
 assert.ok(Math.abs(pair.rows.reduce((sum,row)=>sum+row.share,0)-100)<1e-9);
 const all=D.installerComparison(s,f,ids,{now});
 assert.equal(all.current.value,r.current.value);
 assert.equal(all.previous.value,r.previous.value);
 assert.equal(all.change.delta,r.change.delta);
 assert.deepEqual(all.trend.map(p=>p.value),r.trend.map(p=>p.value));
});
test('F2: no fabricated growth, share or change from unknown coverage / unequal periods',()=>{
 const state=seed();delete state.installers.sources.Beta.months['2024-02'];
 const mixed=D.installerComparison(state,f,['Alpha','Beta'],{now});
 assert.equal(mixed.previous.complete,false);
 assert.equal(mixed.change.delta,null);
 assert.equal(mixed.change.pct,null);
 assert.ok(mixed.rows.every(row=>row.share!==null),'Current fully reported period may still have shares');
 const unequal=D.installerComparison(state,{...f,comparison:'custom',compareStart:'2024-01',compareEnd:'2024-01'},['Alpha','Beta'],{now});
 assert.equal(unequal.equalDuration,false);
 assert.equal(unequal.change.delta,null);
 assert.equal(unequal.rows.every(x=>x.change.delta===null),true);
 const missingState=seed();delete missingState.installers.sources.Alpha.months['2025-01'];
 const partial=D.installerComparison(missingState,f,['Alpha','Beta'],{now});
 assert.equal(partial.current.complete,false);
 assert.equal(partial.rows.every(row=>row.share===null),true);
 const csv=D.installerMonthlyCsv(analyze(missingState),f);
 assert.equal(csv.find(line=>line[0]==='Alpha')[1],null);
});
test('F2: reject malformed 2–6 selections rather than silently removing accounts',()=>{
 const s=seed();
 for(const ids of [[],['Alpha'],['Alpha','Alpha'],['Alpha','missing'],['Alpha','Beta','Gamma','D','E','F','G']])
   assert.throws(()=>D.installerComparison(s,f,ids,{now}),/Select/);
});
test('F2: fully declared monthly zero reconciles across account, compare and monthly CSV',()=>{
 const s=D.freshState();
 // Import as full population through the real validator using plain cell arrays.
 const snap=D.validateInstallerMatrix({rows:[['Installer',202501,202502],['One Solar',5,6],['Two Solar',3,4]],filename:'fixture.csv',sheet:'CSV'});
 const state=D.commitInstallerImport(s,snap,{scope:'full',fullScopeConfirmed:true});
 const later=D.validateInstallerMatrix({rows:[['Installer',202502],['One Solar',6]],filename:'fixture2.csv',sheet:'CSV'});
 const corrected=D.commitInstallerImport(state,later,{scope:'full',fullScopeConfirmed:true});
 const both=D.installerComparison(corrected,{start:'2025-02',end:'2025-02',comparison:'previous',aggregation:'month'},Object.keys(corrected.installers.accounts),{now});
 assert.equal(both.current.value,6);
 assert.equal(both.rows.find(x=>x.name==='Two Solar').current.value,0);
 assert.equal(both.current.complete,true);
 const overview=D.installerAnalysis(corrected,{start:'2025-02',end:'2025-02',comparison:'previous',aggregation:'month'},{now});
 const csv=D.installerMonthlyCsv(overview,{start:'2025-02',end:'2025-02'});
 assert.equal(csv.find(line=>line[0]==='Two Solar')[1],0);
 assert.equal(overview.current.value,6);
});

test('F2: all six selected companies reconcile with the same tracked portfolio',()=>{
 const s=seed();
 for(const name of ['Delta','Epsilon','Zeta']){
   s.installers.accounts[name]={id:name,name};
   s.installers.sources[name]={...structuredClone(s.installers.sources.Alpha),label:name,accountId:name};
 }
 const ids=['Zeta','Alpha','Beta','Epsilon','Gamma','Delta'];
 const selected=D.installerComparison(s,f,ids,{now});
 const portfolio=analyze(s);
 assert.deepEqual(selected.rows.map(row=>row.id),ids);
 assert.equal(selected.rows.length,6);
 assert.equal(selected.current.value,portfolio.current.value);
 assert.equal(selected.previous.value,portfolio.previous.value);
 assert.equal(selected.change.delta,portfolio.change.delta);
 assert.deepEqual(selected.trend.map(point=>point.value),portfolio.trend.map(point=>point.value));
 assert.ok(Math.abs(selected.rows.reduce((n,row)=>n+row.share,0)-100)<1e-9);
});

test('F4: indexed comparison requires a common confirmed positive first bucket',()=>{
 const s=seed(),c=D.installerComparison(s,f,['Alpha','Beta','Gamma'],{now});
 const first=D.installerIndexedComparison(c);
 assert.equal(first.eligible,false,'Gamma first month is zero');
 assert.ok(first.rows.every(r=>r.indexed.every(p=>p.value===null)));
 const two=D.installerComparison(s,f,['Alpha','Beta'],{now}),indexed=D.installerIndexedComparison(two);
 assert.equal(indexed.eligible,false,'Beta first month is zero');
 const good=D.installerComparison(s,f,['Alpha','Gamma'],{now});
 assert.equal(D.installerIndexedComparison(good).eligible,true);
 assert.equal(D.installerIndexedComparison(good).rows[0].indexed[0].value,100);
 assert.equal(D.installerIndexedComparison(good).rows[1].indexed[0].value,100);
 const missing=seed();delete missing.installers.sources.Alpha.months['2025-01'];
 assert.equal(D.installerIndexedComparison(D.installerComparison(missing,f,['Alpha','Gamma'],{now})).eligible,false);
});
test('F4: indexed comparison retains real units and withholds incomplete points',()=>{
 const s=seed();
 const c=D.installerComparison(s,f,['Alpha','Gamma'],{now});
 const normalized=D.installerIndexedComparison(c);
 assert.equal(normalized.eligible,true);
 assert.deepEqual(normalized.rows.map(r=>r.indexed.map(p=>p.value)),[[100,100],[100,100]]);
 assert.equal(normalized.rows[0].indexed[0].rawValue,20);
 assert.equal(normalized.rows[1].indexed[0].rawValue,10);
 const altered=seed();delete altered.installers.sources.Gamma.months['2025-02'];
 const missing=D.installerIndexedComparison(D.installerComparison(altered,f,['Alpha','Gamma'],{now}));
 assert.equal(missing.eligible,true);
 assert.equal(missing.rows[1].indexed[1].value,null);
});
test('F4: history computes confirmed peak, last activity, total and grouping from one selector',()=>{
 const s=seed(),history=D.installerAccountHistory(s,'Alpha',{now,aggregation:'quarter',end:'2025-02'});
 assert.deepEqual(history.points.filter(p=>p.value!==null).map(x=>x.value),[20,40]);
 assert.equal(history.peak.value,20);
 assert.equal(history.peak.start,'2025-01');
 assert.equal(history.firstActive,'2024-01');
 assert.equal(history.lastActive,'2025-02');
 assert.equal(history.total.value,60);
 assert.equal(history.total.complete,false,'intervening unreported months remain unknown');
 assert.equal(D.installerAccountHistory(s,'unknown'),null);
});
test('F4: comparison CSV numerically matches selected rows and chart points',()=>{
 const s=seed(),analysis=D.installerComparison(s,f,['Gamma','Alpha'],{now});
 const out=D.installerComparisonCsv(analysis);
 assert.deepEqual(out[0].slice(-2),['2025-01','2025-02']);
 assert.equal(out[1][0],'Gamma');
 assert.equal(out[1][1],analysis.rows[0].current.value);
 assert.equal(out[1][5],analysis.rows[0].change.delta);
 assert.deepEqual(out[2].slice(-2),analysis.rows[1].trend.map(p=>p.value));
});
