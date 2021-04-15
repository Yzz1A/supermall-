import Vue from "vue";
import VueRouter from "vue-router";

const Login = () => import("components/Login");

const Home = () => import("views/home/Home");
const Welcome = () => import("views/home/childcomponents/Welcome");
const Users = () => import("views/home/childcomponents/Users");

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" }, //主页重定向到登录页
  { path: "/login", component: Login }, //登录页
  {
    path: "/home",
    component: Home,
    children: [
      { path: "", redirect: "welcome" },
      { path: "welcome", component: Welcome },
      { path: "/users", component: Users }, //这里要加 /
    ],
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
