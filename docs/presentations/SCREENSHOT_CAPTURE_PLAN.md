# Screenshot capture plan — Huawei Activation Analytics V2.1

**Purpose:** Capture exactly the software evidence needed for an **8-slide, self-explanatory executive overview** shared asynchronously as PDF/PPTX alongside the offline application.  
**Status:** Approved capture *plan* only; screenshots still need to be captured and browser-verified.  
**Working branch:** docs/executive-overview-deck-plan-2026-10-15.  
**Source data:** [Reproducible synthetic matrices](demo-data/README.md), not customer data.

## A. Design decision

- **10 primary software captures S01–S10**, used across slides 1, 3, 4, 5, 6 and 7.
- Slides **2 and 8 contain no software screenshots**; use native PowerPoint text/shapes only.
- 3 extra reserve captures R01–R03 are useful if a final composition needs a clearer feature illustration, but **do not add them automatically**.
- Avoid more than 2 captures on any slide; one legible primary screenshot and one compact detail is better than a UI collage.
- The slide viewer will not hear a presentation: each slide needs a one-line conclusion next to its evidence.
- Keep the printed screenshot source coherent: no misleading reconstruction of a continuous app screen from multiple crops; separate UI crops with obvious spacing.

## B. Prepare the synthetic workspace (critical)

