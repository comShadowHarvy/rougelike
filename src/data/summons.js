const summonTypes = {
    'Troll': { name: 'Troll', stats: { hp: 50, maxHp: 50, attack: 10, defense: 5 }, symbol: 't' },
    'Gator': { name: 'Gator', stats: { hp: 60, maxHp: 60, attack: 15, defense: 5 }, symbol: 'g' },
    'Eidolon': { name: 'Eidolon', stats: { hp: 100, maxHp: 100, attack: 20, defense: 10 }, symbol: 'E' },
    'Pet': { name: 'Pet', stats: { hp: 40, maxHp: 40, attack: 8, defense: 4 }, symbol: 'p' },
    'Wolf': { name: 'Wolf', stats: { hp: 40, maxHp: 40, attack: 8, defense: 4 }, symbol: 'w' },
    'Skeleton': { name: 'Skeleton', stats: { hp: 30, maxHp: 30, attack: 5, defense: 2 }, symbol: 's' },
    'Cat': { name: 'Grebbo', stats: { hp: 50, maxHp: 50, attack: 12, defense: 6 }, symbol: 'c' },
    'Barbarian': { name: 'Old Barbarian', stats: { hp: 60, maxHp: 60, attack: 10, defense: 5 }, symbol: 'b' },
    'Luggage': { name: 'The Luggage', stats: { hp: 200, maxHp: 200, attack: 20, defense: 20 }, symbol: 'L' },
    'Feegle': { name: 'Nac Mac Feegle', stats: { hp: 20, maxHp: 20, attack: 10, defense: 2 }, symbol: 'f' }
};

module.exports = summonTypes;
