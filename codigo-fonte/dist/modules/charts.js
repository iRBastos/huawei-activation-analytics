import {escapeHtml as e} from './exports.js';
export const COLORS={'Inverter':'#ca1827','Battery module':'#176b78','BMS':'#827344','S0':'#697e8d','S1':'#b2182b','LUNA2000-5-E0':'#657d8c','LUNA2000-5-E1':'#c01835','LUNA2000-7-E1':'#e88738','LUNA2000-5KW-C0':'#8a76a1','LUNA2000-10KW-C1':'#226c8d'};
const palette=['#136e7b','#724685','#ad5727','#296046','#346faf','#9e2455','#766315','#46596d'];
export function color(name){return COLORS[name]??palette[[...name].reduce((n,c)=>n+c.charCodeAt(0),0)%palette.length];}
const fmt=v=>Math.abs(v)>=1000000?(v/1000000).toFixed(1)+'m':Math.abs(v)>=1000?(v/1000).toFixed(1)+'k':Number.isInteger(v)?String(v):v.toFixed(1);
export function lineChart(series,{unit='activations',title='Activation trend',hidden=new Set(),id='main'}={}){
  const visible=series.filter(s=>!hidden.has(s.name)),points=series[0]?.points??[],n=points.length;
  const vals=visible.flatMap(s=>s.points.map(p=>p.value)).filter(v=>v!==null&&Number.isFinite(v));
  if(!n||!vals.length)return '<div class="chart-empty">No visible values for this selection.<br><span>Toggle a series below, or import data and confirm coverage.</span></div><div class="legend">'+series.map(s=>`<button class="legend-item ${hidden.has(s.name)?'muted':''}" data-toggle-series="${e(s.name)}" data-chart="${e(id)}" aria-pressed="${!hidden.has(s.name)}"><i style="background:${s.color??color(s.name)}"></i>${e(s.name)}</button>`).join('')+'</div>';
  const W=1000,H=300,L=64,R=24,T=22,B=48,max=Math.max(1,...vals)*1.14,pw=W-L-R,ph=H-T-B;
  const x=i=>L+(n===1?pw/2:i/(n-1)*pw),y=v=>T+ph-v/max*ph;
  let svg=`<svg class="line-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${e(title)} in ${e(unit)}"><title>${e(title)} — ${e(unit)}</title>`;
  for(let i=0;i<=4;i++){const v=max*i/4,yy=y(v);svg+=`<line x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}" class="gridline"/><text x="${L-12}" y="${yy+4}" text-anchor="end" class="axis">${fmt(v)}</text>`;}
  const step=Math.max(1,Math.ceil(n/10));points.forEach((p,i)=>{if(i%step===0||i===n-1)svg+=`<text x="${x(i)}" y="${H-15}" text-anchor="middle" class="axis">${e(p.label)}</text>`;});
  for(const s of visible){let run=[];const c=s.color??color(s.name),flush=()=>{if(run.length>1)svg+=`<polyline points="${run.join(' ')}" fill="none" stroke="${c}" stroke-width="2.6"/>`;run=[];};
    s.points.forEach((p,i)=>{if(p.value===null||!p.complete){flush();}else run.push(`${x(i)},${y(p.value)}`);});flush();
    s.points.forEach((p,i)=>{if(p.value===null)return;svg+=`<g tabindex="0" role="button" aria-label="${e(s.name)} ${e(p.label)}: ${e(p.value)} ${e(unit)}, ${e(p.status??'Complete')}" data-month="${e(p.start??p.label)}" data-end="${e(p.end??p.start??p.label)}" data-model="${e(s.model??'All')}"><title>${e(s.name)} · ${e(p.label)}: ${e(p.value)} ${e(unit)} · ${e(p.status??'Complete')}</title><circle cx="${x(i)}" cy="${y(p.value)}" r="12" fill="transparent"/><circle cx="${x(i)}" cy="${y(p.value)}" r="4" fill="${p.complete?c:'white'}" stroke="${c}" stroke-width="2"/></g>`;});
  }
  svg+='</svg><div class="legend">';
  for(const s of series)svg+=`<button class="legend-item ${hidden.has(s.name)?'muted':''}" data-toggle-series="${e(s.name)}" data-chart="${e(id)}" aria-pressed="${!hidden.has(s.name)}"><i style="background:${s.color??color(s.name)}"></i>${e(s.name)}</button>`;
  return svg+'</div><p class="chart-note">Hollow points are partial observations. Lines connect complete periods only. Select a point for evidence.</p>';
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
