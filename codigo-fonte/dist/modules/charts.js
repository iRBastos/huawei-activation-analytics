import {escapeHtml as e} from './exports.js';
export const COLORS={'Inverter':'#ca1827','Battery module':'#176b78','BMS':'#827344','S0':'#697e8d','S1':'#b2182b','LUNA2000-5-E0':'#657d8c','LUNA2000-5-E1':'#c01835','LUNA2000-7-E1':'#e88738','LUNA2000-5KW-C0':'#8a76a1','LUNA2000-10KW-C1':'#226c8d'};
const palette=['#136e7b','#724685','#ad5727','#296046','#346faf','#9e2455','#766315','#46596d'];
export function color(name){return COLORS[name]??palette[[...name].reduce((n,c)=>n+c.charCodeAt(0),0)%palette.length];}
const fmt=v=>Math.abs(v)>=1000000?(v/1000000).toFixed(1)+'m':Math.abs(v)>=1000?(v/1000).toFixed(1)+'k':Number.isInteger(v)?String(v):v.toFixed(1);
// Trend-only transformation: the underlying activation totals and coverage remain unchanged.
// All series use the SAME first observed period, rather than independently chosen baselines.
export function indexedSeries(series) {
  if(!series.length)return {series:[],baseLabel:null,provisional:false};
  const first=series[0].points??[];
  const baselineIndex=first.findIndex((p,i)=>series.every(s=>{
    const candidate=s.points?.[i];
    return candidate?.label===p.label && Number.isFinite(candidate.value)&&candidate.value>0;
  }));
  if(baselineIndex<0)return {series:[],baseLabel:null,provisional:false};
  const provisional=series.some(s=>!s.points[baselineIndex].complete);
  return {baseLabel:first[baselineIndex].label,provisional,series:series.map(s=>{
    const baseline=s.points[baselineIndex].value;
    return {...s,points:s.points.map(p=>({...p,rawValue:p.value,
      value:Number.isFinite(p.value)?p.value/baseline*100:null}))};
  })};
}
export function lineChart(series,{unit='activations',title='Activation trend',hidden=new Set(),id='main',scale='auto'}={}){
  const visible=series.filter(s=>!hidden.has(s.name)),points=series[0]?.points??[],n=points.length;
  const vals=visible.flatMap(s=>s.points.map(p=>p.value)).filter(v=>v!==null&&Number.isFinite(v));
  const legend=()=>'<div class="legend">'+series.map(s=>`<button class="legend-item ${hidden.has(s.name)?'muted':''}" data-toggle-series="${e(s.name)}" data-chart="${e(id)}" aria-pressed="${!hidden.has(s.name)}"><i style="background:${s.color??color(s.name)}"></i>${e(s.name)}</button>`).join('')+'</div>';
  if(!n||!vals.length)return '<div class="chart-empty">No visible values for this selection. Adjust the legend or confirm reporting coverage.</div>'+legend();
  const W=1000,H=300,L=64,R=24,T=22,B=48,pw=W-L-R,ph=H-T-B;
  const min=Math.min(...vals),max=Math.max(...vals),spread=max-min;
  const focused=min>0&&(scale==='focus'||scale==='auto'&&spread>0&&spread/Math.max(max,1e-9)<.7);
  const margin=Math.max(spread*.15,Math.abs(max)*.025,.05);
  const bottom=focused?Math.max(0,min-margin):Math.min(0,min);
  const top=focused?max+margin:Math.max(1,max*1.14);
  const range=Math.max(top-bottom,1e-9);
  const x=i=>L+(n===1?pw/2:i/(n-1)*pw),y=v=>T+ph-(v-bottom)/range*ph;
  const showValue=v=>unit==='%'?v.toFixed(1)+'%':fmt(v);
  let svg=`<svg class="line-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${e(title)} in ${e(unit)}"><title>${e(title)} — ${e(unit)}</title>`;
  for(let i=0;i<=4;i++){
    const v=bottom+range*i/4,yy=y(v);
    svg+=`<line x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}" class="gridline"/><text x="${L-12}" y="${yy+4}" text-anchor="end" class="axis">${showValue(v)}</text>`;
  }
  const step=Math.max(1,Math.ceil(n/10));
  points.forEach((p,i)=>{if(i%step===0||i===n-1)svg+=`<text x="${x(i)}" y="${H-15}" text-anchor="middle" class="axis">${e(p.label)}</text>`;});
  let provisionalCount=0;
  for(const s of visible){
    const c=s.color??color(s.name),sp=s.points;
    for(let i=1;i<sp.length;i++){
      const from=sp[i-1],to=sp[i];
      if(!Number.isFinite(from.value)||!Number.isFinite(to.value))continue;
      const partial=!from.complete||!to.complete;
      if(partial)provisionalCount++;
      svg+=`<line x1="${x(i-1)}" y1="${y(from.value)}" x2="${x(i)}" y2="${y(to.value)}" stroke="${c}" stroke-width="2.7" stroke-linecap="round" ${partial?'stroke-dasharray="7 5"':''}/>`;
    }
    sp.forEach((p,i)=>{
      if(!Number.isFinite(p.value))return;
      const raw=Number.isFinite(p.rawValue)?` · actual ${fmt(p.rawValue)} activations`:'';
      const description=`${s.name} ${p.label}: ${showValue(p.value)}${unit==='%'?'':' '+unit}${raw} · ${p.status??'Complete'}`;
      svg+=`<g tabindex="0" role="button" aria-label="${e(description)}" data-month="${e(p.start??p.label)}" data-end="${e(p.end??p.start??p.label)}" data-model="${e(s.model??'All')}"><title>${e(description)}</title><circle cx="${x(i)}" cy="${y(p.value)}" r="12" fill="transparent"/><circle cx="${x(i)}" cy="${y(p.value)}" r="4" fill="${p.complete?c:'white'}" stroke="${c}" stroke-width="2"/></g>`;
    });
  }
  svg+='</svg>'+legend();
  const note=provisionalCount?'Dashed lines and hollow markers indicate provisional observations; gaps are not connected.':'Solid lines indicate complete periods.';
  const zoom=focused?' Focused y-axis: it does not start at zero. Use actual values for volume comparisons.':'';
  return svg+`<p class="chart-note">${e(note+zoom)} Select a point for recorded evidence.</p>`;
}
export function barChart(rows,{unit='activations',signed=false,empty='No complete comparison available.'}={}){
  const valid=rows.filter(r=>r.value!==null&&Number.isFinite(r.value));if(!valid.length)return `<div class="chart-empty">${e(empty)}</div>`;
  const max=Math.max(1,...valid.map(r=>Math.abs(r.value)));
  return `<div class="bars" aria-label="${e(unit)}">${valid.map(r=>`<button class="bar-row" data-model-detail="${e(r.model??r.label)}"><span class="bar-label">${e(r.label)}</span><span class="bar-track ${signed?'signed':''}"><i style="${signed?(r.value<0?'right:50%;':'left:50%;'):''}width:${Math.abs(r.value)/max*(signed?48:100)}%;background:${r.color??(signed?(r.value<0?'#9f4e3c':'#286c56'):color(r.label))}"></i></span><strong>${r.value>0&&signed?'+':''}${r.value.toLocaleString('en-IE',{maximumFractionDigits:1})}</strong></button>`).join('')}</div>`;
}
export function stackedMix(items,unit='activations'){
  const valid=items.filter(x=>x.value!==null&&x.value>=0),total=valid.reduce((a,r)=>a+r.value,0);
  if(!total)return '<div class="chart-empty compact">No positive recorded volume in this selection.</div>';
  return `<div class="stack" role="img" aria-label="Product mix in ${e(unit)}">${valid.map(r=>`<button data-model-detail="${e(r.model??r.label)}" style="width:${r.value/total*100}%;background:${color(r.label)}" title="${e(r.label)}: ${r.value.toLocaleString('en-IE')} ${e(unit)} (${(r.value/total*100).toFixed(1)}%)"><span class="sr-only">${e(r.label)} ${(r.value/total*100).toFixed(1)}%</span></button>`).join('')}</div><div class="mix-key">${valid.map(r=>`<button data-model-detail="${e(r.model??r.label)}"><i style="background:${color(r.label)}"></i><span>${e(r.label)}</span><strong>${(r.value/total*100).toFixed(1)}%</strong></button>`).join('')}</div>`;
}
