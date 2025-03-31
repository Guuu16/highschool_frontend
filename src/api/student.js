import axios from 'axios'
import { API_BASE } from '@/config/api'

export const studentApi = {
  // 创建项目
  createProject: async (data) => {
    return axios.post(`${API_BASE}/student/project`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  },

  // 获取我的项目列表
  getMyProjects: async () => {
    return axios.get(`${API_BASE}/student/projects`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  },

  // 提交项目进度
  submitProgress: async (data) => {
    return axios.post(`${API_BASE}/student/project-progress`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  },

  // 提交导师申请
  applyMentor: async (data) => {
    return axios.post(`${API_BASE}/student/mentor-applications`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  },

  // 获取消息
  getMessages: async () => {
    return axios.get(`${API_BASE}/student/messages/received`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  },

  // 发送消息
  sendMessage: async (data) => {
    return axios.post(`${API_BASE}/student/messages`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  }
}
