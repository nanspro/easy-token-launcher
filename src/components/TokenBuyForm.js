import React, { Component, Fragment } from "react";

import Web3 from "web3";

import { withStyles } from "@material-ui/core/styles";
import { Container, TextField, Grid, Typography, Fab } from "@material-ui/core";
import ShopIcon from "@material-ui/icons/ShopRounded";
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

class TokenBuyForm extends Component {
  state = {
    takerAmount: "",
    makerAmount: "",
    takerToken: "0xCC1CBD4f67cCeb7c001bD4aDF98451237a193Ff8",
    makerToken: "0x662469f56080c807250216e1fa8c68EA9e63EC79",
    maxTakerAmount: null,
    maxMakerAmount: null,
    user: null,
    isBuyingToken: false
  };

  async componentDidMount() {
    const { takerToken, makerToken } = this.props.match.params;
    if (Web3.utils.isAddress(takerToken) && Web3.utils.isAddress(makerToken)) {
      this.setState({ takerToken, makerToken });
    }
    if (window.ethereum) {
      if (window.ethereum.selectedAddress) {
        this.setState({ user: window.ethereum.selectedAddress });
      }
    } else {
      console.error("Install/Update MetaMask");
    }
    var maxQuotes = await this.getMaxQuote();
    this.setState({
      maxTakerAmount: maxQuotes[0],
      maxMakerAmount: maxQuotes[1]
    });
  }

  sleep = milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

  handleChange = async e => {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === "makerAmount") {
      var takerAmount = await this.getTakerAmount(Number(e.target.value));
      this.setState({ takerAmount });
    } else if (e.target.name === "takerAmount") {
      var makerAmount = await this.getMakerAmount(Number(e.target.value));
      this.setState({ makerAmount });
    }
  };

  getMakerAmount = async takerAmount => {
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
    var peerContract = new web3.eth.Contract(
      abi,
      "0xca91ce732b719e86712c66d706d2a1fc85c35297"
    );
    return await peerContract.methods
      .getMakerSideQuote(
        takerAmount,
        "0xCC1CBD4f67cCeb7c001bD4aDF98451237a193Ff8",
        "0x662469f56080c807250216e1fa8c68EA9e63EC79"
      )
      .call();
  };

  getTakerAmount = async makerAmount => {
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
    var peerContract = new web3.eth.Contract(
      abi,
      "0xca91ce732b719e86712c66d706d2a1fc85c35297"
    );
    return await peerContract.methods
      .getTakerSideQuote(
        makerAmount,
        "0x662469f56080c807250216e1fa8c68EA9e63EC79",
        "0xCC1CBD4f67cCeb7c001bD4aDF98451237a193Ff8"
      )
      .call();
  };

  getMaxQuote = async () => {
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
    var peerContract = new web3.eth.Contract(
      abi,
      "0xca91ce732b719e86712c66d706d2a1fc85c35297"
    );
    return await peerContract.methods
      .getMaxQuote(
        "0xCC1CBD4f67cCeb7c001bD4aDF98451237a193Ff8",
        "0x662469f56080c807250216e1fa8c68EA9e63EC79"
      )
      .call();
  };

  buyToken = async () => {};

  dataLoaded = () => {
    return (
      Boolean(this.state.user) &&
      Boolean(this.state.maxMakerAmount) &&
      Boolean(this.state.maxTakerAmount)
    );
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
                  Buy Tokens
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  disabled
                  label="Taker Token"
                  value={this.state.takerToken}
                  className={classes.textFields}
                  variant="outlined"
                />
                <TextField
                  disabled
                  label="Maker Token"
                  value={this.state.makerToken}
                  className={classes.textFields}
                  variant="outlined"
                />
                <TextField
                  label="Taker Amount"
                  name="takerAmount"
                  value={this.state.takerAmount}
                  onChange={this.handleChange}
                  className={classes.textFields}
                  variant="outlined"
                  placeholder={this.state.maxTakerAmount}
                  error={
                    Number(this.state.takerAmount) > this.state.maxTakerAmount
                  }
                  helperText={
                    Number(this.state.takerAmount) >
                      this.state.maxTakerAmount && "Maximum value exceeded"
                  }
                />
                <TextField
                  label="Maker Amount"
                  name="makerAmount"
                  value={this.state.makerAmount}
                  onChange={this.handleChange}
                  className={classes.lastTextField}
                  variant="outlined"
                  placeholder={this.state.maxMakerAmount}
                  error={
                    Number(this.state.makerAmount) > this.state.maxMakerAmount
                  }
                  helperText={
                    Number(this.state.makerAmount) >
                      this.state.maxMakerAmount && "Maximum value exceeded"
                  }
                />
              </Grid>
              <Grid item>
                <Fab variant="extended" color="primary" onClick={this.buyToken}>
                  {!this.state.isLaunchingToken ? (
                    <Fragment>
                      <ShopIcon className={classes.fabIcon} />
                      Buy
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

export default withStyles(styles)(TokenBuyForm);
