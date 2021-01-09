import React from 'react';
import './Styles/Introduction.css';

function Introduction({ closeIntro }) {
    return (
        <div className="intro-container">
            <div>
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={closeIntro}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="intro">


                <h1>Introduction : </h1>
                <p> Welcome to <b>NavPath</b> by Viroshan Narayan! </p>
                <p>Here, you can see how different pathfinding algorithms work, all with your own eyes!</p>
                <p>Here are a few things to get you started:</p>

                <div>
                    <ol className="instruction-set">
                        <li>Click and drag the home and destination points to move them.</li>
                        <li>Click and drag on empty nodes to make them walls or weighted nodes.<br /> This setting is determined by the toggle at the top of the page.
                            <ul>
                                <li>Walls cannot be passed through</li>
                                <li>Weighted nodes are harder to move through</li>
                                <li>Not all algorithms are affected by weights</li>
                            </ul>
                        </li>
                        <li>Find the path from the home point to the destination using any of the<br /> following algorithms:
                            <ul>
                                <li><b>Breadth-First Search (BFS):</b> an <b>unweighted</b> algorithm that<br />&emsp; guarantees optimality</li>
                                <li><b>Depth-First Search (DFS):</b> a very inefficient, <b>unweighted</b><br />&emsp; algorithm</li>
                                <li><b>Dijkstra's Algorithm:</b> a <b>weighted</b> algorithm that<br />&emsp; guarantees optimality</li>
                                <li><b>A*:</b> a smarter version of Dijkstra's Algorithm</li>
                            </ul>
                        </li>
                        <li>Clear the displayed path, walls, or weights using the "Clear" dropdown<br />&emsp; at the top of the page</li>
                    </ol>
                </div>
                <p>If you'd like to, you can check out the source code for this site at my <a href="https://github.com/vironaray/navpath" target="_blank" rel="noreferrer">github</a>.</p>
                <p>Now that you're up to speed, <b>LET'S FIND SOME PATHS!!!</b></p>
            </div>
        </div>
    );
}


export default Introduction;
