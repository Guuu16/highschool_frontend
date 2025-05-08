<template>
  <div class="dashboard-container">
    <el-row :gutter="20" class="mb-20">
      <el-col :span="8">
        <el-card shadow="hover" class="quick-action-card" @click="$router.push('/admin/user/list')">
          <div class="quick-action">
            <el-icon :size="30"><User /></el-icon>
            <div class="action-title">用户管理</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="quick-action-card" @click="$router.push('/admin/policies')">
          <div class="quick-action">
            <el-icon :size="30"><Document /></el-icon>
            <div class="action-title">公告管理</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="quick-action-card" @click="$router.push('/admin/settings')">
          <div class="quick-action">
            <el-icon :size="30"><Setting /></el-icon>
            <div class="action-title">系统设置</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card shadow="hover" class="user-stats-card">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-title">总用户数</div>
          <div class="stat-value">{{ stats.totalUsers }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-title">管理员</div>
          <div class="stat-value">{{ stats.adminCount }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-title">教师</div>
          <div class="stat-value">{{ stats.teacherCount }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-title">学生</div>
          <div class="stat-value">{{ stats.studentCount }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-title">活跃用户</div>
          <div class="stat-value">{{ stats.activeUsers }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/admin'
import { ElMessage } from 'element-plus'
import { User, Document, Setting } from '@element-plus/icons-vue'

const stats = ref({
  totalUsers: 0,
  adminCount: 0,
  teacherCount: 0,
  studentCount: 0,
  activeUsers: 0
})

const fetchUserStats = async () => {
  try {
    const res = await adminApi.getUserList({ page: 1, size: 1000 })
    if (res.data?.success) {
      const users = res.data.data.records
      
      stats.value = {
        totalUsers: res.data.data.total,
        adminCount: users.filter(u => u.role === 'ADMIN').length,
        teacherCount: users.filter(u => u.role === 'TEACHER').length,
        studentCount: users.filter(u => u.role === 'STUDENT').length,
        activeUsers: users.filter(u => u.status === 1).length
      }
    }
  } catch (error) {
    ElMessage.error('获取用户数据失败: ' + (error.response?.data?.message || error.message))
  }
}

onMounted(fetchUserStats)
</script>

<style scoped>
.dashboard-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.user-stats-card {
  margin-bottom: 20px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  padding: 16px;
}
.stat-item {
  text-align: center;
  padding: 12px 0;
}
.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 12px;
}
.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #409eff;
}

.quick-action-card {
  transition: all 0.3s;
  border-radius: 8px;
  text-align: center;
  padding: 20px 0;
  background: linear-gradient(135deg, #f6f8fa 0%, #e9ecef 100%);
}
.quick-action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
}
.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.action-title {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #606266;
}
.el-icon {
  color: #409eff;
}

.mt-20 {
  margin-top: 20px;
}
.mb-20 {
  margin-bottom: 20px;
}
</style>
