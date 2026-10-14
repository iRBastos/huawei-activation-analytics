# Huawei Activation Analytics V2.1.0 — Plano controlado de implementação UX/UI

**Data de planeamento:** 14/10/2026  
**Repositório:** https://github.com/iRBastos/huawei-activation-analytics  
**Baseline verificada:** `main` em `a962fe159bd5dd8b7d20f978910b27424d02e4db`; release oficial `v2.0.0`.  
**Branch de execução:** `ux/redesign-v2.1` (criada exclusivamente para o redesign).  
**Estado:** plano aprovado para execução F0 e F1; `main` intocada, sem merge ou release.  
**Documento de referência:** `Huawei_Activation_Analytics_UX_UI_Audit_V2.0.0.md` (auditoria UX/UI anterior).

## 1. Resultado e limites

Evoluir a experiência da V2.0.0: hierarquia de informação, filtros contextuais, navegação, perfil e comparação de instaladores, prioridades, visualização de equipamentos, gestão de dados, responsividade e acessibilidade. O redesign **não é** uma reescrita do motor analítico. A experiência deve permitir identificar rapidamente a pergunta comercial, período, cobertura, conclusão e próxima ação.

**Fora de escopo sem aprovação separada:** alterações de fórmulas, criação de novos indicadores ou score, inferência de vendas/receita/participação de mercado, pareamento inversor–bateria–BMS sem evidência, mudanças de semântica de importação, troca do modelo de persistência, alteração de esquemas de backup, introdução de frameworks/CDNs, hospedagem pública, merge/release na `main`.

**Invariantes de dados e negócio:**

- Ativações de inverter, módulos e BMS são métricas distintas; não equivalem a sistemas, vendas ou instalações verificadas.
- Registos repetidos do mesmo instalador devem ser somados após regras de identidade/consolidação existentes; aliases preservam proveniência e uniões exigem confirmação.
- Importações de **instaladores**: células mensais vazias presentes na fonte são zero; omissões em snapshots parciais são **desconhecidas**; snapshots de população completa explicitamente confirmados permitem zeros de contas ausentes.
- Importações de **equipamentos**: células em branco representam **missing** (não zero); volume zero requer evidência; preservar cobertura e aplicabilidade de modelos.
- Estados complete/partial/missing/zero/não comparável e períodos abertos permanecem distintos; nenhum crescimento definitivo de bases incompletas.
- Manter todos os rácios, targets, médias, percentuais, baselines, cálculos por famílias compatíveis, scores comerciais existentes e exportação CSV sem alteração semântica.
- Preservar o contrato de backup e migração de schemas antigos, IndexedDB ou modo apenas sessão, demo fictícia isolada, imports/exports/undo e execução offline `file://`.

## 2. Proteção da main — protocolo obrigatório

1. Fazer leitura do SHA atual de `main` e da Release v2.0.0 antes de criar a branch; se divergirem do esperado, revisar mudanças antes de avançar.
2. Criar **somente** `ux/redesign-v2.1` a partir do SHA exato aprovado (`a962fe...`), não a partir das branches antigas. Comandos indicativos, não executados:

   ```bash
   git fetch origin
   git switch --create ux/redesign-v2.1 a962fe159bd5dd8b7d20f978910b27424d02e4db
   git branch --show-current
   git rev-parse HEAD
   ```

3. Antes de cada commit/push conferir `git branch --show-current` e `git status`; **bloquear** se estiver em `main`.
4. Todos os pushes devem indicar a branch de destino explicitamente: `git push origin HEAD:refs/heads/ux/redesign-v2.1`. Não usar `git push origin main`.
5. Abrir Draft PR **base `main` ← head `ux/redesign-v2.1`**, sem auto-merge. Nenhum `gh pr merge`, release, tag nova ou publicação antes de aceite explícito posterior.
6. Registrar SHA de `main` ao iniciar, nos checkpoints e no final. O resultado desta iniciativa é uma branch testada e um Draft PR, **não** uma `main` alterada. A `main` pode ser protegida com branch rules em ação administrativa separada, mediante autorização.
7. Um PR não modifica `main` até ser merged. O Draft PR permite CI/revisão sem entrega oficial.

