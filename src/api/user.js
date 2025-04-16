import axios from 'axios'
import { API_BASE } from '@/config/api'

export const userApi = {
  // 用户登录
  login: async (data) => {
    try {
      const response = await axios.post(`${API_BASE}/api/user/login`, data)
      // 处理不同响应格式
      console.log('登录API完整响应:', response.data)
      const responseData = response.data.data
      if (!responseData.token) {
        throw new Error('登录失败: 响应中缺少token')
      }
      // 确保返回数据包含role字段
      if (!responseData.role) {
        console.warn('API响应缺少role字段，使用默认值STUDENT')
        responseData.role = 'STUDENT'
      }
      return {
        ...response,
        data: responseData
      }
    } catch (error) {
      console.error('登录请求失败:', error)
      if (error.response) {
        console.error('响应数据:', error.response.data)
        console.error('状态码:', error.response.status)
      }
      throw error
    }
  },
  
  // 用户注册
  register: async (data) => {
    return axios.post(`${API_BASE}/api/user/register`, data)
  },
  
  // 获取当前用户信息 (兼容getMe别名)
  getCurrentUser: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  
  getMe: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },

  // 修改密码
  changePassword: async (data) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.put(`${API_BASE}/api/user/password`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },

  // 更新用户信息
  updateUserInfo: async (data) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.put(`${API_BASE}/api/user/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}
