<template>
  <div class="dashboard-container">
    <h1>管理员工作台</h1>
    
    <div class="stats-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-item">
              <div class="stat-value">{{ stats.userCount }}</div>
              <div class="stat-label">用户总数</div>
              <el-progress 
                :percentage="stats.userGrowth" 
                :color="customColors" 
                :show-text="false"
              />
              <div class="stat-trend">
                <span :class="stats.userGrowth >= 0 ? 'up' : 'down'">
                  {{ stats.userGrowth >= 0 ? '↑' : '↓' }} {{ Math.abs(stats.userGrowth) }}%
                </span>
                较上月
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-item">
              <div class="stat-value">{{ stats.projectCount }}</div>
              <div class="stat-label">项目总数</div>
              <el-progress 
                :percentage="stats.projectGrowth" 
                :color="customColors" 
                :show-text="false"
              />
              <div class="stat-trend">
                <span :class="stats.projectGrowth >= 0 ? 'up' : 'down'">
                  {{ stats.projectGrowth >= 0 ? '↑' : '↓' }} {{ Math.abs(stats.projectGrowth) }}%
                </span>
                较上月
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-item">
              <div class="stat-value">{{ stats.activeUserCount }}</div>
              <div class="stat-label">活跃用户</div>
              <el-progress 
                :percentage="stats.activeUserRate" 
                :color="customColors" 
                :show-text="false"
              />
              <div class="stat-trend">
                <span>{{ stats.activeUserRate }}%</span>
                活跃率
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-item">
              <div class="stat-value">{{ stats.pendingApprovals }}</div>
              <div class="stat-label">待审批</div>
              <el-progress 
                :percentage="stats.approvalCompletion" 
                :color="customColors" 
                :show-text="false"
              />
              <div class="stat-trend">
                <span>{{ stats.approvalCompletion }}%</span>
                完成率
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="dashboard-content">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card shadow="hover">
            <div class="chart-container">
              <h3>项目增长趋势</h3>
              <div class="chart-placeholder">
                <!-- 这里实际项目中会接入ECharts图表 -->
                <div style="width: 100%; height: 300px; background: #f5f7fa; display: flex; align-items: center; justify-content: center; color: #999;">
                  项目增长图表占位区
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <div class="quick-actions">
              <h3>快捷操作</h3>
              <el-button 
                type="primary" 
                icon="User" 
                @click="$router.push('/admin/users')"
              >
                用户管理
              </el-button>
              <el-button 
                type="success" 
                icon="Setting" 
                @click="$router.push('/admin/settings')"
              >
                系统设置
              </el-button>
              <el-button 
                type="warning" 
                icon="Document" 
                @click="$router.push('/admin/policies')"
              >
                政策管理
              </el-button>
              <el-button 
                type="info" 
                icon="Message" 
                @click="$router.push('/admin/notices')"
              >
                公告管理
              </el-button>
            </div>
          </el-card>
          
          <el-card shadow="hover" style="margin-top: 20px;">
            <div class="todo-list">
              <h3>待办事项</h3>
              <el-scrollbar height="200px">
                <div 
                  v-for="item in todos" 
                  :key="item.id" 
                  class="todo-item"
                  :class="{ completed: item.completed }"
                >
                  <el-checkbox v-model="item.completed" />
                  <span>{{ item.title }}</span>
                  <el-tag size="small" :type="getPriorityType(item.priority)">
                    {{ item.priority }}
                  </el-tag>
                </div>
              </el-scrollbar>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const customColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

const stats = ref({
  userCount: 256,
  userGrowth: 12.5,
  projectCount: 89,
  projectGrowth: 8.3,
  activeUserCount: 183,
  activeUserRate: 71.5,
  pendingApprovals: 15,
  approvalCompletion: 65
})

const todos = ref([
  { id: 1, title: '审核新用户注册申请', priority: '高', completed: false },
  { id: 2, title: '更新系统公告', priority: '中', completed: false },
  { id: 3, title: '处理学生投诉', priority: '高', completed: true },
  { id: 4, title: '备份系统数据', priority: '低', completed: false },
  { id: 5, title: '检查服务器状态', priority: '中', completed: false }
])

const getPriorityType = (priority) => {
  const map = {
    '高': 'danger',
    '中': 'warning',
    '低': 'success'
  }
  return map[priority] || ''
}
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
  padding: 15px 0;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  margin-bottom: 10px;
}

.stat-trend {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.stat-trend .up {
  color: #67c23a;
}

.stat-trend .down {
  color: #f56c6c;
}

.dashboard-content {
  margin-top: 20px;
}

.chart-container {
  padding: 15px;
}

.chart-container h3 {
  margin-bottom: 15px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.quick-actions {
  padding: 15px;
  text-align: center;
}

.quick-actions h3 {
  margin-bottom: 15px;
}

.quick-actions .el-button {
  margin: 5px;
  width: 120px;
}

.todo-list {
  padding: 15px;
}

.todo-list h3 {
  margin-bottom: 15px;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item .el-checkbox {
  margin-right: 10px;
}

.todo-item span {
  flex: 1;
}

.todo-item.completed span {
  text-decoration: line-through;
  color: #999;
}

.todo-item .el-tag {
  margin-left: 10px;
}
</style>
