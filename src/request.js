const Web3 = require('web3')

const OracleBuild = require('../build/contracts/Oracle.json')

let web3

if (window.web3) {
  web3 = new Web3(window.web3.currentProvider)
} else {
  web3 = new Web3('ws://localhost:8545')
}


const Oracle = new web3.eth.Contract(OracleBuild.abi, OracleBuild.networks['420'].address)

const url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=E1BN9Y09VQ32BQ00'
const selector = 'Global Quote["05. price"]'
const id = web3.utils.sha3(url + selector)

async function main () {
  const res = await Oracle.methods.request(id, url, selector).send({
    from: '0x4087eAD4fA7F08fDc8619d890207B88F925B1703'
  })

  console.log(res)
}

main()
