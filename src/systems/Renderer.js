class Renderer {
    constructor() {
    }

    draw(gameState) {
        process.stdout.write('\x1B[2J\x1B[0f');
        this.drawMap(gameState);
        this.drawUI(gameState);
    }

    drawMap(gameState) {
        const { map, player, monsters, summons, corpses, mapWidth, mapHeight } = gameState;
        let buffer = '';
        for (let y = 0; y < mapHeight; y++) {
            let row = '';
            for (let x = 0; x < mapWidth; x++) {
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
                    } else if (tile.trap && tile.trap.revealed) {
                        row += `${tile.trap.color}${tile.trap.symbol}\x1b[0m`;
                    } else {
                        row += tile.char;
                    }
                }
            }
            buffer += row + '\n';
        }
        process.stdout.write(buffer);
    }

    drawUI(gameState) {
        const { player, level, logger, autoCombat, autoHeal } = gameState;
        console.log(`\nPlayer Stats: HP: ${player.stats.hp}/${player.stats.maxHp} | Atk: ${player.stats.attack} | Def: ${player.stats.defense} | XP: ${player.xp} | Level: ${player.level} | Dungeon Level: ${level}`);
        if (player.ability) console.log(`Ability: ${player.ability.name} (Cooldown: ${player.ability.turn > 0 ? player.ability.turn : 'Ready'})`);
        console.log(`Equipment: Weapon: ${player.equipment.weapon?.name || 'None'}, Armor: ${player.equipment.armor?.name || 'None'}`);
        console.log(`Inventory: ${player.inventory.map(item => item.name).join(', ')}`);
        console.log(`Auto-Combat: ${autoCombat ? 'On' : 'Off'} | Auto-Heal: ${autoHeal ? 'On' : 'Off'}`);
        console.log('--- Game Log ---');
        logger.getMessages().forEach(msg => console.log(msg));
        console.log('----------------');
    }
}

module.exports = Renderer;
