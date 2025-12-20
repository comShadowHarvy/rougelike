// Author: ShadowHarvy

const readline = require('readline');

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}


// Game variables
let player;
let map;
let monsters;
let summons = [];
let corpses = [];
let gameLog = [];
let autoCombat = false;
let autoHeal = false;
let level = 1;
let MAP_WIDTH = 50;
let MAP_HEIGHT = 20;

const items = {
    weapons: {
        "Dagger": { attack: 5, name: "Dagger", type: "weapons" },
        "Short Sword": { attack: 8, name: "Short Sword", type: "weapons" },
        "Long Sword": { attack: 12, name: "Long Sword", type: "weapons" },
    },
    armor: {
        "Leather Armor": { defense: 5, name: "Leather Armor", type: "armor" },
        "Chainmail": { defense: 8, name: "Chainmail", type: "armor" },
        "Plate Armor": { defense: 12, name: "Plate Armor", type: "armor" },
    },
    potions: {
        "Healing Potion": { effect: "heal", value: 50, name: "Healing Potion", type: "potions" },
        "Strength Potion": { effect: "strength_buff", value: 10, duration: 10, name: "Strength Potion", type: "potions" },
    },
    scrolls: {
        "Scroll of Teleportation": { effect: "teleport", name: "Scroll of Teleportation", type: "scrolls" },
        "Scroll of Monster Stun": { effect: "monster_stun", name: "Scroll of Monster Stun", type: "scrolls" },
        "Scroll of Reveal Map": { effect: "reveal_map", name: "Scroll of Reveal Map", type: "scrolls" },
    },
    legendary: {
        "Excalibur": { attack: 50, name: "Excalibur", type: "weapons" },
        "Aegis": { defense: 50, name: "Aegis", type: "armor" },
    }
};

const monsterTypes = {
    "Goblin": { name: "Goblin", stats: { hp: 30, maxHp: 30, attack: 5, defense: 2 }, symbol: 'g', xpValue: 10, color: '\x1b[32m' }, // green
    "Orc": { name: "Orc", stats: { hp: 50, maxHp: 50, attack: 8, defense: 5 }, symbol: 'o', xpValue: 20, color: '\x1b[33m' }, // yellow
    "Troll": { name: "Troll", stats: { hp: 80, maxHp: 80, attack: 12, defense: 8 }, symbol: 'T', xpValue: 50, color: '\x1b[35m' }, // magenta
    "Zombie": { name: "Zombie", stats: { hp: 40, maxHp: 40, attack: 6, defense: 3 }, symbol: 'z', xpValue: 15, color: '\x1b[90m' }, // light gray
    "Skeleton": { name: "Skeleton", stats: { hp: 35, maxHp: 35, attack: 7, defense: 2 }, symbol: 's', xpValue: 12, color: '\x1b[37m' }, // white
    "Spider": { name: "Spider", stats: { hp: 25, maxHp: 25, attack: 4, defense: 1 }, symbol: 'S', xpValue: 8, color: '\x1b[30m' }, // black
    "Vampire": { name: "Vampire", stats: { hp: 70, maxHp: 70, attack: 10, defense: 7 }, symbol: 'V', xpValue: 40, color: '\x1b[31m' }, // red
    "Ghost": { name: "Ghost", stats: { hp: 60, maxHp: 60, attack: 9, defense: 0 }, symbol: 'G', xpValue: 30, color: '\x1b[36m' }, // cyan
};

const bossTypes = {
    "Ogre": { name: "Ogre", stats: { hp: 150, maxHp: 150, attack: 20, defense: 15 }, symbol: 'O', xpValue: 200, color: '\x1b[31m' }, // red
    "Dragon": { name: "Dragon", stats: { hp: 500, maxHp: 500, attack: 50, defense: 40 }, symbol: 'D', xpValue: 1000, color: '\x1b[31m\x1b[1m' }, // bold red
    "Minotaur": { name: "Minotaur", stats: { hp: 200, maxHp: 200, attack: 25, defense: 18 }, symbol: 'M', xpValue: 300, color: '\x1b[33m' }, // yellow
    "Lich": { name: "Lich", stats: { hp: 300, maxHp: 300, attack: 30, defense: 20 }, symbol: 'L', xpValue: 500, color: '\x1b[35m' }, // magenta
    "Giant Spider": { name: "Giant Spider", stats: { hp: 100, maxHp: 100, attack: 15, defense: 10 }, symbol: 'S', xpValue: 150, color: '\x1b[30m' }, // black
};


const summonTypes = {
    "Troll": { name: "Troll", stats: { hp: 50, maxHp: 50, attack: 10, defense: 5 }, symbol: 't' },
    "Gator": { name: "Gator", stats: { hp: 60, maxHp: 60, attack: 15, defense: 5 }, symbol: 'g' },
    "Eidolon": { name: "Eidolon", stats: { hp: 100, maxHp: 100, attack: 20, defense: 10 }, symbol: 'E' },
    "Pet": { name: "Pet", stats: { hp: 40, maxHp: 40, attack: 8, defense: 4 }, symbol: 'p' },
};

