// Mantendo o PixelRenderer EXATAMENTE como você enviou (Visual Novo)
class PixelRenderer {
    static drawSprite(ctx, e, isPlayer) {
        if (!e || typeof e.x !== 'number') return;
        
        // Decorações
        if (e.type === 'decoration') { 
            if (e.style === 'cactus') this.drawCactus(ctx, e);
            else this.drawTree(ctx, e); 
            return; 
        }
        
        // Projéteis
        if (e.type === 'projectile') { this.drawProjectile(ctx, e); return; }

        let color = isPlayer ? e.class.color : e.color;
        ctx.save(); 
        ctx.translate(e.x, e.y);
        const scale = e.scale || 1;
        ctx.scale(scale, scale);

        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(0, 15, 16, 7, 0, 0, Math.PI*2); ctx.fill();

        // Aura Boss
        if (e.isBoss) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; ctx.beginPath(); ctx.arc(0, -20, 35, 0, Math.PI*2); ctx.fill();
        }

        // Flash de Dano
        if (e.justHit) {
            ctx.globalAlpha = 0.7; ctx.fillStyle = '#fff'; ctx.fillRect(-20, -45, 40, 60); ctx.globalAlpha = 1;
        }

        if (isPlayer) this.drawHero(ctx, e.class.id, color, e.facing);
        else if (e.isBoss) this.drawBoss(ctx, color);
        else if (e.isMiniBoss) this.drawMiniBoss(ctx, color);
        else this.drawEnemy(ctx, e.id, color, e.level);

        ctx.restore();

        // Barra de Vida (exceto player, que tem HUD próprio)
        if (e.maxHp && !isPlayer) {
            const hpPct = Math.max(0, e.currentHp/e.maxHp);
            const yOffset = -45 * scale;
            ctx.fillStyle = '#000'; ctx.fillRect(e.x-25, e.y+yOffset, 50, 8);
            ctx.fillStyle = e.isBoss?'#e74c3c':(e.isMiniBoss?'#f1c40f':'#ff4757');
            ctx.fillRect(e.x-24, e.y+yOffset+1, 48*hpPct, 6);
        }
    }

    static drawProjectile(ctx, p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        const angle = Math.atan2(p.vy, p.vx);
        ctx.rotate(angle);

        if (p.style === 'arrow') {
            ctx.fillStyle = '#bdc3c7'; ctx.fillRect(-10, -1, 20, 2);
            ctx.fillStyle = '#fff'; ctx.fillRect(-10, -3, 4, 6);
            ctx.fillStyle = '#ecf0f1'; ctx.beginPath(); ctx.moveTo(10, -3); ctx.lineTo(15, 0); ctx.lineTo(10, 3); ctx.fill();
        } else if (p.style === 'leaf') {
            ctx.rotate(Date.now() / 100);
            ctx.fillStyle = '#2ecc71'; ctx.beginPath(); ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI*2); ctx.fill();
        } else if (p.style === 'magic') {
             ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill();
             ctx.shadowBlur = 10; ctx.shadowColor = p.color;
        } else {
            ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI*2); ctx.fill();
        }
        ctx.restore();
    }

    static drawHero(ctx, id, color, facing) {
        ctx.fillStyle = color; ctx.fillRect(-10,-20,20,22);
        ctx.fillStyle = '#f1c40f'; ctx.fillRect(-8,-32,16,14);
        
        ctx.save();
        let fx = facing ? -facing.x : 0; 
        let fy = facing ? -facing.y : 1;
        
        if (id === 'arqueiro') {
            const angle = Math.atan2(fy, fx);
            ctx.translate(0, -15); ctx.rotate(angle); ctx.translate(15, 0);
            ctx.strokeStyle = '#8e44ad'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, 0, 12, -Math.PI/2, Math.PI/2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(0, 12); ctx.stroke();
        } else if (id === 'arcanista' || id === 'druida') {
             const angle = Math.atan2(fy, fx);
             ctx.translate(0, -15); ctx.rotate(angle);
             ctx.fillStyle = '#5e3628'; ctx.fillRect(10, -2, 20, 4);
             ctx.fillStyle = color; ctx.beginPath(); ctx.arc(30, 0, 5, 0, Math.PI*2); ctx.fill();
        } else if (id === 'cavaleiro') {
            ctx.fillStyle = '#bdc3c7'; ctx.translate(12, -10); ctx.rotate(0.5);
            ctx.fillRect(0, -15, 4, 25); ctx.fillStyle = '#7f8c8d'; ctx.fillRect(-4, 0, 12, 3);
        } else if (id === 'ladino') {
            ctx.fillStyle = '#ecf0f1'; ctx.fillRect(12, -5, 3, 12); ctx.fillRect(-15, -5, 3, 12);
        } else if (id === 'berserker') {
            ctx.fillStyle = '#8B4513'; ctx.translate(14, -10); ctx.fillRect(0, -20, 4, 35);
            ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(2, -15, 10, 0, Math.PI, true); ctx.fill();
        }
        ctx.restore();
    }

    static drawBoss(ctx, color) {
        ctx.fillStyle = '#2c3e50'; ctx.fillRect(-25,-35,50,50); 
        ctx.fillStyle = color; ctx.fillRect(-15,-25,30,30);
        ctx.fillStyle = 'red'; ctx.fillRect(-12, -20, 8, 8); ctx.fillRect(4, -20, 8, 8);
    }
    static drawMiniBoss(ctx, color) {
        ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0,-30); ctx.lineTo(20,0); ctx.lineTo(0,30); ctx.lineTo(-20,0); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    }
    static drawEnemy(ctx, id, color, level) {
        ctx.fillStyle = color;
        if (level >= 5) { ctx.fillStyle = '#95a5a6'; ctx.fillRect(-12,-28,24,28); ctx.fillStyle = color; ctx.fillRect(-8,-20,16,16); } 
        else { ctx.fillRect(-10,-24,20,24); }
    }
    static drawTree(ctx, e) {
        ctx.save(); ctx.translate(e.x, e.y);
        ctx.fillStyle = '#5d4037'; ctx.fillRect(-5, -10, 10, 20);
        ctx.fillStyle = '#2d6a4f'; ctx.beginPath(); ctx.moveTo(0, -50); ctx.lineTo(-20, -10); ctx.lineTo(20, -10); ctx.fill();
        ctx.restore();
    }
    static drawCactus(ctx, e) {
        ctx.save(); ctx.translate(e.x, e.y);
        ctx.fillStyle = '#27ae60'; 
        ctx.fillRect(-6, -40, 12, 40); ctx.fillRect(-15, -25, 10, 6); ctx.fillRect(-15, -35, 6, 10);
        ctx.fillRect(5, -20, 10, 6); ctx.fillRect(11, -30, 6, 10);
        ctx.restore();
    }
}

