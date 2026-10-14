# UX/UI V2.1 — Execution progress

Updated: 2026-10-14
Baseline release: v2.0.0
Original main SHA: `a962fe159bd5dd8b7d20f978910b27424d02e4db`
Working branch: `ux/redesign-v2.1`

## Invariants
- Do not commit, push, merge, tag, or release on `main`.
- Preserve analytical formulas, import semantics, schema, backup, CSV, and offline `file://` usage.
- Build generated `index.html`, `codigo-fonte/dist/app.offline.js`, and `codigo-fonte.zip` from their source files.
- Do not introduce confidential or real user datasets. Only synthetic test data.
- Every phase must be reviewable with tests and documentation.

## Source of truth
- `docs/ux/IMPLEMENTATION_PLAN_V2.1.md`: approved execution roadmap (F0–F7).
- `docs/ux/UX_UI_AUDIT_V2.0.0.md`: UX audit/reference.

## Checkpoint ledger

| Phase | Status | Evidence | Next action |
|---|---|---|---|
| Preparation | DONE | Dedicated branch created at official V2.0.0 SHA; approved plan and UX audit committed | F0 baseline |
| F0 — baseline | PILOT BASELINE VERIFIED | 174/174 original tests; measured same-fixture screenshots for profile on 5 viewports; full app matrix remains for F6; original file:// smoke passes on GitHub Actions | Reference evidence `docs/ux/F0_F1_VERIFICATION.md` |
| F1 — pilot Installer Profile | APPROVED BY OWNER | 174/174 local tests; 12/12 targeted; Actions run 38589444121 PASS; KPI begins 80–126 px higher | Direction approved; F2 performed |
| F2 — navigation/filters | APPROVED BY OWNER | 178/178 tests; 25 viewport screenshots; Actions 38594347939 PASS | F3 performed |
| F3 — Installer Intelligence | IMPLEMENTED — CI VERIFIED; DIRECTION CARRIED FORWARD | 182/182 tests; Actions 38598060565 passed; visual checkpoint F3; full 1000×48 bulk import performance remediated during F4 | Independent broad UX acceptance pending F6 |
| F4 — Market Intelligence + Scale | IMPLEMENTED — CI VERIFIED | 187/187 tests; Actions 38601026894 pass; 91×48 market benchmark KPI parity; complete 1000-account×48-month first import/reimport passes; F4 verification report | Product review; next F5 Data Workspace & Targets |
| F5 — Data & Targets | NOT STARTED | — | After F4 |
| F6 — responsive/a11y | NOT STARTED | — | After F5 |
| F7 — final QA/Draft PR | NOT STARTED | — | After F6 |

## Observed CI caveat
`.github/workflows/sync-release.yml` only writes to legacy development branches, not `ux/redesign-v2.1`. The working branch must explicitly rebuild generated HTML, JavaScript and deterministic ZIP, and CI must validate byte freshness before accepting changes.

## Recovery protocol
1. Read this ledger, then the implementation plan and audit.
2. Inspect branch head and ensure branch is `ux/redesign-v2.1`.
3. Confirm `main` has not been modified by this initiative.
4. Resume the earliest IN PROGRESS phase; never skip a gate or assume tests passed without run evidence.
5. Update this ledger after each validated checkpoint.

Historical note: this ledger was created before the F1/F2/F3 implementation milestones below; consult latest checkpoints for current status.

## Latest execution update — 2026-10-14
- Created isolated branch at release SHA and committed approved plan, full UX audit, checkpoint ledger and F0 baseline inventory.
- Located historical green main validation and artifact ID 11898058019; historical evidence cannot substitute a new independent baseline.
- Development repository checkout was unavailable from the connected GitHub tool, so F0 fresh local/browser run is pending. No source or CSS has been edited.
- `main` remained `a962fe159bd5dd8b7d20f978910b27424d02e4db` at last verification.


## UX Pilot milestone — 2026-10-14
- Branch source modifications: `codigo-fonte/dist/modules/installer-experiences.js`, scoped `styles.css`, profile test assertions only.
- Existing build sync enabled for `ux/redesign-v2.1` and its workflow passed: https://github.com/iRBastos/huawei-activation-analytics/actions/runs/38589444121
- `index.html`, bundled offline JS, reproducible ZIP and CI screenshot artifacts generated and committed on **working branch**, not `main`.
- Exact visual metrics and local browser harness limitations documented at `docs/ux/F0_F1_VERIFICATION.md`.
- Screenshot comparisons persisted in Library path `/Huawei Activation Analytics/V2.1 UX Redesign/UX Evidence`.
- **STOP GATE:** Do not expand to F2 before owner reviews the pilot. Do not merge/release without explicit permission.

