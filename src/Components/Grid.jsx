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
            isSolved: false,
            lastAlgo: null
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
        if (this.state.isSolving)// || this.state.isSolved)
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
        // else if (this.state.isSolved) {
        //     return;
        // }

        // Get the new click settings and toggle
        // The new setting is the opposite of whatever the current click mode property is for the clicked node
        let newClickSetting;
        if (this.state.clickSettingIsWall)
            newClickSetting = !this.state.grid[row][col].isWall;
        else
            newClickSetting = this.state.grid[row][col].weight === 1;


        const updatedGrid = toggleNodeType(this.state.grid, row, col, newClickSetting, this.state.clickSettingIsWall, this.state.weightMultiplier);

        if (this.state.isSolved) {
            this.setState({ grid: updatedGrid, mouseIsPressed: true, clickSettingOn: newClickSetting, movingEndpoints: false }, function () {
                this.findPath(this.state.lastAlgo, true);
            });
        }
        else {
            this.setState({ grid: updatedGrid, mouseIsPressed: true, clickSettingOn: newClickSetting, movingEndpoints: false });
        }
    }


    handleMouseEnter(row, col) {
        // Ignore if we are not dragging or if the path is being solved
        if (!this.state.mouseIsPressed) {// || this.state.isSolving) {
            return;
        }
        // Check if we are moving either the Home point or the Destination
        else if (this.state.movingEndpoints) {
            let updatedCoords;
            let updatedGrid;

            if (this.state.movingHome) {
                [updatedGrid, updatedCoords] = changeEndpointLocation(this.state.grid, this.state.homeCoords, this.state.destCoords, row, col, true);

                if (!this.state.isSolved) {
                    this.setState({ grid: updatedGrid, homeCoords: updatedCoords });
                }
                else {
                    this.setState({ grid: updatedGrid, homeCoords: updatedCoords }, function () {
                        this.findPath(this.state.lastAlgo, true);
                    });
                }
            }
            else {
                [updatedGrid, updatedCoords] = changeEndpointLocation(this.state.grid, this.state.homeCoords, this.state.destCoords, row, col, false);

                if (!this.state.isSolved) {
                    this.setState({ grid: updatedGrid, destCoords: updatedCoords });
                }
                else {
                    this.setState({ grid: updatedGrid, destCoords: updatedCoords }, function () {
                        this.findPath(this.state.lastAlgo, true);
                    });
                }
            }

            return;
        }
        // Make sure we don't turn an endpoint into a wall
        else if (this.state.grid[row][col].isHome || this.state.grid[row][col].isDest) {
            return;
        }

        const updatedGrid = toggleNodeType(this.state.grid, row, col, this.state.clickSettingOn, this.state.clickSettingIsWall, this.state.weightMultiplier);
        if (!this.state.isSolved) {
            this.setState({ grid: updatedGrid });
        }
        else {
            this.setState({ grid: updatedGrid }, function () {
                this.findPath(this.state.lastAlgo, true);
            });
        }
    }


    handleMouseUp() {
        this.setState({ mouseIsPressed: false });
    }


    // 0 - BFS
    // 1 - DFS
    // 2 - Dijkstra
    // 3 - A-Star
    findPath(pathfindingMethod, isRedraw = false) {
        if (this.state.isSolving)
            return;

        this.clearGrid(0);
        if (!isRedraw) {
            this.setState({ isSolving: true, lastAlgo: pathfindingMethod });
        }

        let nodesDiscoveredInOrder;

        document.getElementById('weight-warning').style.visibility = (pathfindingMethod <= 1) ? 'visible' : 'hidden';

        const starterGrid = this.state.grid;
        let gridWithParents;

        // If the destination is a wall, temporarily remove it
        let destIsWall = false;
        if (starterGrid[this.state.destCoords[0]][this.state.destCoords[1]].isWall) {
            starterGrid[this.state.destCoords[0]][this.state.destCoords[1]].isWall = false;
            destIsWall = true;
        }

        switch (pathfindingMethod) {
            case 0:
                [nodesDiscoveredInOrder, gridWithParents] = traditionalSolve(starterGrid, this.state.homeCoords, this.state.destCoords, true);
                break;

            case 1:
                [nodesDiscoveredInOrder, gridWithParents] = traditionalSolve(starterGrid, this.state.homeCoords, this.state.destCoords, false);
                break;

            case 2:
                [nodesDiscoveredInOrder, gridWithParents] = dijkstraSolve(starterGrid, this.state.homeCoords, this.state.destCoords);
                break;

            case 3:
                [nodesDiscoveredInOrder, gridWithParents] = aStarSolve(starterGrid, this.state.homeCoords, this.state.destCoords);
                break;

            default:
                return;
        }

        // Remake the destination to a wall if that's how it was initially
        if (destIsWall) {
            gridWithParents[this.state.destCoords[0]][this.state.destCoords[1]].isWall = true;
        }

        // Set the grid with the calculated parents
        this.setState({ grid: gridWithParents });


        if (isRedraw) {
            this.showRedraw(nodesDiscoveredInOrder);
        }
        else {
            this.animate(nodesDiscoveredInOrder);
        }

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


    showRedraw(nodesDiscoveredInOrder) {
        for (let i = 0; i < nodesDiscoveredInOrder.length; i++) {
            const node = nodesDiscoveredInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).classList.add("node-discovered-redrawn");
        }

        this.showPathRedrawn();
    }


    showPathRedrawn() {
        const path = backtrackPath(this.state.grid[this.state.destCoords[0]][this.state.destCoords[1]]);

        for (let i = path.length - 1; i >= 0; i--) {
            const node = path[i];
            document.getElementById(`node-${node.row}-${node.col}`).classList.add("node-path");
        }
    }


    // type parameter:
    // 0 & ALWAYS - Unvisit all nodes and erase path
    // 1 - Clear Walls
    // 2 - Clear Weights
    // 3 - Clear All
    clearGrid(type, isButtonAction = false) {
        if (this.state.isSolving)
            return;

        const clearedGrid = clearGrid(this.state.grid, type);
        this.setState({ grid: clearedGrid });

        // Reset the lastAlgo if we are clearing by button click
        if (isButtonAction) {
            this.setState({ isSolved: false, lastAlgo: null });
        }
    }


    render() {
        const { grid } = this.state;
        const { openIntro } = this.props;

        return (
            <>
                <Buttons
                    openIntro={openIntro}

                    showBFS={() => this.findPath(0)}
                    showDFS={() => this.findPath(1)}
                    showDijkstra={() => this.findPath(2)}
                    showAStar={() => this.findPath(3)}

                    clearPath={() => this.clearGrid(0, true)}
                    clearWalls={() => this.clearGrid(1, true)}
                    clearWeights={() => this.clearGrid(2, true)}
                    clearAll={() => this.clearGrid(3, true)}

                    toggleClick={() => this.setState({ clickSettingIsWall: !this.state.clickSettingIsWall })}
                ></Buttons>

                <div id="weight-warning" style={{ color: 'red', visibility: 'hidden', marginBottom: '5px', zIndex: '10px' }}>This Algorithm ignores nodes' weights</div>

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


const changeEndpointLocation = (oldGrid, homeCoords, destCoords, row, col, isHome) => {
    // If isHome is true, we are moving the home node
    // Otherwise we are moving the destination node

    const newGrid = oldGrid.slice();

    // Make sure that the home and destination coordinates aren't the same
    if (isHome && !(row === destCoords[0] && col === destCoords[1])) {
        newGrid[homeCoords[0]][homeCoords[1]].isHome = false;
        newGrid[row][col].isHome = true;
    }
    else if (!isHome && !(row === homeCoords[0] && col === homeCoords[1])) {
        newGrid[destCoords[0]][destCoords[1]].isDest = false;
        newGrid[row][col].isDest = true;
    }
    else { // Return if they overlap
        return [newGrid, isHome ? homeCoords : destCoords];
    }

    return [newGrid, [row, col]];
}


// type parameter:
// ALWAYS - Unvisit all nodes and erase path
//      ALWAYS - Reset starting grid weights -- ignore
// 1 - Clear Walls
// 2 - Clear Weightsw
// 3 - Clear All
const clearGrid = (oldGrid, type) => {
    const newGrid = oldGrid.slice();

    // Unvisit all nodes
    const visitedNodes = document.querySelectorAll(".node-discovered");
    [].forEach.call(visitedNodes, function (el) {
        el.classList.remove("node-discovered");
    });

    const visitedNodesRedrawn = document.querySelectorAll(".node-discovered-redrawn");
    [].forEach.call(visitedNodesRedrawn, function (el) {
        el.classList.remove("node-discovered-redrawn");
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
            newGrid[i][j].parentNode = null;

            if (type === 1 || type === 3) // Clear walls
                newGrid[i][j].isWall = false;
            if (type === 2 || type === 3) // Clear Weights
                newGrid[i][j].weight = 1;

        }
    }


    return newGrid;
}



export default Grid;
