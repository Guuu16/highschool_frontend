<template>
  <div class="project-review-container">
    <h1>项目审核</h1>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="待审核" name="pending">
        <el-table :data="pendingProjects" style="width: 100%">
          <el-table-column prop="name" label="项目名称" width="180" />
          <el-table-column prop="student" label="申请人" width="120" />
          <el-table-column prop="category" label="项目类别" width="120" />
          <el-table-column prop="createdAt" label="申请时间" width="180" />
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
                通过
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
      
      <el-tab-pane label="已审核" name="reviewed">
        <el-table :data="reviewedProjects" style="width: 100%">
          <el-table-column prop="name" label="项目名称" width="180" />
          <el-table-column prop="student" label="申请人" width="120" />
          <el-table-column prop="status" label="审核状态" width="120">
            <template #default="{ row }">
              <el-tag :type="row.status === 'approved' ? 'success' : 'danger'">
                {{ row.status === 'approved' ? '已通过' : '已拒绝' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reviewTime" label="审核时间" width="180" />
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
    
    <!-- 项目详情对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="currentProject?.name" 
      width="60%"
    >
      <div v-if="currentProject">
        <div class="project-info">
          <p><strong>申请人：</strong>{{ currentProject.student }}</p>
          <p><strong>项目类别：</strong>{{ currentProject.category }}</p>
          <p><strong>申请时间：</strong>{{ currentProject.createdAt }}</p>
          <p><strong>项目描述：</strong></p>
          <div class="project-description">
            {{ currentProject.description }}
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
            通过审核
          </el-button>
          <el-button 
            v-if="activeTab === 'pending'"
            type="danger" 
            @click="submitReview('rejected')"
          >
            拒绝审核
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
const currentProject = ref(null)
const reviewForm = ref({
  comment: ''
})

// 模拟待审核项目数据
const pendingProjects = ref([
  {
    id: 1,
    name: '智能校园管理系统',
    student: '张三',
    category: '软件开发',
    description: '开发一个智能化的校园管理系统，包括学生管理、课程管理等功能模块。',
    createdAt: '2025-03-25'
  },
  {
    id: 2,
    name: '大学生创业平台',
    student: '李四',
    category: '商业计划',
    description: '构建一个帮助大学生创业的在线平台，提供项目展示、资源对接等服务。',
    createdAt: '2025-03-28'
  },
  {
    id: 5,
    name: 'AI学习助手',
    student: '钱七',
    category: '人工智能',
    description: '开发基于大语言模型的学习助手，帮助学生解答问题。',
    createdAt: '2025-03-30'
  }
])

// 模拟已审核项目数据
const reviewedProjects = ref([
  {
    id: 3,
    name: '环保材料研究',
    student: '王五',
    category: '科学研究',
    status: 'approved',
    reviewTime: '2025-03-20',
    createdAt: '2025-03-15'
  },
  {
    id: 4,
    name: '校园垃圾分类',
    student: '赵六',
    category: '社会实践',
    status: 'rejected',
    reviewTime: '2025-03-18',
    createdAt: '2025-03-10'
  },
  {
    id: 6,
    name: '校园二手交易平台',
    student: '孙八',
    category: '软件开发',
    status: 'approved',
    reviewTime: '2025-03-22',
    createdAt: '2025-03-12'
  }
])

const handleView = (id) => {
  const projects = activeTab.value === 'pending' ? pendingProjects.value : reviewedProjects.value
  currentProject.value = projects.find(p => p.id === id)
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
    await teacherApi.reviewProject({
      projectId: currentProject.value.id,
      status,
      comment: reviewForm.value.comment
    })
    
    // 更新项目状态
    const index = pendingProjects.value.findIndex(p => p.id === currentProject.value.id)
    if (index !== -1) {
      const project = pendingProjects.value.splice(index, 1)[0]
      project.status = status
      project.reviewTime = new Date().toLocaleDateString()
      reviewedProjects.value.unshift(project)
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
.project-review-container {
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
}

.project-info p {
  margin-bottom: 10px;
}

.project-description {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-top: 10px;
}
</style>
