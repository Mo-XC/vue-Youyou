<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {ElLoading, ElMessage} from 'element-plus'
import {ArrowLeft, ArrowRight, Finished, Loading} from '@element-plus/icons-vue'
import {getTestQuestions, submitTestAnswers} from "@/api/test.js";

// 1. 定义响应式数据 - 这些将来会由后端API替换
// 示例：30个MBTI测试题目，每个维度约7-8题
const questions = ref([])

// 当前题号索引（从0开始）
const currentIndex = ref(0)
// 用户答案数组，与questions一一对应，初始为null表示未答
// map 是 JavaScript 数组的方法，用于遍历数组并返回一个新数组 不会改变原数组
// () => null 返还null
const answers = ref([])

// 2. 计算属性
// 当前题目
const currentQuestion = computed(() => questions.value[currentIndex.value])
// 进度百分比
const progressPercentage = computed(() => {
  return Math.round(((currentIndex.value + 1) / questions.value.length) * 100)
})
// 当前题是否已答
const currentAnswered = computed(() => answers.value[currentIndex.value] !== null)

// 3. 路由相关
const router = useRouter()
const route = useRoute()

// 4. 方法定义
// 切换到上一题
const goToPrevious = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// 切换到下一题
const goToNext = () => {
  if (currentIndex.value < questions.value.length - 1) {
    // 如果当前题未答，提示但不阻止
    if (!currentAnswered.value) {
      ElMessage.warning('您还没有选择答案哦，可以稍后回来修改')
    }
    currentIndex.value++
  }
}

// 提交测试（最后一题时调用）
const submitTest = async () => {
  // 检查是否有未答题目
  const unanswered = answers.value.filter(a => a === null).length;
  if (unanswered > 0) {
    ElMessage.warning(`您还有 ${unanswered} 题未完成，请检查`);
    return;
  }

  // 准备提交给后端的数据
  const submitData = {
    version: route.query.version || '简洁版',
    userId: '雾语漫', // 匿名用户，后续可以改为登录用户
    answers: questions.value.map((question, index) => ({
      questionId: question.id,
      answer: answers.value[index],
      dimension: question.dimension,
      direction: question.direction
    })),
    startedAt: sessionStorage.getItem('test_start_time'),
    completedAt: new Date().toISOString()
  };

  console.log('提交给后端的数据：', submitData);

  // 显示加载状态
  const loading = ElLoading.service({
    lock: true,
    text: '正在分析您的人格类型...',
    background: 'rgba(0, 0, 0, 0.7)'
  });

  try {
    // 调用后端API提交答案
    const response = await submitTestAnswers(submitData);

    if (response.data.msg !== 'ok') {
      throw new Error(response.data.msg || '提交失败');
    }

    const result = response.data.data;
    console.log('后端返回的结果：', result);

    // 将测试结果存储到浏览器本地存储
    localStorage.setItem('mbti_result', JSON.stringify(result));

    // 跳转到结果页
    router.push({
      path: '/result',
      query: {
        testId: result.testId,
        mbtiType: result.mbtiType,
        version: route.query.version
      }
    });

  } catch (error) {
    console.error('提交测试失败：', error);
    ElMessage.error('提交失败，请重试：' + error.message);
  } finally {
    loading.close();
  }
};

// 5. 组件挂载时，可以获取路由参数（如测试版本）
// 组件挂载时从后端获取题目
// async 是在将传递给 onMounted 的回调函数标记为一个异步函数，以便能使用 await 来等待获取题目数据的网络请求完成。
onMounted(async () => {
  const version = route.query.version
  console.log(`当前测试版本：${version}`)

  // 记录测试开始时间
  if (!sessionStorage.getItem('test_start_time')) {
    sessionStorage.setItem('test_start_time', new Date().toISOString())
  }

  // 显示加载中
  const loading = ElLoading.service({
    lock: true,
    text: '正在加载题目...',
    background: 'rgba(0, 0, 0, 0.7)'
  });

  try {
    // 调用后端API获取题目
    // await 等待一个异步操作完成的关键字，拿到数据后，再继续执行后面的代码
    const response = await getTestQuestions(version)

    if (response.data.msg === 'ok') {
      questions.value = response.data.data
      // 初始化答案数组
      answers.value = new Array(questions.value.length).fill(null)
      ElMessage.success(`成功加载${questions.value.length}道题目`)
    } else {
      ElMessage.error('获取题目失败：' + response.data.msg)
    }
  } catch (error) {
    console.error('获取题目失败：', error)
    ElMessage.error('网络错误，请检查连接')
  } finally {
    loading.close()
  }
})

