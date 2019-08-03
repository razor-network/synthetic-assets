const Web3 = require('web3')

const OracleBuild = require('../build/contracts/Oracle.json')
const web3 = new Web3('ws://localhost:8545')

const Oracle = new web3.eth.Contract(OracleBuild.abi, OracleBuild.networks['420'].address)

const url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=E1BN9Y09VQ32BQ00'
const selector = 'Global Quote["05. price"]'
const id = web3.utils.sha3(url + selector)

async function main () {
  const res = await Oracle.methods.request(id, url, selector).send({
    from: '0x384160b7b9Ab9A9025F6163e5E1B1f2d4914DCb9'
  })

  console.log(res)
}

main()
