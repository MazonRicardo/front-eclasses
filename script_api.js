// Função para obter uma foto aleatória de gato
async function getRandomCatImage() {
    try {
        const response = await fetch('https://cataas.com/cat?json=true'); // GET
        const data = await response.json(); // Converte resposta em JSON
        return 'https://cataas.com' + data.url; // Retorna URL completa
    } catch (error) {
        console.error("Erro ao buscar a imagem do gato:", error);
        return 'https://cataas.com/cat/cute'; // fallback caso dê erro
    }
}

// Função para renderizar competidores com fotos de gatos
async function renderCompetidores() {
    const list = document.getElementById('list-competidores');
    list.innerHTML = ''; // Limpa antes de renderizar

    for (const c of state.competitors) {
        const team = state.teams.find(t => t.id == c.teamId);
        const catImage = await getRandomCatImage(); // Busca imagem aleatória do gato

        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <span class="card-tag">${team?.name || 'Sem Time'}</span>
            <img src="${catImage}" alt="Gato do ${c.nickname}" style="width:100%; border-radius: 8px; margin-bottom: 8px;">
            <h3>${c.nickname}</h3>
            <p class="subtitle">${c.name}</p>
        `;
        list.appendChild(div);
    }
}

// Atualize renderAll para usar await no renderCompetidores
async function renderAll() {
    renderDashboard();
    renderJogos();
    renderTimes();
    await renderCompetidores(); // Espera imagens dos gatos
    renderConfrontos();
}