# Huawei Activation Analytics

Offline dashboard for analysing monthly Huawei equipment activations: inverters, battery modules and BMS. Includes interactive charts, period and product filters, comparisons, targets, import validation, history, CSV exports and full JSON backups.

## Open the dashboard

1. Download or clone this repository. If downloading a ZIP, extract it first.
2. Open **index.html in the repository root** in your browser.

No Python, Node.js, terminal, server, build step or internet connection is needed to use the dashboard. Styles and runtime JavaScript are embedded in the main HTML. Keep the folder together to access the Excel templates, documentation and source download.

Portuguese instructions: [LEIA-ME.txt](LEIA-ME.txt).

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

The Installers tab imports monthly inverter totals by company, sums repeated names,
ignores the trailing Total column, and supports confirmed name consolidation and undo.
See [the installer guide](codigo-fonte/docs/INSTALLER-IMPORT.md). Advanced installer KPIs
and the commercial Action Centre are separate planned deliveries.

### Installer analytics preview
The installer branch adds monthly trends, comparison KPIs, ranking, concentration, retention,
three-month momentum, account profiles and a clickable activity heatmap. Import and confirmed
unions preserve summed source values. See `codigo-fonte/docs/INSTALLER-IMPORT.md` for coverage rules.
