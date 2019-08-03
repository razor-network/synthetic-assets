const _ = require('lodash')
const axios = require('axios')
const Web3 = require('web3')

const OracleBuild = require('../build/contracts/Oracle.json')
const web3 = new Web3('ws://localhost:8545')

const Oracle = new web3.eth.Contract(OracleBuild.abi, OracleBuild.networks['420'].address)

Oracle.events.Requested(async (err, event) => {
  if (err) {
    return
  }

  const { id, url, selector } = event.returnValues

  console.log('REQ', id, url, selector)

  const response = await axios.get(url)
  const value = Math.round(_.get(response.data, selector))

  console.log('VALUE', value)

  const res = await Oracle.methods.fulfill(id, value).send({
    from: '0x384160b7b9Ab9A9025F6163e5E1B1f2d4914DCb9'
  })

  console.log(res)
})
