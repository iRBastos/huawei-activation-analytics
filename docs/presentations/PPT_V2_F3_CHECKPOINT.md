# Huawei Activation Analytics Executive Overview — F3 checkpoint

**Date:** 16 October 2026  
**Status:** F3 completed and technically verified; **F4 independent full-deck audit and F5 final handoff remain pending**.

## Scope and results

Controlled modifications to the existing **8-slide editable F2 PowerPoint**:

| Slide | F3 revision | Verification |
| --- | --- | --- |
| **01 — Cover** | Stronger left/right editorial split, tighter authentic Overview screenshot crop, aligned native copy and feature labels. Fixed a title/screenshot collision found on the first F3 render. | Final render inspected separately |
| **02 — Commercial challenge** | Shorter, better-balanced problem cards; clearer opportunity takeaway. | Final render inspected |
| **05 — Long-term trends** | Kept the original quarterly real-app chart and like-for-like Jan–Sep sequence; added a visible technical warning: BMS/inverter ratio is aggregate activations, **not confirmed physical installation pairings**. | Data/text rendered and inspected |
| **07 — Account action** | Kept the Harbourlight **40 → 23, −42.5%** scenario; tighter High/Declining real-app evidence crop, authentic long-term history image (R03), clearer Verify / Discuss / Follow up sequence, no unfounded competitor-loss claim. | Render inspected, numbers verified |
| **08 — Business value and start** | Compact benefit cards, clear four-step start/backup route, one clickable official release CTA, built-in-vs-extended demo distinction, less crowded footer. | Link checked in PPTX **and** PDF |

**Slides 03, 04 and 06 were intentionally not modified.** XML for every native shape on these F2 slides is identical before/after, and comparison of their new/old PDF renders at 1.5× resolution showed **0 changed color channels** for each entire page.

## Technical evidence

- 8 editable slides, 8-page PDF, 16:9 widescreen.
- PowerPoint rendering to eight **1920×1080** PNG screenshots completed.
- Automated slide overflow check: **PASSED**.
- PDF and PPTX hyperlink both target https://github.com/iRBastos/huawei-activation-analytics/releases/tag/v2.1.0 .
- Recorded synthetic values unchanged: 6,267 inverter activations and 4,602 BMS activations for Jan–Sep 2026; aggregate BMS per 100 inverter ratio **29.6 / 44.4 / 58.9 / 73.4** comparing Jan–Sep in 2023–2026; DEMO Harbourlight 40 in Apr–Jun and 23 in Jul–Sep 2026 (−17/−42.5%).
- F3 candidate PPTX SHA-256: `e8cd2af1aa3d4156cf83623a4cae1a9d0c9387dbac5edc5400d4dd08d9f22b5a`.
- F3 full-review PDF SHA-256: `f4673c367c07e7a6badb710bb00e109f97c5451bc0234217da08dc6932fd35b9`.
- The original **F2 candidate**, source screenshot PNGs and V1 files remain unchanged.
- This work modified no application code, tests, data import logic, official release archive, or GitHub main branch.

## Deliverables location

These files were generated, checked and saved in the user's persistent ChatGPT Library folder:

`/Huawei Activation Analytics/Executive Presentation Assets/`

- `Huawei_Activation_Analytics_Executive_Overview_V2_F3_Candidate.pptx` — all eight editable slides.
- `Huawei_Activation_Analytics_V2_F3_Full_Review.pdf` — all eight pages, suitable for reading without presenter commentary.
- `Huawei_Activation_Analytics_V2_F3_Changed_Slides_Review.pdf` — five updated pages only (01, 02, 05, 07, 08).
- `Huawei_Activation_Analytics_V2_F3_Visual_Checkpoint.png` — eight-slide contact sheet.
- `Huawei_Activation_Analytics_V2_F3_Checkpoint_Package.zip` — above files plus reproducible crop/build source, QA manifest, eight full-resolution render images and README.

PNG/PPTX/PDF/ZIP are deliberately stored in the Library instead of being committed as binary GitHub files. This report is in the **documentation-only** branch.

## Known limitations and next step

The F3 execution included visual inspections of changed pages and automated structural/integrity tests. It does **not** imply that an independent F4 full-deck audit, recipient Windows smoke test or the F5 handoff package has already passed.

**Next:** execute F4 on **all eight pages** (factual/claim checks, independent visual grading and correction as necessary), then F5 export/packaging with the unchanged official v2.1.0 release ZIP. Do not call this candidate 100/10 until those gates pass.

Related: [V2 implementation plan](PPT_V2_REDESIGN_IMPLEMENTATION_PLAN.md) · [F0–F2 checkpoint](PPT_V2_F0_F1_F2_CHECKPOINT.md) · [Original 7.4/10 audit](PPT_VISUAL_AUDIT_2026-10-16.md).
