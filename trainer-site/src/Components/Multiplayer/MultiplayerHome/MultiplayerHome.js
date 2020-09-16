import React, { Component } from 'react';
import Header from "../../Global/Header/Header.js";
import Footer from "../../Global/Footer/Footer.js";
import QuestionGrid from "../QuestionGrid/QuestionGrid";
import ChatDisplay from "../ChatDisplay/ChatDisplay";
import PlayerDisplay from "../PlayerDisplay/PlayerDisplay";
import styles from './MultiplayerHome.module.css';

let chat = undefined;
const QUESTION_VALUES = [200, 400, 600, 800, 1000]

class MultiplayerHome extends Component {
    constructor(props){
        super(props);
        chat = new WebSocket("wss://k0bg983q9d.execute-api.us-east-1.amazonaws.com/Test");
        this.state={picking: undefined, messages: [], lastPicked: undefined, players: {}, started: false, gameData:undefined}
    }

    componentDidMount(){
        if(this.isAuthorized()){
            this.getGame();
            this.connectToChat();
        }
    }

    sendWSMessage = (meta, data) => {
        return chat.send(
            JSON.stringify({
                "action": "sendMessage", 
                "meta": meta, 
                "user": this.props.location.state.u, 
                "roomid": this.props.location.state.r, 
                "data": data, 
                "token": this.props.location.state.token
            })
        );
    }

    compareQuestion(a, b){
        let valueA = parseInt(a.value);
        let valueB = parseInt(b.value);

        if(valueA > valueB){
            return 1;
        }else if(valueA < valueB){
            return -1;
        }else{
            return 0;
        }
    }

    formatGame = (game) => {
        for(let category of game){
            category.questions.sort(this.compareQuestion)
            category.questions.forEach((question, i) =>{
                question.value = QUESTION_VALUES[i]
            })
        }
        return game;
    }

    getGame = async () => {
        try{
          const response = await fetch(
            "https://t4d66tek8f.execute-api.us-east-1.amazonaws.com/prod/game",
            {
              method: 'POST',
              headers: {'Content-Type': 'text/plain'},
              body: this.props.location.state.token
            }
          )
          const res = await response.json()
          const game = this.formatGame(res);
          this.setState({...this.state, gameData:game})
        }catch(err){
          console.log("There was an error in the HTTP request", err);
        }
    }

    connectToChat = () => {
        chat.onopen = (event) => {
            console.log("Chat connection opened");
            window.onbeforeunload = (event) =>{
                this.sendWSMessage("TEARDOWN", null);
                console.log("Page refreshed or closed, cleaning up connection.");
            }
            window.onhashchange = (event) =>{
                this.sendWSMessage("TEARDOWN", null);
                console.log("Page navigated away from, cleaning up connection.");
            }
            this.sendWSMessage("SETUP", null);
        }

        chat.onerror = (event) => {
            console.log("Chat error");
        }

        chat.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            switch (msg.meta) {
                case "MSG":
                    this.setState((prevState) => ({
                        ...prevState, 
                        messages: [msg, ...prevState.messages]
                    }));
                    break;
                
                case "PICK":
                    this.handlePick(msg.msg);
                    break;

                case "SETUP":
                    this.handleJoin(msg.joined, msg.players);
                    break;

                case "START":
                    this.handleStart(msg.from)
                    break;

                case "VALIDATE":
                    this.handleChangeTurn(msg)
                    break;

                default:
                    console.log("unknown mesage received")
                    console.log(msg)
                    break;
            }
        }

        chat.onclose = (event) => {
            console.log("Chat connection closed");
        }
    }

    isAuthorized = () => {
        //Prob should do a server side token check here
        return this.props.location.state && this.props.location.state.token;
    }

    sendPick = (pos, value, qid) => {
        if(qid && this.props.location.state.u === this.state.picking){
            this.sendWSMessage("PICK", [pos, value]);
        }
    }

    handlePick = (data) => {
        //data[0] = position of q on board, [1] = value of q on board
        //Trigger question sliding up from bottom of board, covering everything
        this.setState((prevState) => ({...prevState, lastPicked: data[0], answering: true, prevPicker: prevState.picking, answerStartTime: new Date().getTime()}));
        setTimeout(() => {
            this.setState({...this.state, answering: false});
            //Validate answers here and return correct answerer (or previous picker) for next turn
            if(this.props.location.state.c){
                //This is hacky, validaiton should automatically be performed serverside
                this.sendWSMessage("VALIDATE", data[1])
            }
        }, 15000);
    }

    handleJoin = (player, allPlayers) => {
        this.setState((prevState) => {
            if(!(player in allPlayers)){
                allPlayers = {...allPlayers, player}
            }
            return ({...prevState,
                players: allPlayers
            })
        });
    }

    handleStart = (firstPlayer) => {
        this.setState({...this.state, picking: firstPlayer, started: true})
    }

    handleChangeTurn = (msg) => {
        //Select next picker and update scores
        let updatedScores = this.state.players;
        let nextPlayer = null;
        //This feels real ugly
        for(const item of msg.newScores){
            for(const key in item){
                updatedScores[key]['score'] = item[key];
            }
        }

        for(const answer of msg.answers){
            if(answer["winner"]){
                nextPlayer = answer["user"];
            }
        }
        this.setState({...this.state,
            picking: (nextPlayer ? nextPlayer : this.state.prevPicker),
            players: updatedScores,
            gameData: this.formatGame(msg.gameData),
            lastAnswers: msg.answers,
            correctAnswer: msg.correctAnswer,
            summary: true,
        })
        //Show correct/incorrect answers for 5 seconds, then carry on with next turn
        setTimeout(() => {
            this.setState({...this.state, summary: false, answerStartTime: -1});
        }, 5000);
    }

    sendChatMessage = (msg) => {
        this.sendWSMessage("MSG", msg);
    }

    startGame = () => {
        this.sendWSMessage("START", null);
    }

    handleAnswer = (questionid, answer, time) => {
        const data={questionid: questionid, answer: answer, time: time};
        this.sendWSMessage("ANSWER", data);
    }

    render() {
        return (this.isAuthorized() ? (
            this.state.gameData ? (
                <div className={styles.containerApp}>
                    <Header />
                    <div className={styles.containerContent}>
                        {this.state.started ? 
                            <QuestionGrid gameData={this.state.gameData} 
                            lastPicked={this.state.lastPicked} 
                            answering={this.state.answering} 
                            onPick={this.sendPick}
                            onAnswer={this.handleAnswer}
                            picking={this.state.picking}
                            players={this.state.players}
                            user={this.props.location.state.u}
                            lastAnswers={this.state.lastAnswers}
                            correctAnswer={this.state.correctAnswer}
                            summary={this.state.summary}
                            answerStartTime={this.state.answerStartTime}
                            />
                        :
                            <div className={styles.preGameBoard}>
                                {this.props.location.state.c && <button className={styles.startButton} onClick={this.startGame}><span className={styles.startButtonText}>{"Start Game"}</span></button>}
                            </div>
                        }
                        <div className={styles.containerPlayersChat}>
                            <PlayerDisplay players={this.state.players} picking={this.state.picking}/>
                            <span>{"Your room code: " + this.props.location.state.r}</span>
                            <ChatDisplay messages={this.state.messages} onSendMessage={this.sendChatMessage}/>
                        </div>
                    </div>
                    <Footer />
                </div>
            ) : (
                <span className={styles.loadingText}>Game loading...</span>
            )
        ) : (
            <span>Please return to the home page and create or join a room to play multiplayer.</span>
        ));
    }
}

export default MultiplayerHome;