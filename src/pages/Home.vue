<script setup>
  import { useCookies } from '@vueuse/integrations/useCookies'
  const cookies = useCookies() // 获取cookies

  function set() {
    cookies.set('moxc-token', '1234567890')
  }

  function get() {
    console.log(cookies.get('moxc-token'))
  }

  function remove() {
    cookies.remove('moxc-token')
  }
</script>

<template>
  <div>
    后台首页
    <el-button @click="set">设置</el-button>
    <el-button @click="get">获取</el-button>
    <el-button @click="remove">删除</el-button>
  </div>
</template>

<style scoped>

</style>