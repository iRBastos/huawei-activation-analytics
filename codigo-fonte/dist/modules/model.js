// Catalogue, canonical keys, calendar utilities and record scope.

export const CATEGORIES = ['Inverter', 'Battery module', 'BMS'];
export const INITIAL_CATALOG = {
  'LUNA2000-5-E0': {model:'LUNA2000-5-E0',category:'Battery module',family:'S0',capacity:5,bms:'LUNA2000-5KW-C0',from:null,to:null},
  'LUNA2000-5-E1': {model:'LUNA2000-5-E1',category:'Battery module',family:'S1',capacity:5,bms:'LUNA2000-10KW-C1',from:null,to:null},
  'LUNA2000-7-E1': {model:'LUNA2000-7-E1',category:'Battery module',family:'S1',capacity:7,bms:'LUNA2000-10KW-C1',from:null,to:null},
  'LUNA2000-5KW-C0': {model:'LUNA2000-5KW-C0',category:'BMS',family:'S0',capacity:null,bms:null,from:null,to:null},
  'LUNA2000-10KW-C1': {model:'LUNA2000-10KW-C1',category:'BMS',family:'S1',capacity:null,bms:null,from:null,to:null}
};
export const clone = x => structuredClone(x);
export const canonical = x => String(x ?? '').trim().toUpperCase();
export const keyOf = (month,model) => `${month}|${canonical(model)}`;
export const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export function monthValue(value) {
  const s=String(value??'').trim();
  const m=/^(\d{4})-?(\d{2})$/.exec(s);
  return m && +m[1]>=1900 && +m[1]<=9999 && +m[2]>=1 && +m[2]<=12 ? `${m[1]}-${m[2]}` : null;
}
export function shiftMonth(m,n) {
  if(!monthValue(m)) throw new Error('Invalid calendar month.');
  const [y,k]=m.split('-').map(Number), d=new Date(Date.UTC(y,k-1+n,1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`;
}
export function monthsBetween(start,end) {
  if(!monthValue(start)||!monthValue(end)||start>end) return [];
  const n=(+end.slice(0,4)-+start.slice(0,4))*12+(+end.slice(5)-+start.slice(5))+1;
  if(n>1200) throw new Error('Select at most 100 years per report.');
  return Array.from({length:n},(_,i)=>shiftMonth(start,i));
}
export function currentDublinMonth(now=new Date()) {
  const parts=new Intl.DateTimeFormat('en-IE',{timeZone:'Europe/Dublin',year:'numeric',month:'2-digit'}).formatToParts(now);
  return `${parts.find(p=>p.type==='year').value}-${parts.find(p=>p.type==='month').value}`;
}
export const closedMonth=(now=new Date())=>shiftMonth(currentDublinMonth(now),-1);
export const applicable=(p,m)=>(!p.from||m>=p.from)&&(!p.to||m<=p.to);
export const totalLabel=x=>/^(total|grand\s*total|sum|总计|合计)$/i.test(String(x??'').replace(/[=＊*：:]/g,'').trim());
export const isBlank=x=>x===null||x===undefined||typeof x==='string'&&x.trim()==='';
export const cellValue=c=>c && typeof c==='object' && ('v' in c || 'type' in c || 'f' in c) ? c.v : c;
export function columnName(i) {let s=''; for(i++;i;i=Math.floor((i-1)/26))s=String.fromCharCode(65+(i-1)%26)+s;return s;}
export function freshState() {
  const end=closedMonth();
  return {schemaVersion:1,records:{},catalog:clone(INITIAL_CATALOG),coverage:{},targets:{},events:[],history:[],catalogLog:[],coverageLog:[],preferences:{start:shiftMonth(end,-5),end,aggregation:'month',category:'All',model:'All',family:'All',comparison:'year',compareStart:shiftMonth(end,-17),compareEnd:shiftMonth(end,-12)},updatedAt:null};
}
export function suggestHeader(rows) {
  let index=0,score=0,ties=0;
  rows.slice(0,40).forEach((r,i)=>{const n=r.slice(1).filter(c=>monthValue(cellValue(c))).length;if(n>score){score=n;index=i;ties=1;}else if(n&&n===score)ties++;});
  return {index,score,uncertain:!score||ties>1};
}
export function selectModels(state,{category='All',model='All',family='All'}={}) {return Object.values(state.catalog).filter(p=>(category==='All'||p.category===category)&&(model==='All'||p.model===model)&&(family==='All'||p.family===family));}
