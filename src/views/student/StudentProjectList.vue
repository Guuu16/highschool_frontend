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
            :disabled="row.status !== 'pending'"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { studentApi } from '@/api/student'
import { ElMessage } from 'element-plus'

const router = useRouter()
const projects = ref([])
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
    console.log('项目类别:', categories.value)
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
    console.log('教师列表:', teachers.value)
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
        createdAt: item.createTime.split('T')[0]
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
  router.push(`/student/projects/${id}`)
}

const handleEdit = (id) => {
  router.push(`/student/projects/${id}/edit`)
}

// 实际项目中应该从API获取数据
// const fetchProjects = async () => {
//   const { data } = await studentApi.getMyProjects()
//   projects.value = data
// }
// fetchProjects()
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
