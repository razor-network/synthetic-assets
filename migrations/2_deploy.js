/* global artifacts */

const Oracle = artifacts.require('./Oracle.sol')
const CDPFactory = artifacts.require('./CDPFactory.sol')

module.exports = async function (deployer) {
  deployer.deploy(Oracle).then(async function (oracle) {
  	await deployer.deploy(CDPFactory, oracle.address)
    let cdp = await CDPFactory.deployed()
    await cdp.constructory(oracle.address)
  })
}
