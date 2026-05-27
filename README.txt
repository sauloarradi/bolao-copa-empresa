Bolão Copa 2026 - Protótipo V5

Implementações da V5:
- Nova aba "Regras" na navegação inferior.
- Regras completas sobre pontuação, prazos, fases, bloqueio e desempate.
- Controle de fase atual.
- Suporte visual para:
  - Fase de grupos aberta.
  - Fase de grupos encerrada aguardando liberação 32-avos.
  - 32-avos aberto.
  - 32-avos encerrado.
- Aba "Apostar" permanece visível, mas fica somente consulta quando a fase está bloqueada.
- Mensagem clara quando a fase está encerrada e aguardando liberação da próxima.
- Home agora mostra fase atual e próximos passos conforme o estado da fase.
- Estrutura preparada para painel admin.

Como demonstrar os cenários:
Abra script.js e altere a constante:

const DEMO_PHASE_STATUS = 'GROUPS_OPEN';

Opções:
GROUPS_OPEN
GROUPS_CLOSED
ROUND32_OPEN
ROUND32_CLOSED

Na versão final:
- Esse status virá do banco SQL Server.
- A gestão do bolão poderá encerrar a fase atual, cadastrar os próximos confrontos e liberar a fase seguinte.
- As apostas serão bloqueadas por fase e por prazo.
