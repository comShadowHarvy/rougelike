class FOV {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.radius = 10;
    }

    compute(map, player) {
        // First, set all tiles to not visible
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                map[y][x].visible = false;
            }
        }

        // Ray-casting algorithm
        for (let i = 0; i < 360; i++) {
            let x = Math.cos(i * 0.01745);
            let y = Math.sin(i * 0.01745);
            let ox = player.x + 0.5;
            let oy = player.y + 0.5;
            for (let j = 0; j < this.radius; j++) {
                let ix = Math.floor(ox);
                let iy = Math.floor(oy);
                if (ix >= 0 && ix < this.width && iy >= 0 && iy < this.height) {
                    map[iy][ix].visible = true;
                    map[iy][ix].explored = true;
                    // If simple wall blocking logic:
                    if (!map[iy][ix].walkable) break;
                }
                ox += x;
                oy += y;
            }
        }
    }
}

module.exports = FOV;
