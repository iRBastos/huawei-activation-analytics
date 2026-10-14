// No npm dependencies. Opens the generated file:// dashboard in real headless Chrome.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,readFile,writeFile,rm,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../../',import.meta.url)));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const binaries=[process.env.CHROME_BIN,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].filter(Boolean);
let binary=null;
for(const candidate of binaries){try{await access(candidate);binary=candidate;break;}catch{}}
if(!binary)throw new Error('Chromium/Google Chrome not installed on this CI runner');
const dir=await mkdtemp(path.join(tmpdir(),'huawei-browser-'));
const processArgs=['--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--no-first-run','--no-default-browser-check','--remote-allow-origins=*','--remote-debugging-port=0','--user-data-dir='+dir,'about:blank'];
const browser=spawn(binary,processArgs,{stdio:'ignore'});
let ws,closed=false;
try{
 let port=null;
 // A loaded CI host can need longer to open Chrome's debugging socket.
 for(let i=0;i<350;i++){
  if(browser.exitCode!==null)throw new Error('Chrome exited before opening DevTools');
  try{const parts=(await readFile(path.join(dir,'DevToolsActivePort'),'utf8')).trim().split('\n');port=Number(parts[0]);if(port>0)break;}catch{}
  await wait(100);
 }
 if(!port)throw new Error('Could not obtain Chrome DevTools debugging port');
 let target;
 for(let i=0;i<40;i++){
  try{target=(await (await fetch('http://127.0.0.1:'+port+'/json')).json()).find(t=>t.type==='page');if(target)break;}catch{}
  await wait(100);
 }
 if(!target)throw new Error('Chrome did not expose a page target');
 ws=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
 let nextId=0;
 const pending=new Map();
 const exceptions=[];
 const blocked=[];
 ws.onmessage=event=>{
  const msg=JSON.parse(event.data);
  if(msg.id){
   const p=pending.get(msg.id);if(!p)return;
   pending.delete(msg.id);if(msg.error)p.reject(new Error(JSON.stringify(msg.error)));else p.resolve(msg.result);
  }else if(msg.method==='Runtime.exceptionThrown')exceptions.push(msg.params.exceptionDetails.text);
  else if(msg.method==='Network.requestWillBeSent'){
   const u=msg.params.request?.url||'';
   if(!/^(?:file|data|blob|about):/.test(u))blocked.push(u);
  }
 };
 const command=(method,params={})=>new Promise((resolve,reject)=>{
  const id=++nextId;pending.set(id,{resolve,reject});
  ws.send(JSON.stringify({id,method,params}));
 });
 async function evaluate(expression){
  const r=await command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(r.exceptionDetails)throw new Error('Browser JS: '+r.exceptionDetails.text);
  return r.result.value;
 }
 const until=async(expr,label)=>{
  for(let i=0;i<80;i++){
   if(await evaluate(expr))return;
   await wait(100);
  }
  throw new Error('Timed out waiting for '+label);
 };
 await command('Page.enable');
 await command('Runtime.enable');
 await command('Network.enable');
 await command('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
 const url=pathToFileURL(path.join(root,'index.html')).href;
 await command('Page.navigate',{url});
 await until("document.querySelector('#main')?.textContent?.includes('Ready for your activation data')",'empty dashboard');
 assert.equal(await evaluate("document.querySelectorAll('script[src]').length"),0,'all runtime scripts must be inlined');
 assert.equal(await evaluate("document.querySelectorAll('link[rel=stylesheet]').length"),0,'all stylesheet code must be inlined');
 await evaluate("document.querySelector('[data-action=demo]').click()");
 await until("document.querySelector('#main')?.textContent?.includes('BMS / Inverter')",'demo KPI');
 await evaluate("document.querySelector('[data-nav=inverters]').click()");
 await until("document.querySelector('#main')?.textContent?.includes('Inverter activations by model')",'inverter charts');
 await evaluate("document.querySelector('[data-action=inverter-chart-picker]').click()");
 await until("!!document.querySelector('#inverter-model-search')",'model picker');
 const before=await evaluate("document.querySelectorAll('[data-inverter-chart-model]').length");
 assert.ok(before>8,'model selector must include more than the Top 8');
 await evaluate("const el=document.querySelector('#inverter-model-search');el.value='SUN2000-17';el.dispatchEvent(new Event('input',{bubbles:true}));");
 await until("document.querySelector('#inverter-model-search')?.value==='SUN2000-17'",'model search input');
 const searched=await evaluate("document.querySelectorAll('[data-inverter-chart-model]').length");
 assert.ok(searched>0&&searched<=before,'search should narrow but not hide all registered matches');
 await evaluate("document.querySelector('[data-inverter-chart-model]').click()");
 await until("document.querySelector('#main')?.textContent?.includes('selected model')",'selected chart model');
 await evaluate("document.querySelector('[data-nav=comparisons]').click()");
 await until("!![...document.querySelectorAll('.panel')].find(el=>el.querySelector('h2')?.textContent==='Comparison evidence')",'comparison panel');
 const evidence=await evaluate("(()=>{const p=[...document.querySelectorAll('.panel')].find(el=>el.querySelector('h2')?.textContent==='Comparison evidence');return {chart:!!p.querySelector('svg.line-chart'),table:!!p.querySelector('table'),order:p.querySelector('svg.line-chart')?.compareDocumentPosition(p.querySelector('table'))};})()");
 assert.ok(evidence.chart&&evidence.table,'comparison must show chart AND table');
 assert.ok((evidence.order&4)!==0,'chart must appear before table');
 // F5: Data Workspace keeps all seven destinations and keyboard-accessible grouped tabs.
 await evaluate("document.querySelector('[data-nav=data]').click()");
 await until("document.querySelectorAll('.data-workspace-tabs [role=tab]').length===7",'seven grouped Data tabs');
 assert.equal(await evaluate("document.querySelectorAll('.data-tab-group').length"),4,'Import / Inspect / Configure / Protect grouping');
 await evaluate("document.querySelector('[data-data-tab=records]').click()");
 assert.equal(await evaluate("document.querySelector('[data-data-tab=records]').getAttribute('aria-selected')"),'true');
 await evaluate("document.querySelector('[data-data-tab=records]').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}))");
 assert.equal(await evaluate("document.querySelector('[data-data-tab=coverage]').getAttribute('aria-selected')"),'true','Data tabs are keyboard-operable');
 assert.ok(await evaluate("!!document.querySelector('details.coverage-editor [data-form=coverage]')"),'coverage edit remains available');
 await evaluate("document.querySelector('[data-data-tab=backup]').click()");
 assert.ok(await evaluate("!!document.querySelector('#restore-file')&&!!document.querySelector('[data-action=backup]')"),'backup and restore remain discoverable');
 await evaluate("document.querySelector('[data-nav=targets]').click()");
 assert.ok(await evaluate("!!document.querySelector('details.target-editor [data-form=target]')"),'target review remains discoverable');
 // Installer UI acceptance runs on fictional CSV data in this temporary browser profile.
 await evaluate("document.querySelector('[data-action=exit-demo]').click()");
 await evaluate("document.querySelector('[data-nav=installers]').click()");
 const originalInstallerStart=await evaluate("document.querySelector('[data-filter=start]').value");
 assert.equal(await evaluate("document.querySelector('#installer-file')"),null,'import UI belongs to Data');
 const installerCsv='Installer,202501,202502,Total\nBordGais Energy,10,5,999\nBord Gáis Energy Solar,7,3,999\nBord Gáis Energy,4,2,999\nBordGais Energy,1,,999';
 async function uploadInstallers(csv,full=false){
  await evaluate("document.querySelector('[data-nav=data]').click()");
  await evaluate("document.querySelector('[data-data-tab=installer-import]').click()");
  await until("!!document.querySelector('#installer-file')",'installer Data import tab');
  await evaluate(`(()=>{const dt=new DataTransfer();dt.items.add(new File([${JSON.stringify(csv)}],'installer-fixture.csv',{type:'text/csv'}));const input=document.querySelector('#installer-file');input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await until("!!document.querySelector('[data-form=installer-import]')",'installer preview');
  if(full)await evaluate("(()=>{const f=document.querySelector('[data-form=installer-import]');f.querySelector('[name=scope]').value='full';f.querySelector('[name=fullScopeConfirmed]').checked=true;})()");
  await evaluate("(()=>{const f=document.querySelector('[data-form=installer-import]');f.querySelector('[name=approved]').checked=true;f.requestSubmit();})()");
  await until("!document.querySelector('[data-form=installer-import]')",'installer import committed');
  await evaluate("document.querySelector('[data-nav=installers]').click()");
 }
 await uploadInstallers(installerCsv);
 assert.equal(await evaluate("document.querySelector('[data-filter=start]').value"),'2025-01');
 await evaluate("document.querySelector('[data-nav=overview]').click()");
 assert.equal(await evaluate("document.querySelector('[data-filter=start]').value"),originalInstallerStart,'installer imports cannot change equipment dates');
 await evaluate("document.querySelector('[data-nav=installers]').click()");
 // F6: installer tabs form one roving keyboard tab stop and support arrow/Home/End.
 assert.equal(await evaluate("[...document.querySelectorAll('.installer-section-tabs [role=tab]')].filter(el=>el.tabIndex===0).length"),1);
 await evaluate("document.querySelector('[data-installer-tab=overview]').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}))");
 assert.equal(await evaluate("document.querySelector('.installer-section-tabs [aria-selected=true]').dataset.installerTab"),'profile');
 assert.equal(await evaluate("document.activeElement?.dataset.installerTab"),'profile');
 await evaluate("document.querySelector('[data-installer-tab=profile]').dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true}))");
 assert.equal(await evaluate("document.querySelector('.installer-section-tabs [aria-selected=true]').dataset.installerTab"),'insights');
 await evaluate("document.querySelector('[data-installer-tab=insights]').dispatchEvent(new KeyboardEvent('keydown',{key:'Home',bubbles:true}))");
 assert.equal(await evaluate("document.querySelector('.installer-section-tabs [aria-selected=true]').dataset.installerTab"),'overview');
 assert.equal(await evaluate("document.querySelectorAll('[data-installer-select]').length"),3);
 await evaluate("document.querySelector('[data-installer-fullprofile]').click()");
 await until("!!document.querySelector('#installer-profile-picker')",'full installer profile');
 assert.equal(await evaluate("document.querySelectorAll('svg.line-chart').length"),3,'monthly, quarterly and annual profile charts');
 assert.ok(await evaluate("document.querySelector('#main').textContent.includes('Historical monthly evidence')"));
 await evaluate("document.querySelector('[data-installer-tab=compare]').click()");
 await until("!!document.querySelector('#installer-compare-search')",'comparison selector');
 await evaluate("document.querySelectorAll('.installer-compare-picker [data-installer-compare-pick]')[0].click()");
 await evaluate("document.querySelectorAll('.installer-compare-picker [data-installer-compare-pick]')[1].click()");
 await until("document.querySelector('#main').textContent.includes('Account-by-account comparison')",'2 installer comparison');
 assert.ok(await evaluate("document.querySelectorAll('svg.line-chart').length>=1"));
 assert.ok(await evaluate("document.querySelector('#main').textContent.includes('Underlying period values')"));
 // F3: comparison summary precedes the chart, and both chart modes are reachable.
 assert.ok(await evaluate("(()=>{const h=document.querySelector('#main').innerHTML;return h.indexOf('Account-by-account comparison')<h.indexOf('Absolute activation trends')})()"));
 await evaluate("document.querySelector('[data-installer-compare-mode=indexed]').click()");
 assert.equal(await evaluate("document.querySelector('[data-installer-compare-mode=indexed]').getAttribute('aria-pressed')"),'true');
 await evaluate("document.querySelector('[data-installer-compare-mode=absolute]').click()");
 assert.equal(await evaluate("document.querySelector('[data-installer-compare-mode=absolute]').getAttribute('aria-pressed')"),'true');
 await evaluate("document.querySelector('[data-installer-tab=insights]').click()");
 await until("!!document.querySelector('#installer-insight-volume')",'installer insights');
 assert.ok(await evaluate("document.querySelector('#main').textContent.includes('Suggested next action')"));
 assert.ok(await evaluate("(()=>{const h=document.querySelector('#main').innerHTML;return h.indexOf('Account priorities')<h.indexOf('Evidence thresholds')})()"));
 assert.ok(await evaluate("!!document.querySelector('details.installer-insight-rules')"));
 await evaluate("(()=>{const select=document.querySelector('#installer-insight-volume');select.value='10';select.dispatchEvent(new Event('change',{bubbles:true}));})()");
 await until("document.querySelector('#installer-insight-volume')?.value==='10'",'persisted installer insight threshold');
 await evaluate("document.querySelector('[data-installer-tab=overview]').click()");

 await until("document.querySelectorAll('[data-installer-select]').length===3",'portfolio after comparison');
 assert.ok(await evaluate("!!document.querySelector('details.installer-account-management')"));
 assert.ok(await evaluate("document.querySelector('.installer-account-management').open===false"));
 await evaluate("(()=>{const ids=[...document.querySelectorAll('[data-installer-select]')].map(x=>x.dataset.installerSelect);for(const id of ids){const el=document.querySelector('[data-installer-select=\"'+id+'\"]');el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));}document.querySelector('[data-action=installer-merge]').click();})()");
 await until("!!document.querySelector('[data-form=installer-merge]')",'merge preview');
 await evaluate("(()=>{const f=document.querySelector('[data-form=installer-merge]');f.querySelector('[name=name]').value='Bord Gáis Energy';f.requestSubmit();})()");
 await until("!document.querySelector('#modal').open",'merge saved');
 assert.equal(await evaluate("document.querySelectorAll('[data-installer-select]').length"),1);
 assert.equal(await evaluate("document.querySelector('[data-installer-select]').closest('tr').children[2].textContent"),'32');
 await uploadInstallers(installerCsv);
 assert.equal(await evaluate("document.querySelector('[data-installer-select]').closest('tr').children[2].textContent"),'32','reimport must not double count');
 await command('Page.reload');
 await until("!!document.querySelector('[data-installer-select]')",'installer persistence after reload');
 assert.equal(await evaluate("document.querySelector('[data-installer-select]').closest('tr').children[2].textContent"),'32');
 await evaluate("document.querySelector('[data-installer-unmerge]').click();document.querySelector('[data-action=dialog-confirm]').click()");
 await until("document.querySelectorAll('[data-installer-select]').length===3",'undo union');
 assert.ok(await evaluate("document.querySelectorAll('[data-installer-suggest]').length>0"),'automatic name suggestions');
 await evaluate("document.querySelector('[data-installer-detail]').click()");
 await until("document.querySelector('#modal')?.textContent.includes('installer-fixture.csv')",'source evidence');
 await evaluate("document.querySelector('#modal [data-close]').click()");
 assert.equal(await evaluate("document.querySelector('.installer-kpi strong').textContent"),'32');
 assert.ok(await evaluate("document.querySelectorAll('.installer-heatmap .heat-cell').length===6"));
 await evaluate("document.querySelector('.installer-heatmap [data-installer-point]').click()");
 await until("document.querySelector('#modal')?.textContent.includes('reporting coverage units confirmed')",'heatmap source evidence');
 await evaluate("document.querySelector('#modal [data-close]').click()");
 await evaluate("document.querySelector('g[data-installer-point]').dispatchEvent(new MouseEvent('click',{bubbles:true}))");
 await until("document.querySelector('#modal')?.textContent.includes('Portfolio evidence')",'installer chart routing');
 await evaluate("document.querySelector('#modal [data-close]').click()");
 await evaluate("(()=>{const el=document.querySelector('#installer-cohort');el.value='comparable';el.dispatchEvent(new Event('change',{bubbles:true}));})()");
 await until("document.querySelectorAll('[data-installer-select]').length===0",'missing comparison excludes accounts');
 await evaluate("(()=>{const el=document.querySelector('#installer-cohort');el.value='all';el.dispatchEvent(new Event('change',{bubbles:true}));})()");
 await until("document.querySelectorAll('[data-installer-select]').length===3",'restore full installer base');
  // Full snapshot supersedes stale omitted rows; partial updates may restore one.
 await uploadInstallers('Installer,202501,202502\nBordGais Energy,11,5',true);
 assert.equal(await evaluate("document.querySelector('.installer-kpi strong').textContent"),'16');
 await evaluate("([...document.querySelectorAll('[data-installer-detail]')].find(el=>el.textContent.includes('Bord Gáis Energy Solar'))).click()");
 await until("document.querySelector('#modal')?.textContent.includes('Historical')",'superseded evidence');
 await evaluate("document.querySelector('#modal [data-close]').click()");
 await uploadInstallers('Installer,202501,202502\nBord Gáis Energy Solar,7,3');
 assert.equal(await evaluate("document.querySelector('.installer-kpi strong').textContent"),'26');
 // Regression: 140+ installer accounts must all appear in both selectors, not just
 // the initial 80/100. This is separate from the existing 1,000 x 48 import test.
 const longList='Installer,202503\n'+Array.from({length:142},(_,i)=>'QA Installer '+String(i).padStart(4,'0')+','+(i+1)).join('\n');
 await uploadInstallers(longList);
 await evaluate("document.querySelector('[data-installer-tab=profile]').click()");
 await until("document.querySelector('#installer-profile-picker')?.options.length>=140",'full installer account list');
 assert.ok(await evaluate("([...document.querySelector('#installer-profile-picker').options].some(x=>x.textContent==='QA Installer 0141'))"),'last installer visible without searching');
 await evaluate("document.querySelector('[data-installer-tab=compare]').click()");
 await until("document.querySelectorAll('.installer-compare-picker [data-installer-compare-pick]').length>=140",'full scrollable comparison list');
 assert.ok(await evaluate("([...document.querySelectorAll('.installer-compare-picker button')].some(x=>x.textContent.includes('QA Installer 0141')))"),'last account appears in comparison before searching');
 const scrollBefore=await evaluate("(()=>{const p=document.querySelector('.installer-compare-picker');p.scrollTop=p.scrollHeight;return p.scrollTop;})()");
 assert.ok(scrollBefore>200,'long-list scroll must be substantive');
 await evaluate("([...document.querySelectorAll('.installer-compare-picker button')].find(x=>x.textContent.includes('QA Installer 0141'))).click()");
 assert.ok(await evaluate("document.querySelector('.installer-compare-picker').scrollTop>200"),'selection must preserve scroll position after redraw');
 await evaluate("document.querySelector('[data-installer-tab=overview]').click()");

 // Responsive acceptance in a real mobile-sized Chromium viewport. Tables are
 // allowed to scroll internally; the page itself must not overflow sideways.
 await command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 const responsive=[];
 async function inspectMobile(view){
  const result=await evaluate("({viewport:window.innerWidth,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,mainWidth:document.querySelector('#main')?.scrollWidth})");
  responsive.push({view,...result});
  assert.ok(result.documentWidth<=result.viewport+2,'mobile horizontal page overflow in '+view+': '+JSON.stringify(result));
 }
 await inspectMobile('installer-overview');
 await evaluate("document.querySelector('[data-installer-tab=profile]').click()");
 await until("!!document.querySelector('#installer-profile-picker')",'mobile profile');
 await inspectMobile('installer-profile');
 await evaluate("document.querySelector('[data-installer-tab=compare]').click()");
 await until("!!document.querySelector('#installer-compare-search')",'mobile comparison');
 await inspectMobile('installer-compare');
 await evaluate("document.querySelector('[data-installer-tab=insights]').click()");
 await until("!!document.querySelector('#installer-insight-search')",'mobile insights');
 await inspectMobile('installer-insights');
 // Transient notifications should not hide controls in archived visual evidence.
 await evaluate("document.querySelector('#toast')?.classList.remove('visible')");
 assert.equal(await evaluate("document.querySelectorAll('.installer-section-tabs button').length"),4);
 assert.equal(await evaluate("(()=>{const r=[...document.querySelectorAll('.installer-section-tabs button')].map(x=>x.getBoundingClientRect());return Math.abs(r[0].top-r[1].top)<3&&r[2].top>r[0].top+30&&Math.abs(r[2].top-r[3].top)<3;})()"),true,'mobile installer tabs must be a readable 2x2 grid');
 const mobileShot=await command('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
 await writeFile(path.join(root,'browser-smoke-mobile.png'),Buffer.from(mobileShot.data,'base64'));
 await evaluate("document.querySelector('[data-nav=data]').click()");
 await evaluate("document.querySelector('[data-data-tab=installer-import]').click()");
 await until("!!document.querySelector('#installer-file')",'mobile installer import');
 await inspectMobile('data-installer-import');
 await command('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
 await evaluate("document.querySelector('[data-nav=installers]').click()");
 await evaluate("document.querySelector('#toast')?.classList.remove('visible')");
 const shot=await command('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
 await writeFile(path.join(root,'browser-smoke.png'),Buffer.from(shot.data,'base64'));
 assert.deepEqual(exceptions,[],'uncaught browser errors');
 assert.deepEqual(blocked,[],'offline app must not request remote resources');
 console.log(JSON.stringify({browser:'Chromium',realBrowser:true,offline:true,checks:['file-open boot','self-contained assets','demo KPI','inverter chart','search any model','chart model selection','comparison evidence chart and table','installer CSV preview and import','duplicate-row sum','manual union','idempotent reimport after union','installer reload persistence','undo union','name suggestions','source evidence','installer KPIs','monthly heatmap evidence','installer chart routing','comparable cohort','full installer pickers after 140+ source names','scroll position persists after selection','responsive 390px for 5 workspaces','mobile screenshot','screenshot'],screenshot:'browser-smoke.png'}));
}finally{
 if(ws){try{ws.close()}catch{}}
 browser.kill('SIGKILL');
 if(browser.exitCode===null&&browser.signalCode===null){
   await Promise.race([new Promise(resolve=>browser.once('exit',resolve)),wait(3000)]);
 }
 // Chrome cache writers may linger briefly after the browser exits.
 await rm(dir,{recursive:true,force:true,maxRetries:20,retryDelay:200});
}
