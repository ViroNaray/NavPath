import React from 'react';
import './Styles/GridKey.css';


function GridKey() {
    return (
        <div className="grid-key">
            <div className="key-entry">
                <div className="square home" />
                <div className="text">Home</div>
            </div>
            <div className="key-entry">
                <div className="square destination" />
                <div className="text">Destination</div>
            </div>
            <div className="key-entry">
                <div className="square weight" />
                <div className="text">Weighted Node</div>
            </div>
            <div className="key-entry">
                <div className="square wall" />
                <div className="text">Wall</div>
            </div>
            <div className="key-entry">
                <div className="square undiscovered" />
                <div className="text">Undiscovered Node</div>
            </div>
            <div className="key-entry">
                <div className="square discovered" />
                <div className="text">Discovered Node</div>
            </div>
            <div className="key-entry">
                <div className="square path" />
                <div className="text">Path Node</div>
            </div>
        </div>
    );
}


export default GridKey;
