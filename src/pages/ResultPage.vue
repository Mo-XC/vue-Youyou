<script setup>
import { onMounted, ref, computed } from "vue";
import { ElLoading, ElCard, ElRow, ElCol, ElTag, ElButton } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const testResult = ref(null);
const loading = ref(true);

// 计算属性：获取维度得分对
const dimensionPairs = computed(() => {
  if (!testResult.value?.dimensionScores) return [];

  const scores = testResult.value.dimensionScores;
  return [
    { name: "外向(E)", value: scores.E || 0, opposite: "内向(I)", oppositeValue: scores.I || 0 },
    { name: "实感(S)", value: scores.S || 0, opposite: "直觉(N)", oppositeValue: scores.N || 0 },
    { name: "思考(T)", value: scores.T || 0, opposite: "情感(F)", oppositeValue: scores.F || 0 },
    { name: "判断(J)", value: scores.J || 0, opposite: "感知(P)", oppositeValue: scores.P || 0 }
  ];
});

// 计算属性：获取颜色
const getTypeColor = computed(() => {
  const type = testResult.value?.mbtiType;
  if (!type) return "primary";

  const colorMap = {
    "E": "success",
    "I": "info",
    "S": "warning",
    "N": "danger",
    "T": "primary",
    "F": "success",
    "J": "warning",
    "P": "info"
  };

  // 取第一个字母的颜色
  return colorMap[type.charAt(0)] || "primary";
});

onMounted(() => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '正在分析您的人格数据...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  try {
    // 从 localStorage 获取测试结果
    const storedResult = localStorage.getItem('mbti_result');

    if (storedResult) {
      testResult.value = JSON.parse(storedResult);
      console.log("测试结果数据:", testResult.value);
    } else {
      console.warn("没有找到测试结果");
      // 跳转到测试选择页面
      router.push('/select-test');
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    ElMessage.error('获取结果失败，请重新测试');
    router.push('/select-test');
  } finally {
    loadingInstance.close();
    loading.value = false;
  }
});

// 重新测试
const restartTest = () => {
  router.push('/select-test');
};

// 获取进度条颜色
const getProgressColor = (value) => {
  if (value >= 20) return "#10b981"; // 绿色
  if (value >= 10) return "#3b82f6"; // 蓝色
  if (value >= 0) return "#f59e0b";  // 黄色
  return "#ef4444"; // 红色
};
</script>

