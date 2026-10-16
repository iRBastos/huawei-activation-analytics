# Executive Overview V2 — Controlled Redesign Implementation Plan

**Status:** APPROVED PLAN CANDIDATE — not executed.  
**Date:** 16 October 2026  
**Repository branch:** docs/executive-overview-deck-plan-2026-10-15  
**Objective:** Upgrade the existing eight-slide Executive Overview from an editorial 7.4/10 to a convincingly premium, stand-alone, clear and legible commercial presentation, without rewriting the application.

## 1. Fixed boundaries

- Preserve **8 slides**, the approved English executive narrative and Huawei-inspired restrained visual style.
- Preserve the official application **v2.1.0**, source code, synthetic data generation, and the existing release ZIP. Its verified SHA-256 is **e4d42ec53b6b437fc0e05b52200670bbcea5b6bc75b9ff794e5c14f824eeae64**.
- Use only **actual screenshots** from the captured app. Non-destructive crops are allowed; re-creating or falsifying the app's interface is not.
- All slide typography, legends, metrics, cards, annotations and arrows should remain **editable PowerPoint objects**.
- Keep original V1 PPTX/PDF and source screenshots intact. Create a separate versioned V2.
- Make all synthetic data clearly fictional. The ratio of BMS to inverter activations is **not** a verified battery attachment rate; the installer decline is **not** proof of competitor switching or account churn.
- Recapture only if an essential visible UI element is missing or inconsistent after selective cropping.
- This phase affects presentation artifacts and documentation only; **main and application files stay untouched**.

## 2. Evidence audit — what V1 shows

The reviewed V1 is a 16:9 PowerPoint with eight editable slides. Structural overflow checks pass, but automated checks do not measure readability.

Most important visual issue: extremely wide screenshots were inserted into shallow image frames, shrinking their original UI text. Notable examples:
- Slide 03: Equipment import screenshot in **5.82 × 1.87 in**, installer import screenshot in **5.33 × 2.23 in**; both show too much of the form.
- Slide 04: Equipment filters screenshot **7.43 × 2.49 in** and Targets table **7.04 × 1.13 in**.
- Slide 06: Installer account-match proof shrunk to **4.48 × 0.73 in**, making the suggested names unreadable.
- Slide 07: Two proof screenshots **6.86 × 1.44 in** and **4.72 × 1.26 in**.
- Slide 01: Overview UI lacks presence inside a generously spaced hero card.
- Slide 08: Closing red tagline crowds the lower horizontal rule.

**Additional defect detected:** screenshot S03 shows a populated validation preview but the input still says **“No file chosen”**. V2 must crop away that picker row or recapture only S03 in a consistent file-selection state. The summary line **“25 source names · 45 months · 1 repeated rows summed”** is valid synthetic evidence.

## 3. Precise redesign by slide

| Slide | Priority | Keep | Change | Proof required |
|---|---|---|---|---|
| **01 Cover** | P2 | Title, purpose, real S01 Overview | Tighten S01 to KPIs and meaningful chart/header, remove large blank screenshot margins; stronger 45/55 editorial split, one dominant red accent | Product recognizable and proposition understandable within 10 seconds |
| **02 Problem** | P3 | Manual comparisons / Missed movement / Unfocused follow-up, no screenshots | Shorten oversized grey cards, balance spacing, strengthen “The opportunity” summary | Three equally scannable points without unused card volume |
| **03 Workflow** | **P1** | Export → Prepare → Import & validate → Analyse, S02/S03 | Reduce decorative step-row height; use two tight **validation-summary** crops instead of whole forms; native facts **45 months**, **10 inverter models**, **25 installer source names**; remove contradictory “No file chosen” element | Separate equipment/installer imports and deliberate validation clear without zoom |
| **04 Equipment** | **P1** | Period / category / model / family, targets, S04/S05 | Tight crop of S04’s real controls, native KPIs **6,267 inverters / 4,602 BMS / 73.4 BMS per 100 inverters (Jan–Sep 2026)**; substantial target table S05 crop; reduce verbose feature list | A filter value and at least one actual/target/attainment result readable |
| **05 BMS Trend** | P3 | S06 quarterly chart and annual-like Jan–Sep table | Preserve composition; add one clear qualifier: BMS per 100 inverter **activations**, not proven physical pairing; distinguish 15 quarterly chart points from 4 matched Jan–Sep periods | Real line graph remains dominant; no misleading attachment-rate claim |
| **06 Installers** | **P1** | S07 three-account comparison, S08 suggested duplicate match | Enlarge S07 and use **native readable legend** with Silverfern/Cedarfield/Harbourlight; crop S08 to a single real suggested-name pair and “Review union”; replace bulky right-hand prose with short business takeaway | All three names and one manual-review match readable |
| **07 Commercial action** | P2 | 40 → 23 / −42.5% for DEMO Harbourlight Solar Ltd, S09/S10 | Crop S09 to High/Declining row; crop S10 to KPI/evidence or replace with R03 only if clearer; native action: Check coverage → Contact installer → Investigate pipeline/price/stock/support → Agree support → Recheck | Same complete periods across UI, clear next commercial action |
| **08 Value / Start** | P2 | Four benefits, official release link, no screenshots | Compact benefit cards; align a readable four-step Getting Started and one clean CTA; remove cramped slogan/rule pairing; note built-in demo differs from extended synthetic dataset | User can open ZIP, locate index.html, choose demo and back up data |

