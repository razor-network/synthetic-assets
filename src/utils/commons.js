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
  const id = web3.utils.sha3(url + selector)

  const accounts = await web3.eth.getAccounts()

  const res = await Oracle.methods.request(id, url, selector).send({
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
