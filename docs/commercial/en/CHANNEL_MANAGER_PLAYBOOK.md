# Channel Manager Playbook
## Detect movement. Qualify the cause. Act while the relationship is actionable.

**Purpose:** Operationalise Huawei Activation Analytics V2.1 as a disciplined commercial review, not merely a reporting screen. This is a proposed management playbook; response times, CRM logging and coordination are **not automatic product features**.

## 1. Commercial monitoring cadence

| When | Account manager activity | Expected output |
|---|---|---|
| **When the latest monthly export arrives** | Import, check month coverage, run portfolio and installer signals | Fresh, evidence-checked priority queue |
| **Weekly commercial review** | Revisit open actions and any newly received data; do not imply a new signal without new evidence | Owners, next actions and escalation decisions |
| **Monthly channel meeting** | Review portfolio movement, material account shifts, feedback and intervention results | Commercial priorities, proposed distributor/partner actions |
| **Quarterly review** | Compare trends and partner concentration over complete, like-for-like periods | Structured retention, growth and channel-development plan |

**Principle:** A faster meeting cadence cannot compensate for missing or outdated source data. Record the last complete reporting month prominently in every summary.

## 2. The six-step decision loop

1. **Trust the inputs.** In **Data → Installer imports**, reconcile totals, repeated names and reporting scope. Full population must be explicitly confirmed; omitted accounts in a partial update are *unknown*. Investigate **Data check** before interpreting a decline.
2. **Spot the movement.** Open **Installers → Insights & priorities** and filter by **High**, signal type and strategic accounts. Defaults: minimum relevant volume **5**, minimum change **20%**; tune thresholds deliberately and note the setting used.
3. **Put the change in context.** Review **Installer profile** monthly/quarterly/annual history, last activity, known zero vs unknown periods and underlying source evidence. Use **Compare 2–6** to examine peers with the same reporting window.
4. **Qualify the reason.** Contact the partner; ask about project pipeline, installer capacity, availability, commissioning friction, pricing, training, support, customer demand and competing offers. Treat each possible reason as a **hypothesis until confirmed**.
5. **Choose an intervention.** Align the appropriate distributor, service, training, product or marketing contact. Agree a named owner, specific offer or resolution, expected next step and follow-up date. Log these outside the dashboard.
6. **Check the outcome.** At the next complete reporting update, assess account activation movement and documented feedback. Capture what changed; do not claim causation without supporting evidence.

## 3. Signal-to-action matrix

| Observed signal or metric | Commercial interpretation to investigate | Recommended response | Verification gate |
|---|---|---|---|
| **Declining activations** | Loss of momentum in Huawei activity at a known account | Schedule account check-in; confirm pipeline, price/availability and support problems; agree recovery action | Complete equal-length comparison; change passes selected thresholds |
| **Inactive — 3 confirmed zero months** | Formerly active installer has a sustained pause | Contact directly; check installer status, current brand mix, training/service barriers and project outlook | Three **closed, fully covered** zero months and prior positive activity |
| **Reactivated** | Huawei activity resumed after a confirmed pause | Welcome the activity; discuss next projects, stock and technical support | Positive latest closed month after three confirmed zero months plus earlier activity |
| **Growing activations** | Partner may be expanding Huawei activity | Protect momentum; confirm stock, training and project readiness; consider joint marketing | Complete comparable periods and significant increase |
| **Activity after zero baseline** | Account recorded activity where comparison was confirmed zero | Understand what triggered the return; avoid infinite growth percentages | Current and previous complete; previous exactly zero |
| **Verify reporting coverage** | An apparent drop may be a data artefact | Reconcile file, reporting universe and open periods before commercial escalation | Missing, partial, open or unequal period flagged |
| **Top 5 concentration / account contribution** | Portfolio depends more heavily on a small set of tracked installers | Protect key relationships and diversify support across emerging partners | Eligible reporting portfolio; not Ireland-wide market share |

**These are commercial response recommendations, not claims that the software identifies competitor losses or automatically selects an offer.**

## 4. Proposed response priorities (team policy, not software logic)

