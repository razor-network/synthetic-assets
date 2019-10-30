/* global artifacts */

// const Oracle = artifacts.require('./Oracle.sol')
const CDPFactory = artifacts.require('./CDPFactory.sol')

module.exports = async function (deployer) {
  // deployer.deploy(Oracle).then(async function (oracle) {
  await deployer.deploy(CDPFactory)
  let cdp = await CDPFactory.deployed()
  // delegator address
  await cdp.init('0x4Bcd81d77Bb9d7493F99742b49B072c09D548CB4')
}
