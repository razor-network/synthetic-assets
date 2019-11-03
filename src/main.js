import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import './registerServiceWorker'
import axios from 'axios'
import VueAxios from 'vue-axios'

import Plugin from './plugins/Plugin'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfoCircle, faSync, faSearch } from '@fortawesome/free-solid-svg-icons'
import { faTelegramPlane, faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueElementLoading from 'vue-element-loading'
import VueAnalytics from 'vue-analytics'

Vue.config.productionTip = false

Vue.use(VueAnalytics, {
  id: 'UA-143423314-3'
})

Vue.use(VueAxios, axios)
Vue.use(Plugin)

library.add(faInfoCircle)
library.add(faTelegramPlane)
library.add(faGithub)
library.add(faSync)
library.add(faSearch)

Vue.component('VueElementLoading', VueElementLoading)
Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
