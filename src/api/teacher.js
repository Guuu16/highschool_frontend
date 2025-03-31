import axios from 'axios'
import { API_BASE } from '@/config/api'

export const teacherApi = {
  // 获取指导的项目列表
  getProjects: async () => {
    return axios.get(`${API_BASE}/teacher/projects`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  },

  // 审核项目
  reviewProject: async (id, data) => {
    return axios.put(`${API_BASE}/teacher/project/${id}/review`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  },

  // 审核导师申请
  reviewMentorApplication: async (id, data) => {
    return axios.put(`${API_BASE}/teacher/mentor-applications/${id}/review`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  },

  // 发布活动
  createEvent: async (data) => {
    return axios.post(`${API_BASE}/teacher/events`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  }
}
