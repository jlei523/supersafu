/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    textAlign: "center",
    paddingTop: theme.spacing.unit * 20,
    width: "900px",
    margin: "0 auto"
  },
  root2: {
    flexGrow: 1,
    marginTop: "45px"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

const Score = props => {
  const score = props.score * 100;
  let color = "";
  let description = "";
  if (score >= 80) {
    color = "#05A845";
    description = "Super SAFU";
  } else if (score >= 70) {
    color = "#D59C2E";
    description = "Very SAFU";
  } else if (score >= 40) {
    color = "#D59C2E";
    description = "Probably SAFU";
  } else {
    color = "#D0021B";
    description = "Not SAFU";
  }

  return (
    <div>
      <Typography
        style={{ fontWeight: "bold", marginTop: "100px", color: color }}
        variant="h1"
      >
        {score}
      </Typography>
      <Typography
        style={{
          marginTop: "5px",
          marginBottom: "40px",
          color: color
        }}
        variant="h4"
      >
        {description}
      </Typography>
    </div>
  );
};

const Breakdown = props => {
  const value = props.value;
  const title = props.title;
  let valueDescription = "SAFU";
  let red = "#D0021B";
  let green = "#05A845";
  let orange = "#D59C2E";
  let color;
  if (title === "a") {
    valueDescription = "SAFU";
    color = green;
  } else if (title === "a") {
    valueDescription = "SAFU";
    color = green;
  } else if (title === "a") {
    valueDescription = "SAFU";
    color = green;
  } else if (title === "a") {
    valueDescription = "SAFU";
    color = green;
  } else {
    valueDescription = "SAFU";
    color = green;
  }

  return (
    <div>
      <Typography variant="h6">{props.title}</Typography>
      <Typography
        variant="body1"
        style={{ color: color }}
      >{`${valueDescription}`}</Typography>
      <Typography variant="body2">{props.avgForScam}</Typography>
      <Typography variant="body2">{props.avgForLegit}</Typography>
    </div>
  );
};

class Index extends React.Component {
  state = {
    open: false,
    spinner: false,
    scamAddresses: {},
    userEthAddress: "",
    existInScamDB: false,
    userEthAddressData: null,
    displayResults: false,
    score: 1
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  componentDidMount = () => {
    this.getScamAddresses();
  };

  fetchAddressDataFromServer = ethAddress => {
    axios.get(`/api/getAddressData/`, { params: ethAddress }).then(data => {
      this.setState({
        spinner: false,
        userEthAddressData: data.data.rows[0]
      });
      console.log("data from server", data.data.rows[0]);
    });
  };

  getScamAddresses = () => {
    (async () => {
      const data = await axios.get("https://etherscamdb.info/api/addresses/");
      this.setState({
        scamAddresses: data.data.result
      });
    })();
  };

  checkScamDatabases = address => {
    const { scamAddresses } = this.state;
    return scamAddresses.hasOwnProperty(address);
  };

  handleClick = () => {
    this.fetchAddressDataFromServer(this.state.userEthAddress);
    this.setState({
      displayResults: true,
      spinner: true,
      existInScamDB: this.checkScamDatabases(this.state.userEthAddress)
    });
  };

  saveValue = e => {
    this.setState({ userEthAddress: e.target.value });
  };

  render() {
    const { classes } = this.props;
    const { spinner } = this.state;
    const { displayResults } = this.state;
    const { existInScamDB } = this.state;
    const { score } = this.state;
    const { userEthAddressData } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="h2" gutterBottom>
          Is the address SAFU?
        </Typography>
        <TextField
          style={{ width: "600px", marginTop: "35px" }}
          id="outlined-textarea"
          label="Ethereum Address"
          placeholder="Enter an Ethereum address"
          multiline
          className={classes.textField}
          margin="normal"
          variant="outlined"
          onChange={this.saveValue}
        />
        {spinner ? (
          <div>
            <CircularProgress />
          </div>
        ) : (
          <div>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "35px" }}
              onClick={this.handleClick}
            >
              Check SAFU
            </Button>
          </div>
        )}

        {displayResults ? (
          <div style={{ marginBottom: "50px" }}>
            <Score score={score} />
            <Typography variant="h5">Attributes</Typography>
            <div className={classes.root2}>
              <Grid container spacing={24}>
                <Grid item xs>
                  <Paper className={classes.paper}>
                    {" "}
                    <Breakdown
                      title={"Title"}
                      value={0.2}
                      avgForScam={"42"}
                      avgForLegit={"200"}
                    />
                  </Paper>
                </Grid>
                <Grid item xs>
                  <Paper className={classes.paper}>
                    {" "}
                    <Breakdown
                      title={"Title"}
                      value={0.65}
                      avgForScam={"42"}
                      avgForLegit={"200"}
                    />
                  </Paper>
                </Grid>
                <Grid item xs>
                  <Paper className={classes.paper}>
                    {" "}
                    <Breakdown
                      title={"Title"}
                      value={0.78}
                      avgForScam={"42"}
                      avgForLegit={"200"}
                    />
                  </Paper>
                </Grid>
              </Grid>
              <Grid container spacing={24}>
                <Grid item xs>
                  <Paper className={classes.paper}>
                    {" "}
                    <Breakdown
                      title={"Title"}
                      value={1}
                      avgForScam={"42"}
                      avgForLegit={"200"}
                    />
                  </Paper>
                </Grid>
                <Grid item xs>
                  <Paper className={classes.paper}>
                    {" "}
                    <Breakdown
                      title={"Title"}
                      value={0.1}
                      avgForScam={"42"}
                      avgForLegit={"200"}
                    />
                  </Paper>
                </Grid>
                <Grid item xs>
                  <Paper className={classes.paper}>
                    {" "}
                    <Breakdown
                      title={"Title"}
                      value={0.98}
                      avgForScam={"42"}
                      avgForLegit={"200"}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Index);
