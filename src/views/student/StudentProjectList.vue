<template>
  <div class="project-list-container">
    <div class="header">
      <h1>我的项目</h1>
      <el-button 
        type="primary" 
        @click="$router.push('/student/projects/create')"
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
            :disabled="row.status !== 'draft'"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { studentApi } from '@/api/student'

const router = useRouter()
const projects = ref([])

// 模拟项目数据
projects.value = [
  {
    id: 1,
    name: '智能校园管理系统',
    category: '软件开发',
    status: 'approved',
    mentor: '张教授',
    createdAt: '2025-03-01'
  },
  {
    id: 2,
    name: '大学生创业平台',
    category: '商业计划',
    status: 'reviewing',
    mentor: '李教授',
    createdAt: '2025-03-15'
  },
  {
    id: 3,
    name: '环保材料研究',
    category: '科学研究',
    status: 'draft',
    mentor: '',
    createdAt: '2025-03-20'
  }
]

const getStatusType = (status) => {
  const map = {
    draft: 'info',
    reviewing: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return map[status] || ''
}

const getStatusText = (status) => {
  const map = {
    draft: '草稿',
    reviewing: '审核中',
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
