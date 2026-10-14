# F0 baseline + F1 Installer Profile pilot — verification report

**Date:** 2026-10-14
**Baseline release:** `v2.0.0` / SHA `a962fe159bd5dd8b7d20f978910b27424d02e4db`
**Working branch:** `ux/redesign-v2.1`
**Status:** F1 pilot implemented and technically validated; awaiting UX approval before extending pattern to F2/F3.
**GitHub Actions:** https://github.com/iRBastos/huawei-activation-analytics/actions/runs/38589444121

## Changes

- `codigo-fonte/dist/modules/installer-experiences.js`: replaced oversized standalone account-picking panel with a compact selector bar, keeping native full-list selector, alias search, selected-account retention, and Manage installer data action.
- `codigo-fonte/dist/styles.css`: added isolated, responsive styling scoped only to the new selector.
- `codigo-fonte/tests/installer-experiences-v2.test.mjs`: strengthened pilot assertions and preserved test with 1,105 installer accounts.
- `.github/workflows/sync-release.yml`: enabled isolated `ux/redesign-v2.1` in the existing source-to-offline deterministic build workflow; no `main` changes.

## Numeric and functional verification
- Before change: baseline 174/174 Node tests passed.
- After change: pilot 174/174 Node tests passed; targeted profile/installer tests 12/12.
- New branch GitHub Actions: **success** for Node tests, offline compilation, simulated DOM, real headless Chromium smoke using local `file://`, deterministic ZIP and generated-file commit.
- No changes to `calculations.js`, installer domain, parser, import, backup or persistence logic.
- Source search/filter behavior preserved, including the all-accounts 1,105-name fixture, aliases and 2–6 installer comparison.
- 3 historical chart views, recorded-evidence table, export, and priority insights remain available.

## Matched visual evidence

Two independent versions were rendered using the same isolated synthetic 25-installer CSV, including one repeated source row; no customer data. Viewport screenshots were captured from actual headless Chromium. The visual harness injects the standalone HTML into an isolated document (because the local sandbox Chromium fails to navigate directly to `file://`); therefore **this harness does not establish file-open behavior**. Real `file://` smoke was separately verified as passing in GitHub Actions.

| Viewport | Baseline first KPI top | Pilot first KPI top | Improvement | Document-wide horizontal overflow |
|---|---:|---:|---:|---|
| 1920×1080 | 750.9 px | 643.8 px | 107.1 px | none |
| 1440×900 | 803.1 px | 696.0 px | 107.1 px | none |
| 1366×768 | 803.1 px | 696.0 px | 107.1 px | none |
| 768×1024 | 1006.8 px | 927.1 px | 79.7 px | none |
| 390×844 | 1313.8 px | 1187.5 px | 126.3 px | none |

Both visual runs reported zero unhandled runtime exceptions. The simulated mode is clearly session-only, not production browser-persistence proof.

### Screenshots

Persisted in the user's ChatGPT Library:
- `/Huawei Activation Analytics/V2.1 UX Redesign/UX Evidence/Installer_Profile_Before_After_Desktop.png`
- `/Huawei Activation Analytics/V2.1 UX Redesign/UX Evidence/Installer_Profile_Before_After_Mobile.png`

GitHub Actions also retains fresh release/browser screenshots as an artifact:
https://github.com/iRBastos/huawei-activation-analytics/actions/runs/38589444121

## Limitations and next gate

- This first pilot deliberately addresses **one identified usability issue**. It does not deliver the entire premium visual system or reorganize other pages yet.
- At narrow widths, global filters still consume significant first-screen height; F2 is intended to address this across the application.
- Final acceptance should include user's own Windows browser with restored **backup on a test profile**, never production data shared publicly.
- Continue to F2 only once pilot direction is approved. Keep all changes in the isolated branch, no `main` modification, merge or release.

## Acceptance summary
PASS: full Node regression, dedicated selector tests, GitHub Chromium/offline build and generated file sync, 5 viewport visual/overflow check, persistent before/after records.
PENDING: user approval of pilot, real-data Windows manual UAT (user-side), complete redesign phases F2–F7.
