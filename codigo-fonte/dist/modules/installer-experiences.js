import * as D from './domain.js';
import {escapeHtml as e} from './exports.js';
import {lineChart} from './charts.js';
const n=(v,d=0)=>v==null?'—':v.toLocaleString('en-IE',{maximumFractionDigits:d});
const pct=v=>v==null?'—':n(v,1)+'%';
const signed=v=>v==null?'—':(v>0?'+':'')+n(v);
const panel=(title,body)=>`<section class="panel installer-analysis-panel"><div class="panel-head"><h2>${e(title)}</h2></div>${body}</section>`;
const kpi=(title,value,note)=>`<article class="installer-kpi"><span>${e(title)}</span><strong>${e(value)}</strong><p>${e(note)}</p></article>`;
const chart=(name,points,id,accountId)=>lineChart([{name,accountId,points}],{installer:true,id,title:name+' inverter activations',scale:'zero',showLegend:false});
const order=(a,b)=>a.name.localeCompare(b.name,'en-IE');
export function installerTabNav(active='overview'){
 const options=[['overview','Installer overview'],['profile','Installer profile'],['compare','Compare 2–6'],['insights','Insights & priorities']];
 return `<div class="tabs installer-section-tabs editing" role="tablist" aria-label="Installer analytics views">${options.map(([id,title])=>`<button role="tab" aria-selected="${active===id}" class="${active===id?'active':''}" data-installer-tab="${id}">${title}</button>`).join('')}</div>`;
}
export function installerProfilePage(state,ui){
 const f=D.installerFilters(state),accounts=D.installerIndex(state).sort(order),term=(ui.installerProfileSearch??'').trim().toLocaleLowerCase('en-IE');
 if(!accounts.length)return '<div class="notice">Import installer records in Data first.</div>';
 const id=accounts.some(a=>a.id===ui.installerProfileId)?ui.installerProfileId:accounts[0].id;
 const subset=accounts.filter(a=>a.id===id||!term||[a.name,...a.aliases].some(v=>v.toLocaleLowerCase('en-IE').includes(term))).slice(0,100);
 const select=`<section class="panel installer-analysis-panel"><div class="panel-head"><h2>Choose one installer</h2><button data-action="installer-open-import">Manage installer data</button></div><div class="form-row"><label class="field">Search account or original name<input id="installer-profile-search" type="search" value="${e(ui.installerProfileSearch??'')}" placeholder="Search all tracked installers"></label><label class="field">Installer account<select id="installer-profile-picker">${subset.map(a=>`<option value="${e(a.id)}" ${id===a.id?'selected':''}>${e(a.name)}</option>`).join('')}</select></label></div><p class="table-note">${accounts.length} tracked accounts · use search to narrow the selector. Original imported aliases are consolidated only after manual confirmation.</p></section>`;
 const profile=D.installerAccountAnalysis(state,f,id,{cohort:ui.installerCohort??'all'}),history=D.installerAccountHistory(state,id,{now:profile.report.now,end:f.end});
 if(!history?.points.length)return select+'<p>No historical values in the selected interval.</p>';
 const quarterly=D.installerSeries([history.account],history.start,history.end,{aggregation:'quarter',now:profile.report.now});
 const yearly=D.installerSeries([history.account],history.start,history.end,{aggregation:'year',now:profile.report.now});
 const rank=profile.row?.rank,note=profile.current.complete?'Complete selected period':'Incomplete reporting; figures are observed subtotals only';
 const signal=D.installerAccountSignal(profile,f);
 const signalPanel=panel('Evidence-based account insight',
  '<p><strong>'+e(signal.label)+'</strong> · '+e(signal.priority)+
  (signal.score===null?'':' · Rule score '+n(signal.score))+'</p>'+
  '<p class="table-note"><strong>Evidence:</strong> '+e(signal.evidence)+'</p>'+
  '<p class="table-note"><strong>Suggested next action:</strong> '+e(signal.action)+'</p>'+
  '<div class="panel-actions"><button data-installer-tab="insights">See all account priorities</button></div>');
 const kpis=`<div class="installer-kpis">${kpi('Selected activations',n(profile.current.value),profile.current.status)}${kpi('Compared with previous',pct(profile.change.pct),profile.change.delta==null?'Complete equal-length periods required':signed(profile.change.delta)+' activations')}${kpi('Peak confirmed month',history.peak?n(history.peak.value):'—',history.peak?.start??'No confirmed month')}${kpi('Last recorded activity',history.lastActive??'—','Latest observed month with activations > 0')}</div>`;
 const lines=`<div class="grid-equal">${panel('Monthly history',`<div class="chart-scroll">${chart(profile.account.name,history.monthly,'installer-history-month',id)}</div>`)}${panel('Quarterly history',`<div class="chart-scroll">${chart(profile.account.name,quarterly,'installer-history-quarter',id)}</div>`)}</div>${panel('Annual history',`<div class="chart-scroll">${chart(profile.account.name,yearly,'installer-history-year',id)}</div>`)}`;
 const rows=history.monthly.map(p=>`<tr><td><button class="quiet" data-installer-point="${e(id)}" data-month="${e(p.start)}" data-end="${e(p.end)}">${e(p.label)}</button></td><td class="num">${n(p.value)}</td><td>${e(p.status)}</td><td>${p.observed} / ${p.expected}</td></tr>`).join('');
 return select+`<section class="installer-profile-heading"><h2>${e(profile.account.name)}</h2><p class="table-note">${profile.account.aliases.map(e).join(' · ')} · Rank in selected account base: ${n(rank)} · ${e(note)}</p><div class="panel-actions"><button data-action="installer-profile-export">Export monthly history CSV</button><button data-action="installer-profile-compare">Compare this installer</button></div></section>`+kpis+signalPanel+
 `<div class="grid-equal">${panel('Account history',`<dl class="installer-measures"><dt>First recorded activity</dt><dd>${history.firstActive??'—'}</dd><dt>Last recorded activity</dt><dd>${history.lastActive??'—'}</dd><dt>Historical reported volume</dt><dd>${n(history.total.value)}${history.total.complete?'':' *'}</dd><dt>Historical period</dt><dd>${e(history.start)}–${e(history.end)}</dd><dt>3-month momentum</dt><dd>${pct(profile.momentum.pct)}</dd><dt>Share of selected tracked base</dt><dd>${pct(profile.share)}</dd></dl><p class="table-note">* Historical volume may be a partial subtotal. Missing months are never assumed to be zero.</p>`)}${panel('Coverage & identity',`<p class="table-note">This account includes ${profile.account.sourceCount} original source name(s). Chart points show reported observations. A complete snapshot can confirm zeros; missing partial snapshots remain unknown.</p><p class="table-note">Latest confirmed month: ${history.lastConfirmed??'None'}</p><p class="table-note">Product models, site count and revenue cannot be attributed from this installer dataset.</p>`)}</div>`+
 lines+panel('Historical monthly evidence',`<div class="table-wrap"><table><thead><tr><th>Month</th><th>Activations</th><th>Reporting status</th><th>Coverage units</th></tr></thead><tbody>${rows}</tbody></table></div>`);
}
export function installerComparisonPage(state,ui){
 const f=D.installerFilters(state),accounts=D.installerIndex(state).sort(order),byId=new Map(accounts.map(a=>[a.id,a]));
 const ids=(ui.installerCompareIds??[]).filter((id,i,all)=>byId.has(id)&&all.indexOf(id)===i).slice(0,6);
 const term=(ui.installerCompareSearch??'').trim().toLocaleLowerCase('en-IE');
 const results=accounts.filter(a=>[a.name,...a.aliases].some(v=>v.toLocaleLowerCase('en-IE').includes(term))).slice(0,80);
 const choices=panel('Select 2–6 installers',
 `<label class="field">Find installers<input id="installer-compare-search" type="search" value="${e(ui.installerCompareSearch??'')}" placeholder="Search installer or source name"></label><p class="table-note">${ids.length} of 6 selected. Click a name to add/remove; accounts are consolidated only via confirmed unions. ${results.length} options shown from ${accounts.length} tracked accounts.</p><div class="installer-compare-chips">${ids.map(id=>`<button data-installer-compare-pick="${e(id)}" aria-label="Remove ${e(byId.get(id).name)}">× ${e(byId.get(id).name)}</button>`).join('')}</div><div class="installer-compare-picker">${results.map(a=>`<button aria-pressed="${ids.includes(a.id)}" data-installer-compare-pick="${e(a.id)}" ${ids.length>=6&&!ids.includes(a.id)?'disabled':''}><span>${e(a.name)}</span><strong>${ids.includes(a.id)?'Selected':'Add'}</strong></button>`).join('')||'<p class="table-note">No accounts match that search.</p>'}</div>`);
 if(ids.length<2)return choices+'<div class="notice">Select at least two installers to compare volume, growth and trends. Maximum six.</div>';
 const c=D.installerComparison(state,f,ids),indexed=D.installerIndexedComparison(c);
 const palette=['#c71932','#237687','#7550a7','#ae6a20','#278066','#657187'];
 const volume=c.rows.map((r,i)=>({name:r.name,accountId:r.id,color:palette[i],points:r.trend}));
 const indexedSeries=indexed.rows.map((r,i)=>({name:r.name,accountId:r.id,color:palette[i],points:r.indexed}));
 const table=panel('Account-by-account comparison',`<div class="table-wrap"><table><thead><tr><th>Installer</th><th>Selected activations</th><th>Previous</th><th>Difference</th><th>Growth</th><th>Share of selected volume</th><th>Coverage</th></tr></thead><tbody>${c.rows.map((r,i)=>`<tr><th><button data-installer-fullprofile="${e(r.id)}">${e(r.name)}</button></th><td class="num">${n(r.current.value)}</td><td class="num">${n(r.previous.value)}</td><td class="num">${signed(r.change.delta)}</td><td>${pct(r.change.pct)}</td><td>${pct(r.share)}</td><td>${e(r.current.status)}</td></tr>`).join('')}</tbody></table></div>`);
 const bucketRows=c.trend.map((point,i)=>`<tr><td>${e(point.label)}</td>${c.rows.map(r=>`<td class="num">${n(r.trend[i]?.value)}</td>`).join('')}<td class="num">${n(point.value)}</td><td>${e(point.status)}</td></tr>`).join('');
 const bottom=panel('Underlying period values',`<div class="table-wrap"><table><thead><tr><th>Period</th>${c.rows.map(r=>`<th>${e(r.name)}</th>`).join('')}<th>Selected total</th><th>Coverage</th></tr></thead><tbody>${bucketRows}</tbody></table></div>`);
 const notice=!c.equalDuration?'<p class="notice">Period lengths differ. Growth percentages and contribution changes are withheld.</p>':'';
 const chartNote=indexed.eligible?'Index starts at 100 for every installer using the same first complete and positive reporting bucket.':'Indexed comparison unavailable: the first reporting bucket must be complete and positive for every selected installer. Absolute volumes remain visible.';
 return choices+`<section class="installer-profile-heading"><h2>Installer comparison</h2><p class="table-note">${e(f.start)}–${e(f.end)} vs ${e(c.comparison.start)}–${e(c.comparison.end)} · tracked Huawei inverter activations, not Irish market share.</p><button data-action="installer-compare-export">Export comparison CSV</button></section>`+
 `<div class="installer-kpis">${kpi('Selected activations',n(c.current.value),c.current.status)}${kpi('Previous interval',n(c.previous.value),c.previous.status)}${kpi('Net change',signed(c.change.delta),c.change.pct==null?c.change.label:pct(c.change.pct))}${kpi('Installers compared',String(ids.length),'Distinct consolidated accounts')}</div>`+notice+
 panel('Absolute activation trends',`<div class="chart-scroll">${lineChart(volume,{id:'installer-compare-volume',title:'Compared installer activation volumes',installer:true,scale:'zero'})}</div>`)+
 panel('Indexed trend · baseline 100',`<p class="table-note">${e(chartNote)}</p>${indexed.eligible?`<div class="chart-scroll">${lineChart(indexedSeries,{id:'installer-compare-index',title:'Indexed installer activation comparison',installer:true,unit:'index',scale:'auto'})}</div>`:''}`)+table+bottom;
}


