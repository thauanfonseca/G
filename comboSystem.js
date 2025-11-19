// comboSystem.js – Sistema de Combos com Multiplicadores

class ComboSystem {
  constructor() {
    this.comboChain = [];
    this.lastHitTime = 0;
    this.comboWindow = 1.5; // segundos
    this.currentMultiplier = 1;
    this.activeCombo = null;
    this.displayMultiplier = 1;
  }

  recordHit(damage) {
    const now = performance.now();

    // Reset se janela expirou
    if (now - this.lastHitTime > this.comboWindow * 1000) {
      this.comboChain = [];
    }

    this.comboChain.push({
      damage: damage,
      time: now
    });

    this.lastHitTime = now;

    // Detectar combo
    this.detectCombo();

    return this.comboChain.length;
  }

  detectCombo() {
    const hitCount = this.comboChain.length;

    const combos = {
      2: { name: 'Golpe Duplo', multiplier: 1.3, sfx: 'combo_2' },
      3: { name: 'Golpe Triplo', multiplier: 1.8, sfx: 'combo_3' },
      4: { name: 'Corte Giratório', multiplier: 2.2, sfx: 'combo_4' },
      5: { name: 'Ruptura Elemental', multiplier: 2.5, sfx: 'combo_5' }
    };

    if (combos[hitCount]) {
      this.activeCombo = combos[hitCount];
      this.currentMultiplier = combos[hitCount].multiplier;
      this.displayMultiplier = combos[hitCount].multiplier;

      // Audio
      if (typeof audioManager !== 'undefined') {
        audioManager.play(combos[hitCount].sfx);
      }

      // Reset após animação
      setTimeout(() => {
        this.currentMultiplier = 1;
      }, 500);
    }
  }

  getMultiplier() {
    return this.currentMultiplier;
  }

  reset() {
    this.comboChain = [];
    this.currentMultiplier = 1;
    this.activeCombo = null;
  }

  render(ctx, x, y) {
    if (this.activeCombo) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Combo: ${this.comboChain.length}x`, x, y);

      // Barra de progresso da janela
      const timeElapsed = performance.now() - this.lastHitTime;
      const progress = Math.max(0, 1 - (timeElapsed / (this.comboWindow * 1000)));

      ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.fillRect(x, y + 10, progress * 150, 4);
      ctx.strokeStyle = '#FFD700';
      ctx.strokeRect(x, y + 10, 150, 4);
    }
  }
}
