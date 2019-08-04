npm install @openzeppelin/contracts
npm i
ganache-cli -i 420
truffle build
$ FROM_ADDRESS=0x4087eAD4fA7F08fDc8619d890207B88F925B1703 ./bin/oracle

$ npm run serve


With our project, you can tokenize any asset in the world which has a public price feed. Be it Tesla stock, Indian rupees stablecoin, Oil price, etc. This simply wasn't possible yesterday. Today it is.

In short, our product allows you to create synthetic assets, using any price feed you specify.

We personally wanted to buy Tesla stock and have been trying to for more than a year, but couldnt find a practical and cheap way to do it. So we built it.

The product can utilize any oracle (such as Razor.network) to fetch a price from a price feed and create a CDP. The CDP is collateralized by ETH and mints synthetic tokens pegged to the provided pricefeed.

The tokens are ERC20 tokens freely tradeable on any dex. A URL and a selector has a unique assetID and a token contract.


e.g. to short TSLA,
1. Provide pricefeed of TSLA along with the JSON selector.
2. Click mint to create a CDP collateralized by ETH
3. Sell the minted tokens in open market.
4. to close the position, buy tokens in open market and close the CDP.

To long TSLA,

1. buy the TSLA synthetic tokens on open market.
2. to close position, sell TSLA tokens on open market
