# Huawei Activation Analytics V2.1 — Executive Product Overview

> **Status:** Approved presentation plan; reproducible synthetic source data created and verified; presentation slides and screenshots not yet produced.  
> **Date:** 15 October 2026  
> **Repository:** iRBastos/huawei-activation-analytics  
> **Working branch:** docs/executive-overview-deck-plan-2026-10-15  
> **Audience:** Huawei Digital Power commercial leadership, channel managers and partner-facing teams.  
> **Delivery mode:** Asynchronous: the recipients will receive the application and presentation files **without a live presenter**.  
> **Language:** Professional, concise English for the slides; this document is the production brief.  
> **Scope:** Documentation and presentation assets only. No application logic, styling, runtime, packaging or functionality changes.

## 1. Objective and positioning

Produce a premium, minimalist, self-explanatory executive product overview for the independently developed Huawei Activation Analytics tool. In five minutes of independent reading, recipients should understand:

1. The business problem and purpose of the tool.
2. Where the source data comes from and how the import process works.
3. Which equipment, installer and target analyses are actually available.
4. Two defensible examples of turning activation data into commercial questions and actions.
5. How to open the attached application, explore the fictional demo and find its documentation.

**Core positioning:** “Turn activation data into actionable commercial intelligence: identify important changes, understand trends and focus channel-management efforts.”

Do **not** position the tool as an official Huawei product, a predictive AI model, a real-time alerting service, competitor-switching detection, market-share measurement or an integrated CRM.

**Central narrative:** Available data → structured analysis → commercial signal → investigation → action → review at the next reliable update.

## 2. Presentation contract

- **Exactly 8 primary slides.** Each slide must be fully comprehensible without spoken commentary, presenter notes, animation or live demo.
- **Format:** Widescreen 16:9, 13.333 × 7.5 in. English.
- **Style:** Premium, clean Huawei-inspired corporate aesthetic: white background, #C71932 restrained red accents, charcoal #20252B text, light grey #F3F5F7 surfaces, ample negative space. Do not paste a Huawei logo; use the name as ordinary text and avoid implying endorsement.
- **Typography:** Aptos/Arial. Titles around 28–32 pt; body 16–18 pt; chart labels large enough to read at normal zoom; captions/footnotes approximately 10–12 pt, never used to hide essential content.
- **Layout:** Approximately 0.65 in safe margin. Align titles, content edges and screenshot frames consistently. Avoid complex gradients, decorative 3D elements, stock photos, crowded UI and excessive iconography.
- **Copy rule:** One primary point per slide, one brief supporting explanation and an explicit reader takeaway. Prefer short paragraphs and sharply chosen annotations over feature inventories.
- **Screenshots:** Actual V2.1 interface captured using one consistent environment, zoom and theme. Crop around relevant controls and legible figures rather than fitting full screens into tiny boxes.
- **Evidence rule:** Genuine numerical conclusions require verified source data with consistent reporting coverage. Otherwise clearly mark examples as fictional/illustrative.
- **Navigation:** Page number 01/08 … 08/08 in a quiet footer; optionally short section label. No large recurring header/footer branding.

### Deliverables

1. Huawei_Activation_Analytics_Executive_Overview.pdf — **primary reading file**; readable standalone and tested for links/fonts.
2. Huawei_Activation_Analytics_Executive_Overview.pptx — editable master with the same content and visually checked slides.
3. Huawei_Activation_Analytics_V2.1.zip — **application** from the approved, unchanged distribution snapshot, including root index.html, required support material, documentation and templates.
4. A short accompanying email or cover note describing what is attached and inviting recipients to open the demo (prepare separately; do not imply a live walkthrough).

Do not generate/repackage the application as part of this plan-only branch. Before final delivery, take the distribution from the approved release and verify it against the specific version actually sent.

## 3. Slide-by-slide production specification

### Slide 01 — The Tool & Its Purpose

