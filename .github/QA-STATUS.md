# V2 quality gates — installer reporting coverage

Branch: `feat/installer-analytics-v2`. Base PR: #2. Draft integration PR: #3.

## Completed: foundation and F1 coverage snapshot semantics

- Node regression suite: **127 / 127 passing** on synthetic data during latest source-branch sync, including 17 additional V2 tests against the 110-test PR #2 foundation.
- Full-snapshot import **requires explicit user confirmation**. Partial imports never assume omitted companies have zero activations.
- Full months have auditable reporting-scope metadata (filename, worksheet, timestamp, import ID). Absent accounts contribute confirmed zero only where the entire population is declared complete.
- Later complete snapshots **supersede stale earlier records** of omitted source names without deleting their audit evidence. Partial corrections can reintroduce individual aliases. Undo restores previous values and scope; conflicts are rejected.
- Old schema-2 backups with no installer scope ledger normalize to empty coverage; equipment records remain independent.
- Browser smoke now covers a full-snapshot reimport that excludes stale source rows, historical evidence, and a subsequent partial correction.
- Offline simulation, Chromium file-open smoke, deterministic HTML/JS/ZIP generation, and release parity completed in the branch synchronization workflow. Use the actual workflow run for authoritative evidence.

## Remaining gates — not certified yet

- [ ] Manual user acceptance on a representative **sanitized actual installer XLSX** (not included in GitHub).
- [ ] Confirm field-level scope descriptions and whether all real monthly reports represent full installer population.
- [ ] Separate equipment and installer filter preferences (F3), implement shared analytics abstraction (F2), full profile/comparison UX (F4), commercial rules (F5).
- [ ] Windows file-open browser, multi-month import/reload, export, responsive layout, and full backed-up workspace acceptance (F6).
- [ ] Merge only with explicit user approval after all V2 gates.

This file is deliberately outside `codigo-fonte.zip`; the dedicated QA-only commit triggers independent PR validation **after** generated files are synchronized, avoiding a race between distribution regeneration and stale-file checks.

No customer activation data, credentials, or production spreadsheets are committed.
