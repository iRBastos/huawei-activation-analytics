# Huawei Activation Analytics

A private, browser-based application for monthly equipment activation matrices. The initial real workspace is empty. The optional fictional demo runs in memory and never writes to the real database.

## Open directly

This edition is delivered with a ready-to-open `index.html` in the parent folder. Extract the full archive and double-click that file. It includes CSS, JSZip and a classic JavaScript bundle inline; there are no runtime module imports or network dependencies. No build, server or runtime installation is needed to use it.

Data can be transferred from the earlier edition using a full JSON backup. Browser-local saving is preferred; a clearly labelled session-only mode remains usable when a browser blocks persistence for local files. Export a full backup before closing a session-only workspace or moving the HTML file.

Developers can regenerate the parent HTML with `python3 tools/build-offline.py`; Python is needed only for this optional build. `npm test` requires Node.js 22+ but no package installation.

## Start analysing

1. Open Data → Import centre. Select Unified (inverters + battery modules + BMS in one worksheet), or use either legacy category-specific import.
2. Upload an .xlsx or comma-separated .csv matrix with exact product models in the first column and YYYYMM month headers.
3. Select the worksheet and header row. Review the preview, classification, quantities, supplied totals and previous/incoming values.
4. Explicitly classify unknown models. Battery modules require a positive capacity. The five initial LUNA definitions and 86 catalogued inverter variants are supplied. Unrecognised models require explicit category and metadata confirmation.
5. Confirm full reporting scope only when the file contains every expected model for that category and period. Otherwise declare coverage separately later.
6. Confirm the import. Matching keys replace snapshots; they never add batches. Missing incoming values retain existing records. Absent rows/months are not deleted.
7. Select a complete period for definitive comparisons. Inspect points or model rows for source cells and calculations.
8. Use Targets, dated events, presentation mode, CSV exports, and Print / PDF. Print / PDF prints the overview report with the current filters and interpretation notes.
9. Download a full backup after important work. Restore on another device to move the workspace.

## Delivered templates

- `dist/templates/Inverter_Import_Template.xlsx`
- `dist/templates/Battery_BMS_Import_Template.xlsx`

The Activation matrix worksheet is the importable sheet. The Instructions worksheet explains blank versus zero and the scope declaration. Headers are editable and extensible. Totals are formula controls. Recalculate and save the workbook after entering values so the numeric formula cache is available. Input cells are intentionally blank. CSV templates are also available from the app.

## Source structure

| Module | Responsibility |
|---|---|
| `dist/modules/model.js` | Initial catalogue, canonical matching, date utilities, normalised keys and product scope |
| `dist/modules/parser.js` | XLSX ZIP/OOXML and CSV parsing; numeric cached formula values and source coordinates |
| `dist/modules/validation.js` | Matrix validation, totals, unknown models, invalid/duplicate cells and applicability |
| `dist/modules/imports.js` | Atomic snapshot proposals, commit, history, conflict-aware undo and catalogue/coverage changes |
| `dist/modules/calculations.js` | Shared totals, completeness, capacity, comparisons, ratios, rankings, trends and findings |
| `dist/modules/targets.js` | Explicit target hierarchy and actual/target calculations |
| `dist/modules/backup.js` | Full backup validation |
| `dist/modules/domain.js` | Stable public domain API |
| `dist/modules/persistence.js` | IndexedDB transaction adapter; future shared storage can replace this boundary |
| `dist/modules/charts.js` | Accessible SVG line charts, bars and product mix |
| `dist/modules/views.js` | Six analysis areas and evidence drawers |
| `dist/modules/app.js` | Navigation, forms, local file interaction, mutation confirmation and UI state |
| `dist/modules/exports.js` | Filter-consistent CSV rows, formula injection protection, backup/download helpers |
| `dist/modules/demo.js` | Isolated, explicitly fictional demonstration data |
| `tests/` | Numerical, parser, rendering and persistence-adapter tests |

