const { findPath } = require('../utils/Pathfinding');

class AISystem {
    constructor(combatSystem) {
        this.combat = combatSystem;
    }

    moveMonsters(gameState) {
        const { monsters, player, map, mapWidth, mapHeight, summons } = gameState;

        for (const monster of monsters) {
            if (monster.stunned > 0) {
                monster.stunned--;
                continue;
            }
            if (monster.fleeing > 0) {
                monster.fleeing--;
                const dx = Math.sign(monster.x - player.x);
                const dy = Math.sign(monster.y - player.y);
                const newX = monster.x + dx;
                const newY = monster.y + dy;
                if (newX >= 0 && newX < mapWidth && newY >= 0 && newY < mapHeight && map[newY][newX].walkable) {
                    monster.x = newX;
                    monster.y = newY;
                }
                continue;
            }


            const dist = Math.hypot(monster.x - player.x, monster.y - player.y);

            if (dist <= 10) { // Detection radius
                const path = findPath(monster, player, map, mapWidth, mapHeight);
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
                    this.combat.attack(monster, player, gameState);
                }
            } else {
                // Random movement
                const dx = Math.floor(Math.random() * 3) - 1;
                const dy = Math.floor(Math.random() * 3) - 1;
                const newX = monster.x + dx;
                const newY = monster.y + dy;

                if (newX === player.x && newY === player.y) {
                    this.combat.attack(monster, player, gameState);
                    continue;
                }

                if (newX >= 0 && newX < mapWidth && newY >= 0 && newY < mapHeight && map[newY][newX].walkable) {
                    const isMonster = monsters.some(m => m.x === newX && m.y === newY);
                    if (!isMonster) {
                        monster.x = newX;
                        monster.y = newY;
                    }
                }
            }
        }
    }

    moveSummons(gameState) {
        const { summons, monsters, player, map, mapWidth, mapHeight } = gameState;

        for (const summon of summons) {
            const nearestMonster = monsters.reduce((closest, monster) => {
                const dist = Math.hypot(monster.x - summon.x, monster.y - summon.y);
                if (dist < closest.dist) {
                    return { monster, dist };
                }
                return closest;
            }, { monster: null, dist: Infinity });

            let dx, dy;

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
                this.combat.attack(summon, monster, gameState);
                continue;
            }

            if (newX >= 0 && newX < mapWidth && newY >= 0 && newY < mapHeight && map[newY][newX].walkable) {
                const isOccupied = monsters.some(m => m.x === newX && m.y === newY) || summons.some(s => s.x === newX && s.y === newY);
                if (!isOccupied) {
                    summon.x = newX;
                    summon.y = newY;
                }
            }
        }
    }
}

module.exports = AISystem;
