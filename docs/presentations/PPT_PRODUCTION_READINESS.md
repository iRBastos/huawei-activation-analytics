# Huawei Activation Analytics — PPT Production Readiness / Final Handoff

**Status:** READY TO BUILD, subject to mandatory post-export QA (PPTX/PDF not created at the date of this note).
**Date:** 15 October 2026
**Working branch:** docs/executive-overview-deck-plan-2026-10-15
**Audience and purpose:** Managers and channel colleagues receiving the slides **as files**, with no live presentation.
**Language:** English, executive tone, concise; all necessary interpretation is on the slides themselves.

## 1. Current verified assets

| Item | Status | Evidence / location |
| --- | --- | --- |
| 8-slide storyboard | Ready | [Master plan](EXECUTIVE_PRODUCT_OVERVIEW_PLAN.md) |
| 10 captured screenshots S01–S10 | Ready | ChatGPT Library: /Huawei Activation Analytics/Executive Presentation Assets/Huawei_Activation_Analytics_Presentation_Screenshots_2023-2026.zip |
| 3 optional reserve screenshots R01–R03 | Ready | Same ZIP |
| Contact sheet | Ready | Library: /Huawei Activation Analytics/Executive Presentation Assets/Screenshot_Contact_Sheet.png |
| Screenshot method and exceptions | Documented | [Capture report](SCREENSHOT_CAPTURE_REPORT.md) |
| 45 closed months of fictional source data | Ready | [Fictional CSV guide](demo-data/README.md), Jan 2023–Sep 2026 |
| Reusable synthetic workspace backup | Ready | \`DEMO_2023-2026_RESTORE_BACKUP.json\` inside screenshot ZIP |
| Target attainment scenario | Ready | 9 manually populated fictional category/month targets; see screenshot S05 |
| Installer decline scenario | Ready | DEMO Harbourlight Solar Ltd, Apr–Jun 2026: 40; Jul–Sep 2026: 23; −42.5% |
| Official V2.1.0 application release | Verified | https://github.com/iRBastos/huawei-activation-analytics/releases/tag/v2.1.0 |
| Release content identity | Verified | Official release ZIP asset reports SHA-256 **e4d42ec53b6b437fc0e05b52200670bbcea5b6bc75b9ff794e5c14f824eeae64**. Locally inspected screenshot source ZIP has the *same SHA-256 and size 576,512 bytes*. |
| GitHub \`main\` unchanged | Verified as of this review | All planning and reports are isolated under docs/ on the documentation branch |

**Attention:** Captures were made from the actual release UI/domain with a temporary in-memory browser-storage adapter due to the capture environment; an independent standard Windows browser launch remains a distribution-stage check, not a reason to modify the app.

## 2. Locked visual decisions

- **Exactly 8 slides**, widescreen **16:9**, 13.333 × 7.5 in.
- **White space and hierarchy first:** editorial layout, no animations/transitions, no decorative stock imagery.
- **Palette:** white \`#FFFFFF\`, Huawei-inspired red \`#C71932\` (emphasis only), charcoal \`#20252B\`, light grey \`#F3F5F7\`. Avoid official Huawei logo imagery; the project name is text.
- **Type:** Aptos or Arial: 28–32 pt section headers, 16–18 pt explanatory text, 10–12 pt legible disclaimers. Metrics may be 30–46 pt.
- **Geometry:** title starts near x=0.66in/y=0.52in; content below y≈1.55in; footer begins near y≈7.04in; at least 0.60in outside margins.
- **PPT-native editable:** all titles, business takeaways, numbers, labels, arrows, flows, mini-cards and confidentiality labels. Real screenshots stay raster PNG.
- **No screenshots on slides 2 and 8**; use native diagrams and text. Capture use: S01, S02/S03, S04/S05, S06, S07/S08, S09/S10.
- **Mandatory slide label** when fake metrics are shown: “Illustrative synthetic data — not actual Huawei results.” Avoid imposing this label over the pixels of the captured app.
- **Do not link a displayed metric to revenue, market share, confirmed battery attachment, competitor switching or a guaranteed commercial intervention outcome.**

## 3. Eight-slide copy lock (final English direction)

### 01 — Title and proposition

**Title:** Huawei Activation Analytics

**Subhead:** From Activation Data to Commercial Intelligence

**Standfirst:** An offline tool to understand recorded equipment activity, identify installer movements and focus channel-management decisions.

**Screenshot:** S01, 55% right-hand hero; the image establishes the actual app UI and does not need every tiny value to be read. Left ~45% is title and message.

**Takeaway:** “Better visibility of what is changing — and where to focus.”

### 02 — The problem, not a technical tutorial

**Title:** We Have the Data. The Challenge Is Recognising Change.

**Three columns:**
- “Manual comparisons” / Separate reports make historical comparisons time-consuming.
- “Missed movement” / Portfolio and installer trends can be difficult to spot early.
- “Unfocused follow-up” / Without prioritisation, meaningful account changes may be overlooked.

**Bottom takeaway:** “A repeatable monthly review can turn existing records into more timely commercial conversations.”

**Visual:** three native problem cards with subtle icons; **no screenshots**.

### 03 — Workflow and trusted data handling

**Title:** From Monthly Reports to Actionable Analysis

**Native 4-stage flow:** “Export reports → Prepare files → Import & validate → Analyse”.

**Full explanation on slide (no speaker notes):** “Equipment and installer files are imported in separate sections of the Data workspace. The tool reviews the input and calculates updated KPIs, trends and account indicators after confirmation. Updates are manual; there is no live system connection.”

**Screenshots:** S02 (equipment import preview) and S03 (installer import preview), either equal-size framed horizontal strips or S02 primary plus S03 smaller detail. Clearly label which file type each shows.

**Open source-system wording issue:** Unless the owner confirms the internal source system name, say **“monthly activation reports from our internal reporting system”**. Do not write an invented platform name or assert that two files supply all installer and model data.

### 04 — Equipment insights and targets

**Title:** Analyse Equipment Performance — From Portfolio to Model

**Short supporting copy:** “Select complete periods, categories, model families or individual SKUs; review comparable activity, activation ratios and manually defined targets.”

**Native KPI emphasis:** 6,267 recorded inverter activations; 4,602 BMS activations; 73.4 BMS per 100 inverters **for Jan–Sep 2026 (fictional data)**. All amounts must be legible independent of screenshot text.

**Screenshots:** S04 (filters + KPIs, crop upper section tightly) and S05 (actual vs target table, secondary crop).

**Callout:** “Targets are entered manually; the analysis uses recorded activations, not confirmed sales.”

### 05 — Long-term market intelligence

**Title:** Identify Structural Changes in the Recorded Product Mix

**Main example:** “BMS activations per 100 inverter activations — comparable January–September periods: 2023: 29.6; 2024: 44.4; 2025: 58.9; 2026: 73.4.”

**Left:** S06 (the app's **quarterly** BMS/Inverter chart, Q1 2023–Q3 2026), large enough to see the increasing line and time axis. **Right:** native typeset comparable-year metrics, observation and commercial question. Do not mislabel January–September calculations as “full-year” values or as the plotted quarterly datapoints.

**Interpretation:** “The fictional series shows a sustained increase in BMS relative to inverter activations. This is a signal to investigate storage mix, partner engagement and product positioning — not a verified rate of battery-equipped installations.”

### 06 — Installer intelligence

**Title:** See Which Installer Accounts Are Changing

**Supporting copy:** “Rank and compare accounts, analyse individual histories and identify meaningful changes. Duplicate-name suggestions are reviewed by a person before combining quantities.”

**Screenshots:** S07 (three-instal​​ler quarterly comparison, **main**) + S08 (two real UI-suggested matching company-name variants, **small framed detail**).

**Emphasis:** “The tool helps locate the right accounts to investigate, not infer the reasons for the change.”

**Precision:** Installer monthly counts are separate from equipment-model totals. No per-installer product-model join is available.

### 07 — Commercial response to a declining account

**Title:** Turn a Change in Activity into a Commercial Follow-up

**Main numeric message:** “40 → 23 activations | −42.5%” for **DEMO Harbourlight Solar Ltd**; “Previous: Apr–Jun 2026 / Current: Jul–Sep 2026”, fully confirmed fictional periods.

**Evidence:** S09, High / Declining insight, and S10, same account profile. **R03 may replace the large S10 viewport** if the monthly chart is more legible; do not add a third screenshot.

**Native action strip:** “Detect → Validate → Contact → Investigate → Follow up”.

**Interpretation:** “This rule-based signal recommends checking partner pipeline, pricing, stock, training or support. It does not prove the account was lost.”

### 08 — Value + immediately actionable start

**Title:** Make Activation Intelligence Part of the Channel Review

**Four succinct benefits:** Visibility / Efficiency / Account Prioritisation / Informed Partner Support.

**Workflow:** “Refresh data monthly → Verify complete coverage → Review priority accounts → Follow up → Recheck next month.”

**Getting started:** “1. Extract the official V2.1.0 ZIP. 2. Open the root \`index.html\` in a browser. 3. Select \`Explore fictional demo\`, or import approved spreadsheets. 4. Use \`Data → Backup & guide\` to export a full backup.”

**Explicit distinction:** “The built-in fictional demo differs from the separate extended 2023–2026 synthetic dataset used in these screenshots.” This can be a legible footer or in optional accompanying email.

**Link:** https://github.com/iRBastos/huawei-activation-analytics/releases/tag/v2.1.0 (clickable in PPTX and PDF); link to English user guide as secondary link where legible.

**No screenshot.** Closing line: “Better visibility. Earlier investigation. More focused commercial action.”

## 4. Readability improvements before final slide export

The capture pack is complete, but some images contain a **large UI area relative to their final allotted slide space**. Do not scale full 1675px screenshots into tiny unreadable panels.

**Required selective crops — derived from existing images; no app rerun required unless a critical portion is missing:**
- **S04:** extract the expanded filter strip and the top KPI row; use a larger native metric to avoid expecting 6pt UI text to be readable.
- **S08:** crop around “Suggested matches” and the first 1–2 visible name-variant rows; may need high-width placement and PPT-native restatement of the exact example.
- **S09:** crop to search/filter and the single Harbourlight result row; native PPT texts carry “High / Declining” and “−42.5%”.
- **S10:** crop to account name, KPIs and insight text, or use **R03** as the sharper monthly history substitute.
- **S02/S03:** both are short/wide screenshots. Use native labels (“Equipment import” / “Installer import”) and at most two concise captions rather than relying on every validation field.
- **S01:** visual hero only; keep its contents authentic, but do not treat the details as the slide's body text.

Never create synthetic *software screenshots* from generic graphics. Native presentation annotations and faithful screenshot crops are permitted.

## 5. Last pre-production blockers and sensible defaults

| Decision | Importance | Default if not confirmed |
| --- | --- | --- |
| Exact internal report source system name | Optional | “Internal activation reporting system” |
| Audience identities and whether to name the author on slide 1 | Optional | No personal name or confidential distribution list |
| Confidentiality classification | Check before external circulation | Mark “For internal discussion · Illustrative synthetic data” |
| Whether to attach fictional backup to recipient email | Optional | No: ship official application ZIP, the PDF and editable PPTX; have standalone backup available on request |
| Windows launch verification | Mandatory **before sending the software** | Test extracted official release ZIP in recipient-like Windows browser; record outcome; do not claim it has passed if not done |

**Nothing above is a blocker to starting slide construction.** The source-system and authorship questions can be safely resolved with non-specific, neutral deck copy.

## 6. Distribution packaging (no confusion with screenshot assets)

**Recipients should receive:**
1. \`Huawei_Activation_Analytics_Executive_Overview.pdf\` — primary reading artifact.
2. \`Huawei_Activation_Analytics_V2.1.0.zip\` — the official unchanged release with root index.html.
3. \`Huawei_Activation_Analytics_Executive_Overview.pptx\` — editable version if appropriate.

**Do not automatically attach** 10 PNGs, raw synthetic CSVs, screenshot ZIP or source-code archives to the management email; those are **production support assets** and optional technical appendix. Include the screenshot backup separately only if the recipient specifically wants to reproduce the exact synthetic examples; using built-in fictional demo will show a different built-in sample.

## 7. Final QA gates and acceptance criteria

1. **8 slides** and **8 PDF pages**, 16:9, same ordering.
2. All titles, explanations, metrics and calls to action are readable **without presenter commentary**.
3. Numerically audit figures against screenshot source and \`demo-data/DEMO_METRICS.json\`; 40→23/−42.5%, BMS-per-100 Jan–Sep annual ratios.
4. Every slide with fictitious figures clearly labels them as synthetic. No apparent real-customer/market claims.
5. Screenshots are actual app UI, not recreated mockups, and stay crisp at 100% PDF zoom. Where tiny labels would be illegible, crop or add native text.
6. No text overlap, clipping, inconsistent fonts or misplaced screen elements after export. Render all slides to image previews for visual inspection.
7. All hyperlinks function from both PPTX and PDF.
8. PDF is the designated primary reader file; PPTX is editable.
9. The attached official ZIP checksum matches the verified release digest above. Root \`index.html\` is present.
10. Windows browser acceptance of the ZIP is completed **before external handoff**, with backup/storage caveat included in the user documentation.
11. No production or demonstration changes are committed to the app's \`main\` as part of this slide job.
12. Review final PDF in a quiet, presenter-free 5-minute reading session: can an unfamiliar manager explain the purpose, workflow, results, limits and next action?

## 8. Production execution order

**Build → Review → Correct → Package**, in this order:

1. Freeze the above English copy and screenshot selection.
2. Make minimal selective zoom crops from \`ppt_ready/\` PNGs and label them with deterministic names, preserving originals.
3. Generate eight-slide editable PPTX; native PowerPoint numbers/flows/text, screenshots as PNG.
4. Render every slide to PNG preview; visual inspection at intended size.
5. Revise whitespace, crop boundaries, metric consistency and annotation readability.
6. Export PDF and verify eight pages and hyperlinks.
7. Verify official ZIP checksum, root index.html, Windows launch and storage behavior.
8. Package PDF, editable PPTX and untouched official ZIP. Keep source images/backup in archival folder.
9. Write one short cover email describing the attached files and the principal commercial benefit.

**Do not call the deliverable “final” until all QA gates are passed.**

Related: [Storyboard](EXECUTIVE_PRODUCT_OVERVIEW_PLAN.md) · [Capture plan](SCREENSHOT_CAPTURE_PLAN.md) · [Capture report](SCREENSHOT_CAPTURE_REPORT.md) · [Dataset](demo-data/README.md).
