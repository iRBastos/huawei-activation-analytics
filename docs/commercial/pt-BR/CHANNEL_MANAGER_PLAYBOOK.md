# Playbook do Channel Manager
## Detectar movimentos. Investigar as causas. Agir enquanto há oportunidade.

**Finalidade:** Usar o Huawei Activation Analytics V2.1 em uma rotina comercial disciplinada, e não apenas como painel de números. Este é um processo de gestão proposto: prazos de resposta, CRM e coordenação de ações **não são funcionalidades automáticas do aplicativo**.

## 1. Cadência de acompanhamento comercial

| Momento | Atividade comercial | Entrega esperada |
|---|---|---|
| **Ao receber a atualização mensal** | Importar, validar cobertura e analisar sinais de portfólio e de contas | Lista de prioridades apoiada em dados confiáveis |
| **Revisão comercial semanal** | Revisar ações abertas e novos arquivos eventualmente recebidos; não assumir novas tendências sem novos dados | Responsáveis, próximos passos e escalonamentos |
| **Reunião mensal de canal** | Analisar movimento geral, mudanças relevantes, feedback e resultados das intervenções | Prioridades e propostas para parceiros e distribuidores |
| **Revisão trimestral** | Comparar períodos completos equivalentes e concentração por parceiro | Plano estruturado de retenção, crescimento e desenvolvimento do canal |

**Regra:** Reuniões mais frequentes não compensam relatórios desatualizados. Toda análise deve informar o último mês completo disponível.

## 2. Ciclo de decisão em seis etapas

1. **Confirme os dados.** Em **Data → Installer imports**, reconcilie totais, duplicidades e abrangência. *Full* só quando comprovado; empresas ausentes em arquivos parciais continuam *unknown*. Resolva os casos **Data check** antes de interpretar quedas.
2. **Identifique o movimento.** Acesse **Installers → Insights & priorities** e filtre **High**, tipo de sinal e contas estratégicas. Padrões: volume mínimo **5** e mudança mínima **20%**; ajuste os parâmetros de forma consciente e registre os critérios.
3. **Analise o histórico.** Em **Installer profile**, verifique gráficos mensais/trimestrais/anuais, última atividade, zeros confirmados, períodos desconhecidos e origem dos dados. Em **Compare 2–6**, examine outros instaladores no mesmo intervalo.
4. **Investigue o motivo.** Converse com o parceiro sobre pipeline, capacidade de instalação, estoque, comissionamento, preço, treinamento, suporte, demanda e alternativas no mercado. Trate cada explicação como **hipótese até ser confirmada**.
5. **Defina a intervenção.** Envolva distribuidor, assistência técnica, treinamento, produto ou marketing. Combine responsável, ação concreta, data e próximo passo. Registre tudo fora do dashboard.
6. **Verifique depois.** Após a próxima atualização completa, observe as ativações e o feedback obtido. Registre a mudança, sem afirmar causalidade apenas com base no gráfico.

## 3. Matriz de sinais e ações

| Sinal ou métrica | Hipótese comercial a investigar | Resposta recomendada | Evidência necessária |
|---|---|---|---|
| **Declining activations** | Redução da atividade Huawei em uma conta conhecida | Reunião com o instalador; validar pipeline, objeções de preço, estoque e suporte; combinar ação de recuperação | Períodos iguais e completos; mudança acima dos limites configurados |
| **Inactive — 3 confirmed zero months** | Instalador antes ativo interrompeu as ativações por um período prolongado | Contato direto; validar status, mix de marcas, dificuldades técnicas, treinamento e projetos | Três meses **fechados, completos e com zero**, mais atividade positiva anterior |
| **Reactivated** | Atividade Huawei retomada depois de pausa comprovada | Reaproximação; apoiar próximos projetos, estoque e treinamento | Mês recente positivo após três zeros confirmados e atividade anterior |
| **Growing activations** | Parceiro pode estar ampliando sua atuação com Huawei | Sustentar crescimento; alinhar disponibilidade, suporte e campanhas | Comparação válida e aumento relevante |
| **Activity after zero baseline** | Retorno de atividade depois de período-base sem ativações | Entender o gatilho e apoiar a continuidade; não calcular crescimento infinito | Períodos completos, base anterior exatamente zero |
| **Verify reporting coverage** | Aparente queda pode resultar de um problema de dados | Corrigir arquivo, abrangência e período antes de escalar | Falta de cobertura, período aberto ou comparação desigual |
| **Top 5 concentration / contribuição por instalador** | Dependência de poucas contas na base acompanhada | Preservar parceiros estratégicos e desenvolver novos parceiros | Portfólio reportado elegível; não é market share nacional |

**As ações acima são recomendações comerciais; o aplicativo não identifica automaticamente perdas para concorrentes nem escolhe ofertas.**

## 4. Prazos sugeridos (política da equipe, não regra do software)

