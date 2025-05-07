<template>
  <div class="policy-list-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>公告管理</span>
          <el-button 
            type="primary" 
            @click="goToCreate"
            icon="el-icon-plus"
          >
            创建公告
          </el-button>
        </div>
      </template>

      <el-table
        :data="policyList"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="title"
          label="标题"
          width="180"
        >
          <template #default="{row}">
            <el-link type="primary" @click="handleView(row.id)">
              {{ row.title }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="内容"
          :show-overflow-tooltip="true"
        >
          <template #default="{row}">
            <span>{{ row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="publishedAt"
          label="发布时间"
          width="180"
          :formatter="formatTime"
        />
        <el-table-column
          prop="publishedAt"
          label="状态"
          width="100"
        >
          <template #default="{row}">
            <el-tag :type="new Date(row.publishedAt) > new Date() ? 'warning' : 'success'">
              {{ new Date(row.publishedAt) > new Date() ? '待发布' : '已发布' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
        >
          <template #default="{row}">
            <el-button
              size="mini"
              @click="handleEdit(row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="query.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi } from '@/api/admin'

const router = useRouter()
const loading = ref(false)
const policyList = ref([])
const total = ref(0)

const query = ref({
  page: 1,
  size: 10,
  title: '',
  status: ''
})

const fetchPolicyList = async () => {
  try {
    loading.value = true
    const res = await adminApi.getPolicyList(query.value)
    if (res.data?.success) {
      policyList.value = res.data.data.records || res.data.data.list
      total.value = res.data.data.total
    }
  } catch (error) {
    ElMessage.error('获取公告列表失败: ' + (error.response?.data?.message || error.message))
  } finally {
    loading.value = false
  }
}

const formatTime = (row, column, cellValue) => {
  return new Date(cellValue).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-')
}

const handleView = (id) => {
  router.push({ 
    name: 'AdminPolicyDetail',
    params: { id }
  })
}

const handleEdit = (id) => {
  router.push({ 
    name: 'AdminPolicyEdit',
    params: { id }
  })
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除该公告吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await adminApi.deletePolicy(id)
    if (res.data?.success) {
      ElMessage.success('删除成功')
      fetchPolicyList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败: ' + (error.response?.data?.message || error.message))
    }
  }
}

const handleSizeChange = (val) => {
  query.value.size = val
  fetchPolicyList()
}

const handleCurrentChange = (val) => {
  query.value.page = val
  fetchPolicyList()
}

const goToCreate = () => {
  router.push({ name: 'AdminPolicyCreate' })
}

onMounted(() => {
  fetchPolicyList()
})
</script>

<style scoped>
.policy-list-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
