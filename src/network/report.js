import { request } from 'network/request'

//获取分类列表
export function getReport() {
  return request({
    url: 'reports/type/1',
    method: 'GET',
  })
}
