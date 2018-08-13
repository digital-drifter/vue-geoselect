import Vue from 'vue'
import App from './App'
/** Custom Plugins */
import LeafletPlugin from './plugins/leaflet'
import GeodataPlugin from './plugins/geodata'
import StoragePlugin from './plugins/storage'
import { IPPlugin } from './plugins/ip'
/** BootstrapVue Component Groups */
import { Button, ButtonToolbar, Form, FormSelect, Jumbotron, Layout, Nav, Navbar, Progress } from 'bootstrap-vue/es/components'

/** Shim WebRTCConnection */
import 'webrtc-adapter'

/** Vendor Styles */
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'leaflet/dist/leaflet.css'

/** Application Styles */
import './assets/app.styl'

Vue.config.productionTip = false

/** BootstrapVue Component Groups */
Vue.use(Button)
Vue.use(ButtonToolbar)
Vue.use(Form)
Vue.use(FormSelect)
Vue.use(Jumbotron)
Vue.use(Layout)
Vue.use(Nav)
Vue.use(Navbar)
Vue.use(Progress)

/** Custom Plugins */
Vue.use(IPPlugin)
Vue.use(LeafletPlugin)
Vue.use(StoragePlugin, {
  key: 'vue-geoselect',
  storage: 'local'
})
// Vue.use(GeodataPlugin, {
//   baseUrl: '//geodata.solutions',
//   endpoints: {
//     list: {
//       path: '/api/api.php?',
//       params: {
//         type: 'getCountries',
//         addClasses: 'order-alpha',
//         countryId: undefined,
//         stateId: undefined,
//         cityId: undefined
//       }
//     },
//     rest: {
//       path: '/restapi?',
//       params: {
// country: null,
// state: null,
// city: null,
// orderby: null,
// limit: 10
//       }
//     }
//   }
// })

new Vue({
  el: '#app',
  render: h => h(App)
})
