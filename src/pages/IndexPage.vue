<template>
  <div class="home-page">
    <!-- 1. 导航栏 -->
    <header class="app-header">
      <div class="header-container">
        <div class="logo flowing_light">游游人格屋</div>
        <nav class="nav-menu">
          <a class="nav-link" @click="router.push('/types')">人格库</a>
          <a class="nav-link" @click="router.push('/about')">关于</a>
          <a class="nav-link" @click="router.push('/login')" v-if="!isLoggedIn">登录</a>
        </nav>
      </div>
    </header>

    <!-- 2. 英雄区域 -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title flowing_light">发现未知的自己</h1>
          <p class="hero-description">
            通过专业的MBTI性格测试，深入了解你的个性特征、优势与挑战
          </p>
          <el-button
              type="primary"
              size="large"
              round
              @click="router.push('/select-test')"
              class="hero-button"
          >
            开始免费测试
          </el-button>
        </div>
        <div class="hero-decoration">
          <!-- 简单的装饰性图形，后续可替换为SVG -->
          <div class="decoration-circle"></div>
          <div class="decoration-square"></div>
        </div>
      </div>
    </section>

    <!-- 3. 人格类型预览 -->
    <section class="types-section">
      <div class="section-container">
        <h2 class="section-title">探索16型人格</h2>
        <p class="section-subtitle">了解每一种独特的人格类型，发现你与他人的异同</p>

        <div class="types-grid">
          <el-card
              v-for="type in previewTypes"
              :key="type.code"
              class="type-card"
              shadow="hover"
              @click="router.push(`/types/${type.code}`)"
          >
            <div class="type-content">
              <h3 class="type-code">{{ type.code }}</h3>
              <h4 class="type-name">{{ type.name }}</h4>
              <p class="type-desc">{{ type.description }}</p>
            </div>
          </el-card>
        </div>

        <el-button
            type="text"
            class="view-all-btn"
            @click="router.push('/types')"
        >
          浏览全部人格类型 →
        </el-button>
      </div>
    </section>

    <!-- 4. 页脚 -->
    <footer class="app-footer">
      <div class="footer-container">
        <p class="copyright">© 2025 游游人格屋 | 一个由兴趣驱动的MBTI探索项目</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElCard } from 'element-plus'

const router = useRouter()
const isLoggedIn = ref(false)

// 预览的人格类型数据
const previewTypes = ref([
  { code: 'ISTP', name: '鉴赏家', description: '冷静、灵活的问题解决者' },
  { code: 'INTJ', name: '建筑师', description: '富有想象力和战略性的思想家' },
  { code: 'ESTJ', name: '总经理', description: '优秀的管理者，执行力强' },
  { code: 'ENFP', name: '竞选者', description: '热情、有创造力的社交达人' },
  { code: 'INFJ', name: '提倡者', description: '富有想象力的理想主义者' },
  { code: 'ENTP', name: '辩论家', description: '聪明好奇的思想者' },
  { code: 'ISFJ', name: '守护者', description: '忠诚周到的保护者' },
  { code: 'ESFP', name: '表演者', description: '精力充沛的娱乐者' }
])
</script>

<style scoped>
/* 基础布局 */
.home-page {
  @apply min-h-screen flex flex-col;
}

/* 导航栏样式 */
.app-header {
  @apply bg-white shadow-sm py-4;
}

.header-container {
  @apply container mx-auto px-4 flex justify-between items-center;
}

.logo {
  @apply text-2xl font-bold cursor-pointer;
}

.nav-menu {
  @apply flex gap-8;
}

.nav-link {
  @apply text-gray-700 hover:text-blue-500 cursor-pointer transition-colors duration-200;
}

/* 英雄区域样式 */
.hero-section {
  @apply py-16 bg-gradient-to-br from-blue-50 to-indigo-50;
}

.hero-container {
  @apply container mx-auto px-4 flex flex-col md:flex-row items-center justify-between;
}

.hero-content {
  @apply max-w-xl text-center md:text-left mb-10 md:mb-0 ml-20;
}

.hero-title {
  @apply text-4xl md:text-5xl font-bold mb-4;
}

.hero-description {
  @apply text-lg text-gray-600 mb-8;
}

.hero-button {
  @apply text-lg px-8 py-6;
}

.hero-decoration {
  @apply relative w-64 h-64;
}

.decoration-circle {
  @apply absolute w-48 h-48 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 opacity-70;
}

.decoration-square {
  @apply absolute w-32 h-32 -bottom-4 -right-4 bg-gradient-to-r from-pink-200 to-yellow-200 opacity-70 transform rotate-12;
}

/* 人格类型区域样式 */
.types-section {
  @apply py-16 bg-white;
}

.section-container {
  @apply container mx-auto px-4;
}

.section-title {
  @apply text-3xl font-bold text-center mb-4 text-gray-800;
}

.section-subtitle {
  @apply text-gray-600 text-center mb-12 max-w-2xl mx-auto;
}

.types-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12;
}

.type-card {
  @apply cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1;
}

.type-content {
  @apply p-6 text-center;
}

.type-code {
  @apply text-2xl font-bold text-blue-500 mb-2;
}

.type-name {
  @apply text-lg font-semibold text-gray-800 mb-2;
}

.type-desc {
  @apply text-gray-600 text-sm;
}

.view-all-btn {
  @apply block mx-auto text-lg text-blue-500 hover:text-blue-600;
}

/* 页脚样式 */
.app-footer {
  @apply bg-gray-50 py-6 mt-auto;
}

.footer-container {
  @apply container mx-auto px-4 text-center;
}

.copyright {
  @apply text-gray-500 text-sm;
}

/* 流光文字效果 */
.flowing_light {
  @apply text-transparent from-pink-500 to-blue-500 bg-gradient-to-r
  bg-clip-text font-bold bg-[length:200%_auto] animate-gradient-flow;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .hero-title {
    @apply text-3xl;
  }

  .types-grid {
    @apply grid-cols-2 gap-4;
  }
}

@media (max-width: 640px) {
  .types-grid {
    @apply grid-cols-1 max-w-xs mx-auto;
  }

  .nav-menu {
    @apply gap-4;
  }
}
</style>