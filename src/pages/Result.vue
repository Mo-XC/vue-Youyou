<script setup>
import {onMounted, ref} from "vue";
import {ElLoading} from "element-plus";

const testResult = ref()
let mbtiType = ref()

onMounted(async () => {
  // 显示加载
  const loading = ElLoading.service({
    lock: true,
    text: '正在分析您的人格数据...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  try {
    // 方法1：从localStorage获取
    // TestPaperPage.vue已经存储过了，在submitTest里面
    const storedResult = localStorage.getItem('mbti_result')

    if (storedResult) {
      // 从游览器里面获得的后端的数据
      // 再将数据解析为JSON
      testResult.value = JSON.parse(storedResult)

      // 解析完后赋值给mbtiType
      mbtiType.value = testResult.value.mbtiType
    } else {
      // 方法2：从路由参数获取并调用API（如果后端支持）
      const testId = route.query.testId
      if (testId) {
        // const response = await getTestResult(testId) // 调用API
        // testResult.value = response.data.data
      }
    }

    if (!testResult.value) {
      // 没有数据，跳回首页
      router.push('/select-test')
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.close()
  }
})
</script>

<template>
  <div class="flex justify-center items-center text-5xl font-bold">
    <h1>您的mbti人格为：
      <span class="text-pink-500">{{ mbtiType }}！</span>
    </h1>
  </div>
</template>

<style scoped>

</style>