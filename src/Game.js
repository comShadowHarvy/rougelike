const readline = require('readline');
const Logger = require('./utils/Logger');
const Renderer = require('./systems/Renderer');
const MapGenerator = require('./systems/MapGenerator');
const Combat = require('./systems/Combat');
const AbilitySystem = require('./systems/AbilitySystem');
const AISystem = require('./systems/AISystem');
const FOV = require('./systems/FOV');
const Player = require('./entities/Player');
const classes = require('./data/classes');
const { selectOption } = require('./utils/InputUtils');
const { findPath } = require('./utils/Pathfinding');
const { saveGame, loadGame } = require('./utils/saveLoad');

class Game {
    constructor() {
        this.logger = new Logger();
        this.renderer = new Renderer();
        this.fov = new FOV(50, 20); // Default dims, updated on init
        this.combat = new Combat(this.logger);
        this.abilitySystem = new AbilitySystem(this.logger, this.combat);
        this.ai = new AISystem(this.combat);

        // Game State
        this.player = null;
        this.map = [];
        this.monsters = [];
        this.summons = [];
        this.corpses = [];
        this.level = 1;
        this.mapWidth = 50;
        this.mapHeight = 20;
        this.autoCombat = false;
        this.autoHeal = false;
        this.gameEnded = false;
    }

    async initialize() {
        const screenWidth = process.stdout.columns || 80;
        const screenHeight = process.stdout.rows || 24;

        this.mapWidth = Math.floor(screenWidth * 0.6);
        this.mapHeight = Math.floor(screenHeight * 0.6);

        // Ensure minimum dimensions
        if (this.mapWidth < 50) this.mapWidth = 50;
        if (this.mapHeight < 20) this.mapHeight = 20;

        this.mapGenerator = new MapGenerator(this.mapWidth, this.mapHeight);
        this.fov = new FOV(this.mapWidth, this.mapHeight);

        console.log('Welcome to the Roguelike game!');
        await this.characterCreation();
    }

    async characterCreation() {
        const categories = Object.keys(classes);
        const categoryIndex = await selectOption('Choose your class category:', categories);

        const category = categories[categoryIndex];
        const classNames = Object.keys(classes[category]);
        const classDisplayList = classNames.map(className =>
            `${className} - ${classes[category][className].description}`
        );

        const classIndex = await selectOption(`Choose your class in the ${category} category:`, classDisplayList);

        const className = classNames[classIndex];
        const classData = classes[category][className];
        this.player = new Player(classData, 'Player');

        this.start();
    }

    start() {
        this.generateLevel();
        this.fov.compute(this.map, this.player);
        if (this.player.canSummon) this.abilitySystem.summon(this, 'Troll'); // Or logic to summon default? Original: summon() -> trolls
        // Wait, original summon() default was "Troll".

        this.setupInput();
        this.draw();
        // The game loop is event driven by keypress
    }

    generateLevel() {
        const result = this.mapGenerator.generate(this.level, this.player);
        this.map = result.map;
        this.monsters = result.monsters;
        this.corpses = result.corpses;
        this.summons = []; // Reset summons between levels? Or keep them? Original logic doesn't clear summons on generateMap, BUT generateMap creates NEW map.
        // If map is new, summons x,y might be invalid.
        // Original generateMap didn't reset summons. But they retain x,y?
        // If x,y is out of bounds or in wall..
        // Better to probably keep them but find valid spot?
        // For simplicity in refactor, let's reset or just keep them (and risk bugs same as original).
        // Let's keep them but check bounds.
        // Actually, let's just clear for safety or move them to player.
        // Original game.js: summons = [] was global init. generateMap didn't clear it.
        // But map dims might change? No, fixed consts.
        // This refactor computed MAP_WIDTH once.
        // Let's assume summons follow player or teleport to him.
        if (this.summons.length > 0) {
            this.summons.forEach(s => {
                s.x = this.player.x;
                s.y = this.player.y; // Stacked on player?
            });
        }
    }

    setupInput() {
        this.renderer.screen.key(['escape', 'C-c'], (ch, key) => {
            return process.exit(0);
        });

        this.renderer.screen.on('keypress', (ch, key) => {
            if (this.gameEnded || this.autoCombat) {
                if (key && key.name === 'c') {
                    this.autoCombat = !this.autoCombat;
                    return;
                }
                return;
            }
            this.handleInput(ch, key);
        });
    }

