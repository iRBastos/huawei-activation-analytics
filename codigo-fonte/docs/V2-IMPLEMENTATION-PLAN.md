# Huawei Activation Analytics V2 — implementation plan

Status: **in progress — foundation / contract tests**  
Base: `feat/installer-import-foundation` at `95ffc82abe68b8ab7f02684f1b1b314f5b88e77d`  
Working branch: `feat/installer-analytics-v2`  
Release authority: never merge to `main` without explicit user approval.

## Outcome

Evolve the existing offline analytics app into an Ireland-focused installer intelligence tool, **without replacing the JavaScript architecture, IndexedDB, browser-local privacy model, or equipment analytics**.

## Design invariants (non-negotiable)

1. **Independent datasets.** Equipment activation records (per model/month) and installer records (inverter totals per account/month) must never be joined by assumed relationships. Never claim site-level attachment, installer-model affinity, Irish market share, revenue or sales without source data.
2. **Source-level lineage.** Preserve imported company name, worksheet, filename, original cell and quantity. Every account union adds values from constituent source records; it does not overwrite them or manufacture a device mapping.
3. **Missing is not zero.** An empty cell *inside an imported monthly column* means confirmed zero. A month not covered by an import remains unknown unless an explicitly approved complete reporting scope supports zero inference.
4. **Idempotent source-month snapshots.** Reimport replaces the same source+month value; no batch accumulation. Omitted rows/months do not delete prior data. A union sums distinct source records.
5. **Coverage-aware analytics.** Growth, retention, shares, HHI and comparable-cohort totals require an auditable eligible denominator. Never display mathematical growth % from zero. Do not conflate volume among tracked Huawei activations with total Irish market share.
6. **Backward compatibility.** Old schema-1 backups migrate; current schema-2 backups round-trip unchanged. Before changing persisted shape, write migration and rollback tests. Preserve browser file-location behavior and full JSON backups.
7. **Single calculation core.** Overview, table, installer detail, 2–6 installer comparison, chart labels and CSV must use the same exported domain selectors. No divergent computations in UI templates.
8. **No silent provenance loss.** Undo must reject overlapping later edits rather than destroy subsequent corrections. Imported data never becomes a tracked GitHub file or fixture.
9. **Build from sources.** Edit modules / tests, regenerate `index.html`, `codigo-fonte/dist/app.offline.js`, `codigo-fonte.zip`, test summaries, then check byte-for-byte freshness in CI.

## Dependency-ordered work packages

| ID | Deliverable | Depends on | Gate |
|---|---|---|---|
| F0 | Baseline, branch, tracked contract, regression fixtures, CI auto-generation on V2 | PR #2 at pinned SHA | Green npm tests, browser smoke, release parity |
| F1 | Report coverage and identity model: full/partial snapshot, account-level comparability, explicit unknown/zero, source applicability | F0 | Contract tests, edge cases for merged aliases, all previous tests |
| F2 | Reusable installer selectors with shared period/coverage definitions and memoization where useful | F1 | Independent arithmetic fixtures reconcile all views and CSV |
| F3 | Centralize import UX in Data; separate installer/equipment filter state; migration for optional preferences | F2 | Both imports, filters, backup and navigation survive reload |
| F4 | Installer overview + full-profile route + 2–6 comparative chart/table using F2 | F3 | Chromium E2E and accessible keyboard operation |
| F5 | Deterministic commercial statuses and evidence-backed next-action ranking; threshold configuration; export | F4 | No causal claims, no false activity labels on partial months |
| F6 | QA on representative sanitized real-data fixture, Windows file-open acceptance, documentation, reproducible ZIP and review | F0–F5 | CI current-head green, manual checks signed off, explicit merge approval |

**Do not** implement F4 before F1/F2 have stable calculations. Keep commits small and do not merge half-tested data-schema changes. Re-run equipment and installer regression suites on every work package.

## Decisions for F1

- Alias labels are **source identities**, not independent installer accounts. After union, different labels may add distinct rows within the same reported month. Historical absence of one label does not automatically prove the consolidated company failed to report.
- Explicit **full/partial monthly reporting scope** must be recorded at import time, separately from cell presence. An incoming file may be partial, and some month columns may represent a complete tracked population. Do not infer universal full coverage from the absence of a source.
- Define `observed-zero`, `observed-positive`, `unknown`, `not-in-declared-scope`, and `open-month`. A partial current period may expose an accurately labeled subtotal, but not a definitive aggregate growth rate.
- Determine the numerator and denominator for the **same comparable installers** cohort before showing growth or contribution. When an account only has source aliases in one of the periods, coverage must be decided from the declared source scope rather than from number of aliases ever seen.
- Active installer = one distinct consolidated account with total > 0 in a fully interpretable interval. Three-month inactivity is confirmed only when three months of reporting coverage are confirmed.
- Treat company name similarities as **suggestions** only. Confirm consolidation manually; original names always retained.

## Pull request and release discipline

