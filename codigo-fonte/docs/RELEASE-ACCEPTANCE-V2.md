# Huawei Activation Analytics V2 — Release Acceptance

> **Historical release-gate record (14 October 2026).** The `CONDITIONAL / DO NOT MERGE` decision below was written **before** the owner approved V2.0.0 integration into `main`; it must not be read as the current release status. See `.github/QA-STATUS.md` for the recorded V2 approval and `docs/ux/F7_VERIFICATION.md` for V2.1 automated review evidence. The original gates and limitations are retained for audit history.

**State: CONDITIONAL / DO NOT MERGE.** Automated CI is not a substitute for representative real data or manual Windows acceptance. The V2 PR is based on the open installer-import foundation PR, not directly on `main`.

## Decision rule

A release is **GO** only if all of these are true:

- [ ] Latest V2 **HEAD** has passing Node tests, simulated offline app, real Chromium file-open browser test, 390px viewport check, and reproducible HTML/JavaScript/ZIP freshness checks.
- [ ] An **actual SO installer export** (or a sanitised faithful copy, never committed publicly) is successfully imported with independently reconciled monthly totals, aliases and reporting scope.
- [ ] Existing private workspace backup has been saved, restored into the release candidate and checked for **equipment + installer** data and preferences.
- [ ] User has opened the shipped offline `index.html` on **Windows** in Chrome/Edge, completed the acceptance workflow below, and confirmed readability at normal and narrow screen widths.
- [ ] All critical defects are closed and current release evidence is linked from the PR.
- [ ] User explicitly approves the intended PR merges in order. Never merge into `main` from an untested artefact.

## Evidence already automated

The GitHub Actions pipeline validates the current source branch with the test suite, offline simulated DOM, and a real standalone `file://` session in headless Chromium. It guards the generated HTML, bundled JavaScript and source ZIP against stale distributions; the ZIP contents are checked against source file bytes and ZIP integrity.

Synthetic fixtures cover duplicate installer row aggregation, `=== 总计 ===` exclusion in CSV/XLSX, blank=0 versus absent=unknown, full versus partial snapshots, superseded historical values, corrections, undo/unmerge, migration of old backups, equipment isolation, 2–6 account comparisons, invalid indexed baselines, insight evidence, CSV safety and 1,000 installers × 48 months. Browser smoke tests import, export-eligible state, merge, reload persistence, undo, profile, comparison, insights, mobile viewport and absence of external network requests.

The headless mobile viewport takes a screenshot at **390×844** and verifies that the overall page does not overflow horizontally on the Overview, Profile, Compare, Insights and Data installer-import areas. Each of the four installer tabs must be visibly accessible in a **two-column grid** at this width. Tables may still scroll **within** their own containers. Screenshots are attached to the GitHub Actions run; they are not user data.

**No actual installer activation workbook was uploaded to GitHub or used in CI.**

## Fully synthetic independent audit — 14 October 2026

A new independent test campaign uses **entirely fictional names and generated numbers**, not any connected customer's activation records:

- **Cross-language oracle:** a separate Python generator created 320 unique imaginary installers, 345 actual source rows (25 repeated names), 45 consecutive months (January 2023–September 2026), **139,352** generated inverter activations, a deliberately misleading Total column and a Chinese `=== 总计 ===` summary. It also created a 30-company partial correction file.
- The local Node harness independently validated the actual importer against the Python-generated JSON and Excel-style CSV totals for **every company and every month**; all 45 portfolio totals, the overall volume, the partial correction overwrite, reimport idempotence, undo, name unions, 2–6 comparisons, insights, backup round-trips and equipment/installer isolation passed.
- A real multi-worksheet `.xlsx` created with a separate workbook writer (100 data rows, a non-data introduction worksheet, title/header offset, blanks, repeated names and a literal Chinese summary row) parsed and reconciled all twelve months against the raw cell sums.
- A **newly discovered validator flaw** was fixed: Excel may interpret `=== 总计 ===` or another installer-name string as a formula if incorrectly encoded. Such a workbook can contain a formula-error name cell (`#NAME?`); the importer previously accepted that as a company. The importer now **rejects Excel error/formula cells in the installer-name column** rather than corrupting counts. Formula-free textual `=== 总计 ===` still remains excluded. Added synthetic regression tests against error and cached-name formula cells.
- A **portable CI reference fixture** independently generates and checks 240 fictional installers × 33 months, repeated rows, real total exclusion and 6-account comparisons. It checks **each individual company-month** and every monthly total against separately accumulated expected quantities, plus backups, idempotent reimport and equipment isolation.
- The QA package additionally contains real importable CSVs/XLSX, a self-contained full **fictional workspace backup** with 320 installers, 162 equipment records and complete synthetic importer declarations, and the explicit Python reference ledger. This package is user-facing and **not committed to a public repository**.
- The 320 × 45 example yields approximately 8.9 MB of saved JSON once equipment and import histories are included. IndexedDB is the preferred browser storage. **LocalStorage fallback may hit quota;** storage failure must not be treated as a successful save, and a full offline backup remains recommended.

**Interpretation:** Cross-language reconciliation provides strong independent assurance for the supported export format, but is not proof of compatibility with every unshared proprietary SO variant. The local ChatGPT Chromium installation denies `file://` navigation by a platform policy; the project's separate GitHub Actions real headless Chromium runner validates the shipped offline `file://` HTML instead. Neither establishes manual Windows acceptance on the user's private workspace.

