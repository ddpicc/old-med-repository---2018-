//路由页面

import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Detail from '@/components/Detail'
import Order from '@/components/Order'
import OrderManage from '@/components/OrderManage'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Order',
      component: Order
    },
    {
      path : '/league/:name',
      name : 'Detail',
      component : Detail
    },
    {
      path : '/DataOper',
      name : 'DataOper',
      component : List
    },
    {
      path : '/Order',
      name : 'OrderManage',
      component : OrderManage
    }
  ]
})
