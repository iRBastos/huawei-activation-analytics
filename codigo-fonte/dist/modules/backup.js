import {emptyInstallers,validateInstallerState} from './installers.js';
import {CATEGORIES,clone,canonical,monthValue,keyOf,freshState,installerPreferenceDefaults} from './model.js';
import {validateProduct} from './validation.js';
import {targetKey} from './targets.js';

export function validateBackup(input) {
  if(!input||![1,2].includes(input.schemaVersion)||!input.records||!input.catalog||!input.coverage||!input.targets||!Array.isArray(input.history)||!Array.isArray(input.events)||!Array.isArray(input.catalogLog)||!Array.isArray(input.coverageLog))throw new Error('This is not a compatible full application backup (schema versions 1 or 2).');
  for(const [k,p]of Object.entries(input.catalog)){if(canonical(k)!==k||p.model!==k||validateProduct(p,input.catalog).length)throw new Error(`Invalid catalogue entry: ${k}.`);}
  for(const [k,r]of Object.entries(input.records)){if(!input.catalog[r.model]||k!==keyOf(r.month,r.model)||!monthValue(r.month)||!Number.isSafeInteger(r.quantity)||r.quantity<0||!r.source?.filename||!r.source?.cell)throw new Error(`Invalid activation record: ${k}.`);}
  for(const [k,c]of Object.entries(input.coverage)){if(k!==`${c.month}|${c.category}`||!monthValue(c.month)||!CATEGORIES.includes(c.category)||!Array.isArray(c.expected)||c.expected.some(m=>input.catalog[m]?.category!==c.category))throw new Error('Invalid reporting coverage.');}
  for(const [k,t]of Object.entries(input.targets)){if(k!==targetKey(t.month,t.scope)||!monthValue(t.month)||!Number.isSafeInteger(t.value)||t.value<0||!(CATEGORIES.includes(t.scope)||input.catalog[t.scope]))throw new Error('Invalid target.');}
  for(const h of input.history){if(!h.id||!Array.isArray(h.changes)||!Array.isArray(h.coverageChanges??[])||!Array.isArray(h.catalogChanges??[]))throw new Error('Invalid import history.');}
  for(const e of input.events)if(!e.id||!/^\d{4}-\d{2}-\d{2}$/.test(e.date)||typeof e.title!=='string')throw new Error('Invalid timeline event.');
  const next=clone(input);if(input.schemaVersion===1){next.installers=emptyInstallers();}
  // Schema-2 backups created before the V2 scope ledger had no coverage field.
  if(next.installers&&next.installers.coverage===undefined)next.installers.coverage={};
  validateInstallerState(next.installers);next.schemaVersion=2;next.preferences={...freshState().preferences,...input.preferences};
  if(!monthValue(next.preferences.start)||!monthValue(next.preferences.end)||next.preferences.start>next.preferences.end)throw new Error('Invalid saved reporting period.');
  const defaults=installerPreferenceDefaults(next.preferences),saved=input.schemaVersion===1?undefined:input.installerPreferences;
  if(saved!==undefined&&(saved===null||typeof saved!=='object'||Array.isArray(saved)))throw new Error('Invalid installer reporting preferences.');
  next.installerPreferences={...defaults,...(saved??{})};
  const p=next.installerPreferences;
  if(!monthValue(p.start)||!monthValue(p.end)||p.start>p.end||
    !monthValue(p.compareStart)||!monthValue(p.compareEnd)||p.compareStart>p.compareEnd||
    !['month','quarter','year'].includes(p.aggregation)||!['year','previous','custom'].includes(p.comparison))
    throw new Error('Invalid installer reporting preferences.');
  return next;
}
