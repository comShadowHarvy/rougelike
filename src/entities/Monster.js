class Monster {
    constructor(typeData, x, y) {
        this.name = typeData.name;
        this.symbol = typeData.symbol;
        this.color = typeData.color || '\x1b[37m'; // Default to white if undefined
        this.xpValue = typeData.xpValue || 0;
        this.stats = { ...typeData.stats, maxHp: typeData.stats.hp };
        this.x = x;
        this.y = y;

        // Status effects
        this.stunned = 0;
        this.fleeing = 0;
        this.cursed = 0;
    }

    isAlive() {
        return this.stats.hp > 0;
    }
}

module.exports = Monster;
