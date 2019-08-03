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
 it('should be able to mint', async function () {
      // console.log(web3i.eth.accounts)

      let cdp = await CDP.deployed()

      let oracle = await Oracle.deployed()
      console.log('addre',oracle.address)
		await cdp.constructory(oracle.address)
      let url = 'goog.com'
      let selector = 'loleverything'
      let id = await web3.utils.soliditySha3({type:"string", value:url},{type:"string",value:selector});
      console.log('id lol', id)
      let value = 888
      let eth = 888
      await oracle.request(url, selector)
      await oracle.fulfil(id, value)
      await cdp.mint(url, selector,  {value: eth, from: accounts[0]})
      assert(1==2)
    
    })

    it('should be able to get contract address', async function () {
      // console.log(web3i.eth.accounts)

      let cdp = await CDP.deployed()
      // let sch = await SimpleToken.deployed()

      let address  = await cdp.contracts('0x0')
      console.log(address)
    
    })
})
})
