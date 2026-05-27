
let currentGroup = null;
let betsFinished = localStorage.getItem('betsFinished') === 'true';

function login(){

    const matricula = document.getElementById('matricula').value;
    const senha = document.getElementById('senha').value;

    if(!matricula || !senha){
        alert('Preencha matrícula e senha');
        return;
    }

    localStorage.setItem('user', matricula);

    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');

    document.getElementById('welcome').innerText =
        `Bem-vindo, matrícula ${matricula}`;

    renderGroups();
}

function logout(){
    localStorage.removeItem('user');
    location.reload();
}

function renderGroups(){

    const container = document.getElementById('groupsContainer');

    container.innerHTML = '';

    const groups = Object.keys(GROUPS);

    let completedGroups = 0;

    groups.forEach(groupName => {

        const games = GROUPS[groupName];

        let completed = 0;

        games.forEach((game, index) => {

            const bet = JSON.parse(localStorage.getItem(`${groupName}_${index}`));

            if(
                bet &&
                bet.a !== '' &&
                bet.b !== '' &&
                bet.a !== undefined &&
                bet.b !== undefined
            ){
                completed++;
            }

        });

        const finished = completed === games.length;

        if(finished){
            completedGroups++;
        }

        container.innerHTML += `
            <div class="group-card" onclick="openGroup('${groupName}')">

                <div class="group-status">
                    ${finished ? '✅' : '❌'}
                </div>

                <h3>${groupName}</h3>

                <div class="group-description">
                    ${completed}/${games.length} jogos apostados
                </div>

            </div>
        `;

    });

    document.getElementById('completedGroups').innerText =
        `${completedGroups}/${groups.length}`;
}

function openGroup(groupName){

    currentGroup = groupName;

    const modal = document.getElementById('groupModal');

    modal.classList.remove('hidden');

    document.getElementById('modalTitle').innerText = groupName;

    const container = document.getElementById('modalGames');

    container.innerHTML = '';

    GROUPS[groupName].forEach((game, index) => {

        const saved =
            JSON.parse(localStorage.getItem(`${groupName}_${index}`)) || {};

        container.innerHTML += `
            <div class="game-item">

                <div class="game-row">

                    <div class="team-name">
                        ${game[0]}
                    </div>

                    <div class="score-area">

                        <input
                            type="number"
                            class="score-input"
                            min="0"
                            id="a_${index}"
                            value="${saved.a ?? ''}"
                            ${betsFinished ? 'disabled' : ''}
                        >

                        <span>X</span>

                        <input
                            type="number"
                            class="score-input"
                            min="0"
                            id="b_${index}"
                            value="${saved.b ?? ''}"
                            ${betsFinished ? 'disabled' : ''}
                        >

                    </div>

                    <div class="team-name" style="text-align:right;">
                        ${game[1]}
                    </div>

                </div>

            </div>
        `;

    });

}

function closeModal(){
    document.getElementById('groupModal').classList.add('hidden');
}

function saveGroup(){

    GROUPS[currentGroup].forEach((game, index) => {

        const a = document.getElementById(`a_${index}`).value;
        const b = document.getElementById(`b_${index}`).value;

        localStorage.setItem(
            `${currentGroup}_${index}`,
            JSON.stringify({a,b})
        );

    });

    closeModal();

    renderGroups();

    alert('Grupo salvo com sucesso');
}

function finishBets(){

    let incomplete = false;

    Object.keys(GROUPS).forEach(groupName => {

        GROUPS[groupName].forEach((game, index) => {

            const bet =
                JSON.parse(localStorage.getItem(`${groupName}_${index}`));

            if(
                !bet ||
                bet.a === '' ||
                bet.b === '' ||
                bet.a === undefined ||
                bet.b === undefined
            ){
                incomplete = true;
            }

        });

    });

    if(incomplete){
        alert('Você precisa preencher todos os jogos.');
        return;
    }

    if(confirm('Após finalizar as apostas não será mais possível editar. Deseja continuar?')){

        localStorage.setItem('betsFinished', 'true');

        alert('Apostas finalizadas com sucesso');

        location.reload();
    }
}

window.onload = () => {

    const user = localStorage.getItem('user');

    if(user){

        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');

        document.getElementById('welcome').innerText =
            `Bem-vindo, matrícula ${user}`;

        renderGroups();
    }

};
