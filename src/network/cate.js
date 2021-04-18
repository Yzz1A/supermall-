import { request } from "network/request";

//获取分类列表
export function getCateList(queryInfo) {
  return request({
    url: "categories",
    method: "GET",
    params: queryInfo,
  });
}

//获取父级分类的数据列表
export function getParentCateList() {
  return request({
    url: "categories",
    method: "GET",
    params: { type: 2 },
  });
}

//添加分类
export function addClass(data) {
  return request({
    url: "categories",
    method: "POST",
    data: data,
  });
}

//根据 id 查询分类
export function getCateById(url) {
  return request({
    url: url,
  });
}

//编辑提交分类
export function editCateById(url, data) {
  return request({
    url: url,
    method: "PUT",
    data: data,
  });
}

//删除分类
export function removeCateById(url) {
  return request({
    url: url,
    method: "delete",
  });
}
