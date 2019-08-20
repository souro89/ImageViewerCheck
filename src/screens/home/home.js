import React, { Component } from "react";
import "./home.css";
import Header from "../../common/header/header";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: sessionStorage.getItem("access-token") == null ? true : false
    };
  }

  componentWillMount() {
    if (this.state.loggedIn === true) {
      this.props.history.push({
        pathname: "/"
      });
    }
  }

  render() {
    return <Header />;
  }
}

export default Home;
