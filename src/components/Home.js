import React, { Component, Fragment } from "react";

import { withStyles } from "@material-ui/core/styles";
import { Container, Fab, Typography, Grid } from "@material-ui/core";
import TrendingUp from "@material-ui/icons/TrendingUpRounded";

import Navbar from "./Navbar";

const styles = theme => ({
  fabIcon: {
    marginRight: theme.spacing(1)
  }
});

class Home extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Navbar />
        <Container maxWidth="md">
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            spacing={3}
          >
            <Grid item>
              <Typography variant="h4" align="center">
                Welcome to Easy Token Launcher
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" align="center">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum deleniti atque corrupti quos
                dolores et quas molestias excepturi sint occaecati cupiditate
                non provident, similique sunt in culpa qui officia deserunt
                mollitia animi, id est laborum et dolorum fuga. Et harum quidem
                rerum facilis est et expedita distinctio.
              </Typography>
            </Grid>
            <Grid item>
              <Fab variant="extended" color="primary" href="/launch">
                <TrendingUp className={classes.fabIcon} />
                Launch Tokens
              </Fab>
            </Grid>
          </Grid>
        </Container>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Home);
