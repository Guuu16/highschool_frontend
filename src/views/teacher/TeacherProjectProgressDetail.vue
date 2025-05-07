<template>
  <div class="project-progress-detail">
    <div class="content-wrapper">
      <h1>项目进度详情</h1>
    
    <el-card class="project-info">
      <div slot="header">
        <span>项目基本信息</span>
      </div>
      <el-form label-width="120px">
        <el-form-item label="项目名称">
          <el-input v-model="project.title" disabled />
        </el-form-item>
        <el-form-item label="学生姓名">
          <el-input v-model="project.studentName" disabled />
        </el-form-item>
        <el-form-item label="当前进度">
          <el-progress :percentage="project.progress" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="progress-list">
      <div slot="header">
        <span>进度记录</span>
      </div>
      <el-timeline>
        <el-timeline-item
          v-for="(progress, index) in progressList"
          :key="index"
          :timestamp="progress.submittedAt"
          placement="top"
        >
          <el-card>
            <h4>{{ progress.phaseTitle }}</h4>
            <p>进度: {{ progress.progress }}%</p>
            <p>{{ progress.description }}</p>
            <div v-if="progress.fileUrl">
              <p>附件:</p>
              <a :href="`/api/${progress.fileUrl}`" target="_blank">查看文件</a>
            </div>
            <div v-if="progress.feedback">
              <el-divider />
              <h4>教师反馈</h4>
              <p>{{ progress.feedback }}</p>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <el-card class="feedback-form">
      <div slot="header">
        <span>提交反馈</span>
      </div>
      <el-form :model="feedbackForm" :rules="rules" ref="feedbackFormRef">
        <el-form-item label="反馈内容" prop="content">
          <el-input
            v-model="feedbackForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入对项目进度的反馈意见"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFeedback">提交反馈</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { teacherApi } from '@/api/teacher'

const route = useRoute()
const feedbackFormRef = ref(null)

const project = ref({
  id: route.query.id,
  title: route.query.title || '',
  studentName: route.query.studentName || '',
  progress: 0
})

const progressList = ref([])

const feedbackForm = ref({
  content: ''
})

const rules = {
  content: [{ required: true, message: '请输入反馈内容', trigger: 'blur' }]
}

onMounted(async () => {
  try {
    const projectId = route.query.id
    if (projectId) {
      // 直接从路由参数初始化项目信息
      project.value = {
        id: projectId,
        title: decodeURIComponent(route.query.title || ''),
        studentName: decodeURIComponent(route.query.studentName || ''),
        progress: 0
      }

      // 仅获取进度数据
      const progressRes = await teacherApi.getProjectProgress(projectId)
      if (progressRes.data?.success) {
        progressList.value = progressRes.data.data
        // 更新最新进度
        if (progressList.value.length > 0) {
          project.value.progress = progressList.value[0].progress || 0
        }
      }
    }
  } catch (error) {
    console.error('获取项目详情失败:', error)
    ElMessage.error('获取项目详情失败')
  }
})

const submitFeedback = async () => {
  try {
    await feedbackFormRef.value.validate()
    
    const res = await teacherApi.submitFeedback(
      progressList.value[0].id,
      feedbackForm.value.content
    )
    
    if (res.data?.success) {
      ElMessage.success('反馈提交成功')
      const progressRes = await teacherApi.getProjectProgress(project.value.id)
      if (progressRes.data?.success) {
        progressList.value = progressRes.data.data
      }
      feedbackForm.value.content = ''
    }
  } catch (error) {
    console.error('提交反馈失败:', error)
    ElMessage.error('提交反馈失败: ' + (error.response?.data?.message || error.message))
  }
}
</script>

<style scoped>
.project-progress-detail {
  height: 100%;
}

.content-wrapper {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  text-align: center;
}

.project-info,
.progress-list,
.feedback-form {
  margin-bottom: 20px;
}

.el-timeline {
  padding-left: 20px;
  margin-top: 20px;
}

.el-timeline-item {
  margin-bottom: 30px;
}

.el-timeline-item__timestamp {
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}
</style>
