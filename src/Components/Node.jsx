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
            onMouseDown,
            onMouseEnter,
        } = this.props;

        const extraClass = isWall ? "node-wall" :
            isWeighted ? "node-weight" : "";

        const endpointClass = isHome ? "node-home" :
            isDest ? "node-dest" : "";


        return (
            <div
                id={`node-${row}-${col}`}
                className={`node ${extraClass} ${endpointClass}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
            ></div>
        );
    }
}


export default Node;
