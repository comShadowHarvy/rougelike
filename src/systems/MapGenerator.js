const items = require('../data/items');
const { monsterTypes, bossTypes } = require('../data/monsters');
const trapTypes = require('../data/traps');
const terrainTypes = require('../data/terrain');
const Monster = require('../entities/Monster');

class MapGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    generate(level, player) {
        const map = Array(this.height)
            .fill(0)
            .map(() =>
                Array(this.width)
                    .fill(null)
                    .map(() => ({
                        char: '#',
                        walkable: false,
                        visible: false,
                        explored: false,
                        items: [],
                        trap: null,
                        terrain: null,
                    })),
            );
        const monsters = [];
        const corpses = [];

        if (level % 5 === 0) {
            // Boss room
            for (let y = 1; y < this.height - 1; y++) {
                for (let x = 1; x < this.width - 1; x++) {
                    map[y][x].char = '.';
                    map[y][x].walkable = true;
                }
            }
            const bossType = level % 15 === 0 ? 'Dragon' : 'Ogre';
            const bossData = bossTypes[bossType];
            const boss = new Monster(
                bossData,
                Math.floor(this.width / 2),
                Math.floor(this.height / 2),
            );
            monsters.push(boss);

            if (level % 15 === 0) {
                const cx = boss.x + 1;
                const cy = boss.y;
                map[cy][cx].char = '*'; // Legendary Chest
                map[cy][cx].items.push({
                    name: 'Excalibur',
                    type: 'weapons',
                    ...items.legendary['Excalibur'],
                });
            }
        } else {
            // Regular level generation
            let x = Math.floor(this.width / 2);
            let y = Math.floor(this.height / 2);
            let steps = this.width * this.height * 0.5;

            for (let i = 0; i < steps; i++) {
                map[y][x].char = '.';
                map[y][x].walkable = true;
                const direction = Math.floor(Math.random() * 4);
                if (direction === 0 && y > 1)
                    y--; // Up
                else if (direction === 1 && y < this.height - 2)
                    y++; // Down
                else if (direction === 2 && x > 1)
                    x--; // Left
                else if (direction === 3 && x < this.width - 2) x++; // Right
            }

            // Place terrain features
            this.placeTerrain(map);

            // Place chests
            const numChests = Math.floor((this.width * this.height) / 200);
            for (let i = 0; i < numChests; i++) {
                let placedChest = false;
                let attempts = 0;
                while (!placedChest && attempts < 1000) {
                    attempts++;
                    const cx = Math.floor(Math.random() * this.width);
                    const cy = Math.floor(Math.random() * this.height);
                    if (map[cy][cx].walkable && map[cy][cx].char === '.') {
                        map[cy][cx].char = '~'; // Chest
                        const itemCategory = Math.random();
                        let itemType;
                        if (itemCategory < 0.4) {
                            // 40% chance for weapon
                            itemType = 'weapons';
                        } else if (itemCategory < 0.8) {
                            // 40% chance for armor
                            itemType = 'armor';
                        } else if (itemCategory < 0.9) {
                            // 10% chance for potion
                            itemType = 'potions';
                        } else {
                            // 10% chance for scroll
                            itemType = 'scrolls';
                        }

                        const itemNames = Object.keys(items[itemType]);
                        const itemName = itemNames[Math.floor(Math.random() * itemNames.length)];
                        map[cy][cx].items.push({
                            name: itemName,
                            type: itemType,
                            ...items[itemType][itemName],
                        });
                        placedChest = true;
                    }
                }
            }

            // Place traps
            const numTraps = Math.floor((this.width * this.height) / 50);
            for (let i = 0; i < numTraps; i++) {
                let placedTrap = false;
                let attempts = 0;
                while (!placedTrap && attempts < 1000) {
                    attempts++;
                    const tx = Math.floor(Math.random() * this.width);
                    const ty = Math.floor(Math.random() * this.height);
                    if (map[ty][tx].walkable && map[ty][tx].char === '.') {
                        const trapTypeKeys = Object.keys(trapTypes);
                        const trapType =
                            trapTypeKeys[Math.floor(Math.random() * trapTypeKeys.length)];
                        map[ty][tx].trap = { ...trapTypes[trapType], revealed: false };
                        placedTrap = true;
                    }
                }
            }

            // Place monsters
            const numMonsters = Math.floor((this.width * this.height) / 100);
            for (let i = 0; i < numMonsters; i++) {
                let placedMonster = false;
                let attempts = 0;
                while (!placedMonster && attempts < 1000) {
                    attempts++;
                    const mx = Math.floor(Math.random() * this.width);
                    const my = Math.floor(Math.random() * this.height);
                    if (map[my][mx].walkable && (mx !== player.x || my !== player.y)) {
                        const monsterTypeKeys = Object.keys(monsterTypes);
                        const monsterType =
                            monsterTypeKeys[Math.floor(Math.random() * monsterTypeKeys.length)];
                        const monsterData = monsterTypes[monsterType];
                        const monster = new Monster(monsterData, mx, my);
                        monsters.push(monster);
                        placedMonster = true;
                    }
                }
            }
        }

