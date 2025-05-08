<template>
  <div class="dashboard-container">
    <h1>教师工作台</h1>
    
    <div class="stats-container">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover">
            <div class="stat-item">
              <div class="stat-value">{{ stats.guidingProjects }}</div>
              <div class="stat-label">指导项目</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <div class="stat-item">
              <div class="stat-value">{{ stats.pendingReview }}</div>
              <div class="stat-label">待审核项目</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" @click="$router.push('/teacher/messages')">
            <div class="stat-item">
              <div class="stat-value">{{ stats.unreadMessages }}</div>
              <div class="stat-label">未读消息</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="quick-actions">
      <h2>快捷操作</h2>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" @click="$router.push('/teacher/project-review')">
            <div class="action-item">
              <el-icon :size="30"><Document /></el-icon>
              <div>项目审核</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" @click="$router.push('/teacher/events')">
            <div class="action-item">
              <el-icon :size="30"><Calendar /></el-icon>
              <div>活动发布</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" @click="$router.push('/teacher/messages')">
            <div class="action-item">
              <el-icon :size="30"><Message /></el-icon>
              <div>消息中心</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Document, User, Calendar, Avatar, Message } from '@element-plus/icons-vue'
import { teacherApi } from '@/api/teacher'
import { ElMessage } from 'element-plus'

const stats = ref({
  guidingProjects: 0,
  pendingReview: 0,
  unreadMessages: 0
})

const fetchStats = async () => {
  try {
    // 获取项目统计
    const projectsRes = await teacherApi.getProjects()
    if (projectsRes.data?.success) {
      const projects = projectsRes.data.data || []
      stats.value.guidingProjects = projects.length
      stats.value.pendingReview = projects.filter(p => p.status === 0).length
    }

    // 获取未读消息数
    const messagesRes = await teacherApi.getUnreadMessageCount()
    if (messagesRes.data?.success) {
      stats.value.unreadMessages = messagesRes.data.data?.count || 0
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
}

.stats-container {
  margin-bottom: 30px;
}

.stat-item {
  text-align: center;
  padding: 20px 0;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.stat-label {
  color: #666;
}

.quick-actions {
  margin-top: 30px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  cursor: pointer;
}

.action-item div {
  margin-top: 10px;
}
</style>