## 3. Descoberta crítica de CI e distribuição

- `validate-offline.yml` já executa em pull requests com alterações relevantes: Node tests, build offline, DOM simulation, Chromium smoke, build-release e verificação de ficheiros reproduzíveis.
- `sync-release.yml` **não** é executado na nova branch: os triggers e a condição `if` atuais estão restritos a `feature/inverter-power-catalog` e `feat/installer-analytics-v2`.
- **Decisão recomendada:** não alterar de imediato esse workflow nem introduzir nova automação de escrita. Gerar localmente e **commitar artefactos na branch de redesign** a cada checkpoint. O PR read-only CI confirma consistência.
- Nunca editar à mão `index.html` da raiz, `codigo-fonte/dist/app.offline.js` ou `codigo-fonte.zip`; são outputs gerados. Fontes canónicas: `codigo-fonte/dist/index.html`, `codigo-fonte/dist/styles.css`, `codigo-fonte/dist/modules/*.js`, documentação e templates existentes.
- Como `codigo-fonte.zip` inclui documentação e `.github/workflows`, alterações nesses caminhos podem exigir regeneração do ZIP, mesmo sem alterar o runtime.
- Comando de checkpoint (a partir da raiz do repositório):

  ```bash
  cd codigo-fonte
  npm test | tee /tmp/huawei-tests.tap
  python3 tools/build-offline.py
  node tools/verify-offline.mjs
  node tools/browser-smoke.mjs
  cd ..
  python3 codigo-fonte/tools/build-release.py --test-log /tmp/huawei-tests.tap
  git status --short
  ```

  No Windows adaptar o caminho do log e o comando de Python; o CI Linux com Node 22/Python 3.12 fornece referência reproduzível. Não usar `npm install` nem dependências novas sem justificação.

## 4. Fases de implementação e gates

### F0 — Baseline factual e inventário visual (sem redesign)
**Objetivo:** fechar os pontos que a auditoria anterior não verificou visualmente. Executar o `index.html` oficial com workspace vazio e datasets sintéticos robustos, em 1920×1080, 1440×900, 1366×768, 768×1024 e 390×844. Capturar Overview, Inverters, Batteries & BMS, Period Comparisons, Targets, Installer Overview/Profile/Compare/Insights e Data (todas as subáreas significativas), incluindo estados de filtro, erro, ausência e importação.

**Entregas:** screenshots identificados por página/viewport/estado/commit; inventário de componentes/seletores e alturas de primeiro viewport; registo de riscos visuais, scroll, teclado e contraste; aprovação do alvo visual em uma página piloto. Guardar artefactos pesados como evidence de CI ou fora do ZIP quando possível.

**Gate F0:** baseline 174 testes do histórico deve ser corroborada pela execução atual (a contagem poderá evoluir); lista de problemas comprovados vs hipóteses; zero alteração de lógica.

### F1 — Fundação visual + página piloto
**Escopo:** tokens e padrões reutilizáveis (PageHeader, MetricCard, ChartPanel, FilterBar, EvidenceTable, EntityPicker, DisclosureSection) usando HTML/CSS/JS atuais; sem framework. Aplicar primeiro no **Installer Profile**: seleção pesquisável integrada ao topo, KPIs e sinal comercial visíveis, histórico por granularidade com acesso `Show all`, evidências preservadas. Não alterar analítica.

**Ficheiros prováveis:** `dist/styles.css`, `dist/modules/installer-experiences.js`, `dist/modules/app.js`; testes de renderização existentes.

