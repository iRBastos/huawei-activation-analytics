// Curated inverter model names supplied for Huawei Activation Analytics.
// powerKw is the rating encoded in the model identifier, not a verified grid export limit.
// Never infer power from an unlisted/unrecognised string or silently merge variants.
export const INVERTER_MODELS = Object.freeze(`SUN2000-4.6KTL-L1
SUN2000-5KTL-L1
SUN2000-4KTL-L1
SUN2000-3KTL-L1
SUN2000-8KTL-M1
SUN2000-5KTL-M1
SUN2000-6KTL-M1
SUN2000-4.6K-LB0
SUN2000-5K-LB0
SUN2000-2KTL-L1
SUN2000-10KTL-BEM1
SUN2000-3.68KTL-L1
SUN2000-4KTL-M1
SUN2000-10KTL-M1
SUN2000-3K-LB0
SUN2000-3KTL-M1
SUN2000-4K-LB0
SUN2000-25K-MB0
SUN2000-12K-MB0
SUN2000-5K-MAP0
SUN2000-20K-MB0
SUN2000-15K-MB0
SUN2000-10K-MAP0-BE
SUN2000-8K-MAP0
SUN2000-3.68K-LB0
SUN2000-6K-MAP0
SUN2000-10K-MAP0
SUN2000-12K-MAP0
SUN2000-17K-MB0
SUN2000-12KTL-M5
SUN2000-20KTL-M5
SUN2000-15KTL-M5
SUN2000-6KTL-L1
SUN2000-25KTL-M5
SUN2000-17KTL-M5
SUN2000-10K-LC0
SUN2000-20KTL
SUN2000-6K-LB0
SUN2000-8K-LC0
SUN2000-20KTL-M2
SUN2000-17KTL-M2
SUN2000-12KTL-M2
SUN2000-17KTL
SUN2000-15KTL-M2
SUN2000L-4.6KTL
SUN2000-6KTL-M0
SUN2000-12KTL
SUN2000L-3KTL
SUN2000-20KTL-M0
SUN2000-6KTL-M1-EU(MBUS)
SUN2000L-4KTL
SUN2000L-2KTL
SUN2000-12KTL-M0
SUN2000-5KTL-M1-EU(MBUS)
SUN2000-8KTL-M1-EU(MBUS)
SUN2000-17KTL-M0
SUN2000-8KTL
SUN2000-3.68KTL
SUN2000-8KTL-M0
SUN2000-2KTL
SUN2000L-5KTL
SUN2000-3KTL-M0
SUN2000-15KTL-M0
SUN5000-12K-MAP0
SUN2000L-3.68KTL
SUN2000-8KTL-M0-EU
SUN2000-10KTL-M1-EU(MBUS)
SUN2000-4KTL-M1-EU(MBUS)
SUN2000-5KTL-L0
SUN2000-3KTL-L0
SUN2000-3KTL-M1-EU(MBUS)
SUN2000-12KTL-M0-EU
SUN2000-6KTL-M0-EU
SUN2000-4KTL-L0
SUN2000-10KTL-M0
SUN2000-12KTL-M2-EU(MBUS)
SUN2000-15KTL-M2-EU(MBUS)
SUN2000-10KTL
SUN2000-10KTL-M1(MBUS)
SUN2000-15KTL-M5(MBUS)
SUN2000-17KTL-M2-EU(MBUS)
SUN5000-25K-MB0
SUN5000-8K-MAP0`.trim().split('\n'));
const POWER_PATTERN = /^(?:SUN2000L?-|SUN5000-)(\d+(?:\.\d+)?)K(?:TL)?(?:-|$)/;
export const INVERTER_POWER_KW = Object.freeze(Object.fromEntries(INVERTER_MODELS.map(model => {
  const match = POWER_PATTERN.exec(model);
  if (!match) throw new Error(`Unknown inverter naming structure: ${model}`);
  return [model, Number(match[1])];
})));
export function inverterPowerKw(model) {
  return INVERTER_POWER_KW[String(model ?? '').trim().toUpperCase()] ?? null;
}

// Electrical grid connection inferred from the Huawei product series.
// These are product AC phases, not the phase count of backup outputs.
const SINGLE_PHASE_FAMILIES = new Set(['L0','L1','LB0','LC0']);
const THREE_PHASE_FAMILIES = new Set(['M0','M1','M2','M5','MB0','MAP0','BEM1']);
export function inverterPhase(model) {
  const name=String(model??'').trim().toUpperCase();
  if (!Object.hasOwn(INVERTER_POWER_KW,name)) return null;
  if (name.startsWith('SUN2000L-')) return 'Single-phase';
  const family=name.match(/-(L0|L1|LB0|LC0|M0|M1|M2|M5|MB0|MAP0|BEM1)(?:-|\(|$)/)?.[1];
  if (SINGLE_PHASE_FAMILIES.has(family)) return 'Single-phase';
  if (THREE_PHASE_FAMILIES.has(family)) return 'Three-phase';
  // Legacy un-suffixed SUN2000 models: 2/3/3.68 kW are single phase;
  // 8/10/12/17/20 kW belong to the three-phase commercial generation.
  if (/^SUN2000-(2|3\.68)KTL$/.test(name)) return 'Single-phase';
  if (/^SUN2000-(8|10|12|17|20)KTL$/.test(name)) return 'Three-phase';
  return null;
}

export function defaultInverterCatalog() {
  return Object.fromEntries(INVERTER_MODELS.map(model => [model, {
    model, category: 'Inverter', family: model.match(/-(L1|L0|LB0|LC0|M0|M1|M2|M5|MB0|MAP0|BEM1)(?:-|\(|$)/)?.[1] ?? '',
    capacity: null, bms: null, from: null, to: null, powerKw: INVERTER_POWER_KW[model], phase: inverterPhase(model)
  }]));
}
// Add missing standard inverter definitions without replacing customer-edited metadata.
export function mergeInverterCatalog(catalog) {
  const defaults = defaultInverterCatalog(), next = {...catalog};
  let changed = false;
  for (const [model, definition] of Object.entries(defaults)) {
    if (!next[model]) { next[model] = definition; changed = true; }
    else if (next[model].category === 'Inverter' && (next[model].powerKw !== definition.powerKw || next[model].phase !== definition.phase)) {
      next[model] = {...next[model], powerKw: definition.powerKw, phase: definition.phase}; changed = true;
    }
  }
  return changed ? next : catalog;
}
