import axios from 'axios'
import { API_BASE } from '@/config/api'

export const studentApi = {
  // 获取项目类别
  getCategories: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/student/categories`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  },

  // 获取导师列表
  getTeachers: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/student/teachers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  },

  // 创建项目(带文件上传)
  createProjectWithFile: async (formData) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.post(`${API_BASE}/api/api/projects`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 获取项目详情
  getProjectDetail: async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/projects/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // 获取项目进度
  getProjectProgress: async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/projects/${id}/progress`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // 提交项目进度(带文件上传)
  submitProgress: async (projectId, formData) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    
    // 确保headers包含token
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }
    
    console.log('提交进度请求headers:', config.headers) // 调试日志
    
    return axios.post(
      `${API_BASE}/api/student/project/${projectId}/progress`, 
      formData,
      config
    )
  },

  // 更新项目
  updateProject: async (id, data) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.put(`${API_BASE}/api/projects/${id}`, data, {
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
  },

  // 获取项目类别
  getCategories: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/student/categories`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  },

  // 获取导师列表
  getTeachers: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/student/teachers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  },

  // 获取未读消息数
  getUnreadMessageCount: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/messages/unread-count`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // 获取公告通知(分页)
  getPolicies: async (params = {}) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/policies`, {
      params: {
        pageSize: 10,
        pageNum: 1,
        ...params
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // 获取活动通知(分页)
  getEvents: async (params = {}) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/events`, {
      params: {
        pageSize: 10,
        pageNum: 1,
        ...params
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },
  getTeacherInfo: async (teacherId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到认证token')
    }
    return axios.get(`${API_BASE}/api/teachers/${teacherId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
}
