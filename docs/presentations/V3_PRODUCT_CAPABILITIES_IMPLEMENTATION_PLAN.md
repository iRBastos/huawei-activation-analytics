# Huawei Activation Analytics — V3 Product Capabilities Presentation

**Status:** Implementation plan approved for discussion; execution NOT started.
**Date:** 16 October 2026
**Repository:** iRBastos/huawei-activation-analytics
**Working branch:** docs/executive-overview-deck-plan-2026-10-15
**Reference application:** release v2.1.0, SHA-256 e4d42ec53b6b437fc0e05b52200670bbcea5b6bc75b9ff794e5c14f824eeae64
**Deliverables after execution:** V3 English 16:9 editable PowerPoint, matching PDF, 15-slide preview, verified screenshot collection, evidence manifest, QA report, and an unchanged official app release in an optional distribution archive.

## 1. Changed objective

V1/V2 demonstrated the value proposition and several illustrative workflows, but did NOT adequately show the full range of capabilities to someone with no knowledge of the program.

**V3 is a product capability walkthrough, written for someone who receives the PDF without a presenter.**

After reading, an unfamiliar channel manager should be able to explain:
1. What the application is and what reports it accepts.
2. Where its seven top-level workspaces are found: Overview, Inverters, Batteries & BMS, Comparisons, Targets, Installers, Data.
3. How to analyse equipment, inverter models, batteries, activated capacity, BMS ratios and targets.
4. How to inspect installer rankings, heatmaps, profiles, 2–6 account comparisons and rule-based priorities.
5. How to validate data quality, export evidence, use a full backup and run a monthly review.
6. What it CANNOT infer: actual sales, real-time demand, Irish market share, per-installer product model linkage, competitor switching or predictive churn.

**Presentation format:** 15 concise, editorial slides (increased from the initial approx. 13 because period comparison, targets, and export/backup are distinct real capabilities and must not be squeezed into unreadable dual screenshots). Target a self-paced 6–9 minute reading experience, not a 40-page manual. All slide copy is ENGLISH.

One primary purpose per slide: **What you can do → Real UI proof → Example result → Commercial value**.

## 2. Grounded capability inventory (verified against V2.1.0 sources)

This is the scope of functionality that may be claimed:

| Source UI | Verified functions | Constraints |
| --- | --- | --- |
| Overview | Selected date period, product category/family/model scope, KPI cards, activation/ratio trend | Activation counts ≠ sales, household installations, verified physical pairing |
| Inverters | Model volume ranking, change contribution, models selected for chart (not only Top 8), trend, phase/product mix | Cannot attribute inverter model to named installer |
| Batteries & BMS | S0/S1 family and compatible BMS ratios, battery module volume, activated kWh capacity, model/family mix, trend, quarterly intelligence | Module and BMS ratios are aggregated activations, not a real wiring topology |
| Comparisons | Like-for-like and previous intervals, volume/capacity metric selectors, comparison totals, evidence, monthly profile, change contributions | Unequal or incomplete periods must be described explicitly; no unsupported growth percentage |
| Targets | Monthly activation objective editor and saved objectives, actual vs target, attainment, gap, reporting status | Targets are created manually, not synced from CRM |
| Installers → Installer overview | Account rankings, activity counts, Top 5 concentration, retention, portfolio contribution, HHI, monthly heatmap | Shares concern the *tracked reporting base*, not national Ireland solar market share |
| Installers → Installer profile | Search by source name/alias, activity KPIs, historic monthly/quarterly/annual graphs, last activity, rank, source evidence | Historical change alone does not prove lost relationship |
| Installers → Compare 2–6 | Pick any 2–6 accounts, volume trend and period values, indexed base-100 view where positive/complete baselines exist | Not every dataset supports indexed comparison |
| Installers → Insights & priorities | Declining, Growing, Inactive, Reactivated, First recorded after zeros, Zero baseline, Data check, deterministic priority and CSV export | Must respect closed reporting months, full coverage and tunable significance thresholds; NOT predictions or push alerts |
| Data → Equipment imports / Installer imports | Source file selection, preview, validations, confirmed import, overwrite/re-import logic, source provenance | Import is manual; installation does not connect to live Huawei source |
| Data → Coverage / Installer overview → Account management | Category coverage, known zero vs missing, full/partial population; suggested identity merges with explicit human confirmation | Omissions in partial imports are unknown, not automatically zero; do not silently combine company names |
| Data → Recorded data / History / Backup & guide | Source record inspection, import history, CSV outputs where supported, JSON full backup and restore | Local browser/profile storage may be session-only; demo mode disables exports |

