# FICTIONAL presentation data — Huawei Activation Analytics V2.1

> **DEMO DATA ONLY.** Every activation count, installer name, event pattern, target and market conclusion in this folder is **synthetic**. Real model identifiers are used solely for software compatibility. Do not describe these records as actual Huawei Ireland data or proof of Irish market share, real installations or commercial performance.

## Dataset design
- **Coverage:** 45 completed months, **January 2023–September 2026**, plus a separate **October 2026** open-month, deliberately partial illustration. October 2026 is not a complete reporting month as of 15 October 2026.
- **Equipment:** 10 real-looking catalogued inverter model IDs and 5 catalogued battery module/BMS model IDs; wholly fabricated values.
- **Installers:** 25 fictional source-name labels (26 data rows because one label is repeated intentionally). Monthly installer activation totals reconcile with inverter totals for each closed month in the synthetic scenario; the datasets still have **no device-to-installer model link**.
- **Duplicates:** `DEMO Liffey Meadow Solar Ltd` appears in two source rows and must be summed on import; `DEMO Liffey Meadow Solar Ltd` vs `DEMO Liffey Meadow Solar Limited` and `DEMO Northstar PV Ltd` vs `DEMO Northstar PV Limited` are **different source names** intentionally designed to prompt a human-reviewed merge suggestion.
- **Signals:** sustained multi-year growth in aggregate BMS activations per 100 inverter activations; abrupt decline, strong growth, verified inactivity and reactivation in particular fictional accounts.
- **Targets:** `DEMO_TARGETS_REFERENCE.csv` contains illustrative monthly objectives. **Targets cannot be bulk imported from this file** in V2.1; enter selected values manually in the Targets view if a target screenshot is needed.

## Recommended import order (real workspace, not “Explore fictional demo”)
1. Back up any existing real workspace or use a clean, isolated browser profile. Importing a demo CSV into a real workspace **will change that workspace**. The app's built-in **Explore fictional demo** is a separate temporary mode, but does **not** contain this 2023–2026 scenario by default and does not allow importing into demo mode.
2. In **Data → Equipment imports**, import `DEMO_EQUIPMENT_INVERTERS_2023-01_to_2026-09.csv` with dataset **Inverters**, header row **1**, and confirm **Inverter** category coverage only after checking the preview.
3. In the same screen import `DEMO_EQUIPMENT_BATTERY_BMS_2023-01_to_2026-09.csv` with dataset **Battery modules & BMS**. Confirm **Battery module** and **BMS** coverage after the preview.
4. Under **Data → Installer imports**, import `DEMO_INSTALLERS_2023-01_to_2026-09.csv`, using row **1** and name column **A**. Select **Full installer population** and explicitly confirm: the **synthetic file is designed as the entire fictional reporting population** for those 45 months. Do **not** make the same claim for live partial source data.
5. Go to **Installers → Installer overview → Account management**. Review suggested similar names. Unify only the intended fictional duplicate pairs after checking monthly sums; the exact repeated source name was already summed during import.
6. Select **2026-04 to 2026-06** versus **2026-07 to 2026-09** (equal three-month periods), or use Insights & priorities ending **September 2026** and the preceding 3 months. For a multi-year view use **2023-01 to 2026-09** in equipment filters; compare 2023 and 2026 via valid time windows (2026 covers nine completed months only).
7. For an optional **incomplete-month demonstration**, import the separate `2026-10_PARTIAL.csv` files **last**. In equipment import **do not confirm any October category coverage**, and in installer import choose **Partial update**, not Full. The October files intentionally omit products and installer names; these missing values must not become confirmed zeros. Do **not** use October in completed-month trend comparisons.
8. Optionally enter a few reference targets manually on the **Targets** screen. Download a JSON backup after the imports (Data → Backup & guide) for repeated demonstrations.

## Synthetic checks and presentation takeaways

| Period | Inverter activations | BMS activations | BMS per 100 inverters |
| --- | ---: | ---: | ---: |
| 2023 | 5,133 | 1,613 | 31.4 |
| 2024 | 6,235 | 2,880 | 46.2 |
| 2025 | 7,336 | 4,466 | 60.9 |
| 2026 (Jan–Sep) | 6,267 | 4,602 | 73.4 |

**Slide 5:** BMS activations per 100 inverter activations rise in the fabricated data over 2023–2026; use these as **fictional illustrative data**, not a demonstrated finding about Ireland. Use the **same January–September months each year** for the like-for-like headline below. This is an aggregate activation ratio, **not a proven battery attachment rate**.

| Jan–Sep each year | Inverter activations | BMS activations | BMS per 100 inverter activations |
| --- | ---: | ---: | ---: |
| 2023 | 3,771 | 1,118 | 29.6 |
| 2024 | 4,603 | 2,043 | 44.4 |
| 2025 | 5,434 | 3,200 | 58.9 |
| 2026 | 6,267 | 4,602 | 73.4 |

**Slide 7:** `DEMO Harbourlight Solar Ltd` goes from **40** in Apr–Jun 2026 to **23** in Jul–Sep 2026, an absolute change of **-17** and **-42.5%** (fictional). Select fully reported equal-length periods, check the history and treat the change as an investigation prompt.

**Other synthetic situations:** `DEMO Silverfern Energy Ltd` grows markedly in Jul–Sep 2026; `DEMO Cedarfield Renewables` falls sharply; `DEMO Copperleaf Renewables` has confirmed zero activations June–September after prior activity; `DEMO Blue Harbour Energy` returns in September after three fully reported zero months June–August. The software only surfaces a specific signal when its selection, coverage and rule thresholds support it.

## Files
- [DEMO_EQUIPMENT_INVERTERS_2023-01_to_2026-09.csv](DEMO_EQUIPMENT_INVERTERS_2023-01_to_2026-09.csv)
- [DEMO_EQUIPMENT_BATTERY_BMS_2023-01_to_2026-09.csv](DEMO_EQUIPMENT_BATTERY_BMS_2023-01_to_2026-09.csv)
- [DEMO_INSTALLERS_2023-01_to_2026-09.csv](DEMO_INSTALLERS_2023-01_to_2026-09.csv)
- [DEMO_EQUIPMENT_INVERTERS_2026-10_PARTIAL.csv](DEMO_EQUIPMENT_INVERTERS_2026-10_PARTIAL.csv)
- [DEMO_EQUIPMENT_BATTERY_BMS_2026-10_PARTIAL.csv](DEMO_EQUIPMENT_BATTERY_BMS_2026-10_PARTIAL.csv)
- [DEMO_INSTALLERS_2026-10_PARTIAL.csv](DEMO_INSTALLERS_2026-10_PARTIAL.csv)
- [DEMO_TARGETS_REFERENCE.csv](DEMO_TARGETS_REFERENCE.csv)
- [DEMO_METRICS.json](DEMO_METRICS.json) — monthly reference metrics and year-level expectations.
- [generate-demo-data.mjs](generate-demo-data.mjs) — reproducible source. Run `node generate-demo-data.mjs <output-directory>` to regenerate all CSV files and JSON metrics.

## Safety & scope
- Never upload original confidential workbook contents, customer identities or real source evidence to this repository.
- Do not mix the fictional data into the user's real local workspace. Use a separate browser profile and full backup.
- All numbers are generated; they do not report Huawei sales, market share, demand, competitor switching, battery installations or customer churn.
- The base is prepared for 2023–2026 visuals; it does not change, extend or validate any application functionality.
