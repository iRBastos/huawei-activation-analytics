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
