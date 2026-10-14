import {closedMonth,shiftMonth} from './model.js';
import {installerAnalysis,installerMeasure} from './installer-analytics.js';

// Rule-based signals only: no predicted revenue, inferred cause or market share.
export const INSIGHT_MIN_VOLUMES=[1,5,10,25];
export const INSIGHT_CHANGE_THRESHOLDS=[10,20,30,50];
const lastThree=end=>[shiftMonth(end,-2),shiftMonth(end,-1),end];
const priorThree=end=>[shiftMonth(end,-3),shiftMonth(end,-2),shiftMonth(end,-1)];
const measureMonths=(account,months,now)=>months.map(month=>({month,...installerMeasure([account],month,month,now)}));
const allZero=points=>points.length===3&&points.every(p=>p.complete&&p.value===0);
const hasPriorPositive=(account,before)=>Object.entries(account.cells).some(([month,cell])=>month<before&&cell.value>0);
const TYPES={
 reactivated:{label:'Reactivated',weight:45,action:'Reconnect with the installer to understand the new activity and discuss upcoming work.'},
 inactive:{label:'Inactive — 3 confirmed zero months',weight:45,action:'Contact the installer to understand the inactivity and whether support is needed.'},
 declining:{label:'Declining activations',weight:35,action:'Arrange an account review to understand the decline and offer relevant support.'},
 growing:{label:'Growing activations',weight:25,action:'Discuss installer capacity and upcoming plans; explore how to support further activity.'},
 first:{label:'First recorded activity after confirmed zeros',weight:20,action:'Welcome the recorded activity and discuss future opportunities.'},
 zeroBase:{label:'Activity after zero comparison baseline',weight:20,action:'Review the activity with the installer; percentage growth is unavailable from a zero baseline.'},
 steady:{label:'No significant movement',weight:10,action:'Monitor the account at the next reporting cycle.'},
 zero:{label:'No recorded activity in selected periods',weight:10,action:'Keep the account on the watchlist; no selected-period activations are evidenced.'},
 coverage:{label:'Verify reporting coverage',weight:null,action:'Confirm missing or open reporting months before interpreting the trend.'}
};
const priority=score=>score===null?'Data check':score>=60?'High':score>=30?'Medium':'Low';
function classify(account,row,report,f,now,minVolume,thresholdPct){
 const last=f.end,closed=last<=closedMonth(now);
 const recent=measureMonths(account,lastThree(last),now);
 const previous3=measureMonths(account,priorThree(last),now);
 const latest=recent.at(-1);
 const priorPositive=hasPriorPositive(account,shiftMonth(last,-2));
 const earlierPositive=hasPriorPositive(account,shiftMonth(last,-3));
 const inactive=closed&&allZero(recent)&&priorPositive;
 const precedingZeros=closed&&allZero(previous3);
 const reactivated=precedingZeros&&latest.complete&&latest.value>0&&earlierPositive;
 const first=precedingZeros&&latest.complete&&latest.value>0&&!earlierPositive;
 const usable=report.equalDuration&&row.current.complete&&row.previous.complete;
 const base=row.previous.value,units=row.delta,relative=row.pct;
 const substantial=usable&&base>=minVolume&&Math.abs(units)>=minVolume&&Math.abs(relative)>=thresholdPct;
 let type='coverage';
 if(reactivated)type='reactivated';
 else if(inactive)type='inactive';
 else if(first)type='first';
 else if(substantial&&units<0)type='declining';
 else if(substantial&&units>0)type='growing';
 else if(usable&&base===0&&row.current.value>0)type='zeroBase';
 else if(usable&&row.current.value===0&&base===0)type='zero';
 else if(usable)type='steady';
 const rule=TYPES[type],recentHistory=Object.entries(account.cells)
   .filter(([month])=>month<=last&&month>=shiftMonth(last,-12))
   .reduce((sum,[,cell])=>sum+cell.value,0);
 const scale=type==='inactive'||type==='reactivated'
   ?Math.max(row.current.value??0,base??0,recentHistory)
   :Math.max(row.current.value??0,base??0);
 const magnitude=Math.abs(units??0);
 const score=rule.weight===null?null:Math.min(100,rule.weight+
   (scale>=minVolume*4?20:scale>=minVolume?10:0)+
   (magnitude>=minVolume*4?20:magnitude>=minVolume?10:0));
 let evidence;
 if(type==='reactivated'||type==='first')
   evidence='Previous 3 months '+previous3[0].month+'–'+previous3[2].month+': confirmed zero; '+last+': '+latest.value+' activations.';
 else if(type==='inactive')
   evidence=recent[0].month+'–'+last+': 3 consecutive fully reported zero months; earlier positive activation recorded.';
 else if(type==='coverage')
   evidence='Current: '+row.current.status+'; comparison: '+row.previous.status+'; equal length: '+(report.equalDuration?'yes':'no')+'.';
 else
   evidence='Selected: '+row.current.value+' ('+row.current.status+'); previous: '+base+' ('+row.previous.status+'); difference: '+(units??'unavailable')+' activations.';
 return {id:row.id,name:row.name,type,label:rule.label,action:rule.action,priority:priority(score),score,
  evidence,current:row.current,previous:row.previous,delta:row.delta,growthPct:row.pct,
  lastActive:row.lastActive,currentMonth:latest,recent,previous3,minVolume,thresholdPct,
  completeComparison:usable,periodStart:f.start,periodEnd:f.end};
}
/** Compute an account's signal from a precomputed profile; no second portfolio scan. */
export function installerAccountSignal(profile,f,{now=profile?.report.now,minVolume=f.insightMinVolume??5,thresholdPct=f.insightThresholdPct??20}={}){
 if(!profile)return null;
 if(!INSIGHT_MIN_VOLUMES.includes(minVolume)||!INSIGHT_CHANGE_THRESHOLDS.includes(thresholdPct))
   throw new Error('Unsupported installer insight thresholds.');
 const row=profile.row??{id:profile.id,name:profile.account.name,current:profile.current,
  previous:profile.previous,delta:profile.change.delta,pct:profile.change.pct,lastActive:null};
 return classify(profile.account,row,profile.report,f,now,minVolume,thresholdPct);
}
/** Always score all tracked accounts, even if UI uses a comparable subset. */
export function installerInsights(state,f,{now=new Date(),report=null,minVolume=f.insightMinVolume??5,thresholdPct=f.insightThresholdPct??20}={}){
 if(!INSIGHT_MIN_VOLUMES.includes(minVolume)||!INSIGHT_CHANGE_THRESHOLDS.includes(thresholdPct))
   throw new Error('Unsupported installer insight thresholds.');
 const analysis=report??installerAnalysis(state,f,{now,cohort:'all'});
 const actual=analysis.cohort==='all'?analysis:installerAnalysis(state,f,{now,cohort:'all'});
 const byId=new Map(actual.allAccounts.map(a=>[a.id,a]));
 const rows=actual.rows.map(r=>classify(byId.get(r.id),r,actual,f,now,minVolume,thresholdPct));
 const weights={High:3,Medium:2,Low:1,'Data check':0};
 rows.sort((a,b)=>(weights[b.priority]-weights[a.priority])||
   (b.score??0)-(a.score??0)||
   Math.max(b.current.value??0,b.previous.value??0)-Math.max(a.current.value??0,a.previous.value??0)||
   a.name.localeCompare(b.name,'en-IE'));
 const counts=Object.fromEntries(Object.keys(TYPES).map(type=>[type,rows.filter(r=>r.type===type).length]));
 const priorities=Object.fromEntries(['High','Medium','Low','Data check'].map(p=>[p,rows.filter(r=>r.priority===p).length]));
 return {rows,counts,priorities,total:rows.length,minVolume,thresholdPct,
   periodStart:f.start,periodEnd:f.end,comparison:actual.comparison,now};
}
/** CSV and UI consume exactly the same computed rows and evidence. */
export function installerInsightsCsv(result){
 return [['Installer','Signal','Priority','Rule score','Current activations','Current status',
  'Previous activations','Previous status','Difference','Growth %','Last recorded active month',
  'Evidence','Suggested next action','Minimum volume','Minimum change %'],
  ...result.rows.map(r=>[r.name,r.label,r.priority,r.score,r.current.value,r.current.status,
   r.previous.value,r.previous.status,r.delta,r.growthPct,r.lastActive,r.evidence,r.action,
   result.minVolume,result.thresholdPct])];
}
