import React, { Component } from 'react';
import Header from "../Header.js"
import Footer from "../Footer.js"

class MultiplayerHome extends Component {
    constructor(props){
        super(props);
        this.state = {messages: [], message:'', chat:null};

    }

    componentDidMount(){
        if(this.isAuthorized()){
            this.connectToChat();
        }
    }

    isAuthorized = () => {
        //Prob should do a server side token check here
        return this.props.location.state && this.props.location.state.token;
    }

    connectToChat = () => {
        const chat = new WebSocket("wss://k0bg983q9d.execute-api.us-east-1.amazonaws.com/Test");

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
            if(msg.meta !== "SETUP" && msg.meta !== "TEARDOWN"){
                this.setState((prevState) => ({
                    messages: [...prevState.messages, msg]
                }));
            }
        }

        chat.onclose = (event) => {
            console.log("Chat connection closed");
            //chat.send(JSON.stringify({"action": "sendMessage", "meta": "TEARDOWN", "user": this.props.location.state.u, "roomid": this.props.location.state.r, "data": null, "token": this.props.location.state.token}));
        }

        this.setState({chat: chat});
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.state.chat.send(JSON.stringify({"action": "sendMessage", "meta":"MSG", "user": this.props.location.state.u, "roomid": this.props.location.state.r, "data": this.state.message, "token": this.props.location.state.token}));
    }

    handleInput = (event) => {
        this.setState({...this.state, message: event.target.value})
    }

    render() {
        return (this.isAuthorized() ? (
            <div className="container-app">
                <Header />
                {this.state.messages.map((msg) => 
                    <p><b>{msg.from + ": "}</b>{msg.msg}</p>
                )}
                <form onSubmit={this.handleSubmit}>
                    <input type="text" onChange={this.handleInput}/>
                    <input type="submit" value="Send Message"/>
                </form>
                <Footer />
            </div>
        ) : (
            <p>Please return to the home page and create or join a room to play multiplayer.</p>
        ));
    }
}

export default MultiplayerHome;