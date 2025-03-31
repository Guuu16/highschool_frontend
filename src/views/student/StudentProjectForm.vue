<template>
  <div class="project-form-container">
    <h1>{{ isEdit ? '编辑项目' : '新建项目' }}</h1>
    
    <el-form 
      :model="form" 
      :rules="rules" 
      ref="projectForm" 
      label-width="120px"
    >
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入项目名称" />
      </el-form-item>
      
      <el-form-item label="项目类别" prop="category">
        <el-select v-model="form.category" placeholder="请选择项目类别">
          <el-option 
            v-for="item in categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="项目描述" prop="description">
        <el-input 
          v-model="form.description" 
          type="textarea" 
          :rows="4"
          placeholder="请输入项目描述"
        />
      </el-form-item>
      
      <el-form-item label="预期成果" prop="expectedOutcome">
        <el-input 
          v-model="form.expectedOutcome" 
          type="textarea" 
          :rows="2"
          placeholder="请输入预期成果"
        />
      </el-form-item>
      
      <el-form-item label="申请导师" prop="mentorId">
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
      
      <el-form-item>
        <el-button type="primary" @click="submitForm">
          {{ isEdit ? '更新项目' : '提交项目' }}
        </el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { studentApi } from '@/api/student'

const route = useRoute()
const router = useRouter()
const projectForm = ref(null)

const isEdit = computed(() => route.path.includes('edit'))

const form = ref({
  name: '',
  category: '',
  description: '',
  expectedOutcome: '',
  mentorId: ''
})

const rules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择项目类别', trigger: 'change' }],
  description: [{ required: true, message: '请输入项目描述', trigger: 'blur' }]
}

const categories = [
  { value: 'software', label: '软件开发' },
  { value: 'business', label: '商业计划' },
  { value: 'research', label: '科学研究' },
  { value: 'social', label: '社会实践' }
]

const mentors = [
  { id: 1, name: '张教授' },
  { id: 2, name: '李教授' },
  { id: 3, name: '王教授' }
]

const submitForm = async () => {
  try {
    await projectForm.value.validate()
    
    if (isEdit.value) {
      await studentApi.updateProject(route.params.id, form.value)
    } else {
      await studentApi.createProject(form.value)
    }
    
    ElMessage.success(isEdit.value ? '项目更新成功' : '项目创建成功')
    router.push('/student/projects')
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const resetForm = () => {
  projectForm.value.resetFields()
}

// 如果是编辑模式，加载项目数据
if (isEdit.value) {
  // 模拟加载项目数据
  form.value = {
    name: '智能校园管理系统',
    category: 'software',
    description: '开发一个智能化的校园管理系统',
    expectedOutcome: '完成系统开发并投入使用',
    mentorId: 1
  }
  
  // 实际项目中应该从API获取数据
  // const { data } = await studentApi.getProject(route.params.id)
  // form.value = data
}
</script>

<style scoped>
.project-form-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  text-align: center;
}
</style>
