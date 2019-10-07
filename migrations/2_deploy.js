/* global artifacts */

// const Oracle = artifacts.require('./Oracle.sol')
const CDPFactory = artifacts.require('./CDPFactory.sol')

module.exports = async function (deployer) {
  // deployer.deploy(Oracle).then(async function (oracle) {
  await deployer.deploy(CDPFactory)
  let cdp = await CDPFactory.deployed()
  await cdp.init('0x73f1F92d27549be686AF027679186739dA82B691')
}
