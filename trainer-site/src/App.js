import React from 'react';
import {Link, withRouter} from "react-router-dom";
import Header from "./Components/Header.js"
import Footer from "./Components/Footer.js"
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {'u':null, 'r': null}
  }

  componentDidMount(){
    sessionStorage.setItem('score', 0);
  }

  createRoomAndJoin = async () => {
    const username = this.state.u;
    try{
      const response = await fetch(
        "https://t4d66tek8f.execute-api.us-east-1.amazonaws.com/prod/create",
        {
          method: 'POST',
          headers: {'Content-Type': 'text/plain'},
          body: JSON.stringify({u:username})
        }
      )
      const res = await response.json()
      console.log(res);
      this.props.history.push({pathname: '/multiplayer', state: {token: res.token, u: username, r:res.roomid}});
    }catch(err){
      console.log("There was an error in the HTTP request", err);
      return false;
    }
  }

  checkRoomAndJoin = async () => {
    const username = this.state.u;
    const r = this.state.r;
    try{
      const response = await fetch(
        "https://t4d66tek8f.execute-api.us-east-1.amazonaws.com/prod/join",
        {
          method: 'POST',
          headers: {'Content-Type': 'text/plain'},
          body: JSON.stringify({'u':username, 'roomid': r})
        }
      )
      const res = await response.json();
      console.log(res);
      this.props.history.push({pathname: '/multiplayer', state: {token: res.token, u: username, r: r}});
    }catch(err){
      console.log("There was an error in the HTTP request", err);
      return false;
    }
  }

  handleRoomInput = (event) => {
    this.setState({r: event.target.value});
  }

  handleUsernameInput = (event) => {
    this.setState({u: event.target.value});
  }

  render(){
    return (
        <div className="container-app">
          <Header />
          <div className="container-home">
            <div className="container-choice">
              <span>Singleplayer</span>
              <Link to="/singleplayer"><input type="button" value={"Practice"}/></Link>
            </div>
            <div className="container-choice">
              <span>Multiplayer</span>
              <input type="text" onChange={this.handleUsernameInput}/>
              <input type="button" value={"Create Room"} onClick={this.createRoomAndJoin}/>
              <input type="text" onChange={this.handleRoomInput}/>
                <input type="button" value={"Join Room"} onClick={this.checkRoomAndJoin}/>
            </div>
          </div>
          <Footer />
        </div>
    );
  }
}

export default withRouter(App);
