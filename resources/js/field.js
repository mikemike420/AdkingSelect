Nova.booting((Vue, router, store) => {
  Vue.component('index-adking-select', require('./components/IndexField'))
  Vue.component('detail-adking-select', require('./components/DetailField'))
  Vue.component('form-adking-select', require('./components/FormField'))
})
