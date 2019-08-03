<template>
  <div class="mb-5">
    <div class="row row-space-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-4">Request</h4>

            <div class="mb-4">
              <label>URL</label>
              <input class="form-control" v-model="url">
              <div class="small text-muted short mt-1" @click="url = demoUrl">Click to set {{demoUrl}}</div>
            </div>

            <div class="mb-4">
              <label>JSON Selector</label>
              <input class="form-control" v-model="selector">
              <div class="small text-muted short mt-1" @click="selector = demoSelector">Click to set {{demoSelector}}</div>
            </div>

            <button class="btn btn-block btn-primary" @click="request">Submit</button>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-4">Read</h4>

            <div class="mb-4">
              <label>ID</label>
              <input class="form-control" v-model="id">
            </div>

            <button class="btn btn-block btn-primary" @click="read">Read</button>

            <div v-if="value" class="font-weight-normal mt-4">
              Value: {{value}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row row-space-4" v-if="id">
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
    </div>
  </div>
</template>

<script>
import { request, read, mint, cdps, balanceOf } from '@/utils/commons'

export default {
  data: function () {
    return {
      url: null,
      selector: null,
      demoUrl: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=E1BN9Y09VQ32BQ00',
      demoSelector: 'Global Quote["05. price"]',
      id: null,
      value: null,
      eth: null,
      tx: null,
      cdpResult: null
    }
  },
  methods: {
    request: async function () {
      const { id } = await request(this.url, this.selector)

      this.id = id
    },
    read: async function () {
      const value = await read(this.id)

      this.value = value
    },
    mint: async function () {
      const { tx } = await mint(this.url, this.selector, this.eth)

      this.tx = tx
    },
    cdps: async function () {
      const cdpResult = await cdps(this.id)
      const balance = await balanceOf(cdpResult.tokenAddress)

      this.cdpResult = {
        collateral: cdpResult.collateral / 1e18,
        balance: (balance / 1e18) / 1e18
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
