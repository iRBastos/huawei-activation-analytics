# Huawei Activation Analytics V2.1 — Manual de Uso Comercial

**Para Channel Managers e equipes comerciais.** Este manual mostra como identificar movimentos importantes nas **ativações Huawei registradas por instalador** e transformá-los em conversas e ações de mercado.

## 1. Inicie com segurança

Baixe ou extraia os arquivos e abra `index.html` na pasta principal, em um navegador moderno. A edição offline não exige servidor nem internet. **Explore fictional demo** permite aprender sem alterar os dados reais. O workspace utiliza armazenamento local do navegador/perfil quando disponível; caso contrário, aparece **Session-only workspace**. Faça backup em **Data → Backup & guide → Download full backup** antes de fechar, mudar a localização ou trocar de dispositivo.

## 2. Importe dados confiáveis de instaladores

1. Abra **Data → Installer imports** e selecione uma planilha mensal `.xlsx` ou `.csv`: um instalador por linha, meses nas colunas; a última coluna Total, se houver, é ignorada.
2. Confira aba, linha de cabeçalho e coluna de empresa. Nomes normalizados repetidos na mesma importação são **somados**; linhas-resumo como `Total`, `Grand Total` e `=== 总计 ===` são descartadas.
3. Compare a prévia aos totais do arquivo. Reimportações do mesmo registro de origem/mês **substituem** valores, sem duplicar contagens.
4. Selecione **Partial update** (padrão mais seguro), salvo quando **Full installer population** estiver comprovado para todos os meses importados. Célula vazia em coluna de mês incluída significa zero; mês ausente ou empresa ausente em atualização parcial é **desconhecido**.
5. Confirme e verifique o histórico. Em **Installers → Installer overview → Account management**, revise manualmente variantes de nomes antes de unificá-las. As identidades confirmadas têm valores somados e preservam evidências.

**Por que isso importa?** Um zero incorreto pode criar alerta falso de inatividade ou queda. Conferir cobertura é parte da boa gestão comercial.

## 3. Identifique possíveis mudanças na atividade de demanda

Acesse **Installers → Insights & priorities**. Escolha período **From / To** fechado e comparação de duração equivalente; confira a cobertura. Comece pelos parâmetros padrão: **volume mínimo 5** e **mudança mínima 20%**; ajuste apenas com critério.

Analise as filas **High**, **Medium**, **Low** e **Data check**. Os sinais abrangem crescimento e queda relevantes, três meses confirmados de inatividade, reativação, primeira atividade após três zeros e retorno após base zero. São regras explicáveis, **não previsões de churn**. Use **Export all insights CSV** para compartilhar internamente evidências e sugestões de próximos passos.

## 4. Investigue um parceiro específico

Em **Installers → Installer profile**, procure nome ou alias registrado. Avalie período selecionado, tendências mensais/trimestrais/anuais, última atividade positiva, maior pico histórico, períodos sem dados e detalhes de origem. Compare períodos equivalentes e prepare perguntas para o parceiro. Separe mudança real de efeitos de calendário, importação e cobertura.

## 5. Compare os movimentos de parceiros

**Installers → Compare 2–6** compara de dois a seis instaladores por valores e tendências. O gráfico de índice base 100 só aparece quando **todos** têm base inicial positiva e completa. Caso contrário, analise volumes absolutos. Para comparar empresas de portes distintos, contextualize as diferenças.

**Installers → Installer overview** oferece ranking, participação na base monitorada, contas ativas, retenção, concentração e mapa mensal de atividade. A participação refere-se aos **instaladores incluídos nos relatórios Huawei disponíveis**, não ao mercado solar de toda a Irlanda.

## 6. Leia a movimentação geral do portfólio Huawei

Use **Overview**, **Inverters**, **Batteries & BMS** e **Comparisons** para examinar tendências agregadas e mix de produtos. **Targets** recebe metas definidas manualmente. As bases de instaladores e equipamentos são **independentes**: é possível observar mudança agregada no volume de baterias ou inversores, mas não afirmar que o instalador A usa o modelo B com base nesses arquivos.

## 7. Transforme o sinal em ação

Para uma conta prioritária: **(a)** valide a origem; **(b)** quantifique a mudança no perfil; **(c)** contacte o parceiro para investigar; **(d)** ofereça alinhamento de estoque, treinamento, suporte ao comissionamento, posicionamento de produto ou apoio do distribuidor; **(e)** registre responsável e retorno no CRM/controle **externo**; **(f)** revise após a próxima importação completa.

Consulte o [Playbook do Channel Manager](CHANNEL_MANAGER_PLAYBOOK.md) para matriz de ações, exemplos fictícios e prazos sugeridos. O dashboard **não** envia e-mails automáticos aos instaladores, não atualiza CRM e não recebe dados em tempo real.

## 8. Conceitos fundamentais

| Conceito | Significado correto |
|---|---|
| **Activation** | Ativação Huawei registrada, não venda, receita ou residência instalada comprovada |
| **Declining / Growing** | Variação relevante entre períodos completos, equivalentes e com limites configurados |
| **Inactive** | Três meses consecutivos **fechados e completos** com zero mais atividade anterior positiva |
| **Data check** | Dados ou período insuficientes para interpretar com confiança |
| **Installer share** | Participação na base elegível monitorada, não market share nacional |
| **Priority score** | Ranking por regras para investigação; não é probabilidade de churn |
| **Product mix** | Dados agregados; não revela modelos de um instalador específico |

## 9. Exportação, privacidade e dúvidas comuns

- Exporte CSV e backup completo quando necessário; proteja arquivos e nomes comerciais em armazenamento corporativo adequado.
- **Por que não aparece crescimento %?** Confira cobertura, duração do período e divisor zero.
- **Por que não encontro o instalador?** Pesquise aliases, abrangência da importação e seletor completo do perfil.
- **O alerta Inactive parece errado?** Confira três meses fechados, evidências e lacunas na fonte.
- **Por que não há gráfico indexado?** Alguma base inicial é zero ou incompleta.
- **Os dados sumiram ao mudar o HTML?** O armazenamento depende de navegador, perfil e origem; restaure o JSON.

**Próximos documentos:** [Visão do projeto](PROJECT_OVERVIEW.md) · [Guia rápido](QUICK_START.md).