// 选择选项的方法 (1-5)
const selectOption = (value) => {
  // 将选择的值（1-5）存入答案数组
  answers.value[currentIndex.value] = value;

  // 提供视觉反馈
  const labels = ['完全不符合', '不符合', '中立', '符合', '完全符合'];
  // console.log(`第${currentIndex.value + 1}题选择了: ${labels[value - 1]}`);

  // 如果当前不是最后一题，自动进入下一题
  if (currentIndex.value < questions.value.length - 1) {
    // 可以添加一个短暂的视觉反馈延迟
    setTimeout(() => {
      goToNext();
    }, 300);
  } else {
    // 如果是最后一题，可以给个提示
    ElMessage.success('已完成最后一题！请提交查看结果。');
  }
};

// 颜色渐变：从粉色(完全不符合)到蓝色(完全符合)
const colorStops = [
  '#ea499b', // 粉色 - 完全不符合
  '#b852ca', // 品红色 - 不符合
  '#8e5be2', // 紫色 - 中立
  '#6e69e6', // 靛？ - 符合
  '#3d81e6'  // 蓝色 - 完全符合
];

// 悬停和选中状态的颜色加深
const hoverColorStops = [
  '#fb5aac',
  '#c963db',
  '#9f6cf3',
  '#7f7af7',
  '#4e92f7'
];

const getColor = (index) => {
  return {
    color: hoverColorStops[index]
  }
}

// 动态计算每个圆的样式（核心：控制大小和渐变）
const getCircleStyle = (index) => {
  // 定义5个圆的基础大小（单位：px），中间小，两边大
  const sizeMap = [80, 68, 56, 68, 80];
  // 定义选中时放大的比例
  const selectedScale = 1.15;

  const baseSize = sizeMap[index];
  const isSelected = answers.value[currentIndex.value] === index + 1;
  const finalSize = isSelected ? baseSize * selectedScale : baseSize;

  const isHovered = false; // 这个可以扩展用于鼠标悬停状态

  // 通过渐变模拟光照和阴影 circle-渐变形状为圆
  // at 30% 30% => 渐变中心点的位置 30% 30% 表示水平方向 30%，垂直方向 30%
  // white, ${hoverColorStops[index]} => 起始颜色whith、结束颜色为hoverColorStops[index]
  // `radial-gradient(circle at 30% 30%, white, ${hoverColorStops[index]})`

  // inset 是内部阴影
  // inset 0 2px 4px rgba(255, 255, 255, 0.5)

  return {
    width: `${finalSize}px`,
    height: `${finalSize}px`,
    lineHeight: `${finalSize}px`,
    border: isSelected
        ? `${hoverColorStops[index]} ${finalSize / 2 + 1}px solid`
        : `${colorStops[index]} 2px solid`,
    boxShadow: isSelected
        ? `0 8px 20px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.5)`
        : `0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.7)`,
  };
};

// 获取每个点的文字标签
const getPointLabel = (index) => {
  const labels = ['完全不符合', '不符合', '中立', '符合', '完全符合'];
  return labels[index];
};

// 清除当前题目的选择
const clearSelection = () => {
  answers.value[currentIndex.value] = null;
  ElMessage.info('已清除当前题目的选择');
};

