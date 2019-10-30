import Vue from 'vue'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'

import JobManagerBuild from '../../build/contracts/JobManager.json'
import DelegatorBuild from '../../build/contracts/Delegator.json'
import CDPFactoryBuild from '../../build/contracts/CDPFactory.json'
import SimpleTokenBuild from '../../build/contracts/SimpleToken.json'

let web3
let accounts

let networkId = 5

// let error
// let ethereum

let _1e18 = new BigNumber('1000000000000000000')
let Oracle
let CDPFactory
// let warning = false
export const enableEth = async () => {
  if (typeof window.ethereum === 'undefined'
    || typeof window.web3 === 'undefined') {
    alert('Browser does not support ethereum. Consider installing metamask!')
    return false
  } else {
    // In the case the user has MetaMask installed, you can easily
    // ask them to sign in and reveal their accounts:
    accounts = await window.ethereum.enable()
    web3 = new Web3(window.web3.currentProvider)

    // _1e18 = new web3.utils.BN('1000000000000000000')
    Oracle = new web3.eth.Contract(JobManagerBuild.abi, DelegatorBuild.networks[networkId].address)
    CDPFactory = new web3.eth.Contract(CDPFactoryBuild.abi, CDPFactoryBuild.networks[networkId].address)

    return true
  }
}

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

export const getNetwork = async() => {
  let id = await web3.eth.net.getId()
  if (id !== 5) return true
  return false
}

export const getContractAddress = (assetId) => {
  return CDPFactory.methods.contracts(assetId).call()
}
export const read = async (id) => {
  return Oracle.methods.getResult(id).call()
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

  return value
}

export const mint = async (jobId, value) => {
  value = new BigNumber(value).times(_1e18)
  value = value.toFixed()
  console.log('valllllue', value)
  // value = new web3.utils.BN(value)

  // value = _1e18.mul(value)
  const accounts = await web3.eth.getAccounts()

  const res = await CDPFactory.methods.mint(jobId).send({
    from: accounts[0],
  value})

  return {
    tx: res.transactionHash
  }
}
export const transfer = async (erc20Address, address, value) => {
  value = new BigNumber(value).times(_1e18)
  value = value.toFixed()
  console.log('valllllue', value)
  // value = new web3.utils.BN(value)

  // value = _1e18.mul(value)
  const accounts = await web3.eth.getAccounts()
  const SimpleToken = new web3.eth.Contract(SimpleTokenBuild.abi, erc20Address)

  const res = await SimpleToken.methods.transfer(address, value).send({
  from: accounts[0]})

  return {
    tx: res.transactionHash
  }
}

export const draw = async (jobId, value) => {
  // amount = String(Number(amount) * 1000000000000000000)
  console.log('valllllue', value)
  value = new BigNumber(value).times(_1e18)
  console.log('valllllue', value)
  value = value.toFixed()
  console.log('valllllue', value)
  // value = new web3.utils.BN(value)
  // console.log('valllllue', value)
  // console.log('amount', amount)
  // amount = new web3.utils.BN(amount)

  // value = _1e18.mul(value)
  const accounts = await web3.eth.getAccounts()

  const res = await CDPFactory.methods.draw(jobId, value).send({
  from: accounts[0]})

  return {
    tx: res.transactionHash
  }
}

export const collateralize = async (jobId, value) => {
  value = new BigNumber(value).times(_1e18)
  value = value.toFixed()
  console.log('valllllue', value)
  value = new web3.utils.BN(value)

  // value = _1e18.mul(value)
  const accounts = await web3.eth.getAccounts()

  const res = await CDPFactory.methods.increaseCollateral(jobId).send({
    from: accounts[0],
  value})

  return {
    tx: res.transactionHash
  }
}
export const burn = async (jobId, erc20Address) => {
  // let tokens = await balanceOf
  const accounts = await web3.eth.getAccounts()
  console.log('current account', accounts[0])
  let tokens = await balanceOf(erc20Address)
  console.log('burning', tokens)
  tokens = tokens.toString()

  const SimpleToken = new web3.eth.Contract(SimpleTokenBuild.abi, erc20Address)

  await SimpleToken.methods.approve(CDPFactoryBuild.networks[networkId].address, tokens).send({
    from: accounts[0]
  })

  const res = await CDPFactory.methods.burn(jobId).send({
    from: accounts[0]
  })

  return {
    tx: res.transactionHash
  }
}
