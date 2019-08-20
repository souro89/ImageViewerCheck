import React, { Component } from "react";
import "./home.css";
import Header from "../../common/header/header";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: sessionStorage.getItem("access-token") == null ? false : true
    };
  }

  componentWillMount() {
    if (!this.state.loggedIn === true) {
      this.props.history.push({
        pathname: "/"
      });
    }

    let that = this;
    let data = null;
    let xhr = new XMLHttpRequest();
    let url =
      "https://api.instagram.com/v1/users/self/?access_token=" +
      sessionStorage.getItem("access-token");

    xhr.open("GET", url);
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send(data);
    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });
  }

  logoutHandler = () => {
    sessionStorage.clear();
    this.props.history.push({
      pathname: "/"
    });
  };

  render() {
    return (
      <Header showSearchBarAndProfileIcon="true" logout={this.logoutHandler} />
    );
  }
}

export default Home;
