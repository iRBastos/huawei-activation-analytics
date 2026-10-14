import * as IA from './installer-analytics-views.js';
import * as IV from './installer-views.js';
import * as D from './domain.js';
import * as V from './views.js';
import {readWorkbook} from './parser.js';
import {loadState,saveState,storageInfo} from './persistence.js';
import {escapeHtml as e,download,toCsv,exportRows,summaryRows,templateRows} from './exports.js';
import {makeDemo} from './demo.js';

let state=D.freshState();
let realState=null;
const ui={page:V.ROUTES.includes(location.hash.slice(1))?location.hash.slice(1):'overview',dataTab:'import',moreFilters:false,gridPhase:'All',inverterSelectedModels:null,inverterPickerOpen:false,inverterModelSearch:'',phaseChartMode:'indexed',quarter:3,quarterMetric:'inverters',dataset:'unified',pending:null,hiddenSeries:new Set(),trendMetric:'volume',mixBasis:'modules',compareMetric:'Inverter',coverageCategory:'Inverter',recordPage:0,loading:false,saving:false,storageError:null};
const $=s=>document.querySelector(s);
let toastTimer;
function toast(text,error=false){const el=$('#toast');el.textContent=text;el.style.background=error?'#8b352c':'#26343c';el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),error?10000:5500);}
function render(){
  $('#navigation').innerHTML=V.navigation(ui.page);
  $('#breadcrumb').textContent=`Ireland / ${V.NAV[V.ROUTES.indexOf(ui.page)]}`;
  $('#global-filters').innerHTML=ui.page==='installers'?IA.installerAnalyticsFilters(state,ui):V.filters(state,ui);
  const pages={overview:V.overviewView,inverters:V.inverterView,batteries:V.batteriesView,comparisons:V.comparisonsView,targets:V.targetsView,data:V.dataView,installers:IV.installerView};
  const storage=storageInfo();
  const sessionNotice=!ui.demo&&storage.mode==='memory'?'<div class="notice"><p><strong>Session-only workspace.</strong> This browser does not allow this file to save automatically. Import and analyse normally, then download a full backup before closing.</p><button class="small" data-action="backup">Download full backup</button></div>':'';
  $('#main').innerHTML=sessionNotice+(ui.demo?'<div class="notice demo-notice"><p><strong>Fictional demo.</strong> These quantities and findings are illustrative. Your real workspace is unchanged. Imports and exports are disabled in demo mode.</p><button class="small" data-action="exit-demo">Return to real workspace</button></div>':'')+(ui.storageError?`<div class="notice error"><p>${e(ui.storageError)}. Saving is unavailable until local browser storage works.</p></div>`:'')+pages[ui.page](state,ui);
  $('#footer-status').textContent=`${Object.keys(state.records).length.toLocaleString('en-IE')} ${ui.demo?'fictional demo':storage.mode==='memory'?'session':'saved'} equipment records · ${Object.keys(state.installers.accounts).length} installer accounts · Europe/Dublin calendar · ${ui.demo?'Demo changes are not saved':storage.mode==='memory'?'Download a full backup before closing':'Data stays in this browser'}`;
  document.title=`${V.NAV[V.ROUTES.indexOf(ui.page)]} · Huawei Activation Analytics`;
}
async function commit(next,message){
  if(ui.saving)throw new Error('A save is already in progress. Please wait.');ui.saving=true;
  try{if(!ui.demo)await saveState(next);state=next;ui.storageError=null;render();if(message)toast(ui.demo?'Demo only: '+message:message);}finally{ui.saving=false;}
}
function navigate(page,tab){ui.page=page;ui.tableSearch='';ui.recordPage=0;ui.hiddenSeries.clear();if(tab)ui.dataTab=tab;try{history.replaceState(null,'',`#${page}`);}catch{if(location.hash!==`#${page}`)location.hash=page;}render();window.scrollTo({top:0,behavior:'instant'});}
window.addEventListener('hashchange',()=>{const p=location.hash.slice(1);if(V.ROUTES.includes(p))navigate(p);});
function openModal(title,body,action=null,confirmText='Confirm'){
  const modal=$('#modal');ui.dialogAction=action;
  modal.innerHTML=`<div class="dialog-head"><h2 id="modal-title">${e(title)}</h2><button data-close="modal" aria-label="Close dialog">×</button></div>${body}<p class="dialog-error" id="dialog-error" role="alert"></p>${action?`<div class="dialog-actions"><button data-close="modal">Cancel</button><button class="primary" data-action="dialog-confirm">${e(confirmText)}</button></div>`:''}`;
  if(!modal.open)modal.showModal();
}
function detail(start=state.preferences.start,end=state.preferences.end,model=state.preferences.model){const drawer=$('#drawer');drawer.innerHTML=V.detailView(state,{start,end,model});if(!drawer.open)drawer.showModal();}
function validatePending(){if(!ui.pending)return;const p=ui.pending;p.validation=D.validateMatrix({rows:p.rows,filename:p.filename,sheet:p.sheet,headerRow:p.headerRow,dataset:ui.dataset,catalog:{...state.catalog,...p.classifications}});}
async function chooseWorksheet(name){const p=ui.pending;if(!p)return;ui.loading=true;render();try{p.sheet=name;p.rows=await p.workbook.sheet(name);const h=D.suggestHeader(p.rows);p.headerRow=h.index;p.headerUncertain=h.uncertain;validatePending();}finally{ui.loading=false;render();}}
async function importFile(file){if(!file)return;if(ui.demo){toast('Return to your real workspace before importing data.',true);return;}ui.importError=null;ui.loading=true;ui.pending=null;ui.page='data';ui.dataTab='import';render();try{const workbook=await readWorkbook(await file.arrayBuffer(),file.name);ui.pending={filename:file.name,workbook,sheet:workbook.names[0],rows:[],headerRow:0,classifications:{}};await chooseWorksheet(workbook.names[0]);}catch(err){ui.pending=null;ui.importError=err.message;}finally{ui.loading=false;render();}}
function template(dataset){const end=D.closedMonth(),months=D.monthsBetween(D.shiftMonth(end,-5),end);download(toCsv(templateRows(dataset,months)),`${dataset==='unified'?'Unified_Equipment':dataset==='inverters'?'Inverter':'Battery_BMS'}_Import_Template.csv`,'text/csv;charset=utf-8');}
function showProduct(model=null){const p=model?state.catalog[model]:{model:'',category:'Battery module',family:'',capacity:null,bms:null,from:null,to:null};ui.editProduct=model;
  openModal(model?'Edit product definition':'Add product model',`<form data-form="product"><div class="form-row"><label class="field">Exact model code<input name="model" value="${e(p.model)}" ${model?'readonly':''} required></label><label class="field">Category<select name="category">${D.CATEGORIES.map(c=>V.option(c,c,p.category)).join('')}</select></label></div><div class="form-row"><label class="field">Family<input name="family" value="${e(p.family)}" placeholder="Optional"></label><label class="field">Module capacity (kWh)<input name="capacity" type="number" min="0.001" step="any" value="${p.capacity??''}" placeholder="Battery modules only"></label></div><div class="form-row"><label class="field">Inverter rated power (kW)<input name="powerKw" type="number" min="0.001" step="any" value="${p.powerKw??''}" placeholder="Inverters only"></label><label class="field">Inverter grid phase<select name="phase">${V.option('','Not specified',p.phase??'')}${V.option('Single-phase','Single-phase',p.phase)}${V.option('Three-phase','Three-phase',p.phase)}</select></label></div><label class="field">Compatible BMS<select name="bms">${V.option('','Not specified',p.bms??'')}${Object.values(state.catalog).filter(x=>x.category==='BMS').map(x=>V.option(x.model,x.model,p.bms)).join('')}</select></label><div class="form-row" style="margin-top:18px"><label class="field">Reporting applicability from<input name="from" type="month" value="${p.from??''}"></label><label class="field">Reporting applicability to<input name="to" type="month" value="${p.to??''}"></label></div><p class="table-note">Blank applicability dates mean no explicit bound. They do not indicate a launch date. Capacity changes recalculate historical battery capacity; review the impact before saving.</p><div class="dialog-actions"><button type="button" data-close="modal">Cancel</button><button type="submit" class="primary">Preview impact</button></div></form>`);
}
function eventForm(){openModal('Add commercial context',`<form data-form="event"><div class="form-row"><label class="field">Date<input type="date" name="date" value="${state.preferences.end}-01" required></label><label class="field">Event type<select name="type">${['Promotion','Training','Product launch','Stock availability','Pricing change','Other context'].map(x=>V.option(x,x,'')).join('')}</select></label></div><label class="field">Title<input name="title" maxlength="140" required placeholder="e.g. Installer training session"></label><label class="field" style="margin-top:16px">Notes<textarea name="notes" maxlength="3000" placeholder="Record what happened. Timing alone does not establish its impact."></textarea></label><div class="dialog-actions"><button type="button" data-close="modal">Cancel</button><button type="submit" class="primary">Save event</button></div></form>`);}
async function applyShortcut(value){if(value==='custom')return;const categories=state.preferences.category==='All'?D.CATEGORIES:[state.preferences.category],latest=D.latestComplete(state,categories);if(!latest){toast('No complete month is available for this category scope. Import data and confirm coverage.',true);return;}let start=latest,end=latest;
  if(value==='quarter'){let found=null;for(let i=0;i<120;i++){const m=D.shiftMonth(latest,-i);if(+m.slice(5)%3!==0)continue;const s=D.shiftMonth(m,-2);if(D.monthsBetween(s,m).every(x=>categories.every(c=>D.metric(state,x,x,c).complete))){found={start:s,end:m};break;}}if(!found){toast('No complete quarter is available.',true);return;}({start,end}=found);}
  else if(value==='ytd')start=`${latest.slice(0,4)}-01`;else if(/^\d+$/.test(value))start=D.shiftMonth(latest,1-Number(value));
  if(!D.monthsBetween(start,end).every(m=>categories.every(c=>D.metric(state,m,m,c).complete))){toast('This full interval contains incomplete months. Review Coverage or choose a custom period.',true);return;}
  const next=D.clone(state);next.preferences={...next.preferences,start,end};await commit(next);}

