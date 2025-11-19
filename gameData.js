const GAME_DATA = {
  classes: [
    // MELEE
    { id: 'cavaleiro', name: 'Cavaleiro', icon: '🛡️', color: '#f1c40f', baseHp: 160, baseDamage: 18, baseDefense: 12, baseSpeed: 95, description: 'Tanque defensivo.', type: 'melee', weapon: 'sword' },
    { id: 'ladino', name: 'Ladino', icon: '🗡️', color: '#e74c3c', baseHp: 100, baseDamage: 28, baseDefense: 4, baseSpeed: 140, description: 'Assassino rápido.', type: 'melee', weapon: 'dagger' },
    { id: 'berserker', name: 'Berserker', icon: '🪓', color: '#d35400', baseHp: 140, baseDamage: 32, baseDefense: 6, baseSpeed: 100, description: 'Dano máximo.', type: 'melee', weapon: 'axe' },
    // RANGED
    { id: 'arqueiro', name: 'Arqueiro', icon: '🏹', color: '#2ecc71', baseHp: 95, baseDamage: 20, baseDefense: 3, baseSpeed: 130, description: 'Velocidade + Precisão.', type: 'ranged', projectile: 'arrow', weapon: 'bow' },
    { id: 'arcanista', name: 'Arcanista', icon: '🔮', color: '#9b59b6', baseHp: 85, baseDamage: 35, baseDefense: 1, baseSpeed: 105, description: 'Alto dano à distância.', type: 'ranged', projectile: 'magic', weapon: 'staff' },
    { id: 'druida', name: 'Druida', icon: '🌿', color: '#1abc9c', baseHp: 120, baseDamage: 16, baseDefense: 7, baseSpeed: 110, description: 'Híbrido com cura.', type: 'ranged', projectile: 'leaf', weapon: 'staff' }
  ],

  enemies: [
    { id: 'goblin', name: 'Goblin', hp: 40, damage: 10, defense: 2, xpReward: 15, color: '#2ecc71', type: 'melee' },
    { id: 'wolf', name: 'Lobo', hp: 50, damage: 12, defense: 3, xpReward: 20, color: '#95a5a6', type: 'beast' },
    { id: 'ice_wolf', name: 'Lobo Glacial', hp: 70, damage: 15, defense: 5, xpReward: 30, color: '#74b9ff', type: 'beast' },
    { id: 'yeti', name: 'Yeti Menor', hp: 90, damage: 20, defense: 8, xpReward: 40, color: '#dfe6e9', type: 'melee' },
    { id: 'skeleton', name: 'Esqueleto', hp: 60, damage: 18, defense: 4, xpReward: 25, color: '#bdc3c7', type: 'melee' },
    { id: 'scorpion', name: 'Escorpião', hp: 80, damage: 22, defense: 10, xpReward: 35, color: '#e67e22', type: 'beast' },
    { id: 'corrupted_ent', name: 'Ent Corrompido', hp: 110, damage: 25, defense: 12, xpReward: 50, color: '#2d3436', type: 'melee' },
    { id: 'spirit', name: 'Espírito', hp: 50, damage: 30, defense: 0, xpReward: 45, color: '#a29bfe', type: 'magic' },
    { id: 'golem', name: 'Golem', hp: 150, damage: 35, defense: 20, xpReward: 70, color: '#6c5ce7', type: 'melee' },
    { id: 'specter', name: 'Espectro', hp: 70, damage: 45, defense: 5, xpReward: 60, color: '#00cec9', type: 'magic' }
  ],

  biomes: [
    {
      id: 'aldervann',
      name: 'Aldervann',
      bgColor: '#1e272e', 
      enemies: ['goblin', 'wolf'], 
      boss: 'goblin_king',
      initialEnemies: 6, // ADICIONADO: Define quantos inimigos nascem
      introText: "Aldervann: Os campos escuros onde os goblins espreitam."
    },
    {
      id: 'varundar',
      name: 'Varundar',
      bgColor: '#636e72', 
      enemies: ['ice_wolf', 'yeti'], 
      boss: 'ancient_wolf',
      initialEnemies: 7,
      introText: "Varundar: O frio congela até a alma."
    },
    {
      id: 'mirvalia',
      name: 'Mirvalia',
      bgColor: '#d35400', 
      enemies: ['skeleton', 'scorpion'], 
      boss: 'spider_queen',
      initialEnemies: 8,
      introText: "Mirvalia: O deserto vermelho."
    },
    {
      id: 'sylwood',
      name: 'Sylwood',
      bgColor: '#006266', 
      enemies: ['corrupted_ent', 'spirit'], 
      boss: 'deep_troll',
      initialEnemies: 8,
      introText: "Sylwood: A floresta que sussurra."
    },
    {
      id: 'eltharis',
      name: 'Eltharis',
      bgColor: '#2c3e50', 
      enemies: ['golem', 'specter'], 
      boss: 'maedron',
      initialEnemies: 10,
      introText: "Eltharis: A cidade das ruínas arcanas."
    }
  ],

  lore: {
    prologue: {
      title: "O Início",
      text: "O Umbral despertou. Escolha seu herói e sobreviva."
    },
    epilogue: {
      title: "Vitória",
      text: "Você limpou o mal de Elandor."
    }
  }
};