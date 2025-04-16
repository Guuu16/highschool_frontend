<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <h1 class="system-title">高校创新创业管理系统</h1>
          <h2 class="login-title">用户登录</h2>
        </div>
      </template>
      
      <el-form 
        :model="form" 
        label-position="top" 
        @submit.prevent="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            native-type="submit" 
            class="login-btn"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="register-link">
        <span>没有账号？</span>
        <router-link to="/register">立即注册</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const form = ref({
  username: '',
  password: ''
})

const router = useRouter()

const handleLogin = async () => {
  try {
    const userStore = useUserStore()
    if (!userStore) {
      throw new Error('用户store初始化失败')
    }
    ElMessage.info('正在登录中...')
    
    const success = await userStore.login(form.value)
    
    if (success) {
      ElMessage.success('登录成功')
      // 跳转到仪表盘，由路由自动重定向到对应角色页面
      await router.push('/dashboard')
    } else {
      ElMessage.error('登录失败: 用户名或密码错误')
    }
  } catch (error) {
    console.error('登录失败详情:', error)
    let errorMsg = '登录失败'
    
    if (error.message.includes('缺少token')) {
      errorMsg = '服务器响应格式错误: 缺少token字段'
    } else if (error.response) {
      errorMsg = error.response.data?.message || 
                `服务器错误: ${error.response.status}`
    } else if (error.request) {
      errorMsg = '网络错误: 无法连接到服务器'
    }
    
    ElMessage.error(errorMsg)
    console.log('完整错误对象:', error)
  }
}
</script>

<style scoped>
.login-container {
  background: url('/login-bg.png') no-repeat center center fixed;
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 10px;
  width: 400px;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('/login-bg.png') no-repeat center center fixed;
  background-size: cover;
  position: relative;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 0;
}

.login-card {
  position: relative;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.9);
}

.login-card {
  width: 420px;
  border-radius: 12px;
  border: none;
}

.card-header {
  text-align: center;
  padding: 20px 0;
}

.system-title {
  color: #409eff;
  font-size: 22px;
  margin-bottom: 10px;
}

.login-title {
  color: #606266;
  font-size: 18px;
  font-weight: normal;
}

.login-btn {
  width: 100%;
  height: 42px;
  font-size: 16px;
  margin-top: 10px;
}

.register-link {
  text-align: center;
  margin-top: 25px;
  color: #909399;
  font-size: 14px;
}

.register-link a {
  color: #409eff;
  text-decoration: none;
  font-weight: 500;
  margin-left: 5px;
}

.register-link a:hover {
  text-decoration: underline;
}

.el-form-item__label {
  font-weight: 500;
  color: #606266;
}

.el-input__inner {
  height: 42px;
}
</style>
