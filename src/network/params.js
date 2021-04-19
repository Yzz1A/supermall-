import { request } from 'network/request'

//获取分类列表
export function getCateList() {
  return request({
    url: 'categories',
    method: 'GET',
  })
}

//获取参数
export function getParams(url, params) {
  return request({
    url: url,
    method: 'GET',
    params: params,
  })
}

//添加参数
export function addAttributes(url, data) {
  return request({
    url: url,
    method: 'POST',
    data: data,
  })
}

//根据id查询参数
export function getParamsById(url, params) {
  return request({
    url: url,
    method: 'GET',
    params: params,
  })
}

//编辑提交参数
export function editParamsById(url, data) {
  return request({
    url: url,
    method: 'PUT',
    data: data,
  })
}

//删除参数
export function deleteParamsById(url) {
  return request({
    url: url,
    method: 'DELETE',
  })
}
