class GameEngine {
  constructor() {
    this.player = null;
    this.enemiesDefeated = 0;
    this.biomeKills = 0;
  }

  createPlayer(classData) {
    this.player = {
      class: classData, x: 0, y: 0,
      maxHp: classData.baseHp, currentHp: classData.baseHp,
      damage: classData.baseDamage, defense: classData.baseDefense, speed: classData.baseSpeed,
      level: 1, exp: 0, expToNextLevel: 100,
      facing: { x: 0, y: 1 },
      justHit: false
    };
    this.enemiesDefeated = 0;
    this.biomeKills = 0;
  }

  createEnemy(enemyData, isBoss = false, isMiniBoss = false, difficultyLevel = 1) {
    // BALANCEAMENTO: HP sobe 10% por nível
    let hpMult = 1 + (difficultyLevel * 0.10); 
    let dmgMult = 1 + (difficultyLevel * 0.05); 
    
    // TAMANHOS REDUZIDOS
    let scale = 1.0 + (difficultyLevel * 0.01); // Escala base cresce pouco
    let xpMult = 1;

    if (isBoss) {
      hpMult *= 8.0; // Boss tem muito HP
      dmgMult *= 1.5; 
      scale = 2.2; // Boss reduzido (era 5.0)
      xpMult = 100;
    } else if (isMiniBoss) {
      hpMult *= 4.0; 
      dmgMult *= 1.2; 
      scale = 1.5; // Elite reduzido (era 3.0)
      xpMult = 20;
    }

    const finalHp = Math.floor(enemyData.hp * hpMult);

    let weaponType = enemyData.weapon || 'melee';

    return {
      ...enemyData,
      level: difficultyLevel,
      currentHp: finalHp, maxHp: finalHp,
      damage: Math.floor(enemyData.damage * dmgMult),
      defense: (enemyData.defense || 0) + Math.floor(difficultyLevel / 2),
      x: 0, y: 0,
      // Bosses são mais lentos
      speed: (enemyData.id === 'wolf' ? 90 : 55) * (isBoss ? 0.6 : 1),
      justHit: false, lastAttack: 0, lastShot: 0,
      isBoss: isBoss, isMiniBoss: isMiniBoss,
      scale: scale,
      baseXp: enemyData.xpReward * xpMult,
      weapon: weaponType
    };
  }

  calculateXpGain(enemy) {
    const diff = (enemy.level || 1) - this.player.level;
    let multiplier = diff < 0 ? Math.max(0.2, 1 + diff*0.1) : 1 + diff*0.3;
    return Math.floor(enemy.baseXp * multiplier);
  }

  playerAttack(target) {
    const dmg = Math.max(1, this.player.damage - (target.defense || 0));
    target.currentHp -= dmg;
    target.justHit = true;
    setTimeout(() => target.justHit = false, 150);
    return { damage: dmg };
  }

  enemyAttack(enemy) {
    const dmg = Math.max(1, enemy.damage - this.player.defense);
    this.player.currentHp -= dmg;
    this.player.justHit = true;
    setTimeout(() => this.player.justHit = false, 300);
    
    const overlay = document.getElementById('damage-overlay');
    if(overlay) { 
        overlay.style.opacity = 0.8; 
        setTimeout(() => overlay.style.opacity = 0, 150); 
    }
    return { damage: dmg };
  }

  gainExp(amount) {
    this.player.exp += amount;
    let leveled = false;
    while (this.player.exp >= this.player.expToNextLevel) {
      this.player.exp -= this.player.expToNextLevel;
      this.player.level++;
      this.player.expToNextLevel = Math.floor(this.player.expToNextLevel * 1.4);
      
      // Player fica mais forte
      this.player.maxHp += 40; 
      this.player.currentHp = this.player.maxHp; 
      this.player.damage += 6; 
      this.player.defense += 2; 
      
      leveled = true;
    }
    return leveled;
  }
}

const gameEngine = new GameEngine();