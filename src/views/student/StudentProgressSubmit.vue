<template>
  <div class="progress-submit-container">
    <h1>提交项目进度</h1>
    
    <el-form 
      :model="form" 
      :rules="rules" 
      ref="progressForm" 
      label-width="120px"
    >
      <el-form-item label="选择项目" prop="projectId">
        <el-select 
          v-model="form.projectId" 
          placeholder="请选择项目"
          @change="handleProjectChange"
        >
          <el-option 
            v-for="project in projects"
            :key="project.id"
            :label="project.name"
            :value="project.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="当前进度" prop="progress">
        <el-input-number 
          v-model="form.progress" 
          :min="0" 
          :max="100" 
          :step="10"
          :formatter="value => `${value}%`"
          :parser="value => value.replace('%', '')"
        />
      </el-form-item>
      
      <el-form-item label="进度描述" prop="description">
        <el-input 
          v-model="form.description" 
          type="textarea" 
          :rows="4"
          placeholder="请详细描述项目当前进度"
        />
      </el-form-item>
      
      <el-form-item label="附件上传" prop="attachments">
        <el-upload
          action="#"
          multiple
          :limit="3"
          :file-list="form.attachments"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
        >
          <el-button type="primary">点击上传</el-button>
          <template #tip>
            <div class="el-upload__tip">
              支持上传文档、图片等附件，最多3个文件
            </div>
          </template>
        </el-upload>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm">
          提交进度
        </el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { studentApi } from '@/api/student'

const router = useRouter()
const progressForm = ref(null)

const form = ref({
  projectId: '',
  progress: 0,
  description: '',
  attachments: []
})

const rules = {
  projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
  progress: [{ required: true, message: '请填写进度百分比', trigger: 'blur' }],
  description: [{ required: true, message: '请填写进度描述', trigger: 'blur' }]
}

// 模拟项目数据
const projects = ref([
  { id: 1, name: '智能校园管理系统' },
  { id: 2, name: '大学生创业平台' }
])

const handleProjectChange = (projectId) => {
  // 可以加载项目历史进度等信息
  console.log('选择项目:', projectId)
}

const handleFileChange = (file, fileList) => {
  form.value.attachments = fileList
}

const handleFileRemove = (file, fileList) => {
  form.value.attachments = fileList
}

const submitForm = async () => {
  try {
    await progressForm.value.validate()
    await studentApi.submitProgress(form.value)
    ElMessage.success('进度提交成功')
    router.push('/student/projects')
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const resetForm = () => {
  progressForm.value.resetFields()
  form.value.attachments = []
}
</script>

<style scoped>
.progress-submit-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  text-align: center;
}
</style>
