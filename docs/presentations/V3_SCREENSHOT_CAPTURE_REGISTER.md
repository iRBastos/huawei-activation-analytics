# V3 Screenshot Capture Register — authentic V2.1.0 UI

**Status:** CAPTURE SPECIFICATION, not evidence of a completed screenshot.
**Date:** 16 October 2026
**Supports:** [V3 Product Capabilities Implementation Plan](V3_PRODUCT_CAPABILITIES_IMPLEMENTATION_PLAN.md).

## A. Capture and integrity rules

- App source must be the unchanged official release v2.1.0 (SHA-256: e4d42ec53b6b437fc0e05b52200670bbcea5b6bc75b9ff794e5c14f824eeae64).
- Dataset: existing deterministic synthetic January 2023–September 2026 equipment and installer matrices, plus **manually entered fictional targets** (no target CSV import claim). Exclude partial 2026-10 from every headline slide.
- Use a completely isolated browser profile/workspace, NOT actual client/partner data and NOT the built-in Explore fictional demo. The demo is a different dataset and export actions are disabled there.
- Original browser screenshot resolution target: **2560×1440 PNG**; if necessary use practical browser zoom to make important source control text readable. Do not distort or redraw the program.
- Save for each: an **uncropped original**, one **tight evidence crop** where helpful, source UI path, exact From/To period, selected filters, visible values, and whether the data is complete. Screenshots need no arbitrary red circle baked into the app pixels; editable PowerPoint callouts belong outside the PNG.
- If a source view does not support a desired claim, change the proposed copy rather than invent the UI.
- Capture a screenshot before changing source selections that affect it. For account aliases, record real suggested matches before approving their human-reviewed consolidation.
- Preserve original coverage distinctions: “0 = confirmed zero”, “— = no record”, striped = partial, complete months only for standard activity signals.
- Fallback: if one control cannot be made readable by crop and zoom, show its verified function in editable native text and retain the authentic screenshot as visual context, or reshoot it at a more useful scroll position.

## B. Reuse first — existing approved V2 assets

| Existing ID | Real UI | Candidate V3 slides | Action |
| --- | --- | --- | --- |
| S01 | Overview KPIs / chart | 01, 03 | Reuse cropped hero |
| S02 | Equipment import validation | 02 | Crop to confirmed summary |
| S03 | Installer import validation | 02 | Hide contradictory “No file chosen” field or recapture cleanly |
| S04 | Equipment filters and KPIs | 03 | Reuse only readable selected controls |
| S05 | Target attainment | 07 | Reuse with enlarged target rows |
| S06 | Quarterly BMS/Inverter history | 05 | Optional secondary evidence; not full battery analytics |
| S07 | 3-account Compare 2–6 | 10 | Reuse enlarged chart and separate native legend |
| S08 | Suggested installer-name merges | 12 | Tight genuine row + native names |
| S09 | High / Declining account insight | 13 | Reuse single evidence row |
| S10 | Installer profile | 09 | Reuse evidence or recapture tighter |
| R01 | Installer overview ranking | 08 | Reuse only if readable at V3 slide size |
| R02 | Inverter model analysis | 04 | Reuse only if ranking/model selection legible |
| R03 | Harbourlight monthly history | 09, 13 | Reuse as account history evidence |

**Do not recreate any of these screenshots from PowerPoint shapes.**

## C. New screenshot requests — only if not adequately covered by the above

