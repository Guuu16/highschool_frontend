<template>
  <div class="dashboard-container">
    <h1>学生工作台</h1>
    
    <div class="stats-container">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover">
            <div class="stat-item">
              <div class="stat-value">{{ stats.inProgress }}</div>
              <div class="stat-label">进行中的项目</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <div class="stat-item">
              <div class="stat-value">{{ stats.pending }}</div>
              <div class="stat-label">待审核的项目</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
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
        <el-col :span="8">
          <el-card shadow="hover" @click="$router.push('/student/projects/new')">
            <div class="action-item">
              <el-icon :size="30"><DocumentAdd /></el-icon>
              <div>新建项目</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" @click="$router.push('/student/projects')">
            <div class="action-item">
              <el-icon :size="30"><List /></el-icon>
              <div>我的项目</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" @click="$router.push('/student/messages')">
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
import { DocumentAdd, List, User, Message } from '@element-plus/icons-vue'
import { studentApi } from '@/api/student'
import { ElMessage } from 'element-plus'

const stats = ref({
  inProgress: 0,
  pending: 0,
  unreadMessages: 0
})

const fetchStats = async () => {
  try {
    // 获取项目统计
    const projectsRes = await studentApi.getMyProjects()
    if (projectsRes.data?.success) {
      const projects = projectsRes.data.data || []
      stats.value.inProgress = projects.filter(p => p.status === 1).length
      stats.value.pending = projects.filter(p => p.status === 0).length
    }

    try {
      // 获取未读消息数
      const messagesRes = await studentApi.getUnreadMessageCount()
      if (messagesRes.data?.success) {
        stats.value.unreadMessages = messagesRes.data.data || 0
      }
    } catch (error) {
      console.error('获取未读消息数失败:', error)
      stats.value.unreadMessages = 0
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
