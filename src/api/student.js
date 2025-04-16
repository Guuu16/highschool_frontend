import axios from 'axios'
import { API_BASE } from '@/config/api'

export const studentApi = {
  // 获取项目类别
  getCategories: async () => {
    const token = localStorage.getItem('token')
    console.log('获取项目类别token:', token)
    if (!token) {
      throw new Error('未找到认证token')
    }
    const response = await axios.get(`${API_BASE}/api/student/categories`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    console.log('项目类别API响应:', response)
    return response
  },

  // 获取导师列表
  getTeachers: async () => {
    const token = localStorage.getItem('token')
    console.log('获取导师列表token:', token)
    if (!token) {
      throw new Error('未找到认证token')
    }
    const response = await axios.get(`${API_BASE}/api/student/teachers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    console.log('导师列表API响应:', response)
    return response
  },

  // 创建项目
  createProject: async (data) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.post(`${API_BASE}/api/projects`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  },

  // 更新项目
  updateProject: async (id, data) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.put(`${API_BASE}/api/student/projects/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  },

  // 申请导师（创建项目时）
  applyMentor: async (data) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.post(`${API_BASE}/api/student/mentor-application`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  },

  // 获取我的项目列表
  getMyProjects: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/projects/student`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  }
}
