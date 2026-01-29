const trapTypes = {
    "Spike Pit": { name: "Spike Pit", damage: 10, message: "You fell into a spike pit!", symbol: '^', color: '\x1b[31m' },
    "Poison Gas": { name: "Poison Gas", effect: "poison", damage: 5, duration: 5, message: "You triggered a poison gas trap!", symbol: ';', color: '\x1b[32m' },
    "Teleport Trap": { name: "Teleport Trap", effect: "teleport", message: "You stepped on a teleport trap!", symbol: '@', color: '\x1b[35m' }
};

module.exports = trapTypes;
