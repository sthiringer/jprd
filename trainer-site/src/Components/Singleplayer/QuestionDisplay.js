import React from 'react';
import AnswerInput from './AnswerInput'
import ValueOverlay from './ValueOverlay';

/**
 *  QUESTIONDISPLAY
 *  Displays components of a single question
 */
export default class QuestionDisplay extends React.Component {
    constructor(props){
        super(props);
        this.state = {userScore: 0, userValue: null, new: true, loading: true, dateOptions: {year: 'numeric', month: 'long', day: 'numeric' }};
    }

    async componentDidMount(){
        let q = await this.loadData();
        const x = {...q, value: parseInt(this.state.userValue !== null ? this.state.userValue : q.value)};
        this.setState({...this.state, loading: false, question: x})
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.question !== this.state.question){
            this.setState({...this.state, new: true});
        }
    }

    /**
    * Send request to API for a random question and load question into state upon receipt.
    */
    loadData = async () => {
        // try{
        //   const response = await fetch(
        //     "https://t4d66tek8f.execute-api.us-east-1.amazonaws.com/prod/random",
        //     {
        //       method: 'POST',
        //       headers: {'Content-Type': 'text/plain'}
        //     }
        //   )
        //   const rq = await response.json()
        //   return rq;
        // }catch(err){
        //   console.log("There was an error in the HTTP request", err);
        //   return null;
        // }
        return {"category": "TRANSPORTATION", "QuestionId": "1606-0-22", "airdate": "1991-09-02", "season": "8", "value": "100", "isdailydouble": true, "text": "These flat-bottomed boats were specially designed to travel down early canals", "answer": "barges", "clue_order": "22", "round": "Jeopardy!", "gamenumber": "1606"};
    }

    getNextQuestion = () => {
        this.componentDidMount();
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

    handleValueSubmit = (val) => {
        this.setState({...this.state, userValue: val})
    }

    handleAnswerSubmit = (correct) => {
        const q = this.state.question;
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

        return(!this.state.loading &&
            <div className="container-question">
                {this.state.new && <ValueOverlay question={this.state.question} onSubmit={this.handleValueSubmit}/>}
                <div className="category">
                    <span className="info-text">
                        {"Clue appeared on " + new Date(this.state.question.airdate).toLocaleDateString(undefined, this.state.dateOptions)}
                        {" during game #" + this.state.question.gamenumber + ", season " + this.state.question.season + ", in the " + this.state.question.round}
                        {this.getStringForRound(this.state.question.round) +  " round."}
                    </span>
                    <span className="category-text">{this.state.question.category}</span>
                </div>
                <div className="clue">
                    <span className="clue-text">{this.state.question.text}</span>
                </div>
                <div className="answer">
                    <div className="score-row">
                        <span className="user-score">{"Your total: $" + this.state.userScore}</span>
                        <span className="clue-value">{"This clue: $" + this.state.question.value}</span>
                    </div>
                    <AnswerInput
                        onNextQuestion={this.getNextQuestion}
                        onSubmit={this.handleAnswerSubmit}
                        question={this.state.question}
                    />
                </div>
            </div>
        );
    }
}
