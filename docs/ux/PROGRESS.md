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
| F2 — navigation/filters | IMPLEMENTED — VERIFIED | 178/178 local Node tests; 4 F2 regressions; 25 browser viewport screenshots; Actions run 38594347939 PASS; generated HTML/ZIP synced. See `docs/ux/F2_VERIFICATION.md` | Owner reviews checkpoint before F3 |
| F3 — Installer Intelligence | NOT STARTED | — | After F2 |
| F4 — Market Intelligence | NOT STARTED | — | After F3 |
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

No visual redesign implemented yet.

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
