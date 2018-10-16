//路由页面

import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Order from '@/components/Order'
import Home from '@/components/home'
import OrderManage from '@/components/OrderManage'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import CreateOrd from '@/components/CreateOrder'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: '/Dashboard',
      leaf: true,
      menuShow: true,
      children: [
        {path: '/Dashboard', component: Dashboard, name: '首页', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: 'Order',
      menuShow: true,
      leaf: true, // 只有一个节点
      children: [
        {path: '/Order', component: Order, name: '生成订单', menuShow: true}
      ]
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/CreateOrd',
      name: 'Create Order',
      component: CreateOrd,
    },
    {
      path: '/',
      component: Home,
      name: '药品管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      children: [
        {path: '/DataOper', component: List, name: '药品列表', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '订单管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      children: [
        {path: '/OrderManage', component: OrderManage, name: '订单列表', menuShow: true}
      ]
    }
  ]
})
