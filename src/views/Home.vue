<template>
    <div>
        <vue-element-loading :active="show" spinner="bar-fade-scale" is-full-screen color="#171aa5" size="128"/>

  <div class="mb-30">
    <div class="row row-space-12">
        <div class="col-xl-6 col-lg-6 mb-4">
          <!-- <div class="row"> -->
            <h3 > Welcome to Razor Synthetic Assets</h3>

            <p class='lead'> Using this dapp you can "mint" tokens which tracks any asset in the world.</p>
            <p> It uses <a target="_blank" href="https://razor.network"> Razor Oracle Network</a> to get the data.</p>
            <p> Please select an asset below or add your own datafeed here: <a target="_blank" href = 'https://razorscan.io/#/query'>RazorScan</a> </p>
            <p><strong> Note: This is a demo application deployed on Görli testnet. Please don't send valuable assets!</strong></p>
            <p><strong> You will need some Göerli ether to use the app. Get some <a target="_blank" href='https://goerli-faucet.slock.it/'>here</a> </strong></p>
<br/>
            <h3> How to open a short position</h3>
            <p> Creating a CDP using this app backed by Ether will mint the synthetic tokens. You can sell these ERC20 tokens to anyone to open a "short" position </p>
            <br/>

            <h3> How to open a long position </h3>
            <p> Buy the synthetic ERC20 tokens from anyone to open a long position. </p>
            <br/>
            <h3> What is the minimum collateral ratio </h3>
            <p>Minimum collateral ratio is 200%, below which the CDP may be liquidated. </p>
            <div class="alert alert-danger" v-if="warning" role="alert">
Please select Göerli testnet in metamask to continue.
</div>
<div v-if="!warning">
            <h3>Please select an Asset</h3>
            <p><strong> Note: These are all the datafeeds from Razor oracle network, which is decentralized. We do not have control over the datafeeds. </strong></p>

            <select v-model="selected" @change="refresh()" class="form-control mb-30">
              <option disabled selected :value="null">Select</option>
              <option v-for="job in jobs" :value="job" :key="job.id">{{ job.name }}</option>
            </select>
        </div>
            <br/>
          <!-- </div> -->
        </div>
          <div class="col-md-6">
            <div class="p-6">
              <img src="@/assets/img/hello.svg" class="img-fluid">
              <!-- <div class="footer"> (c) 2019 All rights reserved </div> -->
            </div>
          </div>
        </div>
        <div class = "row p-2 mb-30">
            <div class ="col-md-2" ><button class = 'btn btn-secondary' v-if="assetId && !showInfo" @model="showInfo" @click="showInfo = !showInfo"> <font-awesome-icon icon="info-circle" /> Show Details </button>
            <button class = 'btn btn-secondary' v-if="assetId && showInfo" @model="showInfo" @click="showInfo = !showInfo"> <font-awesome-icon icon="info-circle" /> Hide Details </button>
</div>
<div class ="col-md-2" >
        <button class = 'btn btn-secondary' v-if="assetId" @click="refresh"> <font-awesome-icon icon="sync" /> Refresh </button>
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

