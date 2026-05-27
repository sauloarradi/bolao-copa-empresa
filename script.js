// -------------------------------
// CONFIGURAÇÕES DE DEMONSTRAÇÃO
// -------------------------------

// Fases possíveis:
// GROUPS_OPEN       = fase de grupos aberta para apostas
// GROUPS_CLOSED     = fase de grupos encerrada; aguardando admin liberar 32-avos
// ROUND32_OPEN      = 32-avos aberto para apostas
// ROUND32_CLOSED    = 32-avos encerrado
//
// Para a apresentação ao chefe, altere esta constante para demonstrar os cenários.
const DEMO_PHASE_STATUS = 'GROUPS_OPEN';

const DEADLINE_GROUPS = new Date('2026-06-10T23:59:59');

const phaseLabels = {
 GROUPS_OPEN: 'Fase de Grupos',
 GROUPS_CLOSED: 'Fase de Grupos',
 ROUND32_OPEN: '32-avos de Final',
 ROUND32_CLOSED: '32-avos de Final'
};

const phasesData = {
 GROUPS_OPEN: {
  key: 'GRUPOS',
  title: 'Fase de Grupos',
  open: true,
  waitingNextPhase: false,
  deadlineText: 'Apostas abertas até 10/06/2026 às 23:59.',
  nextText: 'Preencha todos os grupos antes do prazo final. Após o dia 10, as apostas da fase de grupos serão bloqueadas.'
 },
 GROUPS_CLOSED: {
  key: 'GRUPOS',
  title: 'Fase de Grupos',
  open: false,
  waitingNextPhase: true,
  deadlineText: 'Apostas da fase de grupos encerradas. Aguarde o admin cadastrar e liberar os jogos dos 32-avos.',
  nextText: 'Agora você pode acompanhar resultados, pontuação e ranking. As próximas apostas serão liberadas quando o admin abrir os 32-avos.'
 },
 ROUND32_OPEN: {
  key: '32AVOS',
  title: '32-avos de Final',
  open: true,
  waitingNextPhase: false,
  deadlineText: 'Apostas dos 32-avos liberadas. Preencha todos os jogos antes do novo prazo definido pelo administrador.',
  nextText: 'A fase de grupos já foi encerrada. Agora faça seus palpites para os jogos dos 32-avos de final.'
 },
 ROUND32_CLOSED: {
  key: '32AVOS',
  title: '32-avos de Final',
  open: false,
  waitingNextPhase: true,
  deadlineText: 'Apostas dos 32-avos encerradas. Aguarde a liberação das oitavas de final.',
  nextText: 'Acompanhe sua pontuação e aguarde o administrador cadastrar os confrontos das oitavas de final.'
 }
};

const groupStage = {
'Grupo A': ['México','África do Sul','Coreia do Sul','Tchéquia'],
'Grupo B': ['Canadá','Suíça','Qatar','Bósnia'],
'Grupo C': ['Brasil','Escócia','Marrocos','Haiti'],
'Grupo D': ['Estados Unidos','Turquia','Austrália','Paraguai'],
'Grupo E': ['Alemanha','Curaçao','Costa do Marfim','Equador'],
'Grupo F': ['Holanda','Japão','Tunísia','Suécia'],
'Grupo G': ['Argentina','Nigéria','Dinamarca','Chile'],
'Grupo H': ['França','Senegal','Peru','Áustria']
};

const round32Stage = {
'32-avos - Bloco 1': ['1º Grupo A','3º Grupo C/D/E','2º Grupo B','2º Grupo F'],
'32-avos - Bloco 2': ['1º Grupo C','3º Grupo A/B/F','2º Grupo D','2º Grupo E'],
'32-avos - Bloco 3': ['1º Grupo D','3º Grupo B/E/F','1º Grupo E','3º Grupo A/C/D'],
'32-avos - Bloco 4': ['1º Grupo F','3º Grupo A/B/C','1º Grupo G','3º Grupo D/E/H']
};

let currentGroup = '';
let currentFilter = 'all';

function currentPhase(){
 const selected = phasesData[DEMO_PHASE_STATUS];

 if(DEMO_PHASE_STATUS === 'GROUPS_OPEN' && new Date() > DEADLINE_GROUPS){
  return phasesData.GROUPS_CLOSED;
 }

 return selected;
}

