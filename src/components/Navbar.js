import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import { Grid, Fab, Typography } from "@material-ui/core";

const styles = theme => ({
  navbar: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    marginBottom: theme.spacing(5),
    backgroundColor: theme.palette.primary.main
  },
  brandName: {
    color: "#fff"
  }
});

class Navbar extends Component {
  state = {
    user: null
  };

  componentDidMount() {
    this.initLogin();
  }

  initLogin = () => {
    if (window.ethereum) {
      if (window.ethereum.selectedAddress) {
        this.setState({ user: window.ethereum.selectedAddress });
      }
    } else {
      console.error("Install/Update MetaMask");
    }
  };

  login = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable();
        this.setState({ user: accounts[0] });
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Install/Update MetaMask");
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
        className={classes.navbar}
      >
        <Grid item>
          <Typography variant="h5" component="p" className={classes.brandName}>
            Easy Token Launcher
          </Typography>
        </Grid>
        <Grid item></Grid>
        <Grid item>
          <Fab variant="extended" size="medium" onClick={this.login}>
            {this.state.user === null ? "Login" : this.state.user}
          </Fab>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Navbar);
