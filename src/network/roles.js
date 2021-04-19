import { request } from 'network/request'

//获取角色列表
export function getRoleList() {
  return request({
    url: 'roles',
  })
}

//根据 id 查询角色
export function getRoleById(url) {
  return request({
    url: url,
  })
}

//添加角色
export function addRole(data) {
  return request({
    url: 'roles',
    data: data,
    method: 'POST',
  })
}

//编辑并提交角色
export function editSubmitRole(url, data) {
  return request({
    url: url,
    method: 'PUT',
    data: data,
  })
}

//根据 id 删除角色
export function deleteRoleById(url) {
  return request({
    url: url,
    method: 'DELETE',
  })
}

//获取所有权限 tree形式
export function getRightsList() {
  return request({
    url: 'rights/tree',
  })
}

//给角色授权
export function setRights(url, data) {
  return request({
    url: url,
    method: 'POST',
    data: data,
  })
}
