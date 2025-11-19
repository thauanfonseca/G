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
    // BALANCEAMENTO: Ajuste suave na curva de dificuldade
    // HP sobe 15% por nível (era 20%)
    let hpMult = 1 + (difficultyLevel * 0.15); 
    // Dano sobe 8% por nível (era 10%)
    let dmgMult = 1 + (difficultyLevel * 0.08); 
    
    let scale = 1.0 + (difficultyLevel * 0.02);
    let xpMult = 1;

    if (isBoss) {
      hpMult *= 6.0; dmgMult *= 1.4; scale = 4.0; xpMult = 100;
    } else if (isMiniBoss) {
      hpMult *= 3.5; dmgMult *= 1.2; scale = 2.5; xpMult = 20;
    }

    const finalHp = Math.floor(enemyData.hp * hpMult);

    // Arma aleatória para inimigos de nível alto
    let weaponType = 'melee';
    if (difficultyLevel >= 5 && !enemyData.id.includes('wolf') && !enemyData.id.includes('scorpion')) {
      const weapons = ['sword', 'axe', 'bow', 'staff'];
      weaponType = weapons[Math.floor(Math.random() * weapons.length)];
    } else {
       // Monstros usam suas armas naturais
       weaponType = 'melee';
    }

    return {
      ...enemyData,
      level: difficultyLevel,
      currentHp: finalHp, maxHp: finalHp,
      damage: Math.floor(enemyData.damage * dmgMult),
      defense: (enemyData.defense || 0) + Math.floor(difficultyLevel / 2),
      x: 0, y: 0,
      speed: (50 + Math.random() * 30) * (isBoss ? 0.5 : 1),
      justHit: false, lastAttack: 0, lastShot: 0,
      isBoss: isBoss, isMiniBoss: isMiniBoss,
      scale: scale,
      baseXp: enemyData.xpReward * xpMult,
      weapon: weaponType
    };
  }

  calculateXpGain(enemy) {
    const diff = (enemy.level || 1) - this.player.level;
    // Dá mais XP se o inimigo for mais forte
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
      // Curva de XP mais íngreme
      this.player.expToNextLevel = Math.floor(this.player.expToNextLevel * 1.4);
      
      // BALANCEAMENTO: Buff nos stats do player
      this.player.maxHp += 50; // Ganha mais vida (era 30)
      this.player.currentHp = this.player.maxHp; // Cura ao upar
      this.player.damage += 8; // Ganha mais dano (era 5)
      this.player.defense += 3; // Ganha defesa (era 2)
      
      leveled = true;
    }
    return leveled;
  }
}

const gameEngine = new GameEngine();