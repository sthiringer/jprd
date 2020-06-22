import React, { Component } from 'react';
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar'
import Question from './Question';
import 'react-circular-progressbar/dist/styles.css'

class QuestionGrid extends Component {

    getBoard = () => {
        let toRet = [];
        const gameData = this.props.gameData;

        for(let i = 0; i < 6; i++){
            toRet.push(<Question key={(i+1)*100} data={gameData[i].categoryname}/>)
            gameData[i].questions.forEach((question, j) => {
                const tileId=i*5+j;
                toRet.push(<Question key={tileId} pos={tileId} data={question} onPick={this.props.onPick}/>)
            })
        }

        return toRet;
    }

    getStringForRound = (round) => {
        switch(round){
            case "Jeopardy!":
                return " (first)";
            case "Double Jeopardy!":
                return " (second)";
            default:
                return null;
        } 
    }

    getQuestionDisplay = () => {
        if(this.props.answering){
            const gameData = this.props.gameData;
            const cat = Math.floor(this.props.lastPicked/5);
            const question = this.props.lastPicked%5;
            const data = gameData[cat].questions[question]
            const catName = gameData[cat].categoryname
            
            return(<div className="question-slider opened">
                <CircularProgressbar
                    value={0}
                    strokeWidth={50}
                    styles={buildStyles({
                        strokeLinecap: "butt"
                      })}
                />
                <div className="category">
                    <span className="category-text">{catName}</span>
                </div>
                <div className="clue">
                    <span className="clue-text">{data.text}</span>
                </div>
                <div className="answer">
                    <div className="score-row">
                        <span className="user-score">{"Your total: $" + data.userScore}</span>
                        <span className="clue-value">{"This clue: $" + data.value}</span>
                    </div>
                </div>
            </div>)
        
        }else{
            return(<div className="question-slider">
            </div>)
        }
    }

    render() {

        return (
            <div className="game-board">
                <div className="question-grid">
                    {this.getBoard()}
                </div>
                {this.getQuestionDisplay()}
            </div>
        );
    }
}

export default QuestionGrid;