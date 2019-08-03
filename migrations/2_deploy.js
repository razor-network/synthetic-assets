/* global artifacts */

const Oracle = artifacts.require('./Oracle.sol')
const CDP = artifacts.require('./CDP.sol')

module.exports = async function (deployer) {
  deployer.deploy(Oracle).then(async function (oracle) {
  	await deployer.deploy(CDP, oracle.address)
  })
}
