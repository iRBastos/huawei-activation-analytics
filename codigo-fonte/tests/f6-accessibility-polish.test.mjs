import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as X from '../dist/modules/installer-experiences.js';
import * as D from '../dist/modules/domain.js';
import * as V from '../dist/modules/views.js';

const source=(filename)=>readFileSync(new URL(filename,import.meta.url),'utf8');
const luminance=hex=>{
 const rgb=hex.match(/[a-f\d]{2}/gi).map(x=>parseInt(x,16)/255);
 return rgb.map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4).reduce((n,v,i)=>n+v*[0.2126,0.7152,0.0722][i],0);
};
const contrast=(fg,bg)=>{const a=luminance(fg),b=luminance(bg);return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05)};

test('F6: installer tabs support a single keyboard stop without changing routes or selected view',()=>{
 const ids=['overview','profile','compare','insights'];
 for(const selected of ids){
  const nav=X.installerTabNav(selected);
  assert.equal((nav.match(/role="tab"/g)||[]).length,4);
  assert.equal((nav.match(/aria-selected="true"/g)||[]).length,1);
  assert.equal((nav.match(/tabindex="0"/g)||[]).length,1);
  assert.equal((nav.match(/tabindex="-1"/g)||[]).length,3);
  for(const id of ids)assert.match(nav,new RegExp(`data-installer-tab="${id}"`));
 }
 const app=source('../dist/modules/app.js');
 assert.match(app,/event\.target\.matches\?\.\('\[data-installer-tab\]'\)/);
 assert.match(app,/document\.querySelectorAll\('\.installer-section-tabs \[data-installer-tab\]'\)/);
 assert.match(app,/ui\.installerTab=id;ui\.hiddenSeries\.clear\(\);render\(\)/);
});

test('F6: muted secondary labels and SVG axis labels meet 4.5:1 contrast on their real surfaces',()=>{
 const css=source('../dist/styles.css');
 const rules=[
  {name:'chart axis',pattern:/\.axis\{fill:(#[0-9a-f]{6})\}/g,bg:'#ffffff'},
  {name:'sidebar heading',pattern:/\.sidebar \.nav-group-label\{color:(#[0-9a-f]{6})\}/g,bg:'#ffffff'},
  {name:'data workspace group heading',pattern:/\.data-tab-label\{color:(#[0-9a-f]{6});font-size:11px\}/g,bg:'#f5f6f8'}
 ];
 for(const rule of rules){let last,match;while((match=rule.pattern.exec(css)))last=match[1];
  assert.ok(last,`Missing ${rule.name} foreground`);
  assert.ok(contrast(last,rule.bg)>=4.5,`${rule.name}: contrast ${contrast(last,rule.bg).toFixed(2)}:1`);
 }
});

test('F6: compact 390px Data navigation retains 44px targets and readable 12px tabs',()=>{
 const css=source('../dist/styles.css');
 assert.match(css,/\/\* F6 — accessibility and narrow-screen polish/);
 assert.match(css,/\.data-workspace-tabs button\{flex:1 1 0;min-width:0;min-height:44px;padding:8px 4px;font-size:12px/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 const before=JSON.stringify(D.freshState());
 const state=D.freshState();state.preferences.start=state.preferences.end;
 for(const tab of V.DATA_TABS)V.dataView(state,{page:'data',dataTab:tab[0],dataset:'unified',hiddenSeries:new Set()});
 assert.equal(JSON.stringify(D.freshState()),before);
});
