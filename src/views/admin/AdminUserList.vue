<template>
  <div class="user-list-container">
    <div class="header">
      <h1>用户管理</h1>
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户"
          style="width: 300px"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
        
        <el-select
          v-model="roleFilter"
          placeholder="按角色筛选"
          clearable
          style="margin-left: 10px; width: 120px"
          @change="handleSearch"
        >
          <el-option
            v-for="role in roleOptions"
            :key="role.value"
            :label="role.label"
            :value="role.value"
          />
        </el-select>
      </div>
    </div>

    <el-table 
      :data="users" 
      style="width: 100%"
      v-loading="loading"
      empty-text="暂无数据"
    >
      <template #empty>
        <div class="empty-container">
          <el-empty description="暂无用户数据" />
        </div>
      </template>
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="getRoleType(row.role)">
            {{ getRoleText(row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
            <el-switch
            v-model="row.status"
            active-value="active"
            inactive-value="inactive"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="注册时间" width="180">
        <template #default="{row}">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button 
            size="small" 
            @click="handleEdit(row.id)"
          >
            编辑
          </el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="handleDelete(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑用户对话框 -->
    <el-dialog 
      v-model="showEditDialog" 
      title="编辑用户" 
      width="40%"
    >
      <el-form 
        :model="editForm" 
        :rules="rules" 
        ref="editFormRef" 
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled />
        </el-form-item>
        
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        
        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role" placeholder="请选择角色">
            <el-option
              v-for="role in roleOptions"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditDialog = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { adminApi } from '@/api/admin'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const showEditDialog = ref(false)
const editFormRef = ref(null)
const currentUserId = ref(null)

const searchQuery = ref('')
const roleFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const roleOptions = [
  { value: 'admin', label: '管理员' },
  { value: 'teacher', label: '教师' },
  { value: 'student', label: '学生' }
]

const editForm = ref({
  username: '',
  name: '',
  email: '',
  role: '',
  status: 'active'
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const users = ref([])

onMounted(() => {
  fetchUsers()
})

const fetchUsers = async () => {
  try {
    loading.value = true
    console.log('发送请求参数:', {
      page: currentPage.value,
      size: pageSize.value
    })
    const res = await adminApi.getUserList({
      page: currentPage.value,
      size: pageSize.value
    })
    console.log('API原始响应:', JSON.stringify(res, null, 2))
    // 强制刷新数据绑定
    // 根据实际API响应结构调整
    const responseData = res.data?.data || {}
    const rawData = responseData.records || []
    console.log('原始数据:', JSON.stringify(rawData, null, 2))
    
    // 格式化用户数据
    const formattedData = rawData.map(user => ({
      id: user.id,
      username: user.username,
      name: user.realName || user.name || '未知',
      email: user.email || '未设置',
      role: user.role?.toLowerCase() || 'unknown',
      status: user.status === 1 ? 'active' : 'inactive',
      createdAt: user.createTime || '未知时间'
    }))
    
    console.log('格式化后数据:', JSON.stringify(formattedData, null, 2))
    users.value = formattedData
    total.value = responseData.total || 0
    
    // 强制刷新组件
    users.value = [...users.value]
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

const getRoleType = (role) => {
  const map = {
    admin: 'danger',
    teacher: 'warning',
    student: 'success'
  }
  return map[role] || ''
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-')
}

const getRoleText = (role) => {
  const map = {
    admin: '管理员',
    teacher: '教师',
    student: '学生'
  }
  return map[role] || role
}

const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchUsers()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchUsers()
}

const handleStatusChange = async (user) => {
  // 打印完整用户对象和列表状态
  console.log('当前用户列表状态:', JSON.stringify(user.status, null, 2))
  // console.log('当前用户:', JSON.stringify(user, null, 2))
  
  
  const originalStatus = user.status === 'active' ? 'inactive' : 'active' //解释一下。

  console.log('原始状态:', originalStatus, 
    '类型:', typeof originalStatus, 
    '值:', originalStatus)
  const newStatus = originalStatus === 'active' ? 'inactive' : 'active'
  const newBackendStatus = newStatus === 'active' ? 1 : 0
  

  
  // 立即更新UI状态
  user.status = newStatus
  users.value = [...users.value]
  
  try {
    
    console.log(`切换状态：前端${originalStatus}->${user.status}, 后端传值:${newBackendStatus}`)
    const res = await adminApi.updateUserStatus(user.id, newBackendStatus)
    console.log('状态更新响应:', res)
    
    if (!res.data?.success) {
      throw new Error(res.data?.message || '状态更新失败')
    }
    
    ElMessage({
      message: '状态更新成功',
      type: 'success',
      duration: 2000,
      showClose: true
    })
    
    // 更新本地数据状态
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value[index].status = originalStatus === 'active' ? 'inactive' : 'active'
      users.value = [...users.value]
    }
  } catch (error) {
    console.error('状态更新失败:', error)
    // 恢复原状态
    user.status = originalStatus
    users.value = [...users.value]
    ElMessage({
      message: error.message || '状态更新失败',
      type: 'error',
      duration: 2000,
      showClose: true
    })
  }
}

const handleEdit = (id) => {
  const user = users.value.find(u => u.id === id)
  if (user) {
    currentUserId.value = id
    editForm.value = {
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
    showEditDialog.value = true
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await adminApi.deleteUser(id)
    users.value = users.value.filter(u => u.id !== id)
    ElMessage.success('用户删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

const submitEdit = async () => {
  try {
    await editFormRef.value.validate()
    await adminApi.updateUser(currentUserId.value, editForm.value)
    
    const index = users.value.findIndex(u => u.id === currentUserId.value)
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        ...editForm.value
      }
    }
    
    ElMessage.success('用户信息更新成功')
    showEditDialog.value = false
  } catch (error) {
    console.error('更新失败:', error)
  }
}
</script>

<style scoped>
.user-list-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