**Gate F1:** qualquer conta/alias continua selecionável; sem corte de nomes longos; todos KPIs e séries/CSV exatamente iguais; screenshots antes/depois aprovados antes de replicar padrões.

### F2 — Navegação, âmbito e filtros
**Escopo:** agrupar visualmente `Overview`, `Market Intelligence`, `Installer Intelligence`, `Data & Administration` sem quebrar rotas/hash; manter `#overview`, `#inverters`, `#batteries`, `#comparisons`, `#targets`, `#installers`, `#data`. Compactar scope/período, eliminar duplicação de cabeçalho. Filtros de equipamento apenas onde fizerem sentido; filtros de instaladores independentes. `Grid Phase` torna-se contextual em Inverters. `Data → Installer imports` e `Backup & guide` não exibem filtros irrelevantes.

**Ficheiros:** `views.js`, `app.js`, `installer-analytics-views.js`, `dist/index.html`, CSS.

**Gate F2:** alternar Equipment ↔ Installers ↔ Data não muda os estados salvo por ação explícita; deep links, import actions, print e modo de apresentação funcionam; filtros locais afetam só chart/tabela atribuídos; nav teclado acessível.

### F3 — Installer Intelligence completo
**Escopo:**
- Installer Overview: KPIs, contribuições e ranking mais próximos da primeira tela; `Compare selected` como ação analítica; mover `Unify selected`, `Suggested matches` e union history para `Account management` contextual, com confirmação.
- Compare 2–6: chips/`Edit selection` compacto, tabela comparativa antes dos gráficos, alternador `Absolute | Indexed` com ambos os modos existentes.
- Insights & Priorities: KPIs e tabela de prioridades acima de thresholds; filtros de priority/signal/search persistem; `Data check` claramente separado de oportunidades comerciais.
- Heatmap: overflow apenas local; cobertura/zeros conhecidos vs unknown identificáveis; histórico completo alcançável.

**Ficheiros:** `installer-views.js`, `installer-experiences.js`, `installer-analytics-views.js`, `app.js`, CSS.

**Gate F3:** benchmark com **1.000 instaladores × 48 meses**, nomes longos e aliases; pesquisa por qualquer conta; 2–6 sem limite artificial; exportações, soma/reimport/undo, pontuação e thresholds idênticos; recomendação comercial nunca atribuída a `Data check`.

### F4 — Market Intelligence e visualizações
**Escopo:**
- Overview: 4 KPIs primários + 2 rácios compactos; `What changed` e `Activation trend` prioritários; rácios históricos agrupados sem serem removidos.
- Inverters: síntese e rankings antes do detalhamento extenso; seletor local para todos os modelos até 16 séries, `Top 8` preservado; grid phase contextual.
- Batteries & BMS: resumo de volumes/capacidade, S0/S1 claros, modo de explorar módulos/BMS/famílias; não inventar pareamentos de dispositivos.
- Comparisons: métrica e comparações atuais primeiro; `Quarterly Intelligence` como modo secundário, sem perder chart+tabela de evidência ou avisos.

**Ficheiros:** `views.js`, `charts.js` apenas se imprescindível, CSS, `app.js`.

**Gate F4:** golden fixture antes/depois com resultados iguais em KPI/chart/tooltips/tabela/CSV; gráficos não confundem proporções com quantidades; primeiro viewport em 1440 destaca decisões sem esconder alertas de cobertura.

### F5 — Data Workspace e Targets (maior risco)
**Escopo:** Data com grupos conceituais `Import | Inspect | Configure | Protect`, sem perder nenhuma tab/subárea. Importação guiada como `Choose → Map → Validate → Confirm`; **interface apenas** reaproveitando lógica/validação/commit atual. Scope `Full` e `Partial` explícito; preview de alterações e confirmação obrigatórios. Targets: summary first; editor de targets em painel contextual/modal sem alterar hierarquia existente. Backup/restore/armazenamento mais encontráveis.

