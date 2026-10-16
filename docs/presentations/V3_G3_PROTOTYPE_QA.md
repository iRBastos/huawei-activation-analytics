# V3 — G3 Prototype Quality Check

**Status:** 3 reference slides built, rendered, and technically checked. **Awaiting human approval of the visual direction; V3 full deck is NOT complete.**  
**Date:** 16 October 2026

## Slide prototypes

| Actual V3 slide number | Tested capability | UI evidence | Main native takeaway |
| --- | --- | --- | --- |
| 04 | Inverter models and recorded change | `N01_inverter_ranking_G3.png` (authentic Inverters screen) | SUN2000-5K-LB0 recorded 1,533 activations Jan–Sep 2026 |
| 08 | Installer portfolio rankings and concentration | `N07b_installer_ranking_G3.png` (authentic Installer overview screen) | 22 active installers; Top 5 = 34.2% of tracked activations Jul–Sep 2026 |
| 11 | Multi-signal insights | `N09_multi_signal_insights_G3.png` (authentic Insights & priorities rows) | Two declining, one growing, one inactive, one reactivated, sample period Jul–Sep 2026 |

## Visual contracts applied

- Widescreen 16:9, 13.333 × 7.5in.
- Premium editorial identity: white, restrained Huawei-inspired red, charcoal, pale grey.
- Screenshot crops contain original UI pixels, without falsification or resampling distortion.
- Every slide shows one real capability, native editable numbers and a distinct commercial decision.
- Important native wording remains in editable text rather than being embedded in raster images.
- Every slide identifies its source view, illustrative synthetic-data status and version.
- The source screenshot can be read more clearly than the miniaturised V2 examples; small secondary in-app labels may still require zoom.

## Render / technical checks

- Editable PPTX: **3 slides**, each numbered according to its intended location (04, 08, 11).
- Derived PDF: **3 pages**, source text remains searchable.
- **Full-slide renders** at 1921 × 1080px inspected; contact sheet created.
- Automated `slides_test.py`: **Passed. No overflow detected.**
- Source image display aspect ratios manually matched to crop dimensions, eliminating distortion.
- All headline numeric claims cross-checked against observed real-app UI and the synthetic fixture.
- The official application ZIP is unchanged (SHA-256 `e4d42ec53b6b437fc0e05b52200670bbcea5b6bc75b9ff794e5c14f824eeae64`).
- The project GitHub main branch and V1/V2 PPTX/PDF are unaffected.

## G3 acceptance caveat: content density / next iterations

**Do not declare G3 signed off solely because these three pages look consistent.** The user should validate the readability and business emphasis first. In the final 15-slide deck:

- Slide 04 should also visibly demonstrate selectable model trend history; use screenshot `N02b_inverter_model_trend` if a two-image composition remains readable.
- Slide 08 should genuinely show the monthly activity heatmap `N08_installer_heatmap`, either within the same slide at legible size or in a purposeful supporting detail; the prototype's main evidence currently focuses on ranking.
- Slide 11's source crop prioritises names, activity classifications, current and previous values; its recorded evidence rightmost columns are intentionally cropped. Source evidence and threshold explanation should appear in native editable wording if they are critical.
- No claim of actual model purchases by named installers, real Irish market share, automatic alerts or automatic outreach.
- G5 first-time-reader 10-question test and full 15-slide quality review remain pending.

**Next:** Receive owner's focused feedback on slides 04, 08 and 11. Then build the remaining 12 slides with the same visual system and run full G5/G6 QA before distribution.