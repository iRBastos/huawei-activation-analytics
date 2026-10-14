# F5 — Data Workspace & Targets · verified checkpoint

**Date:** 2026-10-14  
**Working branch:** `ux/redesign-v2.1`  
**F5 source commit:** `cbb7b1b6acf87edfddadf4386cc6d9111a47d877`  
**GitHub Actions:** https://github.com/iRBastos/huawei-activation-analytics/actions/runs/38603929592 — **SUCCESS**  
**CI-generated distribution commit:** `2e1e494348446c159f83ff8eef0b2414810a22d2`  
**Official main SHA:** `a962fe159bd5dd8b7d20f978910b27424d02e4db` — unchanged at checkpoint.

## Scope completed

1. **Data Workspace information architecture**
   - Original seven data subtab IDs and routes are preserved, now visually grouped under **Import, Inspect, Configure, Protect**.
   - Import: Equipment imports, Installer imports. Inspect: Recorded data, Coverage, History. Configure: Product catalogue. Protect: Backup & guide.
   - Added concise counts for equipment records, installer accounts and equipment+installer import events, correctly identified as local workspace totals, not business KPIs.
   - Added labelled tablist/tabpanel relationships with `aria-selected`, `tabindex`, and ArrowLeft / ArrowRight / Home / End keyboard navigation using actual DOM order. No persisted navigation schema changed.

2. **Import and reporting integrity**
   - Equipment import progress explicitly shows Choose file → Map worksheet → Validate & review → Confirm import, reusing existing parser and validation functions.
   - **Performance safeguard:** equipment preview renders the first **200** rows in HTML. The *entire* `D.importPreview(...)` result remains available via **Download full preview CSV** and the complete validated input is still subject to the original confirmations. Total row counts and per-action counts remain computed over the full preview, not the first 200.
   - Import scope, model classification, missing vs confirmed zero, overlapping months, destructive replacement review, manual approval checkbox and atomic commit path preserved.
   - Installer import identifies **Partial** as safe default and explains explicit Full-population confirmation. Neither default scope nor fullScopeConfirmed form control was altered.
   - No new multi-step wizard state was added; the current dependable one-pass import flow was intentionally retained.

3. **Targets, Coverage and Protect**
   - Target attainment table stays first, with editor in a contextual native `details` disclosure (open by default when no visible saved targets); target hierarchy documentation remains in an accessible methodology disclosure.
   - Coverage matrix stays first, with declared-scope editor in a native disclosure (open before any scope declarations); existing manual coverage confirmation retained.
   - Backup screen explains local storage and the destructive nature of restore. Download and restore controls and explicit browser modal confirmation remain unchanged.

4. **Implementation discipline**
   - Source edited: `codigo-fonte/dist/modules/views.js`, `codigo-fonte/dist/modules/app.js`, `codigo-fonte/dist/modules/installer-views.js`, `codigo-fonte/dist/styles.css`, `codigo-fonte/tools/browser-smoke.mjs`.
   - Added regression file: `codigo-fonte/tests/f5-data-workspace.test.mjs` (6 new tests).
   - No changes to analytical formulas, import parsers, schema, historical snapshot logic, installer aggregation, backups or persistence modules; no new frontend dependencies.

## Verification summary

| Verification | Outcome | Qualification |
|---|---|---|
| Complete Node test suite | **193 passed / 0 failed** | Local and GitHub Actions `npm test` |
| New F5-focused tests | **6/6 passed** | Tabs, preview count vs complete CSV, targets zero, coverage, backup, Full/Partial semantics |
| HTML offline build and backup verification | **PASS** | `tools/build-offline.py` and `tools/verify-offline.mjs` |
| Real `file://` Chromium smoke test | **PASS in CI** | Existing analytics/import tests plus new F5 tab-keyboard, coverage, target and backup assertions |
| Visual browser matrix | **25/25 captured** | 5 screens × 1920, 1440, 1366, 768, 390 px using fictional workspace; **0** document horizontal overflows and **0** detected unhandled exceptions |
| 91-model × 4-month equipment preview | **364/364 validated, 200 rendered** | All 364 values still exported through complete CSV path; Node test explicitly checks no 164 omitted from underlying preview |
| 1000 installers × 48 months full import and reimport | **PASS**, total ~4.865 s | 48,000 synthetic cells; measured locally, hardware/environment-specific |
| Deterministic source ZIP and offline HTML regeneration | **PASS** | Github Actions CI artifact `huawei-activation-analytics-synced-release`, ID `11914512239` |
| Main branch integrity | **PASS** | Main stayed at V2.0.0 SHA `a962fe1` |

### 1,000 × 48 benchmark details

Dataset: purely synthetic, 1,000 installer accounts × 48 monthly columns. `validationErrors: 0`; validation 322 ms; initial commit 1,356 ms; index 66 ms; repeated source snapshot commit 3,121 ms; combined 4,865 ms. Historical benchmark from F4 was about 8.65 s; these are **not controlled parallel environment measurements** and should not be described as a guaranteed percentage speed improvement.

### Visual verification limitations

The custom local Chromium visual harness injects content into an isolated document to work around direct file navigation limitations. It **does not prove real `file://` launch or browser persistence**. Those were separately validated with the GitHub Actions smoke test. The visual matrix checks five viewports for Data import, Coverage, Backup, History and Targets, but **does not replace F6 whole-app WCAG and responsive review**.

Screenshots in ChatGPT Library:
- `/Huawei Activation Analytics/V2.1 UX Redesign/UX Evidence/F5_Desktop.png`
- `/Huawei Activation Analytics/V2.1 UX Redesign/UX Evidence/F5_Mobile.png`
- Full source snapshots: `/Huawei Activation Analytics/V2.1 UX Redesign/F5 Source Snapshot/`

### Open acceptance items

- F5 screenshots and page grouping await owner product approval.
- Manual Windows user testing with a safely exported/isolated backup not yet performed.
- Full F6 accessibility audit (contrast, keyboard, screen-reader, responsiveness across all major screens) pending.
- Full-preview CSV **handler** is bound and its complete data path is covered by automated assertions, but an end-to-end browser CSV-save/download test should be added during F6 for extra confidence.
- No production data shared or incorporated.

**Gate:** F5 technical implementation complete. Await owner acceptance of direction before broad F6 polish. No pull request, merge, main commit or release without explicit approval.
