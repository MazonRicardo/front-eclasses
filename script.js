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

// ==================== CARREGAR DA API ====================
async function loadInitialData() {
    try {
        console.log("🔄 Carregando dados da API...");

        const [alunos, equipes, modalidades, partidas] = await Promise.all([
            getAlunos(),
            getEquipes(),
            getModalidades(),
            getPartidas()
        ]);

        state.competitors = adaptCompetitors(alunos);
        state.teams = adaptTeams(equipes);
        state.games = adaptGames(modalidades);
        state.matches = adaptMatches(partidas);

        console.log("✅ Dados carregados da API com sucesso!");
        saveState();

    } catch (error) {
        console.error("❌ Erro ao conectar com a API:", error);
        alert("Não foi possível conectar com a API. Verifique se o servidor está rodando.");
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
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');
}

// ==================== RENDER ====================
function renderAll() {
    renderDashboard();
    renderJogos();
    renderTimes();
    renderCompetidores();
    renderConfrontos();
}

// (As funções renderDashboard, renderJogos, renderTimes, etc. permanecem iguais às suas)

function renderDashboard() { /* seu código original */ }
function renderJogos() { /* seu código original */ }
function renderTimes() { /* seu código original */ }
function renderCompetidores() { /* seu código original */ }
function renderConfrontos() { /* seu código original */ }

// ==================== MODAL (mantenha suas funções) ====================
const modal = document.getElementById('modal-container');
const formContent = document.getElementById('form-content');

function showForm(type) { /* seu código original */ }
function closeModal() { /* seu código original */ }
function saveItem(event, collection) { /* seu código original */ }
function finishMatch(id) { /* seu código original */ }