function activeStageData(){
 const phase = currentPhase();

 if(phase.key === '32AVOS'){
  return round32Stage;
 }

 return groupStage;
}

function isBettingOpen(){
 return currentPhase().open;
}

function login(){
 const m = document.getElementById('matricula').value;
 const s = document.getElementById('senha').value;

 if(!m || !s){
  alert('Preencha matrícula e senha');
  return;
 }

 localStorage.setItem('user',m);
 start();
}

function start(){
 applySavedTheme();

 document.getElementById('loginScreen').classList.add('hidden');
 document.getElementById('app').classList.remove('hidden');

 document.getElementById('welcome').innerText =
 'Bem-vindo, matrícula ' + localStorage.getItem('user');

 renderPhaseHeader();
 renderGroups();
 renderBets();
 updateTotals();
}

function applySavedTheme(){
 const theme = localStorage.getItem('theme') || 'dark';

 if(theme === 'light'){
  document.body.classList.add('light');
  const btn = document.getElementById('themeButton');
  if(btn) btn.innerText = '☀️ Tema';
 }else{
  document.body.classList.remove('light');
  const btn = document.getElementById('themeButton');
  if(btn) btn.innerText = '🌙 Tema';
 }
}

function toggleTheme(){
 const isLight = document.body.classList.toggle('light');
 localStorage.setItem('theme', isLight ? 'light' : 'dark');
 document.getElementById('themeButton').innerText = isLight ? '☀️ Tema' : '🌙 Tema';
}

function renderPhaseHeader(){
 const phase = currentPhase();

 document.getElementById('currentPhaseName').innerText = phase.title;
 document.getElementById('phaseStatusText').innerText =
  phase.open ? 'Apostas abertas para a fase atual.' : 'Apostas bloqueadas para a fase atual.';

 document.getElementById('nextStepsText').innerText = phase.nextText;

 const box = document.getElementById('deadlineBox');

 if(phase.open){
  box.className = 'deadline-box deadline-open';
  box.innerHTML = '✅ ' + phase.deadlineText;
 }else if(phase.waitingNextPhase){
  box.className = 'deadline-box deadline-waiting';
  box.innerHTML = '⏳ ' + phase.deadlineText;
 }else{
  box.className = 'deadline-box deadline-closed';
  box.innerHTML = '🔒 ' + phase.deadlineText;
 }

 document.getElementById('gamesScreenTitle').innerText = '⚽ ' + phase.title;
}

function createGames(teams){
 return [
  [teams[0],teams[1]],
  [teams[2],teams[3]],
  [teams[0],teams[2]],
  [teams[1],teams[3]],
  [teams[0],teams[3]],
  [teams[1],teams[2]]
 ];
}

function createRound32Games(teams){
 return [
  [teams[0],teams[1]],
  [teams[2],teams[3]]
 ];
}

function getGamesForBlock(blockName, teams){
 const phase = currentPhase();

 if(phase.key === '32AVOS'){
  return createRound32Games(teams);
 }

 return createGames(teams);
}

function gameKey(block, index){
 return currentPhase().key + '_' + block + '_' + index;
}

function getSavedBet(block, index){
 return JSON.parse(localStorage.getItem(gameKey(block,index)) || '{}');
}

