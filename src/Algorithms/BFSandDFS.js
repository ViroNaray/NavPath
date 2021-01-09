import { initDiscoveredGrid } from './CommonFunctions';

// Determins the path between the 2 points using either BFS or DFS

function traditionalSolve(oldGrid, homeCoords, destCoords, useBFS) {
    const grid = oldGrid.slice();

    // Must contain structures using <row> and <col>
    const nodesVisitedInOrder = [];

    // Create discoveredMap and set the Home Point as discovered
    const discoveredMap = initDiscoveredGrid(grid);
    discoveredMap[homeCoords[0]][homeCoords[1]] = true;

    // Create dequeue and add the Home Node
    const deque = [];
    deque.push(new Coordinate(homeCoords[0], homeCoords[1])); // Row, Col

    // Continue while there are still nodes in the deque
    while (deque.length !== 0) {
        let nextNode;

        // Get the next node based on BFS/DFS
        if (useBFS) // Using a queue structure
            nextNode = deque.shift();
        else // Using a stack structure
            nextNode = deque.pop();

        nodesVisitedInOrder.push(nextNode);

        // We do not need to check since the algorithm stops when the destination is a neighbor
        // // Check if this is the destination
        // if (nextNode.row === destCoords[0] && nextNode.col === destCoords[1])
        //     break;

        if (addNeighbors(grid, deque, nextNode, discoveredMap, destCoords)) {
            nodesVisitedInOrder.push(new Coordinate(destCoords[0], destCoords[1]));
            break;
        }
    }

    return [nodesVisitedInOrder, grid];
}


// Returns true if the destination has been found
function addNeighbors(grid, deque, node, discoveredMap, destCoords) {
    // Add to the deque if it is within the bounds, has not been discovered, and is not a wall

    // Right
    if (node.col < grid[0].length - 1 && !discoveredMap[node.row][node.col + 1] && !grid[node.row][node.col + 1].isWall) {
        grid[node.row][node.col + 1].parentNode = grid[node.row][node.col];
        discoveredMap[node.row][node.col + 1] = true;

        if (node.row === destCoords[0] && node.col + 1 === destCoords[1])
            return true;

        deque.push(new Coordinate(node.row, node.col + 1));
        //pq.push(node.row, node.col + 1, grid[node.row][node.col + 1].weight + node.weight, [node.row, node.col]);
    }

    // Above
    if (node.row > 0 && !discoveredMap[node.row - 1][node.col] && !grid[node.row - 1][node.col].isWall) {
        grid[node.row - 1][node.col].parentNode = grid[node.row][node.col];
        discoveredMap[node.row - 1][node.col] = true;

        if (node.row - 1 === destCoords[0] && node.col === destCoords[1])
            return true;

        deque.push(new Coordinate(node.row - 1, node.col));
        //pq.push(node.row - 1, node.col, grid[node.row - 1][node.col].weight + node.weight, [node.row, node.col]);
    }

    // Left
    if (node.col > 0 && !discoveredMap[node.row][node.col - 1] && !grid[node.row][node.col - 1].isWall) {
        grid[node.row][node.col - 1].parentNode = grid[node.row][node.col];
        discoveredMap[node.row][node.col - 1] = true;

        if (node.row === destCoords[0] && node.col - 1 === destCoords[1])
            return true;

        deque.push(new Coordinate(node.row, node.col - 1));
        //pq.push(node.row, node.col - 1, grid[node.row][node.col - 1].weight + node.weight, [node.row, node.col]);
    }

    // Below
    if (node.row < grid.length - 1 && !discoveredMap[node.row + 1][node.col] && !grid[node.row + 1][node.col].isWall) {
        grid[node.row + 1][node.col].parentNode = grid[node.row][node.col];
        discoveredMap[node.row + 1][node.col] = true;

        if (node.row + 1 === destCoords[0] && node.col === destCoords[1])
            return true;

        deque.push(new Coordinate(node.row + 1, node.col));
        //pq.push(node.row + 1, node.col, grid[node.row + 1][node.col].weight + node.weight, [node.row, node.col]);
    }

    return false;

}


class Coordinate {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}



export default traditionalSolve;