export function installerInsightsPage(state,ui){
 const f=D.installerFilters(state),data=D.installerInsights(state,f);
 const typeNames=[
  ['reactivated','Reactivated'],['inactive','Inactive · 3 confirmed zeros'],
  ['declining','Declining'],['growing','Growing'],['first','First recorded activity'],
  ['zeroBase','Activity after zero baseline'],['steady','No significant movement'],
  ['zero','No recorded activity'],['coverage','Verify data']];
 const currentPriority=ui.installerInsightPriority??'All';
 const currentType=ui.installerInsightType??'All';
 const query=(ui.installerInsightSearch??'').trim().toLocaleLowerCase('en-IE');
 const selected=data.rows.filter(row=>(currentPriority==='All'||row.priority===currentPriority)&&
   (currentType==='All'||row.type===currentType)&&
   (!query||row.name.toLocaleLowerCase('en-IE').includes(query)));
 const maxPage=Math.max(0,Math.ceil(selected.length/50)-1),page=Math.min(ui.installerInsightPage??0,maxPage);
 const shown=selected.slice(page*50,(page+1)*50);
 const selectOption=(value,label,selectedValue)=>`<option value="${e(value)}" ${value===selectedValue?'selected':''}>${e(label)}</option>`;
 const filters=`<section class="panel installer-analysis-panel"><div class="panel-head"><h2>Evidence thresholds</h2><button data-action="installer-insights-export">Export all insights CSV</button></div><div class="form-row"><label class="field">Minimum relevant change (activations)<select id="installer-insight-volume">${D.INSIGHT_MIN_VOLUMES.map(x=>selectOption(String(x),String(x),String(data.minVolume))).join('')}</select></label><label class="field">Minimum percentage change<select id="installer-insight-pct">${D.INSIGHT_CHANGE_THRESHOLDS.map(x=>selectOption(String(x),x+'%',String(data.thresholdPct))).join('')}</select></label></div><p class="table-note">Growth and decline require complete, equal-length selected/comparison periods; the previous volume must meet the minimum, the absolute change must meet the minimum, and the percentage change must meet the threshold. The selected interval is ${e(data.periodStart)}–${e(data.periodEnd)}. The thresholds are saved with your offline backup.</p><p class="table-note">A month is only considered inactive after three consecutive <strong>fully confirmed zero</strong> months and evidence of earlier positive activity. A reactivation needs a new positive closed month after three confirmed zero months and previously recorded activity. No company is declared permanently lost, and no cause of changes is inferred.</p></section>`;
 const totals=`<div class="installer-kpis">${kpi('High priority',n(data.priorities.High),'Evidence-backed outreach candidates')}${kpi('Declining',n(data.counts.declining),'Significant equal-period decline')}${kpi('Inactive',n(data.counts.inactive),'Three confirmed zero months')}${kpi('Coverage checks',n(data.priorities['Data check']),'No commercial inference without evidence')}</div>`;
 const priorityFilter=`<label class="field">Priority<select id="installer-insight-priority">${['All','High','Medium','Low','Data check'].map(x=>selectOption(x,x,currentPriority)).join('')}</select></label>`;
 const typeFilter=`<label class="field">Activity signal<select id="installer-insight-type">${selectOption('All','All signals',currentType)}${typeNames.map(([id,label])=>selectOption(id,label+' ('+(data.counts[id]??0)+')',currentType)).join('')}</select></label>`;
 const search=`<label class="field">Search installer<input id="installer-insight-search" type="search" placeholder="Search consolidated account" value="${e(ui.installerInsightSearch??'')}"></label>`;
 const rows=shown.map(row=>`<tr><th><button class="quiet" data-installer-fullprofile="${e(row.id)}">${e(row.name)}</button></th><td><span class="insight-priority ${row.priority==='High'?'insight-high':''}">${e(row.priority)}</span></td><td>${e(row.label)}</td><td class="num">${n(row.current.value)}</td><td class="num">${n(row.previous.value)}</td><td class="num">${row.growthPct===null?'—':pct(row.growthPct)}</td><td class="wrap">${e(row.evidence)}</td><td class="wrap">${e(row.action)}</td><td class="num">${n(row.score)}</td></tr>`).join('');
 const table=panel('Account priorities ('+selected.length+' shown from '+data.total+')',
 `<div class="form-row">${priorityFilter}${typeFilter}${search}</div><div class="table-wrap"><table><thead><tr><th>Installer</th><th>Priority</th><th>Evidence-based signal</th><th class="num">Current</th><th class="num">Previous</th><th class="num">Growth</th><th>Recorded evidence</th><th>Suggested next action</th><th class="num">Score</th></tr></thead><tbody>${rows||'<tr><td colspan="9">No accounts match these filters.</td></tr>'}</tbody></table></div><div class="panel-actions insight-pagination"><button data-installer-insight-page="${page-1}" ${page===0?'disabled':''}>Previous</button><span>Page ${page+1} / ${maxPage+1}</span><button data-installer-insight-page="${page+1}" ${page===maxPage?'disabled':''}>Next</button></div>`);
 const policy=panel('How prioritisation works',`<p class="table-note">Rule score = signal weight (inactive/reactivated 45; decline 35; growth 25; first/zero-baseline 20; stable/no activity 10) + volume band (0/10/20) + change band (0/10/20), capped at 100. For inactive/reactivated accounts, recent historical activity contributes to the volume band. High = 60+, Medium = 30–59, Low = below 30. Accounts needing verification have no commercial score and appear as Data check.</p><p class="table-note">All tracked installer accounts are evaluated, including those excluded from an optional comparable-cohort view. Full-month coverage is an explicit declaration made during import. Numbers represent Huawei inverter activations tracked in this file, not Irish market share, inverter model installation, revenue or the cause of changes. Suggested actions are review prompts, not predictions.</p>`);
 return `<div class="installer-insight-header"><h2>Account insights & priorities</h2><p>Rules derived from verified reporting coverage and tracked activations. Every suggestion includes its evidence.</p></div>`+totals+filters+table+policy;
}