// 智能获取可见的页面编号
const getVisiblePageNumbers = () => {
  const total = questions.value.length;
  const current = currentIndex.value;
  const visibleRange = 3; // 前后显示的数量

  let numbers = [];

  // 如果题目数量少，显示所有
  if (total <= 10) {
    for (let i = 0; i < total; i++) numbers.push(i);
    return numbers;
  }

  // 总是显示第一题
  numbers.push(0);

  // 计算显示范围 [1（第二个）, total - 2（倒数第二个）]
  const start = Math.max(1, current - visibleRange);
  const end = Math.min(total - 2, current + visibleRange);

  // 添加省略号（如果需要）
  if (start > 1) numbers.push(-1); // -1 表示省略号

  // 添加中间范围
  for (let i = start; i <= end; i++) {
    numbers.push(i);
  }

  // 添加省略号（如果需要）
  if (end < total - 2) numbers.push(-1);

  // 总是显示最后一题
  numbers.push(total - 1);

  return numbers;
};

const answerLabel = (index) => {
  return answers.value[index] === null
      ? `第 ${index + 1} 题（未作答）`
      : `第 ${index + 1} 题`
}
</script>

<template>
  <div class="test-paper-page" v-if="questions.length > 0">
    <!-- 顶部栏 -->
    <el-header class="test-header">
      <div class="header-content">
        <div class="logo">游游人格屋</div>
        <div class="test-info">
          <span class="test-version">MBTI性格测试</span>
          <span class="question-count">第 {{ currentIndex + 1 }} 题 / 共 {{ questions.length }} 题</span>
        </div>
      </div>
    </el-header>

    <el-main class="test-main">
      <!-- 进度条区域 -->
      <section class="progress-section">
        <div class="progress-header">
          <h3>答题进度</h3>
          <span>{{ progressPercentage }}%</span>
        </div>
        <el-progress
            :percentage="progressPercentage"
            :stroke-width="18"
            :text-inside="true"
            color="linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)"
        />
        <p class="progress-hint">完成所有题目后，系统将为您分析人格类型</p>
      </section>

      <!-- 题目卡片区域 -->
      <section class="question-section">
        <el-card class="question-card" shadow="hover">
          <!-- 题目维度标签 -->
          <el-tag
              class="dimension-tag"
              :type="currentQuestion.dimension === 'E/I' ? 'primary' :
                   currentQuestion.dimension === 'S/N' ? 'success' :
                   currentQuestion.dimension === 'T/F' ? 'warning' : 'danger'"
          >
            {{ currentQuestion.dimension }} 维度
          </el-tag>

          <!-- 题目内容 -->
          <div class="question-content">
            <h2>{{ currentQuestion.content }}</h2>
            <p class="dimension-desc">
              {{
                currentQuestion.dimension === 'E/I' ? '（外向 Extraversion / 内向 Introversion）' :
                    currentQuestion.dimension === 'S/N' ? '（实感 Sensing / 直觉 Intuition）' :
                        currentQuestion.dimension === 'T/F' ? '（思考 Thinking / 情感 Feeling）' :
                            '（判断 Judging / 感知 Perceiving）'
              }}
            </p>
          </div>

          <!-- 选项区域 -->
          <div class="options-area">
            <!-- 五点量表选择器 -->
            <div class="likert-scale">
              <div class="scale-label left">不符合</div>
              <div class="circles-container">
                <div
                    v-for="(point, index) in 5"
                    :key="index"
                    class="circle-wrapper"
                    @click="selectOption(index + 1)"
                >
                  <div
                      class="circle-button"
                      :class="{
                      'selected': answers[currentIndex] === index + 1,
                    }"
                      :style="getCircleStyle(index)"
                      :title="getPointLabel(index)"
                  >
                  </div>
                </div>
              </div>
              <div class="scale-label right">符合</div>
            </div>

            <!-- 当前选择显示 -->
            <div v-if="answers[currentIndex] !== null"
                 class="current-selection"
            >
              当前选择: <strong
                class="mx-2"
                :style="getColor(answers[currentIndex] - 1)"
            >{{ getPointLabel(answers[currentIndex] - 1) }}</strong>
              <el-button
                  type="text"
                  size="small"
                  @click="clearSelection"
                  class="clear-btn"
              >
                清除选择
              </el-button>
            </div>

            <p class="option-hint">点击选项可直接进入下一题，或使用下方导航按钮</p>
          </div>
        </el-card>

        <!-- 答题导航 -->
        <div class="navigation">
          <el-button
              :disabled="currentIndex === 0"
              @click="goToPrevious"
              class="nav-btn-left"
              size="large"
          >
            <el-icon><ArrowLeft /></el-icon>
            上一题
          </el-button>

          <!-- 改进的导航指示器 -->
          <div class="question-indicator-wrapper">
            <!-- 移动端：使用下拉选择器 -->
            <div class="mobile-indicator">
              <el-select
                  v-model="currentIndex"
                  placeholder="跳转到"
                  size="large"
                  style="width: 180px"
              >
                <el-option
                    v-for="(question, index) in questions"
                    :key="question.id"
                    :label="answerLabel(index)"
                    :value="index"
                />
              </el-select>
            </div>

            <!-- 桌面端：智能分页显示 -->
            <div class="desktop-indicator">
              <!-- 分页逻辑：显示当前题目附近5个点 -->
              <span
                  v-for="index in getVisiblePageNumbers()"
                  :key="index"
                  class="indicator-dot"
                  :class="{
            'active': index === currentIndex,
            'answered': answers[index] !== null,
            'ellipsis': index === -1
          }"
                  @click="currentIndex = index"
                  :title="index !== -1 ? `第 ${index + 1} 题${answers[index] !== null ? '（已答）' : '（未答）'}` : ''"
              >
          {{ index === -1 ? '...' : index + 1 }}
        </span>
            </div>
          </div>

          <el-button
              v-if="currentIndex < questions.length - 1"
              @click="goToNext"
              class="nav-btn-right"
              type="primary"
              size="large"
          >
            下一题
            <el-icon><ArrowRight /></el-icon>
          </el-button>

          <el-button
              v-else
              @click="submitTest"
              class="submit-btn"
              type="success"
              size="large"
              :disabled="!currentAnswered"
          >
            <el-icon><Finished /></el-icon>
            提交测试，查看结果
          </el-button>
        </div>
      </section>
    </el-main>

    <!-- 页脚 -->
    <el-footer class="test-footer">
      <p>温馨提示：根据您的真实情况选择，结果会更准确。所有数据仅用于分析，我们将严格保密。</p>
      <p class="answer-summary">
        已答题数: {{ answers.filter(a => a !== null).length }} / {{ questions.length }}
      </p>
    </el-footer>
  </div>
  <!-- 加载中状态 -->
  <div v-else-if="!questions || questions.length === 0" class="loading-container">
    <el-empty description="正在加载题目，请稍候...">
      <el-icon class="loading-icon" size="50"><Loading /></el-icon>
    </el-empty>
  </div>
