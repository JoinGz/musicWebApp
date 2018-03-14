import Vue from 'vue'
import App,{router3} from './App.vue'
//require("./assets/css/font-awesome.css")
require("./assets/css/app.css")
import VueRouter from "vue-router"
Vue.use(VueRouter);
import axios from 'axios'
Vue.prototype.$http = axios
new Vue({
  el: '#app',
  router:router3,
  render: h => h(App)
})