    handleInput(str, key) {
        if (!key && !str) return;
        const keyName = key ? key.name : str;
        const val = str;

        let dx = 0, dy = 0;
        if (keyName === 'up' || val === 'w') dy = -1;
        else if (keyName === 'down' || val === 's') dy = 1;
        else if (keyName === 'left' || val === 'a') dx = -1;
        else if (keyName === 'right' || val === 'd') dx = 1;
        else if (keyName === 'h') this.player.heal(20);
        else if (keyName === 'u') this.abilitySystem.summon(this, 'Troll');
        else if (keyName === 'c') { this.autoCombat = !this.autoCombat; if (this.autoCombat) this.autoCombatLoop(); }
        else if (keyName === 'x') this.autoHeal = !this.autoHeal;
        else if (keyName === 'e') this.equip();
        else if (keyName === 'b') this.abilitySystem.useAbility(this);
        else if (keyName === 'i') this.showInventory();
        else if (val === 'S' || keyName === 'S') {
            if (saveGame(this)) this.logger.log('Game saved successfully.', 'info');
            else this.logger.log('Failed to save game.', 'damage');
        }
        else if (val === 'L' || keyName === 'L') {
            const state = loadGame();
            if (state) {
                Object.assign(this, state);
                this.logger.log('Game loaded successfully.', 'info');
                this.draw();
            } else {
                this.logger.log('No save file found or failed to load.', 'damage');
            }
        }
        else if (val === '>' || keyName === '>') this.changeLevel(1);
        else if (val === '<' || keyName === '<') this.changeLevel(-1);

        if (dx !== 0 || dy !== 0) {
            this.movePlayer(dx, dy);
        }

        // Game Loop Update
        if (this.player.stats.hp > 0 && !this.autoCombat) {
            if (this.player.ability && this.player.ability.turn > 0) {
                this.player.ability.turn--;
            }
            this.draw();
        }
    }

    changeLevel(levelChange) {
        // Validation
        const tile = this.map[this.player.y][this.player.x];
        if (tile.char === '>' && levelChange > 0) {
            this.level += levelChange;
            this.logger.log(`You descend to level ${this.level}.`, 'info');
            this.generateLevel();
            this.fov.compute(this.map, this.player);
        } else if (tile.char === '<' && levelChange < 0) {
            this.level += levelChange;
            this.logger.log(`You ascend to level ${this.level}.`, 'info');
            this.generateLevel();
            this.fov.compute(this.map, this.player);
        }
    }

    movePlayer(dx, dy) {
        if (this.player.stats.hp <= 0) return;
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;

        // Bounds checks handled by array access validity, but nice to check
        if (newX < 0 || newX >= this.mapWidth || newY < 0 || newY >= this.mapHeight) return;

        const tile = this.map[newY][newX];

        if (tile.char === '~' || tile.char === '?') {
            const itemsOnTile = tile.items;
            if (itemsOnTile.length > 0) {
                const item = itemsOnTile.pop();
                this.player.inventory.push(item);
                this.logger.log(`You found a ${item.name}!`, 'heal');
                if (itemsOnTile.length === 0) {
                    tile.char = '.';
                }
            }
        } else if (tile.char === '*') {
            const itemsOnTile = tile.items;
            if (itemsOnTile.length > 0) {
                const item = itemsOnTile.pop();
                this.player.inventory.push(item);
                this.logger.log(`You found a legendary ${item.name}!`, 'heal');
                if (itemsOnTile.length === 0) {
                    tile.char = '.';
                }
            }
        }

        const monster = this.monsters.find(m => m.x === newX && m.y === newY);
        if (monster) {
            this.combat.attack(this.player, monster, this);
        } else if (tile.walkable) {
            this.player.x = newX;
            this.player.y = newY;
            this.handleTraps(newX, newY);
        }

        this.ai.moveSummons(this);
        this.ai.moveMonsters(this);
        this.fov.compute(this.map, this.player);
    }

    handleTraps(x, y) {
        const tile = this.map[y][x];
        if (tile.trap && !tile.trap.revealed) {
            const trap = tile.trap;
            trap.revealed = true;
            this.logger.log(trap.message, 'damage');

            if (trap.damage) {
                this.player.takeDamage(trap.damage); // Check death
                if (this.player.stats.hp <= 0) {
                    this.logger.log('You died from a trap! Game Over.', 'death');
                    this.gameEnded = true;
                    process.exit();
                }
            }
            if (trap.effect === 'teleport') {
                let teleported = false;
                while (!teleported) {
                    const tx = Math.floor(Math.random() * this.mapWidth);
                    const ty = Math.floor(Math.random() * this.mapHeight);
                    if (this.map[ty][tx].walkable) {
                        this.player.x = tx;
                        this.player.y = ty;
                        teleported = true;
                        this.logger.log('You were teleported to a new location!', 'info');
                        this.fov.compute(this.map, this.player);
                    }
                }
            } else if (trap.effect === 'poison') {
                this.player.takeDamage(trap.damage);
                this.logger.log(`The poison burns for another ${trap.damage} damage!`, 'damage');
                if (this.player.stats.hp <= 0) {
                    this.logger.log('You died from poison! Game Over.', 'death');
                    this.gameEnded = true;
                    process.exit();
                }
            }
        }
    }

