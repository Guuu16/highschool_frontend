<template>
  <div class="mentor-application-container">
    <h1>导师申请</h1>
    
    <el-form 
      :model="form" 
      :rules="rules" 
      ref="applicationForm" 
      label-width="120px"
    >
      <el-form-item label="选择导师" prop="mentorId">
        <el-select 
          v-model="form.mentorId" 
          placeholder="请选择导师"
          filterable
        >
          <el-option 
            v-for="mentor in mentors"
            :key="mentor.id"
            :label="mentor.name"
            :value="mentor.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="申请项目" prop="projectId">
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
      
      <el-form-item label="项目简介" prop="projectDescription">
        <el-input 
          v-model="form.projectDescription" 
          type="textarea" 
          :rows="3"
          placeholder="请简要描述您的项目"
          readonly
        />
      </el-form-item>
      
      <el-form-item label="申请理由" prop="reason">
        <el-input 
          v-model="form.reason" 
          type="textarea" 
          :rows="4"
          placeholder="请说明您为什么选择这位导师"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm">
          提交申请
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
const applicationForm = ref(null)

const form = ref({
  mentorId: '',
  projectId: '',
  projectDescription: '',
  reason: ''
})

const rules = {
  mentorId: [{ required: true, message: '请选择导师', trigger: 'change' }],
  projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
  reason: [{ required: true, message: '请输入申请理由', trigger: 'blur' }]
}

// 模拟导师数据
const mentors = [
  { id: 1, name: '张教授', field: '计算机科学' },
  { id: 2, name: '李教授', field: '商业管理' },
  { id: 3, name: '王教授', field: '材料科学' }
]

// 模拟项目数据
const projects = [
  { id: 1, name: '智能校园管理系统', description: '开发一个智能化的校园管理系统' },
  { id: 2, name: '大学生创业平台', description: '构建一个帮助大学生创业的在线平台' }
]

const handleProjectChange = (projectId) => {
  const project = projects.find(p => p.id === projectId)
  if (project) {
    form.value.projectDescription = project.description
  }
}

const submitForm = async () => {
  try {
    await applicationForm.value.validate()
    await studentApi.applyMentor(form.value)
    ElMessage.success('导师申请提交成功')
    router.push('/student/projects')
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const resetForm = () => {
  applicationForm.value.resetFields()
  form.value.projectDescription = ''
}
</script>

<style scoped>
.mentor-application-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  text-align: center;
}
</style>