function validateInstallerPending(){const p=ui.installerPending;if(p)p.validation=D.validateInstallerMatrix({rows:p.rows,filename:p.filename,sheet:p.sheet,headerRow:p.headerRow,nameColumn:p.nameColumn});}
async function chooseInstallerSheet(name){const p=ui.installerPending;if(!p)return;p.sheet=name;p.rows=await p.workbook.sheet(name);p.headerRow=D.suggestInstallerHeader(p.rows).index;p.nameColumn=0;validateInstallerPending();}
async function importInstallerFile(file){if(!file)return;if(ui.demo)throw new Error('Exit demo before importing.');ui.installerLoading=true;ui.installerPending=null;ui.installerError=null;render();try{const workbook=await readWorkbook(await file.arrayBuffer(),file.name);ui.installerPending={workbook,filename:file.name};await chooseInstallerSheet(workbook.names[0]);}catch(error){ui.installerPending=null;ui.installerError=error.message;}finally{ui.installerLoading=false;render();}}
function reviewInstallerMerge(ids){if(ui.demo)throw new Error('Exit demo before merging installers.');ui.installerMergeIds=ids;openModal('Unify installers',IV.installerMergePreview(state,ids));}

document.addEventListener('click',async event=>{
  const el=event.target.closest('button,a[data-action],g[role="button"]');if(!el||el.disabled)return;
  try{
    if(ui.demo&&['print','export-records','export-summary','backup'].includes(el.dataset.action)){toast('Exports are disabled for fictional data. Return to your real workspace to report actual values.',true);return;}
    if(el.dataset.installerDetail){const id=el.dataset.installerDetail;openModal(state.installers.accounts[id].name,IA.installerProfile(state,id,ui)+'<details><summary>All original monthly source values</summary>'+IV.installerDetail(state,id)+'</details>');return;}
    if(el.dataset.installerSuggest){reviewInstallerMerge(el.dataset.installerSuggest.split(','));return;}
    if(el.dataset.installerPage){ui.installerPage=Number(el.dataset.installerPage);render();return;}
    if(el.dataset.installerUnmerge){const id=el.dataset.installerUnmerge;openModal('Undo installer union?', '<p>Restore the original account identities. Any monthly values updated since the union will be retained.</p>',async()=>{await commit(D.undoInstallerMerge(state,id),'Installer union undone.');ui.installerSelected=new Set();render();});return;}
    if(el.dataset.installerUndoImport){const id=el.dataset.installerUndoImport;openModal('Undo installer import?', '<p>Restore the previous source/month values. Later overlapping imports must be undone first. Account identities and unions are preserved.</p>',async()=>commit(D.undoInstallerImport(state,id),'Installer import undone.'));return;}
    if(el.dataset.close){$('#'+el.dataset.close).close();return;}
    if(el.dataset.nav){navigate(el.dataset.nav);return;}
    if(el.dataset.dataTab){navigate('data',el.dataset.dataTab);return;}
    if(el.dataset.installerPoint){openModal('Installer activation evidence',IA.installerPointEvidence(state,el.dataset.installerPoint,el.dataset.month,el.dataset.end??el.dataset.month,ui));return;}
    if(el.dataset.month){detail(el.dataset.month,el.dataset.end??el.dataset.month,el.dataset.model??state.preferences.model);return;}
    if(el.dataset.modelDetail){const model=state.catalog[el.dataset.modelDetail]?el.dataset.modelDetail:state.preferences.model;detail(state.preferences.start,state.preferences.end,model);return;}
    if(el.dataset.inverterChartModel){
      const model=el.dataset.inverterChartModel,preferences=state.preferences;
      const allowed=D.selectModels(state,{category:'Inverter',model:preferences.model,family:preferences.family})
        .some(p=>p.model===model&&((ui.gridPhase??'All')==='All'||p.phase===ui.gridPhase));
      if(!allowed)throw new Error('This inverter is not in the current reporting scope.');
      const initial=ui.inverterSelectedModels??D.ranking(state,preferences,'Inverter')
        .filter(x=>(ui.gridPhase??'All')==='All'||state.catalog[x.model]?.phase===ui.gridPhase)
        .slice(0,8).map(x=>x.model);
      if(initial.includes(model))ui.inverterSelectedModels=initial.filter(x=>x!==model);
      else{
        if(initial.length>=V.INVERTER_CHART_MAX)throw new Error('Select up to '+V.INVERTER_CHART_MAX+' inverter models at a time. Remove a model to add another.');
        ui.inverterSelectedModels=[...initial,model];
        ui.hiddenSeries.delete(model);
      }
      render();
      return;
    }
    if(el.dataset.toggleSeries){const key=el.dataset.toggleSeries;ui.hiddenSeries.has(key)?ui.hiddenSeries.delete(key):ui.hiddenSeries.add(key);render();return;}
    if(el.dataset.editProduct){showProduct(el.dataset.editProduct);return;}
    if(el.dataset.page){ui.recordPage=Math.max(0,+el.dataset.page);render();return;}
    if(el.dataset.eventDetail){const x=state.events.find(x=>x.id===el.dataset.eventDetail);openModal(x.title,`<p class="table-note">${e(x.date)} · ${e(x.type)}</p><p>${e(x.notes??'')}</p><p class="table-note">This is dated context, not a causal conclusion.</p>`);return;}
    if(el.dataset.deleteEvent){const id=el.dataset.deleteEvent,x=state.events.find(x=>x.id===id);openModal('Remove event?',`<p>${e(x.title)} · ${e(x.date)}</p>`,async()=>{const next=D.clone(state);next.events=next.events.filter(x=>x.id!==id);next.updatedAt=new Date().toISOString();await commit(next,'Event removed.');});return;}
    if(el.dataset.deleteTarget){const key=el.dataset.deleteTarget,t=state.targets[key];openModal('Remove monthly target?',`<p>${e(t.month)} · ${e(t.scope)} · ${V.number(t.value)} activations</p>`,async()=>{const next=D.clone(state);delete next.targets[key];next.updatedAt=new Date().toISOString();await commit(next,'Target removed.');});return;}
    if(el.dataset.undo){const id=el.dataset.undo,h=state.history.find(x=>x.id===id),conflicts=D.undoConflicts(state,id);openModal('Review import undo',`<p>${e(h.filename)} · ${e(h.sheet)}</p><p class="table-note">This import changed ${h.changes.length} records and ${h.coverageChanges?.length??0} coverage declarations.</p>${conflicts.length?`<div class="notice"><p><strong>${conflicts.length} overlapping later changes will be retained.</strong> Only non-conflicting changes can be reversed. This undo is marked complete afterward.</p></div><ul class="validation-list">${conflicts.map(x=>`<li>${e(x.type)}: ${e(x.key)}</li>`).join('')}</ul>`:'<p class="table-note">No overlapping later edits. Previous values and coverage will be restored.</p>'}`,async()=>commit(D.undoImport(state,id,conflicts.length>0),'Import undo saved.'),conflicts.length?'Undo non-conflicting changes':'Undo import');return;}
    switch(el.dataset.action){
      case 'installer-merge':reviewInstallerMerge([...(ui.installerSelected??[])]);break;
      case 'installer-cancel':ui.installerPending=null;ui.installerError=null;render();break;
      case 'installer-preview-export':{const p=ui.installerPending;if(p)download(toCsv([['Source name','Account','Month','Previous','Incoming','Action'],...D.installerImportPreview(state,p.validation).map(r=>[r.label,r.account,r.month,r.previous,r.quantity,r.action])]),'installer-import-preview.csv','text/csv;charset=utf-8');break;}
      case 'installer-analytics-export':{if(ui.demo)throw new Error('Exit demo before exporting.');download(toCsv(D.installerAnalyticsCsv(D.installerAnalysis(state,state.preferences,{cohort:ui.installerCohort??'all'}),state.preferences)),'installer-kpis.csv','text/csv;charset=utf-8');break;}
      case 'installer-export':{if(ui.demo)throw new Error('Exit demo before exporting.');const f=state.preferences,months=D.monthsBetween(f.start,f.end);download(toCsv([['Installer',...months,'Reported total'],...D.installerAnalysis(state,f,{cohort:ui.installerCohort??'all'}).rows.map(r=>[r.name,...months.map(m=>r.cells[m]?.value??null),r.current.value])]),`installers_${f.start}_${f.end}.csv`,'text/csv;charset=utf-8');break;}
      case 'import':navigate('data','import');break;
      case 'demo':if(!ui.demo){realState=state;state=makeDemo();ui.demo=true;ui.pending=null;ui.installerPending=null;ui.installerSelected=new Set();navigate('overview');}break;
      case 'exit-demo':if(ui.demo){state=realState;realState=null;ui.demo=false;ui.pending=null;ui.installerPending=null;ui.installerSelected=new Set();navigate('overview');}break;
      case 'help':navigate('data','backup');break;
      case 'templates':navigate('data','import');toast('Both Excel templates are available beside the import area.');break;
      case 'inverter-chart-picker':ui.inverterPickerOpen=!ui.inverterPickerOpen;render();break;
      case 'inverter-chart-top':ui.inverterSelectedModels=null;ui.hiddenSeries.clear();render();break;
      case 'inverter-chart-clear':ui.inverterSelectedModels=[];render();break;
      case 'toggle-filters':ui.moreFilters=!ui.moreFilters;render();break;
      case 'reset-filters':{ui.gridPhase='All';const next=D.clone(state);Object.assign(next.preferences,{category:'All',model:'All',family:'All'});await commit(next);break;}
      case 'presentation':document.body.classList.toggle('presentation');break;
      case 'print':{const previous=ui.page;ui.page='overview';render();$('#main').querySelectorAll('details').forEach(x=>x.open=true);window.print();ui.page=previous;render();break;}
      case 'event':eventForm();break;
      case 'add-product':showProduct();break;
      case 'revalidate':validatePending();render();break;
      case 'cancel-import':ui.pending=null;ui.importError=null;render();break;
      case 'template-unified':template('unified');break;
      case 'template-inverters':template('inverters');break;
      case 'template-batteries':template('batteries');break;
      case 'export-records':download(toCsv(exportRows(state,state.preferences)),`activation-records_${state.preferences.start}_${state.preferences.end}.csv`,'text/csv;charset=utf-8');break;
      case 'export-summary':download(toCsv(summaryRows(state,state.preferences)),`activation-summary_${state.preferences.start}_${state.preferences.end}.csv`,'text/csv;charset=utf-8');break;
      case 'backup':download(JSON.stringify(state,null,2),`Huawei_Activation_Backup_${new Date().toISOString().slice(0,10)}.json`,'application/json');break;
      case 'dialog-confirm':{if(!ui.dialogAction)break;el.disabled=true;try{await ui.dialogAction();$('#modal').close();}catch(err){$('#dialog-error').textContent=err.message;}finally{el.disabled=false;}break;}
    }
  }catch(err){toast(err.message,true);}
});
document.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.matches('g[role="button"]')){event.preventDefault();event.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});

