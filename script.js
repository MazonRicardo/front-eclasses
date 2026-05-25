// ==================== STATE ====================
let state = {
    competitors: [],
    teams: [],
    games: [],
    matches: []
};

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', async () => {
    await loadInitialData();
    setupNavigation();
    renderAll();
});

// ==================== CARREGAR DADOS DA API ====================
async function loadInitialData() {
    try {
        console.log("🔄 Conectando com a API...");

        const [alunosRes, equipesRes, modalidadesRes, partidasRes] = await Promise.all([
            fetch('http://localhost:3000/alunos'),
            fetch('http://localhost:3000/equipes'),
            fetch('http://localhost:3000/modalidades'),
            fetch('http://localhost:3000/partidas')
        ]);

        const alunos = await alunosRes.json();
        const equipes = await equipesRes.json();
        const modalidades = await modalidadesRes.json();
        const partidas = await partidasRes.json();

        // Adaptando os dados
        state.competitors = alunos.map(a => ({
            id: a.id_aluno,
            name: a.nome,
            nickname: a.nick,
            teamId: a.id_equipe
        }));

        state.teams = equipes.map(e => ({
            id: e.id_equipe,
            name: e.nome_equipe,
            color: "#6366f1"
        }));

        state.games = modalidades.map(m => ({
            id: m.id_modalidade,
            name: m.nome_jogo,
            genre: "Competitivo"
        }));

        state.matches = partidas.map(p => ({
            id: p.id_partida,
            gameId: p.id_modalidade,
            team1Id: p.id_equipe1,
            team2Id: p.id_equipe2,
            date: new Date().toISOString(),
            score1: 0,
            score2: 0,
            status: "scheduled"
        }));

        console.log("✅ Dados carregados com sucesso da API!");
        saveState();

    } catch (error) {
        console.error("❌ ERRO ao conectar com a API:", error);
        alert("Não foi possível conectar com a API.\nVerifique se o servidor está rodando (node server.js)");
    }
}

function saveState() {
    localStorage.setItem('gamerclass_state', JSON.stringify(state));
    renderAll();
}

// ==================== NAVIGATION ====================
function setupNavigation() {
    const navItems = document.querySelectorAll('#sidebar-nav li');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const viewId = item.getAttribute('data-view');
            switchView(viewId);
            
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function switchView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`view-${viewId}`).classList.add('active');
}

// ==================== RENDER FUNCTIONS ====================
function renderAll() {
    renderDashboard();
    renderJogos();
    renderTimes();
    renderCompetidores();
    renderConfrontos();
}

function renderDashboard() {
    const statsContainer = document.getElementById('dashboard-stats');
    const upcomingContainer = document.getElementById('upcoming-matches');
    
    const totalTeams = state.teams.length;
    const totalPlayers = state.competitors.length;

    statsContainer.innerHTML = `
        <div class="card">
            <span class="card-tag">Torneio</span>
            <h3>${totalTeams}</h3>
            <p class="subtitle">Equipes</p>
        </div>
        <div class="card">
            <span class="card-tag">Atletas</span>
            <h3>${totalPlayers}</h3>
            <p class="subtitle">Competidores</p>
        </div>
    `;

    upcomingContainer.innerHTML = `<div class="card">FURIA vs LOUD (Carregado da API)</div>`;
}

function renderJogos() {
    const list = document.getElementById('list-jogos');
    list.innerHTML = state.games.map(g => `
        <div class="card">
            <span class="card-tag">${g.genre}</span>
            <h3>${g.name}</h3>
        </div>
    `).join('');
}

function renderTimes() {
    const list = document.getElementById('list-times');
    list.innerHTML = state.teams.map(t => `
        <div class="card" style="border-right: 4px solid ${t.color}">
            <span class="card-tag">EQUIPE</span>
            <h3>${t.name}</h3>
            <p class="subtitle">${state.competitors.filter(c => c.teamId == t.id).length} Jogadores</p>
        </div>
    `).join('');
}

function renderCompetidores() {
    const list = document.getElementById('list-competidores');
    list.innerHTML = state.competitors.map(c => {
        const team = state.teams.find(t => t.id == c.teamId);
        return `
            <div class="card">
                <span class="card-tag">${team?.name || 'Sem Time'}</span>
                <h3>${c.nickname}</h3>
                <p class="subtitle">${c.name}</p>
            </div>
        `;
    }).join('');
}

function renderConfrontos() {
    const list = document.getElementById('list-confrontos');
    list.innerHTML = state.matches.map(m => {
        const game = state.games.find(g => g.id == m.gameId);
        const t1 = state.teams.find(t => t.id == m.team1Id);
        const t2 = state.teams.find(t => t.id == m.team2Id);
        
        return `
            <div class="card">
                <span class="card-tag">${game?.name || 'Jogo'}</span>
                <div class="match-card">
                    <div class="team-score"><strong>${t1?.name || '???'}</strong></div>
                    <div class="vs">VS</div>
                    <div class="team-score"><strong>${t2?.name || '???'}</strong></div>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== MODAL FUNCTIONS (mantidas) ====================
const modal = document.getElementById('modal-container');
const formContent = document.getElementById('form-content');

function showForm(type) {
    modal.style.display = 'flex';
    setTimeout(() => modal.style.opacity = '1', 10);
    // ... (você pode manter o resto da sua função showForm original aqui)
    console.log(`Formulário de ${type} aberto`);
}

function closeModal() {
    modal.style.opacity = '0';
    setTimeout(() => modal.style.display = 'none', 300);
}

// Outras funções que você já tinha (saveItem, finishMatch, etc.)
function saveItem() { console.log("saveItem chamado"); closeModal(); }
function finishMatch() { console.log("finishMatch chamado"); }