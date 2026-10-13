import fs from 'node:fs/promises';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const out=process.argv[2]??new URL('../dist/templates/',import.meta.url).pathname;
const preview=process.argv[3]??'/tmp/huawei-template-previews';
await fs.mkdir(preview,{recursive:true});
const months=[202510,202511,202512,202601,202602,202603,202604,202605,202606,202607,202608,202609];
const definitions=[['Inverter',['REPLACE-WITH-INVERTER-MODEL']],['Battery_BMS',['LUNA2000-5-E0','LUNA2000-5-E1','LUNA2000-7-E1','LUNA2000-5KW-C0','LUNA2000-10KW-C1']]];
await fs.mkdir(out,{recursive:true});
for(const [kind,models] of definitions){
 const w=Workbook.create(),s=w.worksheets.add('Activation matrix'),guide=w.worksheets.add('Instructions');
 const total=2+models.length;
 s.showGridLines=false;guide.showGridLines=false;
 s.getRange(`A1:M${total}`).format.font={name:'Arial',size:10,color:'#25303B'};
 s.getRange(`A1:M${total}`).format.rowHeight=26;
 s.getRange(`A1:A${total}`).format.columnWidth=36;
 s.getRange(`B1:M${total}`).format.columnWidth=12;
 s.getRange('A1:M1').values=[['index',...months]];
 s.getRange('A1:M1').format={fill:'#B7132D',font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},rowHeight:29};
 s.getRange('B1:M1').setNumberFormat('0');
 models.forEach((m,i)=>{s.getRange(`A${i+2}`).values=[[m]];});
 s.getRange(`B2:M${total-1}`).format.fill='#FFF8E6';
 s.getRange(`B2:M${total-1}`).setNumberFormat('#,##0');
 s.getRange(`A${total}`).values=[['Total']];
 for(let c=0;c<12;c++){const col=String.fromCharCode(66+c);s.getRange(`${col}${total}`).formulas=[[`=SUM(${col}2:${col}${total-1})`]];}
 s.getRange(`A${total}:M${total}`).format={fill:'#F0F2F5',font:{name:'Arial',size:10,bold:true,color:'#25303B'},rowHeight:28};
 s.getRange(`B${total}:M${total}`).setNumberFormat('#,##0');
 s.freezePanes.freezeRows(1);s.freezePanes.freezeColumns(1);
 const instructions=[['Huawei Activation Analytics','Import template guide'],['Matrix worksheet','Use Activation matrix when importing. Instructions is not a data sheet.'],['Months','Replace or extend YYYYMM headers. Numeric and text headers are accepted.'],['Model codes','Replace the inverter placeholder with the exact model. Add distinct models as separate rows.'],['Quantities','Enter non-negative whole numbers. Leave unknown values blank. Enter 0 only for a confirmed zero.'],['Totals','Total rows are arithmetic controls, never products or installed systems.'],['Recalculation','After editing formulas, recalculate and save in Excel so numeric results are cached.'],['Reporting scope','Confirm that every expected model is included. Missing values prevent full completeness.'],['Separate datasets','Upload inverters separately from battery modules and BMS.'],['Source definitions','S0: 5-E0 = 5 kWh. S1: 5-E1 = 5 kWh; 7-E1 = 7 kWh. BMS units have no capacity.'],['Interpretation','Activations do not verify sales, households, installations or individual device pairings.'],['Blank template','No business data is included. Input cells are shaded pale amber.']];
 guide.getRange('A1:B12').values=instructions;guide.getRange('A1:B12').format.font={name:'Arial',size:10,color:'#25303B'};
 guide.getRange('A1:A12').format.columnWidth=30;guide.getRange('B1:B12').format.columnWidth=118;
 guide.getRange('A1:B12').format.rowHeight=28;guide.getRange('A1:B1').format.font={name:'Arial',size:13,bold:true,color:'#B7132D'};
 w.recalculate();
 console.log(kind,(await w.inspect({kind:'table',range:`'Activation matrix'!A1:D${total}`,include:'values,formulas',tableMaxRows:8,tableMaxCols:4,maxChars:2200})).ndjson);
 const p=await w.render({sheetName:'Activation matrix',range:`A1:M${total}`,scale:1.4,format:'png'});await fs.writeFile(`${preview}/${kind}.png`,new Uint8Array(await p.arrayBuffer()));
 if(kind==='Inverter'){const g=await w.render({sheetName:'Instructions',range:'A1:B12',scale:1.2,format:'png'});await fs.writeFile(`${preview}/Instructions.png`,new Uint8Array(await g.arrayBuffer()));}
 const file=await SpreadsheetFile.exportXlsx(w);await file.save(`${out}/${kind}_Import_Template.xlsx`);
}
