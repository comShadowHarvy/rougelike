const Combat = require('./Combat');

describe('Combat System', () => {
    let combat;
    let mockLogger;
    let attacker;
    let defender;
    let gameState;

    beforeEach(() => {
        mockLogger = { log: jest.fn() };
        combat = new Combat(mockLogger);

        attacker = {
            name: 'Attacker',
            stats: { attack: 15, defense: 5, hp: 50, maxHp: 50 },
            x: 0,
            y: 0
        };

        defender = {
            name: 'Defender',
            stats: { attack: 10, defense: 5, hp: 30, maxHp: 30 },
            x: 1,
            y: 0,
            xpValue: 10
        };

        gameState = {
            player: attacker,
            monsters: [defender],
            corpses: []
        };

        attacker.gainXp = jest.fn();
        attacker.levelUp = jest.fn(() => false);
    });

    it('should deal damage correctly', () => {
        combat.attack(attacker, defender, gameState);
        expect(defender.stats.hp).toBe(20); // 30 - (15 - 5)
        expect(mockLogger.log).toHaveBeenCalledWith('Attacker attacks Defender for 10 damage.', 'damage');
    });

    it('should handle defender death', () => {
        defender.stats.hp = 10;
        combat.attack(attacker, defender, gameState);

        expect(defender.stats.hp).toBe(0);
        expect(mockLogger.log).toHaveBeenCalledWith('Defender has been defeated! You gain 10 XP.', 'info');
        expect(attacker.gainXp).toHaveBeenCalledWith(10);
        expect(gameState.corpses.length).toBe(1);
        expect(gameState.monsters.length).toBe(0);
    });

    it('should not deal negative damage', () => {
        attacker.stats.attack = 2; // Defense 5 > Attack 2
        combat.attack(attacker, defender, gameState);
        expect(defender.stats.hp).toBe(30); // HP shouldn't change
    });
});
