import { request } from 'network/request'

//获取商品列表
export function getProductList(queryInfo) {
  return request({
    url: 'goods',
    method: 'GET',
    params: queryInfo,
  })
}

//删除商品
export function removeGoodsById(url) {
  return request({
    url: url,
    method: 'DELETE',
  })
}
