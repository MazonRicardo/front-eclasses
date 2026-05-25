// ==================== STATE ====================
let state = {
    competitors: [],
    teams: [],
    games: [],
    matches: []
};

// ==================== APPLICATION INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    await loadInitialData();
    setupNavigation();
    renderAll();
});

// ==================== LOAD DATA FROM API ====================
async function loadInitialData() {
    try {
        console.log("🔄 Carregando dados da API...");

        const [alunos, equipes, modalidades, partidas] = await Promise.all([
            getAlunos(),
            getEquipes(),
            getModalidades(),
            getPartidas()
        ]);

        // Adaptando dados da API para o formato que o front espera
        state.competitors = adaptCompetitors(alunos);
        state.teams = adaptTeams(equipes);
        state.games = adaptGames(modalidades);
        state.matches = adaptMatches(partidas);

        console.log("✅ Dados carregados com sucesso da API!");
        saveState(); // salva no localStorage como backup

    } catch (error) {
        console.error("❌ Erro ao conectar com a API:", error);
        alert("Não foi possível conectar com a API.\nVerifique se o servidor está rodando em http://localhost:3000");
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

// ==================== RENDERING FUNCTIONS ====================
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
    const finishedMatches = state.matches.filter(m => m.status === 'finished').length;
    const scheduledMatches = state.matches.filter(m => m.status === 'scheduled').length;

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
        <div class="card">
            <span class="card-tag">Encerrados</span>
            <h3>${finishedMatches}</h3>
            <p class="subtitle">Resultados</p>
        </div>
        <div class="card">
            <span class="card-tag">Pendentes</span>
            <h3>${scheduledMatches}</h3>
            <p class="subtitle">Agendamentos</p>
        </div>
    `;

    const upcoming = state.matches.filter(m => m.status === 'scheduled').slice(0, 3);
    upcomingContainer.innerHTML = upcoming.map(m => {
        const game = state.games.find(g => g.id == m.gameId);
        const t1 = state.teams.find(t => t.id == m.team1Id);
        const t2 = state.teams.find(t => t.id == m.team2Id);
        return `
            <div class="card">
                <span class="card-tag">${game?.name || 'Jogo'}</span>
                <div class="match-card">
                    <div class="team-score"><strong>${t1?.name || 'TBD'}</strong></div>
                    <div class="vs">VS</div>
                    <div class="team-score"><strong>${t2?.name || 'TBD'}</strong></div>
                </div>
            </div>
        `;
    }).join('');
}

function renderJogos() {
    const list = document.getElementById('list-jogos');
    list.innerHTML = state.games.map(g => `
        <div class="card">
            <span class="card-tag">${g.genre}</span>
            <h3>${g.name}</h3>
            <p class="subtitle">ID: ${g.id}</p>
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
        const dateStr = new Date(m.date).toLocaleString('pt-BR');
        
        return `
            <div class="card">
                <span class="card-tag">${game?.name || 'Jogo'} | ${dateStr}</span>
                <div class="match-card">
                    <div class="team-score">
                        <strong>${t1?.name || '???'}</strong>
                        <div class="score">${m.score1}</div>
                    </div>
                    <div class="vs">VS</div>
                    <div class="team-score">
                        <strong>${t2?.name || '???'}</strong>
                        <div class="score">${m.score2}</div>
                    </div>
                </div>
                <div style="margin-top: 1rem; text-align: center;">
                    <span class="card-tag" style="background: ${m.status === 'finished' ? '#10b981' : '#f59e0b'}">
                        ${m.status === 'finished' ? 'FINALIZADO' : 'AGENDADO'}
                    </span>
                    ${m.status === 'scheduled' ? `<button onclick="finishMatch(${m.id})" style="padding: 4px 8px; font-size: 0.7rem; margin-left: 8px;">Finalizar</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ==================== MODAL E FORMULÁRIOS (mantido igual) ====================
const modal = document.getElementById('modal-container');
const formContent = document.getElementById('form-content');

function showForm(type) { ... }     // (mantive igual ao seu código original)
function closeModal() { ... }
function saveItem(event, collection) { ... }
function finishMatch(id) { ... }

// ==================== FUNÇÕES AUXILIARES (mantidas) ====================