import React, { Component } from 'react';
import styles from './ChatDisplay.module.css';

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
            <div className={styles.containerChat}>
                <div className={styles.messageDisplay}>
                    {this.props.messages.map((data) => 
                        <span className={styles.chatMessage}><b>{data.from+": "}</b>{data.msg}</span>
                    )}
                </div>
                <form className={styles.containerChatInput} onSubmit={this.handleSubmit}>
                    <input className={styles.chatInput} type="text" onChange={this.handleInput} ref={this.inputRef}/>
                    <input className={styles.chatSubmitBtn} type="submit" value="Send Message"/>
                </form>
            </div>
        );
    }
}

export default ChatDisplay;