</template>

<style scoped>
.test-paper-page {
  @apply min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col;
}

/* 头部样式 */
.test-header {
  @apply h-20 bg-white p-3 shadow-md;
}

.header-content {
  @apply max-w-7xl mx-auto flex justify-between items-center;
}

.logo {
  @apply text-xl text-transparent
  bg-gradient-to-r from-pink-500 to-blue-500
  font-bold bg-clip-text inline-block
  bg-[length:200%_auto] animate-gradient-flow;
}

.test-info {
  @apply flex flex-col items-center gap-1;
}

.test-version {
  @apply text-xl font-bold text-gray-600;
}

.question-count {
  @apply text-base text-gray-500;
}

/* 主要内容区 */
.test-main {
  @apply flex-1 max-w-4xl w-full my-2 mx-auto px-1;
}

/* 进度条区域 */
.progress-section {
  @apply bg-white rounded-3xl p-4 mb-6 shadow-xl;
}

.progress-header {
  @apply flex justify-between items-center mb-4;
}

.progress-header h3 {
  @apply text-xl text-gray-700 m-0;
}

.progress-header span {
  @apply font-bold text-blue-500 text-lg;
}

.progress-hint {
  @apply mt-4 text-gray-400 text-base text-center;
}

/* 题目卡片 */
.question-card {
  @apply border-0 rounded-3xl mb-4 overflow-hidden relative;
}

