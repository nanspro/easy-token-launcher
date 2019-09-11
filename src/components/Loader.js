import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  grid: {
    marginTop: theme.spacing(2)
  }
});

class Loader extends Component {
  state = {
    size: 50
  };

  componentWillMount() {
    if (this.props.size === "small") {
      this.setState({ size: 30 });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid
        container
        className={classes.grid}
        direction="row"
        justify="center"
        alignContent="center"
      >
        <Grid item>
          <CircularProgress size={this.state.size} color="secondary" />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Loader);
