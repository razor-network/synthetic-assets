import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import axios from 'axios'
import VueAxios from 'vue-axios'

import Plugin from './plugins/Plugin'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(Plugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
