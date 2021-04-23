import { request } from 'network/request'

//获取订单列表
export function getOrderList(queryInfo) {
  return request({
    url: 'orders',
    method: 'GET',
    params: queryInfo,
  })
}

//物流信息  接口有问题 无对应物流公司
export function logistics() {
  return request({
    url: `kuaidi/1106975712662`,
    method: 'get',
  })
}
