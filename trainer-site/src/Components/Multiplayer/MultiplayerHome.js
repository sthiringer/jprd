import React, { Component } from 'react';
import Header from "../Header.js";
import Footer from "../Footer.js";
import QuestionGrid from "./QuestionGrid";
import ChatDisplay from "./ChatDisplay";

let chat = undefined;

class MultiplayerHome extends Component {
    constructor(props){
        super(props);
        chat = new WebSocket("wss://k0bg983q9d.execute-api.us-east-1.amazonaws.com/Test");
        this.state={messages: [], lastPicked: -1}
    }

    componentDidMount(){
        if(this.isAuthorized()){
            this.connectToChat();
        }
    }

    connectToChat =  () => {
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
        this.setState({...this.state, lastPicked: pos});
    }

    sendMessage = (msg) => {
        chat.send(JSON.stringify({"action": "sendMessage", "meta": "MSG", "user": this.props.location.state.u, "roomid": this.props.location.state.r, "data": msg, "token": this.props.location.state.token}));
    }

    render() {
        return (this.isAuthorized() ? (
            <div className="container-app">
                <Header />
                <span>{"Your room code: " + this.props.location.state.r}</span>
                <div className="container-content">
                    <QuestionGrid lastPicked={this.state.lastPicked} onPick={this.sendPick}/>
                    <ChatDisplay messages={this.state.messages} onSendMessage={this.sendMessage}/>
                </div>
                <Footer />
            </div>
        ) : (
            <p>Please return to the home page and create or join a room to play multiplayer.</p>
        ));
    }
}

export default MultiplayerHome;