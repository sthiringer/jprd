import React, { Component } from 'react';

class ChatDisplay extends Component {
    constructor(props){
        super(props);

        this.state = {curMessage: undefined}
        this.inputRef = React.createRef();
    }

    handleInput = (event) => {
        this.setState({curMessage: event.target.value})
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.onSendMessage(this.state.curMessage);
        this.inputRef.current.value = "";
    }

    render() {
        return (
            <div className="container-chat">
                <div className="message-display">
                    {this.props.messages.map((data) => 
                        <span className="chat-message"><b>{data.from+": "}</b>{data.msg}</span>
                    )}
                </div>
                <form className="container-chat-input" onSubmit={this.handleSubmit}>
                    <input className="chat-input" type="text" onChange={this.handleInput} ref={this.inputRef}/>
                    <input className="chat-submit-btn" type="submit" value="Send Message"/>
                </form>
            </div>
        );
    }
}

export default ChatDisplay;