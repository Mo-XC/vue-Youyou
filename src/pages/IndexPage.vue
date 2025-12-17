<template>
  <div class="home-page">
    <!-- 1. 导航栏区域：可以直接复用你现有项目的导航，或先简单实现 -->
    <el-header class="header">
      <div class="logo flowing_light">游游人格屋</div>
<!--      :router 点击导航栏时，可以直接通过index进行跳转-->
      <el-menu mode="horizontal" :router="true">
        <el-menu-item index="/types">人格库</el-menu-item>
        <el-menu-item index="/about">关于</el-menu-item>
        <el-menu-item index="/login">登录</el-menu-item>
        <!-- 如果用户已登录，显示用户信息 -->
<!--        v-if 决定 “登录”是否显示，只有显示出来了，index才能继续发挥作用-->
        <el-menu-item v-if="!isLoggedIn" index="/login">登录</el-menu-item>
      </el-menu>
    </el-header>

    <!-- 2. 核心英雄区 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title flowing_light">发现未知的自己</h1>
        <p class="hero-description">
          通过专业的MBTI性格测试，深入了解你的个性特征、优势与可能面临的挑战。
        </p>
        <!-- 使用大按钮，并绑定点击事件跳转到测试页 -->
        <el-button
            type="primary"
            size="large"
            round
            @click="router.push('/select-test')"
            class="mt-3"
        >
          开始免费测试
        </el-button>
      </div>
      <!-- 这里可以放一张SVG插画或背景图 -->
      <div class="hero-image">[在此处放置插图]</div>
    </section>

    <!-- 3. 人格预览区 -->
    <section class="preview-section">
      <h2>探索16型人格</h2>
      <p>了解每一种独特的人格类型，发现你与他人的异同。</p>
      <!-- 使用el-row和el-col创建网格 -->
      <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :md="6" v-for="type in previewTypes" :key="type.code">
          <el-card shadow="hover" class="type-card" @click="router.push(`/types/${type.code}`)">
            <h3>{{ type.code }}</h3>
            <p>{{ type.name }}</p>
            <p class="description">{{ type.description }}</p>
          </el-card>
        </el-col>
      </el-row>
      <el-button type="text" @click="router.push('/types')">浏览全部人格类型 →</el-button>
    </section>

    <!-- 4. 页脚 -->
    <el-footer class="footer">
      <p>© 2025 游游人格屋. 一个由兴趣驱动的MBTI探索项目。</p>
    </el-footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()

// 状态：是否登录（可以先模拟）
const isLoggedIn = ref(false)
// 状态：用于预览的几种人格类型数据（先用静态数据模拟）
const previewTypes = ref([
  { code: 'ISTP', name: '鉴赏家', description: '冷静、灵活的问题解决者' },
  { code: 'INTJ', name: '建筑师', description: '富有想象力和战略性的思想家' },
  { code: 'ESTJ', name: '总经理', description: '优秀的管理者，执行力强' },
  { code: 'ENFP', name: '竞选者', description: '热情、有创造力的社交达人' },
  // 可以再添加4个...
])

// 生命周期：可以在这里调用接口，获取真实数据
onMounted(() => {
  // 例如：fetchPreviewTypes()
})
</script>

<style scoped>
/* 这里只写最基础的布局样式，具体美化你可以自由发挥 */
.home-page {
  @apply min-h-screen flex flex-col;
}
.header {
  @apply flex justify-between items-center;
}
.hero-section {
  @apply flex items-center justify-around py-16 px-5 bg-gradient-to-tr from-gray-50 to-gray-300;
}
.hero-content {
  @apply max-w-md;
}
.hero-title {
  @apply text-5xl mb-5;
}
.preview-section {
  @apply py-16 px-5 text-center;
}
.type-card {
  @apply mt-1 mb-5 cursor-pointer h-[180px];
}
.type-card h3 {
  @apply text-[#409eff];
}
.footer {
  @apply mt-auto text-center p-5 bg-gray-50;
}
.logo {
  @apply text-xl;
}
.flowing_light {
  @apply text-transparent from-pink-500 to-blue-500 bg-gradient-to-r
  bg-clip-text font-bold bg-[length:200%_auto] animate-gradient-flow;
}
</style>