<template>
  <div class="policy-detail-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>公告详情</span>
          <el-button 
            type="primary"
            @click="handleEdit"
          >
            编辑公告
          </el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="公告标题">
          {{ policy.title }}
        </el-descriptions-item>
        <el-descriptions-item label="发布状态">
          <el-tag :type="statusType">
            {{ statusText }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建人">
          {{ policy.creator }}
        </el-descriptions-item>
        <el-descriptions-item label="发布时间">
          {{ formatDate(policy.publishedAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ formatDate(policy.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ formatDate(policy.updateTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="公告内容" :span="2">
          <div class="content" v-html="policy.content"></div>
        </el-descriptions-item>
        <el-descriptions-item label="附件" :span="2" v-if="policy.attachments?.length">
          <div class="attachments">
            <el-link 
              v-for="(file, index) in policy.attachments"
              :key="index"
              type="primary"
              :href="`${baseUrl}${file.url}`"
              target="_blank"
              class="file-link"
            >
              {{ file.name }}
            </el-link>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminApi } from '@/api/admin'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const policyId = route.params.id
const baseUrl = import.meta.env.VITE_API_BASE_URL

const policy = ref({
  id: '',
  title: '',
  content: '',
  status: 'draft',
  creator: '',
  publishedAt: '',
  createTime: '',
  updateTime: '',
  attachments: []
})

const statusMap = {
  draft: { text: '草稿', type: 'info' },
  published: { text: '已发布', type: 'success' },
  archived: { text: '已归档', type: 'warning' }
}

const statusText = computed(() => {
  return statusMap[policy.value.status]?.text || '未知状态'
})

const statusType = computed(() => {
  return statusMap[policy.value.status]?.type || ''
})

const formatDate = (dateStr) => {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss')
}

const fetchPolicyDetail = async () => {
  try {
    const res = await adminApi.getPolicyDetail(policyId)
    if (res.data?.success) {
      policy.value = res.data.data
    } else {
      ElMessage.error(res.data?.message || '获取公告详情失败')
    }
  } catch (error) {
    ElMessage.error('获取公告详情失败: ' + (error.response?.data?.message || error.message))
  }
}

const handleEdit = () => {
  router.push({
    name: 'AdminPolicyEdit',
    params: { id: policyId }
  })
}

onMounted(() => {
  fetchPolicyDetail()
})
</script>

<style scoped>
.policy-detail-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  white-space: pre-line;
  line-height: 1.6;
}

.attachments {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-link {
  margin-right: 10px;
}
</style>
