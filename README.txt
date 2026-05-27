Bolão Copa 2026 - Protótipo V4

Principais mudanças:
- Bloqueio automático das apostas após 10/06/2026 às 23:59.
- Após o prazo, o usuário só consegue visualizar os palpites.
- Barra de progresso vermelha enquanto estiver incompleto.
- Barra verde apenas quando o grupo estiver 100% preenchido.
- Tema claro e tema escuro com botão de alternância.
- Tela "Minhas Apostas" reorganizada por grupo.
- Filtros: Todos, Pendentes, Placar exato, Vencedor e Erros.
- Melhor experiência mobile-first.
- Resultados oficiais ainda são simulados para demonstração.

Para simular o sistema após o prazo:
Abra script.js e altere:
const FORCE_CLOSED_FOR_DEMO = false;
para:
const FORCE_CLOSED_FOR_DEMO = true;

Na versão real:
- Os grupos/jogos virão do SQL Server.
- Os resultados oficiais serão cadastrados por painel admin ou importados por API.
- A autenticação será feita via Protheus/TOTVS.
