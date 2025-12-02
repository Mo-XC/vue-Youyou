import {
    createRouter, // 创建路由
    createWebHashHistory // 创建history模式
} from 'vue-router'

import Home from '~/pages/Home.vue'
import Login from '~/pages/login.vue'
import NotFound from '~/pages/404.vue'

const routes = [{
    path : '/',
    redirect : '/login'
}, {
    path : '/home',
    component : Home
}, {
    path : '/login',
    component : Login
}, {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
}] // 路由

const router = createRouter({
    history: createWebHashHistory(),
    routes : routes
})

export default router // 暴露路由