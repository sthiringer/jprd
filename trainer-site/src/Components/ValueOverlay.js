import React, { Component } from 'react';

class ValueOverlay extends Component {
    constructor(props){
        super(props);
        this.state = {visible: true, userValue: ''};
    }

    componentDidMount(){
        if(!this.props.question.isdailydouble){
            setTimeout(() => this.setState({...this.state, visible: false}), 1000);
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.question !== this.props.question){
            this.setState({...this.state, visible: true}, () => {
                setTimeout(() => this.setState({...this.state, visible: false}), 1000);
            });
        }
    }

    handleInput = (event) => {
        this.setState({...this.state, userValue: event.target.value.replace(/\D/,'')})
    }

    handleSubmit = (event) => {
        //Pass entered value to questiondisplay component
        //Fade overlay
        event.preventDefault();
        this.setState({...this.state, visible: false}, () => {
            this.props.onSubmit(this.state.userValue);
        });
    }

    getModalClass = () => {
        if(this.state.visible){
            return "value-modal"
        }else{
            return "value-modal-hidden"
        }
    }

    getOverlay(isDD){
        if(isDD){
            return(
                <form onSubmit={this.handleSubmit}>
                    <span className="value-title-text">
                        {"DAILY DOUBLE!"}
                    </span>
                    <div className="value-row">
                        <label className="value-entry-text">{"$"}</label>
                        <input type="text" value={this.state.userValue} className="value-input" onChange={this.handleInput}/>
                    </div>
                    <input className="value-submit" type="submit" value="Wager"/>
                </form>
            );
        }else{
            return(
                <span className="value-text">
                    {"$" + this.props.question.value}
                </span>
            );
        }
    }

    render() {
        return (
            <div className={this.getModalClass()}>
                {this.getOverlay(this.props.question.isdailydouble)}
            </div>
        );
    }
}

export default ValueOverlay;