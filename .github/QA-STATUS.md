# V2 quality gates — installer reporting coverage

## Final V2.1 delivery audit — 15 October 2026 (documentation PR #6)

**Status: technically reviewed, pending owner release approval.** This is a final release handoff checkpoint, not an automatic release or merge approval.

- Source examined: current V2.1 runtime plus multilingual documentation branch `docs/commercial-intelligence-en-pt-zh-v2.1`.
- Re-ran **196/196 Node tests**, plus the offline DOM validator against the exact candidate source ZIP (0 failures).
- GitHub Actions source-ZIP sync run [38764845743](https://github.com/iRBastos/huawei-activation-analytics/actions/runs/38764845743): **SUCCESS** on automated Node tests, headless Chromium smoke, offline validator and packaging.
- Independent audit downloaded the synced GitHub Actions artifact and reproduced `codigo-fonte.zip` **byte for byte** using `build-release.py`.
- Compared original and corrected candidate executable assets: `index.html` and `codigo-fonte/dist/app.offline.js` are **byte-identical**. The application and analytical calculations have not changed.
- **Corrected a release packaging defect:** the original multilingual documentation was linked from the README but absent from the downloadable source ZIP. The distribution now ships **32 commercial documentation files** (three languages with Markdown/HTML, plus indexes).
- Added `codigo-fonte/tools/verify-documentation.py` to ensure multilingual files, links and byte parity are valid in the ZIP. The synchronized build passed this check, covering **33 required files including root README and 125 relative links**.
- Corrected stale installer-capability statements in the developer README, import guide and links from the existing HTML guides; archived V2 release gate wording remains intact with a superseding-status notice.
- **Remaining handoff items:** confirm the exact production XLSX and backup in the owner's Windows browser, visually inspect print/report output and keyboard/screen-reader accessibility to the desired acceptance level, review translated commercial terminology, and obtain explicit owner authorisation for the PR merge and eventual V2.1 distribution/release.
- Historical CI nuance: an intermediate PR validation run initially reported a stale ZIP while the auto-synchronization was pending. The later synced release artifact is deterministic and independently verified; final PR checks should be read from the latest commit after this checkpoint.

**No business customer data, competitor market share, actual revenues, real-time alerting, cloud synchronization or unsupported claims were introduced.** The delivered tool remains browser-local and monthly-import-driven.

---


## V2 release approval and main integration — 14 Oct 2026

**RELEASE INTEGRATED INTO `main` WITH THE USER'S EXPLICIT APPROVAL.** Historical "do not merge" sections below document the pre-release gates and are superseded by this decision for the approved V2 feature set.

- The user reported that the application apparently worked with the local operational data and subsequently explicitly authorised the GitHub push/merge after the independent synthetic audit. No production file was transferred to this repository or to the test environment.
- **PR #2** (installer import foundation) merged into `main`: merge commit `60efaf05da492dfa7685eec0fb1557cbca47bccd`.
- **PR #3** (complete V2) retargeted from the foundation branch to `main`, confirmed clean and merged: merge commit `aa87539ab1584a404828d01310a5b99dd46faddc`, with approved head `d121cdbb0a42760d70ebe303d084ff06eeae47a1`.
- Both PRs were merged with exact expected head SHA checks and have no pending review threads. No unexpected source changes were included.
- `main` merge commit tree **exactly matches** the validated V2 source tree (`b58a3918c69703a8519343712ead64743b4922c8`), including offline `index.html`, `app.offline.js` and ZIP.
- GitHub Actions validation succeeded after each merge: foundation `38571568622`, complete V2 `38571755552`. V2 had **174/174 Node tests**, seven private independent cross-language synthetic oracles, Chromium `file://` and mobile smoke, artifact consistency checks.
- The user's local data and precise Windows environment were not accessible to independent QA; synthetic assurance and the user's explicit functional approval are separate evidence. No guarantee of zero defects or unknown exporter compatibility is implied.
- This is a **documentation-only decision record** and does not modify application code, importer logic, persistence or generated distributions.


Branch: `feat/installer-analytics-v2`. Base PR: #2. Draft integration PR: #3.

## Completed: foundation and F1 coverage snapshot semantics

- Node regression suite: **167 / 167 passing** on synthetic data during latest source-branch sync, including 57 additional V2 tests against the 110-test PR #2 foundation.
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


## F5 — verified activity insights and actionable priorities (14 Oct 2026)

- Added an **Insights & priorities** tab with evidence-backed, rule-based commercial signals for all consolidated accounts, irrespective of a comparable cohort filter.
- Valid signals: growing/declining under complete equal-length reporting and configurable significant absolute/percentage changes; inactive after **three confirmed closed zero months plus previously recorded activity**; reactivated after three prior closed zero months and a current positive month with earlier activity; first recorded positive after confirmed zeros; newly observed activity after a zero comparison baseline; insignificant movement/no recorded activity; incomplete reporting as **Data check** rather than commercial risk.
- Priority weight + volume band + change band is deterministic, documented and capped at 100. No market-share, product-site inference, causal attribution, forecast or AI guess. High ≥60, Medium 30–59, Low <30. Unconfirmed data has no score.
- Configurable minimum volume (1/5/10/25, default 5) and change percentage (10/20/30/50, default 20) save in installer-only reporting preferences, with backward-compatible schema-1/2 backup defaults and validation.
- Account-level signal appears on the **Installer profile**, reusing its existing domain report; the full insight list supports search, filters, pagination, evidence, suggested outreach, and export of the **same derived rows** to CSV.
- Added synthetic edge-case tests for incomplete/open months, inactivity vs reactivation, zero baselines, thresholds and score bands, CSV consistency, backup compatibility, six-account legacy features and non-mutating profiles.
- GitHub release sync validated **174/174** automated tests, offline DOM and headless Chromium smoke (including the insights tab and saving a threshold) and regenerated the standalone HTML/JS and ZIP. The independent current-head check must be green before release consideration.
- Reference method: `codigo-fonte/docs/INSTALLER-INSIGHTS.md`. Final representative actual XLSX, manual Windows file-open acceptance and explicit merge authorisation remain open in F6.

## F6 — independent technical acceptance (14 Oct 2026)

**TECHNICAL GATES PASSED ON THE DEVELOPMENT RELEASE BUILD; FINAL OPERATIONAL SIGN-OFF IS NOT GIVEN.**

- Automated Node regression suite: **167/167 passing**. This includes existing **1,000 installers × 48 months** stress/import/reimport fixture, import aliases, `=== 总计 ===` total-row exclusion in XLSX/CSV, full/partial scope, stale-value supersession, reverse undo, equipment isolation, backup migration, 2–6 compare and deterministic insights.
- Tested real `file://` HTML in Linux headless Chromium. Upload, reimport, merge, unmerge, source-evidence drilldowns, period filters, reload persistence, comparison/profile and priority threshold all passed without runtime JS errors or external network requests.
- Added mobile **390 × 844** browser checks for all five areas (installer overview, profile, 2–6 comparison, insights and Data installer import). Zero document-wide horizontal overflow; all four installer tabs are a readable **2 × 2 grid**. Both desktop/mobile PNG evidence files are uploaded to GitHub Actions.
- Source distribution ZIP and standalone HTML/JS are regenerated by the development workflow and checked byte-for-byte, including ZIP CRC/source freshness. Validation is performed against the final git head in an independent post-sync run.
- Visually inspected archived mobile and desktop screenshots (synthetic data, no customer activations). Fixed clipped installer tabs; captured evidence with transient notification hidden, without changing real toast behaviour.
- Inspected two prior Library XLSX artifacts **privately**: the Installer Activation Tracker's Company Setup and Monthly Input have no populated activation inputs, and the Activation Analysis workbook is a blank equipment-analysis template. Neither represents the user's populated real SO export. No personal or confidential workbook uploaded to GitHub.
- Release test plan and explicit **no-merge** rules are included in `codigo-fonte/docs/RELEASE-ACCEPTANCE-V2.md`. Storage is browser/file-path scoped: move/copy to a new folder only with full backup/restore.

**Open blockers before user approval:**
- [ ] Validate an actual representative populated raw SO matrix (can be a sanitised faithful copy) and independently reconcile selected months/companies. Determine whether the exporter covers the full population before marking a month Full.
- [ ] Windows Chrome/Edge **manual** `index.html` open, backup restore and re-export, new-path test, 2–6 comparison and inputs. Headless Linux Chromium cannot certify the user's Windows browser/storage environment.
- [ ] Review any unresolved PR comments and approve exact tested SHA. PR #2 is the base dependency and is still unmerged.
- [ ] Explicit user merge authorization. `main` must remain untouched until then.

**Decision: TECHNICAL CANDIDATE / OPERATIONAL NO-GO (awaiting user data and Windows acceptance).**


## F6 follow-up: full installer selectors and history access (14 October 2026)

- **Reported regression reproduced:** Installer Profile silently kept only the first 100 account options; Compare 2–6 silently kept only the first 80 matching account buttons, even though searching queried the full list.
- **Root cause removed:** both selectors now expose **all** matching, alphabetically ordered accounts. Search still considers manually confirmed source aliases; the selected profile account remains in the native dropdown while searching, even if it does not match the current term. The six-selected-account cap remains enforced, but no cap applies to the number of accounts visible in the scrollable choice list.
- **Scroll experience:** selecting/removing an account in Compare 2–6 preserves the picker's scroll offset through DOM re-render, avoiding a jump to the first company when clicking far down the list.
- **Other areas audited:** Installer overview rankings and Insights & priorities use explicit 50-row pages; importer review shows the first 200 changes **with full-preview CSV export**; commercial-change bars show a named Top 10; name-match suggestions announce a Top 20; inverter chart Top 8 is an initial *selection* not a catalogue limit. These intentional, communicated scopes remain unchanged.
- **Previously hidden history fixed:** the latest ten import/union events remain visible, while **all older events and their undo controls** are available under an expandable “Show older” section. Historical data and undo rules are unchanged.
- **Regression cases:** 1,105 source accounts in both selectors, final alphabetic account without search, search preserving selected account, last-name search, all accounts disabled except the six selected when max reached, 13 import-history entries, 12 account unions, and browser flow with 140+ accounts plus scroll-position preservation.
- **Automated suite: 171 / 171 passing**, and standalone Chrome smoke passed on the development synchronisation job. No data contract, analytics, backup schema, account mappings or persistent storage were changed.
- The final **post-synchronisation, current-head independent validation** must be green before reporting this correction as certified. Operational real-XLSX and Windows acceptance remain separate release blockers; do not merge `main` without approval.

## F6 fictional cross-language audit (14 Oct 2026)

**Passed technically, with explicitly declared scope.** The user cannot share operational installer data, so an independently generated fully fictional reference dataset was built and tested privately in the test workspace.

- Python-generated independent reference data: **320 fabricated installers, 345 source rows including 25 duplicates, 45 months (Jan 2023–Sep 2026), and 139,352 activations**. Monthly checks and individual account-month checks all reconciled with the dashboard importer; the Sep 2026 total is 3,033. Summary `=== 总计 ===` and deliberately wrong trailing Total values are not counted.
- A 30-installer partial correction, identical reimport, undo, manual aliases/merges, 2–6 comparison sums, insights, full backup validation, and fully separate inverter/battery/BMS matrices were validated against values independently accumulated by Python. **7 / 7 private cross-language acceptance tests passed.**
- A distinct spreadsheet writer generated a genuine two-sheet `.xlsx` fixture, with a worksheet title, header on Excel row 4, 100 data lines, quoted/Unicode names, deliberate duplicates and a literal Chinese total row. The importer located the sheet/header, excluded the Chinese summary and correctly summed each of its 12 months.
- **One additional real defect was discovered and fixed:** when an Excel/other spreadsheet writer accidentally treats `=== 总计 ===` as a formula, the cell may be cached as `#NAME?`. Previously, an error/formula in the **installer-name column** could be counted as a false company. The validator now rejects error/formula name cells before creating any source account. Existing literal Chinese totals continue to be ignored.
- CI now contains an independent arithmetic regression fixture for **240 imaginary accounts × 33 months**, error/formula input cells, and product-vs-installer isolation. The synced development suite is **174 / 174 passing**; generated HTML/JS/ZIP and browser smoke have been rebuilt. The post-sync exact-head check must pass independently before declaring the release verified.
- The **entirely fictional QA package** created for the user contains CSV imports, the XLSX matrix, independent per-company/month oracle CSV/JSON, a corrections CSV, two equipment datasets and a ready-to-restore **8.9 MB fictional full-workspace JSON backup** (320 installer accounts + 162 model/month equipment records).
- No customer data were used or published. The private test container's local Chromium policy blocks `file://`; the separate GitHub Actions Linux Chromium test verifies opening the delivered file directly. Windows user acceptance and unknown actual SO exporter variations cannot be certified without the user's own test. IndexedDB should be preferred over size-limited LocalStorage fallback.

**Recommendation:** synthetically validated release candidate; keep PR #3 Draft and `main` unchanged until explicit user sign-off. Do not promise absolute zero defects.

## Remaining gates — not certified yet

- [ ] Manual user acceptance on a representative **sanitized actual installer XLSX** (not included in GitHub).
- [ ] Confirm field-level scope descriptions and whether all real monthly reports represent full installer population.
- [x] Deterministic commercial insights (F5): implemented and tested with auditable rules, priority bands, filters, saved thresholds, profile integration and CSV.
- [ ] Windows file-open browser, multi-month import/reload, export, responsive layout, and full backed-up workspace acceptance (F6).
- [ ] Merge only with explicit user approval after all V2 gates.

This file is deliberately outside `codigo-fonte.zip`; the dedicated QA-only commit triggers independent PR validation **after** generated files are synchronized, avoiding a race between distribution regeneration and stale-file checks.

No customer activation data, credentials, or production spreadsheets are committed.