const classes = {
    "Meme": {
        "Florida Man": {
            description: "Unpredictable abilities that can be either very good or very bad.",
            stats: { hp: 100, attack: 10, defense: 5 },
            ability: { name: "Wrangle Gator", cooldown: 5, turn: 0 },
        },
        "Keyboard Warrior": {
            description: "High charisma (for trolling), but low strength. Can summon 'trolls' to fight for them.",
            stats: { hp: 80, attack: 5, defense: 2 },
            canSummon: true,
            ability: { name: "DDoS", cooldown: 10, turn: 0 },
        },
        "Harambe": {
            description: "High strength, but will try to protect any child-like creatures.",
            stats: { hp: 150, attack: 15, defense: 10 },
            ability: { name: "Protect the Innocent", cooldown: 0, turn: 0 },
        },
        "Techno Viking": {
            description: "A powerful warrior who can intimidate enemies.",
            stats: { hp: 120, attack: 12, defense: 8 },
            ability: { name: "Intimidating Dance", cooldown: 7, turn: 0 },
        },
        "Distracted Boyfriend": {
            description: "Has a chance to be distracted by other entities on the map.",
            stats: { hp: 90, attack: 9, defense: 4 },
            ability: { name: "Double Take", cooldown: 3, turn: 0 },
        },
        "Gigachad": {
            description: "High stats, but can't use items.",
            stats: { hp: 200, attack: 20, defense: 15 },
            ability: { name: "Refuse to Elaborate", cooldown: 10, turn: 0 },
        },
        "Salt Bae": {
            description: "Low attack, but can 'sprinkle' salt on enemies, dealing a small amount of damage to all enemies on screen.",
            stats: { hp: 90, attack: 2, defense: 2 },
            ability: { name: "Sprinkle Salt", cooldown: 5, turn: 0 },
        },
        "Big Brain": {
            description: "Low physical stats, but has a powerful psychic blast ability.",
            stats: { hp: 70, attack: 5, defense: 3 },
            ability: { name: "Psychic Blast", cooldown: 8, turn: 0 },
        },
        "Chad": {
            description: "High charisma, can sometimes make enemies fight each other.",
            stats: { hp: 100, attack: 10, defense: 6 },
            ability: { name: "Incite Infighting", cooldown: 10, turn: 0 },
        },
        "Karen": {
            description: "Can 'speak to the manager', causing a random boss to spawn.",
            stats: { hp: 80, attack: 8, defense: 4 },
            ability: { name: "Speak to the Manager", cooldown: 20, turn: 0 },
        }
    },
    "Pathfinder": {
        "Alchemist": {
            description: "Can throw bombs and use mutagens.",
            stats: { hp: 90, attack: 8, defense: 6 },
            ability: { name: "Throw Bomb", cooldown: 5, turn: 0 },
        },
        "Magus": {
            description: "A warrior who can cast spells.",
            stats: { hp: 100, attack: 12, defense: 8 },
            ability: { name: "Spellstrike", cooldown: 4, turn: 0 },
        },
        "Summoner": {
            description: "Can summon an Eidolon to fight alongside them.",
            stats: { hp: 80, attack: 6, defense: 4 },
            canSummon: true,
            ability: { name: "Summon Eidolon", cooldown: 10, turn: 0 },
        },
        "Inquisitor": {
            description: "A divine warrior who can pronounce judgments on their foes.",
            stats: { hp: 100, attack: 10, defense: 7 },
            ability: { name: "Judgment", cooldown: 6, turn: 0 },
        },
        "Oracle": {
            description: "A divine spellcaster with a mysterious curse that also grants them power.",
            stats: { hp: 85, attack: 7, defense: 5 },
            ability: { name: "Curse", cooldown: 5, turn: 0 },
        },
        "Barbarian": {
            description: "Enters a rage, increasing attack and decreasing defense.",
            stats: { hp: 130, attack: 14, defense: 4 },
            ability: { name: "Rage", cooldown: 8, turn: 0 },
        },
        "Rogue": {
            description: "Can backstab for extra damage if they attack an enemy from behind.",
            stats: { hp: 90, attack: 9, defense: 5 },
            ability: { name: "Backstab", cooldown: 4, turn: 0 },
        },
        "Fighter": {
            description: "Can make an extra attack in a turn.",
            stats: { hp: 110, attack: 11, defense: 7 },
            ability: { name: "Extra Attack", cooldown: 6, turn: 0 },
        },
        "Monk": {
            description: "Can move and attack in the same turn.",
            stats: { hp: 95, attack: 10, defense: 6 },
            ability: { name: "Flurry of Blows", cooldown: 5, turn: 0 },
        },
        "Ranger": {
            description: "Has a pet companion and is skilled with a bow.",
            stats: { hp: 100, attack: 10, defense: 6 },
            canSummon: true,
            ability: { name: "Summon Pet", cooldown: 10, turn: 0 },
        }
    },
    "D&D": {
        "Artificer": {
            description: "Can create magical items.",
            stats: { hp: 90, attack: 7, defense: 7 },
            ability: { name: "Infuse Item", cooldown: 8, turn: 0 },
        },
        "Warlock": {
            description: "Gets powers from a powerful patron.",
            stats: { hp: 85, attack: 10, defense: 5 },
            ability: { name: "Eldritch Blast", cooldown: 3, turn: 0 },
        },
        "Bard": {
            description: "Uses music to cast spells and inspire allies.",
            stats: { hp: 80, attack: 6, defense: 6 },
            ability: { name: "Inspire Courage", cooldown: 10, turn: 0 },
        },
        "Druid": {
            description: "Can shapeshift into animal forms.",
            stats: { hp: 95, attack: 8, defense: 8 },
            ability: { name: "Wild Shape", cooldown: 12, turn: 0 },
        },
        "Paladin": {
            description: "A holy warrior bound by an oath.",
            stats: { hp: 110, attack: 11, defense: 9 },
            ability: { name: "Lay on Hands", cooldown: 8, turn: 0 },
        },
        "Wizard": {
            description: "Can cast a variety of powerful spells.",
            stats: { hp: 75, attack: 5, defense: 4 },
            ability: { name: "Fireball", cooldown: 7, turn: 0 },
        },
        "Cleric": {
            description: "Can heal allies and smite undead.",
            stats: { hp: 90, attack: 8, defense: 7 },
            ability: { name: "Turn Undead", cooldown: 10, turn: 0 },
        },
        "Sorcerer": {
            description: "A spellcaster who draws power from their bloodline.",
            stats: { hp: 80, attack: 6, defense: 5 },
            ability: { name: "Metamagic", cooldown: 6, turn: 0 },
        },
        "Monk (D&D)": {
            description: "Uses ki to perform special attacks.",
            stats: { hp: 95, attack: 10, defense: 7 },
            ability: { name: "Stunning Strike", cooldown: 5, turn: 0 },
        },
        "Ranger (D&D)": {
            description: "A skilled hunter and tracker.",
            stats: { hp: 100, attack: 10, defense: 6 },
            ability: { name: "Hunter's Mark", cooldown: 6, turn: 0 },
        }
    },
    "Overpowered": {
        "God": {
            description: "Can do anything.",
            stats: { hp: 1000, attack: 100, defense: 100 },
            ability: { name: "Smite", cooldown: 20, turn: 0 },
        },
        "Saitama": {
            description: "Can defeat any enemy with a single punch.",
            stats: { hp: 1000, attack: 9999, defense: 1000 },
            ability: { name: "Serious Punch", cooldown: 30, turn: 0 },
        },
        "The Author": {
            description: "Can manipulate the game world directly.",
            stats: { hp: 999, attack: 999, defense: 999 },
            ability: { name: "Rewrite Reality", cooldown: 50, turn: 0 },
        },
        "The One Above All": {
            description: "The ultimate being, a step above a God.",
            stats: { hp: 9999, attack: 9999, defense: 9999 },
            ability: { name: "Omnipotence", cooldown: 100, turn: 0 },
        },
        "Giorno Giovanna (GER)": {
            description: "Can nullify any action directed at them.",
            stats: { hp: 1000, attack: 100, defense: 9999 },
            ability: { name: "Return to Zero", cooldown: 60, turn: 0 },
        },
        "Chuck Norris": {
            description: "Roundhouse kicks an enemy, sending them to another dimension.",
            stats: { hp: 10000, attack: 10000, defense: 10000 },
            ability: { name: "Roundhouse Kick", cooldown: 10, turn: 0 },
        },
        "John Wick": {
            description: "Enters a 'John Wick' mode, where he can make multiple attacks in a turn.",
            stats: { hp: 500, attack: 50, defense: 30 },
            ability: { name: "Gunslinger", cooldown: 15, turn: 0 },
        },
        "Thanos": {
            description: "50% chance to wipe out half of all enemies on the map.",
            stats: { hp: 2000, attack: 200, defense: 200 },
            ability: { name: "Snap", cooldown: 100, turn: 0 },
        },
        "The Flash": {
            description: "Can take multiple turns in a row.",
            stats: { hp: 300, attack: 30, defense: 20 },
            ability: { name: "Speedforce", cooldown: 20, turn: 0 },
        },
        "Dr. Manhattan": {
            description: "Can see the future, allowing the player to re-roll a failed action.",
            stats: { hp: 10000, attack: 10000, defense: 10000 },
            ability: { name: "Quantum Immortality", cooldown: 100, turn: 0 },
        }
    }
};

