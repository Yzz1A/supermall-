import axios from "axios";

export function request(config) {
  //1.创建axios实例
  //instance 这个实例本身就是 Promise 对象,所以直接返回
  const instance = new axios.create({
    baseURL: "http://127.0.0.1:8888/api/private/v1/", //请求跟路径
  });

  //2.拦截器
  //请求拦截
  instance.interceptors.request.use(
    (config) => {
      //2.1 例如config中信息不符合服务器要求
      //2.2 发送网络请求是希望在页面显示加载图标
      //2.3某些网络请求,必须携带一些特殊信息(比如登陆的token)
      //最后需要把结果重新返回
      return config;
    },
    (err) => {}
  );
  //响应拦截
  instance.interceptors.response.use(
    (res) => {
      return res.data; //这里需要的是data信息  所以返回了 res.data
    },
    (err) => {
      console.log(err);
    }
  );

  //3.发送网络请求
  return instance(config);
}
