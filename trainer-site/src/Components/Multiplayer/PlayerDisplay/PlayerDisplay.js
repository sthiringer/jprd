import React, { Component } from 'react';
import PlayerIcon from "../../../Media/icon (1).svg";
import styles from './PlayerDisplay.module.css'

class PlayerDisplay extends Component {

    getPlayerClass = (player) => {
        return `${styles.player}` + (player === this.props.picking ? ` ${styles.picking}` : ``);
    }

    render() {
        console.log(this.props.players)
        return (
            <div className={styles.containerPlayers}>
                {Object.keys(this.props.players).map((player) => 
                    <div className={this.getPlayerClass(player)}>
                        <div className={styles.containerPlayerText}>
                            <span className={styles.playerName}>{player}</span>
                            <span className={styles.playerScore}>{"$"+this.props.players[player]['M']['score']['N']}</span>
                        </div>
                        <object data={PlayerIcon}><span>{player}</span></object>
                    </div>
                )}
            </div>
        );
    }
}

export default PlayerDisplay;