import Vue from 'vue'
import Web3 from 'web3'

import OracleBuild from '../../build/contracts/Oracle.json'

let web3

if (window.web3) {
  web3 = new Web3(window.web3.currentProvider)
} else {
  web3 = new Web3('ws://localhost:8545')
}

export const Oracle = new web3.eth.Contract(OracleBuild.abi, OracleBuild.networks['420'].address)
export const EventBus = new Vue()
export const request = async (url, selector) => {
  const id = web3.utils.soliditySha3(`${url},${selector}`)

  const accounts = await web3.eth.getAccounts()

  const res = await Oracle.methods.request(url, selector).send({
    from: accounts[0]
  })

  return {
    id,
    tx: res.transactionHash
  }
}
export const read = async (id) => {
  return Oracle.methods.read(id).call()
}
export const mint = async (url, selector, value) => {
  const accounts = await web3.eth.getAccounts()
  const _1e8 = new web3.utils.BN('1000000000000000000')
  const wei = _1e8.mul(new web3.utils.BN(value))

  const res = await Oracle.methods.mint(url, selector).send({
    from: accounts[0],
    value: wei
  })

  return {
    tx: res.transactionHash
  }
}
