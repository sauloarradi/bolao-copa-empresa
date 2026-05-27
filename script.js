// Data limite das apostas.
// Regra solicitada: após o dia 10, o usuário não pode alterar mais nada.
// Ajuste aqui futuramente caso a empresa defina outro horário oficial.
const DEADLINE = new Date('2026-06-10T23:59:59');

// Para apresentação antes do prazo, deixe false.
// Para simular o sistema após o dia 10, altere para true.
const FORCE_CLOSED_FOR_DEMO = false;

const groups = {
'Grupo A': ['México','África do Sul','Coreia do Sul','Tchéquia'],
'Grupo B': ['Canadá','Suíça','Qatar','Bósnia'],
'Grupo C': ['Brasil','Escócia','Marrocos','Haiti'],
'Grupo D': ['Estados Unidos','Turquia','Austrália','Paraguai'],
'Grupo E': ['Alemanha','Curaçao','Costa do Marfim','Equador'],
'Grupo F': ['Holanda','Japão','Tunísia','Suécia'],
'Grupo G': ['Argentina','Nigéria','Dinamarca','Chile'],
'Grupo H': ['França','Senegal','Peru','Áustria']
};

let currentGroup = '';
let currentFilter = 'all';

function isBettingClosed(){
 return FORCE_CLOSED_FOR_DEMO || new Date() > DEADLINE;
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

 renderDeadline();
 renderGroups();
 renderBets();
 updateTotals();
}

function applySavedTheme(){
 const theme = localStorage.getItem('theme') || 'dark';

 if(theme === 'light'){
  document.body.classList.add('light');
  document.getElementById('themeButton').innerText = '☀️ Tema';
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

function renderDeadline(){
 const box = document.getElementById('deadlineBox');

 if(isBettingClosed()){
  box.className = 'deadline-box deadline-closed';
  box.innerHTML = '🔒 Apostas encerradas. Agora você pode apenas acompanhar seus palpites, resultados oficiais e pontuação.';
 }else{
  box.className = 'deadline-box deadline-open';
  box.innerHTML = '✅ Apostas abertas até 10/06/2026 às 23:59. Após esse prazo, nenhuma alteração será permitida.';
 }
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

function gameKey(group, index){
 return group + '_' + index;
}

function getSavedBet(group, index){
 return JSON.parse(localStorage.getItem(gameKey(group,index)) || '{}');
}

function renderGroups(){
 const grid = document.getElementById('groupsGrid');
 grid.innerHTML = '';

 let completedGames = 0;
 let totalGames = 0;

 Object.keys(groups).forEach(group=>{
   const games = createGames(groups[group]);
   let completed = 0;

   games.forEach((g,i)=>{
     totalGames++;
     const bet = getSavedBet(group,i);
     if(bet.a !== undefined && bet.b !== undefined){
       completed++;
       completedGames++;
     }
   });

   const percent = Math.floor((completed/games.length)*100);
   const complete = percent === 100;
   const closed = isBettingClosed();

   grid.innerHTML += `
   <div class="group-card">

     <div class="group-top">
       <div class="group-title">${group}</div>
       <div class="group-badge ${complete ? 'badge-ok' : 'badge-no'}">
        ${complete ? '✅ Completo' : '❌ Pendente'}
       </div>
     </div>

     <div class="group-teams">${groups[group].join(' • ')}</div>

     <div class="progress">
       <div class="progress-bar ${complete ? 'complete' : ''}" style="width:${percent}%"></div>
     </div>

     <div class="group-status">
       ${completed}/${games.length} jogos apostados • ${percent}%
     </div>

     <button class="${closed ? 'view-only' : ''}" onclick="openGroup('${group}')">
       ${closed ? 'Ver palpites' : 'Abrir grupo'}
     </button>

   </div>
   `;
 });

 const globalPercent = totalGames ? Math.floor((completedGames/totalGames)*100) : 0;
 document.getElementById('progressText').innerText = globalPercent + '%';
 document.getElementById('homeStatus').innerText =
 `${completedGames}/${totalGames} jogos preenchidos. ${isBettingClosed() ? 'As apostas já estão bloqueadas.' : 'Finalize tudo antes do prazo.'}`;

 const homeBar = document.getElementById('homeProgressBar');
 homeBar.style.width = globalPercent + '%';
 homeBar.className = 'progress-bar ' + (globalPercent === 100 ? 'complete' : '');
}

function openGroup(group){
 currentGroup = group;

 const gamesList = document.getElementById('gamesList');
 const title = document.getElementById('modalTitle');
 const hint = document.getElementById('modalHint');
 const saveBtn = document.getElementById('saveGroupButton');

 const closed = isBettingClosed();

 title.innerText = group;
 hint.innerText = closed
  ? 'Apostas bloqueadas após o prazo. Esta tela está apenas para consulta.'
  : 'Preencha todos os jogos do grupo e salve os palpites.';

 saveBtn.disabled = closed;
 saveBtn.innerText = closed ? 'Apostas bloqueadas' : 'Salvar apostas';

 gamesList.innerHTML = '';

 const games = createGames(groups[group]);

 games.forEach((g,i)=>{
  const save = getSavedBet(group,i);

  gamesList.innerHTML += `
   <div class="game-card">

    <div class="teams">

      <div class="team-name">${g[0]}</div>

      <input type="number" min="0" class="score" id="a_${i}" value="${save.a ?? ''}" ${closed ? 'disabled' : ''}>

      <div>X</div>

      <input type="number" min="0" class="score" id="b_${i}" value="${save.b ?? ''}" ${closed ? 'disabled' : ''}>

      <div class="team-name team-right">${g[1]}</div>

    </div>

    <div class="game-date">
      Fase de grupos • Copa do Mundo 2026
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
 if(isBettingClosed()){
  alert('As apostas estão encerradas. Não é possível alterar palpites após o dia 10.');
  return;
 }

 const games = createGames(groups[currentGroup]);

 for(let i=0;i<games.length;i++){
   const a = document.getElementById('a_'+i).value;
   const b = document.getElementById('b_'+i).value;

   if(a === '' || b === ''){
    alert('Preencha todos os jogos do grupo.');
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

function getDemoResult(group, index){
 // Resultados simulados para demonstrar a tela de acompanhamento.
 // Na versão real, isso virá do banco/API administrativa.
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

function evaluateBet(group,index,bet){
 const real = getDemoResult(group,index);

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
 container.innerHTML = '';

 let hasAny = false;

 Object.keys(groups).forEach(group=>{
   const games = createGames(groups[group]);
   let groupHtml = '';
   let count = 0;

   games.forEach((g,i)=>{
     const bet = getSavedBet(group,i);

     if(bet.a === undefined || bet.b === undefined){
       return;
     }

     const ev = evaluateBet(group,i,bet);

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
          <strong>${group}</strong>
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
      Nenhuma aposta encontrada para este filtro.
      ${currentFilter === 'all' ? 'Preencha seus palpites na aba Grupos.' : 'Tente selecionar outro filtro.'}
    </div>
  `;
 }
}

function updateTotals(){
 let total = 0;

 Object.keys(groups).forEach(group=>{
   const games = createGames(groups[group]);

   games.forEach((g,i)=>{
     const bet = getSavedBet(group,i);

     if(bet.a !== undefined && bet.b !== undefined){
       total += evaluateBet(group,i,bet).points;
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
