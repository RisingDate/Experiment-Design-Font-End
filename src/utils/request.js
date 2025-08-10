import axios from 'axios'
import router from "@/router/index.js"

const request = axios.create({
  baseURL: "/api",
  timeout: 15000
})

// request 拦截器
request.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json;charset=utf-8';
  return config
}, error => {
  return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
  response => {
    let res = response.data;
    if (response.config.responseType === 'blob') {
      return res
    }
    if (typeof res === 'string') {
      res = res ? JSON.parse(res) : res
    }
    return res;
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)


export default request

