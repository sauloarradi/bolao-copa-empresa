
const groups = {
'Grupo A': ['México','África do Sul','Coreia do Sul','Tchéquia'],
'Grupo B': ['Canadá','Suíça','Qatar','Bósnia'],
'Grupo C': ['Brasil','Escócia','Marrocos','Haiti'],
'Grupo D': ['Estados Unidos','Turquia','Austrália','Paraguai'],
'Grupo E': ['Alemanha','Curacao','Costa do Marfim','Equador'],
'Grupo F': ['Holanda','Japão','Tunísia','Suécia'],
'Grupo G': ['Argentina','Nigéria','Dinamarca','Chile'],
'Grupo H': ['França','Senegal','Peru','Áustria']
};

let currentGroup = '';

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
 document.getElementById('loginScreen').classList.add('hidden');
 document.getElementById('app').classList.remove('hidden');

 document.getElementById('welcome').innerText =
 'Bem-vindo, matrícula ' + localStorage.getItem('user');

 renderGroups();
 renderBets();
}

function renderGroups(){

 const grid = document.getElementById('groupsGrid');
 grid.innerHTML = '';

 let done = 0;

 Object.keys(groups).forEach(group=>{

   const games = createGames(groups[group]);

   let completed = 0;

   games.forEach((g,i)=>{
     if(localStorage.getItem(group+'_'+i)){
       completed++;
     }
   });

   const percent = Math.floor((completed/games.length)*100);

   if(percent === 100){
     done++;
   }

   grid.innerHTML += `
   <div class="group-card">

     <div class="group-top">
       <div class="group-title">${group}</div>
       <div>${percent}%</div>
     </div>

     <div>${groups[group].join(' • ')}</div>

     <div class="progress">
       <div class="progress-bar" style="width:${percent}%"></div>
     </div>

     <div class="group-status">
       ${completed}/${games.length} jogos apostados
     </div>

     <button onclick="openGroup('${group}')">
       Abrir Grupo
     </button>

   </div>
   `;
 });

 document.getElementById('progressText').innerText =
 Math.floor((done/Object.keys(groups).length)*100)+'%';
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

function openGroup(group){

 currentGroup = group;

 const gamesList = document.getElementById('gamesList');
 const title = document.getElementById('modalTitle');

 title.innerText = group;
 gamesList.innerHTML = '';

 const games = createGames(groups[group]);

 games.forEach((g,i)=>{

  const save = JSON.parse(localStorage.getItem(group+'_'+i) || '{}');

  gamesList.innerHTML += `
   <div class="game-card">

    <div class="teams">

      <div>${g[0]}</div>

      <input type="number" class="score" id="a_${i}" value="${save.a || ''}">

      <div>X</div>

      <input type="number" class="score" id="b_${i}" value="${save.b || ''}">

      <div class="team-right">${g[1]}</div>

    </div>

    <div class="game-date">
      Copa do Mundo 2026
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

 const games = createGames(groups[currentGroup]);

 for(let i=0;i<games.length;i++){

   const a = document.getElementById('a_'+i).value;
   const b = document.getElementById('b_'+i).value;

   if(a === '' || b === ''){
    alert('Preencha todos os jogos.');
    return;
   }

   localStorage.setItem(
    currentGroup+'_'+i,
    JSON.stringify({a,b})
   );
 }

 closeModal();
 renderGroups();
 renderBets();

 alert('Apostas salvas com sucesso');
}

function renderBets(){

 const container = document.getElementById('betsContainer');
 container.innerHTML = '';

 Object.keys(groups).forEach(group=>{

   const games = createGames(groups[group]);

   games.forEach((g,i)=>{

     const save = JSON.parse(localStorage.getItem(group+'_'+i) || '{}');

     if(save.a !== undefined){

       let resultClass = 'pending';
       let resultText = '⏳ Aguardando resultado oficial';

       if(i % 4 === 0){
         resultClass = 'exact';
         resultText = '🎯 Placar exato • +2 pontos';
       }else if(i % 3 === 0){
         resultClass = 'winner';
         resultText = '✅ Acertou vencedor • +1 ponto';
       }else if(i % 2 === 0){
         resultClass = 'error';
         resultText = '❌ Errou • 0 pontos';
       }

       container.innerHTML += `
       <div class="bet-item">

         <strong>${g[0]} x ${g[1]}</strong>

         <div style="margin-top:10px;">
          Seu palpite:
          <strong>${save.a} x ${save.b}</strong>
         </div>

         <div class="bet-result ${resultClass}">
          ${resultText}
         </div>

       </div>
       `;
     }

   });

 });

}

function changeScreen(screen){

 document.getElementById('screen-groups').classList.add('hidden');
 document.getElementById('screen-bets').classList.add('hidden');
 document.getElementById('screen-ranking').classList.add('hidden');

 document.getElementById('screen-'+screen).classList.remove('hidden');
}

window.onload = ()=>{
 if(localStorage.getItem('user')){
   start();
 }
}
