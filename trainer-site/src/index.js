import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/Global/App/App';
import SingleplayerHome from './Components/Singleplayer/SingleplayerHome';
import MultiplayerHome from './Components/Multiplayer/MultiplayerHome/MultiplayerHome';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

ReactDOM.render(
    <Router>
        <Switch>
            <Route path="/singleplayer">
                <SingleplayerHome />
            </Route>

            <Route path="/multiplayer" component={MultiplayerHome} />

            <Route path="/">
                <App />
            </Route>
        </Switch>
    </Router>, 
    document.getElementById('root')    
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
