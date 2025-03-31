<template>
  <div class="mentor-review-container">
    <h1>导师申请审核</h1>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="待处理" name="pending">
        <el-table :data="pendingApplications" style="width: 100%">
          <el-table-column prop="student" label="学生姓名" width="120" />
          <el-table-column prop="project" label="项目名称" width="180" />
          <el-table-column prop="reason" label="申请理由" show-overflow-tooltip />
          <el-table-column prop="appliedAt" label="申请时间" width="180" />
          <el-table-column label="操作" width="220">
            <template #default="{ row }">
              <el-button 
                size="small" 
                @click="handleView(row.id)"
              >
                查看详情
              </el-button>
              <el-button 
                size="small" 
                type="success" 
                @click="handleApprove(row.id)"
              >
                接受
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click="handleReject(row.id)"
              >
                拒绝
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      
      <el-tab-pane label="已处理" name="reviewed">
        <el-table :data="reviewedApplications" style="width: 100%">
          <el-table-column prop="student" label="学生姓名" width="120" />
          <el-table-column prop="project" label="项目名称" width="180" />
          <el-table-column prop="status" label="处理状态" width="120">
            <template #default="{ row }">
              <el-tag :type="row.status === 'approved' ? 'success' : 'danger'">
                {{ row.status === 'approved' ? '已接受' : '已拒绝' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reviewedAt" label="处理时间" width="180" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button 
                size="small" 
                @click="handleView(row.id)"
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 申请详情对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="`导师申请 - ${currentApplication?.student}`" 
      width="60%"
    >
      <div v-if="currentApplication">
        <div class="application-info">
          <p><strong>学生姓名：</strong>{{ currentApplication.student }}</p>
          <p><strong>项目名称：</strong>{{ currentApplication.project }}</p>
          <p><strong>申请时间：</strong>{{ currentApplication.appliedAt }}</p>
          <p><strong>申请理由：</strong></p>
          <div class="application-reason">
            {{ currentApplication.reason }}
          </div>
        </div>
        
        <template v-if="activeTab === 'pending'">
          <el-divider />
          <el-form 
            ref="reviewForm" 
            :model="reviewForm" 
            label-width="80px"
          >
            <el-form-item label="审核意见" prop="comment">
              <el-input 
                v-model="reviewForm.comment" 
                type="textarea" 
                :rows="3"
                placeholder="请输入审核意见"
              />
            </el-form-item>
          </el-form>
        </template>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button 
            v-if="activeTab === 'pending'"
            type="success" 
            @click="submitReview('approved')"
          >
            接受申请
          </el-button>
          <el-button 
            v-if="activeTab === 'pending'"
            type="danger" 
            @click="submitReview('rejected')"
          >
            拒绝申请
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { teacherApi } from '@/api/teacher'

const activeTab = ref('pending')
const dialogVisible = ref(false)
const currentApplication = ref(null)
const reviewForm = ref({
  comment: ''
})

// 模拟待处理申请数据
const pendingApplications = ref([
  {
    id: 1,
    student: '张三',
    project: '智能校园管理系统',
    reason: '我对张教授在软件开发领域的研究非常感兴趣，希望能得到指导',
    appliedAt: '2025-03-28'
  },
  {
    id: 2,
    student: '李四',
    project: '大学生创业平台',
    reason: '希望李教授能在商业计划方面给予专业指导',
    appliedAt: '2025-03-29'
  }
])

// 模拟已处理申请数据
const reviewedApplications = ref([
  {
    id: 3,
    student: '王五',
    project: '环保材料研究',
    status: 'approved',
    reason: '对王教授的材料科学研究方向非常感兴趣',
    appliedAt: '2025-03-25',
    reviewedAt: '2025-03-26'
  },
  {
    id: 4,
    student: '赵六',
    project: '校园垃圾分类',
    status: 'rejected',
    reason: '希望能在社会实践方面得到指导',
    appliedAt: '2025-03-20',
    reviewedAt: '2025-03-21'
  }
])

const handleView = (id) => {
  const applications = activeTab.value === 'pending' ? pendingApplications.value : reviewedApplications.value
  currentApplication.value = applications.find(a => a.id === id)
  dialogVisible.value = true
}

const handleApprove = (id) => {
  handleView(id)
}

const handleReject = (id) => {
  handleView(id)
}

const submitReview = async (status) => {
  try {
    await teacherApi.reviewMentorApplication({
      applicationId: currentApplication.value.id,
      status,
      comment: reviewForm.value.comment
    })
    
    // 更新申请状态
    const index = pendingApplications.value.findIndex(a => a.id === currentApplication.value.id)
    if (index !== -1) {
      const application = pendingApplications.value.splice(index, 1)[0]
      application.status = status
      application.reviewedAt = new Date().toLocaleDateString()
      reviewedApplications.value.unshift(application)
    }
    
    ElMessage.success('审核提交成功')
    dialogVisible.value = false
    reviewForm.value.comment = ''
  } catch (error) {
    console.error('审核提交失败:', error)
  }
}
</script>

<style scoped>
.mentor-review-container {
  padding: 20px;
}

.application-info p {
  margin-bottom: 10px;
}

.application-reason {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-top: 10px;
}
</style>