async function characterCreation() {
    console.clear();
    console.log('Choose your class category:');
    const categories = Object.keys(classes);
    categories.forEach((category, index) => {
        console.log(`${index + 1}. ${category}`);
    });

    const categoryIndex = await new Promise(resolve => {
        process.stdin.once('data', (data) => {
            resolve(parseInt(data.toString()) - 1);
        });
    });

    const category = categories[categoryIndex];
    console.clear();
    console.log(`Choose your class in the ${category} category:`);
    const classNames = Object.keys(classes[category]);
    classNames.forEach((className, index) => {
        console.log(`${index + 1}. ${className} - ${classes[category][className].description}`);
    });

    const classIndex = await new Promise(resolve => {
        process.stdin.once('data', (data) => {
            resolve(parseInt(data.toString()) - 1);
        });
    });
    
    const className = classNames[classIndex];
    const classData = classes[category][className];
    player = { name: "Player", ...classData, x: 0, y: 0, stats: { ...classData.stats, maxHp: classData.stats.hp }, xp: 0, level: 1, inventory: [], equipment: { weapon: null, armor: null } };
    if (player.ability) player.ability.turn = 0;

    startGame();
}

function startGame() {
    generateMap();
    computeFov();
    if(player.canSummon) summon();
    gameLoop();
}