// ================== LÓGICA DO JOGO INTEGRADA ==================
class SurvivalGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.keys = {}; 
        this.gameObjects = []; 
        this.decorations = []; 
        this.floatingTexts = [];
        this.projectiles = []; 
        
        // SISTEMAS AUXILIARES
        this.comboSystem = new ComboSystem();
        this.abilitySystem = null; // Inicia ao criar player
        this.audioManager = typeof audioManager !== 'undefined' ? audioManager : null;

        this.currentBiomeIndex = 0; 
        this.bossActive = false; 
        this.miniBossSpawned = false; 
        this.miniBossDefeated = false;
        
        this.resizeCanvas(); 
        window.addEventListener('resize', () => this.resizeCanvas());
        this.setupInputs(); 
        this.setupMobileControls();
        
        // Loop principal
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
            // Música do bioma
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
                <div style="font-size:0.7rem">HP:${c.baseHp} ATK:${c.baseDamage}</div>
            `;
            div.onclick = () => {
                gameEngine.createPlayer(c);
                this.abilitySystem = new AbilitySystem(gameEngine.player); // INICIA SISTEMA DE HABILIDADES
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
        for(let i=0; i<60; i++) {
            this.decorations.push({ 
                x: Math.random()*3000-1500, 
                y: Math.random()*3000-1500, 
                type: 'decoration', 
                style: decoType
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
        const diff = 1 + Math.floor(gameEngine.biomeKills / 3);

        let data;
        if(isBoss) data = GAME_DATA.bosses.find(b=>b.id===biome.boss);
        else if(forcedType) data = GAME_DATA.enemies.find(e=>e.id===forcedType);
        else data = GAME_DATA.enemies.find(e=>e.id===biome.enemies[Math.floor(Math.random()*biome.enemies.length)]);

        if(!data) return;
        const enemy = gameEngine.createEnemy(data, isBoss, isMiniBoss, diff);
        
        const angle = Math.random()*Math.PI*2;
        const dist = isBoss ? 700 : (400 + Math.random()*300);
        enemy.x = gameEngine.player.x + Math.cos(angle)*dist;
        enemy.y = gameEngine.player.y + Math.sin(angle)*dist;
        this.gameObjects.push(enemy);

        if(isBoss) {
            this.showFloatingText("BOSS FINAL!", gameEngine.player.x, gameEngine.player.y-150, '#f00');
            if(this.audioManager) this.audioManager.play('ability_berserker'); // Som de alerta
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
        
        // Facing logic
        if (dx !== 0 || dy !== 0) {
            p.facing = { x: dx, y: dy };
            const l = Math.hypot(dx, dy);
            if(l > 0) { p.facing.x /= l; p.facing.y /= l; }
        } else if(!p.facing) p.facing = {x: 0, y: 1};

        // Aplicar movimento
        if(dx !== 0 || dy !== 0) {
            const len = Math.hypot(dx,dy);
            const moveX = (dx/len)*p.speed*dt;
            const moveY = (dy/len)*p.speed*dt;

            let canMove = true;
            for(let t of this.decorations) {
                if(Math.hypot((p.x+moveX)-t.x, (p.y+moveY)-t.y) < 30) { canMove = false; break; }
            }
            if(canMove) { p.x += moveX; p.y += moveY; }
        }
        
        // 2. ABILITIES (Teclas)
        if(this.keys['q'] && this.abilitySystem) {
            if(!this.qPressed) {
                this.qPressed = true;
                this.abilitySystem.useAbility(this); // Passa a instância 'game'
            }
        } else { this.qPressed = false; }

        // 3. ATAQUE BÁSICO (Espaço ou Auto)
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
            
            // Colisão Projétil -> Inimigo
            if(proj.fromPlayer) {
                for(let enemy of this.gameObjects) {
                    const hitSize = 40 * (enemy.scale||1);
                    if(Math.hypot(proj.x - enemy.x, proj.y - enemy.y) < hitSize) {
                        // Dano + Combo
                        const res = gameEngine.playerAttack(enemy);
                        const combo = this.comboSystem.recordHit(res.damage);
                        const mult = this.comboSystem.getMultiplier();
                        const finalDmg = Math.floor(res.damage * mult);
                        enemy.currentHp -= (finalDmg - res.damage); // Aplica o extra do combo
                        
                        this.showFloatingText(finalDmg, enemy.x, enemy.y-50*enemy.scale, mult > 1 ? '#f1c40f':'#fff');
                        if(this.audioManager) this.audioManager.play('hit_normal');
                        this.checkEnemyDeath(enemy);
                        return false; // Destrói projétil
                    }
                }
            }
            return proj.life > 0;
        });

        // 5. INIMIGOS
        const now = performance.now();
        this.gameObjects.forEach(e => {
            if(isNaN(e.x)) e.x = p.x+500;
            const dist = Math.hypot(p.x-e.x, p.y-e.y);
            const stop = 30 * (e.scale||1);
            
            if(dist > stop) {
                e.x += (p.x-e.x)/dist * e.speed * dt;
                e.y += (p.y-e.y)/dist * e.speed * dt;
            }
            if(dist < stop+10 && now-e.lastAttack > 1000) {
                const dmg = gameEngine.enemyAttack(e);
                this.showFloatingText(`-${dmg.damage}`, p.x, p.y-40, '#f00');
                if(this.audioManager) this.audioManager.play('hit_normal');
                e.lastAttack = now;
                if(p.currentHp<=0) this.gameOver();
            }
        });

        // 6. HUD Textos
        this.floatingTexts = this.floatingTexts.filter(t=>t.life>0);
        this.floatingTexts.forEach(t=>{ t.y-=50*dt; t.life-=dt; });
    }

    handlePlayerAttack() {
        const p = gameEngine.player;
        // Kiting: atira na direção oposta ao movimento (se movendo), ou frente (se parado)
        const shotDirX = p.facing ? -p.facing.x : 0;
        const shotDirY = p.facing ? -p.facing.y : 1;

        if (p.class.type === 'ranged') {
            this.projectiles.push({
                type: 'projectile', fromPlayer: true,
                x: p.x, y: p.y,
                vx: shotDirX * 450,
                vy: shotDirY * 450,
                life: 0.8, color: p.class.color, style: p.class.projectile
            });
            if(this.audioManager) this.audioManager.play('player_attack');
        } else {
            // Melee - Ataque em área
            let hit = false;
            this.gameObjects.forEach(e => {
                const hitSize = 60 * (e.scale||1);
                if(Math.hypot(p.x-e.x, p.y-e.y) < (60+hitSize)) {
                    const res = gameEngine.playerAttack(e);
                    const combo = this.comboSystem.recordHit(res.damage);
                    const mult = this.comboSystem.getMultiplier();
                    const finalDmg = Math.floor(res.damage * mult);
                    e.currentHp -= (finalDmg - res.damage);
                    
                    this.showFloatingText(finalDmg, e.x, e.y-50*e.scale, mult>1?'#f1c40f':'#fff');
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

    showFloatingText(text, x, y, color) { this.floatingTexts.push({ text, x, y, color, life: 1.5 }); }
    
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
        let cx=p.x-this.canvas.width/2; let cy=p.y-this.canvas.height/2;
        if(isNaN(cx)) cx=0;
        this.ctx.save(); this.ctx.translate(-cx,-cy);
        
        // Grid
        this.ctx.strokeStyle='rgba(255,255,255,0.05)'; this.ctx.beginPath();
        for(let x=Math.floor(cx/100)*100; x<cx+this.canvas.width; x+=100) { this.ctx.moveTo(x,cy); this.ctx.lineTo(x,cy+this.canvas.height); }
        for(let y=Math.floor(cy/100)*100; y<cy+this.canvas.height; y+=100) { this.ctx.moveTo(cx,y); this.ctx.lineTo(cx+this.canvas.width,y); }
        this.ctx.stroke();

        // Game Objects
        const all = [...this.gameObjects, p, ...this.decorations, ...this.projectiles];
        all.sort((a,b)=>{
            if(a.isBoss) return 1; if(b.isBoss) return -1;
            return (a.y||0)-(b.y||0);
        });
        all.forEach(e=>PixelRenderer.drawSprite(this.ctx,e,e===p));
        
        // Floating Texts (in world space)
        this.floatingTexts.forEach(t=>{ 
            this.ctx.globalAlpha=t.life; this.ctx.fillStyle=t.color; this.ctx.font='bold 20px Arial'; 
            this.ctx.fillText(t.text,t.x,t.y); 
        });
        this.ctx.restore();

        // === HUD DESENHADO NO CANVAS (Estilo Retro) ===
        this.ctx.globalAlpha=1;
        // Painel Topo Esquerdo
        this.ctx.fillStyle='rgba(0,0,0,0.8)'; this.ctx.strokeStyle='#fff'; this.ctx.lineWidth=2;
        this.ctx.fillRect(10,10,300,110); this.ctx.strokeRect(10,10,300,110);
        
        this.ctx.fillStyle='#fff'; this.ctx.font='16px "Press Start 2P", cursive';
        this.ctx.fillText(p.class.name, 25, 40);
        
        // Stats Texto
        const kills = gameEngine.biomeKills;
        let statusText = "";
        if (!this.miniBossSpawned) statusText = `Elite: ${Math.max(0, 5-kills)} kills`;
        else if (!this.miniBossDefeated) statusText = "DERROTE A ELITE!";
        else if (kills < 10) statusText = `Boss: ${10-kills} kills`;
        else statusText = "O CHEFE VEM AÍ!";

        this.ctx.fillStyle='#ecf0f1'; this.ctx.font='12px "Press Start 2P", cursive';
        this.ctx.fillText(`Nv.${p.level} Kills:${gameEngine.enemiesDefeated}`, 25, 65);
        this.ctx.fillStyle='#f1c40f';
        this.ctx.fillText(statusText, 25, 85);

        // HP BAR
        this.ctx.fillStyle='#333'; this.ctx.fillRect(25,95,270,15);
        this.ctx.fillStyle='#e74c3c'; this.ctx.fillRect(25,95,270*(Math.max(0, p.currentHp)/p.maxHp),15);
        
        // === COMBOS & SKILLS ===
        // Renderizar Cooldown da Skill (Canto Superior Direito)
        if(this.abilitySystem) {
            this.abilitySystem.renderCooldown(this.ctx, this.canvas.width - 60, 20, 40);
        }
        // Renderizar Combo (Abaixo do HP)
        if(this.comboSystem) {
            this.comboSystem.render(this.ctx, 25, 150);
        }
    }
    
    loop() { this.update(0.016); this.draw(); requestAnimationFrame(()=>this.loop()); }
}