# Screenshot capture execution report — Huawei Activation Analytics V2.1

**Execution date:** 15 October 2026
**Branch:** `docs/executive-overview-deck-plan-2026-10-15`
**Status:** All planned 10 UI captures and 3 reserve captures generated; runtime/domain validations passed.
**Application package used:** `Huawei_Activation_Analytics_V2.1.0_Release_Candidate.zip`, SHA-256 `e4d42ec53b6b437fc0e05b52200670bbcea5b6bc75b9ff794e5c14f824eeae64`
**Data:** fictional CSV source matrices, January 2023–September 2026. October 2026 excluded from headline screenshot analyses.

## Deliverable asset location

**Persistent ChatGPT Library folder:** `/Huawei Activation Analytics/Executive Presentation Assets/`

Files saved there:
- `Huawei_Activation_Analytics_Presentation_Screenshots_2023-2026.zip` — 10 presentation-ready PNG crops, 3 reserves, 13 original viewport screenshots, PNG contact sheet, a JSON application backup, README, and capture manifest.
- `Screenshot_Contact_Sheet.png` — all 10 approved primary captures on one inspection page.

**Important:** PNG/ZIP binary assets are **not committed to this GitHub branch**. They are preserved as the downloadable artifact and in the user's persistent file Library. This branch contains the capture methodology and execution record. The library files and ZIP were actually created and verified; do not imply the images are available as repository blob paths.

## Captured and verified assets

| ID | Slide | Prepared PNG basename | Primary visual |
| --- | --- | --- | --- |
| S01 | 01 | `S01_overview_dashboard.png` | Actual Overview interface; key KPIs, January–September 2026 |
| S02 | 03 | `S02_equipment_import_validation.png` | Real equipment import preview; 45 months and 10 inverter models |
| S03 | 03 | `S03_installer_import_validation.png` | Real installer import preview; 25 source names, one repeated source row |
| S04 | 04 | `S04_equipment_filters_kpis.png` | Expanded period, aggregation and product filters, with KPIs |
| S05 | 04 | `S05_target_attainment.png` | Targets table with fictional manually defined July–September category objectives |
| S06 | 05 | `S06_bms_inverter_long_term_quarterly.png` | Genuine quarter-by-quarter BMS/Inverter chart, Q1 2023–Q3 2026 |
| S07 | 06 | `S07_compare_three_installers.png` | Actual 2–6 compare page with Silverfern, Cedarfield, Harbourlight |
| S08 | 06 | `S08_installer_name_merge_suggestions.png` | Two genuine unconfirmed name-variant suggestions in Account management |
| S09 | 07 | `S09_insights_harbourlight_decline.png` | Declining / High priority rule-based insight, filtered to Harbourlight |
| S10 | 07 | `S10_harbourlight_installer_profile.png` | Harbourlight account KPI −42.5% and profile evidence |

Optional reserves: `R01_installer_portfolio_ranking.png`, `R02_inverter_model_analysis.png`, `R03_harbourlight_monthly_history.png`. Use R03 in Slide 7 if the final composition needs a clearly legible monthly history chart rather than the whole S10 viewport.

Slides 02 and 08 deliberately have no software screenshots.

## Execution results

- **Domain imports:** 450 inverter activation entries, 225 battery-module/BMS entries and 25 distinct installer source names successfully passed the release's actual validation and commit logic.
- **Name resolution:** one repeated identical source name was summed during parsing, and the two intended suffix-based duplicate suggestions appeared in the actual UI; independently confirmed merges were tested using the release domain implementation.
- **Equipment trend:** 15 complete quarterly BMS-per-100-inverters data points from Q1 2023 to Q3 2026, all marked complete.
- **Installer insight:** `DEMO Harbourlight Solar Ltd` produced **40** in April–June 2026 and **23** in July–September 2026 (−17, **−42.5%**); original rule engine returned **Declining**, **High**.
- **Browser:** application UI rendered, navigated and accepted file previews for the actual fictional CSV sources; screenshot run reported no page JavaScript errors.
- **Asset QA:** 10 primary images, 3 reserves and 13 original viewport images; 10 principal PNGs exceeded 1,200 px width. PNG contact sheet generated for inspection.
- **Preservation:** no application source files, build scripts, releases or the default GitHub branch were altered.

### Browser capture environment qualification

The available capture browser has restrictive local-URL navigation/storage policies. For this environment only, the original offline HTML was rendered inside a transient document with **temporary in-memory persistence replacing the browser-storage adapter**; the underlying UI components, domain calculations, rule engine, target logic and import validation routines were unchanged. The source distribution ZIP was not altered. The two file-import views depict real importer previews. Other views were populated using the release's original validation and commit functions, with a saved synthetic backup included in the screenshot ZIP.

This is valid evidence of the UI and analytics logic for a **fictional demonstration**, but is **not** a substitute for manual acceptance of the distribution on the recipient's Windows browser.

## Use in the final PDF/PPTX

- Use `ppt_ready/` images; keep `originals/` as provenance.
- Label each slide using the fake matrix **Illustrative synthetic data** where relevant.
- For Slide 5: use quarter-by-quarter chart screenshot S06; if quoting year metrics, compare identical January–September intervals (2023: 29.6, 2024: 44.4, 2025: 58.9, 2026: 73.4 BMS activations per 100 inverter activations).
- For Slide 7: show **40 → 23 / −42.5%** in native editable PPT elements; use S09/S10 as supporting evidence.
- These are **recorded activation signals**, not actual Huawei activity, sales, Irish market share, proven battery attachment or confirmed causes of installer behavior.
- Use standalone textual annotations; do not require a live presentation.

## Next approval gate

1. Assemble the agreed **8-slide**, self-explanatory English PPTX and equivalent PDF from these verified images.
2. Check screenshot readability and all numeric claims at full-slide and PDF page view.
3. Verify executable ZIP separately on a standard Windows computer.
4. Keep any remaining ambiguous source-system name and exact export count as an explicit user confirmation rather than inventing it.

Related: [Master deck plan](EXECUTIVE_PRODUCT_OVERVIEW_PLAN.md), [Screenshot capture instructions](SCREENSHOT_CAPTURE_PLAN.md), [Fictional dataset guide](demo-data/README.md).
