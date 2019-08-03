/* global artifacts */

const Oracle = artifacts.require('./Oracle.sol')

module.exports = async function (deployer) {
  deployer.deploy(Oracle).then(async function (oracle) {})
}
