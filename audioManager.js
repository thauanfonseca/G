// audioManager.js – Sistema de Áudio Completo

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
    this.loadAudio();
  }

  loadAudio() {
    // Exemplo simples para placeholder (beep curto com Web Audio API)
    this.sounds = {
      'hit_normal': { gain: 0.5 },
      'hit_critical': { gain: 0.6 },
      'combo_2': { gain: 0.5 },
      'combo_3': { gain: 0.6 },
      'combo_4': { gain: 0.7 },
      'combo_5': { gain: 0.8 },
      'ability_cavaleiro': { gain: 0.6 },
      'ability_ladino': { gain: 0.5 },
      'ability_berserker': { gain: 0.7 },
      'ability_arqueiro': { gain: 0.6 },
      'ability_arcanista': { gain: 0.8 },
      'ability_druida': { gain: 0.5 },
      'menu_click': { gain: 0.4 },
      'level_up': { gain: 0.6 },
      // outros...
    };
    this.musicTracks = {
      'menu': { gain: 1.0 },
      'aldervann': { gain: 1.0 },
      // outros biomas...
    };
  }

  play(soundId) {
    if (!this.soundEnabled || !this.sounds[soundId]) return;

    try {
      if (typeof window.AudioContext !== 'undefined' || typeof window.webkitAudioContext !== 'undefined') {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 400;
        gainNode.gain.setValueAtTime(this.volume.sfx * this.volume.master * 0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      }
    } catch (e) {
      console.log('Audio not available:', e);
    }
  }

  playMusic(trackId) {
    if (!this.musicEnabled || !this.musicTracks[trackId]) return;
    console.log(`🎵 Playing music: ${trackId}`);
    this.currentMusic = trackId;
  }

  setVolume(type, value) {
    this.volume[type] = Math.max(0, Math.min(1, value));
    console.log(`📊 ${type} volume set to ${Math.floor(value * 100)}%`);
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    console.log(`🔊 Sound ${this.soundEnabled ? 'ON' : 'OFF'}`);
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    console.log(`🎵 Music ${this.musicEnabled ? 'ON' : 'OFF'}`);
  }

  stopAll() {
    this.currentMusic = null;
    console.log('⏹️ All audio stopped');
  }
}

const audioManager = new AudioManager();
