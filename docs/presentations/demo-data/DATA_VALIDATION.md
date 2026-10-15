# Fictional dataset validation log — 15 October 2026

**Scope:** `docs/presentations/demo-data/`, branch `docs/executive-overview-deck-plan-2026-10-15`, 2023-01 through 2026-10 synthetic scenario.

## Static source-data checks completed

- 45 unique closed month columns from 202301 through 202609, contiguous and correctly ordered.
- All source cells representing quantities are non-negative integers; month headers use the app-supported YYYYMM format.
- Main equipment matrices contain 10 inverter model identifiers and 5 battery/BMS identifiers present in the V2.1 catalog.
- Equipment matrices contain a single reconciled `Grand Total` summary row; installer matrix has a name column, monthly columns, optional trailing `Total` and ignored summary row.
- 26 installer data rows represent 25 unique fictional source names, including exactly one repeated name; 2 distinct suffix pairs are designed to surface manual merge suggestions.
- **Every** closed month installer total reconciles exactly to the corresponding inverter activation total (45/45 periods); no claim of model-to-installer joins is made.
- October 2026 is isolated in 3 optional partial files with 5 inverter rows, 4 battery/BMS rows and 8 installer rows. These omit other source names, so their absence must not be interpreted as zero.
- Fictional installer example `DEMO Harbourlight Solar Ltd`: April–June 2026 = 40, July–September 2026 = 23, delta = -17 (-42.5%).
- `DEMO_METRICS.json` provides the 45+1 monthly reference results and yearly source aggregate metrics.
- Local handoff CSV copies were compared against GitHub CSV originals byte-for-byte using matching content lengths and FNV-1a fingerprints for all six source matrices.
- A separate Excel workbook was generated with 6 import-ready source worksheets plus a formula-based KPI summary. The summary has been inspected; all formula results matched aggregate values and no spreadsheet formula error strings were detected. This workbook is supplied separately, not committed as binary into this documentation branch.

## Like-for-like headline check

| Comparable period | Inverters | BMS | BMS per 100 inverters |
|---|---:|---:|---:|
| Jan–Sep 2023 | 3,771 | 1,118 | 29.6 |
| Jan–Sep 2024 | 4,603 | 2,043 | 44.4 |
| Jan–Sep 2025 | 5,434 | 3,200 | 58.9 |
| Jan–Sep 2026 | 6,267 | 4,602 | 73.4 |

**These values are intentionally fabricated.** They demonstrate the kind of multi-year trend that could be investigated in actual activation data. They are not real Huawei results, verified installations or a physical battery attachment rate.

## Checks that remain before declaring presentation-ready

1. Perform a complete manual import of each CSV in the actual Windows browser build of V2.1, selecting and confirming Full category/population coverage **only for January 2023–September 2026**.
2. Confirm the software's Installer Insights classification for decline, inactivity, reactivation and growth with the selected complete periods.
3. Import optional October CSV files last, deliberately select Partial/unknown scope, and verify October remains provisional/open.
4. Enter reference Targets manually for screenshot proof, because Targets CSV bulk import is not implemented.
5. Capture screenshots from this synthetic workspace with the **Fictional data** label visible in slides. Check that the final PPTX/PDF text matches actual screenshots.

Do not treat successful static reconciliation as evidence that actual in-browser acceptance has been performed.
