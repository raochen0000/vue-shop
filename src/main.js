import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import axios from 'axios'
axios.defaults.baseURL = 'http://liufusong.top:8888/api/private/v1'
Vue.prototype.$axios = axios
import './assets/css/global.css' //导入全局样式表
import './assets/fonts/iconfont.css' //导入字体图标
import { Form, FormItem, Input, Button, Message } from 'element-ui';

Vue.use(Button)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Form)
Vue.prototype.$message = Message

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
