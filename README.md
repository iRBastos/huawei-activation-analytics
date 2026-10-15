# Huawei Activation Analytics

**Commercial intelligence for the Huawei installer channel — V2.1.0**

A browser-based, offline analytics application for tracking Huawei equipment activations and, crucially, identifying meaningful changes in installer activity. It helps Channel Managers **detect declining momentum, inactivity, reactivation and growth**, validate reporting evidence and prioritise retention, support and development conversations.

**Commercial decision loop:** Refresh monthly data → identify material movements → validate coverage → review installer history → contact partners → follow up on subsequent complete reporting periods.

The application uses explainable, rule-based insights. It does **not** provide real-time notifications, competitor switching proof, sales or revenue, market share, or automated CRM actions. Installer-level totals and equipment-model activations are independent datasets and must not be joined without supporting data.

## Commercial documentation — English · Português · 简体中文

| Document | English | Português (Brasil) | 简体中文 |
| --- | --- | --- | --- |
| Project overview | [Overview](docs/commercial/en/PROJECT_OVERVIEW.md) | [Visão do projeto](docs/commercial/pt-BR/PROJECT_OVERVIEW.md) | [项目介绍](docs/commercial/zh-CN/PROJECT_OVERVIEW.md) |
| Channel Manager playbook | [Playbook](docs/commercial/en/CHANNEL_MANAGER_PLAYBOOK.md) | [Playbook comercial](docs/commercial/pt-BR/CHANNEL_MANAGER_PLAYBOOK.md) | [渠道经理行动手册](docs/commercial/zh-CN/CHANNEL_MANAGER_PLAYBOOK.md) |
| User guide | [User guide](docs/commercial/en/USER_GUIDE.md) | [Manual de utilização](docs/commercial/pt-BR/USER_GUIDE.md) | [使用手册](docs/commercial/zh-CN/USER_GUIDE.md) |
| Quick start | [Quick start](docs/commercial/en/QUICK_START.md) | [Guia rápido](docs/commercial/pt-BR/QUICK_START.md) | [快速入门](docs/commercial/zh-CN/QUICK_START.md) |
| Documentation audit | [Audit](docs/commercial/en/DOCUMENTATION_AUDIT.md) | [Auditoria](docs/commercial/pt-BR/DOCUMENTATION_AUDIT.md) | [文档审查](docs/commercial/zh-CN/DOCUMENTATION_AUDIT.md) |

[Browse the multilingual documentation](docs/commercial/README.md) · [Offline documentation index](docs/commercial/index.html)

---

## Open the dashboard

1. Download or clone this repository. If downloading a ZIP, extract it first.
2. Open **index.html in the repository root** in your browser.

No Python, Node.js, terminal, server, build step or internet connection is needed to use the dashboard. Styles and runtime JavaScript are embedded in the main HTML. Keep the folder together to access the Excel templates, documentation and source download.

Portuguese instructions: [LEIA-ME.txt](LEIA-ME.txt). A complete multilingual commercial user guide is linked above.

## Data

The real workspace starts empty. **Explore fictional demo** loads illustrative data without changing the real workspace.

To migrate from the hosted dashboard, export **Data → Backup & guide → Download full backup**, then restore the JSON through **Choose backup JSON** in this edition. Backups include activation records, catalogue, coverage, targets, events, history and saved filters. User-imported real data is not included in this repository.

Use the same browser, profile and file location to retain the browser-local workspace. If the browser blocks persistent storage for local files, the app shows **Session-only workspace** and remains usable; export a backup before closing. Keep backups before moving the project or clearing browser data.

## Project layout

| Path | Purpose |
| --- | --- |
| `index.html` | Ready-to-open offline dashboard |
| `templates/` | Inverter and battery/BMS Excel import templates |
| `documentacao/` | Guide, verification notes, test log and JSZip licence |
| `codigo-fonte/dist/modules/` | Editable application modules |
| `codigo-fonte/dist/styles.css` | Editable styles |
| `codigo-fonte/tests/` | Automated domain, parser and persistence tests |
| `codigo-fonte/tools/` | Optional development and packaging utilities |
| `codigo-fonte.zip` | Source download used by the dashboard |

## Development and validation

Using Node.js 22 or newer, run `npm test` from `codigo-fonte/`. No `npm install` is needed. GitHub Actions runs the full test suite, the offline DOM simulator, headless-browser smoke checks and distribution freshness checks for this branch. See the latest green workflow run for commit-specific evidence; the checked-in result files are reproducible summaries.

From the same directory, `python3 tools/build-offline.py` regenerates the ready-to-open HTML; `node tools/verify-offline.mjs` tests a controlled DOM simulation; `python3 tools/build-release.py --test-log <test-output>` assembles the deterministic `codigo-fonte.zip` and test summaries. GitHub Actions automatically synchronizes these distribution files on the development branch. Python and Node.js are optional development tools, not dashboard runtime requirements.

GitHub Actions performs a headless Chromium smoke test on synthetic/demo data. A complete user acceptance pass with real imports on Windows is a separate manual check. See [verification notes](documentacao/VERIFICACAO.txt) for the precise scope and remaining browser checks.

## Dependencies

JSZip is bundled locally and its licence is included in `documentacao/JSZip-LICENSE.txt`. Runtime code does not use CDNs, telemetry, external fonts, API keys or AI services. The optional Excel-template regeneration utility requires the OpenAI Artifact Tool runtime; the ready-made templates are already included.

## Installer activations

Data → Installer imports handles monthly inverter totals by company, sums repeated names,
excludes Chinese grand-total rows, ignores the trailing Total column and tracks import history.
Installers provides rankings, growth KPIs, alias consolidation and undo, with independent
reporting date filters. See [the installer guide](codigo-fonte/docs/INSTALLER-IMPORT.md).
The Installer Profile and 2–6 Installer Comparison are available as dedicated tabs under Installers, with historical monthly/quarterly/annual charts, coverage-aware growth, indexed trends and CSV exports. The Insights & priorities tab offers evidence-backed account signals, configurable significance thresholds and exportable follow-up suggestions.

### Installer analytics workspaces

The **Installers** section provides historical trends, ranking, concentration, retention, three-month momentum, a searchable account profile, comparisons of 2–6 installers, a heatmap, and **Insights & priorities**. Source values and confirmed account consolidations are auditable. See the [installer import guide](codigo-fonte/docs/INSTALLER-IMPORT.md) for coverage rules and [commercial insights methodology](codigo-fonte/docs/INSTALLER-INSIGHTS.md) for rule definitions.
