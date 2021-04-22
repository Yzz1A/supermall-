import { request } from 'network/request'

//获取分类列表
export function getCateList() {
  return request({
    url: 'categories',
    method: 'GET',
  })
}

//获取参数列表
export function getParams(url, params) {
  return request({
    url: url,
    method: 'GET',
    params: params,
  })
}

//添加商品
export function addGoods(data) {
  return request({
    url: 'goods',
    method: 'POST',
    data: data,
  })
}
