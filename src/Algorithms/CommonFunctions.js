// Common functions used by multiple algorithms

function backtrackPath(destinationNode) {
    const reversePath = [];

    if (destinationNode.parentNode === null)
        return reversePath;

    let currNode = destinationNode;

    while (currNode != null) {
        reversePath.push(currNode);
        currNode = currNode.parentNode;
    }

    return reversePath;
}


function initDiscoveredGrid(grid) {
    // Create a grid indicating all nodes are undiscovered
    const discoveredMap = [];
    for (let i = 0; i < grid.length; i++) {
        const arr = [];
        for (let j = 0; j < grid[i].length; j++) {
            arr.push(false);
        }

        discoveredMap.push(arr);
    }

    return discoveredMap;
}


function initTotalWeightGridWithInfinity(grid) {
    const totalWeights = [];

    for (let i = 0; i < grid.length; i++) {
        const arr = [];
        for (let j = 0; j < grid[i].length; j++) {
            arr.push(Infinity);
        }

        totalWeights.push(arr);
    }

    return totalWeights;
}

// This is a Priority Queue that utilizes a Min Heap
class PriorityQueue {
    // data's elements have the structure of [weight, row, col]
    constructor(/*grid*/) {
        this.data = [];


        /*for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                this.data.push(new QueueNode(Infinity, i, j));
            }
        }*/

        // Heapsort - not needed for dijkstra's
        /*for (let i = Math.ceil(this.data.length / 2) - 1; i >= 0; i--) {
            this.fixDown(i);
        }*/
    }


    empty() {
        return this.data.length === 0;
    }


    top() {
        return this.data[0];
    }


    push(row, col, weight) {
        this.data.push(new Node(row, col, weight));
        this.fixUp(this.data.length - 1);
    }


    pop() {
        this.data[0] = this.data[this.data.length - 1];
        this.data.pop();
        this.fixDown(0);
    }


    // Private method
    fixUp(n) {
        // if (n === 0)
        //     return;

        let parentIndex = Math.ceil(n / 2) - 1;

        ////// This is a recursive definition
        // if (this.data[n].weight < this.data[parentIndex].weight) {
        //     const temp = this.data[n];
        //     this.data[n] = this.data[parentIndex];
        //     this.data[parentIndex] = temp;

        //     return this.fixUp(parentIndex);
        // }
        // else
        //     return;

        // Iterative definition
        while (n !== 0 && this.data[n].weight < this.data[parentIndex].weight) {
            const temp = this.data[n];
            this.data[n] = this.data[parentIndex];
            this.data[parentIndex] = temp;

            n = parentIndex;
            parentIndex = Math.ceil(n / 2) - 1;
        }
    }


    // Private method
    fixDown(n) {
        if ((2 * n) + 1 >= this.data.length)
            return;

        // If the node has 2 children and must be rearranged
        if ((2 * n) + 2 < this.data.length && this.data[n].weight >
            Math.min(this.data[(2 * n) + 1].weight, this.data[(2 * n) + 2].weight)) {

            const temp = this.data[n];

            if (this.data[(2 * n) + 1].weight < this.data[(2 * n) + 2].weight) {
                this.data[n] = this.data[(2 * n) + 1];
                this.data[(2 * n) + 1] = temp;

                return this.fixDown((2 * n) + 1);
            }
            else {
                this.data[n] = this.data[(2 * n) + 2];
                this.data[(2 * n) + 2] = temp;

                return this.fixDown((2 * n) + 2);
            }
        }
        // If the node only has 1 child and must be rearranged
        else if ((2 * n) + 1 < this.data.length &&
            this.data[n].weight > this.data[(2 * n) + 1].weight) {

            const temp = this.data[n];
            this.data[n] = this.data[(2 * n) + 1];
            this.data[(2 * n) + 1] = temp;

            return this.fixDown((2 * n) + 1);
        }
    }

}

class Node {
    constructor(row, col, weight) {
        this.row = row;
        this.col = col;
        this.weight = weight;
    }
}






export { backtrackPath, initDiscoveredGrid, initTotalWeightGridWithInfinity, PriorityQueue };