- **P1 — contato em até dois dias úteis:** Sinal relevante e bem fundamentado em conta estratégica, especialmente grande queda ou inatividade comprovada. Defina imediatamente responsável e contato.
- **P2 — contato em até cinco dias úteis:** Queda de prioridade média, atividade nova ou crescimento relevante que mereça apoio.
- **Dados primeiro:** Cobertura incompleta, nomes não confirmados ou inconsistências. Corrigir antes de marcar um risco comercial.
- **Monitorar:** Oscilações pequenas ou estáveis; revisar no ciclo seguinte.

As categorias do sistema **High / Medium / Low** seguem score determinístico: **High ≥ 60, Medium 30–59, Low < 30**; **Data check** não tem score comercial. Não confunda essas categorias com os prazos P1/P2 propostos acima.

## 5. Exemplo prático — instalador em queda (dados fictícios)

Um instalador monitorado registrou **40** ativações de inversores nos três meses completos anteriores e **23** nos três meses completos seguintes.

- Variação absoluta = **−17** ativações.
- Variação percentual = **−42,5%**.
- Com os limites padrão **5** e **20%**, o resultado pode gerar **Declining activations**, desde que a abrangência seja completa e os intervalos tenham a mesma duração.
- Com o algoritmo atual, essa situação simplificada gera score **65 (High)**. **Isso não significa 65% de chance de perder o instalador.**

**Ação:** Perguntar se houve menos obras, atrasos no comissionamento, pressão de preço, preferência por outras marcas, falta de estoque ou dificuldades técnicas. Confirmar os fatos com o parceiro, documentar a ação e revisar os períodos completos seguintes. A recuperação numérica, sozinha, não prova que a ação foi responsável.

**Contraexemplo:** Se o último mês não veio em uma importação parcial, não o transforme em zero nem anuncie queda de −100%. Primeiro é preciso resolver a cobertura.

## 6. Roteiro de conversa com o parceiro

**Abertura:** “Percebemos uma mudança na atividade de ativações Huawei registrada para sua empresa e gostaríamos de entender como estão as coisas.”

**Investigação:** “Isso tem mais relação com o calendário das obras, demanda, disponibilidade de equipamentos, preços ou experiência de instalação e suporte?”

**Oferta de apoio:** “O que tornaria a Huawei mais fácil de especificar e instalar nos seus próximos projetos? Treinamento, suporte técnico ou alinhamento com seu distribuidor ajudaria?”

**Encerramento:** Combine ação, responsável e data de retorno. Evite afirmar que o sistema já sabe por que o volume mudou.

## 7. Estrutura sugerida para a reunião mensal

1. **Qualidade dos dados:** Último período completo, atualização, cobertura Full/Partial e lacunas.
2. **Pulso do portfólio:** Ativações, contas ativas, ritmo e concentração na base acompanhada.
3. **Contas sob atenção:** Quedas/inatividades prioritárias, evidências, responsável e próximo passo.
4. **Oportunidades de crescimento:** Parceiros crescendo ou reativados e apoio em estoque, treinamento ou marketing.
5. **Ações anteriores:** Medidas tomadas, feedback do parceiro e mudanças observadas depois.
6. **Decisões necessárias:** Orçamento, treinamento, contato com distribuidores, política comercial e feedback de produto.

## 8. Métricas que realmente importam

| Métrica | Origem | Limite de interpretação |
|---|---|---|
| Variação nas ativações por instalador | Dashboard, períodos completos | Indicador de atividade, não vendas ou demanda direta |
| Quantidade de instaladores ativos | Dashboard, cobertura suficiente | Apenas base monitorada |
| Reativações e quedas relevantes | Regras do dashboard | Checar fontes e critérios |
| Contas contactadas e ações finalizadas | CRM ou registro **externo** | Identificar responsáveis e datas |
| Tempo entre sinal e resposta | Registro externo | Depende de quando os dados chegam |
| Movimento do mix de produtos | Dados agregados de equipamentos | Não atribuir modelo a instalador específico |

## 9. Regras de segurança analítica

- Mês não reportado não é zero. Mês aberto não deve ser tratado como encerrado.
- Queda nas ativações Huawei não comprova migração para concorrência, churn ou perda de market share irlandês.
- Não deduza associação entre modelo e instalador ou composição individual do sistema a partir de dados agregados independentes.
- Não exponha nomes ou arquivos operacionais confidenciais no repositório público. Proteja os backups JSON.
- Score alto significa **investigar com prioridade**, não previsão ou comprovação de causa.
- Não há alertas automáticos por e-mail/push, integração de CRM ou recebimento contínuo de dados.

**Fontes do repositório:** `codigo-fonte/docs/INSTALLER-INSIGHTS.md`, `codigo-fonte/dist/modules/installer-insights.js`, `codigo-fonte/docs/INSTALLER-IMPORT.md` e `codigo-fonte/dist/modules/installer-views.js` (commit `993fc2a`).