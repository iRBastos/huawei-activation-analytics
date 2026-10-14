# Huawei Activation Analytics V2 — Release Acceptance

**State: CONDITIONAL / DO NOT MERGE.** Automated CI is not a substitute for representative real data or manual Windows acceptance. The V2 PR is based on the open installer-import foundation PR, not directly on \`main\`.

## Decision rule

A release is **GO** only if all of these are true:

- [ ] Latest V2 **HEAD** has passing Node tests, simulated offline app, real Chromium file-open browser test, 390px viewport check, and reproducible HTML/JavaScript/ZIP freshness checks.
- [ ] An **actual SO installer export** (or a sanitised faithful copy, never committed publicly) is successfully imported with independently reconciled monthly totals, aliases and reporting scope.
- [ ] Existing private workspace backup has been saved, restored into the release candidate and checked for **equipment + installer** data and preferences.
- [ ] User has opened the shipped offline \`index.html\` on **Windows** in Chrome/Edge, completed the acceptance workflow below, and confirmed readability at normal and narrow screen widths.
- [ ] All critical defects are closed and current release evidence is linked from the PR.
- [ ] User explicitly approves the intended PR merges in order. Never merge into \`main\` from an untested artefact.

## Evidence already automated

The GitHub Actions pipeline validates the current source branch with the test suite, offline simulated DOM, and a real standalone \`file://\` session in headless Chromium. It guards the generated HTML, bundled JavaScript and source ZIP against stale distributions; the ZIP contents are checked against source file bytes and ZIP integrity.

Synthetic fixtures cover duplicate installer row aggregation, \`=== 总计 ===\` exclusion in CSV/XLSX, blank=0 versus absent=unknown, full versus partial snapshots, superseded historical values, corrections, undo/unmerge, migration of old backups, equipment isolation, 2–6 account comparisons, invalid indexed baselines, insight evidence, CSV safety and 1,000 installers × 48 months. Browser smoke tests import, export-eligible state, merge, reload persistence, undo, profile, comparison, insights, mobile viewport and absence of external network requests.

The headless mobile viewport takes a screenshot at **390×844** and verifies that the overall page does not overflow horizontally on the Overview, Profile, Compare, Insights and Data installer-import areas. Each of the four installer tabs must be visibly accessible in a **two-column grid** at this width. Tables may still scroll **within** their own containers. Screenshots are attached to the GitHub Actions run; they are not user data.

**No actual installer activation workbook was uploaded to GitHub or used in CI.**

## Actual files reviewed without exposing values

Two prior workbook artefacts were available only inside the private ChatGPT working environment:

- \`Installer_Activation_Tracker_2023_2026.xlsx\`: an eight-sheet tracker whose Company Setup and Monthly Input data rows contain formulas but **no populated raw input values**. Its Monthly Input layout also includes Company ID, Region, Tier, Status, Account Owner and named month columns; this is a management tracker, **not the raw SO monthly export matrix**. Do not present it as proof of import compatibility with the operational export.
- \`Activation_Analysis_2023_2026_CORRIGIDA.xlsx\`: a multi-sheet equipment analysis template with **unfilled activation input cells**. It is not a populated equipment/model export.

This inspection is structural and read-only. These files must not be copied into source control, attached to PRs or published.

**Blocker:** obtain a **real representative SO installer XLSX or CSV export**, or a sanitized version preserving rows, dates, repeated names, the Chinese grand-total row, formula/cell-type behavior, nontrivial populated values and missing months, to establish importer acceptance.

## Windows acceptance script (user-run, no development skills needed)

1. **Back up first.** From the existing running workspace, use the application's full **Backup** function and keep the JSON file in a safe location. Record the number of equipment records, installer accounts and a few verified month totals independently. Do not delete or overwrite your current HTML or backup.
2. **Unpack the candidate into a new folder.** Open its \`index.html\` directly in Windows Chrome or Edge. It should work without running a server, installing Node/Python, or connecting to the internet.
3. **Important storage limitation:** the offline workspace uses browser-local storage identified partly by the \`file://\` path. Moving/renaming the HTML or opening it from a new folder may show an **empty workspace**. That is not evidence that the data was deleted. Always **export/import a full backup** when moving to a new installation or folder.
4. **Restore a copy of the backup** into the test workspace. Compare equipment totals, installer accounts, name unions, reporting scope/history and date filters to the source. Equipment charts must remain independent of installer filters.
5. Open **Data → Installer imports**. Import a **sanitised representative, populated raw SO file**. Review selected sheet, header row and installer-name column; inspect preview and every validation warning. Confirm that \`=== 总计 ===\` does not create an installer or inflate counts, that repeated names sum, and that the trailing Total column is ignored.
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
