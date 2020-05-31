import React from 'react';
import AnswerInput from './AnswerInput'
import ValueOverlay from './ValueOverlay';

/**
 *  QUESTIONDISPLAY
 *  Displays components of a single question, taken in as a prop.
 */
export default class QuestionDisplay extends React.Component {
    constructor(props){
        super(props);
        this.state = {userScore: 0, userValue: null, new: true};
    }

    getNextQuestion = () => {
        this.setState({...this.state, new: true});
        this.props.onNextQuestion();
    }

    handleValueSubmit = (val) => {
        this.setState({...this.state, userValue: val})
    }

    handleAnswerSubmit = (correct) => {
        const q = {...this.props.question, value: parseInt(this.state.userValue ? this.state.userValue : this.props.question.value)};
        let curScore = parseInt(window.sessionStorage.getItem('score'));

        if(correct /* And user is in non-practice mode? */){
            this.setState({...this.state, new: false, userScore: curScore + q.value}, () => {
                window.sessionStorage.setItem('score', curScore + q.value);
            })
        }else{
            this.setState({...this.state, new: false, userScore: curScore - q.value}, () => {
                window.sessionStorage.setItem('score', curScore - q.value);
            })
        }
    }
    
    render(){
        const q = {...this.props.question, value: parseInt(this.state.userValue ? this.state.userValue : this.props.question.value)};
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let roundString = ((round)=>{
           switch(round){
                case "Jeopardy!":
                   return " (first)";
                case "Double Jeopardy!":
                    return " (second)";
                default:
                    return null;
           } 
        })(q.round);

        return(
            <div className="container-question">
                {this.state.new && <ValueOverlay question={q} onSubmit={this.handleValueSubmit}/>}
                <div className="category">
                    <span className="info-text">
                        {"Clue appeared on " + new Date(q.airdate).toLocaleDateString(undefined, dateOptions)}
                        {", during game #" + q.gamenumber + ", season " + q.season + ", in the " + q.round}
                        {roundString +  " round."}
                    </span>
                    <span className="category-text">{q.category}</span>
                </div>
                <div className="clue">
                    <span className="clue-text">{q.text}</span>
                </div>
                <div className="answer">
                    <div className="score-row">
                        <span className="user-score">{"Your total: $" + this.state.userScore}</span>
                        <span className="clue-value">{"This clue: $" + q.value}</span>
                    </div>
                    <AnswerInput
                        onNextQuestion={this.getNextQuestion}
                        onSubmit={this.handleAnswerSubmit}
                        question={q}
                    />
                </div>
            </div>
        );
    }
}
