import axios from 'axios'
import { API_BASE } from '@/config/api'

export const teacherApi = {
  // 处理导师申请
  processMentorApplication: async (data) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.post(`${API_BASE}/api/teacher/mentor-review`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },

  // 获取教师项目列表
  getProjects: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/projects/teacher`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },

  // 获取项目类别（复用学生端接口）
  getCategories: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/student/categories`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },

  // 获取教师下所有学生
  getStudents: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/teacher/students`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },

  // 活动管理接口
  getEvents: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/events`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },

  createEvent: async (data) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.post(`${API_BASE}/api/events`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },

  updateEvent: async (id, data) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.put(`${API_BASE}/api/events/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },

  deleteEvent: async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.delete(`${API_BASE}/api/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },


  // 获取项目详情
  getProjectDetail: async (projectId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/teacher/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },

  // 获取项目进度
  getProjectProgress: async (projectId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/teacher/project/${projectId}/progress`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },

  // 提交项目反馈
  submitFeedback: async (progressId, content) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    const formData = new FormData()
    formData.append('feedback', content)
    return axios.put(`${API_BASE}/api/teacher/progress/${progressId}/feedback`, 
      formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    )
  }
}