`dist/vendor/jszip.min.js` is the bundled JSZip reader; its licence is included. The ready-to-use templates were authored with Artifact Tool. `tools/build-templates.mjs` is their optional regeneration source and requires the OpenAI Artifact Tool runtime; it is not an application runtime dependency.

## Calculation contract

- Grain: one quantity per canonical product model per calendar month. Canonical matching trims and uppercases only. Distinct codes never merge based on similarity. Original source labels, filename, worksheet and cell are retained.
- Categories are separate. Inverters + modules + BMS are never labelled as systems.
- Capacity: S0 5-E0 × 5 kWh; S1 5-E1 × 5 kWh + 7-E1 × 7 kWh. Additional battery models require explicit classification and capacity.
- Completeness: an explicitly confirmed category/month scope, numeric records for all applicable expected models, no unexpected recorded models outside the declared scope, and a calendar month closed in Europe/Dublin. A model outside an explicit applicability period is not applicable, not zero. The first activation does not determine applicability.
- Available subtotals may be shown for partial periods, clearly labelled. Definitive growth requires complete current and comparison scopes. Ratio calculations require complete numerator and denominator scopes.
- Change: current − comparison. Percentage change: (current / comparison − 1) × 100. Zero baseline: absolute change plus no percentage baseline. No Infinity is displayed.
- Comparison periods: same months one year earlier, an immediately preceding interval of equal duration, or exact custom dates. Unequal durations show monthly averages and an explicit notice.
- Ratios: sums of numerators divided by sums of denominators. BMS per 100 inverters = BMS / inverters × 100. A zero denominator is not calculable. Values above 100 remain uncapped and are flagged. Ratio changes use points or ratio units, not a percentage-change shortcut.
- Family ratios use the C0 BMS for S0 and C1 BMS for S1. Numerators include only family modules explicitly compatible with that BMS; unresolved compatibility blocks affected ratios. These are activation ratios, never verified installation configurations. Overall BMS/inverter ratios are disabled under category, model or family filters.
- Rolling ratios use 3 or 12 calendar months ending at the selected end month. Moving averages require three complete months. YTD starts in January. Rolling 12-month change compares the last 12 months with the immediately preceding 12.
- Contribution: signed absolute model/month changes. Findings require complete, equal-length periods and use deterministic rules. Tiny absolute changes below five units are not elevated as model findings. No causation is inferred from dated events.
- Targets: explicit category targets override child model targets for an unfiltered category. Without that override every applicable expected model needs a target. Model/family filtering uses model targets only. Missing targets remain missing; zero targets have no attainment percentage. Gap = actual − target.
- Undo checks current values/provenance and coverage/catalogue metadata against the import's exact post-state. Overlapping later edits are listed. The user can cancel or reverse only non-conflicting changes. Dependent catalogue entries are retained when later records, coverage, targets or compatibility references require them.

## Data and privacy

Uploaded files are parsed locally. The application has no upload endpoint, telemetry, AI calls, external font requests or external chart requests. Only normalised data and source provenance are retained in IndexedDB; original workbook bytes are not retained after the import session. Filenames and source cell information are included in backups/exports.

IndexedDB is specific to the site's origin and the current browser/profile/device. It is not a shared cloud database. Clearing site data or changing origin can remove access to the local workspace. Use one editing tab at a time, and keep backups. Imports use one read/write transaction; a failed transaction leaves the previous state in place. No client-side credentials are included.

## Verification

Run `npm test`. On GitHub Actions this suite is executed together with `node tools/verify-offline.mjs` and a headless Chromium smoke test. The `dist/test-results.txt` and `../documentacao/test-results.txt` files are reproducible test-count summaries, not the complete live CI logs; always consult the latest green Actions job.

The specified independent numerical fixture is verified: 100 inverters, 30 BMS, 60 modules, 100 S0 kWh, 260 S1 kWh, 360 total kWh, 30 BMS per 100 inverters, 2 modules per family BMS, 10 S0 kWh per C0, 13 S1 kWh per C1, and 12 overall kWh per BMS.

