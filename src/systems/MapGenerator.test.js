const MapGenerator = require('./MapGenerator');

describe('MapGenerator System', () => {
    let mapGen;
    let player;

    beforeEach(() => {
        mapGen = new MapGenerator(50, 20);
        player = { x: 0, y: 0 };
    });

    it('should generate a map of correct dimensions', () => {
        const result = mapGen.generate(1, player);
        expect(result.map.length).toBe(20);
        expect(result.map[0].length).toBe(50);
        expect(result.map[0][0]).toHaveProperty('char');
        expect(result.map[0][0]).toHaveProperty('walkable');
    });

    it('should place stairs', () => {
        const result = mapGen.generate(2, player);

        let downStairFound = false;
        let upStairFound = false;

        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 50; x++) {
                if (result.map[y][x].char === '>') downStairFound = true;
                if (result.map[y][x].char === '<') upStairFound = true;
            }
        }

        expect(downStairFound).toBe(true);
        expect(upStairFound).toBe(true);
    });

    it('should place the player on a walkable tile', () => {
        const result = mapGen.generate(1, player);
        expect(result.map[player.y][player.x].walkable).toBe(true);
    });
});
