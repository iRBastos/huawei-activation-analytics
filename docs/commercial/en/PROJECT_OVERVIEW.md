# Huawei Activation Analytics V2.1
## Commercial market intelligence for the installer channel

**Positioning:** Turn activation movements into timely, evidence-based channel decisions.  
**Audience:** Channel managers, distributor account teams and commercial leaders.  
**Document status:** Commercial positioning proposal, 15 October 2026. Verified against repository `iRBastos/huawei-activation-analytics`, `main` at `993fc2a`. This is an independently developed analytics application, not a claim of official Huawei product endorsement.

### The commercial challenge

Sales teams often discover changes in installer activity after an account has already slowed. Monthly activation spreadsheets contain useful signals, but fragmented files, duplicate installer names, incomplete reporting and manual comparisons delay the response. An account manager needs to know **what moved, which accounts matter, whether the evidence is reliable and what to do next**.

The goal is not simply to report inverter totals. It is to build a repeatable process that helps maintain Huawei channel engagement, spot loss-of-momentum risks, support growing partners and bring formerly active accounts back into conversation.

### What the application enables today

| Commercial question | Current application view | Possible channel decision |
|---|---|---|
| Which installer accounts are losing activation momentum? | **Installers → Insights & priorities** and **Installer profile** | Arrange an account review; investigate causes and offer relevant support |
| Which accounts have confirmed inactivity or have reactivated? | Evidence-based rule signals, with coverage checks | Qualify the situation; launch a recovery or re-engagement conversation |
| Which accounts are growing? | **Installer overview**, ranking, period trends and insights | Protect momentum with enablement, availability and joint commercial planning |
| Is the shift concentrated in a few partners or spread across the tracked portfolio? | Ranking, Top 5 concentration, contribution to change and comparative analysis | Prioritise strategic accounts or a broader channel programme |
| Are Huawei inverter or battery-module activations changing overall? | **Overview**, **Inverters**, **Batteries & BMS**, **Comparisons** | Revisit product positioning, training and distributor feedback |
| Did partner activity recover after commercial outreach? | Historical installer profile and period comparisons | Review observed activation movement; do not assume the intervention caused it |

**The operating cycle:** Import → validate coverage → detect movement → qualify the account → take action → review the next available period.

### Five commercial outcomes

1. **Earlier visibility:** Surface movement at the first reliable reporting update rather than waiting for anecdotal feedback.
2. **Smarter prioritisation:** Separate commercially material changes from small fluctuations and uncertain data.
3. **Partner retention:** Prompt focused conversations when a historically active account slows or stops.
4. **Growth activation:** Find accounts gaining momentum and identify opportunities for training, stock alignment and co-marketing.
5. **A feedback loop:** Check later reported activity and record whether actions were completed, without attributing causality from the chart alone.

### How to read the signals

The existing **Insights & priorities** engine is rule-based, not predictive AI. It distinguishes significant growth/decline, three fully reported zero months for previously active accounts, reactivation, first recorded activity after confirmed zeros, zero-baseline activity, stable activity and **Verify reporting coverage**. Its built-in priority scores are a **deterministic triage aid**, not a probability of churn.

The comparison defaults are a minimum previous-period volume of **5 activations** and a **20% change threshold**, configurable in the interface. Both compared periods must have complete coverage and equal duration for normal growing/declining classifications. A missing month must not be labelled zero. See the operating playbook for the evidence and response rules.

### A responsible definition of demand

**Recorded Huawei inverter activations by installer are a lagging indicator of observed Huawei channel activity.** They can suggest a demand shift worth investigating, but cannot independently establish sales, customer demand, lost market share, competitor substitution, installer loyalty or revenue. Aggregate product activations and installer totals are separate datasets; they cannot identify the equipment models used by a particular installer.

**Speed limitation:** This offline application does not continuously ingest live data or send automatic external notifications. Its speed depends on when fresh, reliable activation files are supplied and reviewed. The commercial recommendation is to create a recurring import-and-triage routine; automated monitoring and CRM integration would be future enhancements, not current capabilities.

### What success looks like

Track both **response discipline** and **commercial outcomes**:

- Median working days from a valid signal being reviewed to first account contact (tracked outside the app).
- Percentage of high-priority signals assessed, assigned and followed up (tracked outside the app).
- Share of account changes explained or corrected after direct partner contact (tracked outside the app).
- Next-period activations, active installer count, reactivations and concentration within the **tracked reporting portfolio** (where coverage is complete).

Use these to support market decisions, not as proof that any single campaign caused the change.

### Current application vs. future operating model

**Available now:** Offline local operation, installer import and manual account consolidation, rankings, historic profiles, 2–6 installer comparison, rule-based insights, CSV exports, equipment analysis, source evidence and JSON backups.  
**Recommended team process (not built in):** Account ownership, outreach SLA, reason codes, activity log and follow-up review.  
**Potential future features (not built in):** Automatic source synchronisation, push/email alerts, CRM write-back, competitor intelligence and forecasts.

**Related:** [Commercial action playbook](CHANNEL_MANAGER_PLAYBOOK.md) · [User guide](USER_GUIDE.md) · [Quick start](QUICK_START.md).