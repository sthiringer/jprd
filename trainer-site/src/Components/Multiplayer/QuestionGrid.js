import React, { Component } from 'react';
import Question from './Question';

const data = require('./testdata.json').slice(0, 30);
const values = [100, 200, 300, 400, 500];

class QuestionGrid extends Component {

    handlePick = (pos) => {
        //A tile was picked, pass notification up to the chat client
        this.props.onPick(pos);
    }

    render() {
        return (
            <div className="question-grid">
                {data.map((data, i) => {
                    if(this.props.lastPicked === i){ 
                        data = {...data, value: 0}
                        return <Question key={i} data={data}/>
                    }else{
                        data = {...data, value: values[i%5]}
                        return <Question key={i} pos={i} data={data} onPick={this.handlePick}/>
                    }
                })}
            </div>
        );
    }
}

export default QuestionGrid;