<div v-if="showInfo" >
    <div class="row row-space-4" v-if="assetId">
      <div class="col-md-2 card-body">

        <label :class="{none: isHovering2|| isHovering3 || isHovering4 || isHovering5 || isHovering6}">Asset ID</label>
        <p class="lead singleLine"
            @mouseover="isHovering1 = true;
            info='This is the asset ID unique to the URL and the selector'"
            @mouseout="isHovering1 = false"
            :class="{hi: !isHovering1, none:  isHovering2|| isHovering3 || isHovering4 || isHovering5 || isHovering6}"
            >
            {{assetId}}
        </p>
      </div>
      <div class="col-md-2 card-body">
        <label :class="{none: isHovering1|| isHovering3|| isHovering4 || isHovering5 || isHovering6}">CDP ID</label>
        <p class="lead singleLine"
            @mouseover="isHovering2 = true;
            info='This is the CDP ID unique to the asset and your Ethereum address'"
            @mouseout="isHovering2 = false"
            :class="{hi: !isHovering2, none: isHovering1 || isHovering3 || isHovering4 || isHovering5 || isHovering6}">
            {{cdpId}}</p>
      </div>
      <div class="col-md-2 card-body" v-if="erc20Address && erc20Address !== ZEROX">
        <label :class="{none: isHovering2|| isHovering1|| isHovering4 || isHovering5 || isHovering6}">ERC20 Address</label>
        <p class="lead singleLine"
           @mouseover="isHovering3 = true;
        info='This is the ERC20 token contract address for this asset'"
        @mouseout="isHovering3 = false"
        :class="{hi: !isHovering3, none: isHovering2|| isHovering1|| isHovering4 || isHovering5 || isHovering6}"
        ><a
        target="_blank"

            :href="'https://goerli.etherscan.io/address/'+erc20Address">
            {{erc20Address}}</a> </p>
      </div>
      <div class="col-md-2 card-body" v-if="selected">
        <label :class="{none: isHovering1|| isHovering2 || isHovering3 || isHovering5 || isHovering6}">URL</label>
        <p class="lead singleLine"
           @mouseover="isHovering4 = true;
        info='This is the URL from which the data will be fetched by Razor Oracle Network'"
        @mouseout="isHovering4 = false"
        :class="{hi: !isHovering4, none: isHovering1 || isHovering2 || isHovering3 || isHovering5 || isHovering6}"
        >{{selected.url}} </p>
      </div>
      <div class="col-md-2 card-body" v-if="selected">
        <label :class="{none:  isHovering1|| isHovering2 || isHovering3 || isHovering4 || isHovering6}">Selector</label>
        <p class="lead singleLine"
           @mouseover="isHovering5 = true;
        info='The JSON response selector'"
        @mouseout="isHovering5 = false"
        :class="{hi: !isHovering5, none: isHovering1|| isHovering2 || isHovering3 || isHovering4 || isHovering6}"
        >
            {{selected.selector}} </p>
      </div>
      <div class="col-md-2 card-body" v-if="selected">
        <label :class="{none:  isHovering1|| isHovering2 || isHovering3 || isHovering4 || isHovering5}">Last price</label>
        <p class="lead singleLine"
           @mouseover="isHovering6 = true;
        info='Last reported price by the Razor Oracle Network'"
        @mouseout="isHovering6 = false"
        :class="{hi: !isHovering5, none: isHovering1|| isHovering2 || isHovering3 || isHovering4 || isHovering5}"
        >
            {{selected.result}} </p>
      </div>
    </div>
</div>
    <div class="alert alert-info" role="alert" :class="{invisible: !(isHovering1 || isHovering2 || isHovering3 || isHovering4 || isHovering5 || isHovering6)}">
{{info}}    </div>


    <div class="row p-2  d-flex flex-row align-items-stretch">
      <div class="col-md-3" v-if="valueOnChainInEthString">
        <div class="card ">
          <div class="card-body">
            <p class="card-title">{{selected.name}} Price</p>
            <h4>{{assetPriceString.first}}<small class="text-muted">{{assetPriceString.second}} </small></h4>
            <p class="card-subtitle text-muted">USD</p>
          </div>
        </div>
      </div>
      <div class="col-md-3" v-if="valueOnChainInEthString">
        <div class="card ">
          <div class="card-body">
            <p class="card-title">ETH/USD price</p>
            <h4 class>{{ethPriceString.first}}<small class="text-muted">{{ethPriceString.second}} </small></h4>
            <p class="card-subtitle text-muted">USD</p>

          </div>
        </div>
      </div>
      <div class="col-md-3" v-if="valueOnChainInEthString">
        <div class="card ">
          <div class="card-body">
            <p class="card-title">{{selected.name}} Price in ETH</p>
            <h4 >{{valueOnChainInEthString.first}}<small class="text-muted">{{valueOnChainInEthString.second}} </small></h4>

            <p class="card-subtitle text-muted">ETH</p>
 </div>
        </div>
      </div>
      <div class="col-md-3" v-if="userErc20BalanceString">
        <div class="card">
          <div class="card-body">
            <p class="card-title">Your Balance</p>
            <h4 >{{userErc20BalanceString.first}}<small class="text-muted">{{userErc20BalanceString.second}}</small></h4>
            <p class="card-subtitle text-muted">{{selected.name}}</p>
 </div>
        </div>
      </div>

    </div>
    <div class = "row p-2">
    <div class="col-md-6 " v-if="collateralString">
        <div class="card">
        <div class="card-body">
          <p class="display-5 strong">Collateral</p>
          <h4 class="display-4">
            {{collateralString.first}}<small class="text-muted">{{collateralString.second}}          </small> </h4>
 <h4 class="display-5 text-muted">ETH </h4>
 <h4><small class="display-5 text-muted" v-if="ratioString">({{ratioString}}%)</small></small></h4>
        </div>
    </div>
    </div>
    <div class="col-md-6" v-if="debtString">
        <div class="card">
        <div class="card-body">
          <p class="display-5">Debt</p>
          <h4 class="display-4">{{debtString.first}}<small class="text-muted">{{debtString.second}} </small></h4>
             <h4> <small class="display-5 text-muted" v-if="ratioString">{{selected.name}}</small></h4>
             <h4> <small class="invisible" v-if="ratioString">.</small></h4>
        </div>
        </div>
    </div>
