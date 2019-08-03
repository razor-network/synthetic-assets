/* global contract, it, artifacts, assert, web3 */
/* jshint esversion: 8 */

// const { assertRevert } = require('./helpers/assertRevert')
let CDPFactory = artifacts.require('./CDPFactory.sol')
let Oracle = artifacts.require('./Oracle.sol')
let SimpleToken = artifacts.require('./SimpleToken.sol')
// let Random = artifacts.require('./lib/Random.sol')
let Web3 = require('web3')
// let merkle = require('@razor-network/merkle')

contract('CDPFactory', function (accounts) {
  contract('Oracle', function () {
 it('should be able to mint', async function () {
      // console.log(web3i.eth.accounts)

      let cdp = await CDPFactory.deployed()

      let oracle = await Oracle.deployed()
      console.log('addre',oracle.address)
		await cdp.constructory(oracle.address)
      let url = 'goog.com'
      let selector = 'loleverything'
      let id = await web3.utils.soliditySha3({type:"string", value:url},{type:"string",value:selector});
      console.log('id lol', id)
      let value = new web3.utils.BN('2')
      // console.log('value', value)
      let eth = new web3.utils.BN('1000000000000000000')
      let expectedBalance = new web3.utils.BN('2000000000000000000')
      await oracle.request(url, selector)
      await oracle.fulfil(id, value)
      await cdp.mint(url, selector,  {value: eth, from: accounts[0]})
      let cdpId = web3.utils.soliditySha3(accounts[0], id)
      console.log('cdpId', cdpId)
      await cdp.mint(url, selector,  {value: eth, from: accounts[1]})
	  let address = await cdp.contracts(id)
	  console.log('address', address)
	  assert(address !== '0x0000000000000000000000000000000000000000')
	  st = await SimpleToken.at(address)
	  console.log('st', Number(await st.balanceOf(accounts[0])))
	  assert((await st.balanceOf(accounts[0])).cmp(expectedBalance) ===0)
	  cdpIdCreated = await cdp.cdps(cdpId)
	  console.log('collateral',Number(cdpIdCreated.collateral))
	  assert(cdpId === cdpIdCreated.id)
	  // assert(false)
    })

 it('should be able to mint again', async function () {
      // console.log(web3i.eth.accounts)

      let cdp = await CDPFactory.deployed()

      let oracle = await Oracle.deployed()
      console.log('addre',oracle.address)
		await cdp.constructory(oracle.address)
      let url = 'goog.com'
      let selector = 'loleverything'
      let id = await web3.utils.soliditySha3({type:"string", value:url},{type:"string",value:selector});
      console.log('id lol', id)
      let value = new web3.utils.BN('2')
      // console.log('value', value)
      let eth = new web3.utils.BN('1000000000000000000')
      let expectedBalance = new web3.utils.BN('4000000000000000000')
      await oracle.request(url, selector)
      await oracle.fulfil(id, value)
      await cdp.mint(url, selector,  {value: eth, from: accounts[0]})
      let cdpId = web3.utils.soliditySha3(accounts[0], id)
      console.log('cdpId', cdpId)
     
	  let address = await cdp.contracts(id)    
	  console.log('address', address)
	  assert(address !== '0x0000000000000000000000000000000000000000')
	  st = await SimpleToken.at(address)
	  console.log('st', Number(await st.balanceOf(accounts[0])))
	  assert((await st.balanceOf(accounts[0])).cmp(expectedBalance) ===0)
	  cdpIdCreated = await cdp.cdps(cdpId)
	  console.log('collateral',Number(cdpIdCreated.collateral))
	  assert(cdpId === cdpIdCreated.id)
	  // assert(false)
    })

  it('should be able to burn', async function () {
      // console.log(web3i.eth.accounts)

      let cdp = await CDPFactory.deployed()

      let oracle = await Oracle.deployed()
      console.log('addre',oracle.address)
      await cdp.constructory(oracle.address)
      let url = 'goog.com'
      let selector = 'loleverything'
      let id = await web3.utils.soliditySha3({type:"string", value:url},{type:"string",value:selector});
      console.log('id lol', id)
      let value = new web3.utils.BN('2')
      let eth = new web3.utils.BN('1000000000000000000')
      await oracle.request(url, selector)
      await oracle.fulfil(id, value)
      let price=  await oracle.read(id)
      console.log('price', Number(price))
	  let address = await cdp.contracts(id)
	  console.log('address', address)
       st = await SimpleToken.at(address)
       await st.approve(cdp.address, new web3.utils.BN('2000000000000000000'))

      let cdpId = web3.utils.soliditySha3(accounts[0], id)
      let thiscdp = await cdp.cdps(cdpId)
      console.log('collateral before burn',Number(thiscdp.collateral) )

      let balanceBefore = Number(await web3.eth.getBalance(accounts[0]))
      console.log('balanceBefore',balanceBefore)
      let tx = await cdp.burn(id, new web3.utils.BN('2000000000000000000'))
      // console.log(tx)
      console.log('balanceAfter' , Number(await web3.eth.getBalance(accounts[0])))
      console.log('difference' , Number(await web3.eth.getBalance(accounts[0])) - balanceBefore )
      cdpId = web3.utils.soliditySha3(accounts[0], id)
      thiscdp = await cdp.cdps(cdpId)
      console.log('collateral afterburn',Number(thiscdp.collateral) )
      assert((thiscdp.collateral).cmp(new web3.utils.BN('1000000000000000000')) ===0)
      // assert(Number(await web3.eth.getBalance(accounts[0])) === balanceBefore + 1)
	  // assert(address !== '0x0000000000000000000000000000000000000000')

	  // // console.log('st',st)
	  // assert(Number(await st.balanceOf(accounts[0])) ===1)
    })

    it('should be able to liquidate', async function () {
      // console.log(web3i.eth.accounts)

      let cdp = await CDPFactory.deployed()

      let oracle = await Oracle.deployed()
      console.log('addre',oracle.address)
      await cdp.constructory(oracle.address)
      let url = 'goog.com'
      let selector = 'loleverything'
      let id = await web3.utils.soliditySha3({type:"string", value:url},{type:"string",value:selector});
      let cdpId = web3.utils.soliditySha3(accounts[1],id )
      let thiscdp = await cdp.cdps(cdpId)
      console.log('collateral before', Number(thiscdp.collateral))
      console.log('id lol', id)
      let value = new web3.utils.BN('2000000000000000000')
      // let eth = new web3.utils.BN('1000000000000000000')
      await oracle.request(url, selector)
      await oracle.fulfil(id, value)
      let price=  await oracle.read(id)
      console.log('price', Number(price))
	  let address = await cdp.contracts(id)
	  console.log('address', address)
       st = await SimpleToken.at(address)
       // await st.approve(cdp.address, 1)

      // let balanceBefore = Number(await st.balanceOf(accounts[1]))
      // console.log('balanceBefore',balanceBefore)
      console.log('cdpId', cdpId)
      let tx = await cdp.liquidate(cdpId)
      thiscdp = await cdp.cdps(cdpId)
            console.log('collateral after', Number(thiscdp.collateral))

      assert(Number(thiscdp.collateral) === 0)
      // console.log(Number(thiscdp.collateral))
      // assert(false)
      // console.log(tx)
      // console.log('balanceAfter' , Number(await web3.eth.getBalance(accounts[0])))
      // console.log('difference' , Number(await web3.eth.getBalance(accounts[0])) - balanceBefore )
      // assert(Number(await web3.eth.getBalance(accounts[0])) === balanceBefore + 1)
	  // assert(address !== '0x0000000000000000000000000000000000000000')

	  // // console.log('st',st)
	  // assert(Number(await st.balanceOf(accounts[0])) ===1)
    })

  //   it('should be able to get contract address', async function () {
  //     // console.log(web3i.eth.accounts)

  //     let cdp = await CDPFactory.deployed()
  //     // let sch = await SimpleToken.deployed()

  //     let address  = await cdp.contracts('0x0')
  //     assert(address ==='0x0000000000000000000000000000000000000000')

  //   })
})
})
