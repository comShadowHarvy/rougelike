const { exec } = require('pkg');

(async () => {
    await exec(['game.js', '--targets', 'node16-linux-x64,node16-win-x64', '--output', 'release/rougelike']);
})();
