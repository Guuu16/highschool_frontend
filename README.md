# 环境信息

## 系统信息
- 操作系统: macOS
- Shell: /bin/zsh
- 当前时间: 2025/4/1 下午1:49:38 (Asia/Shanghai, UTC+8:00)

## 开发环境
- Node.js版本: v18.17.1
- npm版本: 9.6.7

## 项目配置
- 项目名称: highshool_frontend
- 项目版本: 0.0.0
- 项目类型: module (ES Modules)
- 开发服务器: Vite 6.2.1

## 主要依赖
- Vue 3.5.13
- Element Plus 2.9.7
- Element Plus Icons 2.3.1

## Vite配置
```javascript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

## 项目结构
```
highshool_frontend/
├── src/
│   ├── api/          # API请求模块
│   ├── assets/       # 静态资源
│   ├── components/   # 公共组件
│   ├── config/       # 配置
│   ├── router/       # 路由配置
│   ├── stores/       # Pinia状态管理
│   ├── views/        # 页面组件
│   ├── App.vue       # 根组件
│   └── main.js       # 入口文件
├── vite.config.js    # Vite配置
└── package.json      # 项目依赖
```

## 开发脚本
```bash
npm run dev    # 启动开发服务器
npm run build  # 构建生产版本
npm run preview # 预览生产版本
