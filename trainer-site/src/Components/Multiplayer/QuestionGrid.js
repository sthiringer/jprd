import React, { Component } from 'react';
import Question from './Question';

class QuestionGrid extends Component {

    handlePick = (pos) => {
        //A tile was picked, pass notification up to the chat client
        this.props.onPick(pos);
    }

    getBoard = () => {
        let toRet = [];
        const gameData = this.props.gameData;

        for(let i = 0; i < 6; i++){
            toRet.push(<Question key={(i+1)*100} data={gameData[i].categoryname}/>)
            gameData[i].questions.forEach((question, j) => {
                toRet.push(<Question key={i*5+j} id={i*5+j} data={question} onPick={this.props.onPick}/>)
            })
        }

        return toRet;
    }

    render() {
        return (
            <div className="question-grid">
                {this.getBoard()}
            </div>
        );
    }
}

export default QuestionGrid;