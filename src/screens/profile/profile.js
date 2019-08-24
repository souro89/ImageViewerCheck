import React, { Component } from "react";
import "./profile.css";
import Header from "../../common/header/header";
import {
  Avatar,
  Button,
  Typography,
  Modal,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  GridList,
  GridListTile,
  CardMedia
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

const styles = {
  paper: {
    position: "relative",
    width: "180px",
    backgroundColor: "#fff",
    top: "30%",
    margin: "0 auto",
    boxShadow: "2px 2px #888888",
    padding: "20px"
  },
  media: {
    height: "200px",
    paddingTop: "56.25%" // 16:9
  },
  imageModal: {
    backgroundColor: "#fff",
    margin: "0 auto",
    boxShadow: "2px 2px #888888",
    padding: "10px"
  }
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
      data: [],
      profilePicture: "",
      username: "",
      full_name: "",
      posts: "",
      follows: "",
      followed_by: "",
      mediaData: null,
      editOpen: false,
      fullNameRequired: "dispNone",
      newFullName: "",
      imageModalOpen: false,
      currentItem: null,
      likeSet: new Set(),
      comments: {}
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

  getUserData() {
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
        that.setState({
          profilePicture: data.data.profile_picture,
          username: data.data.username,
          full_name: data.data.full_name,
          posts: data.data.counts.media,
          follows: data.data.counts.follows,
          followed_by: data.data.counts.followed_by
        });
      }
    });
  }

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
        this.setState({
          mediaData: jsonResponse.data
        });
      })
      .catch(error => {
        console.log("error media data", error);
      });
  };

  handleOpenEditModal = () => {
    this.setState({ editOpen: true });
  };

  handleCloseEditModal = () => {
    this.setState({ editOpen: false });
  };

  handleOpenImageModal = event => {
    console.log(event.target.id);
    var result = this.state.mediaData.find(item => {
      return item.id === event.target.id;
    });
    console.log(result);
    this.setState({ imageModalOpen: true, currentItem: result });
  };

  handleCloseImageModal = () => {
    this.setState({ imageModalOpen: false });
  };

  inputFullNameChangeHandler = e => {
    this.setState({
      newFullName: e.target.value
    });
  };

  updateClickHandler = () => {
    if (this.state.newFullName === "") {
      this.setState({ fullNameRequired: "dispBlock" });
    } else {
      this.setState({ fullNameRequired: "dispNone" });
    }

    if (this.state.newFullName === "") {
      return;
    }

    this.setState({
      full_name: this.state.newFullName
    });

    this.handleCloseEditModal();
  };

  likeClickHandler = id => {
    console.log("like id", id);
    var foundItem = this.state.currentItem;

    if (typeof foundItem !== undefined) {
      if (!this.state.likeSet.has(id)) {
        foundItem.likes.count++;
        this.setState(({ likeSet }) => ({
          likeSet: new Set(likeSet.add(id))
        }));
      } else {
        foundItem.likes.count--;
        this.setState(({ likeSet }) => {
          const newLike = new Set(likeSet);
          newLike.delete(id);

          return {
            likeSet: newLike
          };
        });
      }
    }
  };

  onAddCommentClicked = id => {
    console.log("id", id);
    if (
      this.state.currentComment === "" ||
      typeof this.state.currentComment === undefined
    ) {
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

  logout = () => {
    sessionStorage.clear();
    this.props.history.replace("/");
  };

  render() {
    return (
      <div>
        <Header
          showSearchBarAndProfileIcon="true"
          disableSearchBar="true"
          profilePicture={this.state.profilePicture}
          logout={this.logout}
        />
        <div className="count-div">
          <Avatar
            alt="User Image"
            src={this.state.profilePicture}
            style={{ width: "100px", height: "100px" }}
          />
          <span style={{ marginLeft: "50px" }}>
            <div
              style={{ width: "600px", fontSize: "big", fontWeight: "bold" }}
            >
              <Typography
                component="p"
                style={{ fontWeight: "bold", fontSize: "20px" }}
              >
                {" "}
                {this.state.username}{" "}
              </Typography>{" "}
              <br />
              <div
                style={{
                  float: "left",
                  width: "200px",
                  fontSize: "10px",
                  fontWeight: "bold"
                }}
              >
                {" "}
                Posts: {this.state.posts}{" "}
              </div>
              <div
                style={{
                  float: "left",
                  width: "200px",
                  fontSize: "10px",
                  fontWeight: "bold"
                }}
              >
                {" "}
                Follows: {this.state.follows}{" "}
              </div>
              <div
                style={{
                  float: "left",
                  width: "200px",
                  fontSize: "10px",
                  fontWeight: "bold"
                }}
              >
                {" "}
                Followed By: {this.state.followed_by}{" "}
              </div>
              <div style={{ fontSize: "small" }}>
                {this.state.full_name}
                <Button
                  mini
                  variant="fab"
                  color="secondary"
                  aria-label="Edit"
                  style={{ marginLeft: "20px" }}
                  onClick={this.handleOpenEditModal}
                >
                  <EditIcon>edit_icon</EditIcon>
                </Button>
              </div>
              <Modal
                aria-labelledby="edit-modal"
                arai-describedby="modal to edit user full name"
                open={this.state.editOpen}
                onClose={this.handleEditCloseModal}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <div style={styles.paper}>
                  <Typography variant="h5" id="modal-title">
                    Edit
                  </Typography>
                  <br />
                  <FormControl required>
                    <InputLabel htmlFor="fullname">Full Name</InputLabel>
                    <Input
                      id="fullname"
                      onChange={this.inputFullNameChangeHandler}
                    />
                    <FormHelperText className={this.state.fullNameRequired}>
                      <span className="red">required</span>
                    </FormHelperText>
                  </FormControl>
                  <br />
                  <br />
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.updateClickHandler}
                  >
                    UPDATE
                  </Button>
                </div>
              </Modal>
            </div>
          </span>
        </div>

        {this.state.mediaData != null && (
          <GridList cellHeight={"auto"} cols={3} style={{ padding: "40px" }}>
            {this.state.mediaData.map(item => (
              <GridListTile key={item.id}>
                <CardMedia
                  id={item.id}
                  style={styles.media}
                  image={item.images.standard_resolution.url}
                  title={item.caption.text}
                  onClick={this.handleOpenImageModal}
                />
              </GridListTile>
            ))}
          </GridList>
        )}

        {this.state.currentItem != null && (
          <Modal
            aria-labelledby="image-modal"
            aria-describedby="image details"
            open={this.state.imageModalOpen}
            onClose={this.handleCloseImageModal}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#fff",
                width: "70%",
                height: "70%"
              }}
            >
              <div style={{ width: "50%", padding: 10 }}>
                <img
                  style={{ height: "100%", width: "100%" }}
                  src={this.state.currentItem.images.standard_resolution.url}
                  alt={this.state.currentItem.caption.text}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                  padding: 10
                }}
              >
                <div
                  style={{
                    borderBottom: "2px solid #f2f2f2",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center"
                  }}
                >
                  <Avatar
                    alt="User Image"
                    src={this.state.profilePicture}
                    style={{ width: "50px", height: "50px", margin: "10px" }}
                  />
                  <Typography component="p" style={{ fontWeight: "bold" }}>
                    {this.state.username}
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <Typography component="p">
                      {this.state.currentItem.caption.text}
                    </Typography>
                    <Typography style={{ color: "#4dabf5" }} component="p">
                      {}
                    </Typography>
                    {this.state.comments.hasOwnProperty(
                      this.state.currentItem.id
                    ) &&
                      this.state.comments[this.state.currentItem.id].map(
                        (comment, index) => {
                          return (
                            <div key={index} className="row">
                              <Typography
                                component="p"
                                style={{ fontWeight: "bold" }}
                              >
                                {sessionStorage.getItem("username")}:
                              </Typography>
                              <Typography component="p">{comment}</Typography>
                            </div>
                          );
                        }
                      )}
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

export default Profile;
