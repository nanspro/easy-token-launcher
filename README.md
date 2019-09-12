## Easy-Token-Launcher

### Problem with current model of ICO

ICOS are losing their luster, leading many to question whether token sales for decentralized networks have a future at all. 80% of the ICOs were reported as scams last year causing reputation damage to this model and also to the network on which they were using.

SEC recently announced their new [framework](https://www.sec.gov/corpfin/framework-investment-contract-analysis-digital-assets) on digital asset sales and that looks very promising. Now, a decentralized, transparent and responsible way is immediately required so that organisations can distribute their tokens.

### What we are trying to do

Easy-Token-launcher aims to be a platform where orgs can launch and then distribute their tokens automatically. Rules for distribution are specified on a smart contract and then according to that rules the whole distribution takes place. This removes the non-transparency that current token launches faces and increases trust among token holders for that community.

### How it works
Our platform is powered by Airswap. Airswap is a peer to peer, decentralized network where users can exchange tokens among themselves without involving any intermediary. Airswap provides a `PeerFactory` contract which parties can use to create their `PeerContract`. One peer contract can distribute multiple tokens. 

**Launch Token**

When you click launch, our app wil check whether you have already deployed a peer or not. If not then it'll deploy a Peer first through PeerFactory and then set rules which will specify that
- Maximum how many tokens can be distributed by your deployed peer.
- Which token your peer will accept as a mode of payyment and how many tokens will you receive for that.

**View Launches**

Whenever a user logins, he can see all the exisiting launches in the market. He can see their owner, price, tokens offered etc.

**Buy/Sell Token**

A user after choosing a token launch can either buy that token for another token (accepted by that Peer) or sell that token for corresponding token.


### Setting up development environment

#### Prerequisites
- `yarn`
- `node` and `npm`
- MetaMask

#### Steps
```sh
$ cd easy-token-launcher
$ yarn
$ yarn start
```

### How it can be improved
