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
      
      <el-form-item label="计划文件" prop="planFile">
        <el-upload
          v-model:file-list="fileList"
          :auto-upload="false"
          :limit="1"
          :on-change="handleFileChange"
        >
          <el-button type="primary">选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip">只能上传PDF文件，且不超过10MB</div>
          </template>
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
import axios from 'axios'
import { API_BASE } from '@/config/api'
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
    const fileList = ref([])
    
    const handleFileChange = (file) => {
      const isPDF = file.raw.type === 'application/pdf'
      const isLt10M = file.raw.size / 1024 / 1024 < 20

      if (!isPDF) {
        ElMessage.error('只能上传PDF文件')
        fileList.value = []
        return false
      }
      if (!isLt10M) {
        ElMessage.error('文件大小不能超过20MB')
        fileList.value = []
        return false
      }
      return true
    }

    const submitForm = async () => {
      try {
        await projectForm.value.validate()
        
        console.log('表单验证通过，准备提交数据:', form.value)
        
        if (isEdit.value) {
          console.log('进入编辑模式，准备更新项目')
          const formData = new FormData()
          formData.append('title', form.value.title)
          formData.append('description', form.value.description)
          formData.append('categoryId', Number(form.value.categoryId))
          formData.append('credit', Number(form.value.credit))
          formData.append('teacherId', Number(form.value.teacherId))
          // 已拒绝项目编辑后自动变为待审核，其他情况保持原状态
          formData.append('status', originalStatus.value === 'rejected' ? 0 : (form.value.status || 0))
          
          // 确保总是传递planFile字段，即使没有新文件
          if (fileList.value.length > 0 && fileList.value[0].raw) {
            formData.append('planFile', fileList.value[0].raw)
          } else {
            formData.append('planFile', new Blob(), 'empty.pdf')
          }
          
          const token = localStorage.getItem('token')
          // 调试日志 - 打印FormData内容
          for (let [key, value] of formData.entries()) {
            console.log('FormData:', key, value)
          }
          const res = await axios.put(`${API_BASE}/api/projects/${route.params.id}`, formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          })
          console.log('更新项目API响应:', res)
          console.log('响应数据:', res.data)
          ElMessage.success('项目更新成功')
        } else {
          console.log('进入新建模式，准备创建项目')
          const formData = new FormData()
          formData.append('title', form.value.title)
          formData.append('description', form.value.description)
          formData.append('categoryId', Number(form.value.categoryId))
          formData.append('credit', Number(form.value.credit))
          formData.append('teacherId', Number(form.value.teacherId))
          
          if (fileList.value.length > 0) {
            formData.append('planFile', fileList.value[0].raw)
          }
          
          const token = localStorage.getItem('token')
          const res = await axios.post(`${import.meta.env.VITE_API_BASE || ''}/api/api/projects`, formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
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
    const originalStatus = ref('')
    const loadProjectData = async () => {
      if (isEdit.value) {
        try {
          const { data } = await studentApi.getProjectDetail(route.params.id)
          originalStatus.value = data.data.status === 2 ? 'rejected' : 
                               data.data.status === 1 ? 'approved' : 'pending'
          if (!data.success || !data.data) {
            throw new Error(data.message || '获取项目数据失败')
          }
          
          form.value = {
            title: data.data.title || '',
            categoryId: data.data.categoryId?.toString() || '',
            description: data.data.description || '',
            credit: data.data.credit || 1,
            planFileUrl: data.data.planFileUrl || '',
            teacherId: data.data.teacherId?.toString() || '',
            status: data.data.status || 0
          }
          
          // 初始化文件列表
          if (data.data.planFileUrl) {
            const fileName = data.data.planFileUrl.split('/').pop()
            fileList.value = [{
              name: fileName,
              url: `${import.meta.env.VITE_API_BASE || 'http://localhost:5173'}/api${data.data.planFileUrl}`
            }]
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
      fileList,
      handleFileChange,
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