        // Place stairs
        let placedDownStairs = false;
        let attempts = 0;
        while (!placedDownStairs && attempts < 2000) {
            attempts++;
            const sx = Math.floor(Math.random() * this.width);
            const sy = Math.floor(Math.random() * this.height);
            if (map[sy][sx].walkable && !map[sy][sx].trap && !map[sy][sx].terrain) {
                map[sy][sx].char = '>'; // Down stair
                placedDownStairs = true;
            }
        }
        // Fallback
        if (!placedDownStairs) {
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    if (map[y][x].walkable) {
                        map[y][x].char = '>';
                        placedDownStairs = true;
                        break;
                    }
                }
                if (placedDownStairs) break;
            }
        }

        if (level > 1) {
            let placedUpStairs = false;
            let attempts = 0;
            while (!placedUpStairs && attempts < 2000) {
                attempts++;
                const sx = Math.floor(Math.random() * this.width);
                const sy = Math.floor(Math.random() * this.height);
                if (
                    map[sy][sx].walkable &&
                    !map[sy][sx].trap &&
                    map[sy][sx].char !== '>' &&
                    !map[sy][sx].terrain
                ) {
                    map[sy][sx].char = '<'; // Up stair
                    placedUpStairs = true;
                }
            }
        }

        // Place player
        let placed = false;
        attempts = 0;
        while (!placed && attempts < 2000) {
            attempts++;
            const px = Math.floor(Math.random() * this.width);
            const py = Math.floor(Math.random() * this.height);
            const tile = map[py][px];
            if (
                tile.walkable &&
                tile.char !== '>' &&
                tile.char !== '<' &&
                tile.char !== '~' &&
                !tile.trap &&
                !monsters.some((m) => m.x === px && m.y === py)
            ) {
                player.x = px;
                player.y = py;
                placed = true;
            }
        }
        // Fallback for player
        if (!placed) {
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    if (map[y][x].walkable && map[y][x].char !== '>') {
                        player.x = x;
                        player.y = y;
                        placed = true;
                        break;
                    }
                }
                if (placed) break;
            }
        }

        return { map, monsters, corpses };
    }

    placeTerrain(map) {
        const terrainKeys = Object.keys(terrainTypes);

        // Place fountains (healing)
        const numFountains = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numFountains; i++) {
            this.placeSpecificTerrain(map, 'fountain');
        }

        // Place altars
        const numAltars = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numAltars; i++) {
            this.placeSpecificTerrain(map, 'altar');
        }

        // Place doors
        const numDoors = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < numDoors; i++) {
            this.placeSpecificTerrain(map, 'door');
        }

        // Place rubble
        const numRubble = Math.floor((this.width * this.height) / 40);
        for (let i = 0; i < numRubble; i++) {
            this.placeSpecificTerrain(map, 'rubble');
        }

        // Place water pools
        const numWater = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numWater; i++) {
            this.placeSpecificTerrain(map, 'water');
        }

        // Place lava pools
        if (Math.random() < 0.5) {
            this.placeSpecificTerrain(map, 'lava');
        }
    }

    placeSpecificTerrain(map, terrainType) {
        const terrain = terrainTypes[terrainType];
        let attempts = 0;
        while (attempts < 500) {
            attempts++;
            const tx = Math.floor(Math.random() * this.width);
            const ty = Math.floor(Math.random() * this.height);
            if (
                map[ty][tx].walkable &&
                map[ty][tx].char === '.' &&
                !map[ty][tx].terrain &&
                !map[ty][tx].trap
            ) {
                map[ty][tx].terrain = { type: terrainType, ...terrain };
                if (terrainType === 'door') {
                    map[ty][tx].char = '+';
                    map[ty][tx].walkable = false;
                } else if (terrainType === 'openDoor') {
                    map[ty][tx].char = '/';
                    map[ty][tx].walkable = true;
                } else if (terrainType === 'altar') {
                    map[ty][tx].char = 'A';
                } else if (terrainType === 'fountain') {
                    map[ty][tx].char = 'f';
                } else if (terrainType === 'rubble') {
                    map[ty][tx].char = ',';
                } else if (terrainType === 'water') {
                    map[ty][tx].char = '~';
                    map[ty][tx].walkable = false;
                } else if (terrainType === 'lava') {
                    map[ty][tx].char = '~';
                    map[ty][tx].walkable = false;
                }
                return true;
            }
        }
        return false;
    }
}

module.exports = MapGenerator;