function renderGroups(){
 renderPhaseHeader();

 const grid = document.getElementById('groupsGrid');
 const closedMessage = document.getElementById('closedPhaseMessage');
 const data = activeStageData();
 const phase = currentPhase();

 grid.innerHTML = '';

 if(!phase.open && phase.waitingNextPhase){
  closedMessage.classList.remove('hidden');
  closedMessage.innerHTML = `
   <strong>🔒 Apostas bloqueadas para ${phase.title}</strong><br>
   Você ainda pode abrir os cards abaixo para consultar seus palpites.
   Quando o administrador liberar a próxima fase, novos jogos aparecerão aqui para novas apostas.
  `;
 }else{
  closedMessage.classList.add('hidden');
 }

 let completedGames = 0;
 let totalGames = 0;

 Object.keys(data).forEach(block=>{
   const games = getGamesForBlock(block, data[block]);
   let completed = 0;

   games.forEach((g,i)=>{
     totalGames++;
     const bet = getSavedBet(block,i);
     if(bet.a !== undefined && bet.b !== undefined){
       completed++;
       completedGames++;
     }
   });

   const percent = Math.floor((completed/games.length)*100);
   const complete = percent === 100;
   const open = isBettingOpen();

   grid.innerHTML += `
   <div class="group-card">

     <div class="group-top">
       <div class="group-title">${block}</div>
       <div class="group-badge ${complete ? 'badge-ok' : 'badge-no'}">
        ${complete ? '✅ Completo' : '❌ Pendente'}
       </div>
     </div>

     <div class="group-teams">${data[block].join(' • ')}</div>

     <div class="progress">
       <div class="progress-bar ${complete ? 'complete' : ''}" style="width:${percent}%"></div>
     </div>

     <div class="group-status">
       ${completed}/${games.length} jogos apostados • ${percent}%
     </div>

     <button class="${open ? '' : 'view-only'}" onclick="openGroup('${block}')">
       ${open ? 'Abrir apostas' : 'Ver palpites'}
     </button>

   </div>
   `;
 });

 const globalPercent = totalGames ? Math.floor((completedGames/totalGames)*100) : 0;
 document.getElementById('progressText').innerText = globalPercent + '%';
 document.getElementById('homeStatus').innerText =
 `${completedGames}/${totalGames} jogos preenchidos na fase atual. ${isBettingOpen() ? 'Apostas abertas.' : 'Apostas bloqueadas.'}`;

 const homeBar = document.getElementById('homeProgressBar');
 homeBar.style.width = globalPercent + '%';
 homeBar.className = 'progress-bar ' + (globalPercent === 100 ? 'complete' : '');
}

function openGroup(block){
 currentGroup = block;

 const gamesList = document.getElementById('gamesList');
 const title = document.getElementById('modalTitle');
 const hint = document.getElementById('modalHint');
 const saveBtn = document.getElementById('saveGroupButton');
 const data = activeStageData();

 const open = isBettingOpen();

 title.innerText = block;
 hint.innerText = open
  ? 'Preencha todos os jogos desta fase e salve os palpites.'
  : 'Apostas bloqueadas. Esta tela está apenas para consulta.';

 saveBtn.disabled = !open;
 saveBtn.innerText = open ? 'Salvar apostas' : 'Apostas bloqueadas';

 gamesList.innerHTML = '';

 const games = getGamesForBlock(block, data[block]);

 games.forEach((g,i)=>{
  const save = getSavedBet(block,i);

  gamesList.innerHTML += `
   <div class="game-card">

    <div class="teams">

      <div class="team-name">${g[0]}</div>

      <input type="number" min="0" class="score" id="a_${i}" value="${save.a ?? ''}" ${open ? '' : 'disabled'}>

      <div>X</div>

      <input type="number" min="0" class="score" id="b_${i}" value="${save.b ?? ''}" ${open ? '' : 'disabled'}>

      <div class="team-name team-right">${g[1]}</div>

    </div>

    <div class="game-date">
      ${currentPhase().title} • Copa do Mundo 2026
    </div>

   </div>
  `;
 });

 document.getElementById('modal').classList.remove('hidden');
}

function closeModal(){
 document.getElementById('modal').classList.add('hidden');
}

function saveGroup(){
 if(!isBettingOpen()){
  alert('As apostas desta fase estão bloqueadas.');
  return;
 }

 const data = activeStageData();
 const games = getGamesForBlock(currentGroup, data[currentGroup]);

 for(let i=0;i<games.length;i++){
   const a = document.getElementById('a_'+i).value;
   const b = document.getElementById('b_'+i).value;

   if(a === '' || b === ''){
    alert('Preencha todos os jogos.');
    return;
   }

   if(Number(a) < 0 || Number(b) < 0){
    alert('O placar não pode ser negativo.');
    return;
   }
 }

 for(let i=0;i<games.length;i++){
   const a = document.getElementById('a_'+i).value;
   const b = document.getElementById('b_'+i).value;

   localStorage.setItem(
    gameKey(currentGroup,i),
    JSON.stringify({a,b})
   );
 }

 closeModal();
 renderGroups();
 renderBets();
 updateTotals();

 alert('Apostas salvas com sucesso.');
}

