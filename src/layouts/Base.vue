<template>
<div class="app-base">
  <!-- <div class="top-bar"> -->
  <nav class="navbar navbar-expand-lg fixed-top navbar-light bg-our container d-flex ">
    <div class="brand flex-grow-1 navbar-brand  ">
      <router-link to="/">
        <img src="@/assets/img/logo.svg" height="26px" class="d-inline-block align-top" /><span class="text-monospace" style="vertical-align: middle; ">Synths</span>
      </router-link>
    </div>

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <!-- <a class="nav-item nav-link active" href="#">Home </a> -->
        <router-link to="/App" class="nav-item nav-link text-decoration-none font-weight-bold">
          <span>App</span>
        </router-link>
        <router-link to="/FAQ" class="nav-item nav-link text-decoration-none font-weight-bold ">
          <span>FAQ</span>
        </router-link>
        <a class="nav-item nav-link text-decoration-none font-weight-bold " target="_blank" href="https://razor.network">Razor Network</a>
        <a class="nav-item nav-link text-decoration-none font-weight-bold" target="_blank" href="https://razorscan.io">RazorScan</a>
        <a class="nav-item nav-link text-decoration-none font-weight-bold" target="_blank" href="https://github.com/razor-network/synthetic-assets">
          <font-awesome-icon :icon="['fab', 'github']" /> Source</a>
        <a class="nav-item nav-link text-decoration-none font-weight-bold" target="_blank" href="https://t.me/razornetwork">
          <font-awesome-icon :icon="['fab', 'telegram-plane']" /> Help</a>


      </div>
    </div>
  </nav>
  <!-- <div class="container d-flex">
        <div class="brand">
          <img src="@/assets/img/logo.svg" height="26px">
          <strong>Synthetic Assets</strong>
        </div>
      </div> -->
  <!-- </div> -->

  <div class="container">
    <router-view></router-view>
  </div>
</div>
</template>

<script>
import dom from '@/mixins/dom'
import {
  EventBus
} from '@/utils/commons'

export default {
  data: function() {
    return {
      show: false
    }
  },
  mixins: [dom],
  methods: {
    getMainWindow: function() {
      if (this.mainWindow) return this.mainWindow

      this.mainWindow = document.querySelector('.app-base')

      return this.mainWindow
    },
    checkForScroll: function() {
      const mainWindow = this.getMainWindow()
      if (!mainWindow) return

      const y = mainWindow.getBoundingClientRect().top

      if (y < 72) {
        this.addClass(document.body, 'scrolled')
      } else {
        this.removeClass(document.body, 'scrolled')
      }
    },
    updateAvailable(e) {
      const ref = this

      this.registration = e.detail
      EventBus.$once('toast:showSwUpdate:update', () => {
        ref.refreshApp()
      })
      EventBus.$emit('toast:show', 'showSwUpdate')
    },
    refreshApp() {
      if (!this.registration || !this.registration.waiting) return

      this.userIntentToRefresh = true
      this.registration.waiting.postMessage('SKIP_WAITING')
    }
  },
  created: function() {
    if (window.location.hostname.includes('netlify.com')) {
      this.show = false
      return
    }

    this.show = true
    this.userIntentToRefresh = false
    this.registration = false
    this.refreshing = false

    if (!navigator.serviceWorker) return

    document.addEventListener('sw:updated',
      this.updateAvailable, {
        once: true
      })

    navigator.serviceWorker.addEventListener(
      'controllerchange', () => {
        if (this.refreshing) return
        if (!this.userIntentToRefresh) {
          /* eslint-disable-next-line no-console */
          console.log('Force refreshing the UI because of a critical UI+SW update')
        }

        this.refreshing = true
        window.location.reload(true)
      }
    )
  },
  mounted: function() {
    this.checkForScroll()

    document.addEventListener('scroll', (evt) => {
      this.checkForScroll()
    }, {
      capture: true,
      passive: true
    })
  }
}
</script>
<style>
.bg-our {
  background: #F0F4F8;
}

.brand {
  text-decoration: none;
}
</style>
