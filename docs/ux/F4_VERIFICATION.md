# Huawei Activation Analytics V2.1 — F4 checkpoint

**Date:** 14 October 2026  
**Branch:** `ux/redesign-v2.1`  
**Original production SHA:** `a962fe159bd5dd8b7d20f978910b27424d02e4db`  
**Source commit:** `489cde04fcc59c35d31904652ffd765c4a649003`  
**State:** Implemented and CI verified; owner review pending.

## Visual information hierarchy

- **Overview:** headline equipment-volume/capacity metrics (four cards); rule-based findings; distinct aggregate battery attachment ratios; trend; historic detail.
- **Inverters:** volume ranking and signed contribution to change precede detailed single/three-phase and selectable-model charts. Search and Top-8/16 selection unchanged.
- **Batteries & BMS:** S0/S1 summaries followed by module and BMS mix in coordinated two-column layout, then time trend and full source tables.
- **Period Comparisons:** metric selection and current/comparison KPIs first, period totals and month-paired source evidence next, then seasonal profile, contribution bars and secondary same-quarter intelligence.
- Every control and analytical calculation remains; old historical views are reorganized, not removed.

## Performance work for large installer datasets

Source: `codigo-fonte/dist/modules/installers.js`.

Bottleneck: the import commit previously iterated every account and invoked `installerMonthly`; each invocation scanned every source alias and reconstructed the import-precedence map. At large account populations, this produced repeated O(accounts × sources) processing.

Fix: compute the source-by-account map and import precedence once **after** committing the import history, and pass them into the existing `installerMonthly` validation. All `installerMonthly` calls without the optional parameters still use original semantics. Calculated totals and overflow errors use the original loop. Full/partial reporting definitions, records, provenance and undo remain unmodified.

**Synthetic end-to-end exercise**: 1,000 installer source rows × 48 monthly columns = **48,000 synthetic cells**, with an explicit full-population snapshot:

| Step | Local observation |
|---|---:|
| Parse and validate | 435 ms |
| First full import commit | 1,442 ms |
| Build account index | 266 ms |
| Reimport same full snapshot (snapshot replacement semantics) | 6,510 ms |
| Total | 8,653 ms |

Before optimization, a prior whole-file test attempting 1,000×48 exceeded 120 seconds. Those were different runs/harness conditions, **not a controlled repeatability-grade speedup comparison**. The significant feasibility improvement is supported by the now-completed full scenario; absolute performance depends on hardware, browser and import history.

## Tests

- `npm test`: **187/187 passed** after performance optimization and market layout changes.
- Dedicated F4 tests: 4 market hierarchy assertions, 1 300-account×48-month import/reimport regression; no failures.
- Targeted importer and installer data regressions: 54/54 passed before full suite.
- `python tools/build-offline.py`: generated standalone HTML.
- `node tools/verify-offline.mjs`: PASS (module exports/view parity, old backup migration, restored data, XLSX/CSV, local storage simulation).
- Synthetic market benchmarking fixture: **91 equipment models × 48 months = 4,368 source records**. The before/after comparison preserved displayed KPI values exactly; time measurements fluctuated, so no performance-improvement claim is inferred from that single fixture. Both produced complete market views.

## Remaining gates

- GitHub Actions run https://github.com/iRBastos/huawei-activation-analytics/actions/runs/38601026894 **PASSED**: real `file://` Chromium, deterministic ZIP, offline assets and 187 tests. Generated-distribution branch head: `0ba1df1f4276232a65592265ee3dd9ad7eb610ea`.
- Independent full five-viewport visual inspection is still planned for F6.
- Keep testing much larger import histories, actual browser memory and repeated merges; no claims of universal scale/performance guarantee from one 1,000×48 scenario.
- Do not merge or release without explicit approval.