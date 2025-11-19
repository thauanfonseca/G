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
        const story = GAME_DATA.story.intro;
        this.showStoryScreen(story.title, story.text, () => {
            this.progress.introSeen = true;
            this.game.showClassSelection();
        });
    }

    showBiomeStory(biomeId, onComplete) {
        const story = GAME_DATA.story[biomeId];
        if(story) {
            this.showStoryScreen(story.title, story.text, onComplete);
        } else {
            onComplete(); // Se não tiver história, pula
        }
    }
    
    showEpilogue() {
        const story = GAME_DATA.story.epilogue;
        this.showStoryScreen(story.title, story.text, () => {
            location.reload(); // Fim do jogo
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
        // Fallback
        this.game.showClassSelection();
    }
}