**Evidence fidelity details:**
- Slide 03: S02 should show “Validation & proposed changes”, 45 months, 10 inverter models, 450 new values and checks passed. S03 should show 25 names, 45 months, repeated rows summed; exclude its contradictory file chooser.
- Slide 04: Do not shrink S04's full 1675 × 980 screenshot into a small frame. Keep the **real filter rows** only. S05 original is 1571 × 258: preserve readable vertical proportion, or use a native target outcome next to it.
- Slide 06: S07’s chart may stay raster; names/legend can be **duplicated in editable PPT text outside the image** if the raster legend is too small. Use actual plotted colors. S08 appears with two pairs; crop to just one unconfirmed actual pair and native explanation “human review required”.
- Slide 07: Avoid showing two microscopic software pages merely to fulfill image count. Better one readable evidence crop + one useful history detail. Native “High / Declining” and “−42.5%” may carry the essential reading.

## 4. Consistent visual system

- **Canvas:** 13.333 × 7.5 in, 16:9; white background.
- **Colors:** #20252B dark, #C71932 restrained red, #F3F5F7 pale grey.
- **Grid:** approximately 0.65 in margins, consistent title baseline and quiet footer; avoid 3+ competing card styles.
- **Typography:** titles generally 28–32 pt, body 16–18 pt, supporting labels at least 11–12 pt. Important metrics 30–46 pt. Critical screen text must be visually readable at native laptop PDF scale; if not, tighter crop and native caption.
- **Images:** maximum two genuine screenshot crops per slide; source PNGs unmodified, new V2 crops alongside originals, aspect ratios preserved.
- **Semantics:** no invented charts or app UI; native charts/text may communicate real verified synthetic data independently.
- **Disclaimer:** on each relevant image/data slide: “Illustrative synthetic data — not actual Huawei results.”
- **Audience:** unattended reading; no reliance on presenter notes or animations.

## 5. Implementation phases and gates

### F0 — Baseline freeze and inventory
- Copy V1 PPTX/PDF and all original/ppt_ready screenshot source assets into an immutable V1 working directory.
- Save checksums and inventory; verify current official v2.1.0 digest.
- Confirm slide source text, editable objects and embedded images.
- **Gate:** input integrity, no missing assets and no release mismatch.

### F1 — Crop design
- Re-crop S01, S02, S03, S04, S05, S07, S08, S09 and S10 as required; preserve S06's successful line chart.
- Validate source pixel density and whether native annotations can compensate without falsifying the screenshot.
- Fix S03 “No file chosen” visual inconsistency by crop or targeted recapture.
- Produce a numbered crop contact sheet.
- **Gate:** each important source label is readable in its *planned display size*.

### F2 — Solve three hardest slides first
- Rebuild slides **03 → 04 → 06**, reuse existing slide layouts/native objects where workable.
- Export a 3-slide preview **at actual 16:9 slide size** and review each image on an ordinary laptop display.
- Iterate until their proof text is readable, layout balanced and message independently understandable.
- **Gate:** do not continue to broad cosmetic polish if P1 layouts fail.

