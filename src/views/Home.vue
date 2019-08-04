<template>
  <div class="mb-5">
    <div class="row row-space-4">
      <div class="col-md-6">
        <label>URL</label>
        <input class="form-control" v-model="url">
        <div class="small text-muted short mt-1" @click="url = demoUrl">Click to set {{demoUrl}}</div>
      </div>
      <div class="col-md-6">
        <label>JSON Selector</label>
        <input class="form-control" v-model="selector">
        <div class="small text-muted short mt-1" @click="selector = demoSelector">Click to set {{demoSelector}}</div>
      </div>
    </div>
    <div class="row row-space-4" v-if="assetId">
      <div class="col-md-6">
        <label>Asset ID</label>
        <input class="form-control" v-model="assetId" readonly>
      </div>
      <div class="col-md-6">
        <label>CDP ID</label>
        <input class="form-control" v-model="cdpId" readonly>
      </div>
      <div class="col-md-6">
        <label>Collateral Ratio</label>
        <input class="form-control" v-model="ratio" readonly>
      </div>
      <div class="col-md-6">
        <label>Asset Value in ETH on-chain</label>
        <div class="input-group m-0">
          <input class="form-control" v-model="valueOnChainInEth" readonly>
          <div class="input-group-append">
            <button class="btn btn-outline-primary" type="button" @click="request">Update</button>
            <button class="btn btn-outline-primary" type="button" @click="read">Read</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row row-space-4" v-if="erc20Address && erc20Address !== ZEROX">
      <div class="col-md-6">
        <label>ERC20 Contract Address</label>
        <input class="form-control" v-model="erc20Address" readonly>
      </div>
      <div class="col-md-6">
        <label>Your blance</label>

        <div class="input-group m-0">
          <input class="form-control" v-model="userErc20Balance" readonly>
          <div class="input-group-append">
            <button class="btn btn-outline-primary" type="button" @click="updateUserBalance">Refresh</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row row-space-4" v-if="erc20Address && erc20Address !== ZEROX">
      <div class="col-md-6">
        <label>Collateral</label>

        <div class="input-group m-0">
          <input class="form-control" v-model="collateral" readonly>
          <div class="input-group-append">
            <button class="btn btn-outline-primary" type="button" @click="updateCdpInfo">Refresh</button>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <label>Debt</label>

        <div class="input-group m-0">
          <input class="form-control" v-model="debt" readonly>
          <div class="input-group-append">
            <button class="btn btn-outline-primary" type="button" @click="updateCdpInfo">Refresh</button>
          </div>
        </div>
      </div>
    </div>

    <div class="row row-space-4" v-if="assetId">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-4">Mint</h4>

            <div class="mb-4">
              <label>ETH</label>
              <input class="form-control" v-model="eth" type="number">
            </div>

            <button class="btn btn-block btn-primary" @click="mint">Mint</button>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-4">Liquidate</h4>

            <button disabled class="btn btn-block btn-primary" @click="liquidate">Liquidate</button>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-4">Burn</h4>

            <div class="mb-4">
              <label># Tokens</label>
              <input class="form-control" v-model="tokens" type="number">
            </div>

            <button class="btn btn-block btn-primary" @click="burn">Burn</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3'
import BN from 'bignumber.js'
import { request, read, mint, cdps, balanceOf, burn, getContractAddress, cdpId, liquidate } from '@/utils/commons'

const ZEROX = '0x0000000000000000000000000000000000000000'

export default {
  data: function () {
    return {
      url: null,
      selector: null,
      demoUrl: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=E1BN9Y09VQ32BQ00',
      demoSelector: 'Global Quote["05. price"]',
      id: null,
      valueOnChainInEth: null,
      eth: null,
      tx: null,
      cdpResult: null,
      tokens: null,
      erc20Address: null,
      userErc20Balance: null,
      collateral: null,
      debt: null,
      ZEROX,
      cdpId: null,
      ratio: null
    }
  },
  computed: {
    assetId: function () {
      if (!(this.url && this.selector)) return
      return Web3.utils.soliditySha3(this.url, this.selector)
    }
  },
  watch: {
    assetId: async function (newValue) {
      this.read()
    }
  },
  methods: {
    updateUserBalance: async function () {
      if (!this.erc20Address || this.erc20Address === ZEROX) return

      this.userErc20Balance = (await balanceOf(this.erc20Address)) / 1e18
    },
    updateCdpInfo: async function () {
      const cdpResult = await cdps(this.assetId)

      this.collateral = cdpResult.collateral / 1e18
      this.debt = (cdpResult.debt / 1e18) / 1e18
    },
    request: async function () {
      await request(this.url, this.selector)
      this.read()
    },
    read: async function () {
      this.erc20Address = await getContractAddress(this.assetId)

      const valueOnChainInEth = await read(this.assetId)

      this.valueOnChainInEth = valueOnChainInEth / 1e18

      await this.updateUserBalance()
      await this.updateCdpInfo()

      this.cdpId = await cdpId(this.assetId)
      this.ratio = ((new BN(this.collateral).multipliedBy(this.valueOnChainInEth)).dividedBy(this.debt)).toString()
    },
    mint: async function () {
      const { tx } = await mint(this.url, this.selector, this.eth)

      this.tx = tx

      this.read()
    },
    cdps: async function () {
      const cdpResult = await cdps(this.assetId)
      const balance = await balanceOf(cdpResult.tokenAddress)

      this.cdpResult = {
        collateral: cdpResult.collateral / 1e18,
        balance: (balance / 1e18) / 1e18
      }
    },
    burn: function () {
      return burn(this.assetId, this.erc20Address, this.tokens)
    },
    liquidate: function () {
      return liquidate(this.cdpId)
    }
  }
}
</script>

<style lang="scss">
.short {
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
</style>




//collateral raio = value of collateral / valuie of Debt
// = eth COllateral / (debtToken (token)* price)