Confirmed sources: codigo-fonte/dist/modules/views.js, installer-analytics-views.js, installer-experiences.js, app.js and docs/commercial/en/USER_GUIDE.md and PROJECT_OVERVIEW.md.

**Product positioning caveat:** Present this as an independently developed offline analytics tool for Huawei recorded activations, not as an officially endorsed Huawei corporate platform.

## 3. Locked 15-slide storyboard / source-of-truth mapping

Each final slide must have one dominant question, a readable actual program image or a purposeful native diagram, a concise explanation and a clear commercial implication.

| # | English slide heading | User learns / important capability | Actual UI evidence | Editorial message |
| --- | --- | --- | --- | --- |
| **01** | **From Activation Data to Channel Intelligence** | What the application does; equipment + installer + data quality + commercial response; navigation across modules | S01 Overview hero (tight crop) plus native 4-capability map | “An offline tool for turning recorded activity into evidence-led decisions.” |
| **02** | **Import, Validate and Trust the Source** | XLSX/CSV reports, equipment vs installer import, preview, coverage and confirm; what missing differs from zero | Reuse S02/S03 validation crops, native 4-step flow | Data quality is the first decision, not a technical afterthought |
| **03** | **See the Portfolio at a Glance** | Overview KPIs, chosen date period, model/family/category filters, activation trend and ratios | S01/S04 Overview enlarged selection | A repeatable monthly view of observed product activity |
| **04** | **Understand Inverter Models and Movement** | Model rankings, top contributors to change, selected individual model trends and phase mix | New inverter-volume-and-trend screenshot, supplemented by R02 only if readable | Pinpoint which reported product models are moving, not which installer uses them |
| **05** | **Analyse Batteries, BMS and Capacity** | Battery module quantities, recorded activated kWh, S0/S1 family, BMS mix and activation ratios | New family/capacity and product-mix screenshot; S06 is optional historical proof | Understand aggregate storage-related activation patterns responsibly |
| **06** | **Compare Periods with Evidence** | Same-length / prior / custom comparison, metric selection, monthly difference and completeness | New Comparisons view screenshot | Locate changes without misleading dates or denominators |
| **07** | **Set and Track Activation Targets** | Manual monthly target edit, Actual / Target / Attainment / Gap, category/model scope | Reuse S05 with tighter crop; if edit workflow unclear, new Target editor screenshot | Show progress against agreed commercial objectives |
| **08** | **Read the Installer Portfolio** | Active accounts, rankings, contributions, Top 5 concentration, retention, monthly heatmap | R01 if legible; otherwise new installer dashboard/heatmap screenshot | Find important partners and portfolio dependence |
| **09** | **Investigate Any Installer in Detail** | Search all accounts/aliases, KPIs, last activity, monthly/quarterly/annual history, evidence | Reuse S10 and R03 with focused crop or recapture profile | Explain observed account trajectory before outreach |
| **10** | **Compare 2–6 Installers Side by Side** | Choose 2–6, volume/indexed trend when allowed, underlying comparison values | Reuse S07 or recapture tighter 3-account comparison | Differentiate portfolio patterns, not just volumes |
| **11** | **Spot Growth, Decline, Inactivity and Return** | Insights classifications, thresholds, High/Medium/Low and Data check, source evidence | New Insights overview demonstrating multiple *actual* signal rows; S09 detail reserve | Rule-based prioritisation surfaces accounts worth reviewing |
| **12** | **Protect the Interpretation with Coverage and Identity Checks** | Known zero / unknown months, full/partial population, manual identity review and source evidence | New Coverage view + cropped S08 real unconfirmed alias suggestion | Avoid false inactive/declining conclusions and double-counting |
| **13** | **From Signal to Commercial Follow-Up** | Practical account investigation: prior/current, insight, profile, business questions, follow-up next month | S09 and R03; native 40 → 23, −42.5% | A signal prompts a conversation; it does not prove competitor loss |
| **14** | **Export Evidence and Protect Your Workspace** | Actual CSV export actions, full JSON backup/restore, local/session storage | New Data → Backup & guide and real export-control screenshot | Share verified outputs in approved workflows and preserve work locally |
| **15** | **How to Start and Run a Monthly Review** | Root index.html, Explore fictional demo versus extended 45-month imported data, monthly review loop, official release link | Purposeful native flow; no microscopic screenshot | A new user knows exactly what to click and what to do next |

