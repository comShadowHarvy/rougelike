class Combat {
    constructor(logger) {
        this.logger = logger;
    }

    attack(attacker, defender, gameState) {
        const { player, corpses } = gameState;

        // Defensive checks
        if (defender === player && player.invincible) {
            this.logger.log('Attack deflected by Spartan Rage!', 'info');
            return;
        }
        if (defender === player && player.dodgeChance > 0 && Math.random() < player.dodgeChance) {
            this.logger.log('You dodged the attack (Mirror Image)!', 'info');
            return;
        }

        // Offensive modifiers
        if (player.ability?.name === "Harambe" && defender.name === "Troll" && attacker === player) {
            player.stats.attack += 10;
            this.logger.log('Harambe is enraged!', 'heal');
        }

        if (player.ability?.name === "Distracted Boyfriend" && attacker === player && Math.random() < 0.5) {
            this.logger.log('You were distracted and missed!', 'info');
            return;
        }

        let damage = Math.max(0, attacker.stats.attack - defender.stats.defense);

        if (attacker === player && player.nextAttackMult > 1) {
            damage *= player.nextAttackMult;
            player.nextAttackMult = 1;
            this.logger.log('Critical Hit from study!', 'damage');
        }

        // Apply damage
        defender.stats.hp -= damage;
        this.logger.log(`${attacker.name} attacks ${defender.name} for ${damage} damage.`, 'damage');

        // Death handling
        if (defender.stats.hp <= 0) {
            if (defender === player) {
                this.logger.log('You have been defeated! Game Over.', 'death');
                process.exit();
            } else {
                this.logger.log(`${defender.name} has been defeated! You gain ${defender.xpValue} XP.`, 'info');
                player.gainXp(defender.xpValue);
                if (player.levelUp()) {
                    this.logger.log(`You have reached level ${player.level}!`, 'heal');
                }

                corpses.push({ x: defender.x, y: defender.y, symbol: '%' });

                // Remove from monsters list
                const index = gameState.monsters.indexOf(defender);
                if (index > -1) {
                    gameState.monsters.splice(index, 1);
                }
            }
        }
    }
}

module.exports = Combat;
