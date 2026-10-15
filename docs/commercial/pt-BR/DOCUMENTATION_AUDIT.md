# Auditoria de documentação — reposicionamento comercial

**Projeto:** Huawei Activation Analytics V2.1  
**Referência:** commit `993fc2a` da `main`, analisado em 15 de outubro de 2026  
**Escopo:** apenas documentação; código, aplicação e cálculos permanecem inalterados.

## Narrativa comercial

A aplicação deve ser apresentada como instrumento de **inteligência comercial do canal**: identificar mudanças significativas nas ativações dos instaladores, validar a cobertura dos dados, priorizar conversas e coordenar ações de retenção, recuperação e crescimento. Os detalhes técnicos continuam no manual, mas não devem dominar a apresentação do projeto.

## Funcionalidades existentes e verificadas

- Visão geral, ranking, instaladores ativos, concentração, retenção, momentum e histórico.
- Perfil pesquisável de instalador e comparação de 2–6 contas.
- **Insights & priorities** com critérios explicáveis, limites configuráveis, inatividade/reativação e checagem de cobertura.
- Importação mensal XLSX/CSV, consolidação controlada de nomes, evidências e exportação CSV.
- Análises independentes de equipamentos, dados locais/offline e backup JSON.

## Pontos de atualização em documentos antigos

| Arquivo atual | Problema | Recomendação |
|---|---|---|
| `README.md` da raiz | Ênfase técnica em vez de valor comercial | Abrir com inteligência comercial e incluir links nos três idiomas |
| `codigo-fonte/README.md` | Ainda chama insights comerciais de desenvolvimento futuro | Revisar arquitetura e funcionalidades em etapa técnica específica |
| `codigo-fonte/docs/INSTALLER-IMPORT.md` | Afirma que perfil/comparação ainda seriam criados | Corrigir descrição histórica sem alterar a importação |
| `documentacao/guia.html` / `codigo-fonte/dist/guide.html` | Conteúdo de versões anteriores | Revisar multilíngue, preservando build offline |
| Registros de lançamento V2/F7 | Incluem 'DO NOT MERGE' anterior à aprovação | Manter histórico com indicação explícita do status atual |
| Verificações antigas | Contagens desatualizadas de módulos/telas | Conferir novamente com o código e os testes |

## Entrega e limites

Esta documentação reúne visão do projeto, playbook do Channel Manager, manual, guia rápido e auditoria em **inglês, português brasileiro e chinês simplificado**, com Markdown e HTML offline.

O sistema depende de **importação mensal**; não produz alertas em tempo real, previsões de demanda, CRM, acompanhamento de concorrentes nem market share. Prazos de contato são propostas de processo, não recursos do software. Não há PowerPoint neste pacote.

## Cuidados de publicação

Usar branch documental, conferir links/idiomas e revisar o diff integral. Não modificar arquivos de execução. Ao atualizar o README, regenerar o ZIP determinístico para manter a cópia incluída nele em sincronia.
