import React, { Component } from 'react';
import Node from './Node';
import Buttons from './Buttons';

import traditionalSolve from '../Algorithms/BFSandDFS';
import dijkstraSolve from '../Algorithms/Dijkstra';
import aStarSolve from '../Algorithms/AStar';
import { backtrackPath } from '../Algorithms/CommonFunctions';
import './Styles/Grid.css';


// pseudo-enum
// const PathfindingMethod = {
//     DIJKSTRA: 1
// };


class Grid extends Component {

    constructor() {
        super();
        this.state = {
            grid: [],
            weightMultiplier: 15,
            mouseIsPressed: false,
            clickSettingOn: false,
            clickSettingIsWall: true,
            movingEndpoints: false, // Only set on mouse down
            movingHome: false,
            homeCoords: [10, 10],
            destCoords: [10, 44],
            isSolving: false,
            isSolved: false
        };
    }


    componentDidMount() {
        const numRows = 21;
        const numCols = 55;

        const initGrid = getStarterGrid(numRows, numCols, this.state.homeCoords, this.state.destCoords);
        this.setState({ grid: initGrid });
    }


    handleMouseDown(row, col) {
        // Return if the path is currently being solved
        if (this.state.isSolving || this.state.isSolved)
            return;

        // Check if we are moving either the Home point or the Destination
        if (this.state.grid[row][col].isHome) {
            this.setState({ mouseIsPressed: true, movingEndpoints: true, movingHome: true });
            return;
        }
        else if (this.state.grid[row][col].isDest) {
            this.setState({ mouseIsPressed: true, movingEndpoints: true, movingHome: false });
            return;
        }

        // Get the new click settings and toggle
        // The new setting is the opposite of whatever the current click mode property is for the clicked node
        let newClickSetting;
        if (this.state.clickSettingIsWall)
            newClickSetting = !this.state.grid[row][col].isWall;
        else
            newClickSetting = this.state.grid[row][col].weight === 1;


        const updatedGrid = toggleNodeType(this.state.grid, row, col, newClickSetting, this.state.clickSettingIsWall, this.state.weightMultiplier);
        this.setState({ grid: updatedGrid, mouseIsPressed: true, clickSettingOn: newClickSetting, movingEndpoints: false });
    }


    handleMouseEnter(row, col) {
        // Ignore if we are not dragging or if the path is being solved
        if (!this.state.mouseIsPressed || this.state.isSolving) {
            return;
        }
        // Check if we are moving either the Home point or the Destination
        else if (this.state.movingEndpoints) {
            let coords;
            let updatedGrid;

            if (this.state.movingHome) {
                coords = this.state.homeCoords;
                [updatedGrid, coords] = changeEndpointLocation(this.state.grid, row, col, coords, true);
                this.setState({ grid: updatedGrid, homeCoords: coords });
            }
            else {
                coords = this.state.destCoords;
                [updatedGrid, coords] = changeEndpointLocation(this.state.grid, row, col, coords, false);
                this.setState({ grid: updatedGrid, destCoords: coords });
            }

            return;
        }
        // Make sure we don't turn an endpoint into a wall
        else if (this.state.grid[row][col].isHome || this.state.grid[row][col].isDest) {
            return;
        }

        const updatedGrid = toggleNodeType(this.state.grid, row, col, this.state.clickSettingOn, this.state.clickSettingIsWall, this.state.weightMultiplier);
        this.setState({ grid: updatedGrid });
    }


    handleMouseUp() {
        this.setState({ mouseIsPressed: false });
    }

    // 0 - BFS
    // 1 - DFS
    // 2 - Dijkstra
    // 3 - A-Star
    findPath(pathfindingMethod) {
        if (this.state.isSolving)
            return;

        this.clearGrid(0);
        this.setState({ isSolving: true });

        let nodesDiscoveredInOrder;

        document.getElementById('weight-warning').style.display = (pathfindingMethod <= 1) ? '' : 'none';

        switch (pathfindingMethod) {
            case 0:
                nodesDiscoveredInOrder = traditionalSolve(this.state.grid, this.state.homeCoords, this.state.destCoords, true);
                break;

            case 1:
                nodesDiscoveredInOrder = traditionalSolve(this.state.grid, this.state.homeCoords, this.state.destCoords, false);
                break;

            case 2:
                let gridWithParentsDijkstra;
                [nodesDiscoveredInOrder, gridWithParentsDijkstra] = dijkstraSolve(this.state.grid, this.state.homeCoords, this.state.destCoords);
                this.setState({ grid: gridWithParentsDijkstra });
                break;

            case 3:
                let gridWithParentsAStar;
                [nodesDiscoveredInOrder, gridWithParentsAStar] = aStarSolve(this.state.grid, this.state.homeCoords, this.state.destCoords);
                this.setState({ grid: gridWithParentsAStar });
                break;

            default:
                return;
        }

        this.animate(nodesDiscoveredInOrder);

    }

    animate(nodesDiscoveredInOrder) {
        for (let i = 0; i < nodesDiscoveredInOrder.length; i++) {
            setTimeout(() => {
                const node = nodesDiscoveredInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).classList.add("node-discovered");
            }, 6 * i);
        }

