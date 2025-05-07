<template>
  <div class="project-detail-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>项目详情</span>
          <el-button 
            type="primary"
            @click="handleEdit"
            :disabled="project.status !== 0 && project.status !== 2"
          >
            编辑项目
          </el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="项目标题">
          {{ project.title }}
        </el-descriptions-item>
        <el-descriptions-item label="项目状态">
          <el-tag :type="statusType">
            {{ statusText }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="指导老师">
          {{ project.teacherName || '未分配' }}
        </el-descriptions-item>
        <el-descriptions-item label="学分">
          {{ project.credit }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ formatDate(project.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ formatDate(project.updateTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="项目描述" :span="2">
          <div class="description-content">
            {{ project.description }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="项目计划书" :span="2">
          <el-link 
            v-if="project.planFileUrl"
            type="primary"
            :href="`http://localhost:5173/api${project.planFileUrl}`"
            target="_blank"
          >
            查看计划书
          </el-link>
          <span v-else>未上传</span>
        </el-descriptions-item>
      </el-descriptions>

      <div class="feedback-section" v-if="project.feedback">
        <h3>导师反馈</h3>
        <el-card>
          {{ project.feedback }}
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { studentApi } from '@/api/student'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const projectId = route.params.id
const baseUrl = import.meta.env.VITE_API_BASE_URL

const project = ref({
  id: '',
  title: '',
  description: '',
  categoryId: '',
  status: 0,
  credit: 0,
  feedback: '',
  planFileUrl: '',
  createTime: '',
  updateTime: ''
})

const statusMap = {
  0: { text: '待审核', type: 'warning' },
  1: { text: '进行中', type: 'primary' },
  2: { text: '已拒绝', type: 'danger' },
  3: { text: '已完成', type: 'success' }
}

const statusText = computed(() => {
  return statusMap[project.value.status]?.text || '未知状态'
})

const statusType = computed(() => {
  return statusMap[project.value.status]?.type || ''
})


const formatDate = (dateStr) => {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss')
}

const fetchProjectDetail = async () => {
  try {
    const res = await studentApi.getProjectDetail(projectId)
    if (res.data?.success) {
      project.value = res.data.data
    } else {
      ElMessage.error(res.data?.message || '获取项目详情失败')
    }
  } catch (error) {
    ElMessage.error('获取项目详情失败: ' + (error.response?.data?.message || error.message))
  }
}

const handleEdit = () => {
  router.push({
    name: 'StudentProjectEdit',
    params: { id: projectId }
  })
}

onMounted(() => {
  fetchProjectDetail()
})
</script>

<style scoped>
.project-detail-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.description-content {
  white-space: pre-line;
}

.feedback-section {
  margin-top: 20px;
}
</style>
