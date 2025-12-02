<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, getInfo } from "~/api/manager.js";
import { ElNotification } from 'element-plus'
import { useCookies } from '@vueuse/integrations/useCookies'

// 定义表单数据
const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    {
      required: true, // 必填
      message: '请输入用户名', // 提示语
      trigger: 'blur' // 触发方式，blur失去焦点
    },
    {
      min: 1,
      max: 20,
      message: '用户名长度在1到20之间哦',
      trigger: 'blur'
    },
  ],
  password: [
    {
      required: true, // 必填
      message: '请输入密码', // 提示语
      trigger: 'blur' // 触发方式，blur失去焦点
    },
  ]
}

// 获取路由实例
const router = useRouter()

const formRef = ref(null)

// 登录提交函数
const onSubmit = () => {
  // validate 是 Element Plus 表单组件提供的验证方法，用于手动触发表单验证。
  // valid 是自定义命名的 true 或者 false，表示表单验证的结果
  formRef.value.validate((valid) => {
    if (!valid) {
      return false;
    }
    // 因为login是Promise，因此可以通过then获取请求成功的数据，catch获得失败的数据
    login(form.username, form.password)
      .then(res=>{
        // 得到后端返回的数据
        const responseData = res.data;

        // 对后端返回的msg进行判断，ok为成功（后端没有返回code）
        if (responseData.msg === 'ok') {
          // console.log(res)
          // 提示成功
          ElNotification({
            message: '登录成功',
            type: 'success',
            duration: 3000, // 提示框的持续时间，单位为毫秒
          })

          // 存储token和用户相关信息
          const cookies = useCookies()
          const token = responseData.data.token;
          cookies.set('moxc-token', token)

          // 获取用户信息
          getInfo().then(res2 => {
            console.log(res2)
          })

          // push方法跳转
          router.push('/home')
        } else {
          // 后端登录逻辑错误，不是正确的用户名与密码
          ElNotification({
            message: responseData.msg || "登录失败",
            type: 'error',
            duration: 3000
          })
        }
    })
  })
}
</script>


<template>
<!--  min-h-screen 最小高度填满整个屏幕-->
  <el-row class="login-container">
<!--    在 24 分栏系统（将一行分为 24 等份）中占据 16 栏宽度-->
<!--    justify-center 水平居中-->
<!--    md="12" 当>=992px时，各占一半（12/24）-->
    <el-col :lg="16" :md="12" class="left">
      <div>
        <div>游游人格屋</div>
        <div>此站点是关于MBTI人格交流的网站</div>
      </div>
    </el-col>
<!--    flex-col 设置弹性布局方向col，子元素上下垂直排列-->
    <el-col :lg="8" :md="12" class="right">
      <h2 class="title">Hello</h2>
<!--      my-5 y轴方向上的外边距为1.25rem-->
<!--      space-x-2 子元素水平间距，相当于 margin-left = 0.5rem-->
      <div>
<!--        这上下两个span是左右的线条，h-[1px]线条设置的很细，具有美感-->
<!--        h-[1px]自定义高度-->
<!--        w-16宽度设置 相当于64px-->
        <span class="line"></span>
        <span>账号密码登录</span>
        <span class="line"></span>
      </div>
<!--      ref="formRef" 让vue能获取到 el-form 组件的实例对象-->
      <el-form ref="formRef" :rules="rules" :model="form">
        <el-form-item prop="username">
          <el-input
              v-model="form.username"
              placeholder="请输入用户名"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
<!--          @keyup.enter 键盘回车键事件，输入完用户和密码，直接回车即可判断-->
<!--          show-password 显示密码的小眼睛-->
          <el-input
              v-model="form.password"
              placeholder="请输入密码"
              @keyup.enter="onSubmit"
              type="password"
              show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
<!--          round 圆形边角-->
          <el-button round color="#626aef" class="w-[250px]" type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped>
.login-container {
  @apply min-h-screen bg-indigo-500;
}
.login-container .left, .login-container .right {
  @apply flex items-center justify-center;
}
.login-container .right {
 @apply flex-col bg-light-50;
}
.left>div>div:first-child {
  @apply font-bold text-5xl text-light-50 mb-4;
}
.left>div>div:last-child {
  @apply text-gray-200 text-sm;
}
.right .title {
  @apply font-bold text-3xl text-gray-800;
}
.right>div {
  @apply flex items-center justify-center my-5 text-gray-300 space-x-2;
}
.right .line {
  @apply h-[1px] w-16 bg-gray-200;
}
</style>