import React, { Component } from "react";
import "./header.css";
import SearchIcon from "@material-ui/icons/Search";
import {
  Input,
  FormControl,
  Avatar,
  Popover,
  MenuItem
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      anchorEl: null
    };
  }

  handleClick = e => {
    this.setState({ anchorEl: e.currentTarget });
  };

  handleOnClose = e => {
    this.setState({ anchorEl: null });
  };

  handleAccountClick = () => {};

  handleLogoutClick = () => {
    this.props.logout();
  };

  render() {
    const { showSearchBarAndProfileIcon } = this.props;
    return (
      <div>
        {showSearchBarAndProfileIcon === "true" ? (
          <header className="app-header">
            <span className="app-logo">Image Viewer</span>
            <span
              className="profile-icon"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={this.profileIconClickHandler}
            >
              <IconButton
                style={{
                  width: "25px",
                  height: "25px",
                  padding: "5px"
                }}
                onClick={this.handleClick}
              >
                <Avatar
                  alt="Profile Pic"
                  src={this.props.profilePicture}
                  className=""
                  style={{ border: "2px solid #000" }}
                />
              </IconButton>
              <Popover
                id="simple-menu"
                anchorEl={this.state.anchorEl}
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleOnClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left"
                }}
                style={{ marginTop: "10px" }}
              >
                <div style={{ padding: "5px" }}>
                  <div>
                    <MenuItem onClick={this.handleAccountClick}>
                      My Account
                    </MenuItem>
                    <div
                      style={{ backgroundColor: "#c0c0c0", height: "1px" }}
                    />
                  </div>
                  <MenuItem onClick={this.handleLogoutClick}>Logout</MenuItem>
                </div>
              </Popover>
            </span>

            <span className="search-bar">
              <SearchIcon className="icon-search" />
              <FormControl>
                <Input
                  type="text"
                  id="searchBar"
                  className="searchBar-input"
                  placeholder="Search..."
                  disableUnderline={true}
                  onChange={e => {
                    this.props.searchHandler(e.target.value);
                  }}
                />
              </FormControl>
            </span>
          </header>
        ) : (
          <header className="app-header">
            <span className="app-logo">Image Viewer</span>
          </header>
        )}
      </div>
    );
  }
}

export default Header;
