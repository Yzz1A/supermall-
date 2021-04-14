import Vue from "vue";
import VueRouter from "vue-router";

const Login = () => import("components/Login");

const Home = () => import("views/Home");

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" }, //主页重定向到登录页
  { path: "/login", component: Login }, //登录页
  { path: "/home", component: Home },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
