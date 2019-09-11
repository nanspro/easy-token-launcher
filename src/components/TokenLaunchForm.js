import React, { Component, Fragment } from "react";

import axios from "axios";
import Web3 from "web3";

import { withStyles } from "@material-ui/core/styles";
import { Container, TextField, Grid, Typography, Fab } from "@material-ui/core";
import TrendingUp from "@material-ui/icons/TrendingUpRounded";
import CircularProgress from "@material-ui/core/CircularProgress";

import Navbar from "./Navbar";
import Loader from "./Loader";

const styles = theme => ({
  textFields: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  lastTextField: {
    width: "100%"
  },
  fabIcon: {
    marginRight: theme.spacing(1),
    color: "#fff"
  }
});

class TokenLaunchForm extends Component {
  state = {
    takerToken: "0xCC1CBD4f67cCeb7c001bD4aDF98451237a193Ff8",
    makerToken: "0x662469f56080c807250216e1fa8c68EA9e63EC79",
    maxTakerAmount: "10",
    priceCoeff: "5",
    priceExp: "1",
    allPeers: null,
    user: null,
    isPeerDeployed: false,
    peerContract: null,
    isLaunchingToken: false
  };

  async componentDidMount() {
    if (window.ethereum) {
      if (window.ethereum.selectedAddress) {
        this.setState({ user: window.ethereum.selectedAddress });
      }
    } else {
      console.error("Install/Update MetaMask");
    }
    await this.fetchPeers();
    for (var peer of this.state.allPeers) {
      if (peer.peerContractOwner === this.state.user) {
        this.setState({
          isPeerDeployed: true,
          peerContract: peer.peerContract
        });
      }
    }
  }

  sleep = milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  fetchPeers = async () => {
    console.log("fetching peers from graph");
    var response = await axios.post(
      "https://api.thegraph.com/subgraphs/name/nanspro/airswappeerfactory",
      {
        query: `
            {
              createPeers(first: 100) {
                id
                peerContract
                swapContract
                peerContractOwner
              }
            }
          `
      }
    );
    this.setState({ allPeers: response.data.data.createPeers });
  };

