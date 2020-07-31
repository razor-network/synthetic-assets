/* global artifacts */

// const Oracle = artifacts.require('./Oracle.sol')
const CDPFactory = artifacts.require('./CDPFactory.sol')

module.exports = async function (deployer) {
  // deployer.deploy(Oracle).then(async function (oracle) {
  await deployer.deploy(CDPFactory)
  let cdp = await CDPFactory.deployed()
  // delegator address
  await cdp.init('0xc81e2c1836D0aaA279334C00175A4261EB18D27F')
}
