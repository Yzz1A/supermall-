import { request } from "network/request";

export function loginRequest(loginForm) {
  return request({
    url: "login",
    method: "POST",
    data:loginForm
  });
}
