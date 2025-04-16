import axios from 'axios'
import { API_BASE } from '@/config/api'

export const adminApi = {
  // 获取所有项目类别
  getCategories: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/admin/categories`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },

  // 添加新项目类别
  addCategory: async (data) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.post(`${API_BASE}/api/admin/categories`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },

  // 删除项目类别
  deleteCategory: async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.delete(`${API_BASE}/api/admin/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}
