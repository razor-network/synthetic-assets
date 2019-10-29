<template>
    <div>
  <div class="mb-5">
    <div class="row row-space-4">
        <div class="col-xl-3 col-lg-6 mb-4">
          <div class="row">
            <h1 >Datafeed</h1>
            <p> Note: Please select Göerli testnet in metamask. </p>
            <select v-model="selected" @change="refresh()" class="form-control">
              <option disabled selected :value="null">Select a datafeed</option>
              <option v-for="job in jobs" :value="job.id" :key="job.id">{{ job.url }}</option>
            </select>
          </div>
        </div>
      <!-- <div class="col-md-4" v-if="selected"> -->
        <!-- <div> -->
          <!-- <label>Actions</label> -->
        <!-- </div> -->
        <!-- <div class="btn-group" role="group" aria-label="Basic example"> -->
          <!-- <button type="button" class="btn btn-secondary" @click="refresh">Refresh</button> -->
          <!-- <button type="button" class="btn btn-secondary" @click="request">Update Price</button> -->
        <!-- </div> -->
      </div>
    </div>

    <div class="row row-space-4" v-if="assetId">
      <div class="col-md-4">

        <label :class="{none: isHovering2|| isHovering3}">Asset ID</label>
        <p class="lead"
            @mouseover="isHovering1 = true"
            @mouseout="isHovering1 = false"
            :class="{hi: !isHovering1, none: isHovering2|| isHovering3}"
            >
            {{assetId}}
        </p>
      </div>
      <div class="col-md-4">
        <label :class="{none: isHovering1|| isHovering3}">CDP ID</label>
        <p class="lead"
            @mouseover="isHovering2 = true"
            @mouseout="isHovering2 = false"
            :class="{hi: !isHovering2, none: isHovering1 || isHovering3}">
            {{cdpId}}</p>
      </div>
      <div class="col-md-4" v-if="erc20Address && erc20Address !== ZEROX">
        <label :class="{none: isHovering2|| isHovering1}">ERC20 Contract Address</label>
        <p class="lead"
            @mouseover="isHovering3 = true"
            @mouseout="isHovering3 = false"
            :class="{hi: !isHovering3, none: isHovering1 || isHovering2}">
            {{erc20Address}}</p>
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

    <div class="row row-space-4" v-if="valueOnChainInEthString">
      <div class="col-md-3">
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
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-4">Add collateral</h4>

            <div class="mb-4">
              <label>ETH</label>
              <input class="form-control" v-model="addEth" type="number">
            </div>

            <button class="btn btn-block btn-primary" @click="collateralize">Collateralize</button>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-4">Draw</h4>

            <div class="mb-4">
                <p>Mint more tokens and increase debt</p>
              <label>Amount</label>
              <input class="form-control" v-model="drawAmount" type="number">
            </div>

            <button class="btn btn-block btn-primary" @click="draw">Draw</button>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-4">Burn</h4>

            <!-- <div class="mb-4"> -->
              <label>Pay whole debt and close CDP</label>
              <!-- <input class="form-control" v-model="tokens" type="number"> -->
            <!-- </div> -->

            <button class="btn btn-block btn-primary" @click="burn">Burn</button>
          </div>
        </div>
      </div>
      <!-- <div class="col-md-4 overlay-disabled">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-4">Liquidate</h4>

            <button class="btn btn-block btn-primary" @click="liquidate">Liquidate</button>
          </div>
        </div>
      </div> -->
    </div>

    <div class="row row-space-4">
      <div class="col-md-12">
        <div class="p-4">
          <img src="@/assets/img/hello.svg" class="img-fluid">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Web3 from 'web3'
import BN from 'bignumber.js'
import { enableEth, read, mint, draw, collateralize, cdps, balanceOf, burn,
  getContractAddress, cdpId, getAssetId, liquidate } from '@/utils/commons'

const ZEROX = '0x0000000000000000000000000000000000000000'

const splitNum = (num) => {
  const str = String(num)
  const first = str.substring(0, str.indexOf('.') + 3)
  const second = str.substring(str.indexOf('.') + 3).substring(0, 8)

  return {
    first,
    second
  }
}

export default {
  data: function () {
    return {
      jobs: [],
      selected: null,
      assetId: null,
      // demoUrl: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=E1BN9Y09VQ32BQ00',
      // demoSelector: 'Global Quote["05. price"]',
      id: null,
      valueOnChainInEth: null,
      eth: null,
      addEth: null,
      drawAmount: null,
      tx: null,
      cdpResult: null,
      tokens: null,
      erc20Address: null,
      userErc20Balance: null,
      collateral: null,
      debt: null,
      ZEROX,
      cdpId: null,
      ratio: null,
      isHovering1: false,
      isHovering2: false,
      isHovering3: false
    }
  },
  computed: {

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
  mounted () {
    enableEth()
    this.getJobs()
  },
  methods: {
    getJobs: async function () {
      let data = await this.axios.get('https://api.razor.network/' + 'jobs')
      for (let i = 0; i < data.data.message.length; i++) {
        this.jobs.push({
          'url': data.data.message[i].url,
          'id': data.data.message[i].id
        })
      }
    },
    updateUserBalance: async function () {
      if (!this.erc20Address || this.erc20Address === ZEROX) {
        this.userErc20Balance = null
        return
      }

      const balance = await balanceOf(this.erc20Address)
      // console.log('lol balance is ', balance)

      this.userErc20Balance = balance / 1e18
    },
    updateCdpInfo: async function () {
      const cdpResult = await cdps(this.assetId)
      this.collateral = cdpResult.collateral / 1e18
      this.debt = (cdpResult.debt / 1e18)
    },
    // request: async function () {
    //   await request(this.url, this.selector)
    //   this.refresh()
    // },
    refresh: async function () {
      this.assetId = await getAssetId(this.selected)
      console.log('this.assetId', this.assetId)
      await this.updateCdpInfo()
      let res = await read(this.selected) / 100000000
      console.log(res)
      let ethPrice = await read(1) / 100000000
      this.valueOnChainInEth = res / ethPrice

      this.erc20Address = await getContractAddress(this.assetId)
      //
      this.cdpId = await cdpId(this.assetId)
      const x = (new BN(this.debt).multipliedBy(this.valueOnChainInEth)).dividedBy(this.collateral)
      this.ratio = 1 / x
      await this.updateUserBalance()
    },
    mint: async function () {
      const { tx } = await mint(this.selected, this.eth)

      this.tx = tx

      this.refresh()
    },
    draw: async function () {
      const { tx } = await draw(this.selected, this.drawAmount)

      this.tx = tx

      this.refresh()
    },
    collateralize: async function () {
      const { tx } = await collateralize(this.selected, this.addEth)

      this.tx = tx

      this.refresh()
    },
    burn: async function () {
      await burn(this.selected, this.erc20Address)

      this.refresh()
    },
    liquidate: async function () {
      await liquidate(this.cdpId)

      this.refresh()
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

.overlay-disabled {
  opacity: 0.5;
}

.hi {
  text-overflow: ellipsis;
  overflow: hidden;
}

.none {
    display: none;
}
</style>
