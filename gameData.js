const GAME_DATA = {
  classes: [
    { id: 'cavaleiro', name: 'Cavaleiro', icon: '🛡️', color: '#f1c40f', baseHp: 180, baseDamage: 18, baseDefense: 12, baseSpeed: 95, description: 'Tanque defensivo.', type: 'melee', weapon: 'sword' },
    { id: 'ladino', name: 'Ladino', icon: '🗡️', color: '#e74c3c', baseHp: 110, baseDamage: 30, baseDefense: 4, baseSpeed: 145, description: 'Assassino rápido.', type: 'melee', weapon: 'dagger' },
    { id: 'berserker', name: 'Berserker', icon: '🪓', color: '#d35400', baseHp: 150, baseDamage: 35, baseDefense: 6, baseSpeed: 105, description: 'Dano máximo.', type: 'melee', weapon: 'axe' },
    { id: 'arqueiro', name: 'Arqueiro', icon: '🏹', color: '#2ecc71', baseHp: 100, baseDamage: 22, baseDefense: 3, baseSpeed: 135, description: 'Velocidade + Precisão.', type: 'ranged', projectile: 'arrow', weapon: 'bow' },
    { id: 'arcanista', name: 'Arcanista', icon: '🔮', color: '#9b59b6', baseHp: 90, baseDamage: 40, baseDefense: 2, baseSpeed: 110, description: 'Alto dano à distância.', type: 'ranged', projectile: 'magic', weapon: 'staff' },
    { id: 'druida', name: 'Druida', icon: '🌿', color: '#1abc9c', baseHp: 130, baseDamage: 18, baseDefense: 7, baseSpeed: 115, description: 'Híbrido com cura.', type: 'ranged', projectile: 'leaf', weapon: 'staff' }
  ],

  enemies: [
    { id: 'goblin', name: 'Goblin', hp: 40, damage: 10, defense: 2, xpReward: 15, color: '#27ae60', type: 'melee', weapon: 'dagger', shape: 'goblin' },
    { id: 'wolf', name: 'Lobo', hp: 55, damage: 12, defense: 3, xpReward: 20, color: '#95a5a6', type: 'beast' },
    { id: 'bandit', name: 'Bandido', hp: 65, damage: 15, defense: 4, xpReward: 25, color: '#e17055', type: 'melee', weapon: 'axe', shape: 'human' },
    { id: 'skeleton', name: 'Esqueleto', hp: 60, damage: 14, defense: 4, xpReward: 25, color: '#dfe6e9', type: 'ranged', weapon: 'bow', shape: 'skeleton' },
    { id: 'ice_wolf', name: 'Lobo Glacial', hp: 80, damage: 18, defense: 5, xpReward: 35, color: '#74b9ff', type: 'beast' },
    { id: 'yeti', name: 'Yeti', hp: 120, damage: 25, defense: 10, xpReward: 50, color: '#dfe6e9', type: 'melee', weapon: 'axe', shape: 'brute' },
    { id: 'scorpion', name: 'Escorpião', hp: 85, damage: 22, defense: 10, xpReward: 35, color: '#e67e22', type: 'beast' },
    { id: 'corrupted_ent', name: 'Ent', hp: 160, damage: 30, defense: 15, xpReward: 60, color: '#2d3436', type: 'melee', weapon: 'axe', shape: 'brute' },
    { id: 'spirit', name: 'Espírito', hp: 70, damage: 35, defense: 0, xpReward: 50, color: '#a29bfe', type: 'ranged', weapon: 'staff', shape: 'ghost' },
    { id: 'golem', name: 'Golem', hp: 250, damage: 45, defense: 25, xpReward: 80, color: '#6c5ce7', type: 'melee', weapon: 'axe', shape: 'brute' },
    { id: 'specter', name: 'Espectro', hp: 90, damage: 55, defense: 10, xpReward: 70, color: '#00cec9', type: 'ranged', weapon: 'staff', shape: 'ghost' }
  ],

  bosses: [
      { id: 'orc_king', name: 'Rei Orc', hp: 1000, damage: 35, defense: 15, xpReward: 1000, color: '#e74c3c', weapon: 'axe', type: 'melee', shape: 'brute' },
      { id: 'ancient_wolf', name: 'Lobo Ancestral', hp: 1200, damage: 40, defense: 10, xpReward: 1200, color: '#dfe6e9', weapon: 'sword', type: 'melee' }, 
      { id: 'spider_queen', name: 'Rainha Aranha', hp: 1500, damage: 45, defense: 20, xpReward: 1500, color: '#8e44ad', weapon: 'dagger', type: 'melee' },
      { id: 'deep_troll', name: 'Troll Profundo', hp: 2000, damage: 60, defense: 30, xpReward: 2000, color: '#2d3436', weapon: 'axe', type: 'melee', shape: 'brute' },
      { id: 'maedron', name: 'Maedron', hp: 3000, damage: 80, defense: 50, xpReward: 5000, color: '#000', weapon: 'staff', type: 'ranged', shape: 'ghost' }
  ],

  biomes: [
    {
      id: 'aldervann',
      name: 'Aldervann',
      bgColor: '#1e272e', decoration: 'tree',
      // 2 Tipos de Inimigo
      enemies: ['goblin', 'wolf'], 
      boss: 'orc_king',
      introText: "Aldervann: Os campos escuros onde os goblins espreitam.",
      victoryText: "Com o Rei Orc derrotado, a marca em sua mão brilha. A esperança renasce."
    },
    {
      id: 'varundar',
      name: 'Varundar',
      bgColor: '#636e72', decoration: 'crystal',
      // 3 Tipos de Inimigo
      enemies: ['ice_wolf', 'yeti', 'bandit'], 
      boss: 'ancient_wolf',
      introText: "Varundar: O frio congela até a alma.",
      victoryText: "O Lobo Ancestral cai. Eldric avisa: 'O Umbral observa você'."
    },
    {
      id: 'mirvalia',
      name: 'Mirvalia',
      bgColor: '#d35400', decoration: 'cactus',
      // 4 Tipos de Inimigo
      enemies: ['skeleton', 'scorpion', 'bandit', 'goblin'], 
      boss: 'spider_queen',
      introText: "Mirvalia: O deserto vermelho das ruínas antigas.",
      victoryText: "A Aranha Rainha foi banida. Maedron esteve aqui."
    },
    {
      id: 'sylwood',
      name: 'Sylwood',
      bgColor: '#006266', decoration: 'twisted_tree',
      // 5 Tipos de Inimigo
      enemies: ['corrupted_ent', 'spirit', 'wolf', 'bandit', 'skeleton'], 
      boss: 'deep_troll',
      introText: "Sylwood: A floresta que sussurra e rejeita intrusos.",
      victoryText: "A floresta se cura. O próximo passo é Eltharis."
    },
    {
      id: 'eltharis',
      name: 'Eltharis',
      bgColor: '#2c3e50', decoration: 'ruins',
      // Todos os tipos de elite/magicos
      enemies: ['golem', 'specter', 'spirit', 'yeti', 'corrupted_ent'], 
      boss: 'maedron',
      introText: "Eltharis: A cidade das ruínas arcanas e golems sem mestre.",
      victoryText: "Maedron caiu. Você se tornou a lenda viva de Elandor."
    }
  ],

  story: {
      intro: {
          title: "O Último Eco",
          text: "Numa vila modesta, criaturas sombrias atacaram. Você toca um cristal antigo e o Eco entra em você.<br><br>O velho Eldric aparece: 'O Eco escolheu você. Elandor inteiro vai sentir isso.'<br><br>Sua jornada começa agora."
      },
      epilogue: {
          title: "O Destino de Elandor",
          text: "A batalha terminou. O poder do Eco pulsa em sua mão. Você salvou o mundo.<br><br>As Crônicas de Elandor agora contam a sua história.<br><br>Obrigado por jogar!"
      }
  }
};