**Ficheiros:** `views.js`, `installer-views.js`, `app.js`, CSS. Arquivos de domínio/importe são **fora de escopo** a menos que um defeito comprovado exija aprovação específica.

**Gate F5:** importação XLSX/CSV, duplicatas, totais, blank vs 0, reimport, conflito de undo, troca de categoria, cobertura, target 0, backup antigo/reload/restore passam; nenhum estado pode ser confirmado acidentalmente; teste de foco e erros em cada passo. Se o wizard trouxer risco desproporcionado, entregar primeiro apenas layout contextual e reservar interação multi-etapa para uma subfase aprovada.

### F6 — Consolidação responsiva, acessibilidade e apresentação
**Escopo:** harmonizar design tokens sem reformatar todo CSS desnecessariamente; WCAG 2.2 AA como alvo, tabs com setas/Home/End se padrão ARIA tabs for mantido, focus management, indicadores não dependentes exclusivamente de cor, contrastes medidos, alvos móveis adequados, tabelas com scroll interno e alternativa textual dos charts; impressão/PDF com scope e limitações visíveis.

**Gate F6:** zero scroll horizontal de `document/body` nos 5 viewports; teclado chega às ações e consegue operar selectors/tabs/dialogs; sem quebras de layout em nomes longos; charts/tabelas continuam acessíveis; sessão demo não gera relatórios que pareçam produção.

### F7 — Finalização e Draft PR de revisão
**Escopo:** executar suíte completa e testes de regressão adicionais; gerar HTML/JS/ZIP determinísticos; conferir diferenças, tamanho e ausência de dados reais; QA visual antes/depois; documentação de mudanças e limitações; publicar apenas commits da branch e atualizar Draft PR.

**Gate F7:** CI verde no último SHA do PR; arquivos gerados sincronizados; nenhuma modificação fora do escopo sem justificativa; sem erros JS/external requests; backups/restores e CSV equivalentes; testes com dados fictícios; 5 viewports inspecionados; `main` no SHA inicialmente identificado (salvo intervenções independentes); PR continua Draft e **não merged**.

## 5. Ordem de entrega/commits sugerida

- `test(ux): capture V2 baseline and synthetic UX scenarios` (se adicionar testes e fixtures; não commitar screenshots pesadas no ZIP).
- `style(ux): introduce design tokens and reusable presentation patterns`.
- `feat(ux): streamline installer profile and contextual account selection`.
- `feat(ux): clarify navigation and reporting filter scope`.
- `feat(ux): reorganize installer intelligence and comparison`.
- `feat(ux): refine overview, equipment and period comparisons`.
- `feat(ux): simplify target and data workflows without changing import contracts`.
- `test(ux): strengthen accessibility and responsive regression coverage`.
- `build(ux): regenerate offline HTML and deterministic release ZIP`.
- `docs(ux): record acceptance evidence, before/after and known limitations`.

Essa ordem é lógica, não obriga o uso de um commit por linha; preferir commits pequenos e reversíveis, com build/test verde a cada checkpoint. **Não fazer alterações em massa antes de validar a página piloto.**

## 6. Matriz risco × prevenção

