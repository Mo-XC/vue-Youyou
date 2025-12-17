<script setup>
  import {ref} from "vue";
  import router from "@/router/index.js";

  const selectedOption = ref(null)

  // 点击卡片触发的方法
  const handleSelect = (option) => {
    // 如果点击的是已选中的卡片，则取消选择（也就是将值设置为null），否则选中它
    selectedOption.value = selectedOption.value === option ? null : option
  }

  // 根据选中状态，获取按钮应该显示的文字
  const getButtonText = () => {
    return selectedOption.value
    ? `开始${selectedOption.value}测试，游游启动！` : '请选择测试方案'
  }

  // 修改跳转方法，添加版本参数
  const startTest = () => {
    if (selectedOption.value) {
      router.push({
        path: '/test',
        query: {
          version: selectedOption.value
        }
      })
    }
  }
</script>

<template>
  <div class="test-page">
    <section class="text-center">
      <div class="logo">游游人格屋</div>
      <h2 class="title">了解自我，从MBTI测试开始</h2>
      <p class="prompt">请选择您的测试方案</p>
    </section>
    <section class="option">
      <el-row justify="center">
        <el-col :lg="4" :md="10">
<!--          v-bind动态绑定，{ 类名 : 条件 } 当后面的条件成立时，才会给容器添加前面的css属性 -->
<!--          :class="{ 'card-selected' : selectedOption === '简洁版' }"-->
          <div
              class="option-card"
              :class="{ 'card-selected' : selectedOption === '简洁版' }"
              @click="handleSelect('简洁版')"
          >
            <h3>简洁版</h3>
            <p class="desc">28题，快速了解自我</p>
          </div>
        </el-col>
        <el-col :lg="4" :md="10" class="mx-8">
          <div
              class="option-card"
              :class="{ 'card-selected' : selectedOption === '普通版' }"
              @click="handleSelect('普通版')"
          >
            <h3>普通版</h3>
            <p class="desc">100题，了解自我</p>
          </div>
        </el-col>
        <el-col :lg="4" :md="10">
          <div
              class="option-card"
              :class="{ 'card-selected' : selectedOption === '完整版' }"
              @click="handleSelect('完整版')"
          >
            <h3>完整版</h3>
            <p class="desc">180题，全面刨析自我</p>
          </div>
        </el-col>
      </el-row>
      <el-button
          :type="selectedOption ? 'primary' : 'info'"
          :class="{ 'button-flow' : selectedOption }"
          class="mt-16 h-14 w-80 rounded-full"
          size="large"
          :disabled="!selectedOption"
          @click="startTest"
      >
        {{ getButtonText() }}
      </el-button>
    </section>
  </div>
</template>

<style scoped>
.logo {
  @apply text-xl text-transparent
  bg-gradient-to-r from-pink-500 to-blue-500
  font-bold bg-clip-text inline-block
  bg-[length:200%_auto] animate-gradient-flow
  mt-10;
}
.title {
  @apply text-3xl font-bold text-gray-700 mt-10;
}
.prompt {
  @apply text-xl text-gray-500 mt-10;
}
.option {
  @apply mt-20 text-center;
}
.option-card {
  @apply h-60 w-60 text-center flex flex-col items-center justify-center
  rounded-3xl bg-indigo-50 shadow-lg p-8 mx-auto /* 设置 mx-auto 解决卡片的微小偏移 */
  hover:bg-indigo-100 hover:shadow-2xl
  active:bg-indigo-200 active:shadow-2xl;
}
.option-card h3 {
  @apply text-2xl font-bold text-gray-800 mb-2;
}
.option-card .desc {
  @apply text-gray-600;
}

/* ---------- 卡片选中效果：静态渐变 ---------- */
.card-selected {
  /* 1. 移除默认背景、边框和悬停效果，应用新渐变 */
  @apply border-0 shadow-xl; /* 增加阴影突出选中 */
  /* 2. 设置一个从左到右的静态渐变背景 */
  background: linear-gradient(135deg, #ec4899, #3b82f6) !important; /* indigo-300 到 indigo-400 */
  /* 3. 选中后，卡片内所有文字变为白色，确保可读性 */
  color: white;
}
/* 4. 确保卡片内部的标题和描述文字也变为白色 */
.card-selected h3 {
  @apply text-white;
}
.card-selected .desc {
  @apply text-gray-200; /* 使用浅灰色，比纯白层次感稍弱 */
}

/* ---------- 按钮流光效果 ---------- */
.button-flow {
  @apply border-0 text-white font-bold shadow-xl
  bg-[length:200%_auto] animate-gradient-flow;
  /* 核心：使用三层渐变色 */
  background-image: linear-gradient(90deg,
  #ec4899,    /* pink-500 */
  #8b5cf6,    /* purple-500 */
  #3b82f6     /* blue-500 */
  ) !important;
}
/* 按钮悬停时，使用更亮的三层渐变 */
.button-flow:hover {
  @apply shadow-2xl;
  background-image: linear-gradient(90deg,
  #f472b6,    /* pink-400 */
  #a78bfa,    /* purple-400 */
  #60a5fa     /* blue-400 */
  ) !important;
}
</style>