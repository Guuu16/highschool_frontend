<template>
  <div class="policy-edit-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>编辑公告</span>
        </div>
      </template>

      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>

        <el-form-item label="公告内容" prop="content">
          <el-input 
            v-model="form.content" 
            type="textarea"
            :rows="5"
          />
        </el-form-item>

        <el-form-item label="发布时间" prop="publishedAt">
          <el-date-picker
            v-model="form.publishedAt"
            type="datetime"
            placeholder="选择发布时间"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminApi } from '@/api/admin'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const policyId = route.params.id

const form = ref({
  title: '',
  content: '',
  publishedAt: ''
})

const rules = {
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
  publishedAt: [{ required: true, message: '请选择发布时间', trigger: 'change' }]
}

const fetchPolicyDetail = async () => {
  try {
    const res = await adminApi.getPolicyDetail(policyId)
    if (res.data?.success) {
      form.value = {
        title: res.data.data.title,
        content: res.data.data.content,
        publishedAt: res.data.data.publishedAt
      }
    }
  } catch (error) {
    ElMessage.error('获取公告详情失败: ' + (error.response?.data?.message || error.message))
  }
}

const submitForm = async () => {
  try {
    const res = await adminApi.updatePolicy(policyId, form.value)
    if (res.data?.success) {
      ElMessage.success('更新成功')
      router.push({ name: 'AdminPolicyList' })
    }
  } catch (error) {
    ElMessage.error('更新失败: ' + (error.response?.data?.message || error.message))
  }
}

const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  fetchPolicyDetail()
})
</script>

<style scoped>
.policy-edit-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
