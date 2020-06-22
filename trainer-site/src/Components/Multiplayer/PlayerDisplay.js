import React, { Component } from 'react';
import PlayerIcon from "../../Media/icon (1).svg";

class PlayerDisplay extends Component {
    render() {
        return (
            <div className="container-players">
                {this.props.players.map((player) => 
                    <div className="player">
                        <span className="player-text">{player}</span>
                        <object data={PlayerIcon}><span>{player}</span></object>
                    </div>
                )}
            </div>
        );
    }
}

export default PlayerDisplay;