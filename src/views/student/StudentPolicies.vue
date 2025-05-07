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

      <el-pagination
        v-model:current-page="pagination.pageNum"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
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
import { studentApi } from '@/api/student'
import { ElMessage } from 'element-plus'

const policyList = ref([])
const currentPolicy = ref(null)
const dialogVisible = ref(false)
const pagination = ref({
  pageSize: 10,
  pageNum: 1,
  total: 0
})

const showDetail = (policy) => {
  currentPolicy.value = policy
  dialogVisible.value = true
}

const formatTime = (timeStr) => {
  return new Date(timeStr).toLocaleString('zh-CN')
}

const fetchPolicies = async () => {
  try {
    const res = await studentApi.getPolicies({
      pageSize: pagination.value.pageSize,
      pageNum: pagination.value.pageNum
    })
    if (res.data?.success) {
      // 处理分页返回格式
      const data = res.data.data
      if (data.records) {
        // 新分页格式
        policyList.value = data.records
        pagination.value.total = data.total
        pagination.value.pageSize = data.size
        pagination.value.pageNum = data.current
      } else if (Array.isArray(data)) {
        // 旧数组格式
        policyList.value = data
        pagination.value.total = data.length
      } else {
        // 其他格式
        policyList.value = data.list || []
        pagination.value.total = data.total || 0
      }
    }
  } catch (error) {
    ElMessage.error('获取公告失败: ' + (error.response?.data?.message || error.message))
  }
}

const handlePageChange = (page) => {
  pagination.value.pageNum = page
  fetchPolicies()
}

onMounted(() => {
  fetchPolicies()
})
</script>

<style scoped>
.policy-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content-preview {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
