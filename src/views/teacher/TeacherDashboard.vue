<template>
  <div class="dashboard-container">
    <h1>教师工作台</h1>
    
    <div class="stats-container">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover">
            <div class="stat-item">
              <div class="stat-value">5</div>
              <div class="stat-label">指导项目</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <div class="stat-item">
              <div class="stat-value">3</div>
              <div class="stat-label">待审核项目</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <div class="stat-item">
              <div class="stat-value">2</div>
              <div class="stat-label">导师申请</div>
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
          <el-card shadow="hover" @click="$router.push('/teacher/mentor-review')">
            <div class="action-item">
              <el-icon :size="30"><User /></el-icon>
              <div>导师申请</div>
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
          <el-card shadow="hover" @click="$router.push('/teacher/students')">
            <div class="action-item">
              <el-icon :size="30"><Avatar /></el-icon>
              <div>学生管理</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { Document, User, Calendar, Avatar } from '@element-plus/icons-vue'
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