- **P1 — respond within two working days:** An evidence-backed, high-priority signal on a strategic or historically material account, especially a major decline or verified inactivity. Confirm the owner and outreach.
- **P2 — respond within five working days:** Medium-priority decline, first activity or significant growth where support can preserve momentum.
- **Data-first:** Incomplete coverage, uncertain identity or inconsistent source values. Fix the input before labelling a commercial risk.
- **Monitor:** Small/stable changes that do not cross the agreed materiality threshold; include in the next review.

The in-app **High / Medium / Low** labels derive from a deterministic score: **High ≥ 60, Medium 30–59, Low < 30**; **Data check** has no commercial score. Do not confuse these with the suggested team P1/P2 contact SLAs.

## 5. Worked example — a declining account (fictional)

A tracked installer reports **40** inverter activations in the previous three complete months and **23** in the following three complete months.

- Absolute change = **−17** activations.
- Relative change = **−42.5%**.
- With default volume threshold **5** and percentage threshold **20%**, this qualifies as a **Declining activations** signal if coverage and equal-duration conditions are satisfied.
- Under the current rule score, the signal would score **65 (High)** in this simplified scenario. **65 is not a 65% probability of losing the partner.**

**Action:** Check whether the partner has fewer projects, delayed commissioning, pricing objections, alternative equipment, stock problems or technical concerns. Confirm findings with the installer, record next steps and review subsequent complete reporting periods. A recovery in activations alone does not prove the intervention worked.

**Counter-example:** If the most recent month is missing in a partial export, do **not** replace it with zero, infer a −100% collapse or escalate as confirmed churn. Classify as a reporting check first.

## 6. Account conversation guide

**Open:** “We've noticed a change in the Huawei activation activity recorded for your account and wanted to understand how things are going.”

**Explore:** “Is this mainly project timing, demand, equipment availability, pricing or something in the installation/support experience?”

**Offer support:** “What would make Huawei easier to specify and install on your upcoming jobs? Would product training, technical support or coordination with your distributor help?”

**Close:** Confirm the action, owner and follow-up date. Avoid claiming the dashboard knows why volume changed.

## 7. Monthly channel review — suggested one-page structure

1. **Data status:** Last complete period, input freshness, Full/Partial coverage and open data gaps.
2. **Portfolio pulse:** Recorded activations, active accounts, momentum and concentration in the tracked base.
3. **Accounts requiring attention:** High-priority decline/inactivity, source evidence, commercial owner and next action.
4. **Growth opportunities:** Growing/reactivated partners, stock/training/marketing support proposed.
5. **Interventions and outcomes:** Previous actions, partner feedback and subsequent recorded changes.
6. **Decisions needed:** Budget, training, distributor follow-up, pricing escalation or product feedback.

## 8. Measurements that matter

| Measurement | Where it comes from | Guardrail |
|---|---|---|
| Changes in installer activations | Dashboard, validated closed periods | Activity proxy, not direct demand or revenue |
| Number of active installers | Dashboard, complete installer coverage | Tracked population only |
| Reactivations / significant declines | Dashboard, rule-based signals | Use source evidence and rule definitions |
| Accounts contacted and follow-ups completed | Team CRM or action log, **outside the app** | Record owners and dates consistently |
| Time from signal to first response | External action log | Depends on export and review freshness |
| Product mix movement | Equipment analytics, independent dataset | Cannot attribute models to named installers |

## 9. Operating guardrails

- Never call a missing reporting month a confirmed zero. Never use an open month as a completed-month trend.
- Never equate a Huawei activation decline with competitor switching, customer churn or loss of Irish market share without further evidence.
- Do not infer individual battery attachment or model-by-installer installations from independent aggregate tables.
- Do not publish installer names or confidential source files publicly. Data and JSON backups are browser-local and should be secured.
- Treat high score as a **reason to investigate**, not proof of cause or a prediction.
- This is **not** live alerting: there are no built-in automatic email/push notifications, CRM integration or live market feeds.

**Sources within this repository:** `codigo-fonte/docs/INSTALLER-INSIGHTS.md`, `codigo-fonte/dist/modules/installer-insights.js`, `codigo-fonte/docs/INSTALLER-IMPORT.md`, `codigo-fonte/dist/modules/installer-views.js` (verified at `993fc2a`).