| Risco | Severidade | Prevenção | Bloqueio de aceite |
|---|---|---|---|
| Mudar calculadoras/KPIs durante redesign | Crítica | Snapshot de números/CSV antes-depois; não editar `calculations.js` etc. | Qualquer divergência injustificada |
| Confundir zero e dado ausente | Crítica | Fixtures de cobertura por tipo e mês; testes de fonte/tooltip | Qualquer zero sem fonte confirmada |
| Introduzir erro de importação ou perda de backup | Crítica | Regresso XLSX/CSV/undo/restore, preview e confirmação | Qualquer migração/restore falha |
| Dashboard deixar de abrir offline | Crítica | Chromium `file://`, sem CDN/requisições externas | Qualquer request externa ou falha runtime |
| Gráficos divergirem da tabela | Alta | Mesma origem de dados e números golden | Valor diferente sem aprovação |
| Selector não chegar a todos instaladores | Alta | Fixture 1.000+ e pesquisa alias/nome longo | Conta não localizável |
| Workflow não regenerar na branch nova | Alta | Build manual e `validate-offline` verificador em PR | Arquivo stale no CI |
| Ações de consolidação acidentais | Alta | Separar análise de gestão e exigir confirmação | Mutação sem aprovação explícita |
| Regressão acessibilidade/responsive | Alta | Screenshots cinco larguras, teclado/contraste | Overflow, clipping ou foco perdido |
| `main` alterada involuntariamente | Crítica | SHA checkpoint, branch explicit push, PR Draft | Qualquer write/merge/release na main |

## 7. Critérios de aceite objetivos

- **A1 — Funcional:** todos os fluxos V2.0.0 mantidos (equipamentos, 2–6 instaladores, insights, targets, Data, backups, exports, demo, print).
- **A2 — Precisão:** outputs numéricos/CSV de fixtures idênticos aos do baseline para os mesmos dados/filtros. Modificação deliberada de definição só em pedido separado.
- **A3 — Pesquisa:** 1.000+ contas, alias, reimport, comparação até seis e seleção por nome completo sem truncar conjunto pesquisável.
- **A4 — Decisão comercial:** numa tela 1440×900 os KPIs e pelo menos um sinal/ação relevante estão no primeiro viewport quando os dados e a cobertura os suportam; conta prioritária pode ser aberta e investigada em 2–3 ações claras.
- **A5 — Data quality:** zero, missing, partial e incomparable são inequívocos em KPIs, gráficos, rankings, CSV e evidência.
- **A6 — Offline:** standalone HTML abre via `file://`, sem rede, e importa/exporta/restaura offline.
- **A7 — Responsivo:** sem overflow horizontal do documento nos cinco viewports; scroll de tabelas/charts apenas local e utilizável.
- **A8 — Acessibilidade:** contraste medido e verificado, acessibilidade de teclado e foco, headings/ARIA coerentes, prioridade WCAG 2.2 AA, desvios explicitamente documentados.
- **A9 — Artefactos:** source, bundle, HTML e ZIP byte-consistentes nos checks CI; ZIP inclui documentação e licenças necessárias.
- **A10 — Segurança operacional:** Draft PR aberto para revisão, sem merge, `main` não alterada pelo trabalho.

## 8. O que inspecionar antes de qualquer aprovação de merge futura

1. Sumário do PR por ficheiro e etapas, com **mudanças apenas de UX** claramente destacadas.
2. Capturas antes/depois para todas as áreas críticas em desktop e mobile, baseadas em dados fictícios.
3. Run do CI final, SHA do commit e log de testes; relatório de valores antes/depois.
4. Relatório de browser/teclado e limitações; confirmar comportamento com `file://`.
5. Reinstalação limpa e restauração de backup fictício, sem dados reais no repo.
6. Validação humana final no Windows com dados reais somente no próprio dispositivo do utilizador, sem partilhar ficheiros confidenciais; isto é gate de aceite operacional, não requisito para subir branch de testes.
7. Assinatura explícita do utilizador antes de qualquer merge ou release. Na ausência de aprovação, a V2.0.0 em `main` permanece oficial.

## 9. Decisão recomendada

Aprovar o **plano**, mas executar primeiro **F0 + F1** e parar para validar o novo padrão visual na página piloto. Só depois repetir o padrão nas outras páginas. Esta é a alternativa de melhor relação impacto/risco: permite corrigir a direção cedo, mantém o motor analítico intocado e evita uma refatoração gigantesca difícil de testar.

**Nota histórica:** este documento foi redigido antes da criação da branch; a execução e o estado atual são mantidos em `docs/ux/PROGRESS.md`.