**Title:** Huawei Activation Analytics  
**Subtitle:** Commercial Intelligence for the Installer Channel  
**Support line:** “An offline analytics tool to monitor Huawei equipment activations, installer trends and commercial opportunities.”

**Reader takeaway:** This is a tool for evidence-based channel decisions, not merely an attractive dashboard.

**Composition:** 45% text on left, 55% real UI image on right. Large title, small subtitle, one-line value statement. Thin red accent or understated red rule. Keep ample breathing room.

**Screenshot S01:** Overview dashboard. Include recognisable KPI cards, beginning of the activation chart and just enough UI navigation to establish authenticity. Crop out confidential names and inconsequential controls. Right image should be visually dominant and readable.

**No presenter-dependent material.** Avoid empty “demo” or “let me show you” phrases.

### Slide 02 — The Commercial Challenge

**Title:** We Have the Data. Identifying the Right Commercial Signals Takes Time.

**Three concise points:**
- **Fragmented reporting:** Different spreadsheets and manual comparisons.
- **Limited visibility:** Long-term trends and installer movements can be easy to miss.
- **Delayed action:** Commercial attention may arrive after an account has already slowed.

**Conclusion on slide:** “The opportunity: convert existing activation files into a repeatable process for detecting important movements and prioritising follow-up.”

**Composition:** 3 balanced icon/text columns, then a restrained bottom takeaway. No UI screenshots. No generic stock images. Resist implying that the tool establishes reasons for declines or proves sales.

### Slide 03 — How It Works

**Title:** From Source Reports to Actionable Insights

**Primary sequence:** Export → Prepare → Import → Validate → Analyse.

**Recommended concise copy:**
1. Export the required monthly reports from **[SOURCE SYSTEM — TO CONFIRM]**.
2. Make the necessary spreadsheet formatting adjustments.
3. Import in **Data → Equipment imports** and, for account analysis, **Data → Installer imports**.
4. Review source previews, model classification/coverage where relevant and confirm.
5. Explore refreshed KPIs, historical trends, profiles, priorities and targets.

**Important source-file accuracy gate:** The stakeholder currently describes **two downloaded spreadsheets**. Confirm whether those are (a) inverter activations and (b) battery modules/BMS activations. Installer activity is a **separate dataset** in the software and may require a third source/export. Until clarified, do not claim two files alone power every installer feature. Use accurate wording “two equipment reports, plus installer data when available” if that is the real workflow.

**Screenshot S02:** Data → Equipment imports. Crop the file chooser/progress/preview.  
**Screenshot S03:** Data → Installer imports. Crop the header and relevant import area.  
**Layout:** Process diagram across upper ~35%; two aligned screenshots or one main screenshot plus compact second screenshot underneath. Short note explaining the separate datasets.

**Practical caveat:** Imports are performed manually. No automatic source sync. Files are processed locally; completeness/coverage matters. Do not demonstrate a live upload in this asynchronous deck.

### Slide 04 — Equipment Analytics & Targets

**Title:** Flexible Equipment Analytics — From Portfolio to Individual Model

**Capability groups (short labels):**
- **KPIs:** inverter, BMS, battery-module and activated-capacity volumes; growth and product mix.
- **Battery indicators:** BMS per 100 inverter activations, modules per BMS, activated kWh per BMS.
- **Filters:** date range, monthly/quarterly/half-year/annual aggregation, category, model and family.
- **Comparisons:** previous period, same months last year and suitable comparison windows.
- **Targets:** manually enter monthly targets by category or model; review actual, target, attainment and gap.

**Screenshot S04:** Overview with expanded equipment analysis/product filters and key KPIs. Prioritise legible From/To, aggregation, Category, Model and Family controls.
**Screenshot S05:** Targets → Target attainment crop. Show only a few legible columns/rows (Actual, Target, Attainment and Gap).
**Composition:** Left ~42% a concise five-item capabilities column; right ~58% large screenshot S04 over a narrow S05 strip. Do not use 5 minuscule screenshots.

**Reader takeaway:** “The same source data supports high-level market monitoring and detailed performance analysis by selected scope.”

