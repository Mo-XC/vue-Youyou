import axios from "axios"
import { ElNotification } from 'element-plus'
import { useCookies } from '@vueuse/integrations/useCookies'

// baseURL 就是 根域名
const service = axios.create({
    baseURL:"/api"
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么

    // 往header头自动添加token
    const cookies = useCookies()
    const token = cookies.get('moxc-token')
    if (token) { // 如果有token，则自动添加token
        config.headers["token"] = token
    }

    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 直接返回整个响应数据
    return response;
}, function (error) {
    // 对响应错误做点什么
    ElNotification({
        // 提示内容，如果左边没有内容，则展示默认的 “请求失败”
        message: error.message || "请求失败",
        type: 'error', // 提示类型
    })

    return Promise.reject(error);
});

export default service