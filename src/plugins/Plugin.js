import '@/assets/scss/style.scss'

export default {
  install (Vue) {
    Vue.prototype.$LEFT_COL = 'col-xl-8 col-lg-8 col-md-8 col-sm-8 col-12'
    Vue.prototype.$RIGHT_COL = 'col-xl-4 col-lg-4 col-md-4 col-sm-4'
    Vue.prototype.$ALERT_COL = 'col-xl-8 col-lg-9'
  }
}