document.addEventListener('change',async event=>{const el=event.target;try{
  if(el.dataset.installerSelect){ui.installerSelected??=new Set();el.checked?ui.installerSelected.add(el.dataset.installerSelect):ui.installerSelected.delete(el.dataset.installerSelect);render();return;}
  if(el.dataset.filter){const next=D.clone(state),f=next.preferences;f[el.dataset.filter]=el.value;if(!D.monthValue(f.start)||!D.monthValue(f.end)||f.start>f.end||!D.monthValue(f.compareStart)||!D.monthValue(f.compareEnd)||f.compareStart>f.compareEnd)throw new Error('Choose valid month ranges with start on or before end.');D.monthsBetween(f.start,f.end);D.monthsBetween(f.compareStart,f.compareEnd);if(['category','family'].includes(el.dataset.filter))f.model='All';ui.recordPage=0;await commit(next);return;}
  switch(el.id){
    case 'installer-cohort':ui.installerCohort=el.value;ui.installerPage=0;ui.installerSelected=new Set();render();break;
    case 'installer-sort':ui.installerSort=el.value;ui.installerPage=0;render();break;
    case 'installer-period':{if(el.value==='custom')break;const end=D.latestInstallerMonth(state);if(!end)throw new Error('No complete closed installer month is available.');const start=el.value==='ytd'?end.slice(0,4)+'-01':el.value==='month'?end:D.shiftMonth(end,1-Number(el.value));const next=D.clone(state);Object.assign(next.preferences,{start,end});await commit(next);break;}
    case 'installer-file':await importInstallerFile(el.files[0]);break;
    case 'installer-sheet':await chooseInstallerSheet(el.value);render();break;
    case 'installer-header':{const p=ui.installerPending;if(!p||!Number.isInteger(+el.value)||+el.value<1||+el.value>p.rows.length)throw new Error('Select a valid header row.');p.headerRow=+el.value-1;validateInstallerPending();render();break;}
    case 'installer-name-column':ui.installerPending.nameColumn=Number(el.value);validateInstallerPending();render();break;
    case 'shortcut':await applyShortcut(el.value);break;
    case 'quarter-select':ui.quarter=Number(el.value);render();break;
    case 'quarter-metric':ui.quarterMetric=el.value;render();break;
    case 'phase-chart-mode':ui.phaseChartMode=el.value;ui.hiddenSeries.clear();render();break;
    case 'grid-phase':ui.gridPhase=el.value;ui.inverterSelectedModels=null;ui.hiddenSeries.clear();render();break;
    case 'dataset':ui.dataset=el.value;if(ui.pending){ui.pending.classifications={};validatePending();}render();break;
    case 'import-file':await importFile(el.files[0]);break;
    case 'worksheet':await chooseWorksheet(el.value);break;
    case 'header-row':if(!Number.isInteger(+el.value)||+el.value<1||+el.value>ui.pending.rows.length)throw new Error('Choose a valid worksheet header row.');ui.pending.headerRow=+el.value-1;ui.pending.headerUncertain=false;validatePending();render();break;
    case 'trend-metric':ui.trendMetric=el.value;render();break;
    case 'mix-basis':ui.mixBasis=el.value;render();break;
    case 'compare-metric':ui.compareMetric=el.value;render();break;
    case 'coverage-category':ui.coverageCategory=el.value;render();break;
    case 'restore-file':{if(ui.demo)throw new Error('Exit the fictional demo before restoring a real backup.');const file=el.files[0];if(!file)break;if(file.size>80*1024*1024)throw new Error('Backup exceeds 80 MB.');let restored;try{restored=D.validateBackup(JSON.parse(await file.text()));restored.catalog=D.mergeInverterCatalog(restored.catalog);}catch(err){throw new Error('Backup not restored: '+err.message);}openModal('Replace this workspace with the backup?',`<p><strong>${e(file.name)}</strong></p><div class="preview-stats"><span><strong>${Object.keys(restored.records).length}</strong>records</span><span><strong>${Object.keys(restored.catalog).length}</strong>models</span><span><strong>${restored.history.length}</strong>equipment imports</span><span><strong>${Object.keys(restored.installers.accounts).length}</strong>installer accounts</span><span><strong>${restored.events.length}</strong>events</span></div><p class="table-note">This will replace ${Object.keys(state.records).length} current equipment records, installer accounts and activations, targets, events, coverage and history in this browser. It will not upload the backup anywhere.</p>`,async()=>{await commit(restored,'Backup restored successfully.');ui.pending=null;ui.installerPending=null;ui.installerSelected=new Set();navigate('overview');},'Restore full backup');break;}
  }
}catch(err){toast(err.message,true);render();}});

