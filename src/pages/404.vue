<script setup>

import router from "@/router/index.js";
</script>

<template>
  <div>
    <el-result
      icon="warning"
      title="不可以！这里不是正确的网页"
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