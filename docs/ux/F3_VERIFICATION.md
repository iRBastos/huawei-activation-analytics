# F3 — Installer Intelligence redesign · checkpoint

**Execution date:** 2026-10-14  
**Baseline:** official `v2.0.0`, `main` `a962fe159bd5dd8b7d20f978910b27424d02e4db`  
**Working branch:** `ux/redesign-v2.1`  
**F3 source commit:** `dfc70dd97c0c8600404c5b44da07c9c620a8d672`  
**Post-build branch head:** `7c6db26b52a6989c18122c5043cc356691f3f43b`  
**GitHub Actions:** https://github.com/iRBastos/huawei-activation-analytics/actions/runs/38598060565 — **SUCCESS**  
**Source and UI status:** implemented/verified; **full 1000×48 import-performance acceptance remains open**. Owner has not yet approved F3 visuals.

## Goals and implementation

1. **Installer overview**
   - KPI cards first, then the ten largest signed change contributions, followed by the complete searchable ranking and chart.
   - `Compare selected (2–6)` is the primary ranking action.
   - `Unify selected`, suggested aliases and complete union/undo history live in a contextual, accessible `Account management` disclosure.
   - Existing merging confirmation, sums, user export actions and evidence modals are unchanged.
   - Monthly heatmap remains available with local horizontal scrolling and unchanged missing/zero/partial semantics.
2. **Compare 2–6**
   - Compact chips summarize selected installers. A scrollable full-list search is available under `Edit selection`; expansion stays open when a new account is added.
   - Four summary KPIs and the precise numeric comparison table appear before the chart.
   - Accessible `Absolute activations | Indexed · base 100` selector renders exactly one chart at a time; both models remain available. When indexed mode lacks an eligible common positive confirmed base, the explanation is shown.
   - CSV export, detailed underlying values, and source-evidence drilldown remain.
3. **Insights & priorities**
   - KPI indicators and the actionable priority table come before the `Evidence thresholds` configuration disclosure.
   - `Data check` is described explicitly as a reporting verification task, never a commercial opportunity.
   - Priority/type/search selectors, full evidence, 50-row pagination and export are unchanged.
4. **Installer profile**
   - Approved F1 compact selector deliberately retained without a new redesign or metric changes.

**Files:** `installer-views.js`, `installer-experiences.js`, `installer-analytics-views.js`, `app.js`, scoped `styles.css`; existing and new tests; `browser-smoke.mjs` CI assertions; reproducible synthetic scale harness `ux-f3-scale.mjs`.

**Unmodified analytical contracts:** `calculations.js`, `installer-analytics.js`, `installer-insights.js`, `installers.js`, import/backup modules and persistence/schema files.

## Test results

| Check | Result | Evidence |
|---|---|---|
| Full Node regression | **182/182 pass** | New 4 F3 assertions and updated comparison mode tests |
| New F3 hierarchy tests | **4/4 pass** | Rank, comparison, disclosures, priorities and UI-local state |
| Targeted installer tests | **44/44 pass** | Existing profiling, 1105-name searches, indexed eligibility, unions, evidence |
| Offline verification | **PASS** | Standalone assets, old backup migration, CSV/XLSX and persistence simulation |
| GitHub Actions real Chromium `file://` | **PASS** | Run `38598060565`: import, search, union/undo, reimport, full account selector, responsive 390px; F3 mode/priority order assertions |
| Offline HTML/ZIP | **PASS** | CI regenerated and committed on working branch only |
| Official `main` | **unchanged** | `a962fe159bd5dd8b7d20f978910b27424d02e4db` |
| Visual desktop/mobile reference | **Available** | CI screenshots and before/after comparisons in Library |

The local sandbox Chromium stalled during independent screenshot collection and its direct `file://` smoke stalled at startup; **these are not reported as passing**. The separate GitHub Actions real-browser run passed. Five-viewport F3 visual acceptance was *not* independently completed; the full multi-page matrix remains in F6.

## Scale testing and open risk

A local synthetic scenario generated **1,000 accounts × 48 months**, with the source data model populated by cloning one valid synthetic import into distinct synthetic account/source IDs. This verifies display/search/comparison architecture **but does not count as a full 1000-row import test**.

- 1000 accounts searchable; 6-account comparison; last account selectable; historical evidence, overview, and insights produced.
- Local timing varied from **20.5 to 28.4 seconds** to generate several major views sequentially. One instrumented run measured approximately 7.5 s for Overview, 10.0 s for Profile and 10.3 s for Insights; hardware and browser environments differ.
- A separate attempt to validate/import the entire 1000×48 CSV within the sandbox exceeded a **120-second timeout** before completion. This is a **performance/acceptance blocker for that large-import scenario**, not a newly verified regression or a data correctness failure.
- No domain/import algorithm was changed to hide this issue. Before final release, benchmark and address full-scale import and account rendering through a separately reviewed performance task, with cross-version baseline comparisons and preserved importer semantics.
- Existing smaller CSV/XLSX/backup/import/undo logic **did pass** the CI and Node regression matrix.

## Evidence archive

GitHub Actions run retains the verified artifact `huawei-activation-analytics-synced-release` (artifact ID `11911911698`) with `index.html`, `codigo-fonte.zip` and Chromium screenshots.

ChatGPT Library:
- `/Huawei Activation Analytics/V2.1 UX Redesign/UX Evidence/F3_Before_After_Desktop.png`
- `/Huawei Activation Analytics/V2.1 UX Redesign/UX Evidence/F3_Before_After_Mobile.png`
- `/Huawei Activation Analytics/V2.1 UX Redesign/F3 Source Snapshot/` — exact source upload snapshots

## Gate and next step

**F3 UX code, regressions, CI release build and smoke are complete; owner review and full-scale performance acceptance remain pending.** Before F4, review the UX direction and explicitly track the 1000×48 performance task. Continue only on `ux/redesign-v2.1`. Do not merge or publish a release without explicit approval.