function generateMap() {
    map = Array(MAP_HEIGHT).fill(0).map(() => Array(MAP_WIDTH).fill(null).map(() => ({ char: '#', walkable: false, visible: false, explored: false, items: [] })));
    monsters = [];
    corpses = [];

    if (level % 5 === 0) {
        // Boss room
        for (let y = 1; y < MAP_HEIGHT - 1; y++) {
            for (let x = 1; x < MAP_WIDTH - 1; x++) {
                map[y][x].char = '.';
                map[y][x].walkable = true;
            }
        }
        const bossType = level % 15 === 0 ? "Dragon" : "Ogre";
        const boss = { ...bossTypes[bossType], x: Math.floor(MAP_WIDTH / 2), y: Math.floor(MAP_HEIGHT / 2), stats: {...bossTypes[bossType].stats} };
        monsters.push(boss);

        if (level % 15 === 0) {
            const cx = boss.x + 1;
            const cy = boss.y;
            map[cy][cx].char = '*'; // Legendary Chest
            map[cy][cx].items.push({name: "Excalibur", type: "weapons", ...items.legendary["Excalibur"]});
        }

    } else {
        // Regular level generation
        let x = Math.floor(MAP_WIDTH / 2);
        let y = Math.floor(MAP_HEIGHT / 2);
        let steps = MAP_WIDTH * MAP_HEIGHT * 0.5;
    
        for (let i = 0; i < steps; i++) {
            map[y][x].char = '.';
            map[y][x].walkable = true;
            const direction = Math.floor(Math.random() * 4);
            if (direction === 0 && y > 1) y--; // Up
            else if (direction === 1 && y < MAP_HEIGHT - 2) y++; // Down
            else if (direction === 2 && x > 1) x--; // Left
            else if (direction === 3 && x < MAP_WIDTH - 2) x++; // Right
        }
    
        // Place chests
        const numChests = Math.floor(MAP_WIDTH * MAP_HEIGHT / 200);
        for (let i = 0; i < numChests; i++) {
            let placedChest = false;
            while (!placedChest) {
                const cx = Math.floor(Math.random() * MAP_WIDTH);
                const cy = Math.floor(Math.random() * MAP_HEIGHT);
                if (map[cy][cx].walkable && map[cy][cx].char === '.') {
                    map[cy][cx].char = '~'; // Chest
                    const itemCategory = Math.random();
                    let itemType;
                    if (itemCategory < 0.4) { // 40% chance for weapon
                        itemType = 'weapons';
                    } else if (itemCategory < 0.8) { // 40% chance for armor
                        itemType = 'armor';
                    } else if (itemCategory < 0.9) { // 10% chance for potion
                        itemType = 'potions';
                    } else { // 10% chance for scroll
                        itemType = 'scrolls';
                    }

                    const itemNames = Object.keys(items[itemType]);
                    const itemName = itemNames[Math.floor(Math.random() * itemNames.length)];
                    map[cy][cx].items.push({name: itemName, type: itemType, ...items[itemType][itemName]});
                    placedChest = true;
                }
            }
        }
        
        // Place monsters
        const numMonsters = Math.floor(MAP_WIDTH * MAP_HEIGHT / 100);
        for (let i = 0; i < numMonsters; i++) {
            let placedMonster = false;
            while (!placedMonster) {
                const mx = Math.floor(Math.random() * MAP_WIDTH);
                const my = Math.floor(Math.random() * MAP_HEIGHT);
                if (map[my][mx].walkable && (mx !== player.x || my !== player.y)) {
                    const monsterType = Object.keys(monsterTypes)[Math.floor(Math.random() * Object.keys(monsterTypes).length)];
                    monsters.push({ ...monsterTypes[monsterType], x: mx, y: my, stats: {...monsterTypes[monsterType].stats} });
                    placedMonster = true;
                }
            }
        }
    }

    // Place stairs
    let placedDownStairs = false;
    while (!placedDownStairs) {
        const sx = Math.floor(Math.random() * MAP_WIDTH);
        const sy = Math.floor(Math.random() * MAP_HEIGHT);
        if (map[sy][sx].walkable) {
            map[sy][sx].char = '>'; // Down stair
            placedDownStairs = true;
        }
    }
    if (level > 1) {
        let placedUpStairs = false;
        while (!placedUpStairs) {
            const sx = Math.floor(Math.random() * MAP_WIDTH);
            const sy = Math.floor(Math.random() * MAP_HEIGHT);
            if (map[sy][sx].walkable) {
                map[sy][sx].char = '<'; // Up stair
                placedUpStairs = true;
            }
        }
    }


    // Place player
    let placed = false;
    while (!placed) {
        const px = Math.floor(Math.random() * MAP_WIDTH);
        const py = Math.floor(Math.random() * MAP_HEIGHT);
        if (map[py][px].walkable) {
            player.x = px;
            player.y = py;
            placed = true;
        }
    }
}

function computeFov() {
    // First, set all tiles to not visible
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            map[y][x].visible = false;
        }
    }

    // Ray-casting algorithm
    const radius = 10;
    for (let i = 0; i < 360; i++) {
        let x = Math.cos(i * 0.01745);
        let y = Math.sin(i * 0.01745);
        let ox = player.x + 0.5;
        let oy = player.y + 0.5;
        for (let j = 0; j < radius; j++) {
            let ix = Math.floor(ox);
            let iy = Math.floor(oy);
            if (ix >= 0 && ix < MAP_WIDTH && iy >= 0 && iy < MAP_HEIGHT) {
                map[iy][ix].visible = true;
                map[iy][ix].explored = true;
                if (!map[iy][ix].walkable) break;
            }
            ox += x;
            oy += y;
        }
    }
}


