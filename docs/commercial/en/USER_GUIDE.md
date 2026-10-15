# Huawei Activation Analytics V2.1 — Commercial User Guide

**For channel managers and commercial teams.** The purpose is to spot important shifts in **recorded Huawei installer activations** and translate them into informed conversations and practical market actions.

## 1. Start safely

Download or extract the project and open its root `index.html` in a modern browser. The offline application does not require a server or internet connection. **Explore fictional demo** is safe for learning and does not overwrite your real workspace. Real data is saved in the current browser/profile when persistence is available; otherwise the app warns **Session-only workspace**. Back up through **Data → Backup & guide → Download full backup** before closing, moving files or changing devices.

## 2. Import reliable installer activity first

1. Go to **Data → Installer imports** and select a supported `.xlsx` or `.csv` monthly matrix: one installer per row, months in columns, optional trailing Total ignored.
2. Check worksheet, header row and company-name column. Repeated normalised names within a file are **summed**; `Total`, `Grand Total` and `=== 总计 ===` summary rows are ignored.
3. Check the file preview against the source totals. Identical source/month re-imports replace records instead of double-counting.
4. Choose **Partial update** (safe default) unless **Full installer population** is genuinely confirmed for every month in that import. A blank cell within an imported month column is zero; an omitted month or omitted account in a partial update is **unknown**.
5. Confirm changes; check import history. In **Installers → Installer overview → Account management**, manually review likely name variants before unifying them. Confirmed identities are summed and source history retained.

**Commercial consequence:** A false zero can trigger a false inactivity or decline story. Coverage checks are part of account management, not administrative overhead.

## 3. Detect where demand may be moving

Open **Installers → Insights & priorities**. Choose a closed **From / To** interval, use a same-duration comparison and check reporting completeness. Start with the default **minimum volume 5** and **minimum change 20%**; adjust if your portfolio has very different account sizes.

Review **High**, **Medium**, **Low** and **Data check** queues. Signals include meaningful decline/growth, confirmed three-month inactivity, reactivation, first recorded activity after three zeros and activity after a zero comparison baseline. These are deterministic, explainable rules, **not churn predictions**. Export **all insights CSV** for review and offline follow-up; the export carries source evidence and proposed next actions.

## 4. Investigate an individual partner

In **Installers → Installer profile**, search by installer name or stored alias. Examine the selected-period values, historic monthly/quarterly/annual trends, last positive activity, historical high, reported gaps and source details. Compare with prior like-for-like periods and record the questions you need to ask. Distinguish a real volume change from an import, calendar or data coverage issue.

## 5. Compare partner movement

**Installers → Compare 2–6** shows the reported trends and values for two to six named accounts. A base-100 indexed chart appears **only** when every selected company has a complete, positive first displayed reporting bucket; otherwise use absolute volumes. Avoid interpreting different account size as relative performance without normalising appropriately.

**Installers → Installer overview** provides rankings, tracked account shares, active counts, retention, concentration and a monthly heatmap. Rankings and portfolio shares refer to the **reported Huawei installer base**, not the entire Irish solar market.

## 6. Read the wider Huawei market signal

Use **Overview**, **Inverters**, **Batteries & BMS** and **Comparisons** to inspect total product activation trends and mix. Use **Targets** for manually defined objectives. The installer dataset and the product dataset do **not** contain a device-to-installer link: you can discuss overall inverter or battery movement, but cannot claim that installer A uses model B from these files.

## 7. Turn insight into action

For a priority account: **(a)** verify data; **(b)** open profile and quantify the movement; **(c)** contact partner to qualify reasons; **(d)** offer stock, training, commissioning support, product positioning or distributor coordination; **(e)** record owner and follow-up in your external CRM/action log; **(f)** review after the next complete import.

Consult [Channel Manager Playbook](CHANNEL_MANAGER_PLAYBOOK.md) for a signal-to-action table, fictional examples and suggested response times. The dashboard **does not** automatically email installers, sync CRM records or ingest real-time data.

## 8. Data integrity and interpretation

| Term | Correct interpretation |
|---|---|
| **Activation** | Recorded Huawei equipment activation, not proven sale, revenue or installed household |
| **Declining / Growing** | Meaningful variation over complete, equal-length compared intervals under set thresholds |
| **Inactive** | Three consecutive *closed, complete* zero months plus earlier positive activity |
| **Data check** | Source or period insufficient for reliable commercial interpretation |
| **Installer share** | Share of the eligible *tracked reporting portfolio*, not national market share |
| **Priority score** | Rule-based ranking for investigation, not likelihood of churn |
| **Product mix** | Aggregate product data; cannot identify a named installer's model choices |

## 9. Export, security and troubleshooting

- Export CSV summaries and full backup as needed; confidential files should remain in approved internal storage.
- **No growth %?** Review incomplete coverage, unequal periods and zero denominators.
- **Installer not found?** Search aliases, check import scope and use the full profile picker.
- **Inactive alert seems wrong?** Inspect three closed months, source evidence and potential missing data.
- **Indexed comparison unavailable?** A selected account may have zero/incomplete initial baseline.
- **Data disappeared after moving the HTML?** Browser-local storage is origin/profile-dependent; restore the JSON backup.

**Useful next read:** [Project overview](PROJECT_OVERVIEW.md) · [Commercial quick start](QUICK_START.md).