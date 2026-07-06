// Configuratie
const DATA_PATH = 'https://raw.githubusercontent.com/Bekse81/Seizoensballen/main/data/';

// Data laden
async function loadJSON(filename) {
    try {
        const response = await fetch(DATA_PATH + filename);
        return await response.json();
    } catch (error) {
        console.error(`Fout bij laden ${filename}:`, error);
        return null;
    }
}

// League tabel vullen
async function loadLeague() {
    const league = await loadJSON('league.json');
    if (!league) return;

    const table = document.getElementById('league-table');
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Positie</th>
                    <th>Team</th>
                    <th>Punten</th>
                    <th>Doelsaldo</th>
                    <th>DEFA Punten</th>
                    <th>Divisie</th>
                </tr>
            </thead>
            <tbody>
    `;

    league.standings.forEach(team => {
        html += `
            <tr class="position-${team.position}">
                <td><strong>${team.position}</strong></td>
                <td>${team.teamName}</td>
                <td>${team.points}</td>
                <td>${team.goalsDifference > 0 ? '+' : ''}${team.goalsDifference}</td>
                <td>${team.defaPoints}</td>
                <td>${team.division}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    table.innerHTML = html;
}

// Cup info vullen
async function loadCup() {
    const cup = await loadJSON('cup.json');
    if (!cup) return;

    const cupInfo = document.getElementById('cup-info');
    cupInfo.innerHTML = `
        <div class="cup-winner">
            <h3>🏆 DEFA Cup Winnaar</h3>
            <div class="team-name">${cup.winner}</div>
            <p>Seizoen 330</p>
        </div>
    `;
}

// Teams grid vullen
async function loadTeams() {
    const teams = await loadJSON('teams.json');
    if (!teams) return;

    const grid = document.getElementById('teams-grid');
    let html = '';

    teams.teams.forEach(team => {
        html += `
            <div class="team-card" style="border-left-color: ${team.color}">
                <div class="team-color" style="background-color: ${team.color}"></div>
                <h3>${team.name}</h3>
                <p><strong>Stadium:</strong> ${team.stadium}</p>
                <p><strong>Opgericht:</strong> ${team.founded}</p>
                <p>${team.description}</p>
            </div>
        `;
    });

    grid.innerHTML = html;
}

// Alles laden wanneer pagina klaar is
document.addEventListener('DOMContentLoaded', () => {
    loadLeague();
    loadCup();
    loadTeams();
});
