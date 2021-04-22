import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('components/Login')

const Home = () => import('views/home/Home')
const Welcome = () => import('views/home/childcomponents/Welcome')
const Users = () => import('views/user/Users')
const Rights = () => import('views/power/Rights')
const Roles = () => import('views/power/Roles')
const Cate = () => import('views/goods/Cate')
const Params = () => import('views/goods/Params')
const GoodsList = () => import('views/goods/GoodsList')
const GoodsAdd = () => import('views/goods/GoodsAdd')

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
    ],
  },
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

export default router