.dimension-tag {
  @apply absolute top-7 right-6 font-bold text-base;
}

.question-content {
  @apply pt-8 px-8 pb-4 text-center;
}

.question-content h2 {
  @apply text-2xl text-gray-800 leading-8 mb-2;
}

.dimension-desc {
  @apply text-gray-600 text-base;
}

/* 五点量表样式 */
.likert-scale {
  @apply flex items-center justify-center mt-4 mb-4;
}

.scale-label {
  @apply font-bold text-lg mx-8;
}

.scale-label.left {
  @apply text-pink-500;
}

.scale-label.right {
  @apply text-blue-500;
}

.circles-container {
  @apply flex items-center justify-center gap-8;
}

.circle-wrapper {
  @apply flex flex-col items-center;
  transition: transform 0.3s ease;
}

.circle-wrapper:hover {
  transform: translateY(-5px);
}

.circle-button {
  @apply rounded-full cursor-pointer relative
  transition-all duration-300 ease-out mx-2;
  border: 3px solid white;
}

.circle-button:hover {
  @apply scale-105;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}

.circle-button.selected {
  border-color: #3b82f6;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4) !important;
  animation: pulse 1.5s infinite;
}

/* 当前选择显示 */
.current-selection {
  @apply mt-6 mb-4 text-center text-gray-700 p-3 bg-blue-50 rounded-xl;
  border: 1px solid #dbeafe;
}

.clear-btn {
  @apply ml-4 text-sm text-gray-500 hover:text-red-500;
}

.option-hint {
  @apply text-center text-gray-400 text-sm mt-6;
}

/* 导航区域 */
.navigation {
  @apply flex items-center justify-between;
}

.nav-btn-left {
  @apply bg-pink-500 shadow-lg shadow-pink-500/50
  min-w-[120px] rounded-xl text-white mb-1;
}

.nav-btn-right {
  @apply bg-blue-500 shadow-lg shadow-blue-500/50
  min-w-[120px] rounded-xl text-white mb-1;
}

.question-indicator-wrapper {
  @apply flex flex-col justify-center items-center;
}

.mobile-indicator {
  @apply mb-4;
}

.indicator-dot {
  @apply inline-block w-8 h-8 rounded-full mx-2 cursor-pointer
  bg-gray-300 relative text-center leading-8;
  transition: all 0.3s;
}

.indicator-dot.answered {
  @apply bg-indigo-300;
}

.indicator-dot.active {
  @apply bg-purple-300 scale-[1.3];
}

.indicator-dot.ellipsis {
  @apply bg-indigo-300;
}

.indicator-dot:hover {
  @apply scale-[1.4];
}

.submit-btn {
  @apply min-w-[200px] rounded-xl font-bold;
  background: linear-gradient(90deg, #10b981, #34d399);
  border: none;
}

.submit-btn:hover {
  background: linear-gradient(90deg, #059669, #10b981);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

/* 页脚 */
.test-footer {
  @apply h-[100px] text-center p-6 bg-white mt-auto;
  border-top: 1px solid #e5e7eb;
}

.test-footer p {
  @apply text-gray-400 text-base max-w-[600px];
  margin: 0 auto 0.5rem;
}

.answer-summary {
  @apply font-medium text-blue-600;
}

/* 动画效果 */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

.loading-container {
  @apply h-screen flex items-center justify-center;
}

.loading-icon {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {

  .question-content h2 {
    font-size: 1.3rem;
  }

  .likert-scale {
    flex-direction: column;
    gap: 1.5rem;
  }

  .scale-label {
    margin: 0;
  }

  .circles-container {
    @apply gap-1 order-2 w-full justify-between;
  }

  .circle-wrapper {
    flex: 1;
  }

  .navigation {
    flex-direction: column;
    gap: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .test-info {
    align-items: center;
  }
}

/* 小屏幕适配 */
@media (max-width: 480px) {
  .circles-container {
    gap: 0;
  }

  .circle-button {
    width: 40px !important;
    height: 40px !important;
  }
}
</style>