function drawMap() {
    let buffer = '';
    for (let y = 0; y < MAP_HEIGHT; y++) {
        let row = '';
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tile = map[y][x];
            const monster = monsters.find(m => m.x === x && m.y === y);
            const summon = summons.find(s => s.x === x && s.y === y);
            const corpse = corpses.find(c => c.x === x && c.y === y);

            if (!tile.explored) {
                row += ' ';
            } else if (!tile.visible) {
                row += `\x1b[90m${corpse ? `\x1b[31m${corpse.symbol}\x1b[0m` : tile.char}\x1b[0m`; // Dim gray
            } else {
                 if (player.x === x && player.y === y) {
                    row += '@';
                } else if (monster) {
                    row += `${monster.color}${monster.symbol}\x1b[0m`;
                } else if (summon) {
                    row += summon.symbol;
                } else if (corpse) {
                    row += `\x1b[31m${corpse.symbol}\x1b[0m`;
                } else {
                    row += tile.char;
                }
            }
        }
        buffer += row + '\n';
    }
    process.stdout.write(buffer);
}

function drawUI() {
    console.log(`\nPlayer Stats: HP: ${player.stats.hp}/${player.stats.maxHp} | Atk: ${player.stats.attack} | Def: ${player.stats.defense} | XP: ${player.xp} | Level: ${player.level} | Dungeon Level: ${level}`);
    if (player.ability) console.log(`Ability: ${player.ability.name} (Cooldown: ${player.ability.turn > 0 ? player.ability.turn : 'Ready'})`);
    console.log(`Equipment: Weapon: ${player.equipment.weapon?.name || 'None'}, Armor: ${player.equipment.armor?.name || 'None'}`);
    console.log(`Inventory: ${player.inventory.map(item => item.name).join(', ')}`);
    console.log(`Auto-Combat: ${autoCombat ? 'On' : 'Off'} | Auto-Heal: ${autoHeal ? 'On' : 'Off'}`);
    console.log('--- Game Log ---');
    gameLog.forEach(msg => console.log(msg));
    console.log('----------------');
}

function draw() {
    process.stdout.write('\x1B[2J\x1B[0f');
    drawMap();
    drawUI();
}

function gameLoop() {
    if (player.ability && player.ability.turn > 0) {
        player.ability.turn--;
    }
    draw();

    if (autoCombat) {
        return autoCombatLoop();
    }

    process.stdin.once('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        }

        let dx = 0, dy = 0;
        if (key.name === 'w') dy = -1;
        else if (key.name === 's') dy = 1;
        else if (key.name === 'a') dx = -1;
        else if (key.name === 'd') dy = 1;
        else if (key.name === 'h') heal();
        else if (key.name === 'u') summon();
        else if (key.name === 'c') autoCombat = !autoCombat;
        else if (key.name === 'x') autoHeal = !autoHeal;
        else if (key.name === 'e') equip();
        else if (key.name === 'b') useAbility();
        else if (key.name === 'i') showInventory();
        else if (str === '>') changeLevel(1);
        else if (str === '<') changeLevel(-1);

        if (dx !== 0 || dy !== 0) {
            movePlayer(dx, dy);
        }
        
        if (player.stats.hp > 0) {
            gameLoop();
        }
    });
}

function changeLevel(levelChange) {
    if (map[player.y][player.x].char === '>' && levelChange > 0) {
        level += levelChange;
        log(`You descend to level ${level}.`, 'info');
        generateMap();
        computeFov();
    } else if (map[player.y][player.x].char === '<' && levelChange < 0) {
        level += levelChange;
        log(`You ascend to level ${level}.`, 'info');
        generateMap();
        computeFov();
    }
}

function movePlayer(dx, dy) {
    if(player.stats.hp <= 0) return;
    const newX = player.x + dx;
    const newY = player.y + dy;
    
    if (map[newY][newX].char === '~' || map[newY][newX].char === '?') {
        const itemsOnTile = map[newY][newX].items;
        if (itemsOnTile.length > 0) {
            const item = itemsOnTile.pop();
            player.inventory.push(item);
            log(`You found a ${item.name}!`, 'heal');
            if (itemsOnTile.length === 0) {
                map[newY][newX].char = '.';
            }
        }
    } else if (map[newY][newX].char === '*') { // Legendary chest
        const itemsOnTile = map[newY][newX].items;
        if (itemsOnTile.length > 0) {
            const item = itemsOnTile.pop();
            player.inventory.push(item);
            log(`You found a legendary ${item.name}!`, 'heal');
            if (itemsOnTile.length === 0) {
                map[newY][newX].char = '.';
            }
        }
    }

    const monster = monsters.find(m => m.x === newX && m.y === newY);
    if (monster) {
        attack(player, monster);
    } else if (newX >= 0 && newX < MAP_WIDTH && newY >= 0 && newY < MAP_HEIGHT && map[newY][newX].walkable) {
        player.x = newX;
        player.y = newY;
    }
    
    moveSummons();
    moveMonsters();
    computeFov();
}

function moveMonsters() {
    for (const monster of monsters) {
        if(monster.stunned > 0) {
            monster.stunned--;
            continue;
        }
        if(monster.fleeing > 0) {
            monster.fleeing--;
            const dx = Math.sign(monster.x - player.x);
            const dy = Math.sign(monster.y - player.y);
            const newX = monster.x + dx;
            const newY = monster.y + dy;
            if (newX >= 0 && newX < MAP_WIDTH && newY >= 0 && newY < MAP_HEIGHT && map[newY][newX].walkable) {
                monster.x = newX;
                monster.y = newY;
            }
            continue;
        }


        const dist = Math.hypot(monster.x - player.x, monster.y - player.y);

        if (dist <= 10) { // Detection radius
            const path = findPath(monster, player);
            if (path.length > 1) {
                const nextStep = path[0];
                const newX = nextStep.x;
                const newY = nextStep.y;

                const isOccupied = monsters.some(m => m.x === newX && m.y === newY) || summons.some(s => s.x === newX && s.y === newY);
                if (!isOccupied) {
                    monster.x = newX;
                    monster.y = newY;
                }
            } else if (path.length === 1) {
                attack(monster, player);
            }
        } else {
            // Random movement
            const dx = Math.floor(Math.random() * 3) - 1;
            const dy = Math.floor(Math.random() * 3) - 1;
            const newX = monster.x + dx;
            const newY = monster.y + dy;
            
            if (newX === player.x && newY === player.y) {
                attack(monster, player);
                continue;
            }
    
            if (newX >= 0 && newX < MAP_WIDTH && newY >= 0 && newY < MAP_HEIGHT && map[newY][newX].walkable) {
                const isMonster = monsters.some(m => m.x === newX && m.y === newY);
                if (!isMonster) {
                    monster.x = newX;
                    monster.y = newY;
                }
            }
        }
    }
}

