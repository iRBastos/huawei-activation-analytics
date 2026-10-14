import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../dist/modules/domain.js';
import * as IV from '../dist/modules/installer-views.js';
import {parseCsv,readWorkbook} from '../dist/modules/parser.js';
import '../dist/vendor/jszip.min.js';
const validate=csv=>D.validateInstallerMatrix({rows:parseCsv(csv),filename:'fixture.csv',sheet:'CSV'});
const fixture='Installer,202501,202502,Total\nBordGais Energy,10,5,99999\nBord Gáis Energy Solar,7,3,99999\nBord Gáis Energy,4,2,99999\nBordGais Energy,1,,#ERROR';
const seed=()=>D.commitInstallerImport(D.freshState(),validate(fixture));
const ids=s=>Object.keys(s.installers.accounts);
const sum=s=>D.installerRows(s,'2025-01','2025-02').reduce((n,r)=>n+(r.total??0),0);
test('repeated source rows sum, blanks become zero and arbitrary Total values are ignored',()=>{
 const v=validate(fixture);assert.deepEqual(v.errors,[]);assert.equal(v.duplicates,1);assert.equal(v.blankZeros,1);assert.equal(v.ignoredTotal,true);assert.equal(v.sources[0].months['2025-01'].quantity,11);assert.equal(sum(seed()),32);
});
test('reimports replace per-source snapshots, preserve absent months and never duplicate',()=>{
 const a=seed(),b=D.commitInstallerImport(a,validate(fixture));assert.equal(sum(b),32);assert.equal(b.installers.imports.at(-1).changes.length,0);
 const c=D.commitInstallerImport(b,validate('Installer,202501,Total\nBordGais Energy,,100'));assert.equal(sum(c),21);assert.equal(D.installerMonthly(c,ids(c)[0])['2025-02'],5);
 assert.equal(sum(a),32,'caller remains unchanged');
});
test('confirmed aliases sum and continue updating correctly after consolidation',()=>{
 const a=seed();assert.equal(D.installerSuggestions(a).length,3);
 const merged=D.mergeInstallers(a,ids(a),'Bord Gáis Energy');assert.equal(ids(merged).length,1);assert.deepEqual(D.installerMonthly(merged,ids(merged)[0]),{'2025-01':22,'2025-02':10});
 const again=D.commitInstallerImport(merged,validate(fixture));assert.equal(sum(again),32);
 const corrected=D.commitInstallerImport(again,validate('Installer,202501,Total\nBord Gáis Energy Solar,8,0'));assert.equal(sum(corrected),33);
 const restored=D.undoInstallerMerge(corrected,corrected.installers.merges[0].id);assert.equal(ids(restored).length,3);assert.equal(sum(restored),33);
 assert.equal(D.installerMonthly(restored,ids(a)[1])['2025-01'],8);
});
test('merge undo blocks overlapping later unions and succeeds in reverse order',()=>{
 const a=seed(),all=ids(a),b=D.mergeInstallers(a,all.slice(0,2),'Bord'),c=D.mergeInstallers(b,ids(b),'All Bord');
 assert.throws(()=>D.undoInstallerMerge(c,b.installers.merges[0].id),/Later changes/);
 const d=D.undoInstallerMerge(c,c.installers.merges[1].id),e=D.undoInstallerMerge(d,b.installers.merges[0].id);assert.equal(ids(e).length,3);assert.equal(sum(e),32);
});
test('import undo restores earlier values and prevents overwriting later imports',()=>{
 const a=seed(),b=D.commitInstallerImport(a,validate('Installer,202501\nBordGais Energy,99'));
 assert.throws(()=>D.undoInstallerImport(b,a.installers.imports[0].id),/Later imports/);
 const c=D.undoInstallerImport(b,b.installers.imports[1].id);assert.equal(sum(c),32);
 const d=D.undoInstallerImport(c,a.installers.imports[0].id);assert.equal(sum(d),0);assert.doesNotThrow(()=>D.validateBackup(d));
});
test('blank, absent and future months retain their different meanings',()=>{
 const a=D.commitInstallerImport(D.freshState(),validate('Installer,209901,209903,Total\nA Solar,,4,99'));
 const m=D.installerMonthly(a,ids(a)[0]);assert.equal(m['2099-01'],0);assert.equal(m['2099-02'],undefined);assert.equal(m['2099-03'],4);
 const row=D.installerRows(a,'2099-01','2099-03')[0];assert.equal(row.observed,2);assert.equal(row.expected,3);
});
test('bad quantities, repeated months and uncached formulas block import atomically',()=>{
 for(const csv of ['Installer,202501\nA,-1','Installer,202501\nA,1.5','Installer,202501\nA,text','Installer,202501,202501\nA,1,2']){const v=validate(csv);assert.ok(v.errors.length);assert.throws(()=>D.commitInstallerImport(D.freshState(),v));}
 const rows=[['Installer',202501,'Total'],['A',{f:'1+1',v:null},123]];const v=D.validateInstallerMatrix({rows,filename:'a.xlsx',sheet:'S'});assert.match(v.errors.join(),/formula/);
});
test('header mapping supports leading titles, named months, numeric months and styled trailing blanks',()=>{
 const rows=[['Title'],[],['Jan 2025','Name','Feb 2025','Total',null],[2,'Solar A',3,999,null]];
 assert.equal(D.suggestInstallerHeader(rows).index,2);
 const v=D.validateInstallerMatrix({rows,filename:'a.xlsx',sheet:'S',headerRow:2,nameColumn:1});assert.deepEqual(v.errors,[]);assert.deepEqual(v.months,['2025-01','2025-02']);assert.equal(v.ignoredTotal,true);
 assert.equal(D.installerMonth(45658),'2025-01');assert.equal(D.installerMonth('Sept 2026'),'2026-09');
});
test('backup migration, full round-trip and equipment isolation',()=>{
 const old=D.freshState();old.schemaVersion=1;delete old.installers;old.events=[{id:'x',date:'2025-01-01',title:'Existing event'}];
 const migrated=D.validateBackup(old);assert.equal(migrated.schemaVersion,2);assert.deepEqual(migrated.installers,D.emptyInstallers());assert.deepEqual(migrated.events,old.events);assert.equal(old.schemaVersion,1);
 const base=seed(),a=D.mergeInstallers(base,ids(base),'Bord');
 const round=D.validateBackup(JSON.parse(JSON.stringify(a)));assert.deepEqual(round,a);assert.deepEqual(a.records,migrated.records);assert.deepEqual(a.coverage,migrated.coverage);
 assert.deepEqual(D.validateBackup(round),round);
});
test('malformed installer backups and historical snapshots are rejected',()=>{
 for(const mutate of [s=>delete s.installers,s=>s.installers.sources[Object.keys(s.installers.sources)[0]].accountId='missing',s=>s.installers.imports[0].changes[0].before={quantity:-1},s=>s.installers.sources[Object.keys(s.installers.sources)[0]].months['2025-01'].quantity=-1]){const s=seed();mutate(s);assert.throws(()=>D.validateBackup(s));}
});
test('view escapes names and shows sums, aliases and preview',()=>{
 const s=D.commitInstallerImport(D.freshState(),validate('Installer,202501\n<script>alert(1)</script>,3'));s.preferences.start=s.preferences.end='2025-01';
 const html=IV.installerView(s,{});assert.ok(!html.includes('<script>'));assert.match(html,/&lt;script&gt;/);assert.match(IV.installerDetail(s,ids(s)[0]),/fixture.csv/);
});
test('actual XLSX uses existing parser then installer-specific rules',async()=>{
 const z=new globalThis.JSZip();z.file('xl/workbook.xml','<workbook><sheets><sheet name="Installers" r:id="rId1"/></sheets></workbook>');z.file('xl/_rels/workbook.xml.rels','<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>');
 z.file('xl/worksheets/sheet1.xml','<worksheet><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Installer</t></is></c><c r="B1"><v>202501</v></c><c r="C1" t="inlineStr"><is><t>Total</t></is></c></row><row r="2"><c r="A2" t="inlineStr"><is><t>A Solar</t></is></c><c r="C2" t="e"><v>#REF!</v></c></row><row r="3"><c r="A3" t="inlineStr"><is><t>A Solar</t></is></c><c r="B3"><v>7</v></c></row></sheetData></worksheet>');
 const bytes=await z.generateAsync({type:'uint8array'}),book=await readWorkbook(bytes,'sample.xlsx');
 const v=D.validateInstallerMatrix({rows:await book.sheet('Installers'),filename:'sample.xlsx',sheet:'Installers'});assert.deepEqual(v.errors,[]);assert.equal(v.sources[0].months['2025-01'].quantity,7);assert.equal(v.ignoredTotal,true);
});
test('1,000 installers x 48 months import, aggregate and repeat without loss',()=>{
 const months=D.monthsBetween('2023-01','2026-12'),rows=[['Installer',...months,'Total'],...Array.from({length:1000},(_,i)=>['Company '+i,...months.map(()=>1),999])];
 const v=D.validateInstallerMatrix({rows,filename:'scale.xlsx',sheet:'Data'});assert.deepEqual(v.errors,[]);
 const a=D.commitInstallerImport(D.freshState(),v),b=D.commitInstallerImport(a,v);assert.equal(b.installers.imports.at(-1).changes.length,0);assert.equal(D.installerRows(b,months[0],months.at(-1)).reduce((n,r)=>n+r.total,0),48000);assert.doesNotThrow(()=>D.validateBackup(b));
});

