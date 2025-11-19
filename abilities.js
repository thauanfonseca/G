// abilities.js – Habilidades Especiais por Classe

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
        description: 'Absorve 30% de HP como escudo por 3s',
        effect: (game) => {
          this.player.shieldPoints = Math.floor(this.player.maxHp * 0.3);
          this.player.shieldActive = true;
          game.floatingTexts.push({
            x: this.player.x,
            y: this.player.y - 80,
            text: '🛡️ ESCUDO!',
            color: '#FFD700',
            time: 1,
            maxTime: 1
          });
          if (typeof audioManager !== 'undefined') audioManager.play('ability_cavaleiro');
          setTimeout(() => {
            this.player.shieldActive = false;
          }, 3000);
        }
      },

      'ladino': {
        name: 'Ataque Fulminante',
        cooldown: 6000,
        duration: 1500,
        description: '3 ataques rápidos em sequência',
        effect: (game) => {
          let hitCount = 0;
          const hitInterval = setInterval(() => {
            // Verificação de segurança
            if (!game || !gameEngine || !gameEngine.player) {
              clearInterval(hitInterval);
              return;
            }
            hitCount++;
            
            // CORREÇÃO: Usar game.gameObjects em vez de criar array vazio
            const enemies = game.gameObjects || [];
            
            if (enemies.length > 0) {
              // Filtra apenas inimigos vivos e próximos (opcional, aqui pega aleatório do mapa)
              const target = enemies[Math.floor(Math.random() * enemies.length)];
              
              // CORREÇÃO: Usar playerAttack diretamente (playerAttackDamage não existia)
              gameEngine.playerAttack(target);
              
              // Efeito visual no inimigo
              game.floatingTexts.push({
                x: target.x,
                y: target.y - 40,
                text: '⚡ HIT!',
                color: '#FFD700',
                time: 0.5,
                maxTime: 0.5
              });
            } else {
              // Efeito visual no player se não houver inimigos
              game.floatingTexts.push({
                x: this.player.x + (Math.random() - 0.5) * 40,
                y: this.player.y - 40,
                text: '⚡ VOSH!',
                color: '#FFF',
                time: 0.5,
                maxTime: 0.5
              });
            }

            if (typeof audioManager !== 'undefined') audioManager.play('ability_ladino');
            
            if (hitCount >= 3) {
              clearInterval(hitInterval);
            }
          }, 400);
        }
      },

      'berserker': {
        name: 'Fúria Vermelha',
        cooldown: 10000,
        duration: 5000,
        description: '+50% dano por 5s, -20% defesa',
        effect: (game) => {
          this.player.berserkMode = true;
          this.player.damageMultiplier = 1.5;
          this.player.defenseMultiplier = 0.8;
          game.floatingTexts.push({
            x: this.player.x,
            y: this.player.y - 80,
            text: '🔥 FÚRIA!',
            color: '#FF4444',
            time: 1,
            maxTime: 1
          });
          if (typeof audioManager !== 'undefined') audioManager.play('ability_berserker');
          setTimeout(() => {
            this.player.berserkMode = false;
            this.player.damageMultiplier = 1;
            this.player.defenseMultiplier = 1;
          }, 5000);
        }
      },

      'arqueiro': {
        name: 'Chuva de Flechas',
        cooldown: 7000,
        duration: 800,
        description: 'Dispara 8 flechas em leque',
        effect: (game) => {
          if (!game || !game.projectiles) return;
          
          // Tenta mirar no primeiro inimigo, ou atira para frente
          let targetX = this.player.x + 100;
          let targetY = this.player.y;
          
          if (game.gameObjects && game.gameObjects.length > 0) {
             targetX = game.gameObjects[0].x;
             targetY = game.gameObjects[0].y;
          }

          const baseAngle = Math.atan2(targetY - this.player.y, targetX - this.player.x);
            
          for (let i = 0; i < 8; i++) {
            const angle = baseAngle + (i - 3.5) * (Math.PI / 6);
            game.projectiles.push({
              x: this.player.x,
              y: this.player.y,
              vx: Math.cos(angle) * 400,
              vy: Math.sin(angle) * 400,
              damage: Math.floor(this.player.damage * 0.9),
              life: 2,
              fromPlayer: true,
              style: 'arrow'
            });
          }
          game.floatingTexts.push({
            x: this.player.x,
            y: this.player.y - 80,
            text: '🏹 CHUVA!',
            color: '#27ae60',
            time: 1,
            maxTime: 1
          });
          if (typeof audioManager !== 'undefined') audioManager.play('ability_arqueiro');
        }
      },

      'arcanista': {
        name: 'Explosão Arcana',
        cooldown: 9000,
        duration: 500,
        description: 'Explode energia em área, 2x dano',
        effect: (game) => {
          if (!game || !game.gameObjects) return;
          let damaged = 0;
          const enemies = game.gameObjects;
          for (let enemy of enemies) {
            const dist = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
            if (dist < 200) {
              enemy.currentHp -= Math.floor(this.player.damage * 2);
              damaged++;
            }
          }
          game.floatingTexts.push({
            x: this.player.x,
            y: this.player.y - 80,
            text: `💥 ${damaged} HIT!`,
            color: '#9370DB',
            time: 1,
            maxTime: 1
          });
          if (typeof audioManager !== 'undefined') audioManager.play('ability_arcanista');
        }
      },

      'druida': {
        name: 'Cura da Floresta',
        cooldown: 12000,
        duration: 800,
        description: 'Restaura 40% de HP',
        effect: (game) => {
          const healAmount = Math.floor(this.player.maxHp * 0.4);
          this.player.currentHp = Math.min(
            this.player.currentHp + healAmount,
            this.player.maxHp
          );
          game.floatingTexts.push({
            x: this.player.x,
            y: this.player.y - 80,
            text: `✨ +${healAmount} HP`,
            color: '#00b894',
            time: 1.5,
            maxTime: 1.5
          });
          if (typeof audioManager !== 'undefined') audioManager.play('ability_druida');
        }
      }
    }[classId];
  }

  canUseAbility() {
    return performance.now() >= this.cooldownEnd;
  }
  getCooldownRemaining() {
    const remaining = Math.max(0, this.cooldownEnd - performance.now());
    return Math.ceil(remaining / 1000);
  }
  useAbility(game) {
    if (!this.abilityData) {
      console.warn('No ability for this class');
      return false;
    }
    if (!this.canUseAbility()) {
      const remaining = this.getCooldownRemaining();
      if (game && game.floatingTexts) {
        game.floatingTexts.push({
          x: this.player.x,
          y: this.player.y - 40,
          text: `Aguarde ${remaining}s`,
          color: '#FF4444',
          time: 0.5,
          maxTime: 0.5
        });
      }
      return false;
    }
    // Executa a ability
    this.abilityData.effect(game);
    // Inicia cooldown
    this.cooldownEnd = performance.now() + this.abilityData.cooldown;
    return true;
  }
  getAbilityInfo() {
    if (!this.abilityData) return null;
    return {
      name: this.abilityData.name,
      description: this.abilityData.description,
      cooldown: Math.ceil(this.abilityData.cooldown / 1000),
      remaining: this.getCooldownRemaining(),
      isReady: this.canUseAbility()
    };
  }
  renderCooldown(ctx, x, y, size = 40) {
    if (!this.abilityData) return;
    
    if (!this.canUseAbility()) {
      const remaining = this.getCooldownRemaining();
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.fillRect(x, y, size, size);
      const progress = 1 - ((this.cooldownEnd - performance.now()) / this.abilityData.cooldown);
      ctx.strokeStyle = '#FF4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + size/2, y + size/2, size/2 - 2, 0, Math.PI * 2 * progress);
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(remaining, x + size/2, y + size/2);
    } else {
      ctx.fillStyle = 'rgba(0, 184, 148, 0.7)';
      ctx.fillRect(x, y, size, size);
      ctx.strokeStyle = '#00b894';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, size, size);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Q', x + size/2, y + size/2);
    }
  }
}