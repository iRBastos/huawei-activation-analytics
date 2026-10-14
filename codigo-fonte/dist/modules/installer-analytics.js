import {monthsBetween,shiftMonth,closedMonth} from './model.js';
import {installerEffectiveRecord,installerImportOrder} from './installers.js';
import {comparisonPeriod,aggregationKey,difference} from './calculations.js';

// Build once per render. Source aliases retain independent coverage after a union.
export function installerIndex(state){
  const coverage=state.installers.coverage??{};
  const grouped=new Map(Object.values(state.installers.accounts).map(a=>[a.id,{...a,coverage,sourceCount:0,aliases:[],cells:{}}]));
  const order=installerImportOrder(state);
  for(const source of Object.values(state.installers.sources)){
    if(!Object.keys(source.months).length)continue; // An undone import is not a zero-volume account.
    const account=grouped.get(source.accountId);if(!account)continue;
    account.sourceCount++;account.aliases.push(source.label);
    for(const month of Object.keys(source.months)){
      const r=installerEffectiveRecord(state,source,month,order);
      if(!r)continue;
      const cell=account.cells[month]??{value:0,observed:0};cell.value+=r.quantity;cell.observed++;
      if(!Number.isSafeInteger(cell.value))throw new Error('Installer monthly total exceeds the safe numeric limit.');
      account.cells[month]=cell;
    }
  }
  return [...grouped.values()].filter(a=>a.sourceCount>0);
}
export function installerMeasure(accounts,start,end,now=new Date()){
  const months=monthsBetween(start,end);let value=0,observed=0,expected=0,fullScopeMonths=0;
  for(const a of accounts)for(const month of months){
    const cell=a.cells[month],full=a.coverage?.[month]?.mode==='full';
    if(full){
      // One verified account-month, even when a company changes source labels
      // or was absent in an explicitly confirmed full-population snapshot.
      expected++;observed++;fullScopeMonths++;
      value+=cell?.value??0;
    }else{
      // Older / partial imports remain conservative: each source alias needs
      // its own observation; unknown must never become an inferred zero.
      expected+=a.sourceCount;
      if(cell){observed+=cell.observed;value+=cell.value;}
    }
  }
  if(!Number.isSafeInteger(value))throw new Error('Installer period total exceeds the safe numeric limit.');
  const complete=expected>0&&observed===expected&&end<=closedMonth(now);
  const status=!months.length?'Invalid period':!expected?'No tracked data':end>closedMonth(now)?'Provisional — open/future month':observed!==expected?'Partial — missing source months':'Complete';
  return {value:observed?value:null,complete,status,observed,expected,months:months.length,fullScopeMonths};
}
export function latestInstallerMonth(state,now=new Date()){
  const index=installerIndex(state),months=[...new Set([...Object.keys(state.installers.coverage??{}),...index.flatMap(a=>Object.keys(a.cells))])].sort().reverse();
  return months.find(m=>installerMeasure(index,m,m,now).complete)??null;
}
export function installerAnalysis(state,f,{cohort='all',now=new Date()}={}){
  const all=installerIndex(state),comparison=comparisonPeriod(f),measure=(accounts,s,e)=>installerMeasure(accounts,s,e,now);
  const equalDuration=monthsBetween(f.start,f.end).length===monthsBetween(comparison.start,comparison.end).length;
  const eligible=all.filter(a=>measure([a],f.start,f.end).complete&&measure([a],comparison.start,comparison.end).complete);
  const accounts=cohort==='comparable'?eligible:all;
  const current=measure(accounts,f.start,f.end),previous=measure(accounts,comparison.start,comparison.end);
  const change=(a,b)=>equalDuration?difference(a,b):{delta:null,pct:null,label:'Use equal-length periods'};
  const current3Start=shiftMonth(f.end,-2),prior3Start=shiftMonth(f.end,-5),prior3End=shiftMonth(f.end,-3);
  const rows=accounts.map(a=>{
    const current=measure([a],f.start,f.end),previous=measure([a],comparison.start,comparison.end);
    const recent3=measure([a],current3Start,f.end),prior3=measure([a],prior3Start,prior3End);
    const lastActive=Object.keys(a.cells).filter(m=>m<=f.end&&a.cells[m].value>0).sort().at(-1)??null;
    return {id:a.id,name:a.name,aliases:a.aliases,cells:a.cells,current,previous,...change(current,previous),recent3,prior3,momentum:difference(recent3,prior3),lastActive,share:null,rank:null};
  }).sort((a,b)=>(b.current.value??-1)-(a.current.value??-1)||a.name.localeCompare(b.name));
  rows.forEach((r,i)=>{r.rank=r.current.value===null?null:i&&r.current.value===rows[i-1].current.value?rows[i-1].rank:i+1;r.share=current.complete&&current.value>0?r.current.value/current.value*100:null;});
  const observedActive=rows.filter(r=>r.current.value>0).length,previousActive=rows.filter(r=>r.previous.value>0).length,retained=rows.filter(r=>r.current.value>0&&r.previous.value>0).length;
  const active=current.complete?observedActive:null;
  const retention=current.complete&&previous.complete&&equalDuration&&previousActive>0?retained/previousActive*100:null;
  const top5=current.complete&&current.value>0?rows.slice(0,5).reduce((n,r)=>n+r.current.value,0)/current.value*100:null;
  const hhi=current.complete&&current.value>0?rows.reduce((n,r)=>n+(r.current.value/current.value)**2,0)*10000:null;
  const groups=new Map();for(const m of monthsBetween(f.start,f.end)){const key=aggregationKey(m,f.aggregation??'month');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(m);}
  const trend=[...groups].map(([label,ms])=>({label,start:ms[0],end:ms.at(-1),...measure(accounts,ms[0],ms.at(-1))}));
  const ytdStart=f.end.slice(0,4)+'-01',ytd=measure(accounts,ytdStart,f.end),priorYtd=measure(accounts,shiftMonth(ytdStart,-12),shiftMonth(f.end,-12));
  return {rows,accounts,allCount:all.length,eligibleCount:eligible.length,cohort,comparison,equalDuration,current,previous,change:change(current,previous),active,observedActive,previousActive,retained,retention,top5,hhi,trend,ytd,priorYtd,ytdChange:difference(ytd,priorYtd),current3Start,prior3Start,prior3End};
}
export function sortInstallerRanking(rows,sort='volume'){
  const val=r=>sort==='change'?r.delta:sort==='growth'?r.pct:sort==='momentum'?r.momentum.pct:r.current.value;
  return [...rows].sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):val(a)===null&&val(b)===null?a.name.localeCompare(b.name):val(a)===null?1:val(b)===null?-1:val(b)-val(a)||a.name.localeCompare(b.name));
}
export function installerAnalyticsCsv(analysis,f){
  return [['Installer','From','To','Comparison from','Comparison to','Cohort','Current activations','Current status','Previous activations','Previous status','Change units','Change %','Share %','Rank by reported volume','3M change %','Last active month'],...analysis.rows.map(r=>[r.name,f.start,f.end,analysis.comparison.start,analysis.comparison.end,analysis.cohort,r.current.value,r.current.status,r.previous.value,r.previous.status,r.delta,r.pct,r.share,r.rank,r.momentum.pct,r.lastActive])];
}
