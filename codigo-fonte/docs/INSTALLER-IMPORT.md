# Installer import foundation

This release adds the Installers workspace to the existing equipment dashboard.
Installer values mean inverter activations during each month, without model detail.
It does not implement installer growth KPIs, rankings by growth, completeness declarations,
commercial actions, forecasts or device-to-installer joins yet.

## Import

1. Open Installers and choose an XLSX or comma-separated CSV file.
2. Choose the worksheet, header row and installer-name column. The other populated
   columns must be months, apart from an optional trailing Total column.
3. Supported month headers: YYYYMM, YYYY-MM, ISO dates, English month + four-digit year,
   and Excel 1900-system numeric dates. A 1904-system workbook should first be exported
   with YYYYMM headers. The exact production workbook has not yet been supplied.
4. Review the changes. Download the full preview CSV when the on-screen 200-row preview
   is insufficient. The final Total column is ignored even if it contains an error.
5. Before confirmation select the reporting scope: **Partial update** (default, no assumption for omitted installers) or **Full installer population** (explicit checkbox confirmation required). A Full declaration applies to each imported month, and missing installers are treated as confirmed zero for those months. An old partial month stays unknown.
6. Confirm the import. Blank monthly input cells are confirmed zero, including when
   replacing an earlier nonzero value. A missing monthly column is not zero.
   Error/formula-without-cache cells are rejected, not converted to zero.

Source names are matched case-insensitively after trimming/collapsing spaces.
Repeated source names in one file are summed month by month. Each file is a snapshot
of the named sources and months it supplies, not an incremental batch.
Reimporting replaces those source/month snapshots. Omitted sources and months remain.

## Unify accounts

Select two or more accounts, choose Unify selected, review all monthly sums and enter
a consolidated name. Every selected account contributes its activations by addition.
Automatic suggestions recognise spacing, accents and common Solar/Ltd/Limited suffix
variations, including BordGais Energy / Bord Gáis Energy Solar / Bord Gáis Energy.
Suggestions never merge accounts without confirmation. Other names can be selected manually.

Original source-name records are retained. Returning source names automatically resolve
to the consolidated account. A previously unseen spelling still needs review.
An import containing just a new consolidated name cannot be assumed to replace every
old alias: import the original source-name breakdown or resolve the identities first.

Click an account for monthly values and filename/worksheet/cell evidence.
Undo union restores account identities while retaining any subsequently corrected values.
Overlapping later unions must be undone first. Undo import restores source values only;
identities and unions remain, protecting later history. Later overlapping imports block undo.

## V2 full-coverage declarations

- Full is an explicit human-confirmed declaration about the complete tracked installer population **per imported month**. A newer full file supersedes earlier source/month records for omitted names; older values remain for audit and undo but no longer contribute to active totals until reintroduced by a later partial correction. Effective source observations remain additive across distinct labels. If a company is absent from a confirmed full month it contributes **zero**, not unknown; missing aliases inside the same account no longer falsely mark that month incomplete.
- Partial is the default and preserves conservative source/month coverage. Old files and old schema-2 backups do not gain artificial completeness. A partial correction of a previously full month preserves its full-scope declaration.
- Declared months retain source filename, worksheet, import ID and timestamp. Undo a full-scope import restores the preceding scope, or deletes it if no earlier declaration existed. Overlapping later scope changes block unsafe undo.
- In analytics a confirmed full month counts one reporting unit per account, not one per label; partial months retain the prior per-source observation check. Charts, profiles, rankings and exports use the common measure function.
- Full scope should **only** be confirmed where the user has evidence of a complete population for all covered months. Do not mark a filtered report or partial extract as Full.
- Schema-2 backups predating the ledger migrate by adding an empty `installers.coverage` map, while keeping the schema version and all original records.

## Storage and migration

Schema 2 adds `installers.accounts`, `sources`, `imports`, `merges`, and an optional backward-compatible `coverage` map. Equipment
records, product coverage, targets and history remain separate. Schema-1 backups migrate
in memory to empty installer collections. The existing IndexedDB name and object store
are unchanged. New backups contain both datasets and their histories. Older releases
cannot open schema-2 backups; retain a pre-upgrade backup if rollback is required.

No installer data is uploaded to GitHub. No analytics service, network request or new
runtime dependency is introduced. Source files are parsed locally by the existing reader.

## First-release interpretation

The table ranks reported subtotals over the selected period and displays months with
records. It does not claim full portfolio coverage. Source evidence preserves missing
months within merged accounts. Open/future periods are provisional. Equipment totals
and installer totals must not be added together or assigned to each other's dimensions.

## Verification

`npm test` covers duplicate sums, blank-to-zero replacement, absent months, Total exclusion,
reimport idempotency, alias union/reimport/undo, correction conflicts, XLSX ZIP ingestion,
backup migration and malformed backup rejection, escaped UI content, and a 1,000-account
by 48-month fixture. Existing equipment regressions run unchanged alongside these checks.
`tools/browser-smoke.mjs` exercises CSV preview/import, manual union, repeated import,
reload persistence, undo, suggestions and source evidence in temporary Chromium storage.
Production XLSX and manual Windows acceptance remain separate release checks.

## Stage 2 — portfolio analytics

Installers now includes period filters, monthly/quarterly/annual trends, comparison overlays,
activation and active-account KPIs, volume ranking, contribution to change, retention,
Top 5 share, HHI, YTD, rolling three-month momentum, individual profiles and a monthly heatmap.
Click a point or cell to inspect original file/sheet/cell evidence. Export KPI or monthly CSV.

Blank cells in imported month columns are zero. Missing source-month records remain unavailable.
A complete interval requires every tracked source alias to report every selected month and
all months to be closed. This conservative coverage rule also applies after account unions.
Open/future periods and missing coverage show provisional subtotals; growth, retention and
shares are withheld where their required base is incomplete. Zero denominators have no growth
percentage. Custom comparison intervals of different lengths have no growth or retention.
Same comparable installers includes only accounts with complete coverage in both intervals.
Search and pagination affect the table and heatmap, never portfolio denominators.
Period shortcuts end at the latest complete month; earlier gaps remain flagged.
Volume ranks include provisional reported subtotals and share tied ranks. Top 5 and HHI
measure this tracked portfolio, not market share. Activity means at least one activation
in the entire interval, not the sum of monthly active counts. Momentum compares the final
three selected months with the preceding three, independent of comparison selection.

The user confirmed the first-stage import/union flow worked. Production XLSX contents have
not been inspected in this workspace. Stage 2 needs user acceptance on the actual dataset.
