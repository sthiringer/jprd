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
        this.state = {userValue: null};
    }

    getNextQuestion = () => {
        this.props.onNextQuestion();
    }

    handleValueSubmit = (val) => {
        this.setState({...this.state, userValue: val})
    }
    
    render(){
        const q = this.props.question;
        console.log(q);
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
                <ValueOverlay question={q} onSubmit={this.handleValueSubmit}/>
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
                    <AnswerInput
                        onNextQuestion={this.getNextQuestion} 
                        answer={q.answer}
                    />
                </div>
            </div>
        );
    }
}
