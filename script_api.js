// ==================== CONFIGURAÇÃO API ====================
const API_URL = 'http://localhost:3000';

// Funções de busca na API
async function getAlunos() {
    const res = await fetch(`${API_URL}/alunos`);
    return await res.json();
}

async function getEquipes() {
    const res = await fetch(`${API_URL}/equipes`);
    return await res.json();
}

async function getModalidades() {
    const res = await fetch(`${API_URL}/modalidades`);
    return await res.json();
}

async function getPartidas() {
    const res = await fetch(`${API_URL}/partidas`);
    return await res.json();
}

// ==================== ADAPTADORES (Mapping) ====================

// Converte dados da API para o formato que seu front espera
function adaptCompetitors(alunos) {
    return alunos.map(a => ({
        id: a.id_aluno,
        name: a.nome,
        nickname: a.nick,
        teamId: a.id_equipe
    }));
}

function adaptTeams(equipes) {
    return equipes.map(e => ({
        id: e.id_equipe,
        name: e.nome_equipe,
        color: "#6366f1"   // cor padrão (pode melhorar depois)
    }));
}

function adaptGames(modalidades) {
    return modalidades.map(m => ({
        id: m.id_modalidade,
        name: m.nome_jogo,
        genre: "Competitivo"   // valor padrão
    }));
}

function adaptMatches(partidas) {
    return partidas.map(p => ({
        id: p.id_partida,
        gameId: p.id_modalidade,
        team1Id: p.id_equipe1,
        team2Id: p.id_equipe2,
        date: new Date(p.data_hora_inicio).toISOString(),
        score1: 0,
        score2: 0,
        status: "scheduled"
    }));
}