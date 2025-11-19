// saveSystem.js – Sistema de Save/Load Completo

class SaveSystem {
  static getSaveKey(slot = 1) {
    return `elandor_save_slot_${slot}`;
  }

  static saveGame(gameInstance, playerName, slot = 1) {
    if (!gameEngine.player) return false;

    const saveData = {
      version: "2.0",
      timestamp: Date.now(),
      playerName: playerName || 'Player',

      player: {
        classId: gameEngine.player.class.id,
        level: gameEngine.player.level,
        currentHp: gameEngine.player.currentHp,
        maxHp: gameEngine.player.maxHp,
        damage: gameEngine.player.damage,
        defense: gameEngine.player.defense,
        speed: gameEngine.player.speed,
        exp: gameEngine.player.exp,
        expToNextLevel: gameEngine.player.expToNextLevel,
        position: {
          x: gameEngine.player.x,
          y: gameEngine.player.y
        }
      },

      progress: {
        currentBiomeIndex: gameInstance.currentBiomeIndex,
        biomeKills: gameEngine.biomeKills,
        totalEnemiesDefeated: gameEngine.enemiesDefeated,
        miniBossDefeated: gameInstance.miniBossDefeated || false,
        bossesFelled: gameInstance.bossesFelled || []
      },

      stats: {
        totalPlaytime: gameInstance.totalPlaytime || 0,
        totalDamageDealt: gameInstance.totalDamageDealt || 0,
        totalDamageTaken: gameInstance.totalDamageTaken || 0,
        longestKillStreak: gameInstance.longestKillStreak || 0
      }
    };

    try {
      const json = JSON.stringify(saveData);
      localStorage.setItem(this.getSaveKey(slot), json);
      console.log(`✅ Game saved to slot ${slot}`);
      return true;
    } catch (e) {
      console.error('❌ Erro ao salvar:', e);
      return false;
    }
  }

  static loadGame(slot = 1) {
    try {
      const json = localStorage.getItem(this.getSaveKey(slot));
      if (!json) return null;

      const saveData = JSON.parse(json);

      // Validação
      if (saveData.version !== "2.0") {
        console.warn('⚠️ Versão de save incompatível');
        return null;
      }

      console.log(`✅ Save loaded from slot ${slot}`);
      return saveData;
    } catch (e) {
      console.error('❌ Erro ao carregar save:', e);
      return null;
    }
  }

  static applySave(saveData, gameInstance) {
    if (!saveData || !saveData.player) return false;

    try {
      // Restaura player stats
      const playerClass = GAME_DATA.classes.find(c => c.id === saveData.player.classId);
      if (!playerClass) return false;

      gameEngine.createPlayer(playerClass);
      gameEngine.player.level = saveData.player.level;
      gameEngine.player.currentHp = Math.min(saveData.player.currentHp, saveData.player.maxHp);
      gameEngine.player.maxHp = saveData.player.maxHp;
      gameEngine.player.damage = saveData.player.damage;
      gameEngine.player.defense = saveData.player.defense;
      gameEngine.player.speed = saveData.player.speed;
      gameEngine.player.exp = saveData.player.exp;
      gameEngine.player.expToNextLevel = saveData.player.expToNextLevel;
      gameEngine.player.x = saveData.player.position.x;
      gameEngine.player.position = saveData.player.position.y;

      gameEngine.biomeKills = saveData.progress.biomeKills;
      gameEngine.enemiesDefeated = saveData.progress.totalEnemiesDefeated;

      gameInstance.currentBiomeIndex = saveData.progress.currentBiomeIndex;
      gameInstance.miniBossDefeated = saveData.progress.miniBossDefeated;
      gameInstance.bossesFelled = saveData.progress.bossesFelled || [];

      gameInstance.totalPlaytime = saveData.stats.totalPlaytime || 0;
      gameInstance.totalDamageDealt = saveData.stats.totalDamageDealt || 0;
      gameInstance.totalDamageTaken = saveData.stats.totalDamageTaken || 0;
      gameInstance.longestKillStreak = saveData.stats.longestKillStreak || 0;

      console.log(`✅ Save applied successfully`);
      return true;
    } catch (e) {
      console.error('❌ Erro ao aplicar save:', e);
      return false;
    }
  }

  static listSaves() {
    const saves = [];
    for (let i = 1; i <= 3; i++) {
      const json = localStorage.getItem(this.getSaveKey(i));
      if (json) {
        try {
          const data = JSON.parse(json);
          const biome = GAME_DATA.biomes[data.progress.currentBiomeIndex];
          saves.push({
            slot: i,
            playerName: data.playerName,
            level: data.player.level,
            biome: biome ? biome.name : 'Desconhecido',
            timestamp: new Date(data.timestamp).toLocaleDateString('pt-BR'),
            timeString: new Date(data.timestamp).toLocaleTimeString('pt-BR')
          });
        } catch (e) {
          // Skip corrupted save
        }
      }
    }
    return saves;
  }

  static deleteSave(slot = 1) {
    try {
      localStorage.removeItem(this.getSaveKey(slot));
      console.log(`✅ Save slot ${slot} deleted`);
      return true;
    } catch (e) {
      console.error('❌ Erro ao deletar save:', e);
      return false;
    }
  }

  static exportSave(slot = 1) {
    const json = localStorage.getItem(this.getSaveKey(slot));
    if (json) {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elandor_save_${slot}_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  static importSave(file, slot = 1) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = e.target.result;
          const data = JSON.parse(json);

          if (data.version !== "2.0") {
            alert('❌ Arquivo de save inválido');
            resolve(false);
            return;
          }
          localStorage.setItem(this.getSaveKey(slot), json);
          console.log(`✅ Save imported to slot ${slot}`);
          resolve(true);
        } catch (err) {
          console.error('❌ Erro ao importar save:', err);
          alert('❌ Erro ao importar arquivo');
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  }

  static clearAllSaves() {
    for (let i = 1; i <= 3; i++) {
      this.deleteSave(i);
    }
    console.log('✅ All saves cleared');
  }
}
