import React, { Component } from 'react';
import styles from './Question.module.css';

class Question extends Component {

    render() {
        return (
            <div className={styles.questionChild} onClick={() => {this.props.onPick(this.props.pos, this.props.data.value)}}>
                    <span>{this.props.data.value ? (<span><b>{"$"+this.props.data.value}</b></span>) : (<span><b>{this.props.data}</b></span>)}</span>
            </div>
        );
    }
}

export default Question;