test('Chinese grand total summary is excluded before installer aggregation and repeated import',()=>{
 const v=validate('Installer,202501,202502\nAlpha Solar,3,4\nBeta Solar,5,6\n=== 总计 ===,8,10');
 assert.deepEqual(v.errors,[]);
 assert.equal(v.sources.length,2);
 assert.equal(v.duplicates,0);
 assert.match(v.warnings.join(' '),/Ignored summary row 4: === 总计 ===/);
 const first=D.commitInstallerImport(D.freshState(),v);
 assert.equal(Object.keys(first.installers.accounts).length,2);
 assert.equal(sum(first),18,'summary 8+10 must not double count actual 18 activations');
 const repeated=D.commitInstallerImport(first,v);
 assert.equal(sum(repeated),18);
 assert.equal(repeated.installers.imports.at(-1).changes.length,0);
});
test('Chinese grand total is ignored even with nonnumeric summary cells, while repeated installers still sum',()=>{
 const v=validate('Installer,202501,202502,Total\nAlpha Solar,2,1,123\nAlpha Solar,3,4,456\n=== 总计 ===,#REF!,not-a-number,#ERROR');
 assert.deepEqual(v.errors,[]);
 assert.equal(v.sources.length,1);
 assert.equal(v.duplicates,1);
 assert.deepEqual(v.sources[0].months['2025-01'].quantity,5);
 assert.deepEqual(v.sources[0].months['2025-02'].quantity,5);
 assert.equal(sum(D.commitInstallerImport(D.freshState(),v)),10);
});
test('XLSX source parser also excludes === 总计 === final row in installer data',async()=>{
 const z=new globalThis.JSZip();
 z.file('xl/workbook.xml','<workbook><sheets><sheet name="Installers" r:id="rId1"/></sheets></workbook>');
 z.file('xl/_rels/workbook.xml.rels','<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>');
 const r=[
   ['Installer',202501,202502],
   ['Alpha Solar',3,4],
   ['Beta Solar',5,6],
   ['=== 总计 ===',8,10],
 ];
 const cell=(value,col,row)=>typeof value==='number'
    ? `<c r="${col}${row}"><v>${value}</v></c>`
    : `<c r="${col}${row}" t="inlineStr"><is><t>${value}</t></is></c>`;
 const xml='<worksheet><sheetData>'+r.map((values,i)=>
   `<row r="${i+1}">${values.map((v,c)=>cell(v,String.fromCharCode(65+c),i+1)).join('')}</row>`
 ).join('')+'</sheetData></worksheet>';
 z.file('xl/worksheets/sheet1.xml',xml);
 const bytes=await z.generateAsync({type:'uint8array'});
 const book=await readWorkbook(bytes,'fixture.xlsx');
 const v=D.validateInstallerMatrix({rows:await book.sheet('Installers'),filename:'fixture.xlsx',sheet:'Installers'});
 assert.deepEqual(v.errors,[]);
 assert.equal(v.sources.length,2);
 assert.equal(sum(D.commitInstallerImport(D.freshState(),v)),18);
});
