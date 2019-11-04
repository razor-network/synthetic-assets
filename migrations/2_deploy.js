/* global artifacts */

// const Oracle = artifacts.require('./Oracle.sol')
const CDPFactory = artifacts.require('./CDPFactory.sol')

module.exports = async function (deployer) {
  // deployer.deploy(Oracle).then(async function (oracle) {
  await deployer.deploy(CDPFactory)
  let cdp = await CDPFactory.deployed()
  // delegator address
  await cdp.init('0x0b59197a22bc037608a9B2f260a8696A89207578')
}
