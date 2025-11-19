// ================== RENDERIZADOR AVANÇADO (Pixel Art Procedural) ==================
class PixelRenderer {
    static drawSprite(ctx, e, isPlayer) {
        if (!e || typeof e.x !== 'number') return;
        
        // Decorações Variadas
        if (e.type === 'decoration') { 
            if (e.style === 'cactus') this.drawCactus(ctx, e);
            else if (e.style === 'crystal') this.drawCrystal(ctx, e);
            else if (e.style === 'ruins') this.drawRuins(ctx, e);
            else if (e.style === 'twisted_tree') this.drawTwistedTree(ctx, e);
            else this.drawTree(ctx, e); 
            return; 
        }
        
        // Projéteis (Inimigos também usam agora)
        if (e.type === 'projectile') { this.drawProjectile(ctx, e); return; }

        const scale = e.scale || 1;
        const level = e.level || 1;
        const time = Date.now() / 200; 
        const breathe = Math.sin(time) * 2; 
        
        ctx.save(); 
        ctx.translate(e.x, e.y);
        ctx.scale(scale, scale);

        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.3)'; 
        ctx.beginPath(); ctx.ellipse(0, 5, 14, 6, 0, 0, Math.PI*2); ctx.fill();

        // Auras
        if (e.isBoss) {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, -15, 30 + breathe, 0, Math.PI*2); ctx.stroke();
        }
        if (isPlayer && e.shieldActive) {
            ctx.strokeStyle = '#00b894'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, -15, 25, 0, Math.PI*2); ctx.stroke();
        }

        if (e.justHit) { ctx.globalAlpha = 0.7; ctx.fillStyle = '#fff'; }

        this.drawHumanoid(ctx, e, isPlayer, breathe);
        ctx.restore();

        // Barra de Vida
        if (e.maxHp && !isPlayer) {
            const hpPct = Math.max(0, e.currentHp/e.maxHp);
            const yOffset = -55 * scale;
            ctx.fillStyle = '#000'; ctx.fillRect(e.x-20, e.y+yOffset, 40, 6);
            ctx.fillStyle = e.isBoss?'#e74c3c':(e.isMiniBoss?'#f1c40f':'#ff4757');
            ctx.fillRect(e.x-19, e.y+yOffset+1, 38*hpPct, 4);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center';
            ctx.fillText(`Lv.${level}`, e.x, e.y+yOffset-2);
        }
    }

    static drawHumanoid(ctx, e, isPlayer, animY) {
        const color = isPlayer ? e.class.color : (e.color || '#e74c3c');
        const level = e.level || 1;
        const skinColor = '#ffccaa';
        const armorColor = level >= 10 ? '#f1c40f' : (level >= 5 ? '#95a5a6' : color); 
        const pantsColor = '#2d3436';

        const facingX = e.facing ? e.facing.x : (e.vx > 0 ? 1 : -1);
        
        const isMoving = (Math.abs(e.vx||0) > 0.1 || Math.abs(e.vy||0) > 0.1);
        const walk = isMoving ? Math.sin(Date.now() / 100) * 3 : 0;
        
        ctx.fillStyle = pantsColor;
        ctx.fillRect(-6, -5, 4, 12 + walk); 
        ctx.fillRect(2, -5, 4, 12 - walk); 

        ctx.translate(0, -14 + animY); 
        ctx.fillStyle = armorColor; ctx.fillRect(-8, 0, 16, 14); 
        ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-8, 10, 16, 4); 

        ctx.fillStyle = skinColor; ctx.fillRect(-7, -12, 14, 12); 

        if (level >= 5) { 
            ctx.fillStyle = level >= 10 ? '#f1c40f' : '#7f8c8d'; 
            ctx.fillRect(-8, -14, 16, 6); ctx.fillRect(-8, -14, 4, 14); 
            if(facingX < 0) ctx.fillRect(4, -14, 4, 14); 
        }
        ctx.fillStyle = '#000'; 
        const eyeOffset = facingX > 0 ? 2 : -2;
        ctx.fillRect(-2 + eyeOffset, -8, 2, 2); ctx.fillRect(2 + eyeOffset, -8, 2, 2);
        this.drawWeapon(ctx, e, isPlayer);
    }

    static drawWeapon(ctx, e, isPlayer) {
        ctx.save();
        const weaponType = isPlayer ? e.class.weapon : (e.weapon || 'melee');
        const level = e.level || 1;
        ctx.translate(10, 5); 
        if (e.justHit || (isPlayer && window.game && window.game.spacePressed)) ctx.rotate(Math.sin(Date.now()/50)); 
        const wColor = level >= 8 ? '#e1b12c' : '#bdc3c7';
        
        if (weaponType === 'sword' || weaponType === 'dagger') {
            ctx.fillStyle = '#5d4037'; ctx.fillRect(-2, 0, 4, 8); 
            ctx.fillStyle = wColor; ctx.fillRect(-2, -14, 4, 14); 
            ctx.fillStyle = '#95a5a6'; ctx.fillRect(-5, -2, 10, 2); 
        } else if (weaponType === 'axe') {
            ctx.fillStyle = '#5d4037'; ctx.fillRect(-2, -10, 4, 20); 
            ctx.fillStyle = wColor; ctx.beginPath(); ctx.arc(0, -8, 8, 0, Math.PI, true); ctx.fill(); 
        } else if (weaponType === 'staff') {
            ctx.fillStyle = '#5d4037'; ctx.fillRect(-2, -15, 4, 30); 
            ctx.fillStyle = e.color || '#f00'; ctx.beginPath(); ctx.arc(0, -15, 5, 0, Math.PI*2); ctx.fill(); 
        } else if (weaponType === 'bow') {
            ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, 0, 10, -Math.PI/2, Math.PI/2); ctx.stroke(); 
            ctx.fillStyle = '#fff'; ctx.fillRect(0, -10, 1, 20); 
        }
        ctx.restore();
    }

    static drawProjectile(ctx, p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        const angle = Math.atan2(p.vy, p.vx);
        ctx.rotate(angle);
        ctx.shadowBlur = 10; ctx.shadowColor = p.color;
        if (p.style === 'arrow') {
            ctx.fillStyle = '#ecf0f1'; ctx.fillRect(-10, -1, 20, 2);
            ctx.beginPath(); ctx.moveTo(10, -3); ctx.lineTo(15, 0); ctx.lineTo(10, 3); ctx.fill(); 
        } else if (p.style === 'magic') {
            ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill();
        } else { ctx.fillStyle = '#2ecc71'; ctx.beginPath(); ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI*2); ctx.fill(); }
        ctx.restore();
    }

    // === NOVOS BIOMAS ===
    static drawTree(ctx, e) {
        ctx.save(); ctx.translate(e.x, e.y);
        ctx.fillStyle = '#5d4037'; ctx.fillRect(-6, -15, 12, 20);
        ctx.fillStyle = '#2d6a4f'; 
        ctx.beginPath(); ctx.moveTo(0, -55); ctx.lineTo(-20, -15); ctx.lineTo(20, -15); ctx.fill();
        ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(-16, -10); ctx.lineTo(16, -10); ctx.fill();
        ctx.restore();
    }
    static drawTwistedTree(ctx, e) {
        ctx.save(); ctx.translate(e.x, e.y);
        ctx.fillStyle = '#2d3436'; ctx.fillRect(-5, -20, 10, 25); // Tronco escuro
        ctx.fillStyle = '#636e72'; // Folhas mortas
        ctx.beginPath(); ctx.arc(0, -25, 15, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(-10, -15, 10, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    }
    static drawCactus(ctx, e) {
        ctx.save(); ctx.translate(e.x, e.y);
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(0, 0, 15, 6, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#27ae60'; 
        ctx.fillRect(-8, -40, 16, 45); 
        ctx.fillRect(-16, -25, 8, 8); ctx.fillRect(-16, -35, 6, 10); 
        ctx.fillRect(8, -20, 8, 8); ctx.fillRect(10, -30, 6, 10);
        ctx.restore();
    }
    static drawCrystal(ctx, e) {
        ctx.save(); ctx.translate(e.x, e.y);
        ctx.fillStyle = 'rgba(116, 185, 255, 0.6)'; 
        ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(10, 0); ctx.lineTo(0, 10); ctx.lineTo(-10, 0); ctx.fill();
        ctx.fillStyle = 'rgba(116, 185, 255, 0.9)'; 
        ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(5, 0); ctx.lineTo(0, 10); ctx.lineTo(-5, 0); ctx.fill();
        ctx.restore();
    }
    static drawRuins(ctx, e) {
        ctx.save(); ctx.translate(e.x, e.y);
        ctx.fillStyle = '#95a5a6'; 
        ctx.fillRect(-10, -30, 20, 30); // Pilar
        ctx.fillStyle = '#7f8c8d'; 
        ctx.fillRect(-12, -32, 24, 5); // Topo
        ctx.fillRect(-11, -5, 22, 5); // Base
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
        
        this.comboSystem = new ComboSystem();
        this.abilitySystem = null; 
        this.audioManager = typeof audioManager !== 'undefined' ? audioManager : null;
        this.storyEngine = typeof storyEngine !== 'undefined' ? storyEngine : null;

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
        addEventListener('keydown', e => { this.keys[e.key.toLowerCase()] = true; if(e.code==='Space') e.preventDefault(); });
        addEventListener('keyup', e => this.keys[e.key.toLowerCase()] = false);
    }
    
    setupMobileControls() {
        const bind = (s, k) => { 
            const el = document.querySelector(s); 
            if(el){ 
                el.addEventListener('touchstart',e=>{e.preventDefault();this.keys[k]=true; el.classList.add('active');}); 
                el.addEventListener('touchend',e=>{e.preventDefault();this.keys[k]=false; el.classList.remove('active');}); 
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
            div.innerHTML = `<div style="font-size:3rem">${c.icon}</div><div style="color:${c.color}; font-weight:bold;">${c.name}</div><div style="font-size:0.6rem; margin:10px 0;">${c.description}</div><div style="font-size:0.7rem">❤️${c.baseHp} ⚔️${c.baseDamage}</div>`;
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
        this.bossActive = false; this.miniBossSpawned = false; this.miniBossDefeated = false;
        gameEngine.biomeKills = 0; 

        const decoType = biome.decoration || 'tree';
        for(let i=0; i<50; i++) {
            this.decorations.push({ 
                x: Math.random()*2400-1200, 
                y: Math.random()*1800-900, 
                type: 'decoration', 
                style: decoType, 
                scale: 0.9 + Math.random()*0.3, 
                collisionRadius: 15 
            });
        }
        this.spawnEnemy(); 
        if (this.spawnInterval) clearInterval(this.spawnInterval);
        this.spawnInterval = setInterval(() => { if(!this.bossActive && this.gameObjects.length < 15) this.spawnEnemy(); }, 1500);
        this.showFloatingText(`Mundo: ${biome.name}`, gameEngine.player.x, gameEngine.player.y-100, biome.color);
    }

    enterNextBiome() {
        this.currentBiomeIndex++;
        if(this.currentBiomeIndex >= GAME_DATA.biomes.length) {
             // FIM DE JOGO - Epílogo
             if(this.storyEngine) this.storyEngine.showEpilogue();
             return;
        }

        const nextBiome = GAME_DATA.biomes[this.currentBiomeIndex];
        
        // Mostra história ANTES de mudar
        if (this.storyEngine) {
            this.storyEngine.showBiomeStory(nextBiome.id, () => {
                 // Callback quando fecha a história
                 this.enterBiome(nextBiome.id);
                 gameEngine.player.x = 0; gameEngine.player.y = 0; 
            });
        } else {
            this.enterBiome(nextBiome.id);
            gameEngine.player.x = 0; gameEngine.player.y = 0; 
        }
    }

    spawnEnemy(forcedType = null, isMiniBoss = false, isBoss = false) {
        if (!this.currentBiomeId || !gameEngine.player) return false;
        const biome = GAME_DATA.biomes.find(b=>b.id===this.currentBiomeId);
        const diff = 1 + Math.floor(gameEngine.biomeKills / 3); 

        let data;
        if(isBoss) data = GAME_DATA.bosses.find(b=>b.id===biome.boss);
        else if(forcedType) data = GAME_DATA.enemies.find(e=>e.id===forcedType);
        else data = GAME_DATA.enemies.find(e=>e.id===biome.enemies[Math.floor(Math.random()*biome.enemies.length)]);

        if(!data) { console.warn("Enemy missing"); return false; }
        const enemy = gameEngine.createEnemy(data, isBoss, isMiniBoss, diff);
        
        let safe = false; let attempts = 0;
        while(!safe && attempts < 40) { 
            const angle = Math.random()*Math.PI*2; const dist = isBoss ? 600 : (450 + Math.random()*400);
            enemy.x = gameEngine.player.x + Math.cos(angle)*dist; enemy.y = gameEngine.player.y + Math.sin(angle)*dist;
            let colliding = false;
            for(let d of this.decorations) { if(Math.hypot(enemy.x-d.x, enemy.y-d.y) < 40) { colliding = true; break; } }
            if(!colliding) safe = true; attempts++;
        }
        enemy.vx = 0; enemy.vy = 0;
        this.gameObjects.push(enemy);

        if(isBoss) {
            this.showFloatingText("BOSS FINAL!", gameEngine.player.x, gameEngine.player.y-150, '#f00');
            if(this.audioManager) this.audioManager.play('ability_berserker'); 
        }
        return true;
    }

    checkSpawnEvents() {
        const kills = gameEngine.biomeKills;
        if(kills >= 10 && this.miniBossDefeated && !this.bossActive) {
            this.gameObjects = []; 
            if(this.spawnEnemy(null, false, true)) this.bossActive = true; 
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
        
        let dx = 0, dy = 0;
        if(this.keys['w']||this.keys['arrowup']) dy = -1;
        if(this.keys['s']||this.keys['arrowdown']) dy = 1;
        if(this.keys['a']||this.keys['arrowleft']) dx = -1;
        if(this.keys['d']||this.keys['arrowright']) dx = 1;
        
        p.vx = dx; p.vy = dy;
        if (dx !== 0 || dy !== 0) {
            p.facing = { x: dx, y: dy };
            const l = Math.hypot(dx, dy);
            if(l > 0) { p.facing.x /= l; p.facing.y /= l; }
        } else if(!p.facing) p.facing = {x: 0, y: 1};

        if(dx !== 0 || dy !== 0) {
            const len = Math.hypot(dx,dy); const moveX = (dx/len)*p.speed*dt; const moveY = (dy/len)*p.speed*dt;
            let canMoveX = true; let nextX = p.x + moveX;
            for(let t of this.decorations) { if(this.checkRectCollision(nextX, p.y, t)) { canMoveX = false; break; } }
            if(canMoveX) p.x += moveX;
            let canMoveY = true; let nextY = p.y + moveY;
            for(let t of this.decorations) { if(this.checkRectCollision(p.x, nextY, t)) { canMoveY = false; break; } }
            if(canMoveY) p.y += moveY;
        }
        
        if(this.keys['q'] && this.abilitySystem && !this.qPressed) { this.qPressed = true; this.abilitySystem.useAbility(this); } 
        else if(!this.keys['q']) { this.qPressed = false; }

        if(this.keys[' '] && !this.spacePressed) { this.spacePressed=true; this.handlePlayerAttack(); }
        if(!this.keys[' ']) this.spacePressed=false;

        // --- PROJÉTEIS ---
        this.projectiles = this.projectiles.filter(proj => {
            proj.x += proj.vx * dt; proj.y += proj.vy * dt; proj.life -= dt;
            
            // Colisão com INIMIGOS (Player atirou)
            if(proj.fromPlayer) {
                const enemies = [...this.gameObjects];
                for(let enemy of enemies) {
                    if(Math.hypot(proj.x - enemy.x, proj.y - enemy.y) < 35) {
                        const res = gameEngine.playerAttack(enemy);
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
            // Colisão com PLAYER (Inimigo atirou)
            else {
                if(Math.hypot(proj.x - p.x, proj.y - p.y) < 20) {
                    const dmg = gameEngine.enemyAttack({damage: 15}); // Dano base do projétil inimigo
                    this.showFloatingText(`-${dmg.damage}`, p.x, p.y-40, '#f00');
                    if(this.audioManager) this.audioManager.play('hit_normal');
                    if(p.currentHp<=0) this.gameOver();
                    return false;
                }
            }
            return proj.life > 0;
        });

        // --- INIMIGOS (IA Melhorada) ---
        const enemies = [...this.gameObjects];
        const now = performance.now();
        
        enemies.forEach(e => {
            const dist = Math.hypot(p.x-e.x, p.y-e.y); 
            const isRanged = (e.weapon === 'bow' || e.weapon === 'staff' || e.id === 'spirit' || e.id === 'specter');
            const stopDist = isRanged ? 300 : 25; // Arqueiros param longe
            
            // Movimento
            if(dist > stopDist) {
                const speed = e.speed * (e.justHit ? 0.5 : 1); 
                e.vx = (p.x-e.x)/dist; e.vy = (p.y-e.y)/dist;
                e.x += e.vx * speed * dt; e.y += e.vy * speed * dt;
            } else { e.vx = 0; e.vy = 0; }

            // Ataque
            if (isRanged) {
                // Atira se estiver perto e cooldown ok
                if (dist < 400 && now - (e.lastShot||0) > 2000) {
                     e.lastShot = now;
                     const angle = Math.atan2(p.y - e.y, p.x - e.x);
                     this.projectiles.push({
                        type: 'projectile', fromPlayer: false, x: e.x, y: e.y,
                        vx: Math.cos(angle)*300, vy: Math.sin(angle)*300,
                        life: 2, color: '#ff4757', style: 'magic'
                     });
                }
            } else {
                // Melee attack
                if(dist < 30 && now-e.lastAttack > 1000) {
                    const dmg = gameEngine.enemyAttack(e);
                    this.showFloatingText(`-${dmg.damage}`, p.x, p.y-40, '#f00');
                    if(this.audioManager) this.audioManager.play('hit_normal');
                    e.lastAttack = now;
                    if(p.currentHp<=0) this.gameOver();
                }
            }
        });

        this.floatingTexts = this.floatingTexts.filter(t=>t.life>0);
        this.floatingTexts.forEach(t=>{ t.y-=30*dt; t.life-=dt; });
    }

    checkRectCollision(px, py, t) {
        const pW = 16; const pH = 8; const tW = t.width || 20; const tH = t.height || 15;
        return (px > t.x - tW && px < t.x + tW && py > t.y - tH && py < t.y + tH);
    }

    handlePlayerAttack() {
        const p = gameEngine.player;
        let shotDirX = p.facing.x; let shotDirY = p.facing.y;
        if (shotDirX === 0 && shotDirY === 0) shotDirX = 1;
        if (p.class.type === 'ranged' && (Math.abs(p.vx) > 0.1 || Math.abs(p.vy) > 0.1)) { shotDirX = -shotDirX; shotDirY = -shotDirY; }

        if (p.class.type === 'ranged') {
            this.projectiles.push({
                type: 'projectile', fromPlayer: true, x: p.x, y: p.y - 15,
                vx: shotDirX * 500, vy: shotDirY * 500, life: 0.8, color: p.class.color, style: p.class.projectile
            });
            if(this.audioManager) this.audioManager.play('player_attack');
        } else {
            let hit = false;
            [...this.gameObjects].forEach(e => {
                const dist = Math.hypot(p.x-e.x, p.y-e.y);
                const dx = e.x - p.x; const dy = e.y - p.y;
                const dot = (dx * p.facing.x) + (dy * p.facing.y);
                if(dist < 90 && dot > 0) { 
                    const res = gameEngine.playerAttack(e);
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
                    this.showFloatingText("ELITE DERROTADO!", gameEngine.player.x, gameEngine.player.y-150, '#f1c40f');
                }
                if(e.isBoss) {
                    this.showFloatingText("BOSS DESTRUÍDO!", gameEngine.player.x, gameEngine.player.y, '#0f0');
                    if(this.audioManager) this.audioManager.play('level_up');
                    setTimeout(() => this.enterNextBiome(), 3000); // Espera 3s e muda
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
        let cx=p.x-this.canvas.width/2; let cy=p.y-this.canvas.height/2; if(isNaN(cx)) cx=0;
        this.ctx.save(); this.ctx.translate(-cx,-cy);
        
        this.ctx.strokeStyle='rgba(255,255,255,0.03)'; this.ctx.lineWidth=2; this.ctx.beginPath();
        const gridSize = 100; const startX = Math.floor(cx/gridSize)*gridSize; const startY = Math.floor(cy/gridSize)*gridSize;
        for(let x=startX; x<cx+this.canvas.width; x+=gridSize) { this.ctx.moveTo(x,cy); this.ctx.lineTo(x,cy+this.canvas.height); }
        for(let y=startY; y<cy+this.canvas.height; y+=gridSize) { this.ctx.moveTo(cx,y); this.ctx.lineTo(cx+this.canvas.width,y); }
        this.ctx.stroke();

        const all = [...this.gameObjects, p, ...this.decorations, ...this.projectiles];
        all.sort((a,b)=>(a.y||0)-(b.y||0));
        all.forEach(e=>PixelRenderer.drawSprite(this.ctx,e,e===p));
        
        this.floatingTexts.forEach(t=>{ 
            this.ctx.globalAlpha=t.life; this.ctx.fillStyle='#000'; this.ctx.font='bold 16px Arial'; 
            this.ctx.fillText(t.text,t.x+1,t.y+1); this.ctx.fillStyle=t.color; this.ctx.fillText(t.text,t.x,t.y); 
        });
        this.ctx.restore();

        this.ctx.globalAlpha=1;
        this.ctx.fillStyle='rgba(0,0,0,0.7)'; this.ctx.strokeStyle='#fff'; this.ctx.lineWidth=2;
        this.ctx.roundRect ? this.ctx.roundRect(10,10,300,100,10) : this.ctx.fillRect(10,10,300,100);
        this.ctx.fill(); this.ctx.stroke();
        this.ctx.fillStyle='#fff'; this.ctx.font='18px "Press Start 2P", cursive';
        this.ctx.fillText(p.class.name, 25, 40);
        this.ctx.font='12px "Press Start 2P", cursive';
        this.ctx.fillText(`Lv.${p.level} XP:${Math.floor(p.exp)}/${p.expToNextLevel}`, 25, 65);
        this.ctx.fillStyle='#333'; this.ctx.fillRect(25,80,270,10); 
        this.ctx.fillStyle='#e74c3c'; this.ctx.fillRect(25,80,270*(Math.max(0, p.currentHp)/p.maxHp),10); 
        if(this.abilitySystem) this.abilitySystem.renderCooldown(this.ctx, this.canvas.width - 60, 20, 40);
        if(this.comboSystem) this.comboSystem.render(this.ctx, 25, 140);
    }
    loop() { this.update(0.016); this.draw(); requestAnimationFrame(()=>this.loop()); }
}