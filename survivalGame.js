// ================== RENDERIZADOR AVANÇADO (Pixel Art Procedural) ==================
class PixelRenderer {
    static drawSprite(ctx, e, isPlayer) {
        if (!e || typeof e.x !== 'number') return;
        
        // Decorações (Árvores/Cactos)
        if (e.type === 'decoration') { 
            if (e.style === 'cactus') this.drawCactus(ctx, e);
            else this.drawTree(ctx, e); 
            return; 
        }
        
        // Projéteis
        if (e.type === 'projectile') { this.drawProjectile(ctx, e); return; }

        // Configurações Básicas
        const scale = e.scale || 1;
        const level = e.level || 1;
        const time = Date.now() / 200; // Tempo para animação
        const breathe = Math.sin(time) * 2; // Efeito de "respiração"
        
        ctx.save(); 
        ctx.translate(e.x, e.y);
        ctx.scale(scale, scale);

        // Sombra no chão
        ctx.fillStyle = 'rgba(0,0,0,0.3)'; 
        ctx.beginPath(); 
        ctx.ellipse(0, 10, 14, 6, 0, 0, Math.PI*2); 
        ctx.fill();

        // Efeitos Especiais (Auras)
        if (e.isBoss) {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, -15, 30 + breathe, 0, Math.PI*2); ctx.stroke();
        }
        if (isPlayer && e.shieldActive) {
            ctx.strokeStyle = '#00b894';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, -15, 25, 0, Math.PI*2); ctx.stroke();
        }

        // Flash de Dano (Branco)
        if (e.justHit) {
            ctx.globalAlpha = 0.7; ctx.fillStyle = '#fff';
        }

        // DESENHO DO PERSONAGEM HUMANÓIDE
        this.drawHumanoid(ctx, e, isPlayer, breathe);

        ctx.restore();

        // Barra de Vida (Inimigos)
        if (e.maxHp && !isPlayer) {
            const hpPct = Math.max(0, e.currentHp/e.maxHp);
            const yOffset = -50 * scale;
            ctx.fillStyle = '#000'; ctx.fillRect(e.x-20, e.y+yOffset, 40, 6);
            ctx.fillStyle = e.isBoss?'#e74c3c':(e.isMiniBoss?'#f1c40f':'#ff4757');
            ctx.fillRect(e.x-19, e.y+yOffset+1, 38*hpPct, 4);
            
            // Mostra Level
            ctx.fillStyle = '#fff'; 
            ctx.font = 'bold 10px Arial'; 
            ctx.textAlign = 'center';
            ctx.fillText(`Lv.${level}`, e.x, e.y+yOffset-2);
        }
    }

    static drawHumanoid(ctx, e, isPlayer, animY) {
        const color = isPlayer ? e.class.color : (e.color || '#e74c3c');
        const level = e.level || 1;
        
        // Cores Base
        const skinColor = '#ffccaa';
        const armorColor = level >= 10 ? '#ffd700' : (level >= 5 ? '#95a5a6' : color); // Ouro -> Ferro -> Pano
        const pantsColor = '#2d3436';

        // Direção do olhar
        const facingX = e.facing ? e.facing.x : (e.vx > 0 ? 1 : -1);
        
        // PERNAS (Animadas se movendo)
        const walk = Math.sin(Date.now() / 100) * 3;
        const isMoving = (Math.abs(e.vx||0) > 0.1 || Math.abs(e.vy||0) > 0.1);
        
        ctx.fillStyle = pantsColor;
        // Perna Esq
        ctx.fillRect(-6, 0, 4, 12 + (isMoving ? walk : 0));
        // Perna Dir
        ctx.fillRect(2, 0, 4, 12 - (isMoving ? walk : 0));

        // CORPO (Move com respiração)
        ctx.translate(0, -14 + animY); 
        
        // Armadura/Torso
        ctx.fillStyle = armorColor;
        ctx.fillRect(-8, 0, 16, 14);
        
        // Detalhe da armadura (cinto)
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(-8, 10, 16, 4);

        // CABEÇA
        ctx.fillStyle = skinColor;
        ctx.fillRect(-7, -12, 14, 12);

        // CAPACETE (Baseado no Nível)
        if (level >= 5) {
            ctx.fillStyle = level >= 10 ? '#ffd700' : '#7f8c8d'; // Ouro ou Ferro
            ctx.fillRect(-8, -14, 16, 6); // Topo
            ctx.fillRect(-8, -14, 4, 14); // Lado
            if(facingX < 0) ctx.fillRect(4, -14, 4, 14); // Lado oposto
        }

        // OLHOS
        ctx.fillStyle = '#000';
        // Olha para a direção do movimento/mira
        const eyeOffset = facingX > 0 ? 2 : -2;
        ctx.fillRect(-2 + eyeOffset, -8, 2, 2);
        ctx.fillRect(2 + eyeOffset, -8, 2, 2);

        // ARMA (Baseada na Classe ou Tipo)
        this.drawWeapon(ctx, e, isPlayer);
    }

    static drawWeapon(ctx, e, isPlayer) {
        ctx.save();
        const weaponType = isPlayer ? e.class.weapon : (e.weapon || 'sword');
        const level = e.level || 1;
        
        // Posiciona a arma na mão direita
        ctx.translate(10, 5); 
        
        // Rotação se estiver atacando
        if (e.justHit || (isPlayer && window.game && window.game.spacePressed)) {
            ctx.rotate(Math.sin(Date.now()/50)); 
        }

        // Estilo da arma muda com level
        const wColor = level >= 8 ? '#e1b12c' : '#bdc3c7'; // Ouro ou Ferro

        if (weaponType === 'sword' || weaponType === 'dagger') {
            ctx.fillStyle = '#5d4037'; ctx.fillRect(-2, 0, 4, 8); // Cabo
            ctx.fillStyle = wColor; ctx.fillRect(-2, -14, 4, 14); // Lâmina
            ctx.fillStyle = '#95a5a6'; ctx.fillRect(-5, -2, 10, 2); // Guarda
        } else if (weaponType === 'axe') {
            ctx.fillStyle = '#5d4037'; ctx.fillRect(-2, -10, 4, 20); // Cabo longo
            ctx.fillStyle = wColor; 
            ctx.beginPath(); ctx.arc(0, -8, 8, 0, Math.PI, true); ctx.fill(); // Lâmina curva
        } else if (weaponType === 'staff') {
            ctx.fillStyle = '#5d4037'; ctx.fillRect(-2, -15, 4, 30); // Cajado
            ctx.fillStyle = e.class ? e.class.color : '#f00'; 
            ctx.beginPath(); ctx.arc(0, -15, 5, 0, Math.PI*2); ctx.fill(); // Orbe mágica
        } else if (weaponType === 'bow') {
            ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, 0, 10, -Math.PI/2, Math.PI/2); ctx.stroke(); // Arco
            ctx.fillStyle = '#fff'; ctx.fillRect(0, -10, 1, 20); // Corda
        }

        ctx.restore();
    }

    static drawProjectile(ctx, p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        const angle = Math.atan2(p.vy, p.vx);
        ctx.rotate(angle);

        // Brilho
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;

        if (p.style === 'arrow') {
            ctx.fillStyle = '#ecf0f1'; ctx.fillRect(-10, -1, 20, 2); // Haste
            ctx.beginPath(); ctx.moveTo(10, -3); ctx.lineTo(15, 0); ctx.lineTo(10, 3); ctx.fill(); // Ponta
        } else if (p.style === 'magic' || p.style === 'fire') {
            ctx.fillStyle = p.color; 
            ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill();
        } else if (p.style === 'leaf') {
            ctx.fillStyle = '#2ecc71'; 
            ctx.beginPath(); ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI*2); ctx.fill();
        }
        ctx.restore();
    }

    // Cenário
    static drawTree(ctx, e) {
        ctx.save(); ctx.translate(e.x, e.y);
        ctx.fillStyle = '#5d4037'; ctx.fillRect(-5, -10, 10, 20);
        ctx.fillStyle = '#2d6a4f'; 
        ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(-15, -10); ctx.lineTo(15, -10); ctx.fill();
        ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(-12, -5); ctx.lineTo(12, -5); ctx.fill();
        ctx.restore();
    }
    static drawCactus(ctx, e) {
        ctx.save(); ctx.translate(e.x, e.y);
        ctx.fillStyle = '#27ae60'; 
        ctx.fillRect(-6, -30, 12, 30); 
        ctx.fillRect(-12, -20, 6, 6); ctx.fillRect(-12, -26, 4, 8); // Braço Esq
        ctx.fillRect(6, -15, 6, 6); ctx.fillRect(8, -22, 4, 8); // Braço Dir
        ctx.restore();
    }
}

