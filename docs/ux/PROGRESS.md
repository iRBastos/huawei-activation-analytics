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
| F0 — baseline | IN PROGRESS | Source-by-source baseline inventory saved to `docs/ux/F0_BASELINE_INVENTORY.md`; prior V2 CI and screenshot artifact identified. Fresh tests and visual captures pending | Execute fresh Node/Chromium/file:// tests and 5-viewport screenshots on exact baseline before F1 |
| F1 — pilot Installer Profile | NOT STARTED | — | Begin only after baseline is documented |
| F2 — navigation/filters | NOT STARTED | — | After F1 acceptance |
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
