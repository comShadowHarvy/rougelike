const fs = require('fs');
const path = require('path');

const SAVE_DIR = path.join(__dirname, '../../saves');
const SAVE_FILE = path.join(SAVE_DIR, 'savegame.json');

function saveGame(gameState) {
    try {
        if (!fs.existsSync(SAVE_DIR)) {
            fs.mkdirSync(SAVE_DIR, { recursive: true });
        }

        // Simple serialization of the game state
        // In a real scenario, you'd want to handle circular structures or class instances
        const serialized = JSON.stringify(gameState, null, 2);
        fs.writeFileSync(SAVE_FILE, serialized, 'utf8');
        return true;
    } catch (err) {
        console.error('Failed to save game:', err);
        return false;
    }
}

function loadGame() {
    try {
        if (fs.existsSync(SAVE_FILE)) {
            const data = fs.readFileSync(SAVE_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('Failed to load game:', err);
    }
    return null;
}

module.exports = { saveGame, loadGame };
