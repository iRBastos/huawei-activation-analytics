# F2 — Navigation and contextual filters · verified checkpoint

**Date:** 2026-10-14
**Branch:** `ux/redesign-v2.1`
**Source commit:** `6dc127cc3d2b51dbdcd7d53308b1acf6e8e3a81f`
**Generated release sync:** `eb54b5ee873101107e15d280662236f6da7d738d`
**Automated CI:** https://github.com/iRBastos/huawei-activation-analytics/actions/runs/38594347939
**Baseline:** `main` at `a962fe159bd5dd8b7d20f978910b27424d02e4db`; unchanged.

## Changes shipped on the isolated branch

1. **Purpose-based navigation:** Preserved all seven existing route keys and button handlers, but visually grouped navigation into Overview / Market intelligence / Installer intelligence / Data & administration. Keyboard-focusable buttons and `aria-current=page` remain; mobile retains horizontally scrollable route access.
2. **Breadcrumb context:** Displays whether the user is in Market intelligence, Installer intelligence, or Data & administration; Data pages include the relevant subtab name.
3. **Equipment filter hierarchy:** Period / From / To stay visible. Secondary aggregation/comparison fields and product scope are accessible through independent labelled expanders. Expanded/collapsed state is local UI state, not persisted data. Controls retain their original IDs and `data-filter` handlers. Current scope is always summarized outside the expander.
4. **Grid Phase is contextual:** This equipment-only control is shown in the Inverters product scope, not on unrelated pages. Existing filter values and chart calculations stay intact.
5. **Installer filter hierarchy:** Period / From / To remain visible; Chart view, Compare with and Account base move into `Analysis options`, with active comparable cohort exposed in the summary. A `Reporting rules` disclosure preserves important missing-vs-zero/source coverage semantics.
6. **Data workspace cleanup:** Import, installer import, catalogue, history, and backup tabs no longer show irrelevant global analytics filters. Recorded data retains period and product scope because its table/exports use those values. Coverage shows only period controls, since global product filters do not narrow its audit.
7. **Responsive polish:** Desktop sidebar groups, compact filter controls, and narrow viewport layouts; print view still hides navigation/filter tooling.

### Source changes

- `codigo-fonte/dist/modules/views.js` — navigation grouping, route breadcrumbs, contextual equipment filters
- `codigo-fonte/dist/modules/app.js` — render context + local expander toggles
- `codigo-fonte/dist/modules/installer-analytics-views.js` — installer filter layout and disclosure
- `codigo-fonte/dist/styles.css` — scoped F2 design tokens/layout/responsiveness
- `codigo-fonte/tests/f2-navigation-filters.test.mjs` — four new regression tests

**Business and import logic unchanged** — no edit to `calculations.js`, `installers.js`, `installer-analytics.js`, `parser.js`, `imports.js`, `backup.js`, or `persistence.js`. No new frontend libraries or external dependencies.

## Test evidence

| Verification | Outcome |
|---|---|
| Full Node suite (local, controlled concurrency) | **178/178 passed, 0 failed** |
| F2-specific unit regressions | **4/4 passed** |
| Existing domain + installer profile tests | **48/48 passed** |
| Local offline verification | **PASS**, module-export/view parity, backup migration, local state, CSV, XLSX and offline assumptions |
| Chromium snapshot matrix | **25 screenshots**, 5 views × 5 viewport sizes: 1920×1080, 1440×900, 1366×768, 768×1024, 390×844 |
| Browser horizontal overflow | **None detected**; 0 unhandled browser exceptions |
| Production offline CI on branch | **PASS**: Node, standalone build, offline verification, real `file://` Chromium smoke, deterministic ZIP, generated-file commit, browser artefacts |
| `main` integrity | SHA unchanged |

Chromium snapshot matrix was captured via a local sandbox DOM fixture with fictional CSV from 25 installer accounts and one repeated row. The local visual harness uses document-content injection to work around file-navigation restrictions in this environment; **it is not an independent confirmation of `file://` persistence**. The real `file://` smoke test was executed separately by the passing GitHub Actions job.

The snapshot matrix covers Installer Profile, Data import, Data coverage, Data records and Overview; it does not constitute a full design audit of every page (planned in F6). Browser snapshots alone do not prove complete WCAG conformance or manual Windows acceptance.

## Visual evidence

Stored in the user's ChatGPT Library:
- `/Huawei Activation Analytics/V2.1 UX Redesign/UX Evidence/F2_Before_After_Desktop.png`
- `/Huawei Activation Analytics/V2.1 UX Redesign/UX Evidence/F2_Before_After_Mobile.png`

The GitHub Actions run also stores the regenerated HTML/ZIP and Chromium screenshots.

## Non-regression observations

- Installer selector still supports aliases/full account list; no change to installer records, merging or 2–6 comparison.
- `aria-expanded` is synchronized with the UI toggle and `aria-controls` points to always-present (potentially `hidden`) option panels.
- Product filters remain semantically persistent and independent from installer preferences.
- UI disclosure state is not written into the user's backup or storage schema.
- Data records and coverage retain their required global month scope. Hidden product filters never narrow coverage.

## Next gate

**F2 is technically complete**, pending final product owner review of the navigation/filter direction. Begin F3 (Installer Intelligence) only with the established source, tests, and screenshots as a baseline. Keep all F3 code and regenerated artefacts on `ux/redesign-v2.1`; do not merge or create a release without explicit approval.