**Copy structure on slides 03–14:**
- Heading: capability (“Analyse batteries and activated capacity”).
- One short, visually prominent “YOU CAN” sentence.
- One authentic, source-labelled screenshot with one deliberate visual focus.
- Optional native metric comparison, backed by a specific synthetic record.
- One bottom-line “CHANNEL DECISION” example, framed as what the user can investigate, never an unproven causal assertion.
- A discreet, consistent “Illustrative synthetic data — not actual Huawei results” label wherever numbers appear.

**Avoid feature collisions:** The portfolio overview (08), one-account profile (09), multi-account comparison (10) and prioritisation queue (11) are four distinct workflows; do not collapse them into one generic installer slide.

## 4. Asset requirements and screenshot policy

Already available in /Huawei Activation Analytics/Executive Presentation Assets/:
- Existing final V2 PowerPoint/PDF and overview contact sheet.
- Original screenshot ZIP with 10 primaries S01–S10 and 3 reserve screenshots R01–R03.
- Deterministic fictional matrices 2023-01 through 2026-09, metrics, target examples and isolated full JSON backup.
- Existing F2/F3 crop/build source. **Reuse before creating.**

New evidence is required before building final layouts. The exact register is [V3_SCREENSHOT_CAPTURE_REGISTER.md](V3_SCREENSHOT_CAPTURE_REGISTER.md); suggested new captures cover:
1. Inverter ranking and selected model chart.
2. Battery/BMS capacity and family/mix.
3. Comparisons view with matched periods.
4. Monthly targets editor or clearer attainment details.
5. Installer portfolio ranking/concentration and full-month heatmap.
6. Multi-signal Insights table demonstrating real declining/growing/inactive/reactivated evidence.
7. Equipment or installer coverage audit.
8. CSV export UI and backup/restore screen.

**Data fixture discipline:** Use the exact known fictional 45-month dataset January 2023–September 2026; exclude partial October 2026 from headline comparisons; never mix the built-in 24-month Explore fictional demo with the extended dataset or claim its export button works. Only invent new *fictional* scenario data when the existing fixture lacks a required signal and the change is explicitly documented and reconciled to all impacted totals. Prefer no data-generator changes.

**Capture standard:** Original V2.1.0 application UI, isolated workspace, no real company/customer data, 2560×1440 PNG original, high-quality deliberate detail crops, readable dates/units/account labels. Preserve uncropped originals and a screenshot manifest with file name, source view, period, filters, visible claims, dataset hash and slide destination. Never edit screenshot numbers or imitate UI.

**Expected image count:** 8–12 **targeted new views**, not 15 whole-page screenshots. Limit each slide to one strong hero screenshot or two readable contextual details; diagrams and callouts must be PPT-native and editable.

## 5. Phased production and stop gates

