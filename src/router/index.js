import {
    createRouter, // 创建路由
    createWebHashHistory // 创建history模式
} from 'vue-router'

import LoginPage from '@/pages/LoginPage.vue'
import NotFound from '@/pages/404.vue'
import IndexPage from "@/pages/IndexPage.vue";
import TestHomePage from "@/pages/TestHomePage.vue";
import TestPaperPage from "@/pages/TestPaperPage.vue";
import ResultPage from "@/pages/ResultPage.vue";
import AboutPage from "@/pages/AboutPage.vue";

const routes = [{
    path : '/',
    redirect : '/index'
}, {
    path: '/about',
    component: AboutPage
}, {
    path : '/result',
    component: ResultPage
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