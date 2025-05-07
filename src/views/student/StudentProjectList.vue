<template>
  <div class="project-list-container">
    <div class="header">
      <h1>我的项目</h1>
      <el-button 
        type="primary" 
        @click="$router.push('/student/projects/new')"
      >
        新建项目
      </el-button>
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="全部项目" name="all">
        <el-table :data="projects" style="width: 100%">
          <el-table-column prop="name" label="项目名称" width="180" />
          <el-table-column prop="category" label="项目类别" width="120" />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="mentor" label="指导老师" width="120" />
          <el-table-column prop="createdAt" label="创建时间" width="180" />
          <el-table-column label="操作" width="180">
            <template #default="{ row }">
              <el-button 
                size="small" 
                @click="handleView(row.id)"
              >
                查看
              </el-button>
              <el-button 
                size="small" 
                type="primary" 
                @click="handleEdit(row.id)"
                :disabled="row.status !== 'pending' && row.status !== 'rejected'"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      
      <el-tab-pane label="待审核" name="pending">
        <el-table :data="pendingProjects" style="width: 100%">
          <el-table-column prop="name" label="项目名称" width="180" />
          <el-table-column prop="category" label="项目类别" width="120" />
          <el-table-column prop="mentor" label="指导老师" width="120" />
          <el-table-column prop="createdAt" label="创建时间" width="180" />
          <el-table-column label="操作" width="180">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row.id)">查看</el-button>
              <el-button size="small" type="primary" @click="handleEdit(row.id)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { studentApi } from '@/api/student'
import { ElMessage } from 'element-plus'

const router = useRouter()
const activeTab = ref('all')
const projects = ref([])
const pendingProjects = computed(() => projects.value.filter(p => p.status === 'pending'))
const inProgressProjects = computed(() => projects.value.filter(p => p.status === 'approved'))
const categories = ref([])
const teachers = ref([])
const loading = ref(false)

// 获取项目类别
const fetchCategories = async () => {
  try {
    const res = await studentApi.getCategories()
    categories.value = (res.data?.data || res.data || []).map(category => ({
      id: category.id,
      name: category.name
    }))
  } catch (error) {
    console.error('获取类别失败:', error)
    ElMessage.error('获取项目类别失败')
  }
}

// 获取教师列表
const fetchTeachers = async () => {
  try {
    const res = await studentApi.getTeachers()
    teachers.value = (res.data?.data || res.data || []).map(teacher => ({
      id: teacher.id,
      name: teacher.realName
    }))
  } catch (error) {
    console.error('获取教师失败:', error)
    ElMessage.error('获取教师列表失败')
  }
}

// 获取项目列表
const fetchProjects = async () => {
  loading.value = true
  try {
    const { data } = await studentApi.getMyProjects()
    if (data.success) {
      projects.value = data.data.map(item => ({
        id: item.id,
        name: item.title,
        category: categories.value.find(c => c.id === item.categoryId)?.name || '其他',
        status: item.status === 0 ? 'pending' : 
               item.status === 1 ? 'approved' : 'rejected',
        mentor: teachers.value.find(t => t.id === item.teacherId)?.name || '',
        createdAt: item.createTime.split('T')[0],
        hasDocument: !!item.planFileUrl
      })) || []
    } else {
      ElMessage.error(data.message || '获取项目列表失败')
    }
  } catch (error) {
    console.error('获取项目列表失败:', error)
    ElMessage.error('获取项目列表失败')
  } finally {
    loading.value = false
  }
}

// 初始化加载数据
onMounted(async () => {
  await fetchCategories()
  await fetchTeachers()
  await fetchProjects()
})

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    approved: 'success', 
    rejected: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return map[status] || status
}

const handleView = (id) => {
  router.push(`/projects/${id}`)
}

const handleEdit = (id) => {
  router.push(`/student/projects/edit/${id}`)
}
</script>

<style scoped>
.project-list-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
