<template>
  <div class="progress-submit-container">
    <h1>提交项目进度</h1>
    
    <el-form 
      :model="form" 
      :rules="rules" 
      ref="progressForm" 
      label-width="120px"
    >
      <el-form-item label="项目名称">
        <el-input v-model="currentProject.name" disabled />
      </el-form-item>
      <el-form-item label="项目类别">
        <el-input :value="categoryName" disabled />
      </el-form-item>
      <el-form-item label="指导老师">
        <el-input :value="teacherName" disabled />
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
          action=""
          multiple
          :limit="3"
          :file-list="form.attachments"
          :auto-upload="false"
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
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { studentApi } from '@/api/student'

const router = useRouter()
const route = useRoute()
const progressForm = ref(null)

const currentProject = ref({
  id: route.query.projectId,
  name: '',
  category: null,
  teacher: null
})

const categoryName = ref('')
const teacherName = ref('')

const form = ref({
  progress: 0,
  description: '',
  attachments: []
})

const rules = {
  progress: [{ required: true, message: '请填写进度百分比', trigger: 'blur' }],
  description: [{ required: true, message: '请填写进度描述', trigger: 'blur' }]
}


onMounted(async () => {
  try {
    const projectId = route.query.projectId
    if (projectId) {
        const [projectRes, teachersRes, categoriesRes] = await Promise.all([
        studentApi.getProjectDetail(projectId),
        studentApi.getTeachers(),
        studentApi.getCategories()
      ])

      if (projectRes.data?.success) {
        const project = projectRes.data.data
        currentProject.value = {
          id: projectId,
          name: project.title || `项目 ${projectId}`,
          description: project.description,
          category: project.categoryId,
          teacher: project.teacherId
        }
        // 设置默认进度为当前进度+10%
        form.value.progress = Math.min(project.progress + 10, 100)

        // 从API获取老师信息
        if (teachersRes.data?.success) {
          const teacher = teachersRes.data.data.find(t => t.id === project.teacherId)
          teacherName.value = teacher?.realName || `老师 ${project.teacherId}`
        }

        // 从API获取类别信息
        if (categoriesRes.data?.success) {
          const category = categoriesRes.data.data.find(c => c.id === project.categoryId)
          categoryName.value = category?.name || `类别 ${project.categoryId}`
        }
      }
    }
  } catch (error) {
    console.error('获取项目详情失败:', error)
    ElMessage.error('获取项目详情失败')
  }
})


const handleFileChange = (file, fileList) => {
  form.value.attachments = fileList.map(f => ({
    name: f.name,
    size: f.size,
    raw: f.raw || f
  }))
}

const handleFileRemove = (file, fileList) => {
  form.value.attachments = fileList
}

const submitForm = async () => {
  try {
    if (!progressForm.value) return
    await progressForm.value.validate()

    // 确保progress是数字类型
    const progressValue = Number(form.value.progress)
    if (isNaN(progressValue)) {
      throw new Error('进度值必须是数字')
    }

    const formData = new FormData()
    formData.append('progressPercent', progressValue)
    formData.append('phaseTitle', `阶段更新 ${new Date().toLocaleDateString()}`)
    formData.append('description', form.value.description)
    if (form.value.attachments.length > 0) {
      form.value.attachments.forEach(file => {
        formData.append('file', file.raw)
      })
    }

    const res = await studentApi.submitProgress(
      Number(currentProject.value.id), 
      formData
    )
    if (res.data?.success) {
      ElMessage.success('进度提交成功')
      router.push('/student/projects')
    }
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败: ' + (error.response?.data?.message || error.message))
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
