function findPath(start, end, map, mapWidth, mapHeight) {
    const openList = [];
    const closedList = [];
    const startNode = { x: start.x, y: start.y, g: 0, h: 0, f: 0, parent: null };

    openList.push(startNode);

    while (openList.length > 0) {
        let lowestFIndex = 0;
        for (let i = 0; i < openList.length; i++) {
            if (openList[i].f < openList[lowestFIndex].f) {
                lowestFIndex = i;
            }
        }
        let currentNode = openList[lowestFIndex];

        if (currentNode.x === end.x && currentNode.y === end.y) {
            let path = [];
            let current = currentNode;
            while (current.parent) {
                path.push(current);
                current = current.parent;
            }
            return path.reverse();
        }

        openList.splice(lowestFIndex, 1);
        closedList.push(currentNode);

        const neighbors = [
            { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
        ];

        for (const neighbor of neighbors) {
            const newX = currentNode.x + neighbor.x;
            const newY = currentNode.y + neighbor.y;

            if (newX < 0 || newX >= mapWidth || newY < 0 || newY >= mapHeight) continue;
            if (!map[newY][newX].walkable) continue;
            if (closedList.find(node => node.x === newX && node.y === newY)) continue;

            const gScore = currentNode.g + 1;
            let gScoreIsBest = false;

            let neighborNode = openList.find(node => node.x === newX && node.y === newY);
            if (!neighborNode) {
                gScoreIsBest = true;
                neighborNode = { x: newX, y: newY, h: Math.abs(newX - end.x) + Math.abs(newY - end.y), parent: currentNode };
                openList.push(neighborNode);
            } else if (gScore < neighborNode.g) {
                gScoreIsBest = true;
            }

            if (gScoreIsBest) {
                neighborNode.parent = currentNode;
                neighborNode.g = gScore;
                neighborNode.f = neighborNode.g + neighborNode.h;
            }
        }
    }

    return []; // No path found
}

module.exports = { findPath };
