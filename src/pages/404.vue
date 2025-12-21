<script setup>

import router from "@/router/index.js";
</script>

<template>
  <div>
    <el-result
      icon="warning"
      title="v50 go to KFC qwq 才能给你访问这个不存在的页面"
      sub-title="（这里大概率是ISTP睡觉的地方，请勿打扰，谢谢！）"
    >
      <template #extra>
        <el-button type="primary" @click="router.push('/')">回到首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>

</style>