import React, { Component } from 'react';
import QuestionDisplay from "./QuestionDisplay";
import Header from "../Global/Header/Header.js"
import Footer from "../Global/Footer/Footer.js"

class SingleplayerHome extends Component {
    render() {
        return (
            <div className="container-app">
                <Header />
                <QuestionDisplay />
                <Footer />
            </div>
        );
    }
}

export default SingleplayerHome;