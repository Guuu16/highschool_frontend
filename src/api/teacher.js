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
  }
}
