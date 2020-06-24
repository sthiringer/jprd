import React, { Component } from 'react';
import Header from "../Header.js";
import Footer from "../Footer.js";
import QuestionGrid from "./QuestionGrid";
import ChatDisplay from "./ChatDisplay";
import PlayerDisplay from "./PlayerDisplay";

let chat = undefined;
const QUESTION_VALUES = [200, 400, 600, 800, 1000]

class MultiplayerHome extends Component {
    constructor(props){
        super(props);
        chat = new WebSocket("wss://k0bg983q9d.execute-api.us-east-1.amazonaws.com/Test");
        this.state={messages: [], lastPicked: undefined, players: [], gameData:undefined}
    }

    componentDidMount(){
        if(this.isAuthorized()){
            this.getGame();
            this.connectToChat();
        }
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
            category.questions.forEach((question, i) => question.value = QUESTION_VALUES[i])
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
                chat.send(JSON.stringify({"action": "sendMessage", "meta": "TEARDOWN", "user": this.props.location.state.u, "roomid": this.props.location.state.r, "data": null, "token": this.props.location.state.token}));
                console.log("Page refreshed or closed, cleaning up connection.");
            }
            window.onhashchange = (event) =>{
                chat.send(JSON.stringify({"action": "sendMessage", "meta": "TEARDOWN", "user": this.props.location.state.u, "roomid": this.props.location.state.r, "data": null, "token": this.props.location.state.token}));
                console.log("Page navigated away from, cleaning up connection.");
            }
            chat.send(JSON.stringify({"action": "sendMessage", "meta": "SETUP", "user": this.props.location.state.u, "roomid": this.props.location.state.r, "data": null, "token": this.props.location.state.token}));
        }

        chat.onerror = (event) => {
            console.log("Chat error");
        }

        chat.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            console.log(msg);
            switch (msg.meta) {
                case "MSG":
                    this.setState((prevState) => ({
                        ...prevState, 
                        messages: [...prevState.messages, msg]
                    }));
                    break;
                
                case "PICK":
                    this.handlePick(msg.msg);
                    break;

                case "SETUP":
                    this.handleJoin(msg.joined, msg.players);
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

    sendPick = (pos) => {
        chat.send(JSON.stringify({"action": "sendMessage", "meta": "PICK", "user": this.props.location.state.u, "roomid": this.props.location.state.r, "data": pos, "token": this.props.location.state.token}));
    }

    handlePick = (pos) => {
        //Trigger question sliding up from bottom of board, covering everything
        this.setState({...this.state, lastPicked: pos, answering: true});
        setTimeout(() => this.setState({...this.state, answering: false}), 15000);
    }

    handleJoin = (player, allPlayers) => {
        this.setState((prevState) => {
            if(allPlayers.indexOf(player) === -1){
                allPlayers = [...allPlayers, player]
            }
            return ({...prevState,
                players: allPlayers
            })
        });
    }

    sendMessage = (msg) => {
        chat.send(JSON.stringify({"action": "sendMessage", "meta": "MSG", "user": this.props.location.state.u, "roomid": this.props.location.state.r, "data": msg, "token": this.props.location.state.token}));
    }

    render() {
        return (this.isAuthorized() ? (
            this.state.gameData ? (
                <div className="container-app">
                    <Header />
                    <span>{"Your room code: " + this.props.location.state.r}</span>
                    <div className="container-content">
                        <QuestionGrid gameData={this.state.gameData} 
                        lastPicked={this.state.lastPicked} 
                        answering={this.state.answering} 
                        onPick={this.sendPick}
                        
                        />
                        <div className="container-players-chat">
                            <PlayerDisplay players={this.state.players}/>
                            <ChatDisplay messages={this.state.messages} onSendMessage={this.sendMessage}/>
                        </div>
                    </div>
                    <Footer />
                </div>
            ) : (
                <span className="loading-text">Game loading...</span>
            )
        ) : (
            <span>Please return to the home page and create or join a room to play multiplayer.</span>
        ));
    }
}

export default MultiplayerHome;