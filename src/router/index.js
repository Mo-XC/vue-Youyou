import {
    createRouter, // 创建路由
    createWebHashHistory // 创建history模式
} from 'vue-router'

import Home from '@/pages/Home.vue'
import LoginPage from '@/pages/LoginPage.vue'
import NotFound from '@/pages/404.vue'
import IndexPage from "@/pages/IndexPage.vue";
import TestHomePage from "@/pages/TestHomePage.vue";
import TestPaperPage from "@/pages/TestPaperPage.vue";
import Result from "@/pages/Result.vue";

const routes = [{
    path : '/',
    redirect : '/index'
}, {
    path : '/result',
    component: Result
}, {
    path : '/test',
    component: TestPaperPage
},{
    path : '/select-test',
    component: TestHomePage
},{
    path : '/index',
    component: IndexPage
}, {
    path : '/home',
    component : Home
}, {
    path : '/login',
    component : LoginPage
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