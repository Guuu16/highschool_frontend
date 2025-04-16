<template>
  <div class="project-form-container" v-if="!loading">
    <h1>{{ isEdit ? '编辑项目' : '新建项目' }}</h1>
    <el-alert 
      v-if="loading"
      title="加载中..."
      type="info"
      center
      show-icon
    />
    
    <el-form 
      :model="form" 
      :rules="rules" 
      ref="projectForm" 
      label-width="120px"
      class="project-form"
    >
      <el-form-item label="项目标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入项目标题" />
      </el-form-item>
      
      <el-form-item label="项目类别" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="请选择项目类别">
          <el-option
            v-for="item in categories"
            :key="item.id || ''"
            :label="item.name || ''"
            :value="item.id || ''"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="项目描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入项目详细描述"
        />
      </el-form-item>
      
      <el-form-item label="学分" prop="credit">
        <el-input-number 
          v-model="form.credit" 
          :min="1" 
          :max="10"
          placeholder="请输入学分"
        />
      </el-form-item>
      
      <el-form-item label="计划文件" prop="planFileUrl">
        <el-upload
          action="/api/upload"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
        >
          <el-button type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      
      <el-form-item label="选择导师" prop="teacherId">
        <el-select
          v-model="form.teacherId"
          placeholder="请选择导师"
          filterable
        >
          <el-option
            v-for="teacher in teachers"
            :key="teacher.id || ''"
            :label="teacher.realName || ''"
            :value="teacher.id || ''"
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

<script>
import { defineComponent, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { studentApi } from '@/api/student'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const projectForm = ref(null)
    const userStore = useUserStore()

    const isEdit = computed(() => route.path.includes('edit'))

    const form = ref({
      title: '',
      categoryId: '',
      description: '',
      credit: 1,
      planFileUrl: '',
      teacherId: ''
    })

    const rules = {
      title: [{ required: true, message: '请输入项目标题', trigger: 'blur' }],
      categoryId: [{ required: true, message: '请选择项目类别', trigger: 'change' }],
      description: [{ required: true, message: '请输入项目描述', trigger: 'blur' }],
      credit: [{ required: true, message: '请设置学分', trigger: 'blur' }],
      teacherId: [{ required: true, message: '请选择导师', trigger: 'change' }]
    }

    const categories = ref([])
    const teachers = ref([])
    const loading = ref(true)

    // 文件上传成功处理
    const handleUploadSuccess = (response) => {
      form.value.planFileUrl = response.data.url
    }

    // 上传前验证
    const beforeUpload = (file) => {
      const isPDF = file.type === 'application/pdf'
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isPDF) {
        ElMessage.error('只能上传PDF文件')
      }
      if (!isLt10M) {
        ElMessage.error('文件大小不能超过10MB')
      }

      return isPDF && isLt10M
    }

    const submitForm = async () => {
      try {
        await projectForm.value.validate()
        
        console.log('表单验证通过，准备提交数据:', form.value)
        
        if (isEdit.value) {
          console.log('进入编辑模式，准备更新项目')
          const res = await studentApi.updateProject(route.params.id, form.value)
          console.log('更新项目API响应:', res)
          ElMessage.success('项目更新成功')
        } else {
          console.log('进入新建模式，准备创建项目')
          const res = await studentApi.createProject({
            title: form.value.title,
            description: form.value.description,
            categoryId: Number(form.value.categoryId),
            credit: Number(form.value.credit),
            planFileUrl: form.value.planFileUrl,
            teacherId: Number(form.value.teacherId)
          })
          console.log('创建项目API响应:', res)
          ElMessage.success('项目创建成功')
        }
        
        router.push('/student/projects')
      } catch (error) {
        console.error('提交失败:', error)
        console.log('错误详情:', error.response?.data || error.message)
        ElMessage.error(`操作失败: ${error.response?.data?.message || error.message || '未知错误'}`)
      }
    }

    const resetForm = () => {
      projectForm.value.resetFields()
    }

    // 获取类别和导师列表
    const initData = async () => {
      try {
        const [catRes, teacherRes] = await Promise.all([
          studentApi.getCategories(),
          studentApi.getTeachers()
        ])
        
        console.log('项目类别API响应:', catRes)
        console.log('导师API响应:', teacherRes)
        
        const categoryData = catRes.data?.data || catRes.data || []
        const teacherData = teacherRes.data?.data || teacherRes.data || []
        
        categories.value = Array.isArray(categoryData) ? 
          categoryData.map(item => ({
            id: item.id?.toString() || '',
            name: item.name || item.title || ''
          })) : []
          
        teachers.value = Array.isArray(teacherData) ?
          teacherData.map(item => ({
            id: item.id?.toString() || '',
            realName: item.realName || item.name || item.username || ''
          })) : []
        
        console.log('处理后的项目类别:', categories.value)
        console.log('处理后的导师列表:', teachers.value)
      } catch (error) {
        console.error('初始化数据失败:', error)
        ElMessage.error(error.response?.status === 403 ? 
          '权限不足，请联系管理员' : '获取数据失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    // 编辑模式加载项目数据
    const loadProjectData = async () => {
      if (isEdit.value) {
        try {
          const { data } = await studentApi.getProject(route.params.id)
          if (!data.success || !data.data) {
            throw new Error(data.message || '获取项目数据失败')
          }
          
          form.value = {
            title: data.data.title || '',
            categoryId: data.data.categoryId?.toString() || '',
            description: data.data.description || '',
            credit: data.data.credit || 1,
            planFileUrl: data.data.planFileUrl || '',
            teacherId: data.data.teacherId?.toString() || ''
          }
        } catch (error) {
          console.error('加载项目数据失败:', error)
          ElMessage.error(`加载项目数据失败: ${error.message}`)
        }
      }
    }

    // 立即执行初始化
    initData()
    loadProjectData()

    return {
      isEdit,
      form,
      rules,
      categories,
      teachers,
      loading,
      projectForm,
      handleUploadSuccess,
      beforeUpload,
      submitForm,
      resetForm
    }
  }
})
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
