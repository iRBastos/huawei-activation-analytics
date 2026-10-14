# V2 quality gates — installer reporting coverage

Branch: `feat/installer-analytics-v2`. Base PR: #2. Draft integration PR: #3.

## Completed: foundation and F1 coverage snapshot semantics

- Node regression suite: **137 / 137 passing** on synthetic data during latest source-branch sync, including 27 additional V2 tests against the 110-test PR #2 foundation.
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

## Remaining gates — not certified yet

- [ ] Manual user acceptance on a representative **sanitized actual installer XLSX** (not included in GitHub).
- [ ] Confirm field-level scope descriptions and whether all real monthly reports represent full installer population.
- [ ] Separate equipment and installer filter preferences and centralize imports (F3); build full profile/comparison UX (F4) and commercial rules (F5).
- [ ] Windows file-open browser, multi-month import/reload, export, responsive layout, and full backed-up workspace acceptance (F6).
- [ ] Merge only with explicit user approval after all V2 gates.

This file is deliberately outside `codigo-fonte.zip`; the dedicated QA-only commit triggers independent PR validation **after** generated files are synchronized, avoiding a race between distribution regeneration and stale-file checks.

No customer activation data, credentials, or production spreadsheets are committed.
