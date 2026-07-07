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

// Team ID uit URL halen
function getTeamIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// Team pagina vullen
async function loadTeamPage() {
    const teamId = getTeamIdFromURL();
    
    if (!teamId) {
        document.getElementById('team-banner').innerHTML = '<p>Team niet gevonden</p>';
        return;
    }

    const teams = await loadJSON('teams.json');
    const league = await loadJSON('league.json');
    const players = await loadJSON('players.json');

    if (!teams || !league) return;

    // Team vinden
    const team = teams.teams.find(t => t.id === teamId);
    if (!team) {
        document.getElementById('team-banner').innerHTML = '<p>Team niet gevonden</p>';
        return;
    }

    // Team banner
    document.getElementById('team-banner').innerHTML = `
        <div style="color: white; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚽</div>
            <h1>${team.name}</h1>
        </div>
    `;
    document.getElementById('team-banner').style.backgroundColor = team.color;
    document.title = `${team.name} - Seizoensballen`;

    // Team info
    const leaguePosition = league.standings.find(t => t.teamId === teamId);
    const positionInfo = leaguePosition ? `
        <p><strong>Positie in competitie:</strong> #${leaguePosition.position}</p>
        <p><strong>Punten:</strong> ${leaguePosition.points}</p>
        <p><strong>Doelsaldo:</strong> ${leaguePosition.goalsDifference > 0 ? '+' : ''}${leaguePosition.goalsDifference}</p>
    ` : '<p><em>Dit team speelt niet in de competitie</em></p>';

    document.getElementById('team-info').innerHTML = `
        <h2>${team.name}</h2>
        <p><strong>Stadium:</strong> ${team.stadium}</p>
        <p><strong>Opgericht:</strong> ${team.founded}</p>
        <p><strong>Beschrijving:</strong> ${team.description}</p>
        ${positionInfo}
    `;

    // Team stats
    const teamPlayers = players.players[teamId] || [];
    const totalGoals = teamPlayers.reduce((sum, p) => sum + p.goals, 0);
    const totalAssists = teamPlayers.reduce((sum, p) => sum + p.assists, 0);

    document.getElementById('team-stats').innerHTML = `
        <div class="stat-box">
            <h3>Doelpunten</h3>
            <div class="value">${totalGoals}</div>
        </div>
        <div class="stat-box">
            <h3>Assists</h3>
            <div class="value">${totalAssists}</div>
        </div>
        <div class="stat-box">
            <h3>Spelers</h3>
            <div class="value">${teamPlayers.length}</div>
        </div>
        <div class="stat-box">
            <h3>Kleur</h3>
            <div style="width: 100%; height: 40px; border-radius: 4px; background-color: ${team.color};"></div>
        </div>
    `;

    // Spelaars lijst
    let playersHTML = '';
    if (teamPlayers.length === 0) {
        playersHTML = '<p><em>Geen spelaars geregistreerd</em></p>';
    } else {
        teamPlayers.forEach(player => {
            playersHTML += `
                <div class="player-card">
                    <div class="player-number">${player.number}</div>
                    <h3>${player.name}</h3>
                    <div class="player-position">${player.position}</div>
                    <div class="player-stats">
                        <div class="player-stat">
                            <span>⚽ Doelpunten</span>
                            <span>${player.goals}</span>
                        </div>
                        <div class="player-stat">
                            <span>🎯 Assists</span>
                            <span>${player.assists}</span>
                        </div>
                        <div class="player-stat">
                            <span>🟨 Geel</span>
                            <span class="card-yellow">${player.yellowCards}</span>
                        </div>
                        <div class="player-stat">
                            <span>🔴 Rood</span>
                            <span class="card-red">${player.redCards}</span>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    document.getElementById('players-list').innerHTML = playersHTML;
}

// Laden bij pagina open
document.addEventListener('DOMContentLoaded', loadTeamPage);
