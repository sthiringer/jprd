import React from 'react';

/**
 *  ANSWERINPUT
 *  Displays a text input for the user to enter an answer to a question
 *  Takes prop answer === the answer to match from input
 */
class AnswerInput extends React.Component {
    constructor(props){
        super(props);
        this.state = {attempt: "", class: "", showAnswer: false}
        this.answerInputRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (this.props.answer !== prevProps.answer) {
            this.answerInputRef.current.value = "";
            this.setState({attempt: "", class: "", showAnswer: false});
        }
    }

    /**
     * Keeps track of current answer attempt in state
     */
    handleInput = (event) => {
        this.setState({...this.state, class: "", attempt: event.target.value})
    }

    /**
     * Prevents default form submission and changes class for input in state
     * based on validity of answer
     */
    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({...this.state,
            class: this.getClassForAnswer(this.state.attempt.toLowerCase().trim() === this.props.answer.toLowerCase().trim())
        });
    }
    
    getClassForAnswer = (isCorrect) => {
        return "answer-input-" + (isCorrect ? "correct" : "incorrect")
    }

    toggleAnswer = () => {
        this.setState({...this.state, 
            class: "answer-input-disabled", 
            showAnswer: !this.state.showAnswer
        }, () => {
            const answerInput = this.answerInputRef.current;
            answerInput.value = this.state.showAnswer ? this.props.answer : this.state.attempt;
        })
    }

    getNextQuestion = () => {
        this.props.onNextQuestion();
    }

    render() {
        return (<>
            <form onSubmit={this.handleSubmit}>
                <label>
                    {"What is "}
                    <input 
                        ref={this.answerInputRef}
                        id="answer-input" 
                        className={this.state.class} 
                        type="text" 
                        onChange={this.handleInput} 
                        disabled={this.state.showAnswer}
                    />
                    {"?"}
                </label>
                <div className="button-row">
                    <input className={this.state.showAnswer ? "submit-btn-disabled" : ""} type="submit" value="Buzz In" disabled={this.state.showAnswer}/>
                    <input type="button" value={this.state.showAnswer ? "Try Again" : "Show Answer"} onClick={this.toggleAnswer}/>
                    <input type="button" value="Next Question" onClick={this.getNextQuestion}/>
                </div>
            </form>
        </>);
    }
}

export default AnswerInput;