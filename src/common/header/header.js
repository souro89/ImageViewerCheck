import React, { Component } from "react";
import "./header.css";
import SearchIcon from "@material-ui/icons/Search";
import { Input, FormControl, Menu, MenuItem } from "@material-ui/core";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      showDropdown: false
    };
  }

  profileIconClickHandler = e => {
    // this.state.showDropdown === true
    //   ? this.setState({ showDropdown: false })
    //   : this.setState({ showDropdown: true });
  };

  render() {
    return (
      <div>
        {this.props.showSearchBarAndProfileIcon === "true" ? (
          <header className="app-header">
            <span className="app-logo">Image Viewer</span>
            <span
              className="profile-icon"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={this.profileIconClickHandler}
            />
            <span className="search-bar">
              <SearchIcon className="icon-search" />
              <FormControl>
                <Input
                  type="text"
                  id="searchBar"
                  className="searchBar-input"
                  placeholder="Search..."
                  disableUnderline="true"
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
