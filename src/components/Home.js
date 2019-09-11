import React, { Component, Fragment } from "react";

import axios from "axios";
import Web3 from "web3";

import { withStyles } from "@material-ui/core/styles";
import {
  Container,
  Fab,
  Typography,
  Grid,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "@material-ui/core";
import TrendingUp from "@material-ui/icons/TrendingUpRounded";
import ExpandMoreIcon from "@material-ui/icons/ExpandMoreRounded";

import Navbar from "./Navbar";
import Loader from "./Loader";

const styles = theme => ({
  fabIcon: {
    marginRight: theme.spacing(1)
  },
  gutterBottom: {
    marginBottom: theme.spacing(3)
  }
});

class Home extends Component {
  state = {
    allPeers: null,
    allRules: {}
  };

  async componentDidMount() {
    this.fetchPeers();
  }

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

  handleClick = async (e, peerContractAddress) => {
    console.log("fetching rules");
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
    // var peerContract = new web3.eth.Contract(abi, peerContractAddress);

    // var rules = await peerContract.methods.rules.call();
    // console.log(rules);
  };

  dataLoaded = () => {
    return Boolean(this.state.allPeers);
  };

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
            className={classes.gutterBottom}
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
          {this.dataLoaded() ? (
            <Fragment>
              {this.state.allPeers.map(peer => (
                <ExpansionPanel
                  key={peer.id}
                  onClick={this.handleClick.bind(this, peer.peerContract)}
                >
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{peer.peerContract}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography variant="body1">
                      Owner: {peer.peerContractOwner}
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              ))}
            </Fragment>
          ) : (
            <Loader />
          )}
        </Container>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Home);
