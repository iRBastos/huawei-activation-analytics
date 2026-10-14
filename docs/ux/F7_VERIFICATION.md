# F7 — V2.1 release candidate: security, cross-platform and final QA

**Date:** 2026-10-14  
**Baseline:** main / v2.0.0 — `a962fe159bd5dd8b7d20f978910b27424d02e4db`  
**Isolated development branch:** `ux/redesign-v2.1`  
**Source+distribution checkpoint before this report:** `7a3e790d3784937cb224301ddd74429a0cad9305`  
**Status:** automated acceptance PASS; Draft PR for review; manual Windows UAT and independent accessibility/security reviews remain open. **Do not merge or release.**

## Final verified evidence

### Windows 11 GitHub-hosted runner (real Chrome)
- Workflow: https://github.com/iRBastos/huawei-activation-analytics/actions/runs/38610164521 — **SUCCESS**.
- Runner located browser: `C:\Program Files\Google\Chrome\Application\chrome.exe`.
- `npm test`: **196/196 PASS** (0 failed).
- `python tools/build-offline.py`: standalone HTML generated at `D:\a\huawei-activation-analytics\huawei-activation-analytics\index.html`.
- `node tools/verify-offline.mjs`: PASS — embedded modules/views, blank/demo, legacy backup migration and restore, blocked local storage, import XLSX/CSV.
- `node tools/browser-smoke.mjs`: **PASS** on real Chrome opening generated `file://` HTML. Checks: empty/demo screens, equipment charts, all-model search, comparison evidence, fictional installer CSV import, repeated row sum, union/reimport/undo, persistence after reload, installer search and display across 140+ source names, 390px mobile screens, screenshots, no unexpected network requests and no uncaught browser JS exceptions.
- Browser images downloadable from workflow artifact `huawei-v2.1-windows-smoke` (ID `11916654372`).
- Compatibility adjustment: browser smoke now builds a platform-correct `file://` URL via `pathToFileURL`; this modifies **test tooling only**, not the dashboard runtime.

### Linux CI / deterministic distribution
- Workflow: https://github.com/iRBastos/huawei-activation-analytics/actions/runs/38610163817 — **SUCCESS**.
- Full Node suite, offline verification, Chromium smoke, deterministic ZIP rebuild and branch-only distribution synchronization: PASS.
- CI distribution artifact `huawei-activation-analytics-synced-release` (ID `11916679434`).
- Downloaded source ZIP: **83 entries**, no duplicates, no corrupt members, and same HTML content as top-level standalone HTML.
- Exact Git blob parity with branch tip: standalone HTML `02437cbec9c16f92592860f81c35ff235245f7e3`; deterministic ZIP `8d8f2b02d68f87ade0d8fcfdb8310663ec5bbb20`. Both byte-for-byte match files downloaded from the successful CI artifact.
- The ZIP contains the four expected provided XLSX template copies (top-level and `codigo-fonte/dist/templates`), **not** user datasets.

### Security and privacy sanity checks (scope-limited)
- Standalone HTML contains two embedded script elements; no external script `src` and no external stylesheet `link`, and no `iframe` required by the app.
- Full ZIP directory scan found no `.git/`, `node_modules/`, `.env`, key/certificate/credential paths, or unexpected CSV/XLS/XLSX user-data files; XLSX files were exact supported import templates.
- Runtime Windows browser smoke asserts no unexpected network requests during covered flows.
- This is a **distribution and workflow sanity check**, not a pentest, comprehensive vulnerability assessment, or claim of WCAG 2.2 AA certification.
- No operational customer/installer data was supplied, committed or processed by the validation. All demo/fixture datasets are fictional.

### Product and performance checks
- F0–F6 page-specific quality evidence remains in `docs/ux/F0_F1_VERIFICATION.md` through `F6_VERIFICATION.md`.
- F6 matrix covered **16 screens × 5 viewport widths = 80 screenshot captures**; no document horizontal overflow or uncaught JavaScript exceptions found in those synthetic visual runs.
- Prior F6 benchmark imported/validated synthetic 1000 installers × 48 months in about 3.74 s on that local machine. F7 did not independently reproduce a Windows 1000×48 performance benchmark; this remains a cross-hardware UAT recommendation.
- UX metrics, analytics formula definitions, zero vs missing and account identity semantics were not intentionally changed during F7.

## Before review/merge: known limitations and manual UAT

1. **Manual Windows smoke** in the intended user's environment is still required. Use a separate browser profile or an isolated Windows account with only fictitious data. **Do not test restore/import in the same browser workspace containing real data**. Verify standalone opening via File Explorer, CSV/XLSX imports, Full vs Partial, 0 vs missing, installer search 2–6, CSV export/download, backups (create/export/restore), print/PDF and reload persistence.
2. **Cross-hardware performance** should be measured with representative data size on the intended Windows device, but without exposing confidential data; synthetic 1000×48 is available as a code fixture.
3. **Accessibility**: automated keyboard/focus/contrast/viewport checks are useful but cannot certify WCAG AA; if certification is required, test with assistive technology/manual audit.
4. If any finding emerges during manual UAT or security review, keep Draft PR open, implement a narrow correction on the feature branch, rerun both CI workflows, and update this evidence.
5. **No merge, main push, tag, GitHub release or production rollout is authorized by F7 itself.** Owner approval required.

## Draft PR review checklist

- [x] Main baseline confirmed unchanged at `a962fe1` before PR creation
- [x] Feature branch contains only v2.1 UX / QA / documentation / deterministic build changes
- [x] Local 196/196 tests and complete Windows 196/196 suite
- [x] Real Windows Chrome `file://` smoke PASS
- [x] Linux CI and generated ZIP SHA parity PASS
- [x] Basic distribution data/secrets/remote dependency scan PASS
- [x] No customer real data in validation files
- [ ] Product owner evaluates the complete UI on their PC with isolated test data
- [ ] Manual backup, restore, CSV exports and print/PDF acceptance on Windows
- [ ] Final Draft PR review and explicit user authorization before changing `main`