    async equip(targetIndex = -1) {
        let itemIndex = targetIndex;

        // If manual equip (key 'e')
        if (itemIndex === -1 && !this.autoCombat) {
            this.logger.log('Inventory system pending TUI update. Auto-equipping best gear.', 'info');
            this.autoEquip();
            return;
        }

        if (itemIndex !== -1) {
            const item = this.player.inventory[itemIndex];
            if (item) {
                this.player.equipItem(item);
                this.player.inventory.splice(itemIndex, 1);
                this.logger.log(`You equipped the ${item.name}.`, 'info');
            }
        }
    }

    autoEquip() {
        let bestWeapon = this.player.equipment.weapon;
        let bestArmor = this.player.equipment.armor;
        let bestWeaponIndex = -1;
        let bestArmorIndex = -1;

        this.player.inventory.forEach((item, index) => {
            if (item.type === 'weapons' && (!bestWeapon || item.attack > bestWeapon.attack)) {
                bestWeapon = item;
                bestWeaponIndex = index;
            }
            if (item.type === 'armor' && (!bestArmor || item.defense > bestArmor.defense)) {
                bestArmor = item;
                bestArmorIndex = index;
            }
        });

        if (bestWeaponIndex !== -1) {
            const item = this.player.inventory[bestWeaponIndex];
            this.player.equipItem(item);
            this.player.inventory.splice(bestWeaponIndex, 1);
            this.logger.log(`Auto-equipped ${item.name}`, 'info');
        }
        if (bestArmorIndex !== -1) {
            const item = this.player.inventory[bestArmorIndex];
            this.player.equipItem(item);
            this.player.inventory.splice(bestArmorIndex, 1);
            this.logger.log(`Auto-equipped ${item.name}`, 'info');
        }
    }

    showInventory() {
        this.logger.log('Inventory is visible in the sidebar.', 'info');
    }

    autoCombatLoop() {
        if (!this.autoCombat || this.player.stats.hp <= 0) {
            this.autoCombat = false;
            this.draw();
            return;
        }

        if (this.autoHeal && this.player.stats.hp < this.player.stats.maxHp * 0.5) {
            this.player.heal(20);
            this.logger.log('Auto-healed.', 'heal');
        }

        this.autoEquip();

        if (this.player.ability && this.player.ability.turn === 0) {
            this.abilitySystem.useAbility(this);
        }

        if (this.monsters.length === 0) {
            // Find stairs
            // Simple pathfinding to >
            // ... Logic from game.js ...
            let stairs;
            for (let y = 0; y < this.mapHeight; y++) {
                for (let x = 0; x < this.mapWidth; x++) {
                    if (this.map[y][x].char === '>') {
                        stairs = { x, y };
                        break;
                    }
                }
                if (stairs) break;
            }

            if (stairs) {
                const path = findPath(this.player, stairs, this.map, this.mapWidth, this.mapHeight);
                if (path.length > 0) {
                    const nextStep = path[0];
                    const dx = nextStep.x - this.player.x;
                    const dy = nextStep.y - this.player.y;
                    this.movePlayer(dx, dy);
                } else {
                    this.changeLevel(1);
                }
            }
        } else {
            // Attack nearest
            const nearestMonster = this.monsters.reduce((closest, monster) => {
                const dist = Math.hypot(monster.x - this.player.x, monster.y - this.player.y);
                return dist < closest.dist ? { monster, dist } : closest;
            }, { monster: null, dist: Infinity });

            if (nearestMonster.monster) {
                const path = findPath(this.player, nearestMonster.monster, this.map, this.mapWidth, this.mapHeight);
                if (path.length > 0) {
                    const nextStep = path[0];
                    const dx = nextStep.x - this.player.x;
                    const dy = nextStep.y - this.player.y;
                    this.movePlayer(dx, dy);
                }
            }
        }

        if (this.player.ability && this.player.ability.turn > 0) {
            this.player.ability.turn--;
        }

        this.draw();

        if (this.autoCombat) {
            setTimeout(() => this.autoCombatLoop(), 500);
        }
    }

    draw() {
        this.renderer.draw(this);
    }
}

module.exports = Game;
