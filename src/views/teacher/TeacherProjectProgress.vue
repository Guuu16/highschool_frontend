<template>
    <div class="progress-list-container">
      <h1>项目进度管理</h1>
      
    <el-table :data="projects" style="width: 100%">
      <el-table-column prop="title" label="项目名称" width="180" />
      <el-table-column prop="studentName" label="学生" width="120" />
      <el-table-column prop="categoryName" label="项目类别" width="120" />
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
            @click="viewProgressDetail(row)"
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
import { ElMessage } from 'element-plus'
import axios from 'axios'
import Layout from '@/views/Layout.vue'
import { useRouter } from 'vue-router'
import { teacherApi } from '@/api/teacher'

const router = useRouter()
const projects = ref([])

const getProgressStatus = (progress) => {
  if (progress >= 100) return 'success'
  if (progress >= 70) return 'warning'
  return ''
}

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    
    const [projectsRes, studentsRes, categoriesRes] = await Promise.all([
      teacherApi.getProjects(),
      axios.get('http://localhost:5173/api/api/teacher/students', config),
      axios.get('http://localhost:5173/api/api/student/categories', config)
    ])
    
    if (projectsRes.data?.success) {
      const students = studentsRes.data?.data || []
      const categories = categoriesRes.data?.data || []
        
      projects.value = projectsRes.data.data
        .filter(p => p.status === 1)
        .map(project => ({
          ...project,
          studentName: students.find(s => s.id === project.studentId)?.realName || '未知学生',
          categoryName: categories.find(c => c.id === project.categoryId)?.name || '未知类别'
        }))
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  }
})

const viewProgressDetail = (row) => {
    router.push({
      name: 'TeacherProgressDetail',
      query: { 
        id: row.id,
        title: encodeURIComponent(row.title || ''),
        studentName: encodeURIComponent(row.studentName || '') 
      }
    })
}
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