document.addEventListener('input',event=>{const el=event.target;if(el.id==='installer-search'){const cursor=el.selectionStart;ui.installerSearch=el.value;ui.installerPage=0;render();const input=$('#installer-search');input?.focus();input?.setSelectionRange(cursor,cursor);return;}if(el.id==='inverter-model-search'){
    ui.inverterModelSearch=el.value;
    const cursor=el.selectionStart;
    render();
    const current=$('#inverter-model-search');
    if(current){current.focus();try{current.setSelectionRange(cursor,cursor);}catch{}}
    return;
  }
  if(el.id==='table-search'||el.id==='record-search'){const id=el.id,value=el.value;ui[id==='table-search'?'tableSearch':'recordSearch']=value;ui.recordPage=0;const caret=el.selectionStart;render();const replacement=$('#'+id);replacement?.focus();replacement?.setSelectionRange(caret,caret);}});
document.addEventListener('dragover',event=>{const z=event.target.closest('#dropzone');if(z){event.preventDefault();z.classList.add('drag');}});
document.addEventListener('dragleave',event=>{event.target.closest('#dropzone')?.classList.remove('drag');});
document.addEventListener('drop',async event=>{if(event.target.closest('#dropzone')){event.preventDefault();await importFile(event.dataTransfer.files[0]);}});