## Actual files reviewed without exposing values

Two prior workbook artefacts were available only inside the private ChatGPT working environment:

- `Installer_Activation_Tracker_2023_2026.xlsx`: an eight-sheet tracker whose Company Setup and Monthly Input data rows contain formulas but **no populated raw input values**. Its Monthly Input layout also includes Company ID, Region, Tier, Status, Account Owner and named month columns; this is a management tracker, **not the raw SO monthly export matrix**. Do not present it as proof of import compatibility with the operational export.
- `Activation_Analysis_2023_2026_CORRIGIDA.xlsx`: a multi-sheet equipment analysis template with **unfilled activation input cells**. It is not a populated equipment/model export.

This inspection is structural and read-only. These files must not be copied into source control, attached to PRs or published.

**Blocker:** obtain a **real representative SO installer XLSX or CSV export**, or a sanitized version preserving rows, dates, repeated names, the Chinese grand-total row, formula/cell-type behavior, nontrivial populated values and missing months, to establish importer acceptance.

## Windows acceptance script (user-run, no development skills needed)

1. **Back up first.** From the existing running workspace, use the application's full **Backup** function and keep the JSON file in a safe location. Record the number of equipment records, installer accounts and a few verified month totals independently. Do not delete or overwrite your current HTML or backup.
2. **Unpack the candidate into a new folder.** Open its `index.html` directly in Windows Chrome or Edge. It should work without running a server, installing Node/Python, or connecting to the internet.
3. **Important storage limitation:** the offline workspace uses browser-local storage identified partly by the `file://` path. Moving/renaming the HTML or opening it from a new folder may show an **empty workspace**. That is not evidence that the data was deleted. Always **export/import a full backup** when moving to a new installation or folder.
4. **Restore a copy of the backup** into the test workspace. Compare equipment totals, installer accounts, name unions, reporting scope/history and date filters to the source. Equipment charts must remain independent of installer filters.
5. Open **Data → Installer imports**. Import a **sanitised representative, populated raw SO file**. Review selected sheet, header row and installer-name column; inspect preview and every validation warning. Confirm that `=== 总计 ===` does not create an installer or inflate counts, that repeated names sum, and that the trailing Total column is ignored.
6. Choose **Partial** unless you can attest that the chosen file covers the **entire tracked installer population** in every selected month. Mark **Full** only after checking the exporter definition; otherwise missing installers must remain unknown rather than zero.
7. Cross-check five installer/month pairs **against Excel manually**, including a duplicate source name, a zero/blank, an absent month and one merged account. Cross-check at least one total against the raw report, **excluding** its total row.
8. Reimport one unchanged file and confirm no activation count increases. Import a revised file, verify snapshot replacement, then undo the revision and confirm the initial totals return without disturbing equipment data.
9. In **Installers → Overview**, verify KPIs, ranking, heatmap, comparisons and evidence dialog. Open **Installer Profile** and check historical activity, confirmed peak, monthly/quarterly/yearly charts and source evidence. Export the monthly CSV and inspect at least one row in Excel.
10. In **Compare 2–6**, choose two and then six accounts. Check that selection beyond six is disallowed, individual and combined activation totals reconcile, and indexed growth appears **only** when every selected account has a complete, nonzero common first period. Confirm CSV matches the table.
11. In **Insights & priorities**, compare the flags and evidence with imported months; check confirmed 3-month inactivity/reactivation rules and ensure uncertain histories are **Data check**. Change a threshold, reload, verify it persisted, export insights and inspect CSV.
12. Test normal screen width and a narrow window (about 390 px). Verify that all four installer tabs remain visible, controls are reachable, internal tables scroll, page width remains bounded and no unreadable clipping occurs.
13. Export a fresh full backup from the test workspace, close/reopen the candidate, then restore it. Ensure counts, history, aliases and installer/equipment preferences are preserved. Keep the original backup as rollback material.
14. Only after all steps pass, record **Windows version, browser/version, tested file date range, backup restore result, reconciled totals and the reviewed GitHub commit** for final approval.

## Explicit release blockers and exclusions

- **Real populated SO export is not available in the audited files**: automated XLSX/CSV synthetic tests do not certify the unknown real exporter format.
- **Windows user acceptance is not recorded**: GitHub's Linux Chromium test cannot guarantee every local Windows/Edge behavior.
- **No confidential source data goes into the public repository**. For external review, redact company names and quantities while preserving spreadsheet schema and edge cases.
- The app is a **local analytic tool**. It does not establish a battery-to-inverter or model-to-installer join, installer revenue, Irish-wide market share or causal reasons for changes.
- The open F2 foundation PR must be integrated appropriately **before** merging the V2 dependent PR; do not merge either without user sign-off.

## Acceptance record — deliberately unsigned

| Gate | Status | Evidence / next owner |
|---|---|---|
| Source tests and reproducible offline bundle | Recheck current HEAD | GitHub Actions |
| Headless Chromium desktop and 390px mobile | Recheck current HEAD | GitHub Actions screenshots |
| Existing populated installer matrix | **BLOCKED** | Supply private representative raw SO export |
| Live backup round-trip | **BLOCKED** | Requires user's private working backup |
| Windows Chrome/Edge end-to-end | **BLOCKED** | User acceptance |
| PR comments and final reviewed SHA | Pending | GitHub PR review |
| Approval to merge | **NOT GIVEN** | Explicit user decision |

A successful CI run is necessary but not sufficient. **Never change this record to GO automatically.**
