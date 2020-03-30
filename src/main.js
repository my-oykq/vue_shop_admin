import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import TreeTable from 'vue-table-with-tree-grid'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
// 挂载原型对象上添加$http方法，
// 在调用方法的时候通过this调用this.$http.post(url)，每个实例对象都能访问到
Vue.prototype.$http = axios

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config =>{
  // console.log(config)
  // 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false
// Vue.use(TreeTable)
Vue.use(ElementUI)
// 注册全局可用组件

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
