// Reproducible, deterministic fictional data for executive presentation. Never use as actual Huawei records.
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const build = function build(){
const months=[];for(let y=2023;y<=2026;y++)for(let mm=1;mm<=12;mm++){const m=`${y}-${String(mm).padStart(2,"0")}`;if(m<="2026-10")months.push(m)}
const complete=months.filter(x=>x<="2026-09"),oct="2026-10";
const inverters=["SUN2000-5KTL-L1","SUN2000-3KTL-L1","SUN2000-4.6KTL-L1","SUN2000-6KTL-M1","SUN2000-8KTL-M1","SUN2000-5K-LB0","SUN2000-4.6K-LB0","SUN2000-12K-MB0","SUN2000-25K-MB0","SUN2000-5K-MAP0"];
const battery=["LUNA2000-5-E0","LUNA2000-5-E1","LUNA2000-7-E1","LUNA2000-5KW-C0","LUNA2000-10KW-C1"];
const installers=["DEMO Harbourlight Solar Ltd","DEMO Silverfern Energy Ltd","DEMO Cedarfield Renewables","DEMO Liffey Meadow Solar Ltd","DEMO Liffey Meadow Solar Limited","DEMO Northstar PV Ltd","DEMO Northstar PV Limited","DEMO Blue Harbour Energy","DEMO Pinecrest Solar Services","DEMO Beaconroof Renewables","DEMO Elmbridge PV","DEMO Ashgrove Solar Ltd","DEMO Golden Coast Solar","DEMO Meadowbank Energy","DEMO Horizon Glen PV","DEMO Clearwater Solar Works","DEMO Orchard Grid Ltd","DEMO Copperleaf Renewables","DEMO Willow Peak Solar","DEMO Granite Solar Solutions","DEMO Westwind PV","DEMO Tideway Renewable Systems","DEMO Moonrise Solar Ltd","DEMO Stonebridge Solar Team","DEMO Faraday Green Installations"];
const a=(total,w)=>{let s=w.reduce((x,y)=>x+Math.max(0,y),0),raw=w.map(x=>total*Math.max(0,x)/s),vals=raw.map(Math.floor),remaining=total-vals.reduce((x,y)=>x+y,0),ids=raw.map((x,i)=>({i,frac:x-Math.floor(x)})).sort((p,q)=>q.frac-p.frac||p.i-q.i);for(let i=0;i<remaining;i++)vals[ids[i].i]++;return vals};
const inv=Object.fromEntries(inverters.map(m=>[m,{}])),bat=Object.fromEntries(battery.map(m=>[m,{}])),inst=Object.fromEntries(installers.map(n=>[n,{}])),monthly=[];
const forced={"DEMO Harbourlight Solar Ltd":{39:14,40:13,41:13,42:8,43:7,44:8},"DEMO Silverfern Energy Ltd":{39:27,40:29,41:28,42:58,43:60,44:63},"DEMO Cedarfield Renewables":{39:61,40:63,41:64,42:19,43:18,44:20},"DEMO Blue Harbour Energy":{41:0,42:0,43:0,44:19},"DEMO Copperleaf Renewables":{41:0,42:0,43:0,44:0}};
for(let k=0;k<months.length;k++){
 const month=months[k],total=Math.round(386+7.65*k+28*Math.sin((k+1)*Math.PI/6)+12*Math.cos(k*.51));
 const w=[Math.max(.065,.32-.0058*k),Math.max(.035,.16-.0027*k),Math.max(.042,.17-.0031*k),.115,.082,k<24?0:.012+(k-23)*.011,k<27?0:.008+(k-26)*.005,k<12?0:.04+(k-11)*.0011,k<17?0:.013+(k-16)*.0009,k<37?0:.010+(k-36)*.008];
 a(total,w).forEach((v,j)=>inv[inverters[j]][month]=v);
 const bms=Math.round(total*(.245+.0123*k+.006*Math.sin(k*.45))),s0=k<17?bms:Math.round(bms*Math.max(.26,1-(k-16)*.033)),s1=bms-s0;
 const modS0=Math.round(s0*(1.70+.005*k)),modS1=Math.round(s1*(1.85+.012*k)),e7=Math.round(modS1*Math.max(.12,Math.min(.48,.14+.009*(k-17))));
 [modS0,modS1-e7,e7,s0,s1].forEach((v,j)=>bat[battery[j]][month]=v);
 const selected=installers.map(n=>forced[n]?.[k]??null),fixed=selected.reduce((s,v)=>s+(v??0),0),free=installers.map((n,i)=>i).filter(i=>selected[i]===null),freeWeight=free.map(i=>{let v=1.2+i%6*.24+.19*Math.sin(k*.27+i*.71);if(i===0)v=.7;if(i===1)v=1.65;if(i===2)v=2.1;if([3,4,5,6].includes(i))v=.8;if(i===7)v=.85;if(i===17)v=.9;return Math.max(.15,v)});
 a(total-fixed,freeWeight).forEach((v,j)=>selected[free[j]]=v);
 if(selected.reduce((s,v)=>s+v,0)!==total)throw Error("Installer mismatch at "+month);
 installers.forEach((n,i)=>inst[n][month]=selected[i]);
 monthly.push({month,inverters:total,bms,batteryModules:modS0+modS1,bmsPer100:Number((bms/total*100).toFixed(2)),periodStatus:month<="2026-09"?"closed":"open"});
}
const csv=rows=>rows.map(row=>row.map(v=>String(v??"").includes(",")||String(v??"").includes('"')?`"${String(v).replaceAll('"','""')}"`:String(v??"")).join(",")).join("\n")+"\n";
const prod=(data,m)=>[["Model",...m.map(x=>x.replace("-",""))],...Object.entries(data).map(([key,v])=>[key,...m.map(x=>v[x])]),["Grand Total",...m.map(x=>Object.values(data).reduce((s,v)=>s+v[x],0))]];
const installerRows=(m,selected=installers)=>{const rows=[["Installer",...m.map(x=>x.replace("-","")),"Total"]];for(const label of selected){let v=m.map(x=>inst[label][x]);if(label==="DEMO Liffey Meadow Solar Ltd"&&m.length>1){let left=v.map(x=>Math.round(x*.68)),right=v.map((x,i)=>x-left[i]);rows.push([label,...left,left.reduce((a,b)=>a+b,0)],[label,...right,right.reduce((a,b)=>a+b,0)])}else rows.push([label,...v,v.reduce((a,b)=>a+b,0)])}rows.push(["Total",...m.map(x=>selected.reduce((s,n)=>s+inst[n][x],0)),selected.reduce((s,n)=>s+m.reduce((z,x)=>z+inst[n][x],0),0)]);return rows};
const octInv=Object.fromEntries(inverters.filter((_,i)=>[0,3,5,7,9].includes(i)).map(x=>[x,{[oct]:Math.round(inv[x][oct]*.32)}]));
const octBat=Object.fromEntries(battery.filter((_,i)=>[0,1,3,4].includes(i)).map(x=>[x,{[oct]:Math.round(bat[x][oct]*.31)}]));
const selectedOct=installers.filter((_,i)=>[0,1,3,5,7,9,13,19].includes(i));
const files={
"DEMO_EQUIPMENT_INVERTERS_2023-01_to_2026-09.csv":csv(prod(inv,complete)),
"DEMO_EQUIPMENT_BATTERY_BMS_2023-01_to_2026-09.csv":csv(prod(bat,complete)),
"DEMO_INSTALLERS_2023-01_to_2026-09.csv":csv(installerRows(complete)),
"DEMO_EQUIPMENT_INVERTERS_2026-10_PARTIAL.csv":csv(prod(octInv,[oct])),
"DEMO_EQUIPMENT_BATTERY_BMS_2026-10_PARTIAL.csv":csv(prod(octBat,[oct])),
"DEMO_INSTALLERS_2026-10_PARTIAL.csv":csv(installerRows([oct],selectedOct))
};
const years=[2023,2024,2025,2026].map(year=>{let z=monthly.filter(x=>x.month.startsWith(year+"-")&&x.periodStatus==="closed"),sum=(field)=>z.reduce((s,r)=>s+r[field],0),i=sum("inverters"),b=sum("bms");return {year,closedMonths:z.length,inverters:i,bms:b,bmsPer100:Number((b/i*100).toFixed(1))}});
const q2=["2026-04","2026-05","2026-06"],q3=["2026-07","2026-08","2026-09"],harbour="DEMO Harbourlight Solar Ltd";
const prev=q2.reduce((s,m)=>s+inst[harbour][m],0),current=q3.reduce((s,m)=>s+inst[harbour][m],0);
const summary={synthetic:true,closedRange:"2023-01..2026-09",partialMonth:oct,closedMonths:complete.length,inverterModels:inverters.length,batteryAndBmsModels:battery.length,installerSourceNames:installers.length,installerRowsIncludingRepeatedName:installers.length+1,octPartialInstallerNames:selectedOct.length,years,caseStudy:{installer:harbour,previousQ2:prev,currentQ3:current,delta:current-prev,percent:Number(((current-prev)/prev*100).toFixed(1))},notProofOfRealSalesOrMarketShare:true};
files["DEMO_METRICS.json"]=JSON.stringify({summary,monthly},null,2)+"\n";
const targets=[["Month","Scope","Illustrative target","How to use"]];
for(const month of ["2026-07","2026-08","2026-09"])for(const [cat,col] of [["Inverter","inverters"],["BMS","bms"],["Battery module","batteryModules"]]){let row=monthly.find(r=>r.month===month);targets.push([month,cat,Math.ceil(row[col]*1.06/10)*10,"Enter manually in Targets; not bulk-importable"])}
files["DEMO_TARGETS_REFERENCE.csv"]=csv(targets);
return {files,summary};
};
const root = resolve(process.argv[2] || '.');
mkdirSync(root,{recursive:true});
const {files,summary}=build();
for(const [name,content] of Object.entries(files))writeFileSync(resolve(root,name),content,'utf8');
console.log(JSON.stringify(summary,null,2));