**Guardrail:** Targets are manually defined, not automatic sales forecasts. Some metrics are withheld when comparison/coverage requirements are not met.

### Slide 05 — Market Insights: Long-Term Trends

**Title:** Identifying Long-Term Changes in the Product Mix

**Hero metric:** “BMS activations per 100 inverter activations” or “BMS / Inverter” using the label/units visible in the application.

**Screenshot S06:** The actual historical BMS / Inverter trend from Overview, showing complete years or other consistent periods with readable axes. Crop out unrelated dashboard material. Make the chart ~65% of slide width.

**Reader-facing interpretation at right:**
- **Observed:** Describe the *verified* direction and period, e.g. “The ratio has increased across [verified years].”
- **What it may mean:** “Battery-related activity may be becoming more prominent in the recorded product mix.”
- **Commercial question:** “Does this suggest an opportunity to improve battery positioning, training, stock planning or campaigns?”

**Data gate:** Do not assert a steady, multi-year increase until the chart/data supports it. If unavailable, use intentionally fictional values and clearly label **Illustrative example — not actual Huawei market data**. No made-up dates, years or percentage claims.
**Mandatory note:** This is an aggregate activation ratio, **not a verified battery attachment rate**, installation count or measured customer demand; retrofits, replacements and timing may influence it.

**Composition:** 65% legible chart, 35% concise interpretation with three short subheadings. One major emphasis number only if validated.

### Slide 06 — Installer Intelligence

**Title:** Understand Installer Activity — Across the Portfolio and by Account

**Feature summary:**
- Installer rankings, active accounts, retention, concentration and historical momentum.
- Independent date filters, period comparison and individual searchable profiles.
- Comparison of **2–6 installers**, using absolute values and indexed trends where valid.
- Suggested matches for duplicate/variant installer names; **a human approves each merge**, totals are added and source history preserved.
- Rule-based **Insights & priorities** for meaningful growth, decline, inactivity, reactivation and reporting checks.

**Screenshot S07:** Installers → Installer overview, with ranking/portfolio KPIs or a relevant comparison chart, large enough to read.  
**Screenshot S08:** Installers → Installer overview → Account management showing a suggested account unification (cropped tightly, no sensitive names).

**Composition:** Main S07 on ~60% of slide; right ~40% short feature narrative and an S08 inset as space allows. No miniature full-page UI.

**Reader takeaway:** “Move from portfolio trends to the exact accounts requiring investigation, without miscounting confirmed duplicate names.”

**Data caveat:** Installer imports are monthly inverter activation totals by company, without equipment-model attribution. Installer reports and equipment model data must not be joined to claim “Installer A uses Model B.” Missing months ≠ confirmed zero.

### Slide 07 — From Insights to Commercial Action

**Title:** Detect a Significant Change. Investigate Before It Becomes a Bigger Problem.

**Fictional worked example:**
- Previous 3 **complete** months: **40** inverter activations.
- Latest 3 **complete**, comparable months: **23**.
- Absolute change **−17**, percentage change **−42.5%**.
- Eligible as **Declining** with the tool’s default 5 minimum relevant volume and 20% minimum change thresholds, assuming other reporting requirements pass.
- A priority score is a deterministic triage score, **not a probability of losing the customer**.

**Screenshots:**
- **S09:** Installers → Insights & priorities, cropped to relevant filters and one declining row.
- **S10:** Installers → Installer profile, cropped to the corresponding historical chart/evidence.
Use entirely fictional demo data or approved anonymised data and keep the same example consistent across both images.

**Reader-facing commercial decision loop:** Detect → Validate coverage/history → Speak to installer → Investigate pricing, availability, project pipeline, commissioning/support or training → Agree action → Recheck at next complete update.

**Suggested interpretation:** “This signal tells us where to investigate — not why the account changed.”

**Composition:** Large −42.5% change callout, S09/S10 positioned as readable evidence, 5–6 words per action stage. If images are too dense, make one the principal screenshot and the second a small detail rather than shrinking both.

