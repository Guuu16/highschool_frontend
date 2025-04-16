<template>
  <div class="register-container">
    <h1>注册</h1>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username">用户名</label>
        <input 
          id="username" 
          v-model="form.username" 
          type="text" 
          placeholder="请输入用户名"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input 
          id="password" 
          v-model="form.password" 
          type="password" 
          placeholder="请输入密码"
          required
        />
      </div>
      <div class="form-group">
        <label for="realName">真实姓名</label>
        <input 
          id="realName" 
          v-model="form.realName" 
          type="text" 
          placeholder="请输入真实姓名"
          required
        />
      </div>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input 
          id="email" 
          v-model="form.email" 
          type="email" 
          placeholder="请输入邮箱"
          required
        />
      </div>
      <div class="form-group">
        <label for="phone">电话</label>
        <input 
          id="phone" 
          v-model="form.phone" 
          type="tel" 
          placeholder="请输入电话"
          required
        />
      </div>
      <div class="form-group">
        <label for="role">角色</label>
        <select 
          id="role" 
          v-model="form.role" 
          required
        >
          <option value="">请选择角色</option>
          <option value="STUDENT">学生</option>
          <option value="TEACHER">教师</option>
        </select>
      </div>
      <button type="submit" class="register-btn">注册</button>
    </form>
    <p class="login-link">
      已有账号？<router-link to="/login">立即登录</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { userApi } from '@/api/user'

const form = ref({
  username: '',
  password: '',
  realName: '',
  email: '',
  phone: '',
  role: ''
})

const router = useRouter()

const handleRegister = async () => {
  try {
    const userStore = useUserStore()
    await userApi.register(form.value)
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } catch (error) {
    console.error('注册失败:', error)
    ElMessage.error(error.response?.data?.message || '注册失败')
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-top: 5rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.register-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.register-btn:hover {
  background-color: #3aa876;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
}

a {
  color: #42b983;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
