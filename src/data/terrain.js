const terrainTypes = {
    water: {
        char: '~',
        color: '\x1b[34m',
        walkable: false,
        swimable: true,
        description: 'Water',
    },
    lava: {
        char: '~',
        color: '\x1b[31m',
        walkable: false,
        damage: 20,
        description: 'Lava',
    },
    chasm: {
        char: ' ',
        color: '\x1b[90m',
        walkable: false,
        description: 'Chasm',
    },
    door: {
        char: '+',
        color: '\x1b[33m',
        walkable: true,
        open: false,
        description: 'Door',
    },
    openDoor: {
        char: '/',
        color: '\x1b[33m',
        walkable: true,
        open: true,
        description: 'Open Door',
    },
    altar: {
        char: 'A',
        color: '\x1b[35m',
        walkable: true,
        description: 'Altar',
    },
    fountain: {
        char: 'f',
        color: '\x1b[36m',
        walkable: true,
        heal: 10,
        description: 'Fountain',
    },
    rubble: {
        char: ',',
        color: '\x1b[90m',
        walkable: true,
        slow: true,
        description: 'Rubble',
    },
    bush: {
        char: '*',
        color: '\x1b[32m',
        walkable: true,
        hiddenMonsters: true,
        description: 'Bush',
    },
};

module.exports = terrainTypes;
