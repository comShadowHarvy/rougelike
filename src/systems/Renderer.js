const blessed = require('blessed');

class Renderer {
    constructor() {
        this.screen = blessed.screen({
            smartCSR: true,
            title: 'Roguelike TUI'
        });

        this.mapBox = blessed.box({
            top: 0,
            left: 0,
            width: '70%',
            height: '100%',
            content: '',
            border: { type: 'line' },
            style: { border: { fg: '#f0f0f0' } }
        });

        this.sidebar = blessed.box({
            top: 0,
            left: '70%',
            width: '30%',
            height: '100%',
            border: { type: 'line' },
            style: { border: { fg: '#f0f0f0' } }
        });

        this.statsBox = blessed.box({
            parent: this.sidebar,
            top: 0,
            left: 0,
            width: '100%-2',
            height: '50%',
            content: 'Stats loading...',
            tags: false
        });

        this.logBox = blessed.box({
            parent: this.sidebar,
            top: '50%',
            left: 0,
            width: '100%-2',
            height: '50%',
            content: 'Logs loading...',
            tags: false
        });

        this.screen.append(this.mapBox);
        this.screen.append(this.sidebar);
    }

    draw(gameState) {
        this.drawMap(gameState);
        this.drawUI(gameState);
        this.screen.render();
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
                    row += `\x1b[90m${corpse ? `\x1b[31m${corpse.symbol}\x1b[0m\x1b[90m` : tile.char}\x1b[0m`; // Dim gray
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
        this.mapBox.setContent(buffer);
    }

    drawUI(gameState) {
        const { player, level, logger, autoCombat, autoHeal } = gameState;

        let statsContent = `Player Stats:
HP: ${player.stats.hp}/${player.stats.maxHp}
Atk: ${player.stats.attack} | Def: ${player.stats.defense}
XP: ${player.xp} | Level: ${player.level}
Dungeon Lvl: ${level}

`;
        if (player.ability) {
            statsContent += `Ability: ${player.ability.name} \nCooldown: ${player.ability.turn > 0 ? player.ability.turn : 'Ready'}\n\n`;
        }

        statsContent += `Equipment:
Wpn: ${player.equipment.weapon?.name || 'None'}
Arm: ${player.equipment.armor?.name || 'None'}

Inventory: 
${player.inventory.map(item => item.name).join(', ') || 'Empty'}

Auto-Combat: ${autoCombat ? 'On' : 'Off'}
Auto-Heal: ${autoHeal ? 'On' : 'Off'}`;

        this.statsBox.setContent(statsContent);

        let logContent = '--- Game Log ---\n';
        logContent += logger.getMessages().join('\n');

        this.logBox.setContent(logContent);
    }
}

module.exports = Renderer;