**Critical boundary:** The application does not send real-time push/email alerts, determine competitors used, log outreach in a CRM or prove intervention causality. Account contact and follow-up are external commercial actions.

### Slide 08 — Business Value & Getting Started

**Title:** Better Visibility. Smarter Commercial Decisions.

**Four promised benefits (measured as potential outcomes, not already proven results):**
- **Visibility:** trends, mix, coverage and partner momentum.
- **Efficiency:** less manual reporting and quicker structured reviews after each data refresh.
- **Prioritisation:** focus on relevant account movements and growth opportunities.
- **Action:** better-informed conversations with installers, distributors and internal support teams.

**Concrete adoption process:** Monthly export/import → check coverage → review priority accounts → assign follow-up in existing commercial process → review next reporting period.

**Getting started (must be written in-slide, not in speaker notes):**
1. Extract the approved application ZIP.
2. Open the root **index.html** in a browser (no server or internet required for ordinary use).
3. Select **Explore fictional demo** to view functionality without changing real workspace.
4. For real usage, import approved data and periodically download a full JSON backup under **Data → Backup & guide**.
5. Use the included commercial documentation/user guides and the project repository.

**Links:** Clickable hyperlink to https://github.com/iRBastos/huawei-activation-analytics and (if available in deliverable) the relevant commercial user guide. Test links in both PPTX and PDF.

**Composition:** Four compact benefit blocks in upper half; a visually restrained “Getting Started” ribbon or short numbered sequence below. No more dashboard screenshots.

**Footer/micro-note:** “Offline, rule-based insights based on uploaded activation records. Not live market intelligence or verified sales/market-share data.” Also clarify independent development without falsely implying corporate authorisation.

## 4. Screenshot capture and cropping register

| ID | Application location | Slide | Crop instructions | Priority |
| --- | --- | --- | --- | --- |
| S01 | Overview | 01 | KPI cards and beginning of chart, recognisable layout | Must |
| S02 | Data → Equipment imports | 03 | File selection, progress and validation context | Must |
| S03 | Data → Installer imports | 03 | Distinct importer and relevant controls | Must |
| S04 | Overview, expanded Analysis options and Product filters | 04 | Date, aggregation, family/model, KPI | Must |
| S05 | Targets → Target attainment | 04 | Actual / Target / Attainment / Gap | Must |
| S06 | Overview → BMS / Inverter historical KPI trend | 05 | Clean axes, period, metric, complete data | Must |
| S07 | Installers → Installer overview or Compare 2–6 | 06 | Ranking/KPIs or meaningful comparison chart | Must |
| S08 | Installers → Account management | 06 | Suggested duplicate-name consolidation and confirm control | Must |
| S09 | Installers → Insights & priorities | 07 | Search/priority controls and one material decline | Must |
| S10 | Installers → Installer profile | 07 | Same example’s history and source evidence | Must |

**Capture protocol:**
- Prefer screenshots taken at ≥1920×1080 from one approved V2.1 build, using the same browser/theme and 100% display zoom or a consistent readability setting.
- Create a sanitized or fictional demonstration workspace; avoid all confidential installer names, source workbook names, emails and commercial totals.
- Never composite multiple screenshots into a falsely continuous software screen. Separate independent crops visibly.
- Crop rather than scale full-page UI to unreadable size; verify legibility in 16:9 full-screen view and the exported PDF.
- Avoid toolbar clutter, modal overlays, raw source files and empty-state screenshots where a populated demo is required.
- For S06, document the last complete period and source status. For S09/S10, ensure both show the same illustrative or anonymized installer.
- Do not use generic generated UI images in place of the real tool.

## 5. Numerical interpretation and product boundaries

**Verified application capabilities:** Offline root index.html, local imports and validation; equipment KPI and filter views; monthly target editor and attainment; installer account management with manual merge approval; profiles; 2–6 comparisons; rule-based insights with configurable thresholds; CSV exports; browser-local saved data where supported and JSON backups.

