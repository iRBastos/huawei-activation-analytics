# Huawei Activation Analytics — independent slide-by-slide visual audit

**Date:** 16 October 2026  
**Reviewed:** `Huawei_Activation_Analytics_Executive_Overview.pptx`, its 8-page exported PDF, and 8 separate 2401 × 1350 PNG renders.  
**Verdict:** **7.4/10 — good first version, NOT yet approved as the final asynchronous executive handoff.**  
**Status:** Audit only. Original PPTX/PDF **not altered**.

## Executive diagnosis

The 8-slide structure, Huawei-inspired minimalist aesthetic, baseline content, synthetic data labels and main numerical claims are generally coherent. Structural tests pass (8 slides, 8 PDF pages, no PPTX overflow). The PDF's official GitHub release link is present. The bottleneck is **proof readability**: important screenshots are miniaturized to the point that an unfamiliar stakeholder cannot confidently read fields and results in slides 3, 4, 6 and 7.

The 7.4/10 rating is an editorial assessment, not an automated benchmark. It reflects the requirement to **email the presentation without a presenter**.

## Scorecard & surgical change requests

| Slide | Score | Problem | Required action |
| --- | ---: | --- | --- |
| 01 Cover | 7.6 | Authentic Overview hero appears small in an oversized frame, leaving an unhelpful blank panel and partly cut chart. | Re-crop around Overview KPIs to make the interface visually strong; maintain legible value proposition. |
| 02 Challenge | 8.4 | Clean and comprehensible; extra blank room in the three cards makes content less economical. | Reduce card height and give the consequence / opportunity greater emphasis. |
| 03 Workflow | **6.2** | Two import forms are too small to read at normal slide/PDF viewing size. | Tight crops around import preview and validation evidence. Use native text for 45 months, equipment model count, installer source names and review step. |
| 04 Equipment & Targets | **6.6** | Filter controls and attainment table are microscopic, weakening the demonstration. | Zoom into active filters and key KPI; highlight one actual/target/attainment result in editable type. Minimize irrelevant table columns. |
| 05 Trend | **8.7** | Strongest slide, clear trajectory and year numbers. Interpretation could be more precise about physical battery attachment. | Keep trend; explicitly state it is aggregate BMS/inverter activation ratio, **not** verified installed pairing. Clarify Jan–Sep cross-year comparison; do not imply the plotted quarterly points are annual values. |
| 06 Installers | **6.4** | Chart has narrative but tiny legend; duplicate-name suggestion is far too small to read. | Enlarge comparison identities / plot; show one meaningful unification suggestion in a much tighter UI crop plus native explanation of human approval. |
| 07 Account action | 7.5 | Big 40→23 / −42.5% is effective, but supporting UI screens are small and action strip too generic. | Crop to the specific High/Declining evidence row and profile history; replace generic actions with a specific account investigation sequence. |
| 08 Value & Start | 8.0 | Contents are useful and link exists; final red slogan sits too near horizontal divider with inadequate breathing room. | Rebalance lower layout, clarify steps, give CTA a stronger simple ending; preserve distinction between built-in demo and extended fictional dataset. |

**Priorities:** P1 = slides 03, 04, 06; P2 = slides 01, 07, 08; P3 = slide 02; preserve slide 05 with a data-meaning note.

## Verified facts

- PDF: 8 pages, widescreen 16:9; expected contents and link to `https://github.com/iRBastos/huawei-activation-analytics/releases/tag/v2.1.0`.
- PPTX: 8 slides; `slides_test.py` reports **no overflow detected**.
- Fake-data trend remains internally coherent: BMS per 100 inverters Jan–Sep 2023 = 29.6; 2024 = 44.4; 2025 = 58.9; 2026 = 73.4.
- Account case: DEMO Harbourlight Solar Ltd = 40 Apr–Jun 2026 and 23 Jul–Sep 2026, difference −17 (−42.5%).
- Several screenshot labels and source UI tiny text become hard to inspect after insertion into the deck; passing automated overflow tests **does not** establish human readability.
- The existing PDF and PPTX were **not updated** during this visual review; do not misrepresent the audit as a correction.

## Saved review assets

In ChatGPT Library folder `/Huawei Activation Analytics/Executive Presentation Assets/`:
- `Huawei_Activation_Analytics_PPT_Visual_Audit.pdf` — 9-page diagnosis with cover and each full-slide screenshot, plus slide-specific observation and action.
- `Huawei_Activation_Analytics_PPT_Review_Contact_Sheet.png` — an 8-slide visual index and scores.
- `Huawei_Activation_Analytics_PPT_8_Slides_Review.zip` — eight individual 2401×1350 screenshots, contact sheet, audit and machine-readable scorecard.

## Acceptance criteria for the next revision

1. Make **all** evidence-bearing UI images readable at normal PDF zoom and laptop full-screen size; prefer crop and native callout to fitting whole UIs.
2. Confirm each large number on a slide is visibly supported by either an adjacent readable screenshot or a clearly labeled fictional illustrative dataset.
3. Every slide supports independent reading; no presenter notes needed.
4. Avoid a visually decorative screenshot that conveys no legible proof.
5. Keep exactly 8 slides unless a deliberate content tradeoff justifies a change.
6. Render revised PPTX to 8 full-size PNGs and do a second independent visual audit.
7. Recheck link, story, unit labels and all numerical claims.
8. Do not modify the application source or the official distribution release to improve presentation visuals.

**Next step:** Produce a controlled v2 of the executive deck implementing P1 and P2 without reworking the app or inventing software screenshots.
