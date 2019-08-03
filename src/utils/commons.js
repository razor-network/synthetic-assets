import Vue from 'vue'
import Web3 from 'web3'

import OracleBuild from '../../build/contracts/Oracle.json'
import CDPFactoryBuild from '../../build/contracts/CDPFactory.json'
import SimpleTokenBuild from '../../build/contracts/SimpleToken.json'

let web3

if (window.web3) {
  web3 = new Web3(window.web3.currentProvider)
} else {
  web3 = new Web3('ws://localhost:8545')
}

const _1e18 = new web3.utils.BN('1000000000000000000')
export const Oracle = new web3.eth.Contract(OracleBuild.abi, OracleBuild.networks['420'].address)
export const CDPFactory = new web3.eth.Contract(CDPFactoryBuild.abi, CDPFactoryBuild.networks['420'].address)

export const EventBus = new Vue()
export const request = async (url, selector) => {
  const id = web3.utils.soliditySha3(url, selector)

  const accounts = await web3.eth.getAccounts()

  const res = await Oracle.methods.request(url, selector).send({
    from: accounts[0]
  })

  return {
    id,
    tx: res.transactionHash
  }
}
export const getContractAddress = (assetId) => {
  return CDPFactory.methods.contracts(assetId).call()
}
export const read = async (id) => {
  return Oracle.methods.read(id).call()
}
export const mint = async (url, selector, value) => {
  value = new web3.utils.BN(value)
  value = _1e18.mul(value)
  const accounts = await web3.eth.getAccounts()

  const res = await CDPFactory.methods.mint(url, selector).send({
    from: accounts[0],
    value
  })

  return {
    tx: res.transactionHash
  }
}
export const cdps = async (id) => {
  const accounts = await web3.eth.getAccounts()
  const cdpId = web3.utils.soliditySha3(accounts[0], id)

  const res = await CDPFactory.methods.cdps(cdpId).call()

  return res
}
export const balanceOf = async (erc20Address) => {
  const SimpleToken = new web3.eth.Contract(SimpleTokenBuild.abi, erc20Address)

  const accounts = await web3.eth.getAccounts()

  const value = await SimpleToken.methods.balanceOf(accounts[0]).call()

  return value / 1e18
}
export const burn = async (id, erc20Address, tokens) => {
  tokens = web3.utils.numberToHex(tokens * 1e18)
  const SimpleToken = new web3.eth.Contract(SimpleTokenBuild.abi, erc20Address)

  const accounts = await web3.eth.getAccounts()

  await SimpleToken.methods.approve(CDPFactoryBuild.networks['420'].address, tokens).send({
    from: accounts[0]
  })

  const res = await CDPFactory.methods.burn(id, tokens).send({
    from: accounts[0]
  })

  return {
    tx: res.transactionHash
  }
}
