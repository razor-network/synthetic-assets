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
        <label>Asset Value in ETH on-chain</label>
        <div class="input-group m-0">
          <input class="form-control" v-model="valueOnChainInEth" readonly>
          <div class="input-group-append">
            <button class="btn btn-outline-primary" type="button" @click="read">Refresh</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row row-space-4" v-if="erc20Address">
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
    <div class="row row-space-4" v-if="erc20Address">
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

    <div class="row row-space-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-4">Mint</h4>

            <div class="mb-4">
              <label>ETH</label>
              <input class="form-control" v-model="eth" type="number">
            </div>

            <button class="btn btn-block btn-primary" @click="mint">Mint</button>
            <button class="btn btn-block btn-primary mt-4" @click="cdps" v-if="tx">CDP</button>

            <div v-if="tx" class="font-weight-normal mt-4">
              Value: {{tx}}
            </div>

            <div v-if="tx && cdpResult" class="font-weight-normal mt-4">
              Collateral: {{cdpResult.collateral}}<br/>
              Balance: {{cdpResult.balance}}<br/>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-4">Burn</h4>

            <div class="mb-4">
              <label># Tokens</label>
              <input class="form-control" v-model="tokens" type="number">
            </div>

            <button class="btn btn-block btn-primary" @click="burn.go" v-if="burn.go">Burn</button>
            <div v-if="tx" class="font-weight-normal mt-4">
              Value: {{tx}}
            </div>

            <div v-if="tx && cdpResult" class="font-weight-normal mt-4">
              Collateral: {{cdpResult.collateral}}<br/>
              Balance: {{cdpResult.balance}}<br/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3'
import { request, read, mint, cdps, balanceOf, burn, getContractAddress } from '@/utils/commons'

export default {
  created: function () {
    this.burn = {}
  },
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
      debt: null
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
      this.erc20Address = await getContractAddress(newValue)
      this.read()
      this.updateUserBalance()
      this.updateCdpInfo()
    }
  },
  methods: {
    updateUserBalance: async function () {
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
      const valueOnChainInEth = await read(this.assetId)

      this.valueOnChainInEth = valueOnChainInEth / 1e18
    },
    mint: async function () {
      const { tx } = await mint(this.url, this.selector, this.eth)

      this.tx = tx
    },
    cdps: async function () {
      const cdpResult = await cdps(this.assetId)
      const balance = await balanceOf(cdpResult.tokenAddress)

      this.cdpResult = {
        collateral: cdpResult.collateral / 1e18,
        balance: (balance / 1e18) / 1e18
      }

      this.burn.go = () => {
        return burn(this.assetId, cdpResult.tokenAddress, this.tokens)
      }
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
