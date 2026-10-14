# Installer reporting and comparison — data contract V2

Status: **draft contract + existing behavior locked by tests**. Future reporting-scope functionality must be accepted before user data migration.

## 1. Existing inputs

`equipment` matrix: product model × month, separated into inverter, battery module, BMS.  
`installers` matrix: installer name × month, **inverter activation count only**. Optional trailing `Total` column is ignored. Summary rows (`Total`, `Grand Total`, `=== 总计 ===`, `合计`) are excluded as source identities and from all installer activation sums; their numerical values are ignored by the installer importer. Empty monthly cells in an imported column mean **0**. Missing month columns mean **unknown**, never implicit zero.

`validateInstallerMatrix` validates the installer matrix, preserves cell provenance, sums repeated normalized name rows, checks nonnegative safe integers, and rejects error cells/formulas without cached results.

## 2. Identity and additive consolidations

- `installerSourceKey(name)` defines exact import identity with case and whitespace normalization. Do not change this key lightly: existing backups depend on it.
- A **source** is an imported name + monthly snapshots + evidence.
- An **account** is a user-confirmed grouping of one or more source names.
- Repeated rows of the **same source name in the same file** sum, then replace the prior source-month snapshot.
- Distinct source names merged into an account contribute **additively** for overlapping months.
- Suggestions of similar spelling are never automatic merges.
- Undo import restores source-month snapshot values. Undo union restores account identities without erasing later source corrections.

## 3. Evidence and coverage vocabulary

| State | Evidence | Meaning in numeric calculations |
|---|---|---|
| Observed positive | Imported source-month cell > 0 | Count toward reported activation totals |
| Observed zero | Explicit zero or blank cell in an imported month column | Count as 0, genuinely observed |
| Unknown | No source-month observation and no confirmed full-report coverage | No invented 0; denominator not fully observed |
| Outside confirmed scope | A period/source outside an explicitly declared reporting universe | Do not count as required reporting cell; not equivalent to 0 |
| Open month | Calendar month not yet closed in Europe/Dublin | Provisional regardless of numeric availability |
| Confirmed full-population zero (proposed F1) | Source absent in a month with explicitly approved full snapshot applicable to that source | Count as 0 with documented coverage evidence |

**Do not create implicit zeros for missing aliases** from guessed start dates or mere spelling similarity. The current engine conservatively expects every observed source alias to cover every month; F1 will replace this with an explicitly defined coverage ledger so alias churn does not falsely disable historical growth.

## 4. Snapshot completeness requirements (F1)

A monthly import must declare **Full snapshot** or **Partial update** for the relevant reporting universe and effective months. File name alone cannot declare completeness. A Full snapshot requires explicit human confirmation that all reporting companies are represented (or that any absent ones are confirmed zero) for those months. Subsequent partial changes must not silently revoke or manufacture full-report scope.

Suggested ledger grain: `reportingScopeId × month × sourceFile/importId`, with explicit approved scope status, covered population, timestamps and provenance. Work out conflict/override precedence for repeated imports *before* persisting this ledger. Existing schema-2 backups without a ledger must remain valid with unknown implied coverage.

## 5. Analysis math and safeguards

For complete, equal-length periods:
- `change = current - previous`
- `growth % = (current / previous - 1) × 100`, only for previous > 0
- `share % = installer activations / tracked-portfolio activations × 100` only with a complete eligible denominator
- `retention = active in both / active in previous` with both intervals complete
- `Top 5 share` and `HHI` are about **tracked Huawei activations**, not Ireland market share
- `3M momentum` compares consecutive three-month total activations, only when both windows interpretable

When a period or numerator is partial, display **reported subtotal** with completeness label, but withhold definitive percentage/retention/portfolio-share claims. For custom periods with unequal lengths do not display raw-total growth as meaningful; optional average-per-month requires explicit labeling.

**Comparable cohort**: accounts with interpretable coverage in both periods. Selection must be stable across both periods for portfolio growth and contributions. No source alias should be double counted during grouping.

## 6. Independent testing requirements

Synthetic fixtures include: duplicated name row, two spelling variants merged and summed, reimport replacement, blank versus omitted month, ancient vs current backup, no previous denominator, partial/reporting-complete mixed months, inactive installer and reactivated installer, full scope after new alias, chart/CSV reconciliation and at least 1,000 accounts × 48 months.

Fixture names must be fictional. No uploaded Huawei/client data or account secrets in repository, pull requests or CI artifacts.