## F2 milestone — 2026-10-14
- F1 pilot direction explicitly approved by owner; F2 redesign executed in a single atomic GitHub source commit `6dc127cc3d2b51dbdcd7d53308b1acf6e8e3a81f`, **on isolated branch only**.
- F2 adds grouped sidebar nav, contextual breadcrumbs, compact advanced/product filter expanders, coherent independent installer filtering, appropriate Data tab filter suppression, 4 new tests.
- Local controlled-concurrency Node tests: **178/178 PASS**. Offline verification PASS. Chromium visual fixture: 25 screenshots across 5 viewports, no horizontal overflow or runtime exception.
- GitHub Actions run https://github.com/iRBastos/huawei-activation-analytics/actions/runs/38594347939 **SUCCESS**; generated HTML and deterministic ZIP automatically committed only to `ux/redesign-v2.1`.
- Evidence saved in `docs/ux/F2_VERIFICATION.md`; desktop/mobile comparisons saved in ChatGPT Library `/Huawei Activation Analytics/V2.1 UX Redesign/UX Evidence`.
- `main` remained at V2.0.0 SHA `a962fe159bd5dd8b7d20f978910b27424d02e4db` at checkpoint.
- **STOP GATE:** Request owner approval of F2 navigation/filter direction before F3. No main merge, PR or release.

## F3 milestone — 2026-10-14
- F2 direction explicitly approved by owner; F3 source commit `dfc70dd97c0c8600404c5b44da07c9c620a8d672` on isolated branch, generated assets sync commit `7c6db26b52a6989c18122c5043cc356691f3f43b`.
- **182/182 Node tests PASS; GitHub Actions run 38598060565 SUCCESS** (real Chromium file:// smoke + generated ZIP and HTML).
- F3 restores analytical hierarchy (KPIs, contributions, ranking), contextualizes account union/undo, improves 2–6 comparison mode/summary, prioritizes insight table before threshold administration, keeps Data check explicit.
- The synthetic in-memory 1000×48 UI benchmark completed (20–28 s for multiple heavy views), but **the full 1000×48 bulk import attempt exceeded 120 s and is still unverified**. Document as a release/performance acceptance risk; do not claim comprehensive performance sign-off.
- Independent local viewport screenshot harness stalled; GH Actions Chromium succeeded at desktop and 390px; multi-viewport visual QA planned for F6.
- See `docs/ux/F3_VERIFICATION.md` for full evidence and limitations; comparison screenshots archived in ChatGPT Library UX Evidence folder.
- Owner acceptance of F3 UX and full-scale performance remediation pending. `main` has not changed. No merge, PR or release.

## F4 milestone — 2026-10-14
- Owner requested continuing redesign while preserving large-dataset performance.
- UX source commit `489cde04fcc59c35d31904652ffd765c4a649003` and CI-generated asset sync commit `0ba1df1f4276232a65592265ee3dd9ad7eb610ea`, isolated branch only.
- Market hierarchy: headline KPI/cards, evidence findings, model rankings, module/BMS mix, and paired comparison table promoted; quarterly intelligence retained as secondary.
- Performance fix in installer import: build source-by-account and import-order maps once during commit validation; no change to sum, zero/missing, full/partial, history, import provenance or persisted schema.
- 1,000 companies × 48 months (48,000 synthetic cells): initial import 1.44 s, snapshot replacement 6.51 s, full validation/index/reimport workflow 8.65 s locally. Earlier full-file attempt timed out after 120 s; test environments were not matched, so results are not a controlled speedup ratio.
- 91 product models × 48 months market benchmark: KPI readings identical to F3, no clear rendering slowdown. Full Node tests 187/187 pass, offline verification pass, GitHub Actions run 38601026894 successful (real Chromium file://, deterministic assets).
- See `docs/ux/F4_VERIFICATION.md`; screenshots archived in Library UX Evidence folder. F6 full visual matrix and additional scale/memory UAT remain pending.
- `main` remained at V2.0.0 baseline SHA `a962fe159bd5dd8b7d20f978910b27424d02e4db`; no merge, PR or release.
