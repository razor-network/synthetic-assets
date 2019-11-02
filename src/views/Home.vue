<template>
<div>
  <vue-element-loading :active="show" spinner="bar-fade-scale" is-full-screen color="#171aa5" size="128" />

    <div class="row row-space-12">
      <div class="col-xl-6 col-lg-6 mb-4">
        <!-- <div class="row"> -->
        <h3> Welcome to Razor Synths</h3>

        <p class='lead'> Using this dapp you can "mint" tokens which tracks any asset in the world.</p>
        <p> It uses <a class="font-weight-bold" target="_blank" href="https://razor.network"> Razor Decentralized Oracle Network</a> to get the data.</p>
        <p><strong> Note: This is a demo application deployed on Görli testnet. Please don't send valuable assets!</strong></p>

        <h3> How to open a short position?</h3>
        <p> Creating a CDP using this app backed by Ether will mint the synthetic tokens. You can sell these ERC20 tokens to anyone to open a "short" position </p>

        <h3> How to open a long position? </h3>
        <p> Buy the synthetic ERC20 tokens from anyone to open a long position. </p>
        <div class="alert alert-danger" v-if="warning" role="alert">
          Please select Göerli testnet in metamask to continue.
        </div>
      </div>
      <div class="col-md-6">
        <div class="p-6">
          <img src="@/assets/img/hello.svg" class="img-fluid">
          <!-- <div class="footer"> (c) 2019 All rights reserved </div> -->
        </div>
      </div>
      <router-link to="/App" class="btn btn-primary text-decoration-none">

                        <span>Let's get started</span>
                    </router-link>

    </div>
    </div>

</template>

<script>
// import Web3 from 'web3'
import BN from 'bignumber.js'
import {
  enableEth,
  read,
  mint,
  draw,
  collateralize,
  transfer,
  cdps,
  balanceOf,
  burn,
  getContractAddress,
  cdpId,
  getAssetId,
  liquidate,
  getNetwork
} from '@/utils/commons'

const ZEROX = '0x0000000000000000000000000000000000000000'

const splitNum = (num) => {
  num = new BN(num)
  const str = num.toString()
  const first = str.substring(0, str.indexOf('.') + 3)
  const second = str.substring(str.indexOf('.') + 3).substring(0, 8)

  return {
    first,
    second
  }
}

export default {
  data: function() {
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
      ethPrice: null,
      mintLoading: false,
      burnLoading: false,
      collateralizeLoading: false,
      drawLoading: false,
      transferLoading: false
      // expected: null
    }
  },
  computed: {
    expected: function() {
      if (!this.eth) return
      return this.eth / (5 * this.valueOnChainInEth)
    },

    debtString: function() {
      if (!this.debt) return

      return splitNum(this.debt)
    },
    userErc20BalanceString: function() {
      if (!this.userErc20Balance) return

      return splitNum(this.userErc20Balance)
    },
    valueOnChainInEthString: function() {
      if (!this.valueOnChainInEth) return

      return splitNum(this.valueOnChainInEth)
    },
    collateralString: function() {
      if (!this.collateral) return

      return splitNum(this.collateral)
    },
    ratioString: function() {
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
      if (this.addEth == 0) return
      const x = (new BN(this.debt).multipliedBy(this.valueOnChainInEth)).dividedBy(new BN(this.collateral).plus(this.addEth))
      return Math.round((100 / x), 2)
    },
    CRafterDraw: function() {
      if (!this.ratio) return
      if (isNaN(this.ratio)) return
      if (this.drawAmount == 0) return
      const x = (new BN(this.debt).plus(new BN(this.drawAmount))).multipliedBy(this.valueOnChainInEth).dividedBy(new BN(this.collateral))
      return ((100 / x))
      // return Math.round((100 / x),2)
    }
  },
  watch: {
    assetId: async function(newValue) {
      this.refresh()
    }
  },
  async mounted() {
    await enableEth()
    this.warning = await getNetwork()
    console.log(this.warning)
    this.getJobs()
  },
  methods: {
    transfer: async function() {
      this.transferLoading = true
      const {
        tx
      } = await transfer(this.erc20Address, this.transferAddress, this.transferAmount)

      this.tx = tx
      this.transferLoading = false

      this.refresh()
    },
    getJobs: async function() {
      let data = await this.axios.get('https://api.razor.network/' + 'jobs')
      // let data = await this.axios.get('http://localhost:3000/' + 'jobs')
      for (let i = 0; i < data.data.message.length; i++) {
        this.jobs.push({
          'url': data.data.message[i].url,
          'id': data.data.message[i].id,
          'name': data.data.message[i].name,
          'selector': data.data.message[i].selector,
          'result': data.data.message[i].result / 100000000
        })
      }
    },
    updateUserBalance: async function() {
      if (!this.erc20Address || this.erc20Address === ZEROX) {
        this.userErc20Balance = null
        return
      }

      const balance = await balanceOf(this.erc20Address)
      // console.log('lol balance is ', balance)

      this.userErc20Balance = balance / 1e18
    },
    updateCdpInfo: async function() {
      const cdpResult = await cdps(this.assetId)
      this.collateral = new BN(cdpResult.collateral).dividedBy(new BN(1e18))
      this.debt = (new BN(cdpResult.debt).dividedBy(new BN(1e18)))
    },
    // request: async function () {
    //   await request(this.url, this.selector)
    //   this.refresh()
    // },
    refresh: async function() {
      this.show = true
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
    mint: async function() {
      this.mintLoading = true

      const {
        tx
      } = await mint(this.selected.id, this.eth)

      this.tx = tx

      this.mintLoading = false

      await this.refresh()

    },
    draw: async function() {
      this.drawLoading = true

      const {
        tx
      } = await draw(this.selected.id, this.drawAmount)

      this.tx = tx

      this.drawLoading = false
      this.refresh()
    },
    collateralize: async function() {
      this.collateralizeLoading = true

      const {
        tx
      } = await collateralize(this.selected.id, this.addEth)

      this.tx = tx
      this.collateralizeLoading = false
      this.refresh()
    },
    burn: async function() {
      this.burnLoading = true

      await burn(this.selected.id, this.erc20Address)
      this.burnLoading = false
      this.refresh()
    },
    liquidate: async function() {
      // this.show = true

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
    color: red;
}
.whiteBg {
    background: white;
}
</style>
