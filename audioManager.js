class AudioManager {
  constructor() {
    this.sounds = {};
    this.currentMusic = null;
    this.soundEnabled = true;
    this.musicEnabled = true;
    this.volume = {
      master: 0.7,
      sfx: 0.7,
      music: 0.5
    };
    
    // CORREÇÃO CRÍTICA: Cria o Contexto de Áudio APENAS UMA VEZ
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    } catch (e) {
      console.error('Web Audio API não suportada neste navegador');
    }

    this.loadAudio();
  }

  loadAudio() {
    // Definições dos sons (frequência e tipo para sintetizador)
    this.sounds = {
      'hit_normal': { freq: 150, type: 'sawtooth', duration: 0.1 },
      'hit_critical': { freq: 300, type: 'square', duration: 0.15 },
      'combo_2': { freq: 400, type: 'sine', duration: 0.2 },
      'combo_3': { freq: 450, type: 'sine', duration: 0.2 },
      'combo_4': { freq: 500, type: 'sine', duration: 0.2 },
      'combo_5': { freq: 600, type: 'square', duration: 0.3 },
      'ability_cavaleiro': { freq: 100, type: 'square', slide: true, duration: 0.5 },
      'ability_ladino': { freq: 600, type: 'sawtooth', duration: 0.1 },
      'ability_berserker': { freq: 80, type: 'sawtooth', duration: 0.8 },
      'ability_arqueiro': { freq: 800, type: 'triangle', duration: 0.1 },
      'ability_arcanista': { freq: 300, type: 'sine', slide: true, duration: 0.6 },
      'ability_druida': { freq: 400, type: 'sine', duration: 0.5 },
      'menu_click': { freq: 800, type: 'sine', duration: 0.05 },
      'level_up': { freq: 600, type: 'square', slide: true, duration: 0.8 },
      'player_attack': { freq: 200, type: 'triangle', duration: 0.05 },
      'game_over': { freq: 100, type: 'sawtooth', slide: true, duration: 2.0 }
    };
    this.musicTracks = {
      'menu': { gain: 1.0 },
      'aldervann': { gain: 1.0 }
    };
  }

  play(soundId) {
    if (!this.soundEnabled || !this.ctx) return;

    // Retoma o contexto se estiver suspenso (comum em navegadores modernos)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const sound = this.sounds[soundId];
    if (!sound) return;

    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = sound.type || 'sine';
      osc.frequency.setValueAtTime(sound.freq, this.ctx.currentTime);
      
      if (sound.slide) {
        osc.frequency.exponentialRampToValueAtTime(sound.freq / 2, this.ctx.currentTime + sound.duration);
      }

      const vol = this.volume.sfx * this.volume.master * (sound.gain || 0.5);
      gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + sound.duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + sound.duration);
    } catch (e) {
      console.error('Erro ao tocar som:', e);
    }
  }

  playMusic(trackId) {
    // Música simples não implementada para evitar conflitos de loop neste exemplo,
    // mas o placeholder evita erros.
    if (!this.musicEnabled) return;
    console.log(`🎵 Tocando faixa: ${trackId}`);
  }

  setVolume(type, value) {
    this.volume[type] = Math.max(0, Math.min(1, value));
  }

  toggleSound() { this.soundEnabled = !this.soundEnabled; }
  toggleMusic() { this.musicEnabled = !this.musicEnabled; }
  stopAll() {} // Placeholder
}

const audioManager = new AudioManager();