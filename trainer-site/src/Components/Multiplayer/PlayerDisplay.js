import React, { Component } from 'react';
import PlayerIcon from "../../Media/icon (1).svg";

class PlayerDisplay extends Component {
    render() {
        return (
            <div className="container-players">
                {this.props.players.map((player) => 
                    <object data={PlayerIcon}>Test</object>
                )}
            </div>
        );
    }
}

export default PlayerDisplay;