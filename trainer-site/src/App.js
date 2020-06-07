import React from 'react';
import {Link} from "react-router-dom";
import Header from "./Components/Header.js"
import Footer from "./Components/Footer.js"
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
  }

  render(){
    //At this point, only render the app if we have a question loaded and ready to go
    return (
        <div className="container-app">
          <Header />
          <Link to="/singleplayer"><input type="button" value={"Singleplayer"}/></Link>
          <Link to="/multiplayer"><input type="button" value={"Multiplayer"}/></Link>
          <Footer />
        </div>
    );
  }
}
