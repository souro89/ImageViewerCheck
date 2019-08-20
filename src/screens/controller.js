import React, { Component } from "react";
import Login from "./login/login";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./home/home";

class controller extends Component {
  render() {
    return (
      <Router>
        <div className="main-container">
          <Route exact path="/" render={props => <Login {...props} />} />
          <Route exact path="/home" render={props => <Home {...props} />} />
        </div>
      </Router>
    );
  }
}

export default controller;
