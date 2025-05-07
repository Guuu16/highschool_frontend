<template>
  <div class="policy-create-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ props.id ? '编辑公告' : '发布公告' }}</span>
        </div>
      </template>

      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入公告标题" />
        </el-form-item>

        <el-form-item label="公告内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="5"
            placeholder="请输入公告内容"
          />
        </el-form-item>

        <el-form-item label="发布时间" prop="publishedAt">
          <el-date-picker
            v-model="form.publishedAt"
            type="datetime"
            placeholder="选择发布时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DDTHH:mm:ss"
            :default-value="new Date(new Date().getTime() + 8 * 60 * 60 * 1000)"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">
            {{ props.id ? '更新公告' : '发布公告' }}
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, getCurrentInstance, watch, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminApi } from '@/api/admin'

const formRef = ref()
const form = ref({
  title: '',
  content: '',
  publishedAt: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
  status: 'published'
})

// 如果是编辑模式，加载数据
const fetchPolicyDetail = async (id) => {
  try {
    const res = await adminApi.getPolicyDetail(id)
    if (res.data?.success) {
      form.value = {
        ...res.data.data,
        publishedAt: new Date(res.data.data.publishedAt)
      }
    }
  } catch (error) {
    ElMessage.error('获取公告详情失败: ' + (error.response?.data?.message || error.message))
  }
}

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})

watch(() => props.id, (newVal) => {
  if (newVal) {
    fetchPolicyDetail(newVal)
  }
}, { immediate: true })



const rules = {
  title: [
    { required: true, message: '请输入公告标题', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入公告内容', trigger: 'blur' },
    { min: 10, message: '至少输入 10 个字符', trigger: 'blur' }
  ],
  publishedAt: [
    { required: true, message: '请选择发布时间', trigger: 'change' }
  ]
}

const router = useRouter()

const submitForm = async () => {
  try {
    await formRef.value.validate()
    const payload = {
      ...form.value,
      publishedAt: typeof form.value.publishedAt === 'string' 
        ? form.value.publishedAt 
        : form.value.publishedAt.toISOString().slice(0, 19)
    }
    
    let res
    if (props.id) {
      // 编辑模式
      res = await adminApi.updatePolicy(props.id, payload)
      ElMessage.success('公告更新成功')
    } else {
      // 创建模式
      res = await adminApi.createPolicy(payload)
      ElMessage.success('公告发布成功')
    }
    
    if (res.data?.success) {
      router.push({ name: 'AdminPolicyList' })
    }
  } catch (error) {
    ElMessage.error('公告发布失败: ' + (error.response?.data?.message || error.message))
    console.error(error)
  }
}

// 添加emits定义
const emit = defineEmits(['policy-created'])

const saveFormState = () => {
  // 保存表单状态到本地存储
  localStorage.setItem('draftPolicy', JSON.stringify({
    title: form.value.title,
    content: form.value.content,
    publishedAt: form.value.publishedAt
  }))
}



// 初始化时恢复草稿
const restoreDraft = () => {
  const draft = localStorage.getItem('draftPolicy')
  if (draft) {
    try {
      const parsed = JSON.parse(draft)
      form.value.title = parsed.title || ''
      form.value.content = parsed.content || ''
      form.value.publishedAt = parsed.publishedAt ? new Date(parsed.publishedAt) : new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
    } catch (e) {
      console.error('恢复草稿失败:', e)
    }
  }
}

// 组件挂载时恢复草稿
onMounted(() => {
  restoreDraft()
})

const resetForm = () => {
  formRef.value.resetFields()
  form.value = {
    title: '',
    content: '',
    publishedAt: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
    status: 'published'
  }
}
</script>

<style scoped>
.policy-create-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