**What the slide deck must not imply:**
- Missing months are automatically zero or all months have full coverage.
- Inverter or BMS activations are proven equipment sales, households, installed systems or Irish national market share.
- The ratio of BMS to inverter activations proves a physical battery-to-inverter pairing or retrofit rate.
- A decline proves a move to another brand, a lost customer or a known causal factor.
- Product model activations can be assigned to a named installer using independent datasets.
- Insights represent forecasts, machine-learning predictions or a probability of churn.
- Automatic CRM action, live report sync or real-time notifications exist.
- Manual targets are automatically generated commercial forecasts.

Use controlled terms: **recorded activations**, **tracked account base**, **commercial signal**, **investigate**, **potential opportunity**, **next complete reporting update**.

## 6. Production sequence and review gates

### Gate A — Confirm facts before designing
- [ ] Confirm exact source-system name replacing [SOURCE SYSTEM — TO CONFIRM].
- [ ] Confirm the actual **two exported sheets** and preparation edits, and whether installer data is a distinct third report.
- [ ] Confirm approved audience, confidentiality handling and whether real customer names may appear.
- [ ] Confirm which version/release ZIP is being distributed, plus its README and user guide.
- [ ] Validate any claim of multi-year BMS ratio growth using complete source data; otherwise label illustration.
- [ ] Select fictional/anonymised installer decline example, using identical data in S09 and S10.

### Gate B — Capture assets
- [ ] Capture S01–S10 against the selected release in one consistent environment.
- [ ] Verify all labels and controls match that release.
- [ ] Record screenshot source/view, reporting period and whether data is fictional or anonymized.
- [ ] Confirm that no confidential content appears.

### Gate C — Build slides and exports
- [ ] Author the **8 English slides**, not a speaker-led deck.
- [ ] Use native editable slide text/shapes/charts where appropriate, with real software screenshots as images.
- [ ] Keep each primary message readable without speaker notes.
- [ ] Provide working links and Getting Started instructions on slide 8.
- [ ] Export PPTX and PDF with matching layout, no clipped content or font substitution issues.

### Gate D — Silent-reader acceptance
- [ ] A new reader can explain the purpose, inputs, workflow, capabilities and next action after ~5 minutes, without oral explanation.
- [ ] Every screenshot is legible at normal reading zoom.
- [ ] Product filters, targets, installer merging and insights are explicitly covered.
- [ ] Both example insights carry an honest interpretation and a commercial next step.
- [ ] All statements match the actual shipped version; no invented metrics or claims of automatic alerts.
- [ ] The attached ZIP launches on Windows by opening root index.html; demo mode is clear.
- [ ] PDF/PPTX open correctly and all links work.
- [ ] A full backup method and browser-local storage caveat are available in the deliverable documentation.
- [ ] Documentation-only changes are isolated from application code; no release artefact is regenerated or modified in this planning branch.

## 7. Handoff acceptance criteria and decisions

**Definition of done for the planning phase:** This specification is committed on an isolated documentation branch and can be used by a designer/author without needing oral instructions. Actual PDF/PPTX/ZIP preparation is a distinct execution phase and must not be marked complete by committing this plan.

**Decision log, 15 October 2026:**
- Changed from a **6-slide presenter-led deck** to an **8-slide self-contained executive overview** because the user will send files without presenting.
- Switched from live-demo dependency to annotated real UI captures and written reader takeaways.
- Split equipment analytics and installer intelligence into independent slides so screenshots remain legible.
- Added explicit long-term BMS ratio interpretation, targeted installer decline example and getting-started instructions.
- Included targets, scope/date/family/model filters, duplicate installer-name merge suggestions (manual confirmation), rankings, account comparisons, insights and their practical business applications.
- Chose an English-language cross-team deck; preserve brand styling without suggesting official product endorsement.
- Planning branch must not alter main or runnable application files.

## 8. Repository grounding

Grounded in the repository as of 15 October 2026, especially:

