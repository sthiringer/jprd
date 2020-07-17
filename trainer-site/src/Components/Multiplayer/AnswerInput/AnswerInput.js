import React, { Component } from 'react';
import styles from './AnswerInput.module.css'

class AnswerInput extends Component {
    constructor(props){
        super(props);

        this.state={answer: ''};
        this.answerRef = React.createRef();
    }

    handleInput = (event) => {
        this.setState({...this.state, answer: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.props.questionid, this.state.answer, Date.now());
    }

    render() {
        return (
            <form className={styles.answerForm} onSubmit={this.handleSubmit}>
                <label>
                    <span className={styles.labelTextBefore}>{"What is "}</span>
                    <input
                        ref={this.answerRef}
                        className={styles.answerInput} 
                        type="text" 
                        onInput={this.handleInput}
                    />
                    <span className={styles.labelTextAfter}>{"?"}</span>
                </label>
                <div className={styles.buttonRow}>
                    <input type="submit" value="Buzz In"/>
                </div>
            </form> 
        );
    }
}

export default AnswerInput;