| Stage | Execution | Tangible artifacts | Proceed only if |
| --- | --- | --- | --- |
| **G0 — Baseline and feature audit** | Inventory V2 files/old PNGs, confirm app version/feature labels and no unsupported promises | Feature matrix, checksums, source references | Every feature claimed points to an actual UI screen or explicit verified implementation |
| **G1 — Storyboard and copy lock** | Write English on-slide copy and the 15 takeaway sentences before making PPT | 15-slide copy deck outline; evidence-to-slide crosswalk | A first-time reader can follow start-to-finish without presenter notes |
| **G2 — Screenshot and synthetic proof** | Capture only missing views, crop and audit at final intended size; verify fake numbers with CSV/JSON | PNG originals/crops, manifest, proof contact sheet, validation record | No new synthetic metric unverified; no “No file chosen” preview inconsistency; all key labels readable |
| **G3 — Design prototypes** | Build slides **04 Inverters, 08 Installer portfolio, 11 Insights** first; use as consistent design prototypes for dense charts/tables | 3-slide editable prototype PPTX and PDF review | Clear feature + proof + use case with no screenshot microtext |
| **G4 — Complete V3** | Produce remaining 12 slides using verified grid/typography, reuse proven V2 elements selectively | Complete 15-slide editable PPTX | Each capability meaningfully demonstrated, no duplicate content |
| **G5 — Independent visual + semantic audit** | Render each slide 1920×1080 or above; inspect PPTX/PDF separately, check claims, all screenshots, parity and link | Individual images, contact sheet, issue register and corrective pass | Zero critical/major visual/semantic defects; 15-slide novice-reader test passed |
| **G6 — Delivery** | Export PDF/PPTX, bundle only recipient-useful files and original verified release ZIP; save Library and log branch report | PDF, PPTX, preview, unchanged app ZIP/handoff package, QA report | Official app digest intact, text legible, final owner sign-off |

**Efficiency rule:** Prototype the *three most information-dense capability pages* before committing to production of all 15. Reuse existing chart/screenshot assets and create no new app features to improve the deck.

## 6. High-quality design contract

- **16:9, premium minimal layout**. White, charcoal, light grey and restrained Huawei-inspired red. No official Huawei logo and no made-up UI.
- Header/title base: consistent x/y and 28–32pt. Native explanatory type generally 16–18pt; supporting labels ≥11–12pt; KPI 30–46pt.
- Each slide is readable at laptop PDF 100% zoom. When screenshot controls are too small, take a narrower crop from original pixels or recapture view with sensible browser zoom. **Do not merely upscale raster pixels to fake clarity.**
- One dominant capability, one dominant evidence graphic, one clear bottom-line value statement. No slide is a duplicate of documentation or a catalogue of tiny screenshots.
- All numbers and commercial interpretations editable native text; only genuine UI remains PNG. At most two screenshot crops per slide.
- Visual consistency: identical title/footer/period-label position, measured margins, clean alignment, same card language, no 3D chart, no animation, no gratuitous decorations.
- Source title and module route appear in a caption where useful, e.g., “Inverters → Volume ranking / Jan–Sep 2026”.
- For dense tables use a zoomed row/segment plus editable data callout; never present a full UI view unreadably just to show authenticity.
- Explain any assumption and limitation in readable language, not 7pt fine print.

## 7. Explicit claim and ethics gates

**Supported:** recorded activation totals, shifts in aggregate Huawei device mix, tracked installer momentum, rule-based classifications, auditable source details, manual export and backup.

**Not supported:** automatic online imports, live notifications, AI churn prediction, entire Irish market share, sales/revenue, device pairing, linking an installer to specific inverter/battery models, automatically logging or contacting installers, attributing commercial response as proven cause of activity changes.

**Privacy:** no real partner/customer personal data, actual business secrets or live financial/sales numbers in screenshots. Every case must be labelled fictitious. Real-market generalisations must be framed as questions/hypotheses rather than claimed findings.

**Coverage honesty:** A blank in an imported month may be zero; an absent month or absent account in a partial population is *unknown*. The deck must not imply every missing row means inactivity.

