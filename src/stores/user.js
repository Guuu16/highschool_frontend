import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi } from '@/api/user'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userId = ref(localStorage.getItem('userId') || '')
  const role = ref(localStorage.getItem('role') || '')
  const name = ref('')
  const avatar = ref('')

  // 登录方法
  const login = async (loginData) => {
    try {
      const { data } = await userApi.login(loginData)
      if (!data.token) {
        throw new Error('响应中缺少token字段')
      }
      
      token.value = data.token
      userId.value = data.userId || ''
      role.value = data.role || 'STUDENT'
      console.log('登录成功，设置用户角色为:', role.value)
      
      // 存储到localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', userId.value)
      localStorage.setItem('role', role.value)
      
      // 获取用户信息
      await getUserInfo()
      
      return true
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }

  // 登出方法
  const logout = () => {
    token.value = ''
    userId.value = ''
    role.value = ''
    name.value = ''
    avatar.value = ''
    
    // 清除localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
    
    // 跳转到登录页
    router.push('/login')
  }

  // 获取用户信息
  const getUserInfo = async () => {
    try {
      const { data } = await userApi.getMe()
      name.value = data.name || ''
      avatar.value = data.avatar || ''
      return data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }

  return {
    token,
    userId,
    role,
    name,
    avatar,
    login,
    logout,
    getUserInfo
  }
})
