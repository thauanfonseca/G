// leaderboardSystem.js – Sistema de Leaderboard Top 10

class LeaderboardSystem {
  static KEY = 'elandor_leaderboard';
  static MAX_ENTRIES = 10;

  static calculateScore(player, stats) {
    return (
      (stats.totalEnemiesDefeated * 100) +
      (player.level * 500) +
      (stats.totalDamageDealt * 0.5) +
      (stats.longestKillStreak * 50)
    );
  }

  static addScore(playerName, classId, player, stats) {
    const score = this.calculateScore(player, stats);

    const entry = {
      rank: 0, // será calculado
      name: playerName || 'Anônimo',
      class: classId,
      score: Math.floor(score),
      level: player.level,
      kills: stats.totalEnemiesDefeated,
      damage: Math.floor(stats.totalDamageDealt),
      playtime: Math.floor(stats.totalPlaytime / 1000),
      date: new Date().toISOString(),
      platform: 'local'
    };

    let leaderboard = this.loadLeaderboard();
    leaderboard.push(entry);
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, this.MAX_ENTRIES);

    // Adicionar ranking
    leaderboard.forEach((e, i) => e.rank = i + 1);

    try {
      localStorage.setItem(this.KEY, JSON.stringify(leaderboard));
      console.log('✅ Score added to leaderboard');
      return leaderboard;
    } catch (e) {
      console.error('❌ Erro ao salvar leaderboard:', e);
      return null;
    }
  }

  static loadLeaderboard() {
    try {
      const json = localStorage.getItem(this.KEY);
      return json ? JSON.parse(json) : [];
    } catch (e) {
      console.error('❌ Erro ao carregar leaderboard:', e);
      return [];
    }
  }

  static getPosition(score) {
    const leaderboard = this.loadLeaderboard();
    let position = leaderboard.length + 1;

    for (let i = 0; i < leaderboard.length; i++) {
      if (score > leaderboard[i].score) {
        position = i + 1;
        break;
      }
    }

    return position;
  }

  static getClassIcon(classId) {
    const classData = GAME_DATA.classes.find(c => c.id === classId);
    return classData ? classData.icon : '❓';
  }

  static getClassName(classId) {
    const classData = GAME_DATA.classes.find(c => c.id === classId);
    return classData ? classData.name : 'Desconhecido';
  }

  static renderLeaderboard() {
    const leaderboard = this.loadLeaderboard();

    let html = `
      <div id="leaderboard-modal" class="leaderboard-modal">
        <div class="leaderboard-container">
          <h2>⭐ TOP 10 JOGADORES</h2>
          <table class="leaderboard-table">
            <thead>
              <tr class="header">
                <th>Pos</th>
                <th>Nome</th>
                <th>Classe</th>
                <th>Pontos</th>
                <th>Nível</th>
                <th>Kills</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
    `;

    if (leaderboard.length === 0) {
      html += `<tr><td colspan="7" style="text-align:center;">Nenhuma pontuação registrada</td></tr>`;
    } else {
      leaderboard.forEach((entry) => {
        const date = new Date(entry.date);
        const dateStr = date.toLocaleDateString('pt-BR');
        const classIcon = this.getClassIcon(entry.class);

        html += `
          <tr class="rank-${entry.rank}">
            <td><strong>${entry.rank}º</strong></td>
            <td>${entry.name}</td>
            <td>${classIcon}</td>
            <td><strong>${entry.score.toLocaleString('pt-BR')}</strong></td>
            <td>${entry.level}</td>
            <td>${entry.kills}</td>
            <td>${dateStr}</td>
          </tr>
        `;
      });
    }

    html += `
            </tbody>
          </table>
          <button id="close-leaderboard" class="btn btn--primary" onclick="closeLeaderboard()">Fechar</button>
        </div>
      </div>
    `;

    return html;
  }

  static renderInlineLeaderboard(limit = 5) {
    const leaderboard = this.loadLeaderboard().slice(0, limit);

    let html = '<div class="leaderboard-inline"><h3>🏆 Top 5</h3><ul>';

    leaderboard.forEach((entry) => {
      html += `<li><strong>${entry.rank}.</strong> ${entry.name} - ${entry.score} pts</li>`;
    });

    html += '</ul></div>';
    return html;
  }

  static clearLeaderboard() {
    try {
      localStorage.removeItem(this.KEY);
      console.log('✅ Leaderboard cleared');
      return true;
    } catch (e) {
      console.error('❌ Erro ao limpar leaderboard:', e);
      return false;
    }
  }

  static exportLeaderboard() {
    const leaderboard = this.loadLeaderboard();
    const blob = new Blob([JSON.stringify(leaderboard, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elandor_leaderboard_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Função global para fechar modal
function closeLeaderboard() {
  const modal = document.getElementById('leaderboard-modal');
  if (modal) modal.remove();
}

// Função global para mostrar leaderboard
function showLeaderboard() {
  const existing = document.getElementById('leaderboard-modal');
  if (existing) existing.remove();

  document.body.innerHTML += LeaderboardSystem.renderLeaderboard();

  // Estilo para o modal
  const style = document.createElement('style');
  style.textContent = `
    .leaderboard-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .leaderboard-container {
      background: linear-gradient(135deg, #2d3436, #1e272e);
      border: 2px solid #00b894;
      border-radius: 12px;
      padding: 30px;
      max-width: 900px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      color: #dfe6e9;
      box-shadow: 0 0 20px rgba(0, 184, 148, 0.3);
    }
    .leaderboard-table th {
      background: rgba(0, 184, 148, 0.2);
      border-bottom: 2px solid #00b894;
      padding: 12px;
      text-align: left;
      color: #00cec9;
    }
    .leaderboard-table td {
      padding: 10px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .leaderboard-table tr:hover {
      background: rgba(0, 184, 148, 0.1);
    }
    .rank-1 { background: rgba(255, 215, 0, 0.1); }
    .rank-2 { background: rgba(192, 192, 192, 0.1); }
    .rank-3 { background: rgba(205, 127, 50, 0.1); }
  `;
  document.head.appendChild(style);
}