### F3 — Refine the other five slides
- Refine slides **01, 07, 08**, and only minor adjustments to **02, 05**.
- Make labels, baseline and footer consistent. Preserve editable content.
- **Gate:** complete 8-slide English deck with coherent narrative, correct synthetic caveats.

### F4 — Independent quality audit
- Render **each** PPTX slide to a separate high-resolution PNG (at least 1920 × 1080) and review individually, not just in a contact sheet.
- Export PDF independently and inspect all eight pages at 100% laptop zoom.
- Validate text extraction, readability, clipping, links and numeric consistency.
- Regenerate after corrections and repeat. Aim for **all slides ≥9/10 by editorial review**, with zero unresolved major/critical issues; rating is not an automated substitute.
- **Gate:** no “100/10” declaration before passing human-readable evidence review.

### F5 — Delivery
- Create versioned editable PPTX, final PDF, overview contact sheet and full delivery ZIP.
- Include **unchanged official V2.1.0 ZIP** and short usage instructions.
- Save outputs in ChatGPT Library /Huawei Activation Analytics/Executive Presentation Assets/.
- Add a build report/QA findings to the documentation branch only.
- **Gate:** official ZIP checksum and nested contents unchanged; recipient Windows/browser launch check remains a separate handoff acceptance point when not directly performed.

## 6. Numeric and claim acceptance

These figures must match each other in screenshots, captions and presentation text:

| Metric / comparison | Correct synthetic value |
|---|---:|
| Inverters Jan–Sep 2026 | 6,267 activations |
| BMS Jan–Sep 2026 | 4,602 activations |
| BMS per 100 inverter activations Jan–Sep 2023 | 29.6 |
| BMS per 100 inverter activations Jan–Sep 2024 | 44.4 |
| BMS per 100 inverter activations Jan–Sep 2025 | 58.9 |
| BMS per 100 inverter activations Jan–Sep 2026 | 73.4 |
| DEMO Harbourlight Apr–Jun 2026 | 40 |
| DEMO Harbourlight Jul–Sep 2026 | 23 |
| Harbourlight absolute and percentage change | −17 / −42.5% |

No partial October 2026 numbers in headline visual evidence; do not compare 2026's nine months to full-year preceding totals. Account suggestions are human-reviewed, not automatic mergers.

## 7. Release plan and file naming

Do not overwrite the original presentation before V2 approval. Proposed outputs:

- Huawei_Activation_Analytics_Executive_Overview_V2.pptx
- Huawei_Activation_Analytics_Executive_Overview_V2.pdf
- Huawei_Activation_Analytics_Executive_Overview_V2_Preview.png
- Huawei_Activation_Analytics_V2.1_Executive_Handoff_V2.zip
- PPT_V2_BUILD_REPORT.md (documentation branch, after verification)

**No app code, installer import logic, JSON data format, GitHub workflows, release asset, or production runtime changes.**

## 8. Definition of done

- [ ] Precisely 8 editable PPTX slides / 8 PDF pages.
- [ ] All screenshots legible at normal viewing scale; no contradictory importer UI.
- [ ] Slides 03, 04, 06 independently prove their capabilities.
- [ ] Slides 01, 07, 08 polished; slide 05 accurate and preserved.
- [ ] No clipped text, collisions, warped images, tiny labels or unintentional empty areas.
- [ ] Synthetic data, 40→23 / −42.5% and BMS ratios independently cross-checked.
- [ ] Every key capability accurately represented and manual limitations visible.
- [ ] Link to official v2.1.0 release works in PPTX **and** PDF.
- [ ] All major elements editable and all PNG evidence authentic.
- [ ] Separate final visual audit completed, with no critical or major defects.
- [ ] Application ZIP checksum unchanged, original V1 unaffected, main unaffected.
- [ ] User approves final assets before distribution.

**Execution sequence recommendation:** Begin F0 → F1 → F2; pause for a dedicated checkpoint on the rebuilt slides **03, 04 and 06**, then F3 → F4 → F5. This prioritizes the expensive design risks and avoids wasted polishing work.

Related: [Original plan](EXECUTIVE_PRODUCT_OVERVIEW_PLAN.md), [Screenshot plan](SCREENSHOT_CAPTURE_PLAN.md), [Screenshot capture report](SCREENSHOT_CAPTURE_REPORT.md), [Visual audit](PPT_VISUAL_AUDIT_2026-10-16.md).
