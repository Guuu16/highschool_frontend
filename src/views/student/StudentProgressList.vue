<template>
  <div class="progress-list-container">
    <h1>项目进度管理</h1>
    
    <el-table :data="projects" style="width: 100%">
      <el-table-column prop="title" label="项目名称" width="180" />
      <el-table-column prop="categoryName" label="项目类别" width="120" />
      <el-table-column prop="teacherName" label="指导老师" width="120" />
      <el-table-column label="当前进度">
        <template #default="{row}">
          <el-progress 
            :percentage="row.progress || 0" 
            :status="getProgressStatus(row.progress)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{row}">
          <el-button 
            type="primary" 
            size="small"
            @click="goToSubmitProgress(row.id)"
          >
            提交进度
          </el-button>
          <el-button 
            type="info" 
            size="small"
            @click="viewProgressDetail(row.id)"
          >
            查看详情
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

const router = useRouter()
const projects = ref([])

const getProgressStatus = (progress) => {
  if (progress >= 100) return 'success'
  if (progress >= 70) return 'warning'
  return ''
}

const categories = ref([])
const teachers = ref([])

const fetchCategories = async () => {
  try {
    const res = await studentApi.getCategories()
    if (res.data?.success) {
      categories.value = res.data.data
    }
  } catch (error) {
    console.error('获取项目类别失败:', error)
  }
}

const fetchTeachers = async () => {
  try {
    const res = await studentApi.getTeachers()
    if (res.data?.success) {
      teachers.value = res.data.data
    }
  } catch (error) {
    console.error('获取指导老师失败:', error)
  }
}

const fetchProjects = async () => {
  try {
    const [projectsRes, categoriesRes, teachersRes] = await Promise.all([
      studentApi.getMyProjects(),
      studentApi.getCategories(),
      studentApi.getTeachers()
    ])
    
    if (projectsRes.data?.success) {
      projects.value = projectsRes.data.data
        .filter(p => p.status === 1)
        .map(project => ({
          ...project,
          categoryName: categoriesRes.data?.data?.find(c => c.id === project.categoryId)?.name || '未知类别',
          teacherName: teachersRes.data?.data?.find(t => t.id === project.teacherId)?.realName || '未知老师'
        }))
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  }
}

onMounted(() => {
  fetchProjects()
})

const goToSubmitProgress = (projectId) => {
  router.push(`/student/progress-submit?projectId=${projectId}`)
}

const viewProgressDetail = (projectId) => {
  router.push(`/student/progress/${projectId}`)
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
.progress-list-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  text-align: center;
}
</style>
