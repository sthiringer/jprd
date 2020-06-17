import React, { Component } from 'react';

class Question extends Component {
    render() {
        return (
            <div className="question-child" onClick={() => this.props.onPick(this.props.pos)}>
                <span><b>{"$"+this.props.data.value}</b></span>
            </div>
        );
    }
}

export default Question;