</div>

        <!-- <nav class="nav nav-pills nav-justified p-4"  v-if="valueOnChainInEthString">
          <a class="nav-item nav-link active" href="#">Mint</a>
          <a class="nav-item nav-link" href="#">Burn</a>
          <a class="nav-item nav-link" href="#">Collateralize</a>
          <a class="nav-item nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Draw</a>
          <a class="nav-item nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Transfer</a>
        </nav> -->
    <div class="row  d-flex p-4 flex-row align-items-stretch" v-if="valueOnChainInEthString">

        <div class="col-md-6 card">
          <div class="card-body">
            <h4 class="mb-4">Mint</h4>
<p>Collateralize with Ether to mint the asset. Asset will be minted with 500% collateral ratio by default.</p>
            <div class="mb-4">
              <label>ETH</label>
              <input class="form-control" v-model="eth" type="number">
            </div>
<p v-if="expected">Tokens to be minted: {{expected}} </p>
            <button class="btn btn-block btn-primary" @click="mint">Mint</button>
          </div>

      </div>


      <div class="col-md-6 card ">
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
  <div class="row  d-flex p-4 flex-row align-items-stretch " v-if="valueOnChainInEthString">

      <div class="col-md-4 card ">

          <div class="card-body">
            <h4 class="mb-4">Add collateral</h4>
<p> Add more collateral to the CDP.
            <div class="mb-4">
              <label>ETH</label>
              <input class="form-control" v-model="addEth" type="number">
            </div>
            <div v-if="CRafterCollateralized" >Future collateral Ratio: {{CRafterCollateralized}} % </div>
<br/>
            <button class="btn btn-block btn-primary" @click="collateralize">Collateralize</button>
          </div>
        </div>

        <div class="col-md-4 card ">

          <div class="card-body">
            <h4 class="mb-4">Draw</h4>

            <div class="mb-4">
                <p>Mint more tokens and increase debt without adding collateral.  If the Collateral ratio drops below 200%, it may be liquidated.</p>
              <label>Amount</label>
              <input class="form-control" v-model="drawAmount" type="number">
            </div>
            <div v-if="CRafterDraw" :class="{red: CRafterDraw<200}" >Future collateral Ratio: {{CRafterDraw}} % </div>
<br/>
            <button class="btn btn-block btn-primary" @click="draw">Draw</button>
          </div>

      </div>
      <div class="col-md-4 card ">
          <div class="card-body">
            <h4 class="mb-4">Transfer</h4>
<p>Transfer tokens</p>
            <div class="mb-4">
              <label>Address</label>
              <input class="form-control" v-model="transferAddress" type="text">
            </div>
            <div class="mb-4">
              <label>Amount</label>
              <input class="form-control" v-model="transferAmount" type="number">
            </div>

            <button class="btn btn-block btn-primary" @click="transfer">Transfer</button>
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


  </div>

