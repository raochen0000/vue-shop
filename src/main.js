import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import treeTable from 'vue-table-with-tree-grid'
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
  Option, Cascader, Alert, Tabs, TabPane,
} from 'element-ui';


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


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
