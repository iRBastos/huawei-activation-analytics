# Documentation Review — Commercial Repositioning

**Project:** Huawei Activation Analytics V2.1  
**Baseline:** `main` commit `993fc2a`, reviewed 15 October 2026  
**Scope:** Documentation only; application source, runtime and analytical calculations are unchanged.

## Commercial narrative

The leading use case is **commercial channel intelligence**: identify meaningful installer activation changes, verify completeness, prioritise account conversations and coordinate retention, recovery or growth actions. Technical operation belongs in the user guide; actionable decision support leads the project description.

## Existing verified features

- Installer overview, rankings, active accounts, concentration, retention, momentum and historical charts.
- Searchable installer profiles and side-by-side comparisons of 2–6 accounts.
- Explainable **Insights & priorities** with volume and percentage thresholds, inactivity/reactivation and coverage checks.
- Monthly XLSX/CSV imports, controlled account-name consolidation, source evidence and exportable CSV.
- Independent equipment views, offline browser-local data and JSON backup.

## Documentation gaps identified in the existing repository

| Existing file | Issue | Proposed action |
|---|---|---|
| Root `README.md` | Equipment/technical-first introduction | Lead with installer commercial value, link the three languages and retain usage instructions |
| `codigo-fonte/README.md` | Describes commercial insights as future work | Reconcile current functionality and architecture in a later focused technical-doc pass |
| `codigo-fonte/docs/INSTALLER-IMPORT.md` | Early paragraph describes delivered profile/comparison as future work | Correct that historical wording without changing import semantics |
| `documentacao/guia.html` / `codigo-fonte/dist/guide.html` | Old user-facing explanations | Review a multilingual update, preserving offline build consistency |
| Historical V2 release and F7 records | Pre-merge 'DO NOT MERGE' language | Preserve evidence but prominently label historical status |
| Verification summaries | Earlier module/view totals | Reconcile with current source and tests |

## Delivery scope and exclusions

This multilingual documentation set provides a project overview, Channel Manager playbook, user guide, quick start and audit in **English, Brazilian Portuguese and Simplified Chinese**, with Markdown and offline HTML.

The tool remains **monthly data-import-driven**, not a real-time alert, CRM, demand forecast, competitor tracker or market-share estimator. Suggested contact timelines are commercial process recommendations, not dashboard functions. No PowerPoint is included.

## Release discipline

Keep the documentation in a separate branch. Validate Markdown links, HTML paths, language coverage and the full branch diff. Do not modify runtime files. If `README.md` changes, regenerate the deterministic source ZIP so its embedded README remains synchronized.
