import React, { Component } from "react";
import "./home.css";
import Header from "../../common/header/header";
import { withStyles } from "@material-ui/core/styles";
import {
  GridList,
  GridListTile,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  CardMedia,
  Typography
} from "@material-ui/core";

const styles = theme => ({
  hr: {
    marginTop: "10px",
    borderTop: "2px solid #f2f2f2"
  }
});

class Home extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
      profilePicture: "",
      data: [],
      filteredData: []
    };
  }

  componentWillMount() {
    if (!this.state.loggedIn === true) {
      this.props.history.push({
        pathname: "/"
      });
    }

    this.getUserData();
    this.getMediaData();
  }

  logoutHandler = () => {
    sessionStorage.clear();
    this.props.history.push({
      pathname: "/"
    });
  };

  getUserData = () => {
    let that = this;
    let data = null;
    let xhr = new XMLHttpRequest();
    let url =
      "https://api.instagram.com/v1/users/self/?access_token=" +
      sessionStorage.getItem("access-token");

    xhr.open("GET", url);
    //xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send();
    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        let data = JSON.parse(this.responseText);
        that.setState({ profilePicture: data.data.profile_picture });
      }
    });
  };

  getMediaData = () => {
    let that = this;
    // let data = null;
    // let xhr = new XMLHttpRequest();

    let url =
      "https://api.instagram.com/v1/users/self/media/recent?access_token=" +
      sessionStorage.getItem("access-token");

    return fetch(url, {
      method: "GET"
    })
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        that.setState({
          data: jsonResponse.data,
          filteredData: jsonResponse.data
        });
      })
      .catch(error => {
        console.log("error user data", error);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Header
          showSearchBarAndProfileIcon="true"
          logout={this.logoutHandler}
          profilePicture={this.state.profilePicture}
        />
        <div className="grid">
          <GridList
            cols={2}
            style={{
              width: "auto",
              height: "auto"
            }}
          >
            {this.state.data.map(item => (
              <GridListTile key={item.id} style={{ height: "auto" }}>
                <div className="gridSpace">
                  <Card style={{ maxWidth: "1100" }}>
                    <CardHeader
                      avatar={
                        <Avatar
                          src={item.user.profile_picture}
                          style={{ margin: "10" }}
                        />
                      }
                      title={item.user.username}
                      subheader={item.createdTime}
                    />
                    <CardContent>
                      <CardMedia
                        style={{ paddingTop: "60%", height: "0" }}
                        image={item.images.standard_resolution.url}
                        title={item.caption.text}
                      />
                    </CardContent>
                  </Card>
                </div>
              </GridListTile>
            ))}
          </GridList>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