1. Use the exact approved offline V2.1 build that will be distributed; do not change program source or release files to improve screenshot appearance.
2. Use a new local browser profile or isolated browser workspace. **Never import these fictional files into a production/personal workspace containing real activation records.**
3. **Do not use the built-in “Explore fictional demo” mode for this scenario:** that bundled demo is different and does not permit file imports. Use the separate synthetic CSVs in the real-mode interface of an isolated profile.
4. Import the three **closed-month** CSVs, all covering **January 2023–September 2026**:
   - \`DEMO_EQUIPMENT_INVERTERS_2023-01_to_2026-09.csv\` under **Data → Equipment imports** with dataset **Inverters**, confirming complete Inverter category coverage only after reviewing the import preview.
   - \`DEMO_EQUIPMENT_BATTERY_BMS_2023-01_to_2026-09.csv\` under **Data → Equipment imports** with dataset **Battery modules & BMS**, confirming complete coverage of the two relevant categories.
   - \`DEMO_INSTALLERS_2023-01_to_2026-09.csv\` under **Data → Installer imports**, using the **Full installer population** declaration because the source is the *entire fictional reporting population*, and explicitly reviewing the proposed values.
5. For S02 and S03, take screenshots of the **validation/preview states before committing the relevant imports**. A screenshot taken after confirming the import will no longer show the same preview.
6. **Before account unification**, capture S08 (suggested duplicate-name matches). Next, manually review/confirm intended synthetic aliases. The repeated exact source label is summed by import and is not a pending merge suggestion.
7. Set manually selected **July, August and September 2026** category targets using \`DEMO_TARGETS_REFERENCE.csv\`. The app **does not support bulk target CSV import**. Capture S05 only after valid attainment values appear.
8. **Do not import** the optional October 2026 partial CSVs for the core presentation screenshots: October is open as of 15 October 2026. These are reserved for a separate missing-coverage example, not a headline trend.
9. Save an application full JSON backup to recreate exactly this synthetic workspace before capturing the final images.

### Reusable filter presets

| Preset | Equipment/installer interval | Comparison/aggregation | Scope |
| --- | --- | --- | --- |
| P1 — Executive overview | 2026-01 to 2026-09 | Monthly; same months previous year | All equipment categories, models and families |
| P2 — Flexible product filters | 2026-01 to 2026-09 | Monthly; expand Analysis options & Product scope | Show period, category, family, model controls; avoid changing scope in a way that creates blank/inapplicable KPIs |
| P3 — Targets | 2026-07 to 2026-09 | Actual vs entered 3-month targets | All product categories, family=All, model=All |
| P4 — BMS trend | 2023-01 to 2026-09 | **Quarterly**, 15 complete calendar quarters | All categories/families/models, so BMS/Inverter ratio remains valid |
| P5 — Compare installers | 2026-01 to 2026-09 | **Quarterly**, optionally indexed to 100 where first bucket is valid | Three fictional accounts: Silverfern Energy, Cedarfield Renewables, Harbourlight Solar |
| P6 — Decline investigation | 2026-07 to 2026-09 | Compared to immediately previous 3 months (2026-04 to 2026-06) | Installer **DEMO Harbourlight Solar Ltd**, both periods complete |

### Screenshot register

| ID | Slide | Application screen | Exact scene to capture | Slide treatment |
| --- | --- | --- | --- | --- |
| **S01** | 1 | **Overview** | Preset P1. Page heading, 4 top equipment KPI cards and top of first activation chart. Avoid very long page screenshot. | Large 55% right-side hero image, framed, with subtle shadow. |
| **S02** | 3 | **Data → Equipment imports** | Import/validation preview after selecting inverter CSV and before clicking confirm. Show "Equipment imports", progress, file/preview and relevant record/model/month counts. | Lower-left evidence crop; do not include hundreds of matrix columns. |
| **S03** | 3 | **Data → Installer imports** | Import preview with 45-month coverage, source-name count and duplicate-row sum indication. Show the separate import tab/title. | Lower-right smaller evidence crop; avoid the long spreadsheet table. |
| **S04** | 4 | **Overview → Analysis options / Product scope** | Preset P2. Expand both panels to reveal **From, To, aggregation, Category, Model, Family**. Capture filter controls plus a nearby informative visual/KPI section only if legible. | Main image on right; the slide's written copy explains what filters accomplish. |
| **S05** | 4 | **Targets → Target attainment** | Preset P3 after entering targets. Crop the table heading and 3 category rows showing **Actual, Target, Attainment, Actual − target** (and coverage if space). | Secondary narrow crop below/adjacent to S04. |
| **S06** | 5 | **Overview → Battery attachment indicators → BMS / Inverter historical trend** | Preset P4. Crop **chart title, units, plot, timeline and legend**. Fifteen full quarters give an intelligible long-term line; 2026 Q4 must not appear. | 65% of slide width. Add a *native text* interpretation on the right. |
| **S07** | 6 | **Installers → Compare 2–6** | Preset P5. Select three **non-duplicate** fictional accounts. Capture selection chips/names and **one** legible comparison graph; if showing indexed view, verify all baseline periods are complete and positive. | Main comparison evidence screenshot, about 60% of slide. |
| **S08** | 6 | **Installers → Installer overview → Account management → Suggested matches** | Capture **before** confirming merges, showing the **DEMO Liffey Meadow Solar Ltd / Limited** (or Northstar PV Ltd / Limited) suggestion and the "Review union" action. | Small clearly separate inset, labelled "Human-reviewed account consolidation". |
| **S09** | 7 | **Installers → Insights & priorities** | Preset P6; filter **Activity signal = Declining**, search **DEMO Harbourlight Solar Ltd**. Show appropriate **High** priority, the account name, and current vs previous evidence if visible. Avoid an unrelated alert row. | Primary proof of the commercial signal; crop just relevant filter and row. |
| **S10** | 7 | **Installers → Installer profile** | Preset P6, same Harbourlight account. Show **Selected activations = 23**, comparison **−42.5%** and its monthly/quarterly history or Evidence-based account insight as legible. | Supporting history crop alongside S09; use PPT-native big −42.5% text rather than blowing up tiny screen text. |

**Cross-screen integrity:** S09 and S10 are the **same** installer and equivalent selected/comparison months. S08 shows the pre-merge state; S07 uses the selected post-merge state. If account totals differ due to confirmed merging, make the before/after distinction clear.

### Why no screenshot on slides 2 and 8

- **Slide 2:** The business problem is clearer as three editable, typographic problem/impact blocks; a fake Excel screenshot adds clutter.
- **Slide 8:** Outcomes and "Open index.html → Explore fictional demo / import approved files" should be editable instructions and clickable links, not a shrunken software screenshot. Note: built-in demo is **not** this extended 2023–2026 dataset.

### Reserve captures — not for automatic inclusion

| ID | Screen | Use only when |
| --- | --- | --- |
| **R01** | Installers → Installer overview (ranking + top KPIs) | The final Slide 6 layout does not sufficiently convey rankings/active installers without a picture. |
| **R02** | Inverters → product model chart with chosen LB0 models and expanded scope | Slide 4 needs a second, genuinely applied model/family-filter example, not only controls. Replace a crop; do not clutter it with a third image. |
| **R03** | Data → Coverage / 2026-10 partial | A reviewer needs evidence of incomplete reporting versus confirmed zero. Keep out of the core executive deck. |

## C. Best capture order to avoid repeated setup

**Phase 1 — before completing the imports**
1. S02: equipment validation preview; confirm inverter import afterward.
2. Import and confirm battery/BMS matrix.
3. S03: installer validation preview; confirm full synthetic installer import afterward.

**Phase 2 — before account unification**
4. S08: suggested account-name pairs; capture them with their confirmation action visibly available.
5. Review and confirm intended fictional identity unions.

**Phase 3 — after import/unification and target entry**
6. Enter reference targets for July–September 2026; capture S05.
7. P1: capture S01.
8. P2: capture S04.
9. P4: capture S06.
10. P5: capture S07.
11. P6: capture S09 and then S10 consecutively (same installer/months).
12. If necessary, R01 and R02. Do **not** force optional captures into the slides.
13. Export a full JSON backup of this final synthetic workspace.

## D. Layout and screenshot export guidelines

- Primary master resolution: **2560×1440** recommended; **1920×1080** minimum. Prefer PNG; do not save UI screenshots as JPEG.
- At a consistent browser zoom (normally **100%**), render chart controls/text clearly. Slightly widen the browser if needed rather than shrinking the captured text.
- Capture source PNGs with a consistent convention: \`S01_overview_2026-jan-sep.png\`, \`S06_bms-inverter_2023-2026-quarterly.png\`, \`S09_insights_harbourlight.png\` etc.
- Retain each **original full-frame PNG** and a separate **cropped version**. Crops are non-destructive; never draw numbers onto UI screenshots.
- Export cropped images at sufficient resolution for placement (typically at least **1,200 pixels across a principal screenshot**).
- The screenshot's key figures must be legible **at 100% PDF viewing**, not only enlarged within PowerPoint.
- Use red callouts, comparison arrows and metric titles as **editable PowerPoint native objects**, not baked into a screenshot.
- Distinguish separate UI captures with whitespace/frames. Do not splice them to impersonate a continuous real screen.
- Avoid Windows taskbar, URL bar, cursor, open navigation popups, irrelevant notifications and confidential filenames/names.
- Do not capture empty charts, missing targets, provisional periods or broken comparisons in slides meant to demonstrate reliable insights.

## E. Required editorial notes outside the images

- Every slide that uses the supplied dataset should include a small but legible **“Illustrative synthetic data”** label.
- **Slide 5:** The screenshot may display **15 complete quarterly buckets** from Q1 2023 to Q3 2026. If highlighting year-by-year numbers from reference metrics, compare **January–September** for each year: **29.6 / 44.4 / 58.9 / 73.4 BMS activations per 100 inverter activations** (2023–2026). Do not label those four figures as the chart's annual Q1–Q4 values.
- **Slide 7:** Previous 3 complete months **40**, current 3 **23**; −17, **−42.5%**. This is a **significant recorded activation decline** and an investigation prompt, not confirmed customer loss to a competitor.
- In equipment charts the data are **aggregate product activations**; installer data contain **monthly inverter activations by installer**, without individual product-model attribution.
- Targets are **entered manually**. Insights are **rule-based**. There are no push alerts, live imports, competitor-identification engine or automated CRM actions.

## F. Screenshot acceptance checklist

- [ ] All 10 primary screenshots were captured from the exact software release to be delivered.
- [ ] Every screenshot is 100% fictional/sanitized; no private account, commercial figure or local user file name is visible.
- [ ] Captures are labeled in order and match the slide mappings above.
- [ ] Import previews show the right source and are free of error messages.
- [ ] Full-period coverage is validated for January 2023–September 2026; open October is excluded.
- [ ] For S05, Targets are complete across all selected months/categories.
- [ ] For S06, all depicted quarters are closed/complete and the BMS/Inverter chart ratio is available.
- [ ] For S07, selected installer comparison is valid and any indexed baseline is nonzero/complete.
- [ ] For S08, suggested names are presented as **unconfirmed** matches needing human review.
- [ ] For S09–S10, Harbourlight shows 40 → 23, −42.5%, correctly classified under selected thresholds.
- [ ] Each crop remains legible in both final **PPTX and PDF** at normal view size.
- [ ] At most two screenshots appear on a slide, with a clear commercial interpretation.
- [ ] No app code, functional test or release artifact was modified to obtain the visuals.

## G. Related resources

- [Executive overview deck master plan](EXECUTIVE_PRODUCT_OVERVIEW_PLAN.md)
- [Synthetic data guide and download sources](demo-data/README.md)
- [Static data checks and unresolved browser validation](demo-data/DATA_VALIDATION.md)

**Important:** This document is a capture specification, not proof that screenshots or a PPTX/PDF already exist. Finish browser acceptance before committing any presentation image.