  deployPeer = async () => {
    console.log("deploying peer");
    var web3 = new Web3(window.ethereum);
    var abi = [
      {
        constant: true,
        inputs: [{ name: "_locator", type: "bytes32" }],
        name: "has",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_swapContract", type: "address" },
          { name: "_peerContractOwner", type: "address" }
        ],
        name: "createPeer",
        outputs: [{ name: "peerContractAddress", type: "address" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "peerContract", type: "address" },
          { indexed: false, name: "swapContract", type: "address" },
          { indexed: true, name: "peerContractOwner", type: "address" }
        ],
        name: "CreatePeer",
        type: "event"
      }
    ];
    var peerFactory = new web3.eth.Contract(
      abi,
      "0x53d47a69A506Ceb97D5cafD93bab76bfFBA0B055" // peer factory
    );
    await peerFactory.methods
      .createPeer(
        "0x6f337bA064b0a92538a4AfdCF0e60F50eEAe0D5B", // swap contract
        this.state.user
      )
      .send({
        from: this.state.user,
        value: 0
      });
    await this.sleep(5000);
    await this.fetchPeers();
  };

  setRules = async () => {
    console.log("setting rules");
    var web3 = new Web3(window.ethereum);
    var abi = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: "takerToken",
            type: "address"
          },
          {
            indexed: false,
            name: "makerToken",
            type: "address"
          },
          {
            indexed: false,
            name: "maxTakerAmount",
            type: "uint256"
          },
          {
            indexed: false,
            name: "priceCoef",
            type: "uint256"
          },
          {
            indexed: false,
            name: "priceExp",
            type: "uint256"
          }
        ],
        name: "SetRule",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: "takerToken",
            type: "address"
          },
          {
            indexed: false,
            name: "makerToken",
            type: "address"
          }
        ],
        name: "UnsetRule",
        type: "event"
      },
      {
        constant: false,
        inputs: [
          {
            name: "",
            type: "address"
          },
          {
            name: "",
            type: "address"
          }
        ],
        name: "rules",
        outputs: [
          {
            components: [
              {
                name: "maxTakerAmount",
                type: "uint256"
              },
              {
                name: "priceCoef",
                type: "uint256"
              },
              {
                name: "priceExp",
                type: "uint256"
              }
            ],
            name: "",
            type: "tuple"
          }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            name: "_takerToken",
            type: "address"
          },
          {
            name: "_makerToken",
            type: "address"
          },
          {
            name: "_maxTakerAmount",
            type: "uint256"
          },
          {
            name: "_priceCoef",
            type: "uint256"
          },
          {
            name: "_priceExp",
            type: "uint256"
          }
        ],
        name: "setRule",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            name: "_takerToken",
            type: "address"
          },
          {
            name: "_makerToken",
            type: "address"
          }
        ],
        name: "unsetRule",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [
          {
            name: "_takerParam",
            type: "uint256"
          },
          {
            name: "_takerToken",
            type: "address"
          },
          {
            name: "_makerToken",
            type: "address"
          }
        ],
        name: "getMakerSideQuote",
        outputs: [
          {
            name: "makerParam",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [
          {
            name: "_makerParam",
            type: "uint256"
          },
          {
            name: "_makerToken",
            type: "address"
          },
          {
            name: "_takerToken",
            type: "address"
          }
        ],
        name: "getTakerSideQuote",
        outputs: [
          {
            name: "takerParam",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [
          {
            name: "_takerToken",
            type: "address"
          },
          {
            name: "_makerToken",
            type: "address"
          }
        ],
        name: "getMaxQuote",
        outputs: [
          {
            name: "takerParam",

            type: "uint256"
          },
          {
            name: "makerParam",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            components: [
              {
                name: "nonce",
                type: "uint256"
              },
              {
                name: "expiry",
                type: "uint256"
              },
              {
                components: [
                  {
                    name: "wallet",
                    type: "address"
                  },
                  {
                    name: "token",
                    type: "address"
                  },
                  {
                    name: "param",
                    type: "uint256"
                  },
                  {
                    name: "kind",
                    type: "bytes4"
                  }
                ],
                name: "maker",
                type: "tuple"
              },
              {
                components: [
                  {
                    name: "wallet",
                    type: "address"
                  },
                  {
                    name: "token",
                    type: "address"
                  },
                  {
                    name: "param",
                    type: "uint256"
                  },
                  {
                    name: "kind",
                    type: "bytes4"
                  }
                ],
                name: "taker",
                type: "tuple"
              },
              {
                components: [
                  {
                    name: "wallet",
                    type: "address"
                  },
                  {
                    name: "token",
                    type: "address"
                  },
                  {
                    name: "param",
                    type: "uint256"
                  },
                  {
                    name: "kind",
                    type: "bytes4"
                  }
                ],
                name: "affiliate",
                type: "tuple"
              },
              {
                components: [
                  {
                    name: "signer",
                    type: "address"
                  },
                  {
                    name: "v",
                    type: "uint8"
                  },
                  {
                    name: "r",
                    type: "bytes32"
                  },
                  {
                    name: "s",
                    type: "bytes32"
                  },
                  {
                    name: "version",
                    type: "bytes1"
                  }
                ],
                name: "signature",
                type: "tuple"
              }
            ],
            name: "_order",
            type: "tuple"
          }
        ],
        name: "provideOrder",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "owner",
        outputs: [
          {
            name: "",
            type: "address"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      }
    ];
    var peerContract = new web3.eth.Contract(abi, this.state.peerContract);
    await peerContract.methods
      .setRule(
        this.state.takerToken,
        this.state.makerToken,
        Number(this.state.maxTakerAmount),
        Number(this.state.priceCoeff),
        Number(this.state.priceExp)
      )
      .send({
        from: this.state.user,
        value: 0
      });
  };

  launchToken = async () => {
    this.setState({ isLaunchingToken: true }, async () => {
      if (!this.state.isPeerDeployed) {
        await this.deployPeer();
      } else {
        console.log("peer contract is deployed at", this.state.peerContract);
      }
      await this.setRules();
      console.log("launched");
      this.setState({ isLaunchingToken: false }, () => {
        this.props.history.push("/");
      });
    });
  };

  dataLoaded = () => {
    return Boolean(this.state.allPeers) && Boolean(this.state.user);
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Navbar />
        {this.dataLoaded() ? (
          <Container maxWidth="md">
            <Grid
              container
              direction="column"
              alignItems="center"
              justify="center"
              spacing={3}
            >
              <Grid item>
                <Typography variant="h5" align="center">
                  Launch Tokens
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  label="Taker Token Contract Address"
                  name="takerToken"
                  value={this.state.takerToken}
                  onChange={this.handleChange}
                  className={classes.textFields}
                  variant="outlined"
                  placeholder="0x..."
                />
                <TextField
                  label="Maker Token Contract Address"
                  name="makerToken"
                  value={this.state.makerToken}
                  onChange={this.handleChange}
                  className={classes.textFields}
                  variant="outlined"
                  placeholder="0x..."
                />
                <TextField
                  label="Maximum Taker Amount"
                  name="maxTakerAmount"
                  value={this.state.maxTakerAmount}
                  onChange={this.handleChange}
                  className={classes.textFields}
                  variant="outlined"
                  placeholder="10000"
                />
                <TextField
                  label="Price Coefficient"
                  name="priceCoeff"
                  value={this.state.priceCoeff}
                  onChange={this.handleChange}
                  className={classes.textFields}
                  variant="outlined"
                  placeholder="330"
                />
                <TextField
                  label="Price Exponent"
                  name="priceExp"
                  value={this.state.priceExp}
                  onChange={this.handleChange}
                  className={classes.lastTextField}
                  variant="outlined"
                  placeholder="2"
                />
              </Grid>
              <Grid item>
                <Fab
                  variant="extended"
                  color="primary"
                  onClick={this.launchToken}
                >
                  {!this.state.isLaunchingToken ? (
                    <Fragment>
                      <TrendingUp className={classes.fabIcon} />
                      Launch
                    </Fragment>
                  ) : (
                    <Fragment>
                      <CircularProgress className={classes.fabIcon} size={20} />
                      Please Wait...
                    </Fragment>
                  )}
                </Fab>
              </Grid>
            </Grid>
          </Container>
        ) : (
          <Loader />
        )}
      </Fragment>
    );
  }
}

export default withStyles(styles)(TokenLaunchForm);
