// abilities.js – Habilidades Especiais Corrigidas

class AbilitySystem {
  constructor(player) {
    this.player = player;
    this.abilityData = this.getClassAbilities();
    this.cooldownEnd = 0;
    this.isActive = false;
  }

  getClassAbilities() {
    const classId = this.player.class.id;

    return {
      'cavaleiro': {
        name: 'Golpe do Escudo',
        cooldown: 8000,
        duration: 3000,
        description: 'Escudo + Repulsão',
        effect: (game) => {
          this.player.shieldPoints = Math.floor(this.player.maxHp * 0.3);
          this.player.shieldActive = true;
          game.showFloatingText('🛡️ BLOCK!', this.player.x, this.player.y - 50, '#FFD700');
          
          // Empurra inimigos próximos
          game.gameObjects.forEach(e => {
              const dist = Math.hypot(this.player.x - e.x, this.player.y - e.y);
              if(dist < 100) {
                  e.x += (e.x - this.player.x) * 2; // Knockback
                  e.y += (e.y - this.player.y) * 2;
              }
          });

          if (typeof audioManager !== 'undefined') audioManager.play('ability_cavaleiro');
          setTimeout(() => { this.player.shieldActive = false; }, 3000);
        }
      },

      'ladino': {
        name: 'Ataque Fantasma',
        cooldown: 5000,
        duration: 500,
        description: 'Teleporte e Dano',
        effect: (game) => {
          // Teleporta para o inimigo mais próximo ou avança
          let target = null;
          let minDist = 400;
          
          game.gameObjects.forEach(e => {
              const d = Math.hypot(this.player.x - e.x, this.player.y - e.y);
              if(d < minDist) { minDist = d; target = e; }
          });

          if(target) {
              this.player.x = target.x; 
              this.player.y = target.y; // Teleporte
              target.currentHp -= this.player.damage * 3;
              game.showFloatingText('CRITICAL!', target.x, target.y - 40, '#ff0000');
          } else {
              // Se não tem inimigo, dash para frente
              const dx = this.player.facing ? this.player.facing.x : 1;
              const dy = this.player.facing ? this.player.facing.y : 0;
              this.player.x += dx * 150;
              this.player.y += dy * 150;
          }
          
          if (typeof audioManager !== 'undefined') audioManager.play('ability_ladino');
        }
      },

      'berserker': {
        name: 'Fúria de Sangue',
        cooldown: 10000,
        duration: 5000,
        description: 'Dano Duplo por 5s',
        effect: (game) => {
          this.player.damage *= 2;
          this.player.color = '#ff0000'; // Muda cor visualmente
          game.showFloatingText('🔥 FÚRIA!', this.player.x, this.player.y - 50, '#FF4444');
          
          if (typeof audioManager !== 'undefined') audioManager.play('ability_berserker');
          
          setTimeout(() => {
             this.player.damage /= 2;
             this.player.color = null; // Restaura
          }, 5000);
        }
      },

      'arqueiro': {
        name: 'Chuva de Flechas',
        cooldown: 6000,
        duration: 800,
        description: 'Dispara 8 flechas',
        effect: (game) => {
            // Atira em círculo
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                game.projectiles.push({
                    type: 'projectile', fromPlayer: true,
                    x: this.player.x, y: this.player.y,
                    vx: Math.cos(angle) * 400,
                    vy: Math.sin(angle) * 400,
                    life: 1.5, color: '#27ae60', style: 'arrow'
                });
            }
            game.showFloatingText('🏹 CHUVA!', this.player.x, this.player.y - 50, '#27ae60');
            if (typeof audioManager !== 'undefined') audioManager.play('ability_arqueiro');
        }
      },

      'arcanista': {
        name: 'Nova Arcana',
        cooldown: 8000,
        duration: 500,
        description: 'Explosão em área',
        effect: (game) => {
            // Cria onda de choque visual
            for(let i=0; i<20; i++) {
                const angle = Math.random() * Math.PI * 2;
                game.projectiles.push({
                    type: 'projectile', fromPlayer: true,
                    x: this.player.x, y: this.player.y,
                    vx: Math.cos(angle) * 600,
                    vy: Math.sin(angle) * 600,
                    life: 0.5, color: '#9b59b6', style: 'magic'
                });
            }
            
            // Dano em área
            let hit = false;
            game.gameObjects.forEach(e => {
                const dist = Math.hypot(e.x - this.player.x, e.y - this.player.y);
                if (dist < 250) {
                    e.currentHp -= this.player.damage * 2.5;
                    game.showFloatingText('BOOM!', e.x, e.y-40, '#9370DB');
                    hit = true;
                }
            });

            if (typeof audioManager !== 'undefined') audioManager.play('ability_arcanista');
        }
      },

      'druida': {
        name: 'Benção da Natureza',
        cooldown: 12000,
        duration: 800,
        description: 'Cura + Raízes',
        effect: (game) => {
          const heal = Math.floor(this.player.maxHp * 0.4);
          this.player.currentHp = Math.min(this.player.currentHp + heal, this.player.maxHp);
          
          game.showFloatingText(`✨ +${heal} HP`, this.player.x, this.player.y - 50, '#00b894');
          
          // Imobiliza inimigos (simulado com velocidade 0 temporaria)
          game.gameObjects.forEach(e => {
             if(Math.hypot(e.x-this.player.x, e.y-this.player.y) < 300) {
                 const oldSpeed = e.speed;
                 e.speed = 0;
                 setTimeout(()=>e.speed = oldSpeed, 2000);
             }
          });

          if (typeof audioManager !== 'undefined') audioManager.play('ability_druida');
        }
      }
    }[classId];
  }

  canUseAbility() { return performance.now() >= this.cooldownEnd; }
  
  getCooldownRemaining() {
    const remaining = Math.max(0, this.cooldownEnd - performance.now());
    return Math.ceil(remaining / 1000);
  }
  
  useAbility(game) {
    if (!this.abilityData || !this.canUseAbility()) return false;
    
    this.abilityData.effect(game);
    this.cooldownEnd = performance.now() + this.abilityData.cooldown;
    return true;
  }

  renderCooldown(ctx, x, y, size = 40) {
    if (!this.abilityData) return;
    
    if (!this.canUseAbility()) {
      const remaining = this.getCooldownRemaining();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font='bold 14px Arial'; ctx.textAlign='center';
      ctx.fillText(remaining, x, y+5);
    } else {
      ctx.fillStyle = '#00b894';
      ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI*2); ctx.fill(); // Indicador verde de pronto
      ctx.fillStyle = '#fff'; ctx.font='10px Arial';
      ctx.fillText("Q", x, y+4);
    }
  }
}