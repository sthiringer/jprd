import React from 'react';
import QuestionDisplay from './Components/QuestionDisplay';
import './App.css';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      question: null,
    };
  }

  componentDidMount(){
    sessionStorage.setItem('score', 0);
    this.loadData();
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
    //   this.setState({question: rq});
    // }catch(err){
    //   console.log("There was an error in the HTTP request", err);
    // }
    this.setState({question: {"category": "TRANSPORTATION", "QuestionId": "1606-0-22", "airdate": "1991-09-02", "season": "8", "value": "100", "isdailydouble": true, "text": "These flat-bottomed boats were specially designed to travel down early canals", "answer": "barges", "clue_order": "22", "round": "Jeopardy!", "gamenumber": "1606"}})
  }

  render(){
    //At this point, only render the app if we have a question loaded and ready to go
    return (this.state.question &&
      <div className="container-app">
        <div className="container-header">
        </div>
        <QuestionDisplay onNextQuestion={this.loadData} question={this.state.question}/>
        <div className="container-about">
          <p>Copyright © 2020 Stephen Thiringer</p>
          <p>Questions, related data, and below notice gathered from <a href="http://www.j-archive.com/">J! Archive</a>.</p>
          <p>
            The Jeopardy! game show and all elements thereof, including but not limited to copyright and trademark thereto, 
            are the property of Jeopardy Productions, Inc. and are protected under law. 
            This website is not affiliated with, sponsored by, or operated by Jeopardy Productions, Inc.
          </p>
        </div>
      </div>
    );
  }
}