<template>
  <!-- 加载状态 -->
  <div v-if="loading" class="h-screen flex items-center justify-center">
    <div class="text-center">
      <el-icon class="text-6xl text-blue-500 animate-spin mb-4"><Loading /></el-icon>
      <p class="text-gray-600">正在加载测试结果...</p>
    </div>
  </div>

  <!-- 结果页面 -->
  <div v-else-if="testResult" class="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- 头部信息 -->
      <el-card class="mb-8 shadow-xl border-0" shadow="hover">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">MBTI 人格测试结果</h1>
          <p class="text-gray-600">探索您的人格特质，发现更好的自己</p>
        </div>
      </el-card>

      <!-- 主要内容 -->
      <el-row :gutter="24" class="mb-8">
        <!-- 左侧：MBTI 类型卡片 -->
        <el-col :xs="24" :md="12">
          <el-card class="h-full shadow-xl border-0" shadow="hover">
            <div class="text-center">
              <!-- MBTI 类型标签 -->
              <el-tag
                  size="large"
                  :type="getTypeColor"
                  class="text-5xl font-bold px-8 py-4 mb-6"
              >
                {{ testResult.mbtiType }}
              </el-tag>

              <!-- 类型标题 -->
              <h2 class="text-2xl font-bold text-gray-800 mb-4">
                您的 MBTI 人格类型
              </h2>

              <!-- 测试信息 -->
              <div class="grid grid-cols-2 gap-4 mt-6">
                <div class="bg-blue-50 p-4 rounded-xl">
                  <p class="text-sm text-gray-500">测试版本</p>
                  <p class="text-lg font-semibold text-blue-600">{{ testResult.testVersion }}</p>
                </div>
                <div class="bg-pink-50 p-4 rounded-xl">
                  <p class="text-sm text-gray-500">总题数</p>
                  <p class="text-lg font-semibold text-pink-600">{{ testResult.totalQuestions }} 题</p>
                </div>
              </div>

              <!-- 测试时间 -->
              <div class="mt-6 pt-4 border-t border-gray-200">
                <p class="text-gray-500 text-sm">
                  <el-icon class="mr-2"><Clock /></el-icon>
                  测试时间：{{ new Date(testResult.completedTime).toLocaleDateString() }}
                </p>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧：维度得分 -->
        <el-col :xs="24" :md="12">
          <el-card class="h-full shadow-xl border-0" shadow="hover">
            <h3 class="text-xl font-bold text-gray-800 mb-6">人格维度得分</h3>

            <!-- 维度得分列表 -->
            <div v-for="(pair, index) in dimensionPairs" :key="index" class="mb-6">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-gray-700">{{ pair.name }}</span>
                <span class="font-bold text-blue-600">{{ pair.value }}</span>
              </div>

              <!-- 进度条 -->
              <el-progress
                  :percentage="Math.min(Math.abs(pair.value), 100)"
                  :color="getProgressColor(pair.value)"
                  :show-text="false"
                  :stroke-width="12"
                  class="mb-2"
              />

              <div class="flex justify-between items-center mt-1">
                <span class="text-sm text-gray-500">{{ pair.opposite }}</span>
                <span class="text-sm font-medium text-gray-600">{{ pair.oppositeValue }}</span>
              </div>

              <!-- 对立维度进度条 -->
              <el-progress
                  :percentage="Math.min(Math.abs(pair.oppositeValue), 100)"
                  color="#e5e7eb"
                  :show-text="false"
                  :stroke-width="8"
                  class="mt-1 opacity-50"
              />
            </div>

            <!-- 得分说明 -->
            <div class="mt-8 p-4 bg-blue-50 rounded-xl">
              <p class="text-sm text-blue-700">
                <el-icon class="mr-2"><InfoFilled /></el-icon>
                得分越高表示您在该维度上的倾向越明显。每个维度都有其独特的价值和优势。
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 详细分析（暂时隐藏，等待 analysis 数据） -->
      <el-card v-if="testResult.analysis" class="mb-8 shadow-xl border-0" shadow="hover">
        <h3 class="text-xl font-bold text-gray-800 mb-4">性格分析</h3>
        <!-- 这里可以放置 analysis 数据 -->
      </el-card>

      <!-- 其他信息卡片 -->
      <el-row :gutter="24" class="mb-8">
        <el-col :xs="24" :md="8">
          <el-card class="shadow-xl border-0" shadow="hover">
            <div class="text-center">
              <el-icon class="text-4xl text-blue-500 mb-4"><Document /></el-icon>
              <h4 class="font-bold text-gray-800 mb-2">测试编号</h4>
              <p class="text-gray-600 text-sm font-mono">{{ testResult.testId }}</p>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :md="8">
          <el-card class="shadow-xl border-0" shadow="hover">
            <div class="text-center">
              <el-icon class="text-4xl text-green-500 mb-4"><Check /></el-icon>
              <h4 class="font-bold text-gray-800 mb-2">已完成</h4>
              <p class="text-gray-600">您已完成所有题目</p>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :md="8">
          <el-card class="shadow-xl border-0" shadow="hover">
            <div class="text-center">
              <el-icon class="text-4xl text-purple-500 mb-4"><DataAnalysis /></el-icon>
              <h4 class="font-bold text-gray-800 mb-2">数据准确率</h4>
              <p class="text-gray-600">基于您的真实回答</p>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 操作按钮 -->
      <el-card class="shadow-xl border-0" shadow="hover">
        <div class="flex flex-col md:flex-row justify-center items-center gap-4">
          <el-button
              type="primary"
              size="large"
              @click="restartTest"
              class="w-full md:w-auto"
          >
            <el-icon class="mr-2"><Refresh /></el-icon>
            重新测试
          </el-button>

          <el-button
              type="success"
              size="large"
              class="w-full md:w-auto"
              @click="router.push('/')"
          >
            <el-icon class="mr-2"><HomeFilled /></el-icon>
            返回首页
          </el-button>

          <el-button
              type="info"
              size="large"
              class="w-full md:w-auto"
          >
            <el-icon class="mr-2"><Share /></el-icon>
            分享结果
          </el-button>
        </div>

        <!-- 提示信息 -->
        <div class="mt-6 text-center text-gray-500 text-sm">
          <p>
            <el-icon class="mr-1"><Warning /></el-icon>
            温馨提示：MBTI 测试仅供参考，每个人的性格都是独特且多元的。
          </p>
        </div>
      </el-card>
    </div>
  </div>

  <!-- 无数据状态 -->
  <div v-else class="h-screen flex items-center justify-center">
    <el-empty description="未找到测试结果">
      <el-button type="primary" @click="restartTest">返回重新测试</el-button>
    </el-empty>
  </div>
</template>

<style scoped>
/* 自定义样式 */
:deep(.el-progress-bar__outer) {
  border-radius: 10px;
}

:deep(.el-progress-bar__inner) {
  border-radius: 10px;
  transition: width 1.5s ease-in-out;
}

.el-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.el-card:hover {
  transform: translateY(-5px);
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.el-card {
  animation: fadeIn 0.5s ease-out;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .text-5xl {
    font-size: 3rem;
  }

  .el-tag {
    font-size: 2rem;
    padding: 0.5rem 1rem;
  }
}
</style>