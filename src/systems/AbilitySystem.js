const summonTypes = require('../data/summons');
const items = require('../data/items');
const { bossTypes } = require('../data/monsters');

class AbilitySystem {
    constructor(logger, combatSystem) {
        this.logger = logger;
        this.combat = combatSystem;
    }

    useAbility(gameState) {
        const { player, monsters, summons, map, mapWidth, mapHeight } = gameState;

        if (!player.ability) {
            this.logger.log('Your class has no ability.', 'info');
            return;
        }
        if (player.ability.turn > 0) {
            this.logger.log(`Your ability is on cooldown for ${player.ability.turn} more turns.`, 'info');
            return;
        }

        player.ability.turn = player.ability.cooldown;
        const habilidad = player.ability.name;

        // Helper to find nearest monster
        const findNearestMonster = () => {
            return monsters.reduce((closest, monster) => {
                const dist = Math.hypot(monster.x - player.x, monster.y - player.y);
                if (dist < closest.dist) {
                    return { monster, dist };
                }
                return closest;
            }, { monster: null, dist: Infinity });
        };

        if (habilidad === 'Eldritch Blast') {
            const target = findNearestMonster();
            if (target.monster) {
                this.combat.attack({ name: "Eldritch Blast", stats: { attack: 30, defense: 0 } }, target.monster, gameState);
            } else {
                this.logger.log('No target in sight.', 'info');
            }
        } else if (habilidad === 'Throw Bomb') {
            const target = findNearestMonster();
            if (target.monster) {
                monsters.forEach(monster => {
                    const dist = Math.hypot(monster.x - target.monster.x, monster.y - target.monster.y);
                    if (dist <= 3) {
                        this.combat.attack({ name: "Bomb", stats: { attack: 20, defense: 0 } }, monster, gameState);
                    }
                });
            } else {
                this.logger.log('No target in sight.', 'info');
            }
        } else if (habilidad === 'Lay on Hands') {
            player.stats.hp = player.stats.maxHp;
            this.logger.log('You used Lay on Hands and have been fully healed.', 'heal');
        } else if (habilidad === "DDoS") {
            monsters.forEach(m => {
                if (map[m.y][m.x].visible) m.stunned = 3;
            });
            this.logger.log('You DDoS all enemies in sight!', 'info');
        } else if (habilidad === "Intimidating Dance") {
            monsters.forEach(m => {
                if (Math.hypot(m.x - player.x, m.y - player.y) <= 5) m.fleeing = 3;
            });
            this.logger.log('You dance menacingly, enemies flee in terror!', 'info');
        } else if (habilidad === "Wrangle Gator") {
            if (Math.random() < 0.5) {
                this.summon(gameState, "Gator");
            } else {
                const gator = { ...summonTypes["Gator"], x: player.x + 1, y: player.y, stats: { ...summonTypes["Gator"].stats } };
                this.combat.attack(gator, player, gameState);
            }
        } else if (habilidad === "Spellstrike") {
            player.stats.attack += 20;
            this.logger.log('Your weapon glows with magical energy!', 'heal');
            setTimeout(() => {
                player.stats.attack -= 20;
                this.logger.log('The magical energy fades.', 'info');
            }, 5000);
        } else if (habilidad === "Summon Eidolon") {
            this.summon(gameState, "Eidolon");
        } else if (habilidad === "Judgment") {
            const target = findNearestMonster();
            if (target.monster) {
                target.monster.stats.attack -= 5;
                target.monster.stats.defense -= 5;
                this.logger.log(`${target.monster.name} has been judged!`, 'info');
            } else {
                this.logger.log('No target in sight.', 'info');
            }
        } else if (habilidad === "Curse") {
            const target = findNearestMonster();
            if (target.monster) {
                target.monster.cursed = 5;
                this.logger.log(`${target.monster.name} has been cursed!`, 'info');
            } else {
                this.logger.log('No target in sight.', 'info');
            }
        } else if (habilidad === "Inspire Courage") {
            player.stats.attack += 5;
            player.stats.defense += 5;
            summons.forEach(s => {
                s.stats.attack += 5;
                s.stats.defense += 5;
            });
            this.logger.log('You and your allies are inspired!', 'heal');
            setTimeout(() => {
                player.stats.attack -= 5;
                player.stats.defense -= 5;
                summons.forEach(s => {
                    s.stats.attack -= 5;
                    s.stats.defense -= 5;
                });
                this.logger.log('The inspiration fades.', 'info');
            }, 5000);
        } else if (habilidad === "Smite") {
            if (monsters.length > 0) {
                const randomIndex = Math.floor(Math.random() * monsters.length);
                const target = monsters[randomIndex];
                this.combat.attack({ name: "Smite", stats: { attack: 9999, defense: 0 } }, target, gameState);
            } else {
                this.logger.log('No enemies to smite.', 'info');
            }
        } else if (habilidad === "Serious Punch") {
            monsters.forEach(m => this.combat.attack({ name: "Serious Punch", stats: { attack: 9999, defense: 0 } }, m, gameState));
        } else if (habilidad === "Rewrite Reality") {
            for (let y = 0; y < mapHeight; y++) {
                for (let x = 0; x < mapWidth; x++) {
                    map[y][x].explored = true;
                }
            }
            this.logger.log('You see everything.', 'info');
        } else if (habilidad === "Omnipotence") {
            const legendaryItems = Object.keys(items.legendary);
            const itemName = legendaryItems[Math.floor(Math.random() * legendaryItems.length)];
            player.inventory.push({ name: itemName, type: "legendary", ...items.legendary[itemName] });
            this.logger.log(`You received a ${itemName}!`, 'heal');
        } else if (habilidad === "Return to Zero") {
            player.stats.hp = player.stats.maxHp;
            monsters.forEach(m => m.stats.hp = m.stats.maxHp);
            this.logger.log('Everything has been returned to zero.', 'heal');
        } else if (habilidad === "Roundhouse Kick") {
            const target = findNearestMonster();
            if (target.monster) {
                gameState.monsters = monsters.filter(m => m !== target.monster);
                this.logger.log(`You roundhouse kicked ${target.monster.name} into another dimension!`, 'info');
            } else {
                this.logger.log('No target in sight.', 'info');
            }
        } else if (habilidad === "Gunslinger") {
            for (let i = 0; i < 5; i++) {
                const target = findNearestMonster();
                if (target.monster) {
                    this.combat.attack(player, target.monster, gameState);
                }
            }
        } else if (habilidad === "Snap") {
            if (Math.random() < 0.5) {
                gameState.monsters = monsters.slice(0, Math.floor(monsters.length / 2));
                this.logger.log('You snapped your fingers. Half of all monsters are gone.', 'info');
            } else {
                this.logger.log('Your snap did nothing.', 'info');
            }
        } else if (habilidad === "Speedforce") {
            // Need access to gameLoop? Or just let it happen?
            // In new structure, maybe just log info and handle extra turns in Game class
            this.logger.log('You moved at the speed of light! (Not fully implemented in refactor yet)', 'info');
        } else if (habilidad === "Quantum Immortality") {
            this.logger.log('You contemplate your existence.', 'info');
        } else if (habilidad === "Hodl") {
            if (Math.random() < 0.5) {
                player.stats.attack *= 2;
                player.stats.defense *= 2;
                this.logger.log('Stonks go up! 2x stats!', 'heal');
                setTimeout(() => {
                    player.stats.attack /= 2;
                    player.stats.defense /= 2;
                    this.logger.log('Stonks returning to normal.', 'info');
                }, 5000);
            } else {
                player.stats.attack = Math.max(1, Math.floor(player.stats.attack / 2));
                player.stats.defense = Math.max(1, Math.floor(player.stats.defense / 2));
                this.logger.log('Stonks go down. Halved stats.', 'damage');
                setTimeout(() => {
                    player.stats.attack *= 2;
                    player.stats.defense *= 2;
                    this.logger.log('Market correction.', 'info');
                }, 5000);
            }
        } else if (habilidad === "Bark") {
            monsters.forEach(m => {
                if (Math.hypot(m.x - player.x, m.y - player.y) <= 5) {
                    m.fleeing = 3;
                }
            });
            this.logger.log('Such bark! Enemies are confused/scared!', 'info');
        } else if (habilidad === "Zoomies") {
            for (let i = 0; i < 3; i++) {
                const dx = Math.floor(Math.random() * 3) - 1;
                const dy = Math.floor(Math.random() * 3) - 1;
                const newX = player.x + dx;
                const newY = player.y + dy;
                if (newX >= 0 && newX < mapWidth && newY >= 0 && newY < mapHeight && map[newY][newX].walkable) {
                    player.x = newX;
                    player.y = newY;
                }
            }
            this.logger.log('Zoomies! You moved wildly.', 'info');
        } else if (habilidad === "White Knight") {
            const target = findNearestMonster();

            if (target.monster && target.dist < 5) {
                target.monster.stats.hp = target.monster.stats.maxHp;
                this.logger.log(`Simp mode activated! You fully healed ${target.monster.name}!`, 'info');
            } else {
                player.heal(20);
                this.logger.log(`You healed for 20 HP.`, 'heal');
            }
        } else if (habilidad === "U Mad?") {
            monsters.forEach(m => {
                m.stats.attack = Math.max(1, Math.floor(m.stats.attack * 0.8));
            });
            this.logger.log('Problem? Enemies look frustrated (Attack down).', 'info');
        } else if (habilidad === "Ignore Fire") {
            player.heal(20);
            player.stats.defense += 5;
            this.logger.log('This is fine. (+Def, +Heal)', 'heal');
        } else if (habilidad === "Challenge") {
            player.stats.defense += 10;
            this.logger.log('You challenge your foes! (+Def)', 'heal');
            setTimeout(() => { player.stats.defense -= 10; }, 5000);
        } else if (habilidad === "Evil Eye") {
            const target = findNearestMonster();
            if (target.monster) {
                target.monster.stats.defense = Math.floor(target.monster.stats.defense / 2);
                this.logger.log(`${target.monster.name} is cursed by the Evil Eye (Def halved)!`, 'info');
            }
        } else if (habilidad === "Bloodrage") {
            player.stats.attack += 20;
            player.stats.defense -= 10;
            this.logger.log('Bloodrage! (+Atk, -Def)', 'damage');
            setTimeout(() => {
                player.stats.attack -= 20;
                player.stats.defense += 10;
                this.logger.log('Bloodrage ended.', 'info');
            }, 5000);
        } else if (habilidad === "Raging Song") {
            player.stats.attack += 10;
            summons.forEach(s => s.stats.attack += 10);
            this.logger.log('Raging Song! Allies gain Attack.', 'heal');
            setTimeout(() => {
                player.stats.attack -= 10;
                summons.forEach(s => s.stats.attack -= 10);
            }, 5000);
        } else if (habilidad === "Spirit Animal") {
            this.summon(gameState, "Wolf");
        } else if (habilidad === "Studied Target") {
            player.nextAttackMult = 2;
            this.logger.log('Studied Target. Next attack deals 2x damage.', 'info');
        } else if (habilidad === "Raise Dead") {
            if (gameState.corpses.length > 0) {
                const corpse = gameState.corpses.pop();
                summons.push({ ...summonTypes["Skeleton"], x: corpse.x, y: corpse.y, stats: { ...summonTypes["Skeleton"].stats } });
                this.logger.log('Arise!', 'info');
            } else {
                this.logger.log('No corpses to raise.', 'info');
            }
        } else if (habilidad === "Mirror Image") {
            player.dodgeChance = 0.5;
            this.logger.log('Mirror Images invoke! (50% Dodge)', 'info');
            setTimeout(() => { player.dodgeChance = 0; this.logger.log('Mirror Images fade.', 'info'); }, 5000);
        } else if (habilidad === "Maneuvers") {
            const target = findNearestMonster();
            if (target.monster) {
                this.combat.attack({ name: "Maneuver", stats: { attack: player.stats.attack * 2, defense: 0 } }, target.monster, gameState);
                target.monster.stunned = 2;
            }
        } else if (habilidad === "Assassinate") {
            const target = findNearestMonster();
            if (target.monster) {
                const mult = (target.monster.stats.hp === target.monster.stats.maxHp) ? 3 : 1;
                this.combat.attack({ name: "Assassinate", stats: { attack: player.stats.attack * mult, defense: 0 } }, target.monster, gameState);
            }
        } else if (habilidad === "Tempest") {
            monsters.forEach(m => {
                if (Math.hypot(m.x - player.x, m.y - player.y) <= 5) {
                    this.combat.attack({ name: "Tempest", stats: { attack: 25, defense: 0 } }, m, gameState);
                }
            });
            this.logger.log('Storm rages around you!', 'damage');
        } else if (habilidad === "Preserve Life") {
            player.heal(50);
            summons.forEach(s => s.stats.hp = Math.min(s.stats.maxHp, s.stats.hp + 50));
            this.logger.log('Healing surge!', 'heal');
        } else if (habilidad === "BFG 9000") {
            const initialCount = monsters.length;
            gameState.monsters = monsters.filter(m => bossTypes[m.name] !== undefined); // Keep bosses
            const killed = initialCount - gameState.monsters.length;
            this.logger.log(`BFG 9000 fired! Vaporized ${killed} demons.`, 'damage');
        } else if (habilidad === "Spartan Rage") {
            player.invincible = true;
            player.stats.attack += 50;
            this.logger.log('SPARTAN RAGE!', 'damage');
            setTimeout(() => {
                player.invincible = false;
                player.stats.attack -= 50;
                this.logger.log('Rage subsides.', 'info');
            }, 5000);
        } else if (habilidad === "Kamehameha") {
            const target = findNearestMonster();
            if (target.monster) {
                this.combat.attack({ name: "Kamehameha", stats: { attack: 50, defense: 0 } }, target.monster, gameState);
            }
        } else if (habilidad === "Heat Vision") {
            const target = findNearestMonster();
            if (target.monster) {
                this.combat.attack({ name: "Heat Vision", stats: { attack: 40, defense: 0 } }, target.monster, gameState);
                this.logger.log('Lasers!', 'damage');
            }
        } else if (habilidad === "Portal Gun") {
            player.x = Math.floor(Math.random() * mapWidth);
            player.y = Math.floor(Math.random() * mapHeight);
            this.logger.log('Wubba Lubba Dub Dub! (Teleported)', 'info');
        } else if (habilidad === "Zoinks") {
            player.x = Math.floor(Math.random() * mapWidth);
            player.y = Math.floor(Math.random() * mapHeight);
            player.heal(20);
            this.logger.log('Zoinks! You ran away.', 'info');
        } else if (habilidad === "Run Away") {
            player.x = Math.floor(Math.random() * mapWidth);
            player.y = Math.floor(Math.random() * mapHeight);
            player.stats.defense += 5;
            this.logger.log('Rincewind ran away very fast! (+Def)', 'info');
            setTimeout(() => player.stats.defense -= 5, 5000);
        } else if (habilidad === "Knuckle Sandwich") {
            const target = monsters.reduce((closest, monster) => {
                const dist = Math.hypot(monster.x - player.x, monster.y - player.y);
                return dist < closest.dist ? { monster, dist } : closest;
            }, { monster: null, dist: Infinity });

            if (target.monster && target.dist <= 1.5) {
                this.combat.attack({ name: "Knuckle Sandwich", stats: { attack: player.stats.attack * 1.5, defense: 0 } }, target.monster, gameState);
                target.monster.stunned = 3;
                this.logger.log('Knuckle Sandwich served!', 'damage');
            }
        } else if (habilidad === "Headology") {
            monsters.forEach(m => {
                if (Math.hypot(m.x - player.x, m.y - player.y) <= 8) {
                    m.fleeing = 5;
                }
            });
            this.logger.log('I aten\'t dead! (Enemies flee)', 'info');
        } else if (habilidad === "Grebbo") {
            this.summon(gameState, "Cat");
        } else if (habilidad === "SQUEAK") {
            const target = findNearestMonster();
            if (target.monster) {
                this.combat.attack({ name: "DEATH", stats: { attack: 100, defense: 0 } }, target.monster, gameState);
                this.logger.log('SQUEAK.', 'death');
            }
        } else if (habilidad === "Oook!") {
            player.stats.attack += 20;
            player.stats.defense += 5;
            this.logger.log('Oook! (Berserk)', 'damage');
            setTimeout(() => { player.stats.attack -= 20; player.stats.defense -= 5; this.logger.log('Rationality returns.', 'info'); }, 8000);
        } else if (habilidad === "Silver Horde") {
            this.summon(gameState, "Barbarian");
        } else if (habilidad === "Arrest") {
            const target = findNearestMonster();
            if (target.monster) {
                target.monster.stunned = 5;
                this.logger.log('You are under arrest!', 'info');
            }
        } else if (habilidad === "Poker") {
            const target = findNearestMonster();
            if (target.monster) {
                this.combat.attack({ name: "Poker", stats: { attack: player.stats.attack * 2, defense: 0 } }, target.monster, gameState);
                target.monster.stunned = 2;
            }
        } else if (habilidad === "The Luggage") {
            this.summon(gameState, "Luggage");
        } else if (habilidad === "Politics") {
            monsters.forEach(m => {
                m.fleeing = 2;
                m.stats.attack = Math.max(1, m.stats.attack - 2);
            });
            this.logger.log('Don\'t let me detain you. (Enemies debuffed)', 'info');
        } else if (habilidad === "Wolf Form") {
            player.stats.attack += 10;
            player.stats.maxHp += 20;
            player.stats.hp += 20;
            this.logger.log('Wolf form!', 'heal');
        } else if (habilidad === "Piecemaker") {
            monsters.forEach(m => {
                if (Math.hypot(m.x - player.x, m.y - player.y) <= 3) {
                    this.combat.attack({ name: "Piecemaker", stats: { attack: 40, defense: 0 } }, m, gameState);
                }
            });
            this.logger.log('It works! (Area Damage)', 'damage');
        } else if (habilidad === "Con") {
            player.heal(10);
            this.logger.log('You talked your way out of it. (+10 HP)', 'heal');
        } else if (habilidad === "Nac Mac Feegle") {
            this.summon(gameState, "Feegle");
            this.summon(gameState, "Feegle");
            this.summon(gameState, "Feegle");
            this.logger.log('Crivens!', 'info');
        } else if (habilidad === "Bolter Fire") {
            const target = findNearestMonster();
            if (target.monster) {
                this.combat.attack({ name: "Bolter", stats: { attack: 25, defense: 0 } }, target.monster, gameState);
            }
        } else if (habilidad === "WAAAGH!") {
            player.stats.attack += 15;
            this.logger.log('WAAAGH!!!', 'damage');
            setTimeout(() => { player.stats.attack -= 15; }, 5000);
        } else if (habilidad === "Psychic Storm") {
            monsters.forEach(m => {
                if (Math.hypot(m.x - player.x, m.y - player.y) <= 4) {
                    this.combat.attack({ name: "Psychic Storm", stats: { attack: 15, defense: 0 } }, m, gameState);
                }
            });
            this.logger.log('The warp overtakes them!', 'damage');
        } else if (habilidad === "Mark of Chaos") {
            const roll = Math.random();
            if (roll < 0.33) { player.stats.attack += 5; this.logger.log('Khorne grants strength!', 'damage'); }
            else if (roll < 0.66) { player.stats.defense += 5; this.logger.log('Nurgle grants resilience!', 'heal'); }
            else { player.heal(20); this.logger.log('Slaanesh grants pleasure (healing)!', 'heal'); }

        } else if (habilidad === "Devour") {
            const target = monsters.reduce((closest, monster) => {
                const dist = Math.hypot(monster.x - player.x, monster.y - player.y);
                return dist < closest.dist ? { monster, dist } : closest;
            }, { monster: null, dist: Infinity });
            if (target.monster && target.dist <= 1.5) {
                this.combat.attack({ name: "Devour", stats: { attack: 20, defense: 0 } }, target.monster, gameState);
                player.heal(15);
                this.logger.log('Om nom nom.', 'heal');
            }
        } else if (habilidad === "Reanimation Protocols") {
            player.stats.hp = player.stats.maxHp;
            this.logger.log('Reanimation Protocols engaged.', 'heal');
        } else if (habilidad === "Flamer") {
            monsters.forEach(m => {
                if (Math.hypot(m.x - player.x, m.y - player.y) <= 3) {
                    this.combat.attack({ name: "Flamer", stats: { attack: 20, defense: 0 } }, m, gameState);
                }
            });
            this.logger.log('Purge the heretic!', 'damage');
        } else if (habilidad === "Rite of Repair") {
            player.heal(20);
            player.stats.defense += 5;
            this.logger.log('Praise the Omnissiah.', 'heal');
        } else if (habilidad === "Execute") {
            if (summons.length > 0) {
                const s = summons.pop();
                this.logger.log(`Executed ${s.name} for morale!`, 'death');
                player.stats.attack += 20;
                setTimeout(() => player.stats.attack -= 20, 10000);
            } else {
                player.stats.attack += 5;
                this.logger.log('Inspiration!', 'damage');
            }
        } else if (habilidad === "Nemesis Force") {
            const target = findNearestMonster();
            if (target.monster) {
                this.combat.attack({ name: "Nemesis Weapon", stats: { attack: 50, defense: 0 } }, target.monster, gameState);
            }
        } else if (habilidad === "Deathblow") {
            const target = findNearestMonster();
            if (target.monster) {
                this.combat.attack({ name: "Deathblow", stats: { attack: player.stats.hp < 50 ? 100 : 40, defense: 0 } }, target.monster, gameState);
            }
        } else if (habilidad === "Sigmar's Wrath") {
            monsters.forEach(m => {
                if (Math.hypot(m.x - player.x, m.y - player.y) <= 2) {
                    this.combat.attack({ name: "Hammer", stats: { attack: 30, defense: 0 } }, m, gameState);
                }
            });
            this.logger.log('For Sigmar!', 'damage');
        } else if (habilidad === "Accusation") {
            const target = findNearestMonster();
            if (target.monster) {
                target.monster.stats.defense = 0;
                this.logger.log('HERETIC!', 'info');
            }
        } else if (habilidad === "Doomrocket") {
            monsters.forEach(m => {
                this.combat.attack({ name: "Doomrocket", stats: { attack: 40, defense: 0 } }, m, gameState);
            });
            player.stats.hp -= 20;
            this.logger.log('Yes-yes! Boom!', 'damage');
        } else if (habilidad === "Guardian Spear") {
            player.stats.attack += 10;
            player.stats.defense += 10;
            this.logger.log('For the Emperor!', 'heal');
            setTimeout(() => { player.stats.attack -= 10; player.stats.defense -= 10; }, 8000);
        } else {
            this.logger.log('This ability is not yet implemented.', 'info');
        }
    }

    summon(gameState, type) {
        const { player, summons, map, monsters, mapWidth, mapHeight } = gameState;
        if (summons.length > 0 && player.canSummon) {
            this.logger.log('You can only have one summon at a time.', 'info');
            return;
        }

        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 1000) {
            attempts++;
            const sx = player.x + Math.floor(Math.random() * 3) - 1;
            const sy = player.y + Math.floor(Math.random() * 3) - 1;
            if (sx >= 0 && sx < mapWidth && sy >= 0 && sy < mapHeight && map[sy][sx].walkable && (sx !== player.x || sy !== player.y) && !monsters.some(m => m.x === sx && m.y === sy) && !summons.some(s => s.x === sx && s.y === sy)) {
                summons.push({ ...summonTypes[type], x: sx, y: sy, stats: { ...summonTypes[type].stats } });
                placed = true;
                this.logger.log(`A ${type} has been summoned!`, 'info');
            }
        }
    }
}

module.exports = AbilitySystem;
