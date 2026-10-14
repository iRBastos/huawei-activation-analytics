# F0 — Baseline inventory and verification scope

Reference: release `v2.0.0`, `main` SHA `a962fe159bd5dd8b7d20f978910b27424d02e4db`.
Branch: `ux/redesign-v2.1`.
Evidence type: **static inspection of repository and prior completed CI**. This is **not** a newly executed F0 visual/browser pass.

## Existing verified evidence
- GitHub Actions run: https://github.com/iRBastos/huawei-activation-analytics/actions/runs/38571755552 (success, SHA `aa87539ab1584a404828d01310a5b99dd46faddc`).
- Prior release QA document reports 174/174 Node tests and headless Chromium checks, 390px mobile smoke, no external browser requests, and deterministic release freshness checks.
- CI artifact `huawei-activation-analytics-verified-release`, artifact ID `11898058019` (includes built HTML/ZIP and smoke screenshots).
- Latest release `v2.0.0` points to documentation commit based on the validated integration; it is an immutable reference for this redesign.

## Screen and source inventory

| Screen | Primary source | Baseline content / interaction to preserve | F0 watchpoint |
|---|---|---|---|
| Overview | `modules/views.js:overviewView` | 6 KPIs, findings, activation trend, ratio history, rolling tables, evidence detail | Hierarchy: strategic insights below several KPIs; duplicated filter scope in page header |
| Inverters | `modules/views.js:inverterView` | Phase chart, all-model searchable picker up to 16, ranking, contribution, mix, model evidence | Put commercial ranking nearer top; `Grid Phase` filter currently in global expansion |
| Batteries & BMS | `modules/views.js:batteriesView` | Family-specific ratios, capacity, trend, product mix and detail | Family ratios vs model/category selection; clarity of no physical pairing |
| Period comparisons | `modules/views.js:comparisonsView` | Quarterly Intelligence, totals, heatmap, change contributions, comparison chart/evidence | Quarterly block currently before primary comparison metric; long first-viewport scroll |
| Targets | `modules/views.js:targetsView` | Attainment, add/replace target, saved targets, target precedence | Summary vs editable controls |
| Installer overview | `modules/installer-views.js:installerView` | Portfolio KPIs, trends, ranking, heatmap, merge candidates and union history | Commercial data vs administrative merging mixed in one scrolling page |
| Installer profile | `modules/installer-experiences.js:installerProfilePage` | Full list+alias search, independent filters, 4 KPIs, signal, monthly/quarterly/annual histories, CSV, evidence | Search and select occupy full-width panel; three historical charts compete vertically |
| Installer compare 2–6 | `modules/installer-experiences.js:installerComparisonPage` | Scrollable complete search results, selected chips, max 6, absolute & indexed trend, table, CSV | Results picker occupies screen before selected accounts' metrics; avoid hiding important availability |
| Installer priorities | `modules/installer-experiences.js:installerInsightsPage` | KPI summary, rule thresholds, priority/type/search, data-check distinction and evidence | Place opportunity table before threshold configuration |
| Data | `modules/views.js:dataView` and `modules/installer-views.js:installerImportView` | 7 tabs, imports, validation, snapshots, coverage, catalogue, history, backup | Global equipment/installer filter bar on administrative pages |
| Shared shell | `dist/index.html`, `modules/app.js`, `styles.css` | nav, breadcrumbs, contextual filters, local persistence, dialogs, print | Common shell height and duplicated scope labels |

## Non-negotiable regression contracts
1. Installer blanks in present data cells mean zero; absent company in partial snapshot remains unknown.
2. Equipment blank cell means missing; explicit zero distinct.
3. Same source/month reimport replaces rather than sums. Confirmed installer unions sum repeated aliases.
4. All installer names remain searchable; 2–6 account comparisons and 16-model inverter chart limit work.
5. Read/write and restore of legacy backups; no accidental mutation of real workspace during demo.
6. No added network dependencies; `file://` HTML remains standalone.
7. Chart and table numerics (including incomplete coverage) match the baseline for identical synthetic data.
8. SHA and branch guard before every push.

## Required F0 browser matrix (not yet freshly executed)
Dimensions: 1920x1080, 1440x900, 1366x768, 768x1024, 390x844.
For each, capture key screens and record: body horizontal overflow, first actionable KPI/signal scroll offset, clipped controls, tab operation, keyboard focus, readability, chart/table scroll.
Test states: empty workspace, supplied demo, synthetic 1000 accounts x 48 months, missing coverage, open periods, zeros, very long aliases, import errors, up to 6 comparison accounts.

## Evidence gate
- Baseline Node test output captured with exact counts and SHA.
- Fresh `node tools/verify-offline.mjs` pass.
- Fresh `node tools/browser-smoke.mjs` `file://` pass at original SHA.
- Screenshots across five viewports, independently reviewed and categorized as reproduced problems vs hypotheses.
- Only after this gate begin F1, test one Installer Profile pilot and submit before/after evidence.

## Environment limitation
The GitHub connector exposes source text and historical workflow artifacts, but it does not provide a shared writable local repository checkout in this execution environment. This checkpoint therefore **does not claim a new local Chromium or Node run**. No source/CSS change should be promoted until the complete baseline can be built and checked with the existing scripts.
