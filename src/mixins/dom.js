export default {
  methods: {
    hasClass: function (ele, cls) {
      return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
    },
    addClass: function (ele, cls) {
      if (!this.hasClass(ele, cls)) {
        const newClass = ele.className + ' ' + cls
        ele.className = newClass.trim()
      }
    },
    removeClass: function (ele, cls) {
      if (this.hasClass(ele, cls)) {
        const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
        ele.className = ele.className.replace(reg, ' ').trim()
      }
    }
  }
}
