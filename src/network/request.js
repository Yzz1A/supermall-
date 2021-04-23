import axios from 'axios'
//导入 NProgress 对应的js
import NProgress from 'nprogress'

export function request(config) {
  //1.创建axios实例
  //instance 这个实例本身就是 Promise 对象,所以直接返回
  const instance = new axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/', //请求跟路径
  })

  //2.拦截器
  //请求拦截  在此展示进度条 NProgress.start()
  instance.interceptors.request.use(
    (config) => {
      //console.log(config);
      //展示进度条
      NProgress.start()

      //为请求头对象添加 token 验证的 Authorization 字段
      config.headers.Authorization = window.sessionStorage.getItem('token')
      return config
    },
    (err) => {}
  )
  //响应拦截  在此隐藏进度条 NProgress.done()
  instance.interceptors.response.use(
    (res) => {
      //隐藏进度条
      NProgress.done()

      return res.data //这里需要的是data信息  所以返回了 res.data
    },
    (err) => {
      console.log(err)
    }
  )

  //3.发送网络请求
  return instance(config)
}
