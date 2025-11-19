const GAME_DATA = {
  classes: [
    // MELEE
    { id: 'cavaleiro', name: 'Cavaleiro', icon: '🛡️', color: '#f1c40f', baseHp: 180, baseDamage: 20, baseDefense: 15, baseSpeed: 90, description: 'Tanque. Aguenta muita pancada.', type: 'melee', weapon: 'sword' },
    { id: 'ladino', name: 'Ladino', icon: '🗡️', color: '#e74c3c', baseHp: 110, baseDamage: 35, baseDefense: 5, baseSpeed: 145, description: 'Rápido. Críticos letais.', type: 'melee', weapon: 'dagger' },
    { id: 'berserker', name: 'Berserker', icon: '🪓', color: '#d35400', baseHp: 150, baseDamage: 40, baseDefense: 8, baseSpeed: 105, description: 'Dano em área massivo.', type: 'melee', weapon: 'axe' },
    // RANGED
    { id: 'arqueiro', name: 'Arqueiro', icon: '🏹', color: '#2ecc71', baseHp: 100, baseDamage: 25, baseDefense: 4, baseSpeed: 135, description: 'Metralhadora de flechas.', type: 'ranged', projectile: 'arrow', weapon: 'bow' },
    { id: 'arcanista', name: 'Arcanista', icon: '🔮', color: '#9b59b6', baseHp: 90, baseDamage: 45, baseDefense: 2, baseSpeed: 110, description: 'Mago nuclear.', type: 'ranged', projectile: 'magic', weapon: 'staff' },
    { id: 'druida', name: 'Druida', icon: '🌿', color: '#1abc9c', baseHp: 130, baseDamage: 20, baseDefense: 8, baseSpeed: 115, description: 'Sobrevivente versátil.', type: 'ranged', projectile: 'leaf', weapon: 'staff' }
  ],

  enemies: [
    { id: 'goblin', name: 'Goblin', hp: 40, damage: 10, defense: 2, xpReward: 15, color: '#27ae60', type: 'melee', weapon: 'dagger', shape: 'goblin' },
    { id: 'wolf', name: 'Lobo', hp: 50, damage: 12, defense: 3, xpReward: 20, color: '#95a5a6', type: 'beast' },
    { id: 'skeleton', name: 'Esqueleto', hp: 60, damage: 15, defense: 4, xpReward: 25, color: '#bdc3c7', type: 'ranged', weapon: 'bow', shape: 'skeleton' },
    { id: 'bandit', name: 'Bandido', hp: 70, damage: 18, defense: 5, xpReward: 30, color: '#e17055', type: 'melee', weapon: 'axe', shape: 'human' }, // NOVO
    { id: 'scorpion', name: 'Escorpião', hp: 80, damage: 22, defense: 10, xpReward: 35, color: '#e67e22', type: 'beast' },
    { id: 'ice_wolf', name: 'Lobo Glacial', hp: 90, damage: 25, defense: 5, xpReward: 40, color: '#74b9ff', type: 'beast' },
    { id: 'yeti', name: 'Yeti', hp: 120, damage: 30, defense: 15, xpReward: 50, color: '#dfe6e9', type: 'melee', weapon: 'axe', shape: 'brute' },
    { id: 'corrupted_ent', name: 'Ent', hp: 150, damage: 35, defense: 20, xpReward: 60, color: '#2d3436', type: 'melee', weapon: 'axe', shape: 'brute' },
    { id: 'spirit', name: 'Espírito', hp: 60, damage: 40, defense: 0, xpReward: 55, color: '#a29bfe', type: 'ranged', weapon: 'staff', shape: 'ghost' },
    { id: 'golem', name: 'Golem', hp: 200, damage: 50, defense: 30, xpReward: 80, color: '#6c5ce7', type: 'melee', weapon: 'axe', shape: 'brute' },
    { id: 'specter', name: 'Espectro', hp: 80, damage: 60, defense: 10, xpReward: 70, color: '#00cec9', type: 'ranged', weapon: 'staff', shape: 'ghost' }
  ],

  bosses: [
      { id: 'orc_king', name: 'Rei Orc', hp: 1000, damage: 40, defense: 20, xpReward: 1000, color: '#e74c3c', weapon: 'axe', type: 'melee', shape: 'brute' },
      { id: 'ancient_wolf', name: 'Lobo Ancestral', hp: 1200, damage: 50, defense: 15, xpReward: 1200, color: '#dfe6e9', weapon: 'sword', type: 'melee' }, 
      { id: 'spider_queen', name: 'Rainha Aranha', hp: 1500, damage: 60, defense: 25, xpReward: 1500, color: '#8e44ad', weapon: 'dagger', type: 'melee' },
      { id: 'deep_troll', name: 'Troll Profundo', hp: 2000, damage: 80, defense: 40, xpReward: 2000, color: '#2d3436', weapon: 'axe', type: 'melee', shape: 'brute' },
      { id: 'maedron', name: 'Maedron', hp: 3000, damage: 100, defense: 60, xpReward: 5000, color: '#000', weapon: 'staff', type: 'ranged', shape: 'ghost' }
  ],

  biomes: [
    {
      id: 'aldervann',
      name: 'Aldervann',
      bgColor: '#1e272e', 
      decoration: 'tree', 
      enemies: ['goblin', 'wolf', 'skeleton', 'bandit'], // MAIS INIMIGOS AQUI
      boss: 'orc_king',
      introText: "Aldervann: Os campos escuros onde os goblins e bandidos espreitam.",
      victoryText: "Com o Rei Orc derrotado, a marca em sua mão brilha."
    },
    {
      id: 'varundar',
      name: 'Varundar',
      bgColor: '#636e72', decoration: 'crystal',
      enemies: ['ice_wolf', 'yeti', 'bandit'], 
      boss: 'ancient_wolf',
      introText: "Varundar: O frio congela até a alma.",
      victoryText: "O Lobo Ancestral cai."
    },
    {
      id: 'mirvalia',
      name: 'Mirvalia',
      bgColor: '#d35400', decoration: 'cactus',
      enemies: ['skeleton', 'scorpion', 'bandit'], 
      boss: 'spider_queen',
      introText: "Mirvalia: O deserto vermelho.",
      victoryText: "A Aranha Rainha foi banida."
    },
    {
      id: 'sylwood',
      name: 'Sylwood',
      bgColor: '#006266', decoration: 'twisted_tree',
      enemies: ['corrupted_ent', 'spirit', 'wolf'], 
      boss: 'deep_troll',
      introText: "Sylwood: A floresta que sussurra.",
      victoryText: "A floresta se cura."
    },
    {
      id: 'eltharis',
      name: 'Eltharis',
      bgColor: '#2c3e50', decoration: 'ruins',
      enemies: ['golem', 'specter', 'spirit'], 
      boss: 'maedron',
      introText: "Eltharis: A cidade das ruínas arcanas.",
      victoryText: "Maedron caiu. Você salvou Elandor."
    }
  ],

  story: {
      intro: {
          title: "O Último Eco",
          text: "O Eco escolheu você para purificar Elandor."
      },
      epilogue: {
          title: "O Destino de Elandor",
          text: "Você venceu. O mundo está salvo."
      }
  }
};