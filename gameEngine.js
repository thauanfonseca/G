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
    let hpMult = 1 + (difficultyLevel * 0.2);
    let dmgMult = 1 + (difficultyLevel * 0.1);
    let scale = 1.0 + (difficultyLevel * 0.05);
    let xpMult = 1;
    if (isBoss) {
      hpMult *= 5.0; dmgMult *= 1.5; scale = 5.0; xpMult = 50;
    } else if (isMiniBoss) {
      hpMult *= 3.0; dmgMult *= 1.2; scale = 3.0; xpMult = 10;
    }

    const finalHp = Math.floor(enemyData.hp * hpMult);

    // Define aleatoriamente uma arma para inimigos de nível alto (7+)
    let weaponType = 'melee';
    if (difficultyLevel >= 7 && !enemyData.id.includes('wolf')) {
      const weapons = ['sword', 'axe', 'bow', 'staff'];
      weaponType = weapons[Math.floor(Math.random() * weapons.length)];
    }

    return {
      ...enemyData,
      level: difficultyLevel,
      currentHp: finalHp, maxHp: finalHp,
      damage: Math.floor(enemyData.damage * dmgMult),
      defense: (enemyData.defense || 0) + Math.floor(difficultyLevel / 3),
      x: 0, y: 0,
      speed: (50 + Math.random() * 30) * (isBoss ? 0.4 : 1),
      justHit: false, lastAttack: 0, lastShot: 0,
      isBoss: isBoss, isMiniBoss: isMiniBoss,
      scale: scale,
      baseXp: enemyData.xpReward * xpMult,
      weapon: weaponType
    };
  }

  calculateXpGain(enemy) {
    const diff = (enemy.level || 1) - this.player.level;
    let multiplier = diff < 0 ? Math.max(0.1, 1 + diff*0.1) : 1 + diff*0.2;
    return Math.floor(enemy.baseXp * multiplier);
  }

  playerAttack(target) {
    // Garante dano mínimo de 1
    const dmg = Math.max(1, this.player.damage - (target.defense || 0));
    target.currentHp -= dmg;
    target.justHit = true;
    setTimeout(() => target.justHit = false, 200);
    return { damage: dmg };
  }

  enemyAttack(enemy) {
    const dmg = Math.max(1, enemy.damage - this.player.defense);
    this.player.currentHp -= dmg;
    this.player.justHit = true;
    setTimeout(() => this.player.justHit = false, 300);
    const overlay = document.getElementById('damage-overlay');
    if(overlay) { overlay.style.opacity = 1; setTimeout(() => overlay.style.opacity = 0, 200); }
    return { damage: dmg };
  }

  gainExp(amount) {
    this.player.exp += amount;
    let leveled = false;
    while (this.player.exp >= this.player.expToNextLevel) {
      this.player.exp -= this.player.expToNextLevel;
      this.player.level++;
      this.player.expToNextLevel = Math.floor(this.player.expToNextLevel * 1.5);
      this.player.maxHp += 30; this.player.currentHp = this.player.maxHp;
      this.player.damage += 5; this.player.defense += 2;
      leveled = true;
    }
    return leveled;
  }

}

// CORREÇÃO: Instanciar globalmente para que outros scripts possam usar 'gameEngine'
const gameEngine = new GameEngine();