function moveSummons() {
    for (const summon of summons) {
        const nearestMonster = monsters.reduce((closest, monster) => {
            const dist = Math.hypot(monster.x - summon.x, monster.y - summon.y);
            if (dist < closest.dist) {
                return { monster, dist };
            }
            return closest;
        }, { monster: null, dist: Infinity });

        let dx = 0;
        let dy = 0;

        if (nearestMonster.monster && nearestMonster.dist <= 10) {
            dx = Math.sign(nearestMonster.monster.x - summon.x);
            dy = Math.sign(nearestMonster.monster.y - summon.y);
        } else {
            dx = Math.sign(player.x - summon.x);
            dy = Math.sign(player.y - summon.y);
        }
        
        const newX = summon.x + dx;
        const newY = summon.y + dy;

        const monster = monsters.find(m => m.x === newX && m.y === newY);
        if (monster) {
            attack(summon, monster);
            continue;
        }
        
        if (newX >= 0 && newX < MAP_WIDTH && newY >= 0 && newY < MAP_HEIGHT && map[newY][newX].walkable) {
            const isOccupied = monsters.some(m => m.x === newX && m.y === newY) || summons.some(s => s.x === newX && s.y === newY);
            if (!isOccupied) {
                summon.x = newX;
                summon.y = newY;
            }
        }
    }
}

function attack(attacker, defender) {
    if (player.ability?.name === "Harambe" && defender.name === "Troll") {
        player.stats.attack += 10;
        log('Harambe is enraged!', 'heal');
    }
    
    if (player.ability?.name === "Distracted Boyfriend" && Math.random() < 0.5) {
        log('You were distracted and missed!', 'info');
        return;
    }

    const damage = Math.max(0, attacker.stats.attack - defender.stats.defense);
    defender.stats.hp -= damage;
    log(`${attacker.name} attacks ${defender.name} for ${damage} damage.`, 'damage');
    if (defender.stats.hp <= 0) {
        if (defender === player) {
            log('You have been defeated! Game Over.', 'death');
            process.exit();
        } else {
            log(`${defender.name} has been defeated! You gain ${defender.xpValue} XP.`, 'info');
            player.xp += defender.xpValue;
            corpses.push({ x: defender.x, y: defender.y, symbol: '%' });
            monsters = monsters.filter(m => m !== defender);
            levelUp();
        }
    }
}

function levelUp() {
    if (player.xp >= 100) {
        player.level++;
        player.xp -= 100;
        player.stats.maxHp += 10;
        player.stats.hp = player.stats.maxHp;
        player.stats.attack += 2;
        player.stats.defense += 1;
        log(`You have reached level ${player.level}!`, 'heal');
    }
}

function log(message, type) {
    let coloredMessage = message;
    if (type === 'damage') coloredMessage = `\x1b[31m${message}\x1b[0m`; // red
    else if (type === 'heal') coloredMessage = `\x1b[32m${message}\x1b[0m`; // green
    else if (type === 'death') coloredMessage = `\x1b[31m\x1b[1m${message}\x1b[0m`; // bold red
    
    gameLog.unshift(coloredMessage);
    if (gameLog.length > 5) {
        gameLog.pop();
    }
}

function heal() {
    if (player.stats.hp < player.stats.maxHp) {
        player.stats.hp = Math.min(player.stats.maxHp, player.stats.hp + 20);
        log(`You healed for 20 HP. You now have ${player.stats.hp} HP.`, 'heal');
    } else {
        log('You are already at full health.', 'info');
    }
}

function summon(type = "Troll") {
    if (summons.length > 0 && player.canSummon) {
        log('You can only have one summon at a time.', 'info');
        return;
    }
    let placed = false;
    while (!placed) {
        const sx = player.x + Math.floor(Math.random() * 3) - 1;
        const sy = player.y + Math.floor(Math.random() * 3) - 1;
        if (sx >= 0 && sx < MAP_WIDTH && sy >= 0 && sy < MAP_HEIGHT && map[sy][sx].walkable && (sx !== player.x || sy !== player.y) && !monsters.some(m => m.x === sx && m.y === sy) && !summons.some(s => s.x === sx && s.y === sy)) {
            summons.push({ ...summonTypes[type], x: sx, y: sy, stats: {...summonTypes[type].stats} });
            placed = true;
            log(`A ${type} has been summoned!`, 'info');
        }
    }
}