- `feat/installer-analytics-v2` is branched from current unmerged PR #2. Open a **draft PR against `feat/installer-import-foundation`**, not `main`, to show only V2 changes. Keep PR #2 independently reviewable.
- CI must run on latest head and perform Node tests, offline module simulator, Chromium file-open smoke and deterministic distribution regeneration.
- The sync workflow may commit generated outputs back to the V2 branch. Never authorize a merge based on a previous SHA's checks.
- Verify `main` SHA before and after this preparation; no release deployment or visibility change is in scope.
- Preserve a full user backup before applying schema changes or testing with real business data. Use **sanitized** fixtures in tests and PRs.

## Quality checklist

- Duplicate company rows **sum** within a file; reimport **replaces** snapshot.
- Confirmed blank **0** vs absent month **unknown**; unmatched Total ignored.
- Suggested similar names are reviewed, merged aliases add and unmerge preserves later value corrections.
- 2–6 company comparison respects period completeness, zero baselines, consistent cohort, consistent chart and CSV values.
- Current and older backup restore in same location; an unsupported change leaves previous state untouched.
- Regression tests protect equipment KPIs, model selectors, BMS/battery ratios, chart detail and offline standalone HTML.
- Responsive layout, date-zone handling (Europe/Dublin), no external network requests, and safe CSV/HTML escaping.
- Production XLSX acceptance is recorded **separately** from synthetic CI results.

## Explicit exclusions

No CRM integration, cloud database, browser sync, live source refresh, generative AI, revenue/market-share estimates or inverter-to-installer inference in V2.

## F2 shared selector boundary

- Reuse `installerMeasure` for all figures; `installerSeries` groups months with one coverage policy.
- `installerAnalysis` now returns comparison-period series and full account index, preventing the view from recalculating chart numbers independently.
- `installerAccountAnalysis` provides profile KPIs and monthly points from that same index.
- `installerComparison` supports exactly 2–6 distinct tracked accounts in requested order, with unit totals, per-account trends, equal-period checks and completeness-aware shares; UI selection will be part of F4.
- `installerMonthlyCsv` uses the same per-account measures as profile and heatmap, includes reported-total status, and leaves missing periods blank rather than inventing zero.
- No new storage schema, framework, or separate calculation module introduced.

## F3 Data & filters (implemented on the V2 branch)

- Kept the existing import/preview components and moved them from the Installers analytics page to Data → Installer imports, including import audit/undo. Account union history remains in Installers.
- Added a navigation action from Installers back to the Data installer importer.
- Equipment and installer date, comparison and aggregation filters now persist separately (`preferences` and `installerPreferences`). Importing an installer matrix changes only the installer reporting window.
- Old schema-1 and schema-2 backups without installer preferences inherit the saved reporting period on restore, without modifying existing equipment filters; no schema version bump or new data storage technology.
- Added tests for Data-only import controls, preview/approval, audit history, backup migration and independent filter behavior; Chromium file-open smoke covers upload through Data and checks that equipment dates remain unchanged.

## F4 profile and multi-account comparison — implemented

- Installers now has **Installer overview**, **Installer profile**, and **Compare 2–6** tabs. Existing ranking source-evidence modal and account-union controls are preserved.
- The profile searches imported/consolidated account names, shows independent KPIs, monthly/quarterly/yearly historical charts, first/last observed activation, confirmed monthly peak, coverage and clickable source evidence.
- The comparison supports 2–6 distinct accounts from search, multi-selection, removal, direct navigation from ranking, absolute-volume lines, indexed trends (all companies must have a complete, positive first plotted bucket), one aligned chart data table and a matching CSV export.
- Indexed comparison never invents percentages from zero baselines or incomplete months. Shared F2 selectors power all profiles and comparisons.
- UI and arithmetic regression tests plus the existing real Chromium file-open smoke must pass before calling F4 complete.
- Future F5 builds deterministic commercial activity findings from eligible periods; no causal, market-share, product/install-site or revenue claims follow from these graphs.

## F5 deterministic commercial intelligence — implemented

- Installer workspace has a fourth tab, **Insights & priorities**, and the same single-account signal appears on Installer profile without a second portfolio scan.
- The engine classifies each consolidated account from confirmed reporting only: inactive after three consecutive closed zero months plus historical positive activity; reactivated after three closed zero months plus a new positive month and earlier activity; first recorded activity after confirmed zero months; meaningful growing/declining periods; activity after a confirmed zero comparison base; no significant movement; no activity; and reporting-coverage check.
- Configurable minimum absolute volume (1/5/10/25) and percentage change (10/20/30/50) are stored under installer-only preferences, validated on backup restore and defaulted for older schema-1/schema-2 backups. No equipment preferences are changed.
- High/Medium/Low rule scores reflect transparent signal weights, recent volume and change magnitude; unverified reporting is a separate **Data check**, never a confident commercial signal.
- Evidence strings, suggested next actions, priority filters, search, paging and CSV exports all derive from one selector. No automatic activity cause, competitor attribution, installer-model association, predicted revenue or market share is claimed.
- Final release requires post-build green CI and representative XLSX/Windows acceptance (F6); do not merge yet.
