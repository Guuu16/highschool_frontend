<template>
  <div class="event-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>活动通知</h2>
        </div>
      </template>

      <el-table :data="eventList" style="width: 100%" v-loading="loading">
        <el-table-column prop="title" label="活动标题" width="180" />
        <el-table-column prop="description" label="活动描述" />
        <el-table-column prop="eventTime" label="活动时间" width="180">
          <template #default="{row}">
            {{ formatTime(row.eventTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="teacherName" label="发布人" width="120" />
        <el-table-column label="操作" width="180">
          <template #default="{row}">
            <el-button 
              type="primary" 
              size="small"
              @click="showEventDetail(row)"
            >
              详情
            </el-button>
            <el-button 
              v-if="row.resourceUrl"
              type="success" 
              size="small"
              @click="openResource(row.resourceUrl)"
            >
              活动链接
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { studentApi } from '@/api/student'
import { ElMessage, ElMessageBox } from 'element-plus'

const eventList = ref([])
const loading = ref(false)
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

const teachers = ref([])

// 获取所有教师信息
const fetchTeachers = async () => {
  try {
    const res = await studentApi.getTeachers()
    console.log('Teachers API response:', res.data)
    if (res.data?.success) {
      teachers.value = res.data.data || []
      console.log('Loaded teachers:', teachers.value)
    }
  } catch (error) {
    console.error('获取教师列表失败:', error)
  }
}

const getTeacherName = (teacherId) => {
  console.log('Looking for teacher:', teacherId, 'in:', teachers.value)
  const teacher = teachers.value.find(t => t.id == teacherId) // 使用==比较，避免类型不一致
  return teacher?.realName || teacher?.name || `未知(${teacherId})`
}

const formatTime = (timeStr) => {
  return new Date(timeStr).toLocaleString('zh-CN')
}

const showEventDetail = (event) => {
  ElMessageBox.alert(
    `<div>
      <h3>${event.title}</h3>
      <p><strong>发布时间：</strong>${formatTime(event.createTime)}</p>
      <p><strong>活动时间：</strong>${formatTime(event.eventTime)}</p>
      <p><strong>发布人：</strong>${event.teacherName}</p>
      <p><strong>活动描述：</strong></p>
      <p>${event.description}</p>
    </div>`,
    '活动详情',
    {
      dangerouslyUseHTMLString: true,
      customClass: 'event-detail-dialog',
      confirmButtonText: '关闭',
      width: '600px'
    }
  )
}

const openResource = (url) => {
  if (!url) return
  
  if (url.startsWith('http')) {
    window.open(url, '_blank')
  } else {
    window.open(`/api${url}`, '_blank')
  }
}

const fetchEvents = async () => {
  loading.value = true
  try {
    const res = await studentApi.getEvents({
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize
    })
    if (res.data?.success) {
      // 处理返回数据格式
      const records = res.data.data?.records || res.data.data?.list || []
      const total = res.data.data?.total || 0
      
      // 获取教师姓名
      const eventsWithTeacher = records.map(event => {
        const teacherName = getTeacherName(event.createdBy)
        console.log('Event:', event.id, 'Teacher:', teacherName)
        return {
          ...event,
          teacherName
        }
      })
      
      eventList.value = eventsWithTeacher
      pagination.value.total = total
    }
  } catch (error) {
    ElMessage.error('获取活动列表失败: ' + (error.response?.data?.message || error.message))
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (val) => {
  pagination.value.pageSize = val
  fetchEvents()
}

const handleCurrentChange = (val) => {
  pagination.value.pageNum = val
  fetchEvents()
}

onMounted(async () => {
  await fetchTeachers()
  await fetchEvents()
})
</script>

<style scoped>
.event-container {
  padding: 20px;
}

.card-header {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
