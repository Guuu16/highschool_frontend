import axios from 'axios'
import { API_BASE } from '@/config/api'

const request = (options) => {
  return axios({
    baseURL: API_BASE,
    ...options,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      ...options.headers
    }
  })
}

export const adminApi = {
  // 公告管理
  getPolicyList: ({ pageNum = 1, pageSize = 10, ...params }) => request({
    url: '/api/policies',
    method: 'get',
    params: {
      pageNum,
      pageSize,
      ...params
    }
  }),
  getPolicyDetail: (id) => request({
    url: `/api/policies/${id}`,
    method: 'get'
  }),
  updatePolicy: (id, data) => request({
    url: `/api/policies/${id}`,
    method: 'put',
    data
  }),
  createPolicy: (data) => request({
    url: '/api/policies',
    method: 'post',
    data
  }),
  updatePolicy: (id, data) => request({
    url: `/api/policies/${id}`,
    method: 'put',
    data
  }),
  deletePolicy: (id) => request({
    url: `/api/policies/${id}`,
    method: 'delete'
  }),

  // 项目类别管理
  getCategories: () => request({
    url: '/api/admin/categories',
    method: 'get'
  }),
  addCategory: (data) => request({
    url: '/api/admin/categories',
    method: 'post',
    data
  }),
  deleteCategory: (id) => request({
    url: `/api/admin/categories/${id}`,
    method: 'delete'
  }),

  // 用户管理
  getUserList: (params) => request({
    url: '/api/admin/user/list',
    method: 'get',
    params
  }),
  updateUserStatus: (id, status) => request({
    url: '/api/admin/user/status',
    method: 'put',
    data: {
      id,
      status: status === 'active' ? 1 : 0
    }
  })
}
