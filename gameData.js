const GAME_DATA = {
  classes: [
    { id: 'cavaleiro', name: 'Cavaleiro', icon: '🛡️', color: '#f1c40f', baseHp: 160, baseDamage: 18, baseDefense: 12, baseSpeed: 95, description: 'Tanque defensivo.', type: 'melee', weapon: 'sword' },
    { id: 'ladino', name: 'Ladino', icon: '🗡️', color: '#e74c3c', baseHp: 100, baseDamage: 28, baseDefense: 4, baseSpeed: 140, description: 'Assassino rápido.', type: 'melee', weapon: 'dagger' },
    { id: 'berserker', name: 'Berserker', icon: '🪓', color: '#d35400', baseHp: 140, baseDamage: 32, baseDefense: 6, baseSpeed: 100, description: 'Dano máximo.', type: 'melee', weapon: 'axe' },
    { id: 'arqueiro', name: 'Arqueiro', icon: '🏹', color: '#2ecc71', baseHp: 95, baseDamage: 20, baseDefense: 3, baseSpeed: 130, description: 'Velocidade + Precisão.', type: 'ranged', projectile: 'arrow', weapon: 'bow' },
    { id: 'arcanista', name: 'Arcanista', icon: '🔮', color: '#9b59b6', baseHp: 85, baseDamage: 35, baseDefense: 1, baseSpeed: 105, description: 'Alto dano à distância.', type: 'ranged', projectile: 'magic', weapon: 'staff' },
    { id: 'druida', name: 'Druida', icon: '🌿', color: '#1abc9c', baseHp: 120, baseDamage: 16, baseDefense: 7, baseSpeed: 110, description: 'Híbrido com cura.', type: 'ranged', projectile: 'leaf', weapon: 'staff' }
  ],

  enemies: [
    { id: 'goblin', name: 'Goblin', hp: 40, damage: 10, defense: 2, xpReward: 15, color: '#2ecc71', type: 'melee', weapon: 'dagger', shape: 'goblin' },
    { id: 'wolf', name: 'Lobo', hp: 50, damage: 12, defense: 3, xpReward: 20, color: '#95a5a6', type: 'beast' },
    { id: 'ice_wolf', name: 'Lobo Glacial', hp: 70, damage: 15, defense: 5, xpReward: 30, color: '#74b9ff', type: 'beast' },
    { id: 'yeti', name: 'Yeti', hp: 90, damage: 20, defense: 8, xpReward: 40, color: '#dfe6e9', type: 'melee', weapon: 'axe', shape: 'brute' },
    { id: 'skeleton', name: 'Esqueleto', hp: 60, damage: 15, defense: 4, xpReward: 25, color: '#bdc3c7', type: 'ranged', weapon: 'bow', shape: 'skeleton' },
    { id: 'scorpion', name: 'Escorpião', hp: 80, damage: 22, defense: 10, xpReward: 35, color: '#e67e22', type: 'beast' },
    { id: 'corrupted_ent', name: 'Ent', hp: 110, damage: 25, defense: 12, xpReward: 50, color: '#2d3436', type: 'melee', weapon: 'axe', shape: 'brute' },
    { id: 'spirit', name: 'Espírito', hp: 50, damage: 30, defense: 0, xpReward: 45, color: '#a29bfe', type: 'ranged', weapon: 'staff', shape: 'ghost' },
    { id: 'golem', name: 'Golem', hp: 150, damage: 35, defense: 20, xpReward: 70, color: '#6c5ce7', type: 'melee', weapon: 'axe', shape: 'brute' },
    { id: 'specter', name: 'Espectro', hp: 70, damage: 45, defense: 5, xpReward: 60, color: '#00cec9', type: 'ranged', weapon: 'staff', shape: 'ghost' }
  ],

  bosses: [
      { id: 'orc_king', name: 'Rei Orc', hp: 600, damage: 35, defense: 15, xpReward: 500, color: '#e74c3c', weapon: 'axe', type: 'melee', shape: 'brute' },
      { id: 'ancient_wolf', name: 'Lobo Ancestral', hp: 700, damage: 40, defense: 10, xpReward: 700, color: '#dfe6e9', weapon: 'sword', type: 'melee' }, 
      { id: 'spider_queen', name: 'Rainha Aranha', hp: 800, damage: 45, defense: 20, xpReward: 800, color: '#8e44ad', weapon: 'dagger', type: 'melee' },
      { id: 'deep_troll', name: 'Troll Profundo', hp: 1000, damage: 60, defense: 30, xpReward: 1000, color: '#2d3436', weapon: 'axe', type: 'melee', shape: 'brute' },
      { id: 'maedron', name: 'Maedron', hp: 2000, damage: 60, defense: 50, xpReward: 5000, color: '#000', weapon: 'staff', type: 'ranged', shape: 'ghost' }
  ],

  biomes: [
    {
      id: 'aldervann',
      name: 'Aldervann',
      bgColor: '#1e272e', 
      decoration: 'tree', 
      enemies: ['goblin', 'wolf'], 
      boss: 'orc_king',
      initialEnemies: 6,
      introText: "Aldervann: Os campos escuros onde os goblins espreitam.",
      victoryText: "Com o Rei Orc derrotado, a marca em sua mão brilha. Os cavaleiros de Aldervann agora veem você como uma esperança."
    },
    {
      id: 'varundar',
      name: 'Varundar',
      bgColor: '#636e72', 
      decoration: 'crystal', 
      enemies: ['ice_wolf', 'yeti'], 
      boss: 'ancient_wolf',
      initialEnemies: 7,
      introText: "Varundar: O frio congela até a alma.",
      victoryText: "O Lobo Ancestral cai e o vento se acalma. Eldric avisa: 'Maedron tentou puxar energia daqui'. O Umbral observa você."
    },
    {
      id: 'mirvalia',
      name: 'Mirvalia',
      bgColor: '#d35400', 
      decoration: 'cactus', 
      enemies: ['skeleton', 'scorpion'], 
      boss: 'spider_queen',
      initialEnemies: 8,
      introText: "Mirvalia: O deserto vermelho.",
      victoryText: "A Aranha Rainha foi banida. Nas ruínas, inscrições repetem o nome MAEDRON. Ele esteve aqui antes do Eclipse."
    },
    {
      id: 'sylwood',
      name: 'Sylwood',
      bgColor: '#006266', 
      decoration: 'twisted_tree', 
      enemies: ['corrupted_ent', 'spirit'], 
      boss: 'deep_troll',
      initialEnemies: 8,
      introText: "Sylwood: A floresta que sussurra.",
      victoryText: "A floresta se cura. A Rainha Lyris sussurra: 'Eltharis deixará de ser um reino e se tornará um portal'. Você deve ir para lá."
    },
    {
      id: 'eltharis',
      name: 'Eltharis',
      bgColor: '#2c3e50', 
      decoration: 'ruins', 
      enemies: ['golem', 'specter'], 
      boss: 'maedron',
      initialEnemies: 10,
      introText: "Eltharis: A cidade das ruínas arcanas.",
      victoryText: "Maedron caiu. O Umbral recua. Você se tornou a lenda viva de Elandor, o Portador do Último Eco."
    }
  ],

  story: {
      intro: {
          title: "O Último Eco",
          text: "Numa vila modesta, criaturas sombrias atacaram. Tentando escapar, você toca um cristal antigo e uma luz intensa envolve seu corpo.<br><br>O velho Eldric aparece: 'O Eco escolheu você. Elandor inteiro vai sentir isso... alguns vão querer sua ajuda. Outros, a sua morte.'<br><br>Sua jornada começa agora."
      },
      epilogue: {
          title: "O Destino de Elandor",
          text: "A batalha terminou. O poder do Eco pulsa em sua mão. Você salvou o mundo, mas o poder mudou você para sempre.<br><br>As Crônicas de Elandor agora contam a sua história.<br><br>Obrigado por jogar!"
      }
  }
};