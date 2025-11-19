class StoryEngine {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.progress = { introSeen: false };
        
        // Elementos da UI (Garante que existem antes de tentar acessar)
        this.titleEl = document.getElementById('story-title');
        this.textEl = document.getElementById('story-text');
        this.nextBtn = document.getElementById('story-next-btn');
    }

    // Esta é a função que o botão "Nova Jornada" chama
    startNewGameWithIntro() {
        // Se já viu a intro, vai direto para seleção de classe
        if (this.progress.introSeen) {
            this.game.showClassSelection();
        } else {
            // Caso contrário, mostra a história inicial
            this.showPrologue();
        }
    }

    showPrologue() {
        // Muda para a tela de história
        this.game.showScreen('story-screen');
        
        const title = "O Despertar";
        const text = "O Eclipse Vermelho corrompeu Elandor.<br><br>Você é o último Guardião.<br><br>Escolha seu herói e sobreviva à escuridão.";

        if(this.titleEl) this.titleEl.innerHTML = title;
        if(this.textEl) this.textEl.innerHTML = text;

        // Configura o botão "Continuar" da história
        if(this.nextBtn) {
            this.nextBtn.onclick = () => {
                this.progress.introSeen = true;
                this.game.showClassSelection();
            };
        }
    }

    nextChapter() {
        // Função de segurança caso chamada manualmente
        this.game.showClassSelection();
    }
}