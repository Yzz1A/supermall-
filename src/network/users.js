import { request } from 'network/request'

//获取用户列表
export function getUserList(params) {
  return request({
    url: 'users',
    params: params,
  })
}

//改变用户状态
export function changeUserStatus(url) {
  return request({
    url: url,
    method: 'PUT',
  })
}

//添加用户
export function addUser(data) {
  return request({
    url: 'users',
    method: 'POST',
    data: data,
  })
}

//根据 id 获取用户信息
export function getUserById(url) {
  return request({
    url: url,
  })
}

//修改并提交用户
export function submitEditUser(url, data) {
  return request({
    url: url,
    method: 'PUT',
    data: data,
  })
}

//根据 id 删除用户
export function deleteUserById(url) {
  return request({
    url: url,
    method: 'DELETE',
  })
}

//分配用户角色
export function allotRole(url, data) {
  return request({
    url: url,
    method: 'PUT',
    data: data,
  })
}
