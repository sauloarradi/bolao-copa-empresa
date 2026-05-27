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
  deadlineText: 'Apostas da fase de grupos encerradas. Aguarde a liberação dos jogos da fase de 32-avos de final.',
  nextText: 'Agora você pode acompanhar resultados, pontuação e ranking. As próximas apostas serão liberadas quando os jogos dos 32-avos estiverem disponíveis.'
 },
 ROUND32_OPEN: {
  key: '32AVOS',
  title: '32-avos de Final',
  open: true,
  waitingNextPhase: false,
  deadlineText: 'Apostas dos 32-avos liberadas. Preencha todos os jogos antes do novo prazo definido para esta fase.',
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
 const phaseStatus = localStorage.getItem('phaseStatus') || DEMO_PHASE_STATUS;
 const selected = phasesData[phaseStatus];

 if(phaseStatus === 'GROUPS_OPEN' && new Date() > DEADLINE_GROUPS){
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

let loginMode = 'user';
let selectedEmployee = null;
const employees = [
 {matricula:'1001', nome:'João Silva', setor:'Produção'},
 {matricula:'1002', nome:'Maria Souza', setor:'RH'},
 {matricula:'1003', nome:'Carlos Lima', setor:'Expedição'},
 {matricula:'1004', nome:'Ana Paula', setor:'Qualidade'},
 {matricula:'1005', nome:'Roberto Santos', setor:'Manutenção'}
];

function setLoginMode(mode){
 loginMode = mode;
 document.getElementById('loginUserBtn').classList.toggle('active', mode === 'user');
 document.getElementById('loginAdminBtn').classList.toggle('active', mode === 'admin');
 document.getElementById('matricula').placeholder = mode === 'admin' ? 'Usuário admin' : 'Matrícula';
 document.getElementById('loginHint').innerText = mode === 'admin'
  ? 'Admin/RH: use usuário admin e senha admin para testar.'
  : 'Funcionário: informe qualquer matrícula e senha para testar.';
}

function login(){
 const m = document.getElementById('matricula').value.trim();
 const s = document.getElementById('senha').value.trim();

 if(!m || !s){
  alert('Preencha usuário e senha');
  return;
 }

 if(loginMode === 'admin'){
  if(m.toLowerCase() !== 'admin' || s.toLowerCase() !== 'admin'){
   alert('Para testar o painel admin, use usuário admin e senha admin.');
   return;
  }
  localStorage.setItem('sessionType','admin');
  startAdmin();
  return;
 }

 localStorage.setItem('sessionType','user');
 localStorage.setItem('user',m);
 start();
}

function logoutAdmin(){
 localStorage.removeItem('sessionType');
 location.reload();
}

function start(){
 applySavedTheme();

 document.getElementById('loginScreen').classList.add('hidden');
 document.getElementById('adminApp').classList.add('hidden');
 document.getElementById('userApp').classList.remove('hidden');

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

function gameKey(block, index, matricula = null){
 const user = matricula || localStorage.getItem('user') || 'demo';
 return 'bet_' + user + '_' + currentPhase().key + '_' + block + '_' + index;
}

function getSavedBet(block, index, matricula = null){
 return JSON.parse(localStorage.getItem(gameKey(block,index,matricula)) || '{}');
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
   Quando a próxima fase for liberada, novos jogos aparecerão aqui para novas apostas.
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
    JSON.stringify({a,b,origem:'ONLINE',cadastradoPor:localStorage.getItem('user'),data:new Date().toLocaleString('pt-BR')})
   );
 }

 closeModal();
 renderGroups();
 renderBets();
 updateTotals();

 addAudit('Aposta online salva','Matrícula '+localStorage.getItem('user')+' salvou apostas em '+currentGroup);

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
         <div class="game-date">Origem: ${bet.origem === 'PAPEL' ? '📄 Ficha impressa/RH' : '📱 Sistema online'}</div>
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


function addAudit(action, detail){
 const list = JSON.parse(localStorage.getItem('audit') || '[]');
 list.unshift({action, detail, user:'Admin/RH', date:new Date().toLocaleString('pt-BR')});
 localStorage.setItem('audit', JSON.stringify(list.slice(0,100)));
}

function startAdmin(){
 document.getElementById('loginScreen').classList.add('hidden');
 document.getElementById('userApp').classList.add('hidden');
 document.getElementById('adminApp').classList.remove('hidden');
 document.getElementById('phaseSelect').value = localStorage.getItem('phaseStatus') || DEMO_PHASE_STATUS;
 renderAdminAll();
}

function showAdmin(screen, btn){
 document.querySelectorAll('.admin-screen').forEach(s=>s.classList.add('hidden'));
 document.getElementById('admin-'+screen).classList.remove('hidden');
 document.querySelectorAll('.admin-tabs button').forEach(b=>b.classList.remove('active'));
 btn.classList.add('active');
 renderAdminAll();
}

function countEmployeeBets(matricula){
 const data = activeStageData(); let done=0,total=0;
 Object.keys(data).forEach(block=>{
  getGamesForBlock(block,data[block]).forEach((g,i)=>{ total++; const b=getSavedBet(block,i,matricula); if(b.a!==undefined && b.b!==undefined) done++; });
 });
 return {done,total};
}

function renderAdminAll(){
 renderAdminDashboard(); renderManualGames(); renderResultsGames(); renderAudit();
}

function renderAdminDashboard(){
 const data = activeStageData(); let bets=0,online=0,paper=0;
 employees.forEach(emp=>{
  Object.keys(data).forEach(block=>{
   getGamesForBlock(block,data[block]).forEach((g,i)=>{
    const b=getSavedBet(block,i,emp.matricula); if(b.a!==undefined){bets++; b.origem==='PAPEL'?paper++:online++;}
   });
  });
 });
 document.getElementById('adminBets').innerText=bets;
 document.getElementById('adminPhaseName').innerText=currentPhase().title;
 document.getElementById('onlineBets').innerText=online;
 document.getElementById('paperBets').innerText=paper;
 document.getElementById('adminSummaryText').innerText='Fase atual: '+currentPhase().title+'. Status: '+(isBettingOpen()?'apostas abertas':'apostas bloqueadas')+'.';
 const pending=employees.map(e=>({...e, p:countEmployeeBets(e.matricula)})).filter(e=>e.p.done<e.p.total);
 document.getElementById('pendingEmployees').innerHTML = pending.length ? pending.map(e=>`<div class="origin-row"><span>${e.nome}<br><small class="muted">Matrícula ${e.matricula}</small></span><strong>${e.p.done}/${e.p.total}</strong></div>`).join('') : '<p class="muted">Todos concluíram a fase atual.</p>';
}

function searchEmployee(){
 const term=document.getElementById('employeeSearch').value.trim();
 selectedEmployee=employees.find(e=>e.matricula===term) || null;
 const box=document.getElementById('employeeBox'); box.classList.remove('hidden');
 if(!selectedEmployee){ box.innerHTML='Funcionário não encontrado no protótipo.'; document.getElementById('manualBox').classList.add('hidden'); return; }
 const p=countEmployeeBets(selectedEmployee.matricula);
 box.innerHTML=`<strong>${selectedEmployee.nome}</strong><br>Matrícula: ${selectedEmployee.matricula}<br>Setor: ${selectedEmployee.setor}<br>Progresso atual: ${p.done}/${p.total}`;
 document.getElementById('manualBox').classList.remove('hidden');
 document.getElementById('manualTitle').innerText='Apostas da ficha impressa - '+selectedEmployee.nome;
 renderManualGames();
}

function renderManualGames(){
 const box=document.getElementById('manualGames'); if(!box || !selectedEmployee){ if(box) box.innerHTML=''; return; }
 const data=activeStageData(); let html='';
 Object.keys(data).forEach(block=>{
  html+=`<h4 style="margin-top:18px;margin-bottom:8px;">${block}</h4>`;
  getGamesForBlock(block,data[block]).forEach((g,i)=>{ const b=getSavedBet(block,i,selectedEmployee.matricula); html+=`<div class="manual-game"><div class="team-name">${g[0]}</div><input type="number" min="0" id="manual_${block}_${i}_a" value="${b.a ?? ''}"><div>X</div><input type="number" min="0" id="manual_${block}_${i}_b" value="${b.b ?? ''}"><div class="team-name team-right">${g[1]}</div></div>`; });
 });
 box.innerHTML=html;
}

function saveManualBets(){
 if(!selectedEmployee){alert('Busque um funcionário antes de salvar.');return;}
 if(!isBettingOpen()){alert('A fase atual está bloqueada. Não é possível lançar apostas sem reabrir a fase.');return;}
 const data=activeStageData();
 for(const block of Object.keys(data)){ for(let i=0;i<getGamesForBlock(block,data[block]).length;i++){ const a=document.getElementById(`manual_${block}_${i}_a`).value; const b=document.getElementById(`manual_${block}_${i}_b`).value; if(a===''||b===''){alert('Preencha todos os jogos antes de salvar a ficha.');return;} } }
 for(const block of Object.keys(data)){ for(let i=0;i<getGamesForBlock(block,data[block]).length;i++){ const a=document.getElementById(`manual_${block}_${i}_a`).value; const b=document.getElementById(`manual_${block}_${i}_b`).value; localStorage.setItem(gameKey(block,i,selectedEmployee.matricula), JSON.stringify({a,b,origem:'PAPEL',cadastradoPor:'Admin/RH',data:new Date().toLocaleString('pt-BR')})); } }
 addAudit('Aposta impressa lançada','Ficha impressa lançada para '+selectedEmployee.nome+' - matrícula '+selectedEmployee.matricula);
 alert('Apostas impressas salvas com sucesso.'); renderAdminAll(); searchEmployee();
}

function saveAdminPhase(){
 const phase=document.getElementById('phaseSelect').value; localStorage.setItem('phaseStatus',phase);
 addAudit('Fase alterada','Fase alterada para '+phase);
 alert('Fase atualizada no protótipo.'); renderAdminAll();
}

function renderResultsGames(){
 const box=document.getElementById('resultsGames'); if(!box) return; const data=activeStageData(); let html='';
 Object.keys(data).forEach(block=>{ html+=`<h4 style="margin-top:18px;margin-bottom:8px;">${block}</h4>`; getGamesForBlock(block,data[block]).forEach((g,i)=>{ const r=JSON.parse(localStorage.getItem(resultKey(block,i))||'{}'); html+=`<div class="result-game"><div class="team-name">${g[0]}</div><input type="number" min="0" id="result_${block}_${i}_a" value="${r.a ?? ''}"><div>X</div><input type="number" min="0" id="result_${block}_${i}_b" value="${r.b ?? ''}"><div class="team-name team-right">${g[1]}</div></div>`; }); });
 box.innerHTML=html;
}

function saveAdminResults(){
 const data=activeStageData();
 Object.keys(data).forEach(block=>{ getGamesForBlock(block,data[block]).forEach((g,i)=>{ const a=document.getElementById(`result_${block}_${i}_a`).value; const b=document.getElementById(`result_${block}_${i}_b`).value; if(a!==''&&b!=='') localStorage.setItem(resultKey(block,i), JSON.stringify({a,b,atualizadoPor:'Admin/RH',data:new Date().toLocaleString('pt-BR')})); }); });
 addAudit('Resultado oficial atualizado','Resultados oficiais atualizados para '+currentPhase().title);
 alert('Resultados salvos com sucesso.'); renderAdminAll();
}

function renderAudit(){
 const box=document.getElementById('auditList'); if(!box) return; const list=JSON.parse(localStorage.getItem('audit')||'[]');
 box.innerHTML=list.length ? list.map(i=>`<div class="audit-item"><strong>${i.action}</strong><small>${i.detail}<br>Usuário: ${i.user} • ${i.date}</small></div>`).join('') : '<p class="muted">Nenhum evento registrado ainda.</p>';
}

window.onload = ()=>{
 applySavedTheme();
 const session = localStorage.getItem('sessionType');
 if(session === 'admin') startAdmin();
 else if(session === 'user' && localStorage.getItem('user')) start();
}