| Request | UI path / state | Exact evidence to capture | Slide(s) | Stop condition |
| --- | --- | --- | --- | --- |
| **N01 Inverter ranking** | Inverters, Jan–Sep 2026; select Inverter / All models, complete period | Top model ranking with model names, activation counts, difference contribution | 04 | R02 can replace it if all labels legible |
| **N02 Model trend selector** | Inverters, model picker/search, select a small group of 2–4 genuine listed models, monthly or quarterly | Model-specific trend graph with real selections and readable legend | 04 | Avoid if S04 or R02 already proves model selection and trend |
| **N03 Battery families** | Batteries & BMS, All / S0 and S1 family, Jan–Sep 2026 | Family panels with module count, activated capacity (kWh) and BMS ratio | 05 | Capture only relevant panels; don't imply physical paired systems |
| **N04 Battery/BMS mix** | Batteries & BMS, module/BMS mix or Quarterly Intelligence | One genuinely useful model/family mix or BMS trend screenshot | 05 | Drop if slide would exceed 2 screenshots; N03 is essential |
| **N05 Period comparison** | Comparisons, selected 3 complete months vs previous 3 complete months, category/model/metric clearly displayed | Current versus comparison, change and at least one monthly evidence value | 06 | Do not display an incomplete/unequal comparison as comparable growth |
| **N06 Targets editor** | Targets, manually saved 2026 Jul–Sep synthetic target; editor and attainment results | One real target entry scope or meaningful Actual / Target / Attainment / Gap row | 07 | Use S05 if editor screenshot adds nothing visually |
| **N07 Installer dashboard** | Installers → Installer overview, Jul–Sep 2026 vs Apr–Jun 2026, comparable selected cohort | KPIs: Active accounts, tracked share/concentration, ranking or Largest contributions | 08 | R01 may replace if legible |
| **N08 Monthly heatmap** | Installers → Installer overview, a narrow fully covered 3–6 month window | Heatmap with a few distinguishable positive/zero cells and clear month labels | 08 | Never show a 45-month heatmap squeezed on a single slide |
| **N09 Mixed insights** | Installers → Insights & priorities, full covered period, suitable evidence | Actual table rows for at least decline and growth; use separate documented capture for inactive/reactivated examples if these exist in fixture | 11 | Do not fabricate a table with four rows if UI filters can't show them at once; native cards may summarise verified rule categories |
| **N10 Data coverage** | Data → Coverage, category/month filter; or installer source evidence | Actual Complete/Partial/Unknown distinctions and latest complete reporting interval | 12 | Values must match the selected source coverage |
| **N11 CSV export control** | Installer Insights (Export all insights CSV), Installer overview export or Data export summary/records | The real export button and clear context label; optional proof of CSV columns from a genuine exported file, **not a fake dialog** | 14 | Built-in fictional demo disables these; use isolated real-mode with fake data |
| **N12 Backup/restore** | Data → Backup & guide | Actual “Download full backup” and restore controls, local-storage warning if meaningful | 14 | Don't show a session-only warning as a feature; explain actual storage caveat separately |

**Count estimate:** 8–12 new focused views maximum depending on reuse, not a compulsory 12 captures. Prioritize 04/05/06/08/11/12/14; there is no need for a new screenshot just to fill a page.

## D. Grounding for numbers and installer story

Primary reference fixture:
- Jan–Sep 2026: 6,267 inverter activations, 4,602 BMS activations, ratio 73.4 BMS per 100 inverters.
- Matched Jan–Sep 2023/24/25/26 ratio: 29.6 / 44.4 / 58.9 / 73.4. Do not call these quarterly data points, even if the software quarterly chart is alongside them.
- DEMO Harbourlight Solar Ltd: Apr–Jun 2026 = 40, Jul–Sep 2026 = 23, difference −17, relative difference −42.5%.
- Fictional manual target example: Jul–Sep 2026 inverter actual 2,046 vs target 2,180, attainment 93.9%.
- Other installer examples (decline/inactive/return/growth) must be looked up in the fixture or software output at the selected complete reporting dates before putting specific names or numbers on a slide.

## E. Asset filenames and evidence manifest

Store under the internal production folder:
- originals/V3_N01_inverter_ranking.png through originals/V3_N12_backup_restore.png for the *actually captured* ID set.
- crops/slide_04_inverter_ranking.png, crops/slide_05_battery_families.png, etc.
- V3_CAPTURE_MANIFEST.json recording source_app_sha256, dataset source checksums, capture timestamp, source view, selected period/filter, original image SHA, crop coordinates, slide usage, factual claims and QA status.
- V3_CAPTURE_CONTACT_SHEET.png — numbered overview for human screening.
- README.md with how each image was obtained and what it proves.

Mark skipped IDs **not needed**, not missing, if equivalent existing evidence is excellent. Never invent a captured file path for an item not actually created.

## F. Capture QA and rejection list

**Reject** a frame if:
- Primary chart, model name, KPI, account name or selected period is unreadable at actual slide size.
- It shows a contradictory import preview and “No file chosen” that cannot be explained.
- It mixes an optional partial October reporting period with complete results without a warning.
- It includes a live customer/company record or sensitive organisational data.
- It purports to show exports active in the built-in demo.
- It implies a forecast, CRM integration, live alerts, installer-to-device mapping, automatic alias unification or verified physical battery pairing.
- Its screenshot is visibly edited to create a feature the software did not render.
- Its chart dates/filters do not align with native text on the slide.

**Gate G2 passes only when** all 15 planned slides have a defined evidence source, all high-information screenshots are legible when physically placed, and every new number or name is traceable to the source fixture.

Related: [V3 plan](V3_PRODUCT_CAPABILITIES_IMPLEMENTATION_PLAN.md), [old capture report](SCREENSHOT_CAPTURE_REPORT.md), [official user guide](../commercial/en/USER_GUIDE.md).
