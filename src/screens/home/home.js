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
  Typography,
  CardActions,
  IconButton,
  FormControl,
  InputLabel,
  Input,
  Button
} from "@material-ui/core";
import FavoriteIconBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIconFill from "@material-ui/icons/Favorite";

const styles = theme => ({
  hr: {
    marginTop: "10px",
    borderTop: "2px solid #f2f2f2"
  },
  formControl: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline"
  }
});

class Home extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
      profilePicture: "",
      data: [],
      filteredData: [],
      isLiked: false,
      isLikedId: "",
      comment: "",
      likedPosts: new Set(),
      comments: {},
      currrentComment: ""
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

  toProfilePage = () => {
    this.props.history.push({
      pathname: "/profile"
    });
  };

  getUserData = () => {
    let that = this;
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

  searchHandler = e => {
    let filteredData = this.state.data;
    filteredData = filteredData.filter(data => {
      let string = data.caption.text.toLowerCase();
      let subString = e.toLowerCase();
      return string.includes(subString);
    });
    this.setState({ filteredData });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Header
          showSearchBarAndProfileIcon="true"
          disableSearchBar="false"
          logout={this.logoutHandler}
          profilePicture={this.state.profilePicture}
          searchHandler={this.searchHandler}
          toProfilePage={this.toProfilePage}
        />
        <div className="grid">
          <GridList
            cols={2}
            style={{
              width: "auto",
              height: "auto"
            }}
          >
            {this.state.filteredData.map(item => (
              <GridListTile key={item.id} style={{ height: "auto" }}>
                <SingleCards
                  classes={classes}
                  item={item}
                  onClickLike={this.likeClickHanlder}
                  commentChangeHandler={this.commentChangeHandler}
                  onAddCommentClicked={this.onAddCommentClicked}
                  comments={this.state.comments}
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      </div>
    );
  }

  likeClickHanlder = id => {
    var post = this.state.data.find(item => {
      return item.id === id;
    });

    if (this.state.likedPosts.has(id) === false) {
      post.likes.count++;
      this.setState(({ likedPosts }) => ({
        likedPosts: new Set(likedPosts.add(id))
      }));
    } else {
      post.likes.count--;
      this.setState(({ likedPosts }) => {
        const newLike = new Set(likedPosts);
        newLike.delete(id);

        return {
          likedPosts: newLike
        };
      });
    }
  };

  onAddCommentClicked = id => {
    if (this.state.currentComment === "") {
      return;
    }

    let commentList = this.state.comments.hasOwnProperty(id)
      ? this.state.comments[id].concat(this.state.currentComment)
      : [].concat(this.state.currentComment);

    this.setState({
      comments: {
        ...this.state.comments,
        [id]: commentList
      },
      currentComment: ""
    });
  };

  commentChangeHandler = e => {
    this.setState({
      currentComment: e.target.value
    });
  };
}

class SingleCards extends Component {
  constructor() {
    super();
    this.state = {
      isLiked: false,
      comment: ""
    };
  }

  onClickLike = id => {
    console.log(id);
    if (this.state.isLiked) {
      this.setState({ isLiked: false, isLikedId: "" });
    } else {
      this.setState({ isLiked: true, isLikedId: id });
    }
    this.props.onClickLike(id);
  };

  commentChangeHandler = e => {
    this.setState({ comment: e.target.value });
    this.props.commentChangeHandler(e);
  };

  onAddCommentClicked = id => {
    if (this.state.comment === "" || typeof this.state.comment === undefined) {
      return;
    }
    this.setState({
      comment: ""
    });
    this.props.onAddCommentClicked(id);
  };

  render() {
    let createdTime = new Date(0);
    createdTime.setUTCSeconds(this.props.item.created_time);
    let yyyy = createdTime.getFullYear();
    let mm = createdTime.getMonth() + 1;
    let dd = createdTime.getDate();

    let HH = createdTime.getHours();
    let MM = createdTime.getMinutes();
    let ss = createdTime.getSeconds();

    let time = dd + "/" + mm + "/" + yyyy + " " + HH + ":" + MM + ":" + ss;
    let hashTags = this.props.item.tags.map(hash => {
      return "#" + hash;
    });

    return (
      <div className="gridSpace">
        <Card style={{ maxWidth: "1100" }}>
          <CardHeader
            avatar={
              <Avatar
                src={this.props.item.user.profile_picture}
                style={{ margin: "10" }}
              />
            }
            style={{ fontWeight: "bold" }}
            title={
              <Typography component="span" style={{ fontWeight: "bold" }}>
                {this.props.item.user.username}
              </Typography>
            }
            subheader={time}
          />
          <CardContent>
            <CardMedia
              style={{ paddingTop: "60%", height: "0" }}
              image={this.props.item.images.standard_resolution.url}
              title={this.props.item.caption.text}
            />
            <div className={this.props.classes.hr}>
              <Typography component="p">
                {this.props.item.caption.text}
              </Typography>
              <Typography style={{ color: "#4dabf5" }} component="p">
                {hashTags.join(" ")}
              </Typography>
            </div>
          </CardContent>
          <CardActions>
            <IconButton
              aria-label="Add to favourites"
              onClick={this.onClickLike.bind(this, this.props.item.id)}
            >
              {this.state.isLiked && (
                <FavoriteIconFill style={{ color: "#F44336" }} />
              )}
              {!this.state.isLiked && <FavoriteIconBorder />}
            </IconButton>
            <Typography component="p">
              {this.props.item.likes.count} Likes
            </Typography>
          </CardActions>
          <CardContent>
            {this.props.comments.hasOwnProperty(this.props.item.id) &&
              this.props.comments[this.props.item.id].map((comment, index) => {
                return (
                  <div key={index} className="row">
                    <Typography component="p" style={{ fontWeight: "bold" }}>
                      upgrad_edu:
                    </Typography>
                    <Typography component="p">{comment}</Typography>
                  </div>
                );
              })}

            <div className={this.props.classes.formControl}>
              <FormControl style={{ flexGrow: 1 }}>
                <InputLabel htmlFor="comment">Add Comment</InputLabel>
                <Input
                  id="comment"
                  value={this.state.comment}
                  onChange={this.commentChangeHandler}
                />
              </FormControl>
              <FormControl>
                <Button
                  onClick={this.onAddCommentClicked.bind(
                    this,
                    this.props.item.id
                  )}
                  variant="contained"
                  color="primary"
                >
                  ADD
                </Button>
              </FormControl>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