- README.md
- docs/commercial/en/PROJECT_OVERVIEW.md
- docs/commercial/en/CHANNEL_MANAGER_PLAYBOOK.md
- docs/commercial/en/USER_GUIDE.md
- docs/commercial/en/QUICK_START.md
- codigo-fonte/docs/INSTALLER-IMPORT.md
- codigo-fonte/docs/INSTALLER-INSIGHTS.md
- codigo-fonte/dist/modules/views.js
- codigo-fonte/dist/modules/calculations.js
- codigo-fonte/dist/modules/targets.js
- codigo-fonte/dist/modules/installer-views.js

Where the production data/export process is not yet proven, this plan uses an explicit confirmation gate rather than inventing specifics.

---

**Next independent phase:** Approve the data-source wording and screenshot dataset; capture the UI; produce and quality-check PPTX and PDF; pair them with the already approved application ZIP. Do not change app features to improve the presentation.

## 9. Fictional 2023–2026 presentation dataset — production-ready input

A separate, reproducible set of **synthetic** monthly source matrices has been created under **[docs/presentations/demo-data/](demo-data/README.md)**. It exists to generate convincing, safe screenshots without exposing actual installer activations.

- **Closed reporting:** January 2023–September 2026 (45 months) across inverter equipment, battery module/BMS equipment, and monthly inverter activations by installer.
- **Current open month:** October 2026 in three **optional, separately imported partial** files; do not use it for definitive trend signals or confirm Full coverage.
- **Equipment files:** [inverters](demo-data/DEMO_EQUIPMENT_INVERTERS_2023-01_to_2026-09.csv), [battery modules and BMS](demo-data/DEMO_EQUIPMENT_BATTERY_BMS_2023-01_to_2026-09.csv).
- **Installer file:** [installer activations](demo-data/DEMO_INSTALLERS_2023-01_to_2026-09.csv), distinct from equipment files, with fictional names, intentional repeated-source rows and candidate duplicate-account spellings.
- **Reproduction / QA:** [generator](demo-data/generate-demo-data.mjs), [expected summary](demo-data/DEMO_METRICS.json), [target reference](demo-data/DEMO_TARGETS_REFERENCE.csv) and [import instructions](demo-data/README.md).

### Intended slide evidence

**Slide 04:** Equipments and filters use the populated dataset. Set monthly category/model Targets manually from the reference CSV to capture the Targets screen, since the application has no CSV target import.

**Slide 05:** Use a strictly like-for-like **January–September** comparison: synthetic BMS activations per 100 inverters are **29.6 (2023)**, **44.4 (2024)**, **58.9 (2025)** and **73.4 (2026)**. This makes the sustained illustrative rise visible without comparing nine months against a full year. Always disclose **fictional example** and that this is an activation ratio, not a verified battery attachment rate.

**Slide 06:** The fake installer matrix includes two suffix-based name-variant pairs and a repeated exact source label. Automatic suggestions need manual confirmation and consolidation only after reviewing the sums.

**Slide 07:** `DEMO Harbourlight Solar Ltd` moves from **40** activations (Apr–Jun 2026) to **23** (Jul–Sep), **−17 / −42.5%**. Use the complete synthetic reporting coverage to show the rule-based decline and inspect the profile. Treat the signalled decline as an investigation prompt, not known customer churn.

**Slide 08:** Explain that the application has its own built-in demo mode, but this extended 2023–2026 dataset is **not automatically loaded by that mode**. To explore it, import the CSVs in a separate clean local workspace, following the guide, and then create a demo JSON backup for repeatable presentations.

### Additional gates
- [ ] Test imports with the actual V2.1 interface: both equipment categories and the full fictional installer population, then optional October partial updates.
- [ ] Confirm all importer previews and coverage settings before capturing.
- [ ] Check the ratio trends and named installer signals against **DEMO_METRICS.json**.
- [ ] Produce slides only from this fictional/anonymised workspace; mark every synthetic conclusion.
- [ ] Keep all generated demo data off the runtime application's source/distribution tree and off the main branch until explicitly approved.