document.addEventListener('submit',async event=>{
  const form=event.target;if(!form.dataset.form)return;event.preventDefault();const data=new FormData(form);const button=form.querySelector('button[type="submit"]');if(button)button.disabled=true;
  try{switch(form.dataset.form){
    case 'installer-import':{if(ui.demo)throw new Error('Exit demo before importing.');if(!data.has('approved'))throw new Error('Review and approve the import.');validateInstallerPending();const p=ui.installerPending;if(!p)throw new Error('Select a file.');const next=D.commitInstallerImport(state,p.validation);Object.assign(next.preferences,{start:p.validation.months[0],end:p.validation.months.at(-1)});await commit(next,'Installer activations imported. Repeated names were summed.');ui.installerPending=null;render();break;}
    case 'installer-merge':{await commit(D.mergeInstallers(state,ui.installerMergeIds,data.get('name')),'Installers unified. Monthly values were summed.');ui.installerSelected=new Set();$('#modal').close();render();break;}
    case 'classify':{
      const p=ui.pending,classes={...p.classifications};
      p.validation.unknown.forEach((model,i)=>{
        const category=data.get(`category-${i}`),powerInput=String(data.get(`power-${i}`)??'').trim(),phase=data.get(`phase-${i}`)||null;
        if(category==='Inverter'&&(!powerInput||!phase))throw new Error(`${model}: Provide rated kW and grid phase for a new inverter model.`);
        classes[model]={model,category,family:String(data.get(`family-${i}`)??'').trim(),
          capacity:category==='Battery module'?Number(data.get(`capacity-${i}`)):null,
          bms:category==='Battery module'?data.get(`bms-${i}`)||null:null,
          powerKw:category==='Inverter'?Number(powerInput):null,phase:category==='Inverter'?phase:null,from:null,to:null};
      });
      for(const product of Object.values(classes)){
        const errs=D.validateProduct(product,{...state.catalog,...classes});
        if(errs.length)throw new Error(`${product.model}: ${errs.join(' ')}`);
      }
      const switchToUnified=Object.values(classes).some(product=>!D.datasetAcceptsCategory(ui.dataset,product.category));
      p.classifications=classes;
      if(switchToUnified)ui.dataset='unified';
      validatePending();render();
      toast(switchToUnified?'Switched to Unified Import to include every selected equipment category.':'Model classifications confirmed for this preview.');
      break;
    }
    case 'commit-import':{if(!data.has('approved'))throw new Error('Confirm that you reviewed the proposed values.');const p=ui.pending;validatePending();const next=D.commitImport(state,p.validation,{classifications:p.classifications,confirmedCategories:data.getAll('coverage')});const last=D.latestComplete(next);if(last)Object.assign(next.preferences,{start:last,end:last});else if(p.validation.months.length)Object.assign(next.preferences,{start:p.validation.months[0],end:p.validation.months.at(-1)});await commit(next,'Import saved. Identical values were retained without duplication.');ui.pending=null;ui.installerPending=null;ui.installerSelected=new Set();navigate('overview');break;}
    case 'target':{const value={month:data.get('month'),scope:data.get('scope'),value:Number(data.get('value'))};D.saveTarget(state,value);const old=state.targets[D.targetKey(value.month,value.scope)];openModal('Review monthly target',`<p>${e(value.scope)} · ${V.labelMonth(value.month)}</p><p>Previous target: <strong>${old?V.number(old.value):'Not set'}</strong><br>New target: <strong>${V.number(value.value)}</strong> activations</p>`,async()=>commit(D.saveTarget(state,value),'Monthly target saved.'));break;}
    case 'coverage':{const value={category:data.get('category'),start:data.get('start'),end:data.get('end'),expected:data.getAll('expected'),confirmed:data.has('confirmed')};D.setCoverage(state,value);openModal('Review reporting scope',`<p>${e(value.category)} · ${V.rangeLabel(value.start,value.end)}</p><p class="table-note">Expected models: ${value.expected.map(e).join(', ')}<br>Coverage: ${value.confirmed?'Confirmed':'Unconfirmed'}</p><p class="table-note">This replaces scope declarations for ${D.monthsBetween(value.start,value.end).length} months. Recorded quantities remain intact. Completeness and comparisons will be recalculated.</p>`,async()=>commit(D.setCoverage(state,value),'Coverage saved and metrics recalculated.'));break;}
    case 'product':{const category=data.get('category'),p={model:D.canonical(data.get('model')),category,family:String(data.get('family')??'').trim(),capacity:category==='Battery module'?Number(data.get('capacity')):null,bms:category==='Battery module'?data.get('bms')||null:null,powerKw:category==='Inverter'&&String(data.get('powerKw')??'').trim()?Number(data.get('powerKw')):null,phase:category==='Inverter'?data.get('phase')||null:null,from:data.get('from')||null,to:data.get('to')||null};if(category==='Inverter'&&!ui.editProduct&&(!p.powerKw||!p.phase))throw new Error('Provide rated kW and grid phase for a new inverter.');if(!ui.editProduct&&state.catalog[p.model])throw new Error('This model already exists. Edit its existing catalogue entry.');const impact=D.productImpact(state,p),old=state.catalog[p.model];openModal('Confirm catalogue impact',`<p><strong>${e(p.model)}</strong></p><div class="table-wrap"><table><thead><tr><th>Field</th><th>Before</th><th>After</th></tr></thead><tbody>${['category','family','powerKw','phase','capacity','bms','from','to'].map(k=>`<tr><td>${k}</td><td>${e(old?.[k]??'Not set')}</td><td>${e(p[k]??'Not set')}</td></tr>`).join('')}</tbody></table></div><p class="table-note">${impact.records} recorded cells · ${V.number(impact.units)} units affected.<br>Historical capacity: ${V.number(impact.oldKwh,1)} → ${V.number(impact.newKwh,1)} kWh.<br>Family, compatibility and applicability changes may also change mix, coverage and ratios. The full change will be logged.</p>`,async()=>commit(D.updateProduct(state,p),'Catalogue updated with an audit entry.'));break;}
    case 'event':{const date=data.get('date'),title=String(data.get('title')).trim();if(!date||!title)throw new Error('Provide an event date and title.');const next=D.clone(state);next.events.push({id:D.uid(),date,title,type:data.get('type'),notes:String(data.get('notes')??'').trim()});next.updatedAt=new Date().toISOString();await commit(next,'Timeline event saved.');$('#modal').close();break;}
  }}catch(err){const errbox=$('#modal').open?$('#dialog-error'):null;if(errbox)errbox.textContent=err.message;else toast(err.message,true);}finally{if(button)button.disabled=false;}
});

try{const saved=await loadState();if(saved){state=D.validateBackup(saved);const merged=D.mergeInverterCatalog(state.catalog);if(merged!==state.catalog){state.catalog=merged;await saveState(state);}}render();}catch(err){ui.storageError=err.message;render();toast('Could not open saved workspace: '+err.message,true);}
