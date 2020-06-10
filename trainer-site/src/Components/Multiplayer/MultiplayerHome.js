import React, { Component } from 'react';
import Header from "../Header.js"
import Footer from "../Footer.js"

class MultiplayerHome extends Component {
    constructor(props){
        super(props);
        this.state = {messages: []};
    }

    componentDidMount(){
        const chat = new WebSocket("wss://k0bg983q9d.execute-api.us-east-1.amazonaws.com/Test");

        chat.onopen = (event) => {
            console.log("Chat connection opened");
            console.log(this.props.location.state.r);
            chat.send(JSON.stringify({"action": "sendMessage", "type": "INFO", "user": this.props.location.state.u, "roomid": this.props.location.state.r}));
        }

        chat.onerror = (event) => {
            console.log("Chat error");
        }

        chat.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            this.setState((prevState) => ({
               messages: [...prevState.messages, msg]
            }));
        }

        chat.onclose = (event) => {
            console.log("Chat connection closed");
        }

        this.setState({chat: chat});
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.state.chat.send(JSON.stringify({"action": "sendMessage", "type":"MSG", "user": this.props.location.state.u, "roomid": this.props.location.state.r, "data": this.state.message}));
    }

    handleInput = (event) => {
        this.setState({...this.state, message: event.target.value})
    }

    render() {
        return (
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
        );
    }
}

export default MultiplayerHome;