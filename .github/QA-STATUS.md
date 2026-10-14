# Installer import foundation — review gates

Branch: `feat/installer-import-foundation`. Main remains unchanged until review.

- 110 automated tests passed locally, including 23 installer-specific tests.
- Offline module parity and simulated DOM checks passed locally.
- Browser smoke now includes installer import, union, reimport, reload, undo and evidence.
- No Chromium binary is installed in the local execution environment; the real-browser
  gate runs on the PR through GitHub Actions and must be green on the final commit.
- HTML, offline JavaScript, deterministic source ZIP and test summaries are regenerated.
- No production installer XLSX is available. The supplied naming example is covered by
  fictional fixtures. The user confirmed stage-one acceptance. Stage-two acceptance on real data remains outstanding.

All existing equipment tests remain required. Generated artifacts must match source rebuilds.
