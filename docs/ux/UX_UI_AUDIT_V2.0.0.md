# Huawei Activation Analytics V2.0.0
## Auditoria UX/UI e plano de redesign — 14 de outubro de 2026

**Estado:** proposta para revisão. **Nenhuma modificação realizada no repositório.**  
**Base:** `main` em `a962fe159bd5dd8b7d20f978910b27424d02e4db`, release `v2.0.0` de 14/10/2026.  
**Idioma deste relatório:** português; labels propostos na aplicação em inglês.  
**Método:** revisão estática do código, interface gerada, CSS, arquitetura, documentação e evidência de CI no GitHub. Não foi conduzida uma nova sessão de renderização visual independente nem testes manuais em todos os viewports solicitados. Recomendações visuais que dependem de pixels exigem validação no navegador antes da implementação.

**Fontes de evidência**
- [Repositório](https://github.com/iRBastos/huawei-activation-analytics)
- [Release v2.0.0](https://github.com/iRBastos/huawei-activation-analytics/releases/tag/v2.0.0)
- [Interface e páginas — views.js](https://github.com/iRBastos/huawei-activation-analytics/blob/main/codigo-fonte/dist/modules/views.js)
- [Installer overview e importação — installer-views.js](https://github.com/iRBastos/huawei-activation-analytics/blob/main/codigo-fonte/dist/modules/installer-views.js)
- [Perfil, comparação e insights — installer-experiences.js](https://github.com/iRBastos/huawei-activation-analytics/blob/main/codigo-fonte/dist/modules/installer-experiences.js)
- [KPIs e heatmap — installer-analytics-views.js](https://github.com/iRBastos/huawei-activation-analytics/blob/main/codigo-fonte/dist/modules/installer-analytics-views.js)
- [Navegação/eventos — app.js](https://github.com/iRBastos/huawei-activation-analytics/blob/main/codigo-fonte/dist/modules/app.js)
- [Estilos e breakpoints — styles.css](https://github.com/iRBastos/huawei-activation-analytics/blob/main/codigo-fonte/dist/styles.css)
- [Gráficos SVG — charts.js](https://github.com/iRBastos/huawei-activation-analytics/blob/main/codigo-fonte/dist/modules/charts.js)
- [Workflow CI verificado após merge](https://github.com/iRBastos/huawei-activation-analytics/actions/runs/38571755552)
- [QA STATUS](https://github.com/iRBastos/huawei-activation-analytics/blob/main/.github/QA-STATUS.md) e [testes manuais ainda necessários](https://github.com/iRBastos/huawei-activation-analytics/blob/main/codigo-fonte/docs/MANUAL_BROWSER_CHECKS.md)

---

## A. Diagnóstico executivo

**Conclusão:** a V2 é funcionalmente rica e o motor analítico está bem separado da camada de apresentação. O desafio principal é dar uma hierarquia visível às perguntas comerciais e reduzir o espaço ocupado, no início das páginas, por controlos e explicações. O redesign deve partir da arquitetura existente, não de uma reescrita. Interface e cálculo são responsabilidades distintas: preservar o contrato de dados e reorganizar como o utilizador consulta as respostas.

**Forças comprovadas no código:** execução offline; datasets separados de equipamentos e instaladores; análise de cobertura; distinção entre zero, ausente e parcial; evidência por célula/fonte; importações com revisão; seleção pesquisável de todos os instaladores; limite explícito de 2–6 para comparação; mensagens de interpretação; gráficos SVG com ponto focável e detalhes; exportação, backup, demo isolada; suite de testes e artefactos distribuídos reproduzíveis.

**Fragilidades de UX observáveis no código:** (1) toolbar de filtros de equipamentos aparece nas páginas administrativas Data, incluindo Installer imports, embora os filtros de produto não se apliquem à importação de instaladores; (2) cabeçalho de análise repete período e categoria já mostrados na toolbar; (3) a página Overview apresenta seis KPIs seguidos de conclusões, gráfico e até três gráficos de rácios, antes de uma hierarquia comercial clara; (4) ação de consolidar contas compete visualmente com ação de comparar no ranking; (5) campos de seleção ocupam um painel completo no topo do Installer Profile; (6) Evidence thresholds aparece antes da tabela principal de prioridades; (7) Quarterly Intelligence surge antes das métricas principais de Period comparisons; (8) `styles.css` mistura tokens globais e múltiplas definições de cores, raios e superfícies para os componentes dos instaladores; (9) há role=tab, mas não se identifica suporte às setas para navegação entre tabs; (10) algumas áreas utilizam texto de dimensão muito reduzida e gráficos densos, pedindo medição real de legibilidade/contraste.

**Avaliação preliminar (0–10; não certificação visual):**

| Dimensão | Nota | Fundamentação |
|---|---:|---|
| Design visual | 7,0 | Paleta neutra e Huawei já existe; variação de raios, tipografia e estilos entre painéis gera linguagem menos uniforme. |
| Navegação | 6,5 | Sete áreas identificáveis e tabs organizadas, mas sem agrupamento explícito entre mercado, instaladores e administração. |
| Arquitetura da informação | 6,0 | Conteúdo completo, porém configurações, evidência e resultados têm hierarquia por vezes semelhante. |
| Usabilidade | 7,0 | Pesquisa, import preview, detalhes, feedback e undo; alguns fluxos exigem mais scroll e leituras secundárias. |
| Visualização de dados | 7,5 | Escalas e estados parciais tratados; risco de sobreposição de séries e redundância nos gráficos longos. |
| Consistência | 6,5 | Componentes base reutilizados, mas KPIs e painéis de instaladores divergem dos gerais. |
| Acessibilidade | 6,5 | Focus-visible, skip link, diálogos nativos e pontos acessíveis; tab ARIA e densidade precisam de testes especializados. |
| Densidade de informação | 7,0 | Rica sem remover dados; densidade nem sempre prioriza decisões sobre evidência/configuração. |
| Eficiência comercial | 6,5 | É possível chegar aos insights, mas melhores prioridades e ações podem aparecer mais cedo. |

### Jobs to be done (ordem de utilização proposta)
1. Abrir o sistema e saber o que mudou, em que período e com que fiabilidade.
2. Saber quais produtos ou contas explicam alterações, sem confundir volume com proporção.
3. Selecionar conta, confirmar histórico, cobertura e próxima ação comercial.
4. Comparar 2–6 contas ou famílias/modelos com filtros claramente delimitados.
5. Importar dados novos sem comprometer o histórico, realizar backup e exportar evidências.

---

## B. Auditoria página a página

### 1. Overview
**Hoje:** cabeçalho e filtros globais; seis KPI cards (Inverter activations, BMS activations, Battery modules, Activated battery capacity, BMS / Inverter, Activated kWh per BMS); `What changed`; avisos de cobertura; Activation trend com eventos e tabela expandível; até três gráficos históricos de rácios; Longer-term view; rolling ratios; explicação metodológica.  
**Preservar:** seis métricas e fórmulas, validação de cobertura, findings baseados em regras, gráficos históricos e exportação de evidência.  
**Problema:** o utilizador encontra quase seis indicadores com o mesmo peso, mas precisa de descobrir qual variação justifica uma decisão; rácio, volume e capacidade podem ser confundidos.  
**Proposta:** primeira linha de 4 métricas primárias (inverter, BMS, módulos, capacidade), segunda linha compacta para rácios; `What changed` imediatamente a seguir, priorizado por relevância **apenas de apresentação** sem alterar cálculo; um único Activation trend como visualização principal; os três gráficos de rácios sob `Efficiency & attachment trends` expandível; `Longer-term view` ao fundo. Avisos de qualidade permanecem sempre visíveis quando relevantes.

### 2. Inverters
**Hoje:** phase comparison (indexed/absolute), gráfico por modelo com seletor local pesquisável até 16 (Top 8 default), Volume ranking, Contribution to change, Product mix, detalhe em tabela e notas.  
**Preservar:** escala absoluta/indexada, pesquisa entre todos os modelos, limite de 16 séries, detalhe da evidência por modelo, ranking e contribuição assinada.  
**Problema:** os dados de liderança (qual produto cresceu/caiu) surgem abaixo de grandes gráficos. `Grid Phase` está na barra global de produto embora essencialmente sirva esta análise.  
**Proposta:** faixa de síntese baseada nas métricas já calculadas (total observado, delta, top model, split de fases com ressalva da cobertura), seguida por ranking/contribution e gráfico detalhado. Mover `Grid Phase` para a toolbar local desta página, manter estado e cálculo. `Choose models` num painel recolhível junto ao próprio gráfico; preservar seleção de todas as opções. `Product mix` secundário se repetir informação do ranking.

### 3. Batteries & BMS
**Hoje:** duas famílias S0/S1 em cartões de rácios, trend de todos os modelos no âmbito filtrado, module mix (módulos/kWh), tabelas de bateria e BMS, product mix de BMS.  
**Preservar:** relações BMS compatíveis por família, distinção de capacidade e número de módulos, nenhum emparelhamento inventado entre dispositivos.  
**Problema:** uma única linha com todas as séries selecionadas pode ficar sobrecarregada; filtros globais podem impedir a leitura de rácios e mostrar texto explicativo em vez do KPI.  
**Proposta:** sumário de volumes/capacidade, alternador local `Battery modules | BMS | Families`, S0/S1 como cartões técnicos compactos, seleção contextual de modelos para linhas quando houver muitas séries. Conservar mix e tabelas auditáveis, com tabela como complemento e não repetição dominante.

### 4. Period comparisons
**Hoje:** `Quarterly Intelligence` vem antes de `Comparison metric` e dos KPIs de período; aparecem `Period totals`, `Monthly profile` heatmap, `Monthly contribution to change`, `Comparison evidence` (linha + tabela).  
**Preservar:** comparação pelo mesmo trimestre de vários anos; periodos de igual/desigual duração; aviso de escala; chart e tabela de evidência lado a lado na lógica; zeros e lacunas.  
**Problema:** mistura duas perguntas (`same-quarter across years` vs `current versus previous window`) na mesma hierarquia; a visualização de comparação principal fica profunda na página.  
**Proposta:** iniciar por `Comparison metric` + `Current vs Comparison` cards e gráfico de duas séries (`Comparison evidence`); mostrar contribuição e totais em painel compacto; deslocar `Quarterly Intelligence` para tab/segmento secundário ou acordeão com âmbito próprio muito explícito, sem modificar a lógica.

### 5. Targets
**Hoje:** aviso extenso de prioridade de targets, tabela de attainment, formulário de adição e tabela de targets salvos.  
**Preservar:** hierarquia categoria/modelo, zero target legítimo, cobertura faltante, revisão pré-commit e remoção.  
**Problema:** editar targets ganha quase o mesmo espaço do seu acompanhamento.  
**Proposta:** primeiro `Target attainment`, com evidência e filtros, depois `Saved targets` em tabela; acionar `Add target` abre form num modal/painel contextual e mantém a pré-visualização/revisão existente.

### 6. Data
**Hoje:** 7 tabs: Equipment imports, Installer imports, Recorded data, Coverage, Product catalogue, History, Backup & guide. Equipment import com 4 estágios, dataset picker, dropzone, Expected structure, seleção de folha/cabeçalho, validação de modelos, revisão completa e confirmação de cobertura. Installer import com sheet/header/column, Full vs Partial explícito e import history.  
**Preservar:** tudo que impede dados incorretos, inclusive diferença entre `blank` de equipamento (ausente) e `blank` de instaladores (zero), reimportação sem duplicar, prova de fonte, backups e undo.  
**Problema:** filtros de equipamento aparecem mesmo ao importar instaladores e no Backup; 7 tabs podem ocupar largura considerável; documentação, pré-visualização e ação principal disputam espaço.  
**Proposta:** `Data workspace` com navegação contextual mais compacta (Import, Inspect, Configure, Protect; subáreas acessíveis sem perda de deep links). Na área Import, escolher `Equipment | Installers` de forma muito clara; wizard vertical `Upload → Map → Validate → Confirm`, com resumo persistente de alterações. Ocultar toolbar de análise quando não corresponde à função da tab. Priorizar warnings bloqueantes e status da cobertura acima da confirmação; manter todas as explicações disponíveis em detalhes.

### 7. Installer overview
**Hoje:** quatro KPIs, gráfico de portfólio, contributions, portfolio measures, ranking com busca/sort/checks/Compare selected/Unify selected, heatmap usando os mesmos 50 da página, suggested account matches, merge history.  
**Preservar:** todos os indicadores e o heatmap, relação explícita do filtro do ranking com heatmap e do denominador do KPI com a população completa, consolidação manual e soma das contas.  
**Problema:** operação destrutiva de consolidação tem grande destaque dentro do ranking analítico; ranking pode ficar longe das variações mais importantes.  
**Proposta:** KPIs → `Largest account movements` → ranking com busca/ordenação/seleção; ação `Compare selected` mais destacada; `Unify selected` em menu contextual `Account management` mantendo revisão/confirm. Heatmap em secção recolhível, inicialmente com alcance legível de 12 meses, mas com opção de ver todos os meses. `Suggested matches` e `Union history` sob gestão de contas.

### 8. Installer Profile
**Hoje:** `Choose one installer` ocupa um painel de pesquisa + select; no código V2 todas as contas são alcançáveis por pesquisa, com aliases e retenção da seleção atual. A seguir aparecem título da conta, KPIs, `Evidence-based account insight`, Account history, Coverage & identity, 3 gráficos (monthly, quarterly, annual) e evidence table.  
**Preservar:** pesquisa sobre lista completa, seleção de aliases, conservação da escolha, os quatro KPIs, insight, fonte, CSV e três granularidades históricas.  
**Problema:** o painel de escolha separa os utilizadores do nome e contexto da conta; histórico é representado em três gráficos sequenciais mesmo quando o utilizador procura apenas uma tendência principal.  
**Proposta:** cabeçalho único `Installer Profile` com searchable account picker integrado; nome, ranking e badges de cobertura logo abaixo; 4 KPIs; insight/next action; monthly trend como principal. `Monthly | Quarterly | Annual` como seletor de vista que não altera a matemática e `All history` para consultar simultaneamente, mantendo a tabela de evidência acessível.

### 9. Compare 2–6 installers
**Hoje:** pesquisa integral; lista rolável de todos os resultados (`max-height:290px`); chips removíveis; seletor de 2–6; KPIs, trends absolutos/indexados, comparison table e period evidence. Sem limite artificial da lista de contas.  
**Preservar:** resultados completos, aliases, até seis, escala indexada com base comum e validação de baseline, CSV, entrada a partir do ranking/perfil.  
**Problema:** painel de seleção permanece grande quando as 2–6 contas já foram escolhidas; leitura da comparação numérica fica abaixo de gráficos longos.  
**Proposta:** chips/contagem no cabeçalho, `Add/remove installers` expandível com pesquisa de todos os resultados, tabela `Account-by-account comparison` logo após KPIs e antes dos gráficos, seguidos por `Absolute` e `Indexed` no mesmo espaço visual com dois modos de visualização (sem excluir dados); evidências mensais secundárias.

### 10. Insights & priorities
**Hoje:** 4 KPIs; `Evidence thresholds` (mínimo de volume/% + texto de método) antecede tabela de contas; `Priority`, `Activity signal`, `Search installer` controlam a tabela; explicação `How prioritisation works` no fim.  
**Preservar:** scores e thresholds configuráveis, regras de inatividade, reativação, ausência de causalidade, `Data check`, evidência e suggested next action, export.  
**Problema:** configuração técnica interrompe o fluxo comercial antes da lista de prioridade.  
**Proposta:** KPIs → filtro local + tabela de prioridades imediatamente; mostrar `Data check` como classe separada e não como oportunidade comercial; recolher thresholds e metodologia em `Scoring rules & thresholds`, mantendo acesso e visibilidade de quando foram alterados.

---

## C. Matriz de relocalização dos componentes

**Legenda:** P0 = risco crítico confirmado; P1 = valor estrutural alto; P2 = refinamento; P3 = opcional. Nenhum P0 visual fica automaticamente confirmado sem o teste do navegador correspondente.

| Área | Componente | Local atual | Problema | Destino/ação proposta | Justificação | Prio. |
|---|---|---|---|---|---|---|
| Todas | Reporting period / From / To | toolbar global | Consome primeira faixa larga da tela | Toolbar contextual compacta, com período ativo sempre visível | Mais altura para conclusões | P1 |
| Todas | Comparação e categoria no cabeçalho | título + caption | Repetição de âmbitos | Uma linha `Active scope` com chips resumidos | Menos ruído | P2 |
| Todas | `Product filters` | toolbar global | Pertinência variável | Expandível, aplicável apenas a páginas de produtos | Não exibir filtros irrelevantes | P1 |
| Data | Equipment filter toolbar | acima de tabs Data | Irrelevante em Installer imports / Backup | Ocultar nesses subcontextos; manter estado salvo | Reduz erro de interpretação | P1 |
| Todas | Help/methodology | fundo da sidebar | Descoberta tardia | Link `Methodology` no menu Help/contextual; manter acesso | Acesso sem protagonismo | P2 |
| Overview | seis KPIs | grelha uniforme | Primário/secundário sem hierarquia | 4 volumes + 2 rácios compactos | Facilitar scanning | P1 |
| Overview | `What changed` | após 6 KPIs | Principal insight não suficientemente cedo | Após principais KPIs; até 3 destaques + `View all` | Agilidade comercial | P1 |
| Overview | 3 séries de rácios | grandes painéis sequenciais | Página longa e redundância | `Attachment & efficiency trends` recolhível | Economia de scroll | P1 |
| Overview | `Activation trend` | após findings | Deve ser âncora analítica | Visual principal full width após insight | Contextualiza movimentos | P1 |
| Inverters | `Grid Phase` | product filters globais | Filtro especializado confunde outras páginas | Dentro de `Inverters` junto a `View` | Escopo inteligível | P1 |
| Inverters | `Choose models` | ação do gráfico | Boa funcionalidade; painel ocupa espaço aberto | Manter junto ao chart, recolhível, seleção persistente | Preservar busca total | P2 |
| Inverters | Ranking + Contribution | painéis médios | Informação decisiva abaixo de chart extenso | Imediatamente após síntese | Top gainers/decliners | P1 |
| Inverters | `Product mix` | secção final | Pode repetir ranking | Sumário compacto + expansão | Menos duplicação visual | P2 |
| Batteries | gráfico de todas séries | um chart sem picker local | Potencial sobrecarga visual | Filtro de série local, com opções completas | Leitura de famílias/modelos | P1 |
| Batteries | cartões S0/S1 | topo | Informações úteis, muito texto | Cartões compactos após síntese | Legibilidade | P2 |
| Comparisons | `Quarterly Intelligence` | primeiro painel | Mistura dois contextos analíticos | Modo secundário `Quarterly analysis` | Separar perguntas | P1 |
| Comparisons | `Comparison metric` | após quarter | Contexto principal atrasado | Acima de KPIs | Escopo claro | P1 |
| Comparisons | `Comparison evidence` | último painel | Evidência mais útil exige scroll | Gráfico principal antes dos detalhes | Facilitar interpretação | P1 |
| Comparisons | Monthly heatmap | entre totais e contribuição | Pode parecer a mesma conclusão | Secção secundária | Evidência sem confusão | P2 |
| Targets | target entry form | painel principal | Edição compete com análise | Botão `Add target` → modal/drawer de revisão | Priorizar attainment | P1 |
| Targets | target hierarchy notice | topo | Nota extensa constante | Ajuda curta + tooltip/expansão; warning se relevante | Clareza sem perder regra | P2 |
| Data | 7 tabs horizontais | topo | Densidade em ecrãs estreitos | Agrupar em `Import / Inspect / Configure / Protect` | Encontrabilidade | P1 |
| Data | Import `Expected structure` | ao lado do upload | Ocupa espaço mesmo a quem já conhece formato | `View file requirements` expandível, links download presentes | Upload prioritário | P2 |
| Data | Import preview/review | vários panels sequenciais | Confirmação longa | Wizard com indicador + summary e alertas persistentes | Reduz erro, não remove etapas | P1 |
| Data | coverage selector | formulario | Potencial erro de escopo | `Confirm reporting scope` claro antes do commit | Integridade analítica | P1 |
| Data | Backup | última tab | Proteção demasiado escondida | `Backup & restore` na navegação contextual e estado de storage | Reduz risco de perda | P1 |
| Installer overview | Compare / Unify | cabeçalho ranking | Risco de ação administrativa destacada | Comparar primário; Unify em `Account management` | Separar exploração e mutação | P1 |
| Installer overview | Suggested matches / union history | fim da página | Administração mistura-se com análise | Subsecção `Account management` | Fluxo limpo | P1 |
| Installer overview | Heatmap | após ranking | Muitas colunas e scroll | Secção focada com 12m inicial e histórico completo | Leitura viável | P2 |
| Installer Profile | Search + account select | painel antes do perfil | Atrasa contexto da conta | Cabeçalho integrado com selector pesquisável | Menos altura | P1 |
| Installer Profile | Monthly, Quarterly, Annual | três charts sequenciais | Scroll excessivo | Granularidade contextual + `Show all` | Mesmo conteúdo com menor ruído | P1 |
| Installer Profile | Evidence-based account insight | após KPI | Bom conteúdo, pode ficar mais acionável | Sidebar/inset `Account signal + Next action` | Objetivo comercial | P1 |
| Compare 2–6 | picker 290px | painel sempre visível | Ocupa espaço mesmo após escolha | `Edit selection` contextual, chips sempre visíveis | Mais espaço para comparação | P1 |
| Compare 2–6 | comparison table | após charts | Números principais demoram a aparecer | A seguir aos KPI cards | Comparação de contas imediata | P1 |
| Compare 2–6 | absolute + indexed charts | dois grandes blocos | Repetição espacial | Segmento visual com ambos acessíveis | Foco sem perda | P2 |
| Insights | Evidence thresholds | antes da tabela | Setup antes das decisões | `Scoring settings` expandível após KPIs / na toolbar secundária | Prioridades mais cedo | P1 |
| Insights | Priority / signal / search | em topo da tabela | Correto | Manter, integrar em toolbar compacta | Encontrabilidade | P2 |
| Insights | `Data check` | misturado nas prioridades | Pode ser lido como lead comercial | Filtro / agrupamento separado, regras intactas | Evitar inferência indevida | P1 |
| Todas | notas técnicas repetidas | rodapés de muitos charts | Leitura longa | Explanatory details contextuais; alertas persistentes | Transparência sem fadiga | P2 |

---

## D. Arquitetura proposta

Manter as rotas/hash existentes para não quebrar navegação direta, estado ou regressões. A melhoria principal é **agrupamento sem mais cliques obrigatórios**:

```text
ACTIVATION ANALYTICS
  Overview

MARKET INTELLIGENCE
  Inverters
  Batteries & BMS
  Period comparisons
  Targets

INSTALLER INTELLIGENCE
  Installer overview
  Installer profile
  Compare 2–6
  Insights & priorities

DATA & ADMINISTRATION
  Data workspace
    Import: Equipment / Installers
    Inspect: Recorded data / History
    Configure: Coverage / Product catalogue
    Protect: Backup & restore / Guide
```

O grupo Installer Intelligence pode continuar a ser implementado tecnicamente dentro da rota `#installers` e das quatro tabs atuais. O mesmo se aplica à rota `#data`. Isto evita migrar URLs e garante reutilização do router atual. Para desktop, usar labels de secção subtis; para mobile, mostrar navegação compacta sem esconder opções essenciais em scroll horizontal extenso.

**Âmbito dos filtros:** `Reporting period` de equipamento nas páginas analíticas de equipamento; `Installer reporting period` e `Account base` na área Installers; `Data` mostra filtros apenas em `Recorded data`/`Coverage` quando são realmente usados. Os filtros individuais de charts/tabelas ficam junto ao componente e devem comunicar `Only this chart/table`.

---

## E. Wireframes funcionais (propostas, não screenshots da aplicação)

### Layout base — desktop 1440/1920
```text
┌────────────── SIDEBAR ──────────────┬────────────────────────────────────────────────┐
│ Activation Analytics               │ Breadcrumb        Backup state · Help · Export   │
│ Overview                           ├────────────────────────────────────────────────┤
│ MARKET INTELLIGENCE                │ PAGE TITLE                         Primary action │
│ Inverters                          │ Active scope: period / comparison / coverage     │
│ Batteries & BMS                    ├────────────────────────────────────────────────┤
│ Period comparisons                 │ PRIMARY KPI ROW                                  │
│ Targets                            ├────────────────────────────────────────────────┤
│ INSTALLER INTELLIGENCE             │ KEY FINDING / NEXT ACTION                        │
│ Installer overview                 ├────────────────────────────────────────────────┤
│ Installer profile                  │ MAIN ANALYSIS VISUALISATION                       │
│ Compare 2–6                        ├────────────────────────────────────────────────┤
│ Insights & priorities              │ Details / supporting visual / evidence tables    │
│ DATA & ADMINISTRATION              │                                                │
│ Data workspace                     │                                                │
└────────────────────────────────────┴────────────────────────────────────────────────┘
```

### Overview
```text
[Activation overview]             [Active period / Compare / Product filters]
[Inverters] [BMS] [Battery modules] [Activated capacity]
[BMS / Inverter] [kWh / BMS] (compact secondary metrics)
[What changed — 1, 2, 3 verified findings]  [Explore detailed changes]
[Activation trend — wide chart · local metric toggle · events]
[Efficiency & attachment trends ▼]   [Longer-term view ▼]
[Underlying evidence ▼]                [How metrics work ▼]
```

### Inverters
```text
[Inverters] [Period / Compare]                       [Grid Phase]
[Total] [Change] [Leading model] [Phase composition]
[Volume ranking]                 [Contribution to change]
[Inverter activations by model]           [Choose models ▼]
[Single-phase vs Three-phase]           [Indexed | Absolute]
[Product mix ▼]    [Model detail / evidence searchable table]
```

### Batteries & BMS
```text
[Batteries & BMS]                         [Period / Compare]
[Module activations] [BMS activations] [Activated capacity]
[Explore: Battery modules | BMS | Families] [Select models ▼]
[Trend by model/family — main chart]
[S0 ratio summary]               [S1 ratio summary]
[Module mix: Modules | kWh]      [BMS mix]
[Battery detail ▼]               [BMS detail ▼]
```

### Installer overview
```text
[Installer intelligence]                      [Period | Account base]
[Activations] [Change] [Active installers] [Top-5 concentration]
[Largest contributors to change]       [Portfolio measures]
[Installer ranking]    [Search] [Sort] [Compare selected]
  Account | Current | Previous | Delta | Growth | Coverage | ...
[Monthly heatmap ▼]                      [Account management ▼]
```

### Installer Profile
```text
[Installer Profile] [Search/select any tracked account ▼]
[Account name] [Rank] [Coverage]  [Export] [Add to comparison]
[Selected activations] [Change] [Peak] [Last active]
[Account signal]                        [Suggested next action]
[Trend: Monthly | Quarterly | Annual | Show all]
[Account history & identity ▼]          [Source evidence table ▼]
```

### Compare 2–6
```text
[Compare 2–6] [Installer chips 1 × 2 × ...] [Edit selection ▼]
[Selected total] [Previous] [Net change] [Number of accounts]
[Account-by-account summary table]
[Trend: Absolute | Indexed]  (identical source calculations)
[Underlying period values ▼] [Export comparison CSV]
```

### Insights & priorities
```text
[Insights & priorities]    [Export CSV] [Scoring settings ▼]
[High priority] [Declining] [Inactive] [Coverage checks]
[Priority] [Activity signal] [Search installer] [Clear filters]
[Priority table: Installer | Evidence | Trend | Suggested action]
[Data checks / Needs verification] [How scoring works ▼]
```

### Data workspace
```text
[Data workspace]                      [Storage status] [Backup]
[Import] [Inspect] [Configure] [Protect]
[Equipment | Installer] (quando Import estiver selecionado)
[1 Upload] → [2 Map] → [3 Validate] → [4 Confirm]
[Main step form]                  [Source summary + requirements ▼]
[Warnings / Preview replacements / Coverage confirmation]
[Confirm import]                   [Cancel / Export full preview]
```

### Estreito/mobile (768 e 390)
Usar navegação em 2 níveis de fácil acesso; KPIs empilhados (máximo 2 colunas a 768, 1–2 conforme conteúdo a 390), barras de filtros com etiqueta de âmbito, botões `Compare`/`Unify` nunca sobrepostos, tabelas com scroll horizontal *interno* e primeira coluna fixa quando útil, gráficos com scroll interno e alternativa tabular. Seletor de conta e chips podem quebrar linha; mostrar quantas opções correspondem à pesquisa; não cortar nomes longos sem tooltip ou wrap. O layout não pode ter scroll horizontal em `body`. Manter mínimo 44 × 44 px para controlos tocáveis, alvo de revisão WCAG 2.2 AA.

---

## F. Design system proposto

**Objetivo:** evolução disciplinada da identidade atual, não mudança de marca. Os valores abaixo são pontos de partida para protótipo e precisam de revisão no navegador/contraste antes da aprovação visual.

| Token | Proposta | Uso |
|---|---|---|
| `--color-brand` | `#C8102E` (existente) | Ação primária, active state, não para toda métrica negativa |
| `--color-text-primary` | `#20232A` (existente) | Títulos e métricas |
| `--color-text-secondary` | `#596575` (alinhar) | Descrições, labels, metadados |
| `--color-bg` | `#F5F6F8` | Fundo da aplicação |
| `--color-surface` | `#FFFFFF` | Painéis e tabelas |
| `--color-border` | `#E3E6EA` | Separação discreta |
| `--color-positive` | `#286C56` | Crescimento/completude, só com ícone/texto |
| `--color-negative` | `#984230` | Queda, nunca apenas pela cor |
| `--color-warning` | `#8B5B16` | Qualidade/cobertura em falta |
| `--spacing` | `4, 8, 12, 16, 24, 32px` | Ritmo coerente; evitar alturas arbitrárias |
| `--radius` | `6px` campos/botões, `8px` painéis | Uniformidade, exceções intencionais |
| `--font` | system-ui fallback local | Sem fontes externas |
| `--tabular` | `font-variant-numeric: tabular-nums` | Colunas e KPIs |
| focus | contorno 3px de contraste suficiente | Teclado consistente |

Padrões de componentes: **PageHeader** (título + action + active scope); **MetricCard** (valor, delta, cobertura, contexto); **ChartPanel** (título, medida, filtro local, chart, tabela de apoio); **FilterBar** (global/contextual claramente separado); **EvidenceTable** (título, colunas numéricas, scroll local, pesquisa); **DataQualityNotice** (erro, parcial, unknown, zero sem confusão); **EntityPicker** (pesquisa completa + aliases + seleção); **DisclosureSection** (detalhes secundários); **ConfirmationFlow** (pré-visualização → confirmação explícita, sem submissão acidental).

Não tornar a interface artificialmente espaçosa: preferir cartões mais baixos, alinhamento numérico, labels curtos e espaços consistentes. Minimizar badges decorativos e sombras. Em cada gráfico, preservar a distinção de `complete`, `partial`, `missing`, `zero`, `not comparable`. Para gráficos com y-axis não iniciando em zero, destacar isso *junto do eixo*, não apenas numa nota abaixo.

**Acessibilidade a verificar:** tabs devem admitir setas Home/End conforme padrão WAI-ARIA; headings sem saltos hierárquicos; anúncios live region para resultados de pesquisa; controle de foco após troca de secção e modal; contraste exato dos textos de 10–12px; títulos completos para modelos/aliases longos; estados alternativos além da cor; ordenação e cabeçalhos de tabela; toque e teclado em heatmap/linhas SVG.

---

## G. Roadmap, risco e critérios de aceitação

| ID | Prio. | Mudança / benefício | Complexidade | Risco regressão | Dependências | Critério de aceitação verificável |
|---|---|---|---|---|---|---|
| R01 | P1 | Filtros contextuais: mais área visível e zero âmbito enganoso | M | Médio | `app.js`, `views.js`, `installer-analytics-views.js` | Data→Installer imports/Backup não mostram filtros de equipamento; valores e filtros preservados ao retornar. |
| R02 | P1 | PageHeader + scope resumido: menos duplicação | M | Baixo | `views.js`, CSS | Período/compare/categoria visíveis uma única vez, sem perder `Updated` e coverage. |
| R03 | P1 | Overview hierarchy: decisão mais rápida | M | Médio | `views.js`, `charts.js` | Métricas iguais às anteriores; findings/cobertura conservados; charts secundários acessíveis. |
| R04 | P1 | Installer Profile picker integrado | M | Médio | `installer-experiences.js`, `app.js` | Qualquer conta, incluindo alias e conta fora dos primeiros resultados, selecionável; seleção mantém estado. |
| R05 | P1 | Compare picker compacto + table antes de gráfico | M | Médio | `installer-experiences.js` | Seleção 2–6, chip/remove, busca integral, indexed baseline e CSV sem mudanças. |
| R06 | P1 | Insights thresholds recolhidos, tabela primeira | S | Baixo | `installer-experiences.js` | Threshold salvo, export consistente, evidência e prioridade presentes. |
| R07 | P1 | Ranking comercial vs ação Unify separados | M | Alto | `installer-views.js`, `app.js` | Mesma soma/undo; nenhuma consolidação sem revisão e confirmação; Compare selected mantém 2–6. |
| R08 | P1 | Period comparisons orientado pela métrica | M | Médio | `views.js` | Quarter independente sinalizado; comparação atual mantém valores e intervalos. |
| R09 | P1 | Data import wizard/context nav | L | Alto | `views.js`, `installer-views.js`, `app.js` | XLSX/CSV, classificação, Full/Partial, reimport, undo e backup passam todos cenários. |
| R10 | P1 | Battery series picker contextual | M | Médio | `views.js`, `app.js`, `charts.js` | Todos modelos continuam encontráveis; filtro local não muda KPIs/tabelas nem cálculos. |
| R11 | P2 | Tokens e padrões visuais | M | Médio | `styles.css` + views | Mesmo formato de botões/cards/badges, contraste AA testado, zero overflow em body. |
| R12 | P2 | Navegação ARIA tabs + pesquisa acessível | M | Médio | `app.js`, `views.js`, `installer-experiences.js` | Tab/Shift+Tab e setas funcionam, leitura/labels testados via teclado/leitor. |
| R13 | P2 | Heatmap compacto e alternativa detalhada | M | Médio | `installer-analytics-views.js` | Visual vs tabela preserva zeros, unknowns e paleta coerente; meses históricos alcançáveis. |
| R14 | P2 | Modo Print/PDF e filtros exibidos | S | Médio | `app.js`, CSS | Print continua Overview intencionalmente; PDF indica scope/cobertura e não exporta dados fictícios. |
| R15 | P3 | Guardar preferências visuais opcionais | M | Médio | persistência/backup | Apenas após aprovação específica; migrar backups sem quebrar schemas antigos. |

**Quick wins reais:** R06, R02 (parcial), ajuste de tabs/labels e R14; **trabalho estrutural:** R01, R03–R10. Não alterar fórmulas para obter métricas “mais bonitas”. Caso uma nova métrica comercial seja desejada, abrir uma solicitação separada com contrato e teste próprios.

### Aceitação por workflow
- **Mercado:** utilizador identifica período/cobertura, a variação principal e o chart associado na primeira região útil de 1440px, sem procurar filtros secundários.
- **Instalador em queda:** a partir de Installer overview/Insights, chega a perfil e next action em no máximo 2–3 ações (exclui scroll), com evidência acessível.
- **Perfil:** busca qualquer um dos ≥1.000 instaladores sintéticos, incluindo alias, sem perda de seleção; alternância mensal/trimestral/anual preserva a série e a exportação.
- **Comparação:** pesquisa seis instaladores diferentes, compara e remove contas sem limite artificial no search; dashboard permanece útil com 2–6.
- **Importação:** dataset importado só após map/validate/confirm; logs e backup preservam somas/cobertura e nenhum valor real é utilizado nos testes.
- **Apresentação:** PDF tem período, escopo, números, interpretação e sem elementos administrativos desnecessários.

### Testes obrigatórios depois da aprovação
**Dados sintéticos:** 1.000 instaladores × 48 meses, 80+ modelos, nomes longos, contas duplicadas e aliases, reimportações, Full vs Partial, zeros confirmados, meses em aberto, lacunas, 6 contas simultâneas, baseline 0/incompleto, duas famílias de bateria, mudanças negativas, targets zero/ausentes. 

**Resoluções reais de teste:** 1920×1080, 1440×900, 1366×768, 768×1024, 390×844; desktop e mobile com sessão vazia e preenchida; checar screenshots de cada página relevante, scroll lateral local, foco, contraste WCAG 2.2 AA e comportamento de teclado. 

**Regressão:** `npm test`, `node tools/verify-offline.mjs`, `node tools/browser-smoke.mjs`, `python3 tools/build-offline.py`, `python3 tools/build-release.py`, comparação do `index.html`, `app.offline.js`, ZIP e logs. Estes comandos são **plano futuro**, não foram reexecutados nesta auditoria.

---

## H. Antes e depois — fluxos observáveis

| Tarefa | Antes (organização do código atual) | Depois (proposta) | Medida de sucesso |
|---|---|---|---|
| Entender o mês | Muitos KPIs e tendências sem gradação | Quatro KPIs, findings imediatos e trend único principal | Encontrar alteração prioritária sem percorrer rácios secundários |
| Localizar contas em queda | KPI global → charts → ranking/insights | KPIs + movimentos + acesso direto a perfil/insights | Perfil relevante em até 2–3 ações |
| Ler perfil de uma conta | Painel separado de pesquisa, charts em série | Picker integrado; sinal e gráfico principal prioritários | Nome/cobertura/ação em primeiro viewport |
| Comparar 2–6 | Picker grande e table depois de charts | Chips compactos, sumário de diferenças e modo de chart | Diferenças identificáveis antes do scroll longo |
| Atualizar mensalmente | Formas ricas distribuídas por várias regiões | Wizard de 4 passos com review bem destacado | Zero mudança de valores sem confirmação clara |
| Preparar management review | Intercalar charts/notes/exports | Layout de síntese e exports próximos do contexto | Menos navegação, mesmas provas no PDF/CSV |

---

## I. Sequência segura de implementação (somente após autorização)

**Fase 0 — UX baseline:** guardar screenshots de todas páginas/estados em viewports definidos; inventário completo de campos e seus seletores; relatório de acessibilidade com resultados reproduzíveis. Isto fecha o principal limite desta auditoria estática.

**Fase 1 — Foundation:** criar branch `design/ux-ui-v2.1`, tokens CSS e componentes/padrões em funções existentes. Não criar biblioteca/framework novo; aplicar primeiro num ecrã piloto e verificar consistência. Não modificar `main`.

**Fase 2 — Context & navigation:** implementar R01/R02, eliminar redundância de filtros sem alterar `state.preferences` ou `state.installerPreferences`; preservar hashes e deep links.

**Fase 3 — Installer intelligence:** implementar R04–R07 com testes de busca completa, seleção e union, validação de cobertura e histórico; abrir PR parcial se a mudança ficar ampla.

**Fase 4 — Market & comparisons:** R03/R08/R10, hierarquia dos resultados, charts contextuais e battery family views; recalcular snapshots sintéticos e comparar CSV/valores de base.

**Fase 5 — Data management & Targets:** R09 e Targets modal, preservando cada passo de confirmação; revalidar migração de backups e persitência.

**Fase 6 — QA visual/CI e distribuição:** R11–R14; screenshots `before/after`; testes de teclado/contraste; build determinístico com ZIP atualizado e checagem de artefactos; PR com diff, riscos, critérios satisfeitos e sem merge automático.

**Ficheiros canónicos prováveis:** `codigo-fonte/dist/styles.css`, `codigo-fonte/dist/modules/views.js`, `codigo-fonte/dist/modules/app.js`, `codigo-fonte/dist/modules/installer-experiences.js`, `codigo-fonte/dist/modules/installer-views.js`, `codigo-fonte/dist/modules/installer-analytics-views.js`, eventualmente `charts.js`; testes `codigo-fonte/tests/*.test.mjs` e `codigo-fonte/tools/browser-smoke.mjs`. `index.html`, `codigo-fonte/dist/app.offline.js` e `codigo-fonte.zip` são outputs gerados e **nunca devem ser editados à mão**.

**Contrato de dados intocável:** volumes são activations, não vendas/sistemas; nomes repetidos de instaladores consolidados somam os valores; blanks do import de instaladores tornam-se zero onde o snapshot os contém; ausência de conta em mês parcial permanece desconhecida; blanks de equipment são missing e não zero; coverage é explícita; BMS não é emparelhado com um inversor específico; rácios, targets, médias e indexes devem permanecer idênticos; migração de backups e armazenamento local intactos.

---

## J. Limites e decisão requerida

1. **Não foram feitos screenshots originais nem teste manual novo de navegação/viewport nesta execução**. Foram consultados os testes Chromium de terceiros documentados no próprio GitHub e o workflow de integração `success`. Por isso, pontuações e propostas de estilo são preliminares. Não afirmar “WCAG AA alcançado” nem “cada componente visual foi verificado” antes da Fase 0.
2. **Nenhum arquivo, branch, commit, pull request ou release foi criado/modificado no GitHub** para esta auditoria.
3. O que já funciona deve ser preservado: a V2 corrigiu anteriormente a pesquisabilidade da lista de instaladores, com seleção por aliases e sem limite artificial; isto é facto do código, não nova tarefa.
4. **Recomendação:** aprovar primeiro a direção arquitetural e o conceito de hierarquia. Antes de qualquer alteração efetiva, executar a Fase 0 visual para confirmar as hipóteses de densidade, alinhamento, scroll e acessibilidade. A implementação pode então ser dividida em pequenas etapas reversíveis e testáveis.

**Proposta final:** uma evolução para uma experiência mais limpa, coesa e orientada por decisões, mantendo integralmente a capacidade analítica, o código de domínio e a execução offline da V2.0.0.