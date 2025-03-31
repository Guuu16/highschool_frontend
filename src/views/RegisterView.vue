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
        <label for="role">角色</label>
        <select 
          id="role" 
          v-model="form.role" 
          required
        >
          <option value="">请选择角色</option>
          <option value="student">学生</option>
          <option value="teacher">教师</option>
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
import { useUserStore } from '@/stores/user'
import { userApi } from '@/api/user'

const form = ref({
  username: '',
  password: '',
  role: ''
})

const router = useRouter()

const handleRegister = async () => {
  try {
    const userStore = useUserStore()
    await userApi.register(form.value)
    // 注册成功后自动登录
    const success = await userStore.login({
      username: form.value.username,
      password: form.value.password
    })
    if (success) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  } catch (error) {
    console.error('注册失败:', error)
    // 这里可以添加错误提示
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
