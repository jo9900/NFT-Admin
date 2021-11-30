import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../layout/Index.vue'
import Login from '@/views/Login.vue'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(VueRouter)
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/',
    redirect: '/goods',
    meta: {
      isAuthenticated: true,
    },
    name: 'dashboard',
    component: Layout,
    children: [
      {
        path: '/goods',
        name: 'goods',
        meta: {
          isAuthenticated: true,
        },
        component: () =>
          import(/* webpackChunkName: "goods" */ '../views/Goods.vue'),
      },
      {
        path: '/detail/:id',
        name: 'detail',
        meta: {
          isAuthenticated: true,
        },
        component: () =>
          import(/* webpackChunkName: "goods" */ '../views/GoodsDetail.vue'),
      },
      {
        path: '/orders',
        name: 'orders',
        meta: {
          isAuthenticated: true,
        },
        component: () =>
          import(/* webpackChunkName: "orders" */ '../views/Orders.vue'),
      },
      {
        path: '/fee',
        name: 'fee',
        meta: {
          isAuthenticated: true,
        },
        component: () =>
          import(/* webpackChunkName: "fee" */ '../views/Fee.vue'),
      },
      {
        path: '/banner',
        name: 'banner',
        meta: {
          isAuthenticated: true,
        },
        component: () =>
          import(/* webpackChunkName: "banner" */ '../views/Banner.vue'),
      },
    ],
  },
  {
    path: '/test5080',
    name: 'test5080',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../demo.vue'),
  },
  {
    path: '*',
    redirect: '/notfound',
  },
  {
    path: '/notfound',
    name: 'notfound',
    component: () => import('../views/NotFound.vue'),
  },
]

const router = new VueRouter({
  routes,
})
router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.isAuthenticated && !localStorage.getItem('account'))
    next({ name: 'login' })
  else next()
})
router.afterEach((to, from) => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
})
export default router
