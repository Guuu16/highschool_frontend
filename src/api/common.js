import axios from 'axios'
import { API_BASE } from '@/config/api'

export const commonApi = {
  // 创建/更新项目
  saveProject: async (id, data) => {
    const url = id ? `${API_BASE}/api/projects/${id}` : `${API_BASE}/api/api/projects`
    const method = id ? 'put' : 'post'
    return axios[method](url, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  },

  // 获取最新公告
  getLatestPolicies: () => axios.get(`${API_BASE}/api/policies/latest`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }),

  // 获取当前用户
  getCurrentUser: () => axios.get(`${API_BASE}/api/user/current`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }),

  // 测试接口
  hello: async () => {
    return axios.get(`${API_BASE}/api/hello`)
  }
}
