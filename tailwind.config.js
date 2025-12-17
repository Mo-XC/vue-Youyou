/** @type {import('tailwindcss').Config} */
export default {
  // 核心：添加内容路径，让Tailwind知道从哪里扫描类名
  content: [
    './index.html', // 扫描根目录的HTML文件
    './src/**/*.{vue,js,ts,jsx,tsx}', // 扫描src目录下所有的Vue、JS等文件
  ],
  theme: {
    extend: {
      animation: {
        'gradient-flow': 'gradientFlow 3s ease infinite', // 缓动（ease，先快后慢） 无限循环（infinite）
      },
      keyframes: {
        gradientFlow: {
          // 0% 100% 开始和结尾的状态头一样   都是背景在左边 backgroundPosition: '0% 50%'
          '0%, 100%': {backgroundPosition: '0% 50%'}, // 开始时，背景左对齐
          '50%': {backgroundPosition: '100% 50%'}, // 50%时，背景右对齐
        }
      }
    },
  },
  plugins: [],
}