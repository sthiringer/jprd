import React, { Component } from 'react';
import PlayerIcon from "../../Media/icon (1).svg";

class PlayerDisplay extends Component {
    render() {
        return (
            <div className="container-players">
                {this.props.players.map((player) => 
                    <div className="player">
                        <div className="container-player-text">
                            <span className="player-name">{player}</span>
                            <span className="player-score">{"$"+0}</span>
                        </div>
                        <object data={PlayerIcon}><span>{player}</span></object>
                    </div>
                )}
            </div>
        );
    }
}

export default PlayerDisplay;