</template>

<script>
// import Web3 from 'web3'
import BN from 'bignumber.js'
import { enableEth, read, mint, draw, collateralize, transfer, cdps, balanceOf, burn,
  getContractAddress, cdpId, getAssetId, liquidate, getNetwork } from '@/utils/commons'

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
      isHovering3: false,
      isHovering4: false,
      isHovering5: false,
      isHovering6: false,
      info: "test",
      transferAmount: null,
      transferAddress: null,
      showInfo: false,
      show: false,
      warning: null,
      ethPrice: null
      // expected: null
    }
  },
  computed: {
    expected: function() {
        if(!this.eth) return
        return this.eth/(5*this.valueOnChainInEth)
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
  },
  ethPriceString: function() {
      if (!this.ethPrice) return

      return splitNum(this.ethPrice)
  },
  assetPriceString: function() {
      if (!this.selected.result) return

      return splitNum(this.selected.result)
  },
    CRafterCollateralized: function() {
        if (!this.ratio) return
        if (isNaN(this.ratio)) return
        if (this.addEth==0) return
        const x = (new BN(this.debt).multipliedBy(this.valueOnChainInEth)).dividedBy(new BN(this.collateral).plus(this.addEth))
        return Math.round((100 / x),2)
    },
    CRafterDraw: function() {
        if (!this.ratio) return
        if (isNaN(this.ratio)) return
        if (this.drawAmount==0) return
        const x = (new BN(this.debt).plus(new BN(this.drawAmount))).multipliedBy(this.valueOnChainInEth).dividedBy(new BN(this.collateral))
        return ((100 / x))
        // return Math.round((100 / x),2)
    }
  },
  watch: {
    assetId: async function (newValue) {
      this.refresh()
    }
  },
  async mounted () {
    await enableEth()
    this.warning = await getNetwork()
    console.log(this.warning)
    this.getJobs()
  },
  methods: {
      transfer: async function() {
          const { tx } = await transfer(this.erc20Address, this.transferAddress, this.transferAmount)

          this.tx = tx

          this.refresh()
      },
    getJobs: async function () {
      let data = await this.axios.get('https://api.razor.network/' + 'jobs')
      // let data = await this.axios.get('http://localhost:3000/' + 'jobs')
      for (let i = 0; i < data.data.message.length; i++) {
        this.jobs.push({
          'url': data.data.message[i].url,
          'id': data.data.message[i].id,
          'name': data.data.message[i].name,
          'selector': data.data.message[i].selector,
          'result': data.data.message[i].result/100000000
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
    this.show=true
      this.assetId = await getAssetId(this.selected.id)
      console.log('this.assetId', this.assetId)
      await this.updateCdpInfo()
      let res = await read(this.selected.id) / 100000000
      console.log(res)
      this.ethPrice = await read(1) / 100000000
      this.valueOnChainInEth = res / this.ethPrice

      this.erc20Address = await getContractAddress(this.assetId)
      //
      this.cdpId = await cdpId(this.assetId)
      const x = (new BN(this.debt).multipliedBy(this.valueOnChainInEth)).dividedBy(this.collateral)
      this.ratio = 1 / x
      await this.updateUserBalance()
      this.show = false
    },
    mint: async function () {
      const { tx } = await mint(this.selected.id, this.eth)

      this.tx = tx

      this.refresh()
    },
    draw: async function () {
      const { tx } = await draw(this.selected.id, this.drawAmount)

      this.tx = tx

      this.refresh()
    },
    collateralize: async function () {
      const { tx } = await collateralize(this.selected.id, this.addEth)

      this.tx = tx

      this.refresh()
    },
    burn: async function () {
      await burn(this.selected.id, this.erc20Address)

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

.singleLine {
    word-break: break-all;
    white-space: nowrap;
}

.none {
    display: none;
}
.invisible {
    display: hidden;
}
a {
     text-decoration: underline;
     color: grey;
}
.red {
    color:red;
}
.whiteBg {
    background: white;
}

</style>
