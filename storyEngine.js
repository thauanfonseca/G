class StoryEngine {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.progress = { introSeen: false };
        this.titleEl = document.getElementById('story-title');
        this.textEl = document.getElementById('story-text');
        this.nextBtn = document.getElementById('story-next-btn');
        
        // Garante que o evento de clique existe
        if(this.nextBtn) {
            this.nextBtn.onclick = () => {
                this.handleNextClick();
            };
        }
    }

    handleNextClick() {
        // Se tiver uma ação programada, executa
        if (this.pendingAction) {
            const action = this.pendingAction;
            this.pendingAction = null; // Limpa para não repetir
            action();
        } else {
            // Se não tiver, volta para o jogo (segurança)
            this.game.showScreen('game-screen');
        }
    }

    showStoryScreen(title, text, onComplete) {
        this.pendingAction = onComplete; // Armazena a ação
        
        if(this.titleEl) this.titleEl.innerHTML = title;
        if(this.textEl) this.textEl.innerHTML = text;
        
        this.game.showScreen('story-screen');
    }

    startNewGameWithIntro() {
        const story = GAME_DATA.story.intro;
        this.showStoryScreen(story.title, story.text, () => {
            this.progress.introSeen = true;
            this.game.showClassSelection();
        });
    }

    showBiomeStory(biomeId, onComplete) {
        const biomeData = GAME_DATA.biomes.find(b => b.id === biomeId);
        let title = "";
        let text = "";

        // Prioriza texto específico do bioma se existir no gameData.story (não usado no momento mas preparado)
        // Se não, usa o introText do bioma
        if (biomeData && biomeData.introText) {
            title = biomeData.name;
            text = biomeData.introText;
        }

        if (text) {
            this.showStoryScreen(title, text, onComplete);
        } else {
            onComplete();
        }
    }

    showVictoryStory(biomeId, onComplete) {
        const biomeData = GAME_DATA.biomes.find(b => b.id === biomeId);
        if (biomeData && biomeData.victoryText) {
            this.showStoryScreen(`${biomeData.name} - Concluído`, biomeData.victoryText, onComplete);
        } else {
            onComplete();
        }
    }
    
    showEpilogue() {
        const story = GAME_DATA.story.epilogue;
        this.showStoryScreen(story.title, story.text, () => {
            location.reload(); 
        });
    }

    // Fallback para HTML antigo
    nextChapter() {
        this.handleNextClick();
    }
}