async function equip() {
    console.clear();
    console.log('Your inventory:');
    player.inventory.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name}`);
    });

    const itemIndex = await new Promise(resolve => {
        process.stdin.once('data', (data) => {
            resolve(parseInt(data.toString()) - 1);
        });
    });

    const item = player.inventory[itemIndex];
    if (item) {
        if (item.type === 'weapons') {
            if(player.equipment.weapon) player.inventory.push(player.equipment.weapon);
            player.equipment.weapon = item;
            player.stats.attack = classes[player.description.split(" ")[0]][player.description].stats.attack + item.attack;
        } else if (item.type === 'armor') {
            if(player.equipment.armor) player.inventory.push(player.equipment.armor);
            player.equipment.armor = item;
            player.stats.defense = classes[player.description.split(" ")[0]][player.description].stats.defense + item.defense;
        }
        player.inventory.splice(itemIndex, 1);
        log(`You equipped the ${item.name}.`, 'info');
    }
}

function useAbility() {
    if (!player.ability) {
        log('Your class has no ability.', 'info');
        return;
    }
    if (player.ability.turn > 0) {
        log(`Your ability is on cooldown for ${player.ability.turn} more turns.`, 'info');
        return;
    }

    player.ability.turn = player.ability.cooldown;

    if (player.ability.name === 'Eldritch Blast') {
        const target = monsters.reduce((closest, monster) => {
            const dist = Math.hypot(monster.x - player.x, monster.y - player.y);
            if (dist < closest.dist) {
                return { monster, dist };
            }
            return closest;
        }, { monster: null, dist: Infinity });
        if(target.monster) {
            attack({name: "Eldritch Blast", stats: {attack: 30, defense: 0}}, target.monster);
        } else {
            log('No target in sight.', 'info');
        }
    } else if (player.ability.name === 'Throw Bomb') {
        const target = monsters.reduce((closest, monster) => {
            const dist = Math.hypot(monster.x - player.x, monster.y - player.y);
            if (dist < closest.dist) {
                return { monster, dist };
            }
            return closest;
        }, { monster: null, dist: Infinity });
        if(target.monster) {
            monsters.forEach(monster => {
                const dist = Math.hypot(monster.x - target.monster.x, monster.y - target.monster.y);
                if (dist <= 3) {
                    attack({name: "Bomb", stats: {attack: 20, defense: 0}}, monster);
                }
            });
        } else {
            log('No target in sight.', 'info');
        }
    } else if (player.ability.name === 'Lay on Hands') {
        player.stats.hp = player.stats.maxHp;
        log('You used Lay on Hands and have been fully healed.', 'heal');
    } else if (player.ability.name === "DDoS") {
        monsters.forEach(m => {
            if(map[m.y][m.x].visible) m.stunned = 3;
        });
        log('You DDoS all enemies in sight!', 'info');
    } else if (player.ability.name === "Intimidating Dance") {
        monsters.forEach(m => {
            if(Math.hypot(m.x - player.x, m.y - player.y) <= 5) m.fleeing = 3;
        });
        log('You dance menacingly, enemies flee in terror!', 'info');
    } else if (player.ability.name === "Wrangle Gator") {
        if (Math.random() < 0.5) {
            summon("Gator");
        } else {
            const gator = { ...summonTypes["Gator"], x: player.x + 1, y: player.y, stats: {...summonTypes["Gator"].stats} };
            attack(gator, player);
        }
    } else if (player.ability.name === "Spellstrike") {
        player.stats.attack += 20;
        log('Your weapon glows with magical energy!', 'heal');
        setTimeout(() => {
            player.stats.attack -= 20;
            log('The magical energy fades.', 'info');
        }, 5000);
    } else if (player.ability.name === "Summon Eidolon") {
        summon("Eidolon");
    } else if (player.ability.name === "Judgment") {
        const target = monsters.reduce((closest, monster) => {
            const dist = Math.hypot(monster.x - player.x, monster.y - player.y);
            if (dist < closest.dist) {
                return { monster, dist };
            }
            return closest;
        }, { monster: null, dist: Infinity });
        if(target.monster) {
            target.monster.stats.attack -= 5;
            target.monster.stats.defense -= 5;
            log(`${target.monster.name} has been judged!`, 'info');
        } else {
            log('No target in sight.', 'info');
        }
    } else if (player.ability.name === "Curse") {
        const target = monsters.reduce((closest, monster) => {
            const dist = Math.hypot(monster.x - player.x, monster.y - player.y);
            if (dist < closest.dist) {
                return { monster, dist };
            }
            return closest;
        }, { monster: null, dist: Infinity });
        if(target.monster) {
            target.monster.cursed = 5;
            log(`${target.monster.name} has been cursed!`, 'info');
        } else {
            log('No target in sight.', 'info');
        }
    } else if (player.ability.name === "Inspire Courage") {
        player.stats.attack += 5;
        player.stats.defense += 5;
        summons.forEach(s => {
            s.stats.attack += 5;
            s.stats.defense += 5;
        });
        log('You and your allies are inspired!', 'heal');
        setTimeout(() => {
            player.stats.attack -= 5;
            player.stats.defense -= 5;
            summons.forEach(s => {
                s.stats.attack -= 5;
                s.stats.defense -= 5;
            });
            log('The inspiration fades.', 'info');
        }, 5000);
    } else if (player.ability.name === "Smite") {
        if (monsters.length > 0) {
            const randomIndex = Math.floor(Math.random() * monsters.length);
            const target = monsters[randomIndex];
            attack({name: "Smite", stats: {attack: 9999, defense: 0}}, target);
        } else {
            log('No enemies to smite.', 'info');
        }
    } else if (player.ability.name === "Serious Punch") {
        monsters.forEach(m => attack({name: "Serious Punch", stats: {attack: 9999, defense: 0}}, m));
    } else if (player.ability.name === "Rewrite Reality") {
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                map[y][x].explored = true;
            }
        }
        log('You see everything.', 'info');
    } else if (player.ability.name === "Omnipotence") {
        const legendaryItems = Object.keys(items.legendary);
        const itemName = legendaryItems[Math.floor(Math.random() * legendaryItems.length)];
        player.inventory.push({name: itemName, type: "legendary", ...items.legendary[itemName]});
        log(`You received a ${itemName}!`, 'heal');
    } else if (player.ability.name === "Return to Zero") {
        player.stats.hp = player.stats.maxHp;
        monsters.forEach(m => m.stats.hp = m.stats.maxHp);
        log('Everything has been returned to zero.', 'heal');
    } else if (player.ability.name === "Roundhouse Kick") {
        const target = monsters.reduce((closest, monster) => {
            const dist = Math.hypot(monster.x - player.x, monster.y - player.y);
            if (dist < closest.dist) {
                return { monster, dist };
            }
            return closest;
        }, { monster: null, dist: Infinity });
        if(target.monster) {
            monsters = monsters.filter(m => m !== target.monster);
            log(`You roundhouse kicked ${target.monster.name} into another dimension!`, 'info');
        } else {
            log('No target in sight.', 'info');
        }
    } else if (player.ability.name === "Gunslinger") {
        for(let i = 0; i < 5; i++) {
            const target = monsters.reduce((closest, monster) => {
                const dist = Math.hypot(monster.x - player.x, monster.y - player.y);
                if (dist < closest.dist) {
                    return { monster, dist };
                }
                return closest;
            }, { monster: null, dist: Infinity });
            if(target.monster) {
                attack(player, target.monster);
            }
        }
    } else if (player.ability.name === "Snap") {
        if(Math.random() < 0.5) {
            monsters = monsters.slice(0, Math.floor(monsters.length / 2));
            log('You snapped your fingers. Half of all monsters are gone.', 'info');
        } else {
            log('Your snap did nothing.', 'info');
        }
    } else if (player.ability.name === "Speedforce") {
        for(let i = 0; i < 3; i++) {
            gameLoop();
        }
        log('You moved at the speed of light!', 'info');
    } else if (player.ability.name === "Quantum Immortality") {
        log('You contemplate your existence.', 'info');
    } else {
        log('This ability is not yet implemented.', 'info');
    }
}


function findPath(start, end) {
    const openList = [];
    const closedList = [];
    const startNode = { x: start.x, y: start.y, g: 0, h: 0, f: 0, parent: null };
    
    openList.push(startNode);

    while(openList.length > 0) {
        let lowestFIndex = 0;
        for(let i=0; i<openList.length; i++) {
            if(openList[i].f < openList[lowestFIndex].f) {
                lowestFIndex = i;
            }
        }
        let currentNode = openList[lowestFIndex];

        if(currentNode.x === end.x && currentNode.y === end.y) {
            let path = [];
            let current = currentNode;
            while(current.parent) {
                path.push(current);
                current = current.parent;
            }
            return path.reverse();
        }

        openList.splice(lowestFIndex, 1);
        closedList.push(currentNode);

        const neighbors = [
            {x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}
        ];

        for(const neighbor of neighbors) {
            const newX = currentNode.x + neighbor.x;
            const newY = currentNode.y + neighbor.y;

            if(newX < 0 || newX >= MAP_WIDTH || newY < 0 || newY >= MAP_HEIGHT) continue;
            if(!map[newY][newX].walkable) continue;
            if(closedList.find(node => node.x === newX && node.y === newY)) continue;

            const gScore = currentNode.g + 1;
            let gScoreIsBest = false;

            let neighborNode = openList.find(node => node.x === newX && node.y === newY);
            if(!neighborNode) {
                gScoreIsBest = true;
                neighborNode = {x: newX, y: newY, h: Math.abs(newX - end.x) + Math.abs(newY - end.y), parent: currentNode };
                openList.push(neighborNode);
            } else if(gScore < neighborNode.g) {
                gScoreIsBest = true;
            }

            if(gScoreIsBest) {
                neighborNode.parent = currentNode;
                neighborNode.g = gScore;
                neighborNode.f = neighborNode.g + neighborNode.h;
            }
        }
    }

    return []; // No path found
}


function autoCombatLoop() {
    if (!autoCombat || player.stats.hp <= 0) {
        autoCombat = false; // Turn off auto-combat if player died
        return gameLoop(); // Return to manual control
    }

    if (autoHeal && player.stats.hp < player.stats.maxHp * 0.5) {
        heal();
    }
    
    // Auto-equip best gear
    let bestWeapon = player.equipment.weapon;
    let bestArmor = player.equipment.armor;
    let bestWeaponIndex = -1;
    let bestArmorIndex = -1;

    player.inventory.forEach((item, index) => {
        if (item.type === 'weapons' && (!bestWeapon || item.attack > bestWeapon.attack)) {
            bestWeapon = item;
            bestWeaponIndex = index;
        }
        if (item.type === 'armor' && (!bestArmor || item.defense > bestArmor.defense)) {
            bestArmor = item;
            bestArmorIndex = index;
        }
    });

    if (bestWeaponIndex !== -1) equip(bestWeaponIndex);
    if (bestArmorIndex !== -1) equip(bestArmorIndex);

    // Use ability
    if (player.ability && player.ability.turn === 0) {
        useAbility();
    }


    if (monsters.length === 0) {
        // Go to stairs
        let stairs;
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                if (map[y][x].char === '>') {
                    stairs = {x, y};
                    break;
                }
            }
            if(stairs) break;
        }

        if (stairs) {
            const path = findPath(player, stairs);
            if(path.length > 0) {
                const nextStep = path[0];
                const dx = nextStep.x - player.x;
                const dy = nextStep.y - player.y;
                movePlayer(dx, dy);
            } else {
                changeLevel(1);
            }
        }
    } else {
        const nearestMonster = monsters.reduce((closest, monster) => {
            const dist = Math.hypot(monster.x - player.x, monster.y - player.y);
            if (dist < closest.dist) {
                return { monster, dist };
            }
            return closest;
        }, { monster: null, dist: Infinity });
    
        if (nearestMonster.monster) {
            const path = findPath(player, nearestMonster.monster);
            if(path.length > 0) {
                const nextStep = path[0];
                const dx = nextStep.x - player.x;
                const dy = nextStep.y - player.y;
                movePlayer(dx, dy);
            }
        }
    }

    draw();
    setTimeout(autoCombatLoop, 500);
}


async function initializeGame() {
    const screenWidth = process.stdout.columns;
    const screenHeight = process.stdout.rows;

    MAP_WIDTH = Math.floor(screenWidth * 0.6);
    MAP_HEIGHT = Math.floor(screenHeight * 0.6);
    
    // Ensure minimum dimensions
    if (MAP_WIDTH < 50) MAP_WIDTH = 50;
    if (MAP_HEIGHT < 20) MAP_HEIGHT = 20;
    
    console.log("Welcome to the Roguelike game!");
    await characterCreation();
}

initializeGame();