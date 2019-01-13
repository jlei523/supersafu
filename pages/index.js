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
import Round from "round-to";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
  root: {
    textAlign: "center",
    paddingTop: theme.spacing.unit * 20,
    width: "1000px",
    margin: "0 auto"
  },
  root2: {
    flexGrow: 1,
    marginTop: "45px"
  },
  paper: {
    padding: "20px 10px",
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

const defaultEthObj = {
  balance_eth: 75.6898,
  is_scam: 1,
  max_block_number_in_erc20: 6270380,
  max_block_number_in_eth: 5006430,
  max_block_number_out_erc20: 5279260,
  max_block_number_out_eth: 5279300,
  max_in: 15.7291,
  max_out: 36.7,
  mean_in: 0.383225,
  mean_out: 1.31496,
  min_block_number_in_erc20: 4979330,
  min_block_number_in_eth: 4979330,
  min_block_number_out_erc20: 4989350,
  min_block_number_out_eth: 4986040,
  min_in: 0.000784077,
  min_out: 0,
  num_distinct_blocks_in: 98,
  num_distinct_blocks_in_erc20: 70,
  num_distinct_blocks_out: 29,
  num_distinct_blocks_out_erc20: 23,
  num_distinct_tokens_in: 35,
  num_distinct_tokens_out: 22,
  num_distinct_wallets_in: 89,
  num_distinct_wallets_in_erc20: 53,
  num_distinct_wallets_out: 26,
  num_distinct_wallets_out_erc20: 6,
  num_in_tx: 98,
  num_in_tx_erc20: 70,
  num_out_tx: 29,
  num_out_tx_erc20: 23,
  num_tx_erc20: 93,
  num_tx_eth: 127,
  vol_in: 37.556,
  vol_out: 38.1338
};

const Score = props => {
  const score = props.score * 100;
  let color = "";
  let description = "";
  if (score >= 90) {
    color = "#05A845";
    description = "Super SAFU";
  } else if (score >= 80) {
    color = "#D59C2E";
    description = "Very SAFU";
  } else if (score >= 60) {
    color = "#D59C2E";
    description = "Probably SAFU";
  } else if (score >= 40) {
    color = "#D59C2E";
    description = "Be Careful SAFU";
  } else if (score > 1) {
    color = "#D0021B";
    description = "Not Very SAFU";
  } else {
    color = "#D0021B";
    description = "Super Not SAFU";
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
  const value = Round(props.value, 1);
  let title = props.title;
  let valueDescription = "SAFU";
  let red = "#D0021B";
  let green = "#05A845";
  let orange = "#D59C2E";
  let color;
  let { avgForLegit } = props;
  let { avgForScam } = props;
  let isFirstBreakDown = false;

  if (title === "Check Known Scam Databases") {
    if (!props.scamScore) {
      title = "Not a Known Scam Address";
      valueDescription = "SAFU";
      color = green;
      avgForScam = null;
      avgForLegit = "Never reported as a scam address";
      isFirstBreakDown = true;
    } else {
      title = "Known Scam Address";
      valueDescription = "Not SAFU";
      color = red;
      avgForScam = null;
      avgForLegit = "Scam address found on etherscamdb.info";
      isFirstBreakDown = true;
    }
  } else if (title === "Number of Incoming Transactions") {
    title = `Number of Incoming Transactions: 
    ${value}`;
    if (value < 39.95) {
      valueDescription = "SAFU";
      color = green;
    } else {
      valueDescription = "Suspicious";
      color = red;
    }
  } else if (title === "Number of Distinct Incoming Wallets") {
    title = `Number of Distinct Incoming Wallets: 
    ${value}`;
    if (value < 9.8) {
      valueDescription = "SAFU";
      color = green;
    } else {
      valueDescription = "Suspicious";
      color = red;
    }
  } else if (title === "Minimum Outgoing Value") {
    title = `Minimum Outgoing Value: ${value}`;
    if (value < 5.3) {
      valueDescription = "SAFU";
      color = green;
    } else {
      valueDescription = "Suspicious";
      color = red;
    }
  } else if (title === "First Incoming ETH Transaction") {
    title = `First Incoming ETH Transaction Block: ${value}`;
    if (value < 9320454 / 2) {
      valueDescription = "SAFU";
      color = green;
    } else {
      valueDescription = "Suspicious";
      color = red;
    }
  } else {
    title = `Mean Incoming ETH Value: 
    ${value}`;
    valueDescription = "SAFU";
    color = green;
  }

  return (
    <div>
      <Typography variant="body1" style={{ fontWeight: "500" }}>
        {`${title}`}
      </Typography>
      <Typography
        variant="body1"
        style={{ color: color, fontWeight: "500", margin: "20px 0" }}
      >{`${valueDescription}`}</Typography>
      {avgForScam ? (
        <Typography variant="body2">{`Average for a scam address: ${avgForScam}`}</Typography>
      ) : (
        <br />
      )}
      {isFirstBreakDown ? (
        <Typography variant="body2">{`${avgForLegit}`}</Typography>
      ) : (
        <Typography variant="body2">{`Average for a legit address: ${avgForLegit}`}</Typography>
      )}
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
    userEthAddressData: defaultEthObj,
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
    console.log("run server fetch");
    axios.get(`/api/getAddressData/`, { params: ethAddress }).then(data => {
      console.log("data from server", data.data.rows[0]);
      if (data.data.rows[0]) {
        this.setState({
          spinner: false,
          userEthAddressData: data.data.rows[0],
          displayResults: true
        });
      } else {
        this.setState({
          spinner: false,
          displayResults: true
        });
      }
    });
  };

  getScamAddresses = () => {
    (async () => {
      const data = await axios.get("https://etherscamdb.info/api/addresses/");
      console.log(data);
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
    this.setState({
      spinner: true,
      existInScamDB: this.checkScamDatabases(this.state.userEthAddress)
    });
    this.fetchAddressDataFromServer(this.state.userEthAddress);
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
    const scamScore = Round(1 - userEthAddressData.is_scam, 2);
    const {
      num_in_tx,
      num_distinct_wallets_in,
      min_out,
      min_block_number_in_eth,
      mean_in
    } = userEthAddressData;

    console.log(userEthAddressData);

    return (
      <div className={classes.root}>
        <Typography variant="h2" gutterBottom>
          Is the address super SAFU?
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
            <CircularProgress style={{ marginTop: "35px" }} />
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
            <Score score={scamScore} />
            <Typography variant="h5">
              Top 6 (out of 30+) most predictive data points in our machine
              learning algorithm:
            </Typography>
            <div className={classes.root2}>
              <Grid container spacing={24}>
                <Grid item xs>
                  <Paper className={classes.paper}>
                    {" "}
                    <Breakdown
                      title={"Check Known Scam Databases"}
                      scamScore={existInScamDB}
                      value={0.2}
                      avgForScam={77.1771}
                      avgForLegit={2.673967}
                    />
                  </Paper>
                </Grid>
                <Grid item xs>
                  <Paper className={classes.paper}>
                    {" "}
                    <Breakdown
                      title={"Number of Incoming Transactions"}
                      value={num_in_tx}
                      avgForScam={77.2}
                      avgForLegit={2.7}
                    />
                  </Paper>
                </Grid>
                <Grid item xs>
                  <Paper className={classes.paper}>
                    {" "}
                    <Breakdown
                      title={"Number of Distinct Incoming Wallets"}
                      value={num_distinct_wallets_in}
                      avgForScam={18.3}
                      avgForLegit={1.3}
                    />
                  </Paper>
                </Grid>
              </Grid>
              <Grid container spacing={24}>
                <Grid item xs>
                  <Paper className={classes.paper}>
                    {" "}
                    <Breakdown
                      title={"Minimum Outgoing Value"}
                      value={min_out}
                      avgForScam={8.6}
                      avgForLegit={2.0}
                    />
                  </Paper>
                </Grid>
                <Grid item xs>
                  <Paper className={classes.paper}>
                    {" "}
                    <Breakdown
                      title={"First Incoming ETH Transaction"}
                      value={min_block_number_in_eth}
                      avgForScam={5446775}
                      avgForLegit={3873679}
                    />
                  </Paper>
                </Grid>
                <Grid item xs>
                  <Paper className={classes.paper}>
                    {" "}
                    <Breakdown
                      title={"Mean Incoming ETH Value"}
                      value={mean_in}
                      avgForScam={45.7}
                      avgForLegit={44.8}
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
