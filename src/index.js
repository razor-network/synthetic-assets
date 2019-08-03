const Web3 = require('web3')

const OracleBuild = require('../build/contracts/Oracle.json')
const web3 = new Web3('ws://localhost:8545')

const Oracle = new web3.eth.Contract(OracleBuild.abi, OracleBuild.networks['420'].address)

Oracle.events.Requested(function (err, event) {
  if (err) {
    return
  }

  console.log(event)
})
