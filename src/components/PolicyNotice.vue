<template>
  <div class="policy-notice">
    <h3 class="notice-title">最新公告</h3>
    <div class="notice-content">
      <p v-if="loading">加载中...</p>
      <template v-else>
        <div v-if="policy" class="notice-item">
          <h4>{{ policy.title }}</h4>
          <p>{{ policy.content }}</p>
          <span class="notice-time">{{ formatDate(policy.publishedAt) }}</span>
        </div>
        <p v-else>暂无公告</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { commonApi } from '@/api/common'

const policy = ref(null)
const loading = ref(true)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(async () => {
  try {
    const res = await commonApi.getLatestPolicies()
    if (res.data.data?.length > 0) {
      policy.value = res.data.data[0]
    }
  } catch (error) {
    console.error('获取公告失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.policy-notice {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.notice-title {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 18px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.notice-item h4 {
  margin: 0 0 8px 0;
  color: #409eff;
  font-size: 16px;
}

.notice-item p {
  margin: 0 0 8px 0;
  color: #666;
  line-height: 1.6;
}

.notice-time {
  color: #999;
  font-size: 12px;
}
</style>
