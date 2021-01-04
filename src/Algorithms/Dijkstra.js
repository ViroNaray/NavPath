import { initDiscoveredGrid, initTotalWeightGridWithInfinity, PriorityQueue } from './CommonFunctions';

// Determines the shortest path using Djikstra's algorithm

// homeCoords and destCoords are in the format of [row, col]
function dijkstraSolve(origGrid, homeCoords, destCoords) {
    const grid = origGrid.slice();

    // Must contain structures using <row> and <col>
    const nodesVisitedInOrder = [];

    // Create discoveredMap
    const discoveredMap = initDiscoveredGrid(grid);

    const totalWeights = initTotalWeightGridWithInfinity(grid);
    totalWeights[homeCoords[0]][homeCoords[1]] = 0;

    // Create PQ and add the Home Node
    let pq = new PriorityQueue();
    pq.push(homeCoords[0], homeCoords[1], 0); // Row, Col, Weight

    // Continue while there are still nodes in the PQ
    while (!pq.empty()) {
        const closestNode = pq.top();
        pq.pop();

        // Mark the node as discovered - we can guarantee that there is no shorter path
        if (!discoveredMap[closestNode.row][closestNode.col]) {
            nodesVisitedInOrder.push(closestNode);
            discoveredMap[closestNode.row][closestNode.col] = true;
        }

        // Check if this is the destination
        if (closestNode.row === destCoords[0] && closestNode.col === destCoords[1])
            break;

        //addNeighbors(grid, pq, closestNode, totalWeights/*, discoveredMap*/);
        // Add neighbors
        addNodeToPQ(grid, totalWeights, pq, closestNode, closestNode.row, closestNode.col + 1);
        addNodeToPQ(grid, totalWeights, pq, closestNode, closestNode.row - 1, closestNode.col);
        addNodeToPQ(grid, totalWeights, pq, closestNode, closestNode.row, closestNode.col - 1);
        addNodeToPQ(grid, totalWeights, pq, closestNode, closestNode.row + 1, closestNode.col);
    }

    return [nodesVisitedInOrder, grid];
}


function addNodeToPQ(grid, totalWeights, pq, parent, row, col) {
    // Return if out of bounds or is a wall
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[row].length || grid[row][col].isWall)
        return;

    const prospectiveWeight = totalWeights[parent.row][parent.col] + grid[row][col].weight;
    // Update if the prospective weight is better than our current weight
    if (prospectiveWeight < totalWeights[row][col]) {
        pq.push(row, col, prospectiveWeight);

        totalWeights[row][col] = prospectiveWeight;
        grid[row][col].parentNode = grid[parent.row][parent.col];
    }
}



export default dijkstraSolve;