**Demo limitation:** In-app fictional demo has separate sample data and **disables exports**. For the presentation screenshot set use the **isolated real-mode workspace populated with synthetic data**; never claim its actual local persistence was tested on a recipient's Windows device.

## 8. Test that actually matters: first-time viewer acceptance

Show the exported PDF to a reviewer unfamiliar with the application **without narrator explanations**. After a 6–9 minute read they should be able to answer:

1. What file/report starts the process, and where does the user import it?
2. Which page reveals individual inverter model rankings/trends?
3. Where can battery module volume and activated kWh be examined?
4. How are prior periods and manually entered targets evaluated?
5. Where are installer portfolio rankings/heatmaps and a named account history?
6. How can two to six accounts be compared?
7. Which types of account signals can be flagged, and how can coverage affect them?
8. What is a sensible next action when an account declines?
9. Where are CSV exports and JSON backup controls?
10. What can the application not tell us reliably, and how does built-in fictional demo differ from the extended screenshot dataset?

**Pass criterion:** All 10 points are answerable from the presentation with no guesswork, no unsupported claims, and no need for user instructions to open the program. Independently rate each of 15 slides on readability, functional evidence, accuracy, composition and business action. No high-severity defect is acceptable; target ≥9/10 on each editorial score, but avoid claiming a mechanical “100/10”.

## 9. Input/quality gates before F6 final export

- [ ] Screenshots correspond to original official v2.1.0 UI and source scenario.
- [ ] Every claimed capability demonstrated by authentic UI and/or verified source.
- [ ] Inverter, Batteries & BMS, Comparisons, Targets, Installer Overview, Installer Profile, Compare 2–6, Insights, Coverage, and Data/Backup all have their own legible slide or clearly located module.
- [ ] All dates, units, names and sums match the synthetic matrix.
- [ ] Installer profile and product model data are never falsely joined.
- [ ] All required caveats are visible (offline, manual, non-predictive, not sales, tracked account share only).
- [ ] All slide body text and evidence is legible at 100% PDF zoom.
- [ ] Slide count exactly 15 unless a documented change is approved.
- [ ] Editable PPTX; identical 15-page PDF, working links, no shape overflow, no bad fonts and no clipped visuals.
- [ ] Separate end-to-end rendered image audit after any correction, not merely a montage.
- [ ] Official v2.1.0 ZIP SHA preserved and no app/main code changes.
- [ ] V1/V2 final assets remain archived; new outputs are V3 versioned.
- [ ] Owner sees the complete PDF before distribution.

## 10. Deliverable names and ownership

Proposed:
- Huawei_Activation_Analytics_Product_Capabilities_V3.pptx
- Huawei_Activation_Analytics_Product_Capabilities_V3.pdf
- Huawei_Activation_Analytics_Product_Capabilities_V3_Preview.png
- Huawei_Activation_Analytics_V3_Screenshots_and_Evidence.zip (internal production asset only)
- Huawei_Activation_Analytics_V3_Executive_Handoff.zip (recipient-facing PPTX/PDF, unchanged official v2.1.0 ZIP and READ_ME_FIRST)
- docs/presentations/V3_BUILD_AND_QA_REPORT.md (after execution)

Final binaries to ChatGPT Library:
**/Huawei Activation Analytics/Executive Presentation Assets/**

This documentation branch stores plans, capture register and QA records, NOT binary PPTX/PDF/screenshots. Do not merge into main or send externally without user approval.

**Execution entry point:** G0 → G1 → G2. Before completing 15 slides, show G3 prototypes (Inverters, Installer portfolio, Insights) for quality approval, then G4 → G5 → G6.

Related: V2 report [PPT_V2_F4_F5_FINAL_REPORT.md](PPT_V2_F4_F5_FINAL_REPORT.md), [V2 redesign plan](PPT_V2_REDESIGN_IMPLEMENTATION_PLAN.md), [existing screenshot capture report](SCREENSHOT_CAPTURE_REPORT.md).
