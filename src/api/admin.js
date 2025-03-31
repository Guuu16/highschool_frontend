import axios from 'axios'
import { API_BASE } from '@/config/api'

export const adminApi = {
  // 获取用户列表
  getUserList: async (params) => {
    return axios.get(`${API_BASE}/admin/user/list`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  },

  // 修改用户角色
  updateUserRole: async (id, role) => {
    return axios.put(`${API_BASE}/admin/user/${id}/role`, { role }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  },

  // 修改用户状态
  updateUserStatus: async (id, status) => {
    return axios.put(`${API_BASE}/admin/user/${id}/status`, { status }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  },

  // 发布政策公告
  createPolicy: async (data) => {
    return axios.post(`${API_BASE}/api/policies`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  }
}
