class Player {
    constructor(classData, name = "Player") {
        this.name = name;
        this.description = classData.description;
        this.baseStats = { ...classData.stats };
        this.stats = { ...classData.stats, maxHp: classData.stats.hp };
        this.ability = classData.ability ? { ...classData.ability, turn: 0 } : null;
        this.canSummon = classData.canSummon || false;

        this.x = 0;
        this.y = 0;
        this.xp = 0;
        this.level = 1;
        this.inventory = [];
        this.equipment = { weapon: null, armor: null };

        // Status effects
        this.invincible = false;
        this.dodgeChance = 0;
        this.nextAttackMult = 1;
    }

    gainXp(amount) {
        this.xp += amount;
    }

    levelUp() {
        if (this.xp >= 100) {
            this.level++;
            this.xp -= 100;
            this.stats.maxHp += 10;
            this.stats.hp = this.stats.maxHp;
            this.stats.attack += 2;
            this.stats.defense += 1;
            return true;
        }
        return false;
    }

    heal(amount) {
        const oldHp = this.stats.hp;
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
        return this.stats.hp - oldHp;
    }

    takeDamage(amount) {
        if (this.invincible) return 0;
        if (Math.random() < this.dodgeChance) return -1; // Dodged

        // Calculate actual damage in combat system, this just applies it?
        // Or we pass raw damage here and defense is calculated?
        // Game logic has: damage = max(0, atk - def)
        // So we assume 'amount' is already calculated damage?
        // No, usually takeDamage calculates reduction.
        // But the game logic does it outside.
        // "let damage = Math.max(0, attacker.stats.attack - defender.stats.defense);"

        this.stats.hp -= amount;
        return amount;
    }

    equipItem(item) {
        if (item.type === 'weapons') {
            if (this.equipment.weapon) {
                this.stats.attack -= this.equipment.weapon.attack;
                this.inventory.push(this.equipment.weapon);
            }
            this.equipment.weapon = item;
            this.stats.attack += item.attack;
        } else if (item.type === 'armor') {
            if (this.equipment.armor) {
                this.stats.defense -= this.equipment.armor.defense;
                this.inventory.push(this.equipment.armor);
            }
            this.equipment.armor = item;
            this.stats.defense += item.defense;
        }
    }
}

module.exports = Player;
