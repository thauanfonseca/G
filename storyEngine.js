class StoryEngine {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.progress = { introSeen: false };
        this.titleEl = document.getElementById('story-title');
        this.textEl = document.getElementById('story-text');
        this.nextBtn = document.getElementById('story-next-btn');
        this.currentAction = null; // Armazena o que fazer ao clicar no botão
        
        if(this.nextBtn) {
            this.nextBtn.onclick = () => {
                if(this.currentAction) {
                    this.currentAction(); // Executa a função guardada (ex: enterNextBiome)
                } else {
                    // Fallback se não houver ação
                    this.game.showScreen('game-screen');
                }
            };
        }
    }

    showStoryScreen(title, text, onComplete) {
        this.currentAction = onComplete; // Guarda a função para ser chamada no clique
        this.game.showScreen('story-screen');
        if(this.titleEl) this.titleEl.innerHTML = title;
        if(this.textEl) this.textEl.innerHTML = text;
    }

    // Início do Jogo
    startNewGameWithIntro() {
        const story = GAME_DATA.story.intro;
        this.showStoryScreen(story.title, story.text, () => {
            this.progress.introSeen = true;
            this.game.showClassSelection();
        });
    }

    // Final do Jogo
    showEpilogue() {
        const story = GAME_DATA.story.epilogue;
        this.showStoryScreen(story.title, story.text, () => {
            location.reload(); 
        });
    }

    // Método legado de compatibilidade, se chamado diretamente
    nextChapter() {
        if(this.currentAction) this.currentAction();
    }
}