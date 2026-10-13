# Pre-merge release audit (development branch)

The source branch is `feature/inverter-power-catalog` and must not be merged until the following are all green on the current PR head:

- All `npm test` domain and regression tests, including old schema-1 backup migration.
- Offline script parity/simulated DOM: `node codigo-fonte/tools/verify-offline.mjs`.
- Chromium headless file-open smoke test, using fictional demo data only.
- Reproduced `index.html`, `codigo-fonte/dist/app.offline.js`, `codigo-fonte.zip` and both test summaries must have zero `git diff`.
- The ZIP must contain current application, source, docs and templates; archive member bytes must equal the repository files.

The generated files were synchronised in development commit `42d258433007a1d6a84d47a8265e8e4689a08bd3` after 87 automated tests plus offline simulations and Chromium smoke checks passed. This metadata file is deliberately excluded from the source ZIP; it triggers independent CI on the release commit.

**Manual Windows acceptance with a real backed-up dataset is a separate check** and must not be inferred from CI alone. The `main` branch has not been changed.
