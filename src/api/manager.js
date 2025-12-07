import axios from '~/axios.js' // 这里拿到的是 axios.js 里面 export 出来的数据

export function login(username, password) {
    // 这里的/admin/login 就是请求的接口，前面的一大截在axios.js中定义了baseUIR
    // 这里返回Promise对象，Promise 是 JavaScript 中处理异步操作的对象，它代表一个将来会完成的操作。

    // 使用URLSearchParams构建表单数据
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    return axios.post('/admin/login', params, { // 接口文档中路径为 admin/login
        headers : {
            // 后端只接受application/x-www-form-urlencoded格式的表单数据
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

export function getInfo() {
    return axios.post('/admin/getinfo', null, {
        headers: {
            // 后端只接受application/x-www-form-urlencoded格式的表单数据
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}