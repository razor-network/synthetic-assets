import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import axios from 'axios'
import VueAxios from 'vue-axios'

import Plugin from './plugins/Plugin'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfoCircle, faSync } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueElementLoading from 'vue-element-loading'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(Plugin)

library.add(faInfoCircle)
library.add(faSync)

Vue.component('VueElementLoading', VueElementLoading)
Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