        setTimeout(() => {
            this.animatePath();
        }, 6 * nodesDiscoveredInOrder.length);
    }

    animatePath() {
        const path = backtrackPath(this.state.grid[this.state.destCoords[0]][this.state.destCoords[1]]);

        for (let i = path.length - 1; i >= 0; i--) {
            setTimeout(() => {
                const node = path[i];
                document.getElementById(`node-${node.row}-${node.col}`).classList.add("node-path");
            }, 30 * (path.length - 1 - i));
        }

        setTimeout(() => {
            this.setState({ isSolving: false, isSolved: true });
        }, 30 * path.length);
    }


    // type parameter:
    // 0 & ALWAYS - Unvisit all nodes and erase path
    // 1 - Clear Walls
    // 2 - Clear Weights
    // 3 - Clear All
    clearGrid(type) {
        if (this.state.isSolving)
            return;

        const clearedGrid = clearGrid(this.state.grid, type);
        this.setState({ grid: clearedGrid, isSolved: false });
    }


    render() {
        const { grid } = this.state;

        return (
            <>
                <Buttons
                    showBFS={() => this.findPath(0)}
                    showDFS={() => this.findPath(1)}
                    showDijkstra={() => this.findPath(2)}
                    showAStar={() => this.findPath(3)}

                    clearPath={() => this.clearGrid(0)}
                    clearWalls={() => this.clearGrid(1)}
                    clearWeights={() => this.clearGrid(2)}
                    clearAll={() => this.clearGrid(3)}

                    toggleClick={() => this.setState({ clickSettingIsWall: !this.state.clickSettingIsWall })}
                ></Buttons>

                <div id="weight-warning" style={{ color: 'red', display: 'none', marginBottom: '5px', zIndex: '10px' }}>This Algorithm ignores weighted nodes</div>

                <div className="gridContainer">
                    <div className="grid" onMouseLeave={() => this.handleMouseUp()} onMouseUp={() => this.handleMouseUp()}>
                        {grid.map((row, col) => {
                            return (
                                <div className="row" key={col}>
                                    {row.map((node, nodeIdx) => {
                                        const { row, col, isWall, weight, isHome, isDest } = node;

                                        return (
                                            <Node key={nodeIdx}
                                                row={row}
                                                col={col}
                                                isWall={isWall}
                                                isWeighted={weight !== 1}
                                                isHome={isHome}
                                                isDest={isDest}
                                                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                                onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                            ></Node>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </>
        );
    }
}


const getStarterGrid = (numRows, numCols, homeCoords, destCoords) => {
    const grid = [];

    for (let i = 0; i < numRows; i++) {
        const nodeRow = [];
        for (let j = 0; j < numCols; j++) {
            nodeRow.push(constructNode(i, j, homeCoords, destCoords));
        }

        grid.push(nodeRow);
    }

    return grid;
}


const constructNode = (row, col, homeCoords, destCoords) => {
    return {
        row,
        col,
        weight: 1,
        isWall: false,
        isHome: row === homeCoords[0] && col === homeCoords[1],
        isDest: row === destCoords[0] && col === destCoords[1],
        parentNode: null
    };
}


const toggleNodeType = (oldGrid, row, col, clickSettingOn, clickSettingIsWall, weightMultiplier) => {
    const newGrid = oldGrid.slice();

    if (clickSettingIsWall) {
        newGrid[row][col].isWall = clickSettingOn;
    }
    else {
        newGrid[row][col].weight = clickSettingOn ? weightMultiplier : 1;
    }

    return newGrid;
}


const changeEndpointLocation = (oldGrid, row, col, coords, isHome) => {
    // If it's not the home point, then it's the desination

    const newGrid = oldGrid.slice();
    //newGrid[coords[0]][coords[1]].isWall = false;

    if (isHome) {
        newGrid[coords[0]][coords[1]].isHome = false;
        newGrid[row][col].isHome = true;
    }
    else {
        newGrid[coords[0]][coords[1]].isDest = false;
        newGrid[row][col].isDest = true;
    }

    return [newGrid, [row, col]];
}


// type parameter:
// ALWAYS - Unvisit all nodes and erase path
//      ALWAYS - Reset starting grid weights -- ignore
// 1 - Clear Walls
// 2 - Clear Weights
// 3 - Clear All
const clearGrid = (oldGrid, type) => {
    const newGrid = oldGrid.slice();

    // Unvisit all nodes
    const visitedNodes = document.querySelectorAll(".node-discovered");
    [].forEach.call(visitedNodes, function (el) {
        el.classList.remove("node-discovered");
    });

    // Erase the path
    const pathNodes = document.querySelectorAll(".node-path");
    [].forEach.call(pathNodes, function (el) {
        el.classList.remove("node-path");
    });



    // Iterate through the grid
    for (let i = 0; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[i].length; j++) {

            // Reset parents
            newGrid[i][j].parent = null;

            if (type === 1 || type === 3) // Clear walls
                newGrid[i][j].isWall = false;
            if (type === 2 || type === 3) // Clear Weights
                newGrid[i][j].weight = 1;

        }
    }


    return newGrid;
}



export default Grid;