// ================== LÓGICA DO JOGO ==================
class SurvivalGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.keys = {}; 
        this.gameObjects = []; 
        this.decorations = []; 
        this.floatingTexts = [];
        this.projectiles = []; 
        
        // Instancia Sistemas
        this.comboSystem = new ComboSystem();
        this.abilitySystem = null; 
        this.audioManager = typeof audioManager !== 'undefined' ? audioManager : null;

        this.currentBiomeIndex = 0; 
        this.bossActive = false; 
        this.miniBossSpawned = false; 
        this.miniBossDefeated = false;
        
        this.resizeCanvas(); 
        window.addEventListener('resize', () => this.resizeCanvas());
        this.setupInputs(); 
        this.setupMobileControls();
        
        this.loop();
    }

    resizeCanvas() { this.canvas.width = innerWidth; this.canvas.height = innerHeight; }
    
    setupInputs() {
        addEventListener('keydown', e => { 
            this.keys[e.key.toLowerCase()] = true; 
            if(e.code==='Space') e.preventDefault(); 
        });
        addEventListener('keyup', e => this.keys[e.key.toLowerCase()] = false);
    }
    
    setupMobileControls() {
        const bind = (s, k) => { 
            const el = document.querySelector(s); 
            if(el){ 
                el.addEventListener('touchstart',e=>{e.preventDefault();this.keys[k]=true}); 
                el.addEventListener('touchend',e=>{e.preventDefault();this.keys[k]=false}); 
            }
        };
        bind('.control-up','w'); bind('.control-down','s'); bind('.control-left','a'); bind('.control-right','d'); bind('.control-action',' ');
    }

    showScreen(id) { 
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); 
        const controls = document.getElementById('controls');
        
        if(id === 'game-screen') {
            controls.classList.add('visible');
            if(this.audioManager) this.audioManager.playMusic('aldervann'); 
        } else { 
            document.getElementById(id).classList.add('active'); 
            controls.classList.remove('visible'); 
            this.keys={}; 
        }
    }

    showClassSelection() {
        const grid = document.getElementById('class-grid');
        grid.innerHTML = '';
        GAME_DATA.classes.forEach(c => {
            const div = document.createElement('div');
            div.className = 'class-card'; div.style.borderColor = c.color;
            div.innerHTML = `
                <div style="font-size:3rem">${c.icon}</div>
                <div style="color:${c.color}; font-weight:bold;">${c.name}</div>
                <div style="font-size:0.6rem; margin:10px 0;">${c.description}</div>
                <div style="font-size:0.7rem">❤️${c.baseHp} ⚔️${c.baseDamage}</div>
            `;
            div.onclick = () => {
                gameEngine.createPlayer(c);
                this.abilitySystem = new AbilitySystem(gameEngine.player); 
                this.enterBiome(GAME_DATA.biomes[0].id);
                this.showScreen('game-screen');
                if(this.audioManager) this.audioManager.play('menu_click');
            };
            grid.appendChild(div);
        });
        this.showScreen('class-selection-screen');
    }

    enterBiome(id) {
        this.currentBiomeId = id;
        const biome = GAME_DATA.biomes.find(b => b.id === id);
        
        this.gameObjects = []; this.decorations = []; this.projectiles = [];
        this.bossActive = false;
        this.miniBossSpawned = false;
        this.miniBossDefeated = false;
        gameEngine.biomeKills = 0; 

        const decoType = biome.decoration || 'tree';
        // Gera decorações
        for(let i=0; i<40; i++) {
            this.decorations.push({ 
                x: Math.random()*2400-1200, 
                y: Math.random()*1800-900, 
                type: 'decoration', 
                style: decoType,
                scale: 0.8 + Math.random()*0.4
            });
        }

        this.spawnEnemy(); 
        if (this.spawnInterval) clearInterval(this.spawnInterval);
        this.spawnInterval = setInterval(() => { 
            if(!this.bossActive && this.gameObjects.length < 15) this.spawnEnemy(); 
        }, 1500);
        
        this.showFloatingText(`Mundo: ${biome.name}`, gameEngine.player.x, gameEngine.player.y-100, biome.color);
    }

    enterNextBiome() {
        this.currentBiomeIndex++;
        if(this.currentBiomeIndex >= GAME_DATA.biomes.length) this.currentBiomeIndex = 0;
        const nextBiome = GAME_DATA.biomes[this.currentBiomeIndex];
        
        const overlay = document.getElementById('damage-overlay');
        if(overlay) { overlay.style.background = '#000'; overlay.style.opacity = 1; }

        setTimeout(() => {
            this.enterBiome(nextBiome.id);
            gameEngine.player.x = 0; gameEngine.player.y = 0; 
            if(overlay) { overlay.style.opacity = 0; overlay.style.background = 'radial-gradient(circle, transparent 50%, rgba(255,0,0,0.5) 100%)'; }
        }, 1500);
    }

    spawnEnemy(forcedType = null, isMiniBoss = false, isBoss = false) {
        if (!this.currentBiomeId || !gameEngine.player) return;
        const biome = GAME_DATA.biomes.find(b=>b.id===this.currentBiomeId);
        const diff = 1 + Math.floor(gameEngine.biomeKills / 3); // Nível do inimigo sobe

        let data;
        if(isBoss) data = GAME_DATA.bosses.find(b=>b.id===biome.boss);
        else if(forcedType) data = GAME_DATA.enemies.find(e=>e.id===forcedType);
        else data = GAME_DATA.enemies.find(e=>e.id===biome.enemies[Math.floor(Math.random()*biome.enemies.length)]);

        if(!data) return;
        // Passamos o diff como Level do inimigo
        const enemy = gameEngine.createEnemy(data, isBoss, isMiniBoss, diff);
        
        const angle = Math.random()*Math.PI*2;
        const dist = isBoss ? 600 : (400 + Math.random()*300);
        enemy.x = gameEngine.player.x + Math.cos(angle)*dist;
        enemy.y = gameEngine.player.y + Math.sin(angle)*dist;
        
        // Define VX VY para animação
        enemy.vx = 0; enemy.vy = 0;
        
        this.gameObjects.push(enemy);

        if(isBoss) {
            this.showFloatingText("BOSS FINAL!", gameEngine.player.x, gameEngine.player.y-150, '#f00');
            if(this.audioManager) this.audioManager.play('ability_berserker'); 
        }
    }

    checkSpawnEvents() {
        const kills = gameEngine.biomeKills;
        if(kills >= 10 && this.miniBossDefeated && !this.bossActive) {
            this.bossActive = true;
            this.gameObjects = []; 
            this.spawnEnemy(null, false, true);
            return;
        }
        if(kills >= 5 && !this.miniBossSpawned && !this.bossActive) {
            this.miniBossSpawned = true;
            const biome = GAME_DATA.biomes.find(b=>b.id===this.currentBiomeId);
            this.spawnEnemy(biome.enemies[0], true, false);
        }
    }

    update(dt) {
        const p = gameEngine.player; if(!p) return;
        
        // 1. INPUT & MOVIMENTO
        let dx = 0, dy = 0;
        if(this.keys['w']||this.keys['arrowup']) dy = -1;
        if(this.keys['s']||this.keys['arrowdown']) dy = 1;
        if(this.keys['a']||this.keys['arrowleft']) dx = -1;
        if(this.keys['d']||this.keys['arrowright']) dx = 1;
        
        // Guarda a velocidade atual para animação
        p.vx = dx; p.vy = dy;

        // Facing logic
        if (dx !== 0 || dy !== 0) {
            p.facing = { x: dx, y: dy };
            const l = Math.hypot(dx, dy);
            // Normaliza o facing para não afetar calculo de tiro depois
            if(l > 0) { p.facing.x /= l; p.facing.y /= l; }
        } else if(!p.facing) p.facing = {x: 0, y: 1};

        // Aplicar movimento (com colisão simples)
        if(dx !== 0 || dy !== 0) {
            const len = Math.hypot(dx,dy);
            const moveX = (dx/len)*p.speed*dt;
            const moveY = (dy/len)*p.speed*dt;
            p.x += moveX; p.y += moveY; 
        }
        
        // 2. ABILITIES (Teclas)
        if(this.keys['q'] && this.abilitySystem) {
            if(!this.qPressed) {
                this.qPressed = true;
                this.abilitySystem.useAbility(this); 
            }
        } else { this.qPressed = false; }

        // 3. ATAQUE BÁSICO
        if(this.keys[' '] && !this.spacePressed) { 
            this.spacePressed=true; 
            this.handlePlayerAttack(); 
        }
        if(!this.keys[' ']) this.spacePressed=false;

        // 4. PROJÉTEIS
        this.projectiles = this.projectiles.filter(proj => {
            proj.x += proj.vx * dt;
            proj.y += proj.vy * dt;
            proj.life -= dt;
            
            if(proj.fromPlayer) {
                for(let enemy of this.gameObjects) {
                    const hitSize = 30;
                    if(Math.hypot(proj.x - enemy.x, proj.y - enemy.y) < hitSize) {
                        const res = gameEngine.playerAttack(enemy);
                        const combo = this.comboSystem.recordHit(res.damage);
                        const mult = this.comboSystem.getMultiplier();
                        const finalDmg = Math.floor(res.damage * mult);
                        enemy.currentHp -= (finalDmg - res.damage); 
                        
                        this.showFloatingText(finalDmg, enemy.x, enemy.y-40, mult > 1 ? '#f1c40f':'#fff');
                        if(this.audioManager) this.audioManager.play('hit_normal');
                        this.checkEnemyDeath(enemy);
                        return false; 
                    }
                }
            }
            return proj.life > 0;
        });

        // 5. INIMIGOS
        const now = performance.now();
        this.gameObjects.forEach(e => {
            const dist = Math.hypot(p.x-e.x, p.y-e.y);
            const stop = 25;
            
            if(dist > stop) {
                const speed = e.speed * (e.justHit ? 0.5 : 1); // Desacelera se tomou hit
                e.vx = (p.x-e.x)/dist; // Guarda vetor para animação
                e.vy = (p.y-e.y)/dist;
                e.x += e.vx * speed * dt;
                e.y += e.vy * speed * dt;
            } else {
                e.vx = 0; e.vy = 0;
            }

            if(dist < stop+10 && now-e.lastAttack > 1000) {
                const dmg = gameEngine.enemyAttack(e);
                this.showFloatingText(`-${dmg.damage}`, p.x, p.y-40, '#f00');
                if(this.audioManager) this.audioManager.play('hit_normal');
                e.lastAttack = now;
                if(p.currentHp<=0) this.gameOver();
            }
        });

        this.floatingTexts = this.floatingTexts.filter(t=>t.life>0);
        this.floatingTexts.forEach(t=>{ t.y-=30*dt; t.life-=dt; });
    }

    handlePlayerAttack() {
        const p = gameEngine.player;
        // CORREÇÃO ATAQUE DIAGONAL
        // Usa o p.facing que já está normalizado no update
        let shotDirX = p.facing.x;
        let shotDirY = p.facing.y;

        // Se estiver parado, usa a ultima direção, se não tiver, atira pra direita
        if (shotDirX === 0 && shotDirY === 0) shotDirX = 1;

        if (p.class.type === 'ranged') {
            this.projectiles.push({
                type: 'projectile', fromPlayer: true,
                x: p.x, y: p.y - 15,
                vx: shotDirX * 500,
                vy: shotDirY * 500,
                life: 0.8, color: p.class.color, style: p.class.projectile
            });
            if(this.audioManager) this.audioManager.play('player_attack');
        } else {
            // Melee - Ataque em cone curto à frente
            let hit = false;
            this.gameObjects.forEach(e => {
                const dist = Math.hypot(p.x-e.x, p.y-e.y);
                // Verifica se está perto E na frente do jogador (produto escalar)
                const dx = e.x - p.x;
                const dy = e.y - p.y;
                const dot = (dx * shotDirX) + (dy * shotDirY);

                if(dist < 80 && dot > 0) { 
                    const res = gameEngine.playerAttack(e);
                    const combo = this.comboSystem.recordHit(res.damage);
                    const mult = this.comboSystem.getMultiplier();
                    const finalDmg = Math.floor(res.damage * mult);
                    e.currentHp -= (finalDmg - res.damage);
                    
                    this.showFloatingText(finalDmg, e.x, e.y-40, mult>1?'#f1c40f':'#fff');
                    this.checkEnemyDeath(e);
                    hit = true;
                }
            });
            if(hit && this.audioManager) this.audioManager.play('hit_critical');
        }
    }

    checkEnemyDeath(e) {
        if(e.currentHp<=0) {
            const index = this.gameObjects.indexOf(e);
            if (index > -1) {
                this.gameObjects.splice(index, 1);
                gameEngine.biomeKills++;
                const xp = gameEngine.calculateXpGain(e);
                
                if(gameEngine.gainExp(xp)) {
                    this.showFloatingText("LEVEL UP!", gameEngine.player.x, gameEngine.player.y-80, '#FFD700');
                    if(this.audioManager) this.audioManager.play('level_up');
                } else {
                    this.showFloatingText(`+${xp} XP`, e.x, e.y-60, '#0f0');
                }
                
                if(e.isMiniBoss) {
                    this.miniBossDefeated = true;
                    this.showFloatingText("CAMINHO DO BOSS ABERTO!", gameEngine.player.x, gameEngine.player.y-150, '#f1c40f');
                }

                if(e.isBoss) {
                    this.showFloatingText("VITÓRIA!", gameEngine.player.x, gameEngine.player.y, '#0f0');
                    if(this.audioManager) this.audioManager.play('level_up');
                    setTimeout(() => this.enterNextBiome(), 2000);
                } else {
                    this.checkSpawnEvents();
                }
            }
        }
    }

    showFloatingText(text, x, y, color) { this.floatingTexts.push({ text, x, y, color, life: 1.0 }); }
    
    gameOver() {
        document.getElementById('final-score').innerText = gameEngine.enemiesDefeated;
        this.showScreen('game-over-screen');
        if(this.audioManager) this.audioManager.play('game_over');
    }

    draw() {
        const currentBiome = GAME_DATA.biomes.find(b => b.id === this.currentBiomeId);
        this.ctx.fillStyle = currentBiome ? (currentBiome.bgColor || '#1e272e') : '#1e272e';
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        
        const p = gameEngine.player; if(!p) return;
        // Camera segue o player
        let cx=p.x-this.canvas.width/2; let cy=p.y-this.canvas.height/2;
        if(isNaN(cx)) cx=0;
        
        this.ctx.save(); 
        this.ctx.translate(-cx,-cy);
        
        // Grid de chão para dar sensação de movimento
        this.ctx.strokeStyle='rgba(255,255,255,0.03)'; this.ctx.lineWidth=2;
        this.ctx.beginPath();
        const gridSize = 100;
        const startX = Math.floor(cx/gridSize)*gridSize;
        const startY = Math.floor(cy/gridSize)*gridSize;
        for(let x=startX; x<cx+this.canvas.width; x+=gridSize) { this.ctx.moveTo(x,cy); this.ctx.lineTo(x,cy+this.canvas.height); }
        for(let y=startY; y<cy+this.canvas.height; y+=gridSize) { this.ctx.moveTo(cx,y); this.ctx.lineTo(cx+this.canvas.width,y); }
        this.ctx.stroke();

        // Ordena objetos por Y para dar profundidade correta (quem tá em baixo desenha na frente)
        const all = [...this.gameObjects, p, ...this.decorations, ...this.projectiles];
        all.sort((a,b)=>{
            if(a.type === 'decoration') return -1; // Decoração fundo
            return (a.y||0)-(b.y||0);
        });
        
        all.forEach(e=>PixelRenderer.drawSprite(this.ctx,e,e===p));
        
        this.floatingTexts.forEach(t=>{ 
            this.ctx.globalAlpha=t.life; 
            this.ctx.fillStyle='#000'; // Sombra texto
            this.ctx.font='bold 16px Arial'; 
            this.ctx.fillText(t.text,t.x+1,t.y+1); 
            this.ctx.fillStyle=t.color; 
            this.ctx.fillText(t.text,t.x,t.y); 
        });
        this.ctx.restore();

        // === HUD ===
        this.ctx.globalAlpha=1;
        // Painel
        this.ctx.fillStyle='rgba(0,0,0,0.7)'; this.ctx.strokeStyle='#fff'; this.ctx.lineWidth=2;
        this.ctx.roundRect ? this.ctx.roundRect(10,10,300,100,10) : this.ctx.fillRect(10,10,300,100);
        this.ctx.fill(); this.ctx.stroke();
        
        this.ctx.fillStyle='#fff'; this.ctx.font='18px "Press Start 2P", cursive';
        this.ctx.fillText(p.class.name, 25, 40);
        
        // Info
        this.ctx.font='12px "Press Start 2P", cursive';
        this.ctx.fillText(`Lv.${p.level} XP:${Math.floor(p.exp)}/${p.expToNextLevel}`, 25, 65);

        // Barras
        this.ctx.fillStyle='#333'; this.ctx.fillRect(25,80,270,10); // Fundo HP
        this.ctx.fillStyle='#e74c3c'; this.ctx.fillRect(25,80,270*(Math.max(0, p.currentHp)/p.maxHp),10); // HP
        
        // Cooldown Skill
        if(this.abilitySystem) {
            this.abilitySystem.renderCooldown(this.ctx, this.canvas.width - 60, 20, 40);
        }
        // Combo
        if(this.comboSystem) {
            this.comboSystem.render(this.ctx, 25, 140);
        }
    }
    
    loop() { this.update(0.016); this.draw(); requestAnimationFrame(()=>this.loop()); }
}