<template>
  <div class="policy-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>公告通知</h2>
        </div>
      </template>

      <el-table :data="policyList" style="width: 100%">
        <el-table-column prop="title" label="标题" width="180" />
        <el-table-column prop="content" label="内容">
          <template #default="{row}">
            <div class="content-preview">
              {{ row.content.length > 50 ? row.content.substring(0, 50) + '...' : row.content }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{row}">
            <el-button type="text" @click="showDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="publishedAt" label="发布时间" width="180">
          <template #default="{row}">
            {{ formatTime(row.publishedAt) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="currentPolicy?.title"
      width="50%"
    >
      <div class="policy-detail">
        <p>{{ currentPolicy?.content }}</p>
        <div class="policy-time">
          发布时间: {{ currentPolicy ? formatTime(currentPolicy.publishedAt) : '' }}
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { commonApi } from '@/api/common'
import { ElMessage, ElDialog } from 'element-plus'

const policyList = ref([])
const currentPolicy = ref(null)
const dialogVisible = ref(false)

const showDetail = (policy) => {
  currentPolicy.value = policy
  dialogVisible.value = true
}

const formatTime = (timeStr) => {
  return new Date(timeStr).toLocaleString('zh-CN')
}

const fetchPolicies = async () => {
  try {
    const res = await commonApi.getLatestPolicies()
      if (res.data?.success) {
        const now = new Date()
        policyList.value = res.data.data.filter(policy => 
          new Date(policy.publishedAt) <= now
        )
      }
  } catch (error) {
    ElMessage.error('获取公告失败: ' + (error.response?.data?.message || error.message))
  }
}

onMounted(() => {
  fetchPolicies()
})
</script>

<style scoped>
.content-preview {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.policy-detail {
  line-height: 1.6;
  padding: 10px;
}

.policy-time {
  margin-top: 20px;
  color: #666;
  text-align: right;
  font-size: 14px;
}
.policy-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
