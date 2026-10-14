# V2 quality gates — installer reporting coverage

Branch: `feat/installer-analytics-v2`. Base PR: #2. Draft integration PR: #3.

## Completed: foundation and F1 coverage snapshot semantics

- Node regression suite: **154 / 154 passing** on synthetic data during latest source-branch sync, including 44 additional V2 tests against the 110-test PR #2 foundation.
- Full-snapshot import **requires explicit user confirmation**. Partial imports never assume omitted companies have zero activations.
- Full months have auditable reporting-scope metadata (filename, worksheet, timestamp, import ID). Absent accounts contribute confirmed zero only where the entire population is declared complete.
- Later complete snapshots **supersede stale earlier records** of omitted source names without deleting their audit evidence. Partial corrections can reintroduce individual aliases. Undo restores previous values and scope; conflicts are rejected.
- Old schema-2 backups with no installer scope ledger normalize to empty coverage; equipment records remain independent.
- Browser smoke now covers a full-snapshot reimport that excludes stale source rows, historical evidence, and a subsequent partial correction.
- Offline simulation, Chromium file-open smoke, deterministic HTML/JS/ZIP generation, and release parity completed in the branch synchronization workflow. Use the actual workflow run for authoritative evidence.

## Chinese summary-row import rule (14 Oct 2026)

- The final row labelled `=== 总计 ===` means Grand Total, not an installer or product.
- Equipment validation already recognizes and excludes it from product rows; it retains numeric total reconciliation.
- Installer matrix validation now shares `totalLabel` from the model module; `=== 总计 ===`, `Total`, `Grand Total` and `合计` are ignored as summary rows and never included in activations or account identities.
- Added three regression checks: CSV non-double-count/reimport, CSV duplicate names with invalid summary cells, and XLSX parsed summary row.
- 130 automated tests, offline and Chromium checks passed in the branch release synchronization; generated distribution files updated.

## F2 — shared analytics engine (14 Oct 2026)

- Reused `installerMeasure` for monthly/quarterly/yearly account series and portfolio comparisons.
- Added `installerSeries`, `installerAccountAnalysis`, `installerComparison` (exactly 2–6 distinct tracked installers), and `installerMonthlyCsv` in the existing domain module, without duplicate KPI arithmetic.
- Portfolio chart comparison points are now computed once with the analysis object's comparison period and timestamp, rather than recalculated with different `new Date()` calls in the view.
- Installer profile chart and KPI cards use the account selector. The installer monthly CSV shares the same source, keeps unknown months blank and includes reporting status.
- Unit tests reconcile profile, dashboard, six-installers selection, monthly CSV, full-scope zeros and partial/unequal-period safeguards.
- **137/137** synthetic-data tests passed, plus sync-workflow offline simulated browser, real headless Chromium, generated HTML and ZIP.
- UI work for a dedicated profile page and interactive 2–6 installer comparison remains F4. No installer/model joins have been invented.

## F3 — Data workspace and independent filters (14 Oct 2026)

- Equipment and installer reporting preferences are independent and restored with backward-compatible schema-1/schema-2 migration.
- Data → Installer imports now hosts the existing file input, worksheet/header preview, Full/Partial scope confirmation and import history/undo. The Installers workspace retains account merges, ranking, heatmap and KPIs.
- The installer navigation button leads to the Data import tab rather than duplicating its form.
- Standalone HTML Chromium smoke uploads files in Data, returns to installer analytics and checks that the equipment reporting period does not shift.
- Tests cover Data-only importer placement, preview/approvals, audit evidence, backup validity and isolation of reporting windows.
- **144 / 144 automated tests passing** and sync-workflow offline/Chromium generation successful. Acceptance on representative actual XLSX and Windows remains pending.

 - F3 release sync: 144 tests, offline Chromium, and regenerated HTML/JS/ZIP all passed in the dedicated branch workflow. Source-file commits are not merge-approved until the post-sync independent PR check is green.

## F4 — dedicated profiles and 2–6 installer comparison (14 Oct 2026)

- Installers now provides three dedicated tabs: Installer overview, Installer profile, and Compare 2–6. The existing rank-table quick modal and account-union flow still work.
- The searchable individual profile has selected-period KPI, growth, confirmed peak, first/last recorded activity, monthly/quarterly/yearly charts and evidence table; partial lifetime totals stay labeled.
- Comparison offers a searchable multi-select picker, enforces a maximum of six distinct accounts, supports removal and selecting from ranking, and shows total/previous/delta/growth/share, colored absolute charts, indexed charts with one complete positive common starting period, aligned period table and CSV export.
- All numerical views use the same coverage-aware domain selectors; no spurious zeros or growth from missing months. Indexed comparison refuses zero or incomplete baselines.
- F4 regression tests include six-account limit, all major UI sections, indexed safeguards, CSV/graph reconciliation, and an extended Chromium browser smoke covering profile and comparison.
- **154/154 Node tests passed** in the development branch generation workflow; offline simulated app, real Chromium, HTML/JS and ZIP sync passed. The final independent validation run must be green before review.
- Commercial analysis and priority insights (F5) and real-data Windows acceptance (F6) remain open.

## Remaining gates — not certified yet

- [ ] Manual user acceptance on a representative **sanitized actual installer XLSX** (not included in GitHub).
- [ ] Confirm field-level scope descriptions and whether all real monthly reports represent full installer population.
- [ ] Build deterministic commercial insights (F5). Dedicated account profile and 2–6 installer comparison UX have been implemented in F4.
- [ ] Windows file-open browser, multi-month import/reload, export, responsive layout, and full backed-up workspace acceptance (F6).
- [ ] Merge only with explicit user approval after all V2 gates.

This file is deliberately outside `codigo-fonte.zip`; the dedicated QA-only commit triggers independent PR validation **after** generated files are synchronized, avoiding a race between distribution regeneration and stale-file checks.

No customer activation data, credentials, or production spreadsheets are committed.
