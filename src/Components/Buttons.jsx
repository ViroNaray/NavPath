import React, { Component, useState } from 'react';
import GridKey from './GridKey';
import './Styles/Buttons.css';


function HeaderButton(props) {
    return (
        <button className="solve-button" onClick={props.click}>
            {props.text}
        </button>
    );
}


function ClearButton(props) {
    const [open, setOpen] = useState(false);

    return (
        <div className="dropdown-container" onMouseLeave={() => setOpen(false)}>
            <button className="solve-button clear-button" style={{ outline: 'none' }} onMouseEnter={() => setOpen(true)} /*{onClick={props.click}}*/>
                Clear
            </button>
            {open && (
                <div className="dropdown">
                    <ul className="dropdown-ul">
                        <li className="dropdown-li" onClick={props.path} >Clear Path</li>
                        <li className="dropdown-li" onClick={props.walls} title="This will also clear the path">Clear Path & Walls</li>
                        <li className="dropdown-li" onClick={props.weights} title="This will also clear the path">Clear Path & Weights</li>
                        <li className="dropdown-li" onClick={props.all} >Clear All</li>
                    </ul>
                </div>
            )}
        </div>
    );
}


function ToggleButton({ click }) {
    const [isWall, setWall] = useState(true);

    const toggle = () => {
        setWall(!isWall);
        click();
    }

    return (
        <div className="toggle-container">
            <div className="toggle-bar" onClick={toggle}>
                <div className={`dialog-button ${isWall ? "" : "disabled"}`}>
                    {isWall ? "Walls" : "Weights"}
                </div>
            </div>
        </div>
    );
}


class Buttons extends Component {

    render() {
        const {
            showBFS,
            showDFS,
            showDijkstra,
            showAStar,

            clearPath,
            clearWalls,
            clearWeights,
            clearAll,

            toggleClick
        } = this.props;

        return (
            <div className="header">
                <div style={{ backgroundColor: '#557A95', top: '0' }}>
                    <h1 className="header-title">NavPath</h1>

                    <div style={{ paddingBottom: '1vw' }}>
                        <HeaderButton click={showBFS} text="BFS" />
                        <HeaderButton click={showDFS} text="DFS" />
                        <HeaderButton click={showDijkstra} text="Dijkstra's" />
                        <HeaderButton click={showAStar} text="A*" />

                        <ClearButton path={clearPath} walls={clearWalls} weights={clearWeights} all={clearAll} />

                        <ToggleButton click={toggleClick} />
                    </div>
                </div>

                <GridKey />
            </div >
        );
    }
}

export default Buttons;
