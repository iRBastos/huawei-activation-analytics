# Huawei Activation Analytics — F6 UX / Quality Verification

**Date:** 14 October 2026  
**Repository:** https://github.com/iRBastos/huawei-activation-analytics  
**Working branch:** `ux/redesign-v2.1`  
**Baseline:** `main` V2.0.0 at `a962fe159bd5dd8b7d20f978910b27424d02e4db`  
**F6 source:** `6f7ee697602773b1083404b796ea3b0685f318e0`  
**Smoke-test fix:** `eaaf7637719c663efe0b1c4a95128cef4afc372d`  
**CI distribution commit:** `271223cc5e6f3995d9f28be635b7e66f591809a5`  
**CI:** https://github.com/iRBastos/huawei-activation-analytics/actions/runs/38608114416 — SUCCESS.

## Scope and intentional constraints

F6 is a cross-application **accessibility, responsive layout and usability quality pass**, not a feature release. No additions to analytics, charts, stored data model, imports, business logic, backup formats, or external dependencies. No source commits, tag, merge, Pull Request or release were made on `main`.

## Source changes (five files)

1. `codigo-fonte/dist/styles.css` — improved label/axis contrast, increased mobile Data tab legibility and tap target minimums, removed unnecessary vertical space, and respected reduced-motion preferences.
2. `codigo-fonte/dist/modules/installer-experiences.js` — installer analytics tabs now expose **one selected tab in keyboard order**, with non-selected tabs removed from the normal Tab sequence.
3. `codigo-fonte/dist/modules/app.js` — ArrowLeft/ArrowRight/Home/End change the active installer view and move focus appropriately, consistent with the Data workspace tabs.
4. `codigo-fonte/tests/f6-accessibility-polish.test.mjs` — three regression tests for keyboard tab semantics, color contrast, and responsive label sizes/targets.
5. `codigo-fonte/tools/browser-smoke.mjs` — real Chromium assertions for installer keyboard navigation, focus retention and selected tab; corrected a test-only invalid selector after the initial CI failure.

### Quantified mobile improvement

For a 390 × 844 browser window, measured by the same synthetic visual harness before and after:

| View | Before | After | Change |
|---|---:|---:|---:|
| Data Workspace tab navigation height | 271px | 210px | **61px less** |
| Market Overview first KPI top | 817px | 788px | **29px earlier** |
| Installer Overview first KPI top | 1046px | 1028px | **18px earlier** |
| Installer Profile first KPI top | 1210px | 1192px | **18px earlier** |
| Global equipment filter height | 287px | 278px | **9px less** |
| Global installer filter height | 259px | 250px | **9px less** |

These measurements capture *layout improvements*, not a claim that all first KPIs are above the fold in small devices. The compact layout retains all original options and content.

## Automated verification

| Check | F6 result | Evidence / limitation |
|---|---|---|
| Full Node test suite | **196/196 PASS** | Includes three F6 tests, all prior F1–F5 regressions. |
| Offline builder and verifier | **PASS** | `build-offline.py`, `verify-offline.mjs`, and deterministic ZIP regeneration. |
| GitHub Actions Chromium | **PASS** | `file://` app, demos, installer CSV import, installer tab keyboard/focus, compare/undo, backup paths and mobile smoke. |
| Full visual inventory | **80/80 screenshot captures**, no overflow or JS exceptions | 16 distinct views × 5 viewport sizes (1920 × 1080, 1440 × 900, 1366 × 768, 768 × 1024, 390 × 844). Uses document-injection harness; real file-open separately checked in CI. |
| Accessible-name heuristic | **0 visible unlabeled controls** | Heuristic based on rendered labels/aria; NOT a screen reader certification. |
| Secondary label contrast | **4.5:1 minimum for three corrected label roles** | Node luminance tests check axes, Data section headings, sidebar group labels against their surfaces; not a full color contrast census. |
| Installer keyboard navigation | **PASS** | ArrowLeft/Right, Home/End, correct focus and one tab stop verified by CI. |
| Synthetic 1000×48 reimport | **PASS** | 1,000 fictional accounts, 48,000 cells; `validationErrors=0`, total 3.741s locally (validation 175ms, initial commit 417ms, index 52ms, repeated snapshot commit 3,097ms). Hardware-specific measurement. |
| Branch isolation | **PASS** | Official `main` SHA unchanged at each GitHub checkpoint. |

### Browser modes and datasets

- The 25 **Market Intelligence** screenshots use the app's fictional built-in equipment demo, including invented equipment volumes and targets.
- The 55 **Installer / Data** screenshots use a temporary 25-account synthetic installer CSV fixture (plus a deliberately duplicated row). No customer, personal or confidential activation data was used.
- The browser snapshot harness deliberately injects offline HTML into an isolated Chromium document because local `file://` navigation is unreliable in the sandbox. It does not demonstrate browser persistence. **GitHub Actions** separately passed the real `file://` Chromium test.
- Browser screenshot count and no-overflow checks do not demonstrate complete WCAG 2.2 AA conformance. Manual focus/assistive-technology review is still needed before final release.

### CI incident resolved before acceptance

The first F6 CI run https://github.com/iRBastos/huawei-activation-analytics/actions/runs/38607905074 **failed at Chromium smoke** even though Node/offline steps passed. Root cause: the newly added test used an invalid CSS attribute selector `[tabindex=0]` (numeric value unquoted). It was replaced with a property-based check of actual tabIndex and recommitted. The next independent GitHub Actions run **fully passed**: https://github.com/iRBastos/huawei-activation-analytics/actions/runs/38608114416. No analytics bug was involved.

## Remaining acceptance conditions (F7 / owner UAT)

- Inspect the actual production-use workflow on Windows with a **separate test browser profile and exported backup**, including persistence/reload/restore of private data (not supplied to the assistant).
- Verify the full preview CSV download in a real Windows browser, opening the exported file and reconciling the complete row count. Automated source tests already protect the full-data CSV generation path, but the actual save/open round trip remains unconfirmed.
- If WCAG 2.2 AA certification is required, complete an additional hands-on assistive technology audit (keyboard-only interactions and screen reader), not just the automated checks here.
- Check print/PDF readability and selected filter notes manually on Windows.
- F7 should create a **Draft Pull Request** only after reviewing this report and final scope; never merge or release without specific user approval.

## Verified artefacts

- CI artifact: `huawei-activation-analytics-synced-release`, ID `11915644524` (contains standalone `index.html`, source ZIP, desktop/mobile Chromium smoke screenshots).
- Local F6 visual matrix JSON: `f6-visual-results.json`, with 80 per-viewport measurements.
- Before/after comparison images for Data Workspace, Market Overview and Installer Profile (390px viewport).
- The official F6 standalone HTML byte-for-byte matches the file generated by the local deterministic builder (SHA256 `bb55126ca4fae5cc50cc0e8f5a637ec4f2d509d726ceebc4965e3ee2cb6af4fc`).

**Conclusion:** F6 source, responsive polish, targeted a11y improvements and automated quality gate are complete and CI green. Full human acceptance and Draft PR are separate F7 steps. Official `main` remains untouched.
