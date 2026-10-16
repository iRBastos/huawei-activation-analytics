# Huawei Activation Analytics V3 — G0/G1/G2 + G3 Reference Checkpoint

**Date:** 16 October 2026  
**Status:** G0, G1 and G2 **EXECUTED**; G3 **three-slide reference prototype built and technically inspected**. Full V3 slides G4, independent end-to-end G5, and handoff G6 **NOT YET DONE**.

## Outcome summary

- **G0 — Feature audit:** Confirmed actual v2.1.0 navigation, equipment and installer views, model analysis, BMS/module capacity, time comparisons, manual targets, installer rankings, heatmap, profile, 2–6 comparison, rules-based insights, source coverage, CSV export, backup and restore. Source: [full verified feature audit](V3_G0_FEATURE_AUDIT.md).
- **G1 — English slide copy:** Wrote and copy-locked a **15-slide** self-contained product-capability walkthrough, with “what you can do → real UI proof → commercial implication” on every feature slide. Each capability and unsupported claim is explicitly controlled. Source: [complete fifteen-slide copy](V3_G1_ENGLISH_SLIDE_COPY.md).
- **G2 — Genuine UI evidence:** Captured **18 authentic UI screenshots** from the original official offline v2.1.0 HTML, each with an **2560×1440** uncropped viewport PNG plus a pixel-faithful crop. **12** chosen as primary new V3 visuals; **6** kept as reserves, in addition to previous V2 capture pack. Screenshot manifest records hashes, exact source view, dates, crop bounds and visible text. Runtime console errors: **zero**. Combined capture/DOM/CSV/storage validation: **71/71 checks passed**; actual in-app **insights CSV exported 23 fictional accounts** and the actual **downloaded JSON backup retained 675 equipment source records, 23 consolidated installer accounts and 9 manually entered targets**.
- **G3 — Pilot design:** Created **three editable PowerPoint reference slides**, numbered as they will appear in the future V3 deck: **04 Inverter models**, **08 Installer portfolio**, **11 Account Insights**. Exported a 3-page PDF and full-resolution PNG contact sheet. Iterated cropping/display aspect ratios and source-caption placement after a visual check. Automated PPTX shape bounds: **PASSED (no overflow)**. See [G3 quality report](V3_G3_PROTOTYPE_QA.md).

## Application and data integrity

- Official published v2.1.0 release ZIP size: **576,512 bytes**; SHA-256 **e4d42ec53b6b437fc0e05b52200670bbcea5b6bc75b9ff794e5c14f824eeae64**.
- Synthetic source: January 2023 through September 2026, 45 complete reporting months; no real Huawei market or customer data in screenshots.
- All UI screenshots are genuine v2.1.0 application pixels. Because the capture browser blocks local file navigation, the HTML was opened in an isolated document with a capture-only fixture injection and temporary in-memory storage fallback. The underlying app/domain/chart code was not modified; the distributed ZIP remains unchanged.
- The **built-in fictional demo is not the extended 2023–2026 fixture**, and demo export is disabled. Captures and CSV/JSON export tests used an isolated real-mode workspace populated exclusively with synthetic records.
- Recorded activations ≠ sales, national share or installed-system pairing. Device model aggregates and per-installer totals cannot be joined by this source. Insights are rules, not real-time alerts or churn predictions.

## Saved deliverables — persistent user Library

Folder: **/Huawei Activation Analytics/Executive Presentation Assets/V3 Product Capabilities/**

1. **V3_G0_FEATURE_AUDIT.md** — detailed feature/source inventory.
2. **V3_G1_LOCKED_ENGLISH_COPY.md** — copy for all fifteen planned slides.
3. **V3_G0_G1_G2_Production_Assets.zip** — both source docs; all 18 original and 18 cropped PNGs; capture manifest, contact sheet, G2 selection (12 main + 6 reserve), browser export test CSV/backup, capture and QA scripts.
4. **V3_Capture_Contact_Sheet.png** — indexed source-evidence preview.
5. **V3_G3_Three_Slide_Prototype.pptx** — editable three-slide reference.
6. **V3_G3_Three_Slide_Prototype.pdf** — same three reference pages for user review.
7. **V3_G3_Prototype_Contact_Sheet.png** — current render preview.
8. **V3_Production_Checkpoint_G0-G3.zip** — convenient top-level zip with the evidence zip, prototype, PDF, preview and QA.
9. **V3_G3_PROTOTYPE_QA.md** — acceptance/caveats.

**GitHub:** Markdown documentation lives in this docs-only branch. PNG/PPTX/PDF/ZIP binaries remain in the user's persistent Library, not in GitHub.

## Decision before continuing

The three-slide G3 reference is a deliberate **quality gate**, not a completed 15-slide deck. In the full V3:
- Slide 04 must demonstrate the selectable inverter-model trend in addition to model ranking.
- Slide 08 must clearly demonstrate the heatmap as well as the installer ranking/concentration.
- Slide 11 should explain rule thresholds/coverage in a legible native annotation while retaining the genuine table of the five observed priority cases.
- Small incidental source UI pixels must not carry essential explanation; make native PowerPoint copy readable at laptop PDF scale.

**Next stage:** After user feedback on the reference layout, execute **G4 build of all fifteen slides**, then G5 independent 15-page visual, functional and first-time-reader audit and G6 versioned final export. Do not mark V3 100/10 or ready for external distribution before G5 and owner sign-off.

**Repository safety:** V1/V2 assets preserved and no application source or GitHub main files changed.

Related: [V3 implementation plan](V3_PRODUCT_CAPABILITIES_IMPLEMENTATION_PLAN.md) · [V3 screenshot register](V3_SCREENSHOT_CAPTURE_REGISTER.md) · [G0 audit](V3_G0_FEATURE_AUDIT.md) · [G1 copy](V3_G1_ENGLISH_SLIDE_COPY.md) · [G3 QA](V3_G3_PROTOTYPE_QA.md).