function getDemoResult(block, index){
 if(index % 5 === 1) return null;

 const results = [
  {a:2,b:1},
  {a:1,b:1},
  {a:0,b:2},
  {a:3,b:0},
  {a:1,b:0},
  {a:2,b:2}
 ];

 return results[index] || null;
}

function outcome(a,b){
 if(Number(a) === Number(b)) return 'draw';
 return Number(a) > Number(b) ? 'A' : 'B';
}

function evaluateBet(block,index,bet){
 const real = getDemoResult(block,index);

 if(!real){
  return {
   status:'pending',
   text:'⏳ Aguardando resultado oficial',
   points:0,
   realText:'Ainda sem resultado'
  };
 }

 if(Number(bet.a) === Number(real.a) && Number(bet.b) === Number(real.b)){
  return {
   status:'exact',
   text:'🎯 Placar exato',
   points:2,
   realText:`${real.a} x ${real.b}`
  };
 }

 if(outcome(bet.a,bet.b) === outcome(real.a,real.b)){
  return {
   status:'winner',
   text:'✅ Acertou o vencedor/resultado',
   points:1,
   realText:`${real.a} x ${real.b}`
  };
 }

 return {
  status:'error',
  text:'❌ Errou',
  points:0,
  realText:`${real.a} x ${real.b}`
 };
}

function setFilter(filter, element){
 currentFilter = filter;

 document.querySelectorAll('.filter').forEach(btn => btn.classList.remove('active'));
 element.classList.add('active');

 renderBets();
}

function renderBets(){
 const container = document.getElementById('betsContainer');
 const data = activeStageData();
 container.innerHTML = '';

 let hasAny = false;

 Object.keys(data).forEach(block=>{
   const games = getGamesForBlock(block, data[block]);
   let groupHtml = '';
   let count = 0;

   games.forEach((g,i)=>{
     const bet = getSavedBet(block,i);

     if(bet.a === undefined || bet.b === undefined){
       return;
     }

     const ev = evaluateBet(block,i,bet);

     if(currentFilter !== 'all' && ev.status !== currentFilter){
       return;
     }

     count++;
     hasAny = true;

     groupHtml += `
       <div class="bet-item">
         <div class="bet-teams">
           <span>${g[0]}</span>
           <span>x</span>
           <span>${g[1]}</span>
         </div>

         <div class="bet-score-line">
           <div class="score-box">
             <span>Seu palpite</span>
             <strong>${bet.a} x ${bet.b}</strong>
           </div>

           <div class="score-box">
             <span>Resultado oficial</span>
             <strong>${ev.realText}</strong>
           </div>
         </div>

         <div class="bet-result ${ev.status}">
           ${ev.text} • +${ev.points} ponto${ev.points === 1 ? '' : 's'}
         </div>
       </div>
     `;
   });

   if(count > 0){
     container.innerHTML += `
       <div class="bet-group">
         <div class="bet-group-title">
          <strong>${block}</strong>
          <small>${count} jogo${count > 1 ? 's' : ''}</small>
         </div>

         <div class="bet-list">
           ${groupHtml}
         </div>
       </div>
     `;
   }
 });

 if(!hasAny){
  container.innerHTML = `
    <div class="empty-state">
      Nenhuma aposta encontrada para este filtro na fase atual.
      ${currentFilter === 'all' ? 'Use a aba Apostar quando a fase estiver liberada.' : 'Tente selecionar outro filtro.'}
    </div>
  `;
 }
}

function updateTotals(){
 const data = activeStageData();
 let total = 0;

 Object.keys(data).forEach(block=>{
   const games = getGamesForBlock(block, data[block]);

   games.forEach((g,i)=>{
     const bet = getSavedBet(block,i);

     if(bet.a !== undefined && bet.b !== undefined){
       total += evaluateBet(block,i,bet).points;
     }
   });
 });

 document.getElementById('totalPoints').innerText = total;
 document.getElementById('rankingPoints').innerText = total + ' pts';
}

function changeScreen(screen){
 document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
 document.getElementById('screen-'+screen).classList.remove('hidden');

 if(screen === 'bets'){
  renderBets();
 }

 if(screen === 'groups' || screen === 'home'){
  renderGroups();
 }

 updateTotals();
}

window.onload = ()=>{
 applySavedTheme();

 if(localStorage.getItem('user')){
   start();
 }
}
