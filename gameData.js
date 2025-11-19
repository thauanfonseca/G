const GAME_DATA = {
  classes: [
    { id: 'cavaleiro', name: 'Cavaleiro', icon: '🛡️', color: '#f1c40f', baseHp: 160, baseDamage: 18, baseDefense: 12, baseSpeed: 95, description: 'Tanque defensivo.', type: 'melee', weapon: 'sword' },
    { id: 'ladino', name: 'Ladino', icon: '🗡️', color: '#e74c3c', baseHp: 100, baseDamage: 28, baseDefense: 4, baseSpeed: 140, description: 'Assassino rápido.', type: 'melee', weapon: 'dagger' },
    { id: 'berserker', name: 'Berserker', icon: '🪓', color: '#d35400', baseHp: 140, baseDamage: 32, baseDefense: 6, baseSpeed: 100, description: 'Dano máximo.', type: 'melee', weapon: 'axe' },
    { id: 'arqueiro', name: 'Arqueiro', icon: '🏹', color: '#2ecc71', baseHp: 95, baseDamage: 20, baseDefense: 3, baseSpeed: 130, description: 'Velocidade + Precisão.', type: 'ranged', projectile: 'arrow', weapon: 'bow' },
    { id: 'arcanista', name: 'Arcanista', icon: '🔮', color: '#9b59b6', baseHp: 85, baseDamage: 35, baseDefense: 1, baseSpeed: 105, description: 'Alto dano à distância.', type: 'ranged', projectile: 'magic', weapon: 'staff' },
    { id: 'druida', name: 'Druida', icon: '🌿', color: '#1abc9c', baseHp: 120, baseDamage: 16, baseDefense: 7, baseSpeed: 110, description: 'Híbrido com cura.', type: 'ranged', projectile: 'leaf', weapon: 'staff' }
  ],

  // Definição de Inimigos com armas específicas
  enemies: [
    { id: 'goblin', name: 'Goblin', hp: 40, damage: 10, defense: 2, xpReward: 15, color: '#2ecc71', type: 'melee', weapon: 'dagger' },
    { id: 'wolf', name: 'Lobo', hp: 50, damage: 12, defense: 3, xpReward: 20, color: '#95a5a6', type: 'beast' }, // Beast não usa arma
    { id: 'ice_wolf', name: 'Lobo Glacial', hp: 70, damage: 15, defense: 5, xpReward: 30, color: '#74b9ff', type: 'beast' },
    { id: 'yeti', name: 'Yeti', hp: 90, damage: 20, defense: 8, xpReward: 40, color: '#dfe6e9', type: 'melee', weapon: 'axe' },
    { id: 'skeleton', name: 'Esqueleto', hp: 60, damage: 15, defense: 4, xpReward: 25, color: '#bdc3c7', type: 'ranged', weapon: 'bow' }, // Ranged
    { id: 'scorpion', name: 'Escorpião', hp: 80, damage: 22, defense: 10, xpReward: 35, color: '#e67e22', type: 'beast' },
    { id: 'corrupted_ent', name: 'Ent', hp: 110, damage: 25, defense: 12, xpReward: 50, color: '#2d3436', type: 'melee', weapon: 'axe' },
    { id: 'spirit', name: 'Espírito', hp: 50, damage: 30, defense: 0, xpReward: 45, color: '#a29bfe', type: 'ranged', weapon: 'staff' }, // Ranged
    { id: 'golem', name: 'Golem', hp: 150, damage: 35, defense: 20, xpReward: 70, color: '#6c5ce7', type: 'melee', weapon: 'axe' },
    { id: 'specter', name: 'Espectro', hp: 70, damage: 45, defense: 5, xpReward: 60, color: '#00cec9', type: 'ranged', weapon: 'staff' } // Ranged
  ],

  bosses: [
      { id: 'orc_king', name: 'Rei Orc', hp: 600, damage: 35, defense: 15, xpReward: 500, color: '#e74c3c', weapon: 'axe', type: 'melee' },
      { id: 'ancient_wolf', name: 'Lobo Ancestral', hp: 700, damage: 40, defense: 10, xpReward: 700, color: '#dfe6e9', weapon: 'sword', type: 'melee' }, // Besta gigante
      { id: 'spider_queen', name: 'Rainha Aranha', hp: 800, damage: 45, defense: 20, xpReward: 800, color: '#8e44ad', weapon: 'dagger', type: 'melee' },
      { id: 'deep_troll', name: 'Troll das Profundezas', hp: 1000, damage: 60, defense: 30, xpReward: 1000, color: '#2d3436', weapon: 'axe', type: 'melee' },
      { id: 'maedron', name: 'Maedron', hp: 2000, damage: 60, defense: 50, xpReward: 5000, color: '#000', weapon: 'staff', type: 'ranged' }
  ],

  biomes: [
    {
      id: 'aldervann',
      name: 'Aldervann',
      bgColor: '#1e272e', 
      decoration: 'tree', // Árvores padrão
      enemies: ['goblin', 'wolf'], 
      boss: 'orc_king',
      initialEnemies: 6
    },
    {
      id: 'varundar',
      name: 'Varundar',
      bgColor: '#636e72', 
      decoration: 'crystal', // Cristais de Gelo
      enemies: ['ice_wolf', 'yeti'], 
      boss: 'ancient_wolf',
      initialEnemies: 7
    },
    {
      id: 'mirvalia',
      name: 'Mirvalia',
      bgColor: '#d35400', 
      decoration: 'cactus', // Cactos
      enemies: ['skeleton', 'scorpion'], 
      boss: 'spider_queen',
      initialEnemies: 8
    },
    {
      id: 'sylwood',
      name: 'Sylwood',
      bgColor: '#006266', 
      decoration: 'twisted_tree', // Árvores retorcidas
      enemies: ['corrupted_ent', 'spirit'], 
      boss: 'deep_troll',
      initialEnemies: 8
    },
    {
      id: 'eltharis',
      name: 'Eltharis',
      bgColor: '#2c3e50', 
      decoration: 'ruins', // Ruínas Arcanas
      enemies: ['golem', 'specter'], 
      boss: 'maedron',
      initialEnemies: 10
    }
  ],

  // A HISTÓRIA COMPLETA
  story: {
      intro: {
          title: "O Último Eco",
          text: "Numa vila modesta, distante dos grandes castelos, você vivia uma vida simples. Certo dia, criaturas sombrias atacaram. O chão tremia, os gritos ecoavam. Tentando escapar, você tropeça sobre um fragmento de cristal. Ao tocá-lo, uma luz intensa envolve seu corpo. O Eco entra em você.<br><br>Quando desperta, um velho chamado Eldric diz: 'O Eco escolheu você. Elandor inteiro vai sentir isso... alguns vão querer sua ajuda. Outros, a sua morte.'<br><br>Sua jornada começa em Aldervann."
      },
      aldervann: {
          title: "Aldervann — As Sombras da Honra",
          text: "Você enfrenta goblins e lobos que devastam vilas inteiras. No fim, um Rei Orc, inflado pela energia do Umbral, lidera hordas de monstros. Ao derrotá-lo, a marca do Eco na sua mão reage, purificando a corrupção.<br><br>Pela primeira vez, os cavaleiros de Aldervann enxergam em você não um estranho, mas uma esperança."
      },
      varundar: {
          title: "Varundar — O Uivo do Gelo",
          text: "Nos campos de neve, a trilha leva a cavernas profundas. Um Lobo Ancestral, envolto em aura azulada, foi acordado. O vento de Varundar corta como lâmina. Eldric avisa: 'Maedron tentou puxar energia daqui'.<br><br>Você sente que cada vitória faz o Umbral olhar ainda mais diretamente para você."
      },
      mirvalia: {
          title: "Mirvalia — Veneno nas Areias",
          text: "Mercadores falam de caravanas desaparecidas. Nos túmulos subterrâneos, a Aranha Rainha tece teias de energia sombria. Inscrições antigas revelam o nome repetido: MAEDRON.<br><br>O Arconte esteve sondando o deserto muito antes do Eclipse Vermelho."
      },
      sylwood: {
          title: "Sylwood — A Ira da Floresta",
          text: "A floresta testa você. Espíritos atacam para ver se o portador do Eco é aliado. Um Troll das Profundezas polui as raízes sagradas. A voz da Rainha Lyris sussurra no vento: 'Maedron sente sua presença. Em breve, Eltharis deixará de ser um reino e se tornará um portal.'<br><br>O próximo passo é a República dos Magos."
      },
      eltharis: {
          title: "Eltharis — O Eco Sombrio",
          text: "Uma cidade de torres e bibliotecas vazias. No topo da torre, Maedron aguarda. Ele não se parece mais com um homem. 'Eu tentei moldar o mundo e me chamaram de louco. Você tenta salvá-lo e te chamarão de herói.'<br><br>O confronto final pelo destino de Elandor começa agora."
      },
      epilogue: {
          title: "Epílogo",
          text: "Com Maedron caído, o Umbral recua. Eldric se aproxima, cansado, mas com esperança. As Crônicas de Elandor agora registram a história do Portador do Último Eco — aquele que se levantou contra as trevas.<br><br>O mundo respira novamente. Pelo menos, por agora."
      }
  }
};