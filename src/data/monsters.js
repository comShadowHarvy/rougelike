const monsterTypes = {
    'Goblin': { name: 'Goblin', stats: { hp: 30, maxHp: 30, attack: 5, defense: 2 }, symbol: 'g', xpValue: 10, color: '\x1b[32m' }, // green
    'Orc': { name: 'Orc', stats: { hp: 50, maxHp: 50, attack: 8, defense: 5 }, symbol: 'o', xpValue: 20, color: '\x1b[33m' }, // yellow
    'Troll': { name: 'Troll', stats: { hp: 80, maxHp: 80, attack: 12, defense: 8 }, symbol: 'T', xpValue: 50, color: '\x1b[35m' }, // magenta
    'Zombie': { name: 'Zombie', stats: { hp: 40, maxHp: 40, attack: 6, defense: 3 }, symbol: 'z', xpValue: 15, color: '\x1b[90m' }, // light gray
    'Skeleton': { name: 'Skeleton', stats: { hp: 35, maxHp: 35, attack: 7, defense: 2 }, symbol: 's', xpValue: 12, color: '\x1b[37m' }, // white
    'Spider': { name: 'Spider', stats: { hp: 25, maxHp: 25, attack: 4, defense: 1 }, symbol: 'S', xpValue: 8, color: '\x1b[30m' }, // black
    'Vampire': { name: 'Vampire', stats: { hp: 70, maxHp: 70, attack: 10, defense: 7 }, symbol: 'V', xpValue: 40, color: '\x1b[31m' }, // red
    'Ghost': { name: 'Ghost', stats: { hp: 60, maxHp: 60, attack: 9, defense: 0 }, symbol: 'G', xpValue: 30, color: '\x1b[36m' }, // cyan
};

const bossTypes = {
    'Ogre': { name: 'Ogre', stats: { hp: 150, maxHp: 150, attack: 20, defense: 15 }, symbol: 'O', xpValue: 200, color: '\x1b[31m' }, // red
    'Dragon': { name: 'Dragon', stats: { hp: 500, maxHp: 500, attack: 50, defense: 40 }, symbol: 'D', xpValue: 1000, color: '\x1b[31m\x1b[1m' }, // bold red
    'Minotaur': { name: 'Minotaur', stats: { hp: 200, maxHp: 200, attack: 25, defense: 18 }, symbol: 'M', xpValue: 300, color: '\x1b[33m' }, // yellow
    'Lich': { name: 'Lich', stats: { hp: 300, maxHp: 300, attack: 30, defense: 20 }, symbol: 'L', xpValue: 500, color: '\x1b[35m' }, // magenta
    'Giant Spider': { name: 'Giant Spider', stats: { hp: 100, maxHp: 100, attack: 15, defense: 10 }, symbol: 'S', xpValue: 150, color: '\x1b[30m' }, // black
};

module.exports = { monsterTypes, bossTypes };
