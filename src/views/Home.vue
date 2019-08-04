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
      <div class="col-md-4">
        <label>Asset ID</label>
        <input class="form-control" v-model="assetId" readonly>
      </div>
      <div class="col-md-4">
        <label>CDP ID</label>
        <input class="form-control" v-model="cdpId" readonly>
      </div>
      <div class="col-md-4">
        <div>
          <label>Actions</label>
        </div>
        <div class="btn-group" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-secondary" @click="refresh">Refresh</button>
          <button type="button" class="btn btn-secondary" @click="request">Update Price</button>
        </div>
      </div>
    </div>
    <div class="row row-space-4" v-if="erc20Address && erc20Address !== ZEROX">
      <div class="col-md-6">
        <label>ERC20 Contract Address</label>
        <input class="form-control" v-model="erc20Address" readonly>
      </div>
    </div>

    <div class="row row-space-4">
      <div class="col-md-3" v-if="valueOnChainInEthString">
        <div class="card">
          <div class="card-body">
            <p class="lead">Asset Value</p>
            <h4 class="m-0">{{valueOnChainInEthString.first}}<small class="text-muted">{{valueOnChainInEthString.second}} <small>ETH</small></small></h4>
          </div>
        </div>
      </div>
      <div class="col-md-3" v-if="userErc20BalanceString">
        <div class="card">
          <div class="card-body">
            <p class="lead">Your Balance</p>
            <h4 class="m-0">{{userErc20BalanceString.first}}<small class="text-muted">{{userErc20BalanceString.second}} <small>TOKENS</small></small></h4>
          </div>
        </div>
      </div>
      <div class="col-md-3" v-if="debtString">
        <div class="card">
          <div class="card-body">
            <p class="lead">Debt</p>
            <h4 class="m-0">{{debtString.first}}<small class="text-muted">{{debtString.second}} <small>TOKENS</small></small></h4>
          </div>
        </div>
      </div>
      <div class="col-md-3" v-if="collateralString">
        <div class="card">
          <div class="card-body">
            <p class="lead">Collateral</p>
            <h4 class="m-0">
              {{collateralString.first}}<small class="text-muted">{{collateralString.second}} <small>ETH <span v-if="ratioString">({{ratioString}}%)</span></small></small>
            </h4>
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

            <button class="btn btn-block btn-primary" @click="liquidate">Simulate &amp; Liquidate</button>
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

const splitNum = (num) => {
  const str = String(num)
  const first = str.substring(0, str.indexOf('.') + 3)
  const second = str.substring(str.indexOf('.') + 3).substring(0, 6)

  return {
    first,
    second
  }
}

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
    },
    debtString: function () {
      if (!this.debt) return

      return splitNum(this.debt)
    },
    userErc20BalanceString: function () {
      if (!this.userErc20Balance) return

      return splitNum(this.userErc20Balance)
    },
    valueOnChainInEthString: function () {
      if (!this.valueOnChainInEth) return

      return splitNum(this.valueOnChainInEth)
    },
    collateralString: function () {
      if (!this.collateral) return

      return splitNum(this.collateral)
    },
    ratioString: function () {
      if (!this.ratio) return
      if (isNaN(this.ratio)) return

      return Math.round(this.ratio * 10000, 4) / 100
    }
  },
  watch: {
    assetId: async function (newValue) {
      this.refresh()
    }
  },
  methods: {
    updateUserBalance: async function () {
      if (!this.erc20Address || this.erc20Address === ZEROX) return

      const balance = await balanceOf(this.erc20Address)

      console.log('balance', balance)

      this.userErc20Balance = balance / 1e18
    },
    updateCdpInfo: async function () {
      const cdpResult = await cdps(this.assetId)

      this.collateral = cdpResult.collateral / 1e18
      this.debt = (cdpResult.debt / 1e18) / 1e18
    },
    request: async function () {
      await request(this.url, this.selector)
      this.refresh()
    },
    refresh: async function () {
      await this.updateUserBalance()
      await this.updateCdpInfo()
      this.valueOnChainInEth = await read(this.assetId) / 1e18
      this.erc20Address = await getContractAddress(this.assetId)

      this.cdpId = await cdpId(this.assetId)
      this.ratio = ((new BN(this.collateral).multipliedBy(this.valueOnChainInEth)).dividedBy(this.debt)).toString()
    },
    mint: async function () {
      const { tx } = await mint(this.url, this.selector, this.eth)

      this.tx = tx

      this.refresh()
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
