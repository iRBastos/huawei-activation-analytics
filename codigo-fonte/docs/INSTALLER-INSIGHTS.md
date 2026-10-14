# Installer insights & priority methodology — V2

## Purpose and scope

**Installers → Insights & priorities** turns imported monthly Huawei inverter activations into a reviewable contact list for account management. It does not analyse product installations per company, revenue, Irish market share, installation sites or competition. It does not infer *why* activations changed. Suggested actions are prompts for a conversation, not automatic conclusions.

Every installer name is a **consolidated account** whose source identities have been manually approved, and every quantity comes from the same period measure used by the dashboard, chart and CSV.

## Filters

- Set the reporting **From / To** months in Installers; this is separate from equipment reporting dates.
- Choose a **comparison period** of equal length. The current and previous periods must both be completely reported before a growing/declining alert can be issued.
- **Minimum relevant volume:** 1, 5 (default), 10 or 25 activations. The previous period must meet this minimum. The absolute change must also reach the minimum.
- **Minimum percentage change:** 10%, 20% (default), 30% or 50%.
- Priority, signal type and installer search filter the visible table; **Export all insights CSV** exports all computed accounts and their evidence, regardless of table search.
- The two significance thresholds persist in the local installer preferences and round-trip through a full backup. Older backups receive the defaults without changing saved equipment filters.

## Signal definitions

| Signal | Required evidence |
|---|---|
| **Inactive** | Three consecutive **closed** months ending at the selected To month, each fully covered and equal to zero; plus positive recorded activity earlier than that three-month window |
| **Reactivated** | Latest closed month is confirmed positive; three immediately preceding months are fully covered zeros; positive activity also recorded before those zero months |
| **First recorded activity after confirmed zeros** | Latest closed month is positive; preceding three months are fully covered zeros; no earlier positive activation is recorded in the imported history. **This does not mean a company was newly founded or is a new Huawei installer.** |
| **Declining** | Equal-length current and previous periods complete; previous total >= minimum volume; decrease >= minimum absolute change and minimum percentage threshold |
| **Growing** | Same complete-period and significance checks, but for an increase |
| **Activity after zero comparison baseline** | Current selected period and previous comparison are complete; previous = 0, current positive. Percentage growth stays **unavailable**, never infinite. |
| **No significant movement** | Complete comparable periods with no higher-priority signal and no change passing the thresholds |
| **No recorded activity in selected periods** | Current and previous intervals are fully covered and both exactly zero, without a confirmed inactivity history |
| **Verify reporting coverage** | Current or comparison period is missing coverage, is open/future, or intervals are unequal and no independent closed-month inactivity/reactivation/first-activity signal can be demonstrated |

The independent three-month evidence signals may be valid even if a separate selected comparison period is incomplete. Their evidence text explicitly names the confirmed months. Incomplete cells do not become zeros, and prior source rows superseded by a newer full-population report do not count as current activity.

## Priority scoring

The score is deterministic, **not a probability**. It combines:

1. **Signal weight:** 45 for inactivity/reactivation, 35 for decline, 25 for growth, 20 for first-activity and activity-after-zero, 10 for stable/no activity.
2. **Recent account activity band:** 20 points for relevant volume at least 4 × the minimum, 10 for at least 1 × the minimum, otherwise 0. For inactivity/reactivation, positive activity within the last 12 months is considered so a previously active account is not assigned a low score solely because it now has zero.
3. **Current-versus-previous change band:** 20 points for change at least 4 × the volume minimum, 10 for at least 1 × the minimum, otherwise 0.

Maximum score is 100. **High ≥ 60**, **Medium 30–59**, **Low < 30**. A **Data check** has *no commercial score*; it is ordered below commercial priorities but remains visible for import follow-up. Changing the thresholds recalculates labels and priorities deterministically.

## How to act on the results

A high-priority decline is a reason to **contact the installer and ask about the activity**, not evidence of loss to a competitor. An inactive account merits checking its status and the period's reporting completeness. A growing account may merit marketing, stock or training discussions. A data-check account should be investigated via **Data → Installer imports** before any conclusion.

Click the installer name to open the **Installer Profile** with monthly/quarterly/annual trends, source evidence and the same account signal. The CSV contains the exact derived label, priority, score, coverage statuses, observed volume, difference, explanation, recommended next action and thresholds.

## Validation and limitations

Synthetic regression coverage checks reactivation/inactivity/zero baselines, significance thresholds, incomplete reporting, no overstatement for future months, deterministic sorting, matching CSV and legacy schema-1/2 backups. Browser smoke covers the offline insights tab and changing a saved threshold. Real confidential datasets are **never committed to GitHub**.

Passing CI and Chromium tests do **not** constitute user acceptance on a representative real installer XLSX or a manual Windows test. Both remain release prerequisites, along with the final review and explicit merge approval.