Tests also cover actual .xlsx ZIP parsing, worksheet selection, text/numeric/reordered headers, total exclusion/reconciliation, duplicated/invalid/error/formula cells, future years, missing/zero/not-applicable states, independent datasets, repeated and corrected imports, all six rendering functions, escaping, comparisons, zero denominators, ratios above 100, exports, target hierarchy, backup round-trips, and undo conflicts. Storage tests use a deterministic IndexedDB test double to verify adapter transaction behaviour and reloading through a fresh module instance. They do not constitute real-browser persistence verification.

Excel template images were rendered and visually reviewed. Browser automation was unavailable in the build environment, so end-to-end interaction, actual browser IndexedDB reload, browser print output and responsive visual appearance were not independently verified in a browser. These limitations are disclosed rather than treated as passed tests.

## Remaining limitations

1. No real activation matrices were supplied with the attached brief. The real workspace starts empty. The optional demo is explicitly fictional, isolated in memory, and excluded from app exports.
2. This is browser-local single-user storage. There is no cross-device sync, shared database, live source refresh or multi-tab concurrency coordination. Use one editing tab and backups.
3. XLSX only supports the rectangular monthly matrix described in the brief. Encrypted workbooks, legacy .xls, macros, external-link recalculation, pivot refresh and arbitrary Excel formula evaluation are not implemented. Saved numeric formula results are required.
4. Import bounds: 30 MB compressed workbook, 120 MB declared expanded ZIP size, 10,000 ZIP entries, 100,000 worksheet rows and 2,001 columns. Report windows are limited to 100 years for responsiveness.
5. Equipment matrices have no installer field or linked equipment IDs. **Data → Installer imports** supports monthly inverter totals by company and name consolidation. The Installers workspace provides tracked-portfolio growth KPIs. None of these data identifies equipment models per installer, market share, product pairings, PV-only sites, attachment rates, sales or revenue. Commercial insights remain future work.
6. Findings are deterministic, explicitly rule-based summaries. No AI integration, forecasts, confidence intervals or causal attribution are simulated.
7. Export is CSV and browser Print / Save as PDF. Editable slide export and server-generated PDF files are not included. The optional base-100 growth index is not implemented.
8. Category changes for already recorded models are deliberately blocked. Undo affected imports before reclassifying their category. Other catalogue changes have impact previews and audit history.
9. Undo with conflicts reverses only the non-conflicting portion and marks the operation undone. Later changes are retained; there is no force-overwrite undo or redo button.
10. Browser-level acceptance checks remain unverified as described above. Current browser support for ES modules, IndexedDB, native dialog elements and Europe/Dublin time-zone formatting is required.

## Offline edition

The parent `index.html` is the file-open release. This source directory contains its modular inputs, tests and optional build script. Hosting configuration and Git history are not part of this offline copy. The hosted dashboard is unchanged.


## Release and consistency

Run `python3 tools/build-offline.py` before `python3 tools/build-release.py --test-log /path/to/passing-test-output.tap`. The release script deterministically packages the ready-to-open `index.html`, the editable `codigo-fonte/` directory, guides and Excel templates as `codigo-fonte.zip`. The development branch GitHub Actions synchronizes generated outputs; the validation workflow fails if the committed ZIP, `dist/app.offline.js`, HTML or test-count summaries are stale. It also runs the offline DOM simulator and a headless browser smoke test on fictional data. These checks do not substitute for opening the resulting app on Windows and testing a real, backed-up user workspace.

## Installer import foundation

Open **Data → Installer imports** for source import, validation and import history. Open **Installers** for analytics and account consolidation.
Blank monthly cells mean zero in this importer; repeated names are summed; the trailing
Total column is ignored. This does not change equipment blank-cell handling.
See [Installer import guide](docs/INSTALLER-IMPORT.md) for snapshot replacement, aliases,
undo, schema-2 backup compatibility and current limitations.
