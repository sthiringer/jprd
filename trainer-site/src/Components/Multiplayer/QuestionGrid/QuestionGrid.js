import React, { Component } from 'react';
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar'
import Question from '../Question/Question';
import AnswerInput from '../AnswerInput/AnswerInput';
import ChangingProgressProvider from '../ChangingProgressProvider/ChangingProgressProvider';
import 'react-circular-progressbar/dist/styles.css'
import styles from './QuestionGrid.module.css';

class QuestionGrid extends Component {

    getBoard = () => {
        let toRet = [];
        const gameData = this.props.gameData;
        console.log(gameData)

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

    handleSubmit = (questionid, answer, time) => {
        this.props.onAnswer(questionid, answer, time);
    }

    getQuestionDisplay = () => {
        console.log(this.props.players[this.props.user])
        if(this.props.answering){
            console.log(this.props.gameData);
            const gameData = this.props.gameData;
            const cat = Math.floor(this.props.lastPicked/5);
            const question = this.props.lastPicked%5;
            const data = gameData[cat].questions[question]
            const catName = gameData[cat].categoryname
            
            return(<div className={`${styles.questionSlider} ${styles.opened}`}>
                <div className={styles.category}>
                    <div className={styles.containerProgressCircle}>
                        <ChangingProgressProvider values={Array.from(Array(15).keys()).reverse()}>
                            {percentage=> <CircularProgressbar
                                value={percentage}
                                counterClockwise={true}
                                maxValue={15}
                                strokeWidth={50}
                                styles={buildStyles({
                                    strokeLinecap: "butt",
                                    pathColor: `rgba(255, 215, 0)`,
                                    backgroundColor: '#3e98c7',
                                })}
                            />}
                        </ChangingProgressProvider>
                    </div>
                    <span className={styles.categoryText}>{catName}</span>
                </div>
                <div className={styles.clue}>
                    <span className={styles.clueText}>{data.text}</span>
                </div>
                <div className={styles.answer}>
                    <div className={styles.scoreRow}>
                        <span className={styles.userScore}>{"Your total: $" + this.props.players[this.props.user]['score']}</span>
                        <span className={styles.clueValue}>{"This clue: $" + data.value}</span>
                    </div>
                    <AnswerInput questionid={data.questionid} onSubmit={this.handleSubmit} />
                </div>
            </div>)
        
        }else{
            return(<div className={styles.questionSlider} />)
        }
    }

    render() {

        return (
            <div className={styles.gameBoard}>
                <div className={styles.questionGrid}>
                    {this.getBoard()}
                </div>
                {this.getQuestionDisplay()}
            </div>
        );
    }
}

export default QuestionGrid;