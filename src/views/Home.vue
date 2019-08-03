<template>
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
</template>

<script>
import { request, read } from '@/utils/commons'

export default {
  data: function () {
    return {
      url: null,
      selector: null,
      demoUrl: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=E1BN9Y09VQ32BQ00',
      demoSelector: 'Global Quote["05. price"]',
      id: null,
      value: null
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
