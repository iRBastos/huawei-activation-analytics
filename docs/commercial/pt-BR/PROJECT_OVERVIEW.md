# Huawei Activation Analytics V2.1
## Inteligência comercial para o canal de instaladores

**Posicionamento:** Transformar movimentações nas ativações em decisões comerciais oportunas e fundamentadas.  
**Público:** Channel Managers, equipes comerciais de distribuidores e gestores de mercado.  
**Status:** Proposta de posicionamento comercial, 15 de outubro de 2026. Validada com o repositório `iRBastos/huawei-activation-analytics`, `main` no commit `993fc2a`. Trata-se de uma aplicação analítica desenvolvida de forma independente, sem alegação de endosso oficial da Huawei.

### O problema comercial

As equipes comerciais muitas vezes percebem que um instalador desacelerou quando a mudança já ocorreu. As planilhas mensais contêm sinais úteis, mas arquivos dispersos, nomes duplicados, períodos incompletos e comparações manuais retardam a resposta. Um Channel Manager precisa entender **o que mudou, quais contas são relevantes, se os dados são confiáveis e qual ação tomar**.

O objetivo não é apenas contabilizar inversores: é criar um processo consistente para preservar o relacionamento com os parceiros, identificar riscos de perda de ritmo, apoiar instaladores em crescimento e reabrir conversas com contas que reduziram sua atividade com Huawei.

### O que o sistema permite fazer hoje

| Pergunta comercial | Área atual do sistema | Possível decisão de canal |
|---|---|---|
| Quais instaladores estão perdendo ritmo de ativações? | **Installers → Insights & priorities** e **Installer profile** | Agendar uma conversa, investigar as causas e oferecer suporte direcionado |
| Quais contas estão comprovadamente inativas ou voltaram a ativar? | Sinais baseados em regras e verificação de cobertura | Entender o contexto; estruturar uma ação de recuperação ou reaproximação |
| Quais instaladores estão crescendo? | **Installer overview**, ranking, tendências e insights | Sustentar o crescimento com treinamento, disponibilidade e planejamento conjunto |
| A mudança está concentrada em poucos parceiros ou distribuída pela base monitorada? | Ranking, concentração Top 5, contribuição para mudanças e comparações | Priorizar contas estratégicas ou um programa para todo o canal |
| As ativações gerais de inversores e módulos de bateria Huawei mudaram? | **Overview**, **Inverters**, **Batteries & BMS**, **Comparisons** | Revisar posicionamento de produtos, treinamento e feedback dos distribuidores |
| O movimento de uma conta melhorou depois do contato comercial? | Histórico do perfil e comparações de períodos | Revisar a evolução observada, sem presumir causalidade |

**Ciclo operacional:** Importar → validar cobertura → detectar movimento → entender o parceiro → agir → revisar o período seguinte.

### Cinco resultados comerciais esperados

1. **Visibilidade mais cedo:** Identificar movimentos assim que uma atualização confiável dos relatórios estiver disponível.
2. **Priorização inteligente:** Separar mudanças relevantes de pequenas oscilações e dados incertos.
3. **Retenção de parceiros:** Gerar conversas direcionadas quando um instalador historicamente ativo desacelera ou para.
4. **Estimular o crescimento:** Encontrar contas ganhando tração e oportunidades para treinamento, estoque e campanhas conjuntas.
5. **Aprendizado contínuo:** Observar a evolução posterior e registrar o andamento das ações, sem atribuir os resultados automaticamente às intervenções.

### Como interpretar os sinais

O mecanismo **Insights & priorities** utiliza regras explícitas, e não inteligência artificial preditiva. Ele identifica crescimento/queda relevante, três meses completos com zero atividade em uma conta antes ativa, reativação, primeira atividade registrada após zeros confirmados, atividade após uma base zero, estabilidade e **Verify reporting coverage**. A pontuação é um **instrumento de triagem**, não uma probabilidade de perda do parceiro.

As configurações padrão são volume mínimo anterior de **5 ativações** e mudança mínima de **20%**, ajustáveis na interface. Para classificar normalmente uma conta como *Growing* ou *Declining*, os períodos precisam ter a mesma duração e cobertura completa. Mês ausente não é zero.

### O significado correto de demanda

**As ativações registradas de inversores Huawei por instalador são um indicador retrospectivo da atividade observada com Huawei no canal.** Podem indicar uma possível mudança de demanda que merece investigação, mas não comprovam, isoladamente, vendas, perda de market share, substituição por concorrente, fidelidade, receita ou demanda final. Os dados agregados de produtos e de instaladores são independentes: não é possível identificar qual modelo cada instalador utilizou.

**Limitação de agilidade:** O aplicativo offline não recebe continuamente dados ao vivo nem envia notificações externas automáticas. A velocidade depende da chegada e da revisão de arquivos atualizados e confiáveis. A recomendação é criar uma rotina recorrente de importação e triagem; integração automática ou CRM seriam evoluções futuras, não funções atuais.

### Como avaliar o sucesso

Acompanhar tanto a **disciplina comercial** quanto os **resultados observados**:

- Dias úteis entre a validação de um sinal e o primeiro contato (registro externo).
- Percentual de sinais importantes analisados, atribuídos a um responsável e acompanhados (registro externo).
- Percentual de mudanças de contas explicadas ou corrigidas após contato (registro externo).
- Evolução das ativações, número de instaladores ativos, reativações e concentração na **base monitorada**, quando a cobertura permitir.

Essas métricas apoiam decisões comerciais; não provam que uma campanha específica causou a mudança.

### Sistema atual versus evolução desejada

**Disponível hoje:** Operação local/offline, importação de instaladores, consolidação manual, rankings, perfis históricos, comparação entre 2–6 instaladores, insights por regras, CSV, análise de equipamentos, evidências e backups JSON.  
**Processo recomendado (não incorporado):** Responsável por conta, prazo de contato, motivos da mudança, registro de ações e revisão de resultados.  
**Possíveis recursos futuros (não incorporados):** Sincronização automática, notificações por e-mail/push, integração com CRM, inteligência competitiva e previsões.

**Documentos relacionados:** [Playbook comercial](CHANNEL_MANAGER_PLAYBOOK.md) · [Manual](USER_GUIDE.md) · [Guia rápido](QUICK_START.md).