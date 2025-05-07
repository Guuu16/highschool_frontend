<template>
  <div class="progress-detail-container">
    <h1>项目进度详情</h1>
    
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ project.name }}</span>
          <el-tag :type="project.status === 1 ? 'success' : 'info'">
            {{ project.status === 1 ? '进行中' : '已完成' }}
          </el-tag>
        </div>
      </template>

      <el-timeline>
        <el-timeline-item
          v-for="progress in progressList"
          :key="progress.id"
          :timestamp="formatDate(progress.createTime)"
          placement="top"
        >
          <el-card>
            <h4>进度: {{ progress.progress }}%</h4>
            <p>{{ progress.description }}</p>
            <div v-if="progress.attachments && progress.attachments.length">
              <h5>附件:</h5>
              <ul>
                <li v-for="file in progress.attachments" :key="file.id">
                  <el-link 
                    :href="`http://localhost:5173/api${file.url}`" 
                    target="_blank"
                  >
                    {{ file.name }}
                  </el-link>
                </li>
              </ul>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { studentApi } from '@/api/student'
import dayjs from 'dayjs'

const route = useRoute()
const projectId = route.params.id

const project = ref({
  id: '',
  name: '',
  status: 1
})

const progressList = ref([])

const formatDate = (dateStr) => {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm')
}

const fetchProjectProgress = async () => {
  try {
    const res = await studentApi.getProjectProgress(projectId)
    if (res.data?.success) {
      project.value = res.data.project
      progressList.value = res.data.progressList
    }
  } catch (error) {
    console.error('获取进度详情失败:', error)
  }
}

onMounted(() => {
  fetchProjectProgress()
})
</script>

<style scoped>
.progress-detail-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  text-align: center;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-timeline {
  padding-left: 10px;
}
</style>
