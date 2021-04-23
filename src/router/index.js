import Vue from 'vue'
import VueRouter from 'vue-router'

/* const Login = () => import('components/Login')
const Home = () => import('views/home/Home')
const Welcome = () => import('views/home/childcomponents/Welcome')
const Users = () => import('views/user/Users')
const Rights = () => import('views/power/Rights')
const Roles = () => import('views/power/Roles')
const Cate = () => import('views/goods/Cate')
const Params = () => import('views/goods/Params')
const GoodsList = () => import('views/goods/GoodsList')
const GoodsAdd = () => import('views/goods/GoodsAdd')
const Order = () => import('views/order/Order')
const Report = () => import('views/report/Report') */

const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ 'components/Login')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ 'views/home/Home')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ 'views/home/childcomponents/Welcome')
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'views/user/Users')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'views/power/Rights')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'views/power/Roles')
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ 'views/goods/Cate')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ 'views/goods/Params')
const GoodsList = () => import(/* webpackChunkName: "GoodsList_GoodsAdd" */ 'views/goods/GoodsList')
const GoodsAdd = () => import(/* webpackChunkName: "GoodsList_GoodsAdd" */ 'views/goods/GoodsAdd')
const Order = () => import(/* webpackChunkName: "Order_Report" */ 'views/order/Order')
const Report = () => import(/* webpackChunkName: "Order_Report" */ 'views/report/Report')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' }, //主页重定向到登录页
  { path: '/login', component: Login }, //登录页
  {
    path: '/home',
    component: Home,
    children: [
      { path: '', redirect: 'welcome' },
      { path: 'welcome', component: Welcome },
      { path: '/users', component: Users }, //这里要加 /
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: GoodsAdd },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report },
    ],
  },
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

export default router
