class StoryEngine {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.progress = { introSeen: false };
        this.titleEl = document.getElementById('story-title');
        this.textEl = document.getElementById('story-text');
        this.nextBtn = document.getElementById('story-next-btn');
    }

    startNewGameWithIntro() {
        if (this.progress.introSeen) {
            this.game.showClassSelection();
        } else {
            this.showPrologue();
        }
    }

    showPrologue() {
        if (!GAME_DATA || !GAME_DATA.story || !GAME_DATA.story.intro) {
            console.error("Dados da história ausentes em gameData.js!");
            this.game.showClassSelection(); // Pula direto se houver erro
            return;
        }
        const story = GAME_DATA.story.intro;
        this.showStoryScreen(story.title, story.text, () => {
            this.progress.introSeen = true;
            this.game.showClassSelection();
        });
    }

    showBiomeStory(biomeId, onComplete) {
        // Se não houver texto específico para o bioma na seção story, procura dentro do bioma
        const biomeData = GAME_DATA.biomes.find(b => b.id === biomeId);
        
        let title = "";
        let text = "";

        if (biomeData && biomeData.victoryText) {
            title = `Vitória em ${biomeData.name}`;
            text = biomeData.victoryText;
        } else if (GAME_DATA.story[biomeId]) {
            title = GAME_DATA.story[biomeId].title;
            text = GAME_DATA.story[biomeId].text;
        }

        if (text) {
            this.showStoryScreen(title, text, onComplete);
        } else {
            onComplete();
        }
    }
    
    showEpilogue() {
        if (!GAME_DATA.story.epilogue) return;
        const story = GAME_DATA.story.epilogue;
        this.showStoryScreen(story.title, story.text, () => {
            location.reload(); 
        });
    }

    showStoryScreen(title, text, callback) {
        this.game.showScreen('story-screen');
        if(this.titleEl) this.titleEl.innerHTML = title;
        if(this.textEl) this.textEl.innerHTML = text;
        
        if(this.nextBtn) {
            this.nextBtn.onclick = callback;
        }
    }

    nextChapter() {
        this.game.showClassSelection();
    }
}