import Vue from 'vue'
import Web3 from 'web3'
import BN from 'bignumber.js'

import JobManagerBuild from '../../build/contracts/JobManager.json'
import DelegatorBuild from '../../build/contracts/Delegator.json'
import CDPFactoryBuild from '../../build/contracts/CDPFactory.json'
import SimpleTokenBuild from '../../build/contracts/SimpleToken.json'

let web3

if (window.web3) {
  web3 = new Web3(window.web3.currentProvider)
} else {
  web3 = new Web3('ws://localhost:8545')
}

let networkId = '4'

const _1e18 = new web3.utils.BN('1000000000000000000')
export const Oracle = new web3.eth.Contract(JobManagerBuild.abi, DelegatorBuild.networks[networkId].address)
export const CDPFactory = new web3.eth.Contract(CDPFactoryBuild.abi, CDPFactoryBuild.networks[networkId].address)

export const EventBus = new Vue()
// export const request = async (jobId) => {
//   const res = await Oracle.methods.getJob(jobId).call()
//   const id = web3.utils.soliditySha3(res.url, res.selector)

// const accounts = await web3.eth.getAccounts()

// return {
// id,
// tx: res.transactionHash
// }
// }
export const getContractAddress = (assetId) => {
  return CDPFactory.methods.contracts(assetId).call()
}
export const read = async (id) => {
  return Oracle.methods.getResult(id).call()
}
export const mint = async (jobId, value) => {
  value = new web3.utils.BN(value)
  value = _1e18.mul(value)
  const accounts = await web3.eth.getAccounts()

  const res = await CDPFactory.methods.mint(jobId).send({
    from: accounts[0],
  value})

  return {
    tx: res.transactionHash
  }
}
export const cdpId = async (id) => {
  const accounts = await web3.eth.getAccounts()
  return web3.utils.soliditySha3(accounts[0], id)
}
export const liquidate = async (cdpId) => {
  const accounts = await web3.eth.getAccounts()
  const res = await CDPFactory.methods.liquidate(cdpId).send({
    from: accounts[0]
  })

  return res
}
export const cdps = async (assetId) => {
  const accounts = await web3.eth.getAccounts()

  const cdpId = web3.utils.soliditySha3(accounts[0], assetId)

  const res2 = await CDPFactory.methods.cdps(cdpId).call()

  return res2
}

export const getAssetId = async (jobId) => {
  console.log('jobId', jobId)
  let res = await Oracle.methods.getJob(jobId).call()
  console.log('res', res)
  let assetId = web3.utils.soliditySha3(res.url, res.selector)
  return assetId
}
export const balanceOf = async (erc20Address) => {
  const SimpleToken = new web3.eth.Contract(SimpleTokenBuild.abi, erc20Address)

  const accounts = await web3.eth.getAccounts()

  const value = await SimpleToken.methods.balanceOf(accounts[0]).call()

  return value / 1e18
}
export const burn = async (jobId, erc20Address) => {
  let tokens = new BN('1')
  tokens = tokens.times(100e18)
  // console.log('burning', tokens)
  tokens = tokens.toString(16)

  const SimpleToken = new web3.eth.Contract(SimpleTokenBuild.abi, erc20Address)

  const accounts = await web3.eth.getAccounts()

  await SimpleToken.methods.approve(CDPFactoryBuild.networks[networkId].address, `0x${tokens}`).send({
    from: accounts[0]
  })

  const res = await CDPFactory.methods.burn(jobId).send({
    from: accounts[0]
  })

  return {
    tx: res.transactionHash
  }
}
