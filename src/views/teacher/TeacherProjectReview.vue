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
          <p><strong>学分：</strong>
            <el-input-number 
              v-model="currentProject.credit" 
              :min="0" 
              :max="10"
              size="small"
              style="margin-left: 10px;"
            />
          </p>
          <p><strong>项目描述：</strong></p>
          <div class="project-description">
            {{ currentProject.description }}
          </div>
          <div v-if="currentProject.planFileUrl" style="margin-top: 15px;">
            <el-button 
              type="primary"
              @click="viewPlanFile(currentProject.planFileUrl)"
            >
              查看计划书
            </el-button>
          </div>
        </div>
        
        <template v-if="activeTab === 'pending'">
          <el-divider />
          <div class="review-comment">
            <label>审核意见：</label>
            <textarea
              v-model="reviewForm.comment"
              rows="3"
              placeholder="请输入审核意见"
              style="width: 100%; margin-top: 10px; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px;"
            ></textarea>
          </div>
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
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { teacherApi } from '@/api/teacher'
import { ElMessage } from 'element-plus'

const activeTab = ref('pending')
const dialogVisible = ref(false)
const currentProject = ref(null)
const loading = ref(false)
const reviewForm = ref({
  comment: ''
})

const pendingProjects = ref([])
const reviewedProjects = ref([])

const fetchProjects = async () => {
  try {
    loading.value = true
    
    // 获取学生列表建立映射
    const studentsRes = await teacherApi.getStudents()
    const studentMap = new Map(studentsRes.data?.data?.map(s => [s.id, s.realName || s.username]))
    
    // 获取分类列表建立映射
    const categoriesRes = await teacherApi.getCategories()
    const categoryMap = new Map(categoriesRes.data?.data?.map(c => [c.id, c.name]))
    
    // 获取所有项目
    const res = await teacherApi.getProjects()
    const allProjects = res.data?.data || []
    
    // 筛选待审核项目(status=0)
    pendingProjects.value = allProjects
      .filter(project => project.status === 0)
      .map(project => ({
        id: project.id,
        name: project.title,
        student: studentMap.get(project.studentId) || '未知学生',
        category: categoryMap.get(project.categoryId) || '未分类',
        description: project.description || '无描述',
        credit: project.credit || 0,
        createdAt: project.createTime ? new Date(project.createTime).toLocaleString() : '未知时间',
        planFileUrl: project.planFileUrl
      }))

    // 筛选已审核项目(status=1或2)
    reviewedProjects.value = allProjects
      .filter(project => project.status === 1 || project.status === 2)
      .map(project => ({
      id: project.id,
      name: project.title,
      student: project.studentName || '未知学生',
      category: project.categoryName || '未分类',
      status: project.status === 1 ? 'approved' : project.status === 2 ? 'rejected' : 'pending',
      reviewTime: project.updateTime ? new Date(project.updateTime).toLocaleString() : '未知时间',
      createdAt: project.createTime ? new Date(project.createTime).toLocaleString() : '未知时间',
      feedback: project.feedback || ''
    }))
  } catch (error) {
    console.error('获取项目列表失败:', error)
    ElMessage.error('获取项目列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProjects()
})

const handleView = async (id) => {
  const projects = activeTab.value === 'pending' ? pendingProjects.value : reviewedProjects.value
  currentProject.value = projects.find(p => p.id === id)
  dialogVisible.value = true
  await nextTick()
  document.querySelector('textarea')?.focus()
}

const handleApprove = (id) => {
  handleView(id)
}

const handleReject = (id) => {
  handleView(id)
}

const viewPlanFile = (fileUrl) => {
  window.open(`${import.meta.env.VITE_API_BASE || ''}/api${fileUrl}`, '_blank')
}

const submitReview = async (status) => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.put(
      `${import.meta.env.VITE_API_BASE || ''}/api/api/projects/${currentProject.value.id}/review`,
      {
        status: status === 'approved' ? 1 : 2,  // 1=通过, 2=拒绝
        feedback: reviewForm.value.comment,
        credit: currentProject.value.credit
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (res.data && res.data.success) {
      // 更新项目状态
      const index = pendingProjects.value.findIndex(p => p.id === currentProject.value.id)
      if (index !== -1) {
        const project = pendingProjects.value.splice(index, 1)[0]
        project.status = status
        project.reviewTime = new Date().toLocaleString()
        project.feedback = reviewForm.value.comment
        reviewedProjects.value.unshift(project)
      }
      
      ElMessage.success('审核提交成功')
      dialogVisible.value = false
      reviewForm.value.comment = ''
    } else {
      ElMessage.error(res.data.message || '审核提交失败')
    }
  } catch (error) {
    console.error('审核提交失败:', error)
    ElMessage.error(error.response?.data?.message || '审核提交失败')
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

.review-comment {
  margin-top: 20px;
}

.review-comment label {
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
}
</style>
