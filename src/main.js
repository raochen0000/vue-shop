import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import treeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import _ from "lodash";

Vue.use(_)

Vue.use(VueQuillEditor, /* { default global options } */)

Vue.component('tree-table', treeTable)

import axios from 'axios'
//添加axios请求拦截器来添加token,以保证拥有数据的权限
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token');
  // console.log(config);
  return config;
})
axios.defaults.baseURL = 'http://42.192.71.221:8889/api/private/v1'
Vue.prototype.$axios = axios
import './assets/css/global.css' //导入全局样式表
import './assets/fonts/iconfont.css' //导入字体图标
import {
  Form, FormItem, Input, Button, Message, Container, Header, Aside, Main,
  Submenu, MenuItemGroup, Menu, MenuItem, Row, Col, Card, Breadcrumb, BreadcrumbItem,
  Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Tree, Select,
  Option, Cascader, Alert, Tabs, TabPane, Step, Steps, CheckboxGroup, Checkbox, Upload
} from 'element-ui';


Vue.use(Upload)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tree)
Vue.use(Tag)
Vue.prototype.$confirm = MessageBox
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Button)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Form)
Vue.prototype.$message = Message
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)


/* 时间过滤器 */
Vue.filter('dateFormat', dateVal => {
  const time = new Date(dateVal);
  const y = time.getFullYear();
  const m = (time.getMonth() + 1 + '').padStart(2, 0);
  const d = (time.getDate() + '').padStart(2, 0);
  const hh = (time.getHours() + '').padStart(2, 0);
  const mm = (time.getMinutes() + '').padStart(2, 0);
  const ss = (time.getSeconds() + '').padStart(2, 0);
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
