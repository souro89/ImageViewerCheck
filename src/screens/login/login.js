import React, { Component } from "react";
import "./login.css";
import Header from "../../common/header/header";
import Card from "@material-ui/core/Card";
import {
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  FormHelperText,
  Input,
  Button
} from "@material-ui/core";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      usernameRequired: "dispNone",
      password: "",
      passwordRequired: "dispNone"
    };
  }

  inputUsernameChangeHandler = e => {
    this.setState({ username: e.target.value });
  };

  inputPasswordChangeHandler = e => {
    this.setState({ password: e.target.value });
  };

  loginClickHandler = e => {};

  render() {
    return (
      <div>
        <Header />
        <div className="loginCard">
          <Card className="cardStyle">
            <Typography variant="headline" component="h2">
              LOGIN
            </Typography>
            <br />
            <br />
            <FormControl className="inputStyle">
              <InputLabel htmlFor="username">Username :</InputLabel>
              <Input
                id="username"
                type="text"
                username={this.state.username}
                onChange={this.inputUsernameChangeHandler}
              />
            </FormControl>
            <FormHelperText className={this.state.usernameRequired}>
              <span className="red">requried</span>
            </FormHelperText>
            <br />
            <br />
            <FormControl className="inputStyle">
              <InputLabel htmlFor="username">Password :</InputLabel>
              <Input
                id="password"
                type="text"
                username={this.state.password}
                onChange={this.inputPasswordChangeHandler}
              />
            </FormControl>
            <FormHelperText className={this.state.passwordRequired}>
              <span className="red">requried</span>
            </FormHelperText>
            <br />
            <br />
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={this.loginClickHandler}
            >
              LOGIN
            </Button>
            <CardContent />
          </Card>
        </div>
      </div>
    );
  }
}

export default Login;
