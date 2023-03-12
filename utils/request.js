import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import cookie from 'js-cookie'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost',
  timeout: 150000 // 请求超时时间
})
// http request 拦截器
service.interceptors.request.use(
  config => {
    // token 先不处理，后续使用时在完善
    //判断cookie是否有token值
    if(cookie.get('token')) {
      //token值放到cookie里面
      config.headers['token']=cookie.get('token')
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })
// http response 拦截器
service.interceptors.response.use(
  response => {
    //状态码是208，后端网关做了校验
    if(response.data.code === 208) {
      console.log("未登录，请登录....")
      //弹出登录输入框
      loginEvent.$emit('loginDialogEvent')
      return
    } else {
      // console.log("数据状态..")
      if (response.data.code !== 200) {
        // console.log("数据不正常....")
        console.log("当前数据是：",response.data)
        Message({
          message: response.data.message,
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(response.data)
      } else {
        // console.log("数据正常....")
        return response.data
      }
    }

  },
  error => {
    return Promise.reject(error.response)
  })
export default service
