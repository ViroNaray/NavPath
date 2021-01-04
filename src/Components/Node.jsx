import React, { Component } from "react";
import './Styles/Node.css';

class Node extends Component {
    render() {
        const {
            row,
            col,
            isWall,
            isWeighted,
            isHome,
            isDest,
            isDiscovered,
            onMouseDown,
            onMouseEnter,
            //onMouseUp
        } = this.props;

        const extraClass = isWall ? "node-wall" :
            isWeighted ? "node-weight" :
                isHome ? "node-home" :
                    isDest ? "node-dest" :
                        "";

        const discoveredClass = isDiscovered ? "node-discovered" : "";

        return (
            <div
                id={`node-${row}-${col}`}
                className={`node ${extraClass} ${discoveredClass}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
            // onMouseUp={() => onMouseUp()}
            ></div>
        );
    }
}


export default Node;
