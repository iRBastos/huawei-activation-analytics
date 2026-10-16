# Huawei Activation Analytics Executive Overview V2 — F4/F5 Closeout

**Date:** 16 October 2026  
**Status:** F4 independent audit **PASS**; F5 export and integrity packaging **COMPLETE**; **owner sign-off before circulation** and recipient-side Windows browser launch check remain outstanding.

**Presentation:** Eight-slide, English, standalone executive overview of the offline Huawei Activation Analytics V2.1.0 application, using **wholly fictional** 2023–2026 activity. Original V1 and both F2/F3 candidates are preserved.

## F4 — Independent 8-slide review

### Visual decisions
- Individually inspected all eight 1920 × 1080 renders, including the difficult import, target and installer pages.
- Slide 06 showed a 0.21-inch-high app screenshot that had become an unreadable strip. **Removed that ineffective raster detail** and replaced it with source-verified, **editable PowerPoint text**: "HUMAN REVIEW REQUIRED" and "Review the match before combining account records." The two actual synthetic account names remain visible in native text.
- Slide 06 is the **only change made from the F3 candidate**; all other seven slides retained their F3 shapes and contents.
- Core numbers and conclusions stay editable and readable even where small secondary labels in original UI screenshots would require zoom.
- No invented interface or unsupported product capability added.

### Programmatic QA
**23 of 23 checks passed**, including:
- Precisely 8 editable PPTX slides, 8 landscape PDF pages, 16:9 ratio.
- No slide-bound or extracted-PDF text overflow; PowerPoint overflow test passed.
- Searchable PDF, verified **working official v2.1.0 release link** in both PPTX and PDF.
- All eight slide PNGs rendered. Fictional data disclaimers present on all data-bearing slides.
- 2026 Jan–Sep inverters **6,267** and BMS **4,602** (aggregate **73.4 BMS per 100 inverter activations**).
- Like-for-like Jan–Sep BMS-per-100 values: **29.6** (2023), **44.4** (2024), **58.9** (2025), **73.4** (2026).
- Fictional DEMO Harbourlight Solar Ltd: **40** Apr–Jun 2026 vs **23** Jul–Sep 2026 = **−42.5%**.
- Manually entered fictional July–Sep inverter targets: **2,046 actual / 2,180 target = 93.9%**.
- Explicit metric caveat that BMS/inverter ratio is not a verified equipment pairing rate.
- The official release ZIP includes root index.html and passes archive integrity check. The unrelated grand-total row in the input CSV was excluded from independent arithmetic to avoid double counting.

### Known limitations
- Some incidental text inside genuine app UI screenshots is small. The PPT-native numerical callouts and descriptive captions carry the important evidence without needing to read every UI pixel.
- The official application has **not** been tested by this workflow on the specific recipient's Windows/browser environment. It should be opened and smoke-tested on Windows before organisation-wide distribution.
- An editorial grade such as “100/10” is a subjective evaluation, not a machine test. The deck meets the defined structural/factual/readability gates but still awaits the owner's communication approval.

## F5 — Final export and handoff

| Output | SHA-256 | Purpose |
|---|---|---|
| Huawei_Activation_Analytics_Executive_Overview_V2.pptx | `7c188c8ffbea4a282bce5ec7975459a8798e310bf087b389677289f02ad10dd5` | Editable final-candidate deck |
| Huawei_Activation_Analytics_Executive_Overview_V2.pdf | `e7b080bd8ab86729492cc0bbd7d76e76aafd5acd338c10f312369c787a5b95dd` | Eight-page executive reading file |
| Huawei_Activation_Analytics_Executive_Overview_V2_Preview.png | `391904121f0872c3f944ad66818abd4b6942d5efe4799da45f2843742eac8bb2` | Full-slide visual contact sheet |
| Huawei_Activation_Analytics_V2.1_Executive_Handoff_V2.zip | `0321049587e078ae011e935cffbca28040112f125fcd8df32569b7f66e958615` | PPTX + PDF + unchanged official application + READ_ME_FIRST |

### Original application integrity
- Official V2.1.0 application ZIP, 576,512 bytes:
  `e4d42ec53b6b437fc0e05b52200670bbcea5b6bc75b9ff794e5c14f824eeae64`.
- The ZIP **inside** the final handoff archive has the **same exact SHA-256** and contains root `index.html`.
- No application source, runtime, documentation included in the application ZIP, CI workflow, or public release were edited to create this presentation.

### Persistence / branch policy
All four finished binary files were uploaded into the user's permanent ChatGPT Library folder:
`/Huawei Activation Analytics/Executive Presentation Assets/`.

**The GitHub documentation branch contains this report, not the PPTX/PDF binary files.** GitHub `main` remains unchanged.

## Release criteria

**Passed:** F4 editorial/technical preflight, F5 archives, PDF parity, numeric checks, version identity, link checks, original preservation.

**Pending only:** recipient-side Windows browser smoke-test and owner approval before distributing outside the current team.

Reference: [V2 plan](PPT_V2_REDESIGN_IMPLEMENTATION_PLAN.md) · [F2 checkpoint](PPT_V2_F0_F1_F2_CHECKPOINT.md) · [F3 checkpoint](PPT_V2_F3_CHECKPOINT.md).
