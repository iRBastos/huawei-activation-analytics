# V3 — G0 Feature Audit, Baseline and Evidence

**Date:** 16 October 2026  
**Status:** COMPLETE (scope and capabilities verified).  
**Presentation purpose:** a self-contained product demonstration for first-time readers, not a software manual.  
**Version pinned:** official Huawei Activation Analytics **v2.1.0**.

## Source integrity

| Input | Evidence |
| --- | --- |
| Official application ZIP | `Huawei_Activation_Analytics_V2.1.0_Release_Candidate.zip` |
| Confirmed release ZIP SHA-256 | `e4d42ec53b6b437fc0e05b52200670bbcea5b6bc75b9ff794e5c14f824eeae64` |
| Main executable | root `index.html`, 393,371 bytes, self-contained offline HTML |
| Synthetic demonstration period | January 2023–September 2026; **45 completed months** |
| Synthetic equipment source | 10 measured inverter models, 3 module models, 2 BMS models; 675 source equipment records |
| Synthetic installer population | 23 consolidated tracked accounts; activity reported monthly |
| Synthetic targets | 9 manually defined monthly category targets (July–September 2026) |
| Original screenshot archive | 10 S screenshots and 3 R reserves retained unchanged |
| Original V2 presentation | PPTX, eight-page PDF and contact-sheet retained unchanged |
| Browser capture | Original app interface/domain, isolated memory-only capture adapter; no distributed code change |

**A subtle but important distinction:** The application contains a larger default product **catalogue** (e.g. 86 selectable in-scope inverter models) than the number of inverter models with measured activations in this fictional source (10). A UI showing the model picker is not proof that all listed models had activations.

## Verified functionality matrix and presentation coverage

| Product area | Verified capability (source and runtime) | V3 slide |
| --- | --- | --- |
| Data → Equipment imports | XLSX/CSV previews, model classification, quantity/total validation, manual commit and audit | 02 |
| Data → Installer imports | XLSX/CSV monthly matrix, repeat-row sum, full/partial population, explicit confirm | 02 |
| Overview | Equipment KPIs and trends, aggregation, period/product scope | 03 |
| Inverters | Model volume ranking, signed contribution to change, model picker, per-model trends, phase mix | 04 |
| Batteries & BMS | S0/S1, recorded modules, activated capacity kWh, compatible BMS activation ratios, module/BMS mix and quarterly intelligence | 05 |
| Comparisons | Comparison periods, current vs previous metric/category/coverage, monthly evidence | 06 |
| Targets | Manual monthly category/model target editor, actual/target/attainment/gap | 07 |
| Installer overview | Selected-period activations, active installers, ranking, retained base, Top 5 concentration, contributions, monthly heatmap | 08 |
| Installer profile | Search complete account list/aliases, monthly/quarterly/annual histories, ranking, source evidence | 09 |
| Compare 2–6 | Named partner selection, absolute values, base-100 where eligible | 10 |
| Insights & priorities | Decline, growth, inactivity, reactivation, first activity, zero baseline, coverage checks; configurable significance/priority, source evidence | 11 |
| Coverage / Account management | Source completeness, explicit known zero vs unknown, suggested manual identity unions, history | 12 |
| Commercial investigation | Evidence → contact → qualified support → next-month check; **process outside app** | 13 |
| CSV exports + Backup & guide | Export insights/installer reports, downloaded full workspace JSON, restore | 14 |
| Startup + routine | Root HTML, built-in demo, manual recurring import/check/back up | 15 |

**Code/source cross-check:** `codigo-fonte/dist/modules/views.js`, `installer-experiences.js`, `installer-analytics-views.js`, `app.js`, `exports.js`, official `docs/commercial/en/USER_GUIDE.md` and `PROJECT_OVERVIEW.md`. This matrix describes implemented functionality, not proposed roadmap items.

## Validated sample evidence (fictional, not Huawei performance claims)

| Evidence | Period / value | Implication allowed |
| --- | --- | --- |
| Recorded inverter activations | Jan–Sep 2026: 6,267 | Aggregate recorded inverter trend, not sales |
| Recorded BMS activations | Jan–Sep 2026: 4,602 | Aggregate BMS trend, not verified pairing |
| Activated module capacity | Jan–Sep 2026: 56,355 kWh | Sum of recorded module count × catalogue kWh |
| Leading measured inverter | SUN2000-5K-LB0: 1,533 in Jan–Sep 2026 | Top model within recorded fictional source |
| Family capacity in original UI | S0: 12,010 kWh; S1: 44,345 kWh | Family-specific recorded capacity, not site configuration |
| Installer cohort | Jul–Sep 2026: 2,046 activations, 22 active tracked accounts | Recorded tracked portfolio only |
| Top 5 installer concentration | Jul–Sep 2026: 34.2% | Share of tracked activations, not Irish national share |
| Manually set inverter target | Jul–Sep 2026: 2,046 actual vs 2,180 target = 93.9% | One explicitly fictional commercial target |
| Declining installer | DEMO Harbourlight Solar Ltd: 40 → 23, −42.5%, Apr–Jun vs Jul–Sep 2026 | Reason to investigate, not proof of churn |
| Multiple rule-based categories | Two Declining, one Growing, one Inactive, one Reactivated in the selected sample | Genuine output of evidence-backed classifier |

## Limits that the slides must preserve

- Equipment model data and installer activity data **do not join** to explain named accounts' model choices.
- One activation record does **not** equal a confirmed sale, installed household or market-share point.
- BMS-to-inverter values are **aggregate activation ratios**, not confirmed device pairing.
- The application is **offline**, **manual-import**, **not real-time**, and does **not** send automatic alerts, sync CRM, email partners or infer switching to a competitor.
- Incomplete / omitted source months are **unknown**, not necessarily zero; inactive classification requires three confirmed closed zero months plus prior activity.
- A dashboard priority score is **deterministic**, not a churn probability.
- The built-in **Explore fictional demo** has its own sample data and disables exports. All V3 export screenshots and tests use an isolated **real-mode populated with entirely synthetic data**.
- Source ZIP is unchanged. Capture-only injection replaces browser storage with isolated memory as required by the restricted browser environment; this is not a Windows persistence acceptance test.

## G0 completion checks

- [x] Official ZIP checksum confirmed.
- [x] Main navigation and real implementation inspected.
- [x] 15-slide capability mapping grounded.
- [x] Synthetic dataset and reports inventory checked.
- [x] V1/V2 assets preserved.
- [x] No application edits and no merges to main.