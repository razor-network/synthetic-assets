/* global artifacts */

// const Oracle = artifacts.require('./Oracle.sol')
const CDPFactory = artifacts.require('./CDPFactory.sol')

module.exports = async function (deployer) {
  // deployer.deploy(Oracle).then(async function (oracle) {
  await deployer.deploy(CDPFactory)
  let cdp = await CDPFactory.deployed()
  // delegator address
  await cdp.init('0x058EF5a3d450A2fac5d24dDc75d516A136AE3f62')
}
