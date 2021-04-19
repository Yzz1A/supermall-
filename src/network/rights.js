import { request } from 'network/request'

//获取所有权限 list形式
export function getRightsList() {
  return request({
    url: 'rights/list',
  })
}
