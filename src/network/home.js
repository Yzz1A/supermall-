import { request } from "network/request";

export function getMenuList() {
  return request({
    url: "menus",
  });
}

export function getUserList() {
  return request({
    url: "users",
    params: { query: "", pagenum: 1, pagesize: 2 },
  });
}

export function getUserList1(params) {
  return request({
    url: "users",
    params: params,
  });
}

export function changeUserStatus(url) {
  return request({
    url: url,
    method: "PUT",
  });
}

export function addUser(data) {
  return request({
    url: "users",
    method: "POST",
    data: data,
  });
}

export function editUser(url) {
  return request({
    url: url,
  });
}

export function submitEditUser(url, data) {
  return request({
    url: url,
    method: "PUT",
    data: data,
  });
}

export function deleteUserById(url) {
  return request({
    url: url,
    method: "DELETE",
  });
}
