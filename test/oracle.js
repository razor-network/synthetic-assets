/* global contract, it, artifacts, assert, web3 */
/* jshint esversion: 8 */

// const { assertRevert } = require('./helpers/assertRevert')
let CDP = artifacts.require('./CDP.sol')
let Oracle = artifacts.require('./Oracle.sol')
// let SimpleToken = artifacts.require('./SimpleToken.sol')
// let Random = artifacts.require('./lib/Random.sol')
let Web3 = require('web3')
// let merkle = require('@razor-network/merkle')

contract('CDP', function (accounts) {
  contract('Oracle', function () {
    it('should be able to request', async function () {
      // console.log(web3i.eth.accounts)

      let oracle = await Oracle.deployed()
      // let sch = await SimpleToken.deployed()
      let url = 'goog.com'
      let selector = 'loleverything'
      let id = '0x0000000000000000000000000000000000000000'
      oracle.request(id, url, selector)

      // let address  = await cdp.contracts('0x0')
      // console.log(address)
    
    })


 it('should be able to fulfil', async function () {
      // console.log(web3i.eth.accounts)

      let oracle = await Oracle.deployed()
      // let sch = await SimpleToken.deployed()
    
      let id = '0x0000000000000000000000000000000000000000'
      let value = '888'
      oracle.fulfil(id, value)

    
    })

    })})
