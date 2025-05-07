<template>
  <div class="event-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>活动管理</h2>
          <el-button type="primary" @click="showCreateDialog">发布活动</el-button>
        </div>
      </template>

      <el-table :data="eventList" style="width: 100%">
        <el-table-column prop="title" label="活动标题" width="180" />
        <el-table-column prop="description" label="活动描述" />
        <el-table-column prop="eventTime" label="活动时间" width="180">
          <template #default="{row}">
            {{ formatTime(row.eventTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{row}">
            <el-button type="text" @click="showEditDialog(row)">编辑</el-button>
            <el-button type="text" @click="deleteEvent(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建/编辑活动对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑活动' : '发布活动'"
      width="50%"
    >
      <el-form :model="eventForm" label-width="100px">
        <el-form-item label="活动标题">
          <el-input v-model="eventForm.title" />
        </el-form-item>
        <el-form-item label="活动描述">
          <el-input v-model="eventForm.description" type="textarea" rows="4" />
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            v-model="eventForm.eventTime"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="活动链接">
          <el-input v-model="eventForm.resourceUrl" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEvent">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { teacherApi } from '@/api/teacher'
import { ElMessage } from 'element-plus'

const eventList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentEventId = ref(null)

const eventForm = ref({
  title: '',
  description: '',
  eventTime: '',
  resourceUrl: ''
})

const formatTime = (timeStr) => {
  return new Date(timeStr).toLocaleString('zh-CN')
}

const fetchEvents = async () => {
  try {
    const res = await teacherApi.getEvents()
    if (res.data?.success) {
      // 确保返回的数据是数组格式
      eventList.value = Array.isArray(res.data.data) ? res.data.data : []
    }
  } catch (error) {
    ElMessage.error('获取活动列表失败: ' + (error.response?.data?.message || error.message))
  }
}

const showCreateDialog = () => {
  isEdit.value = false
  eventForm.value = {
    title: '',
    description: '',
    eventTime: '',
    resourceUrl: ''
  }
  dialogVisible.value = true
}

const showEditDialog = (event) => {
  isEdit.value = true
  currentEventId.value = event.id
  eventForm.value = {
    title: event.title,
    description: event.description,
    eventTime: event.eventTime,
    resourceUrl: event.resourceUrl
  }
  dialogVisible.value = true
}

const deleteEvent = async (id) => {
  try {
    await teacherApi.deleteEvent(id)
    eventList.value = eventList.value.filter(e => e.id !== id)
    ElMessage.success('活动删除成功')
  } catch (error) {
    ElMessage.error('删除失败: ' + (error.response?.data?.message || error.message))
  }
}

const submitEvent = async () => {
  try {
    if (isEdit.value) {
      const res = await teacherApi.updateEvent(currentEventId.value, eventForm.value)
      if (res.data?.success) {
        const index = eventList.value.findIndex(e => e.id === currentEventId.value)
        if (index !== -1) {
          eventList.value.splice(index, 1, res.data.data)
        }
        ElMessage.success('活动更新成功')
      }
    } else {
      const res = await teacherApi.createEvent(eventForm.value)
      if (res.data?.success) {
        eventList.value.unshift({
          ...res.data.data,
          id: res.data.data.id || Date.now() // 确保有id字段
        })
        ElMessage.success('活动创建成功')
      }
    }
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('操作失败: ' + (error.response?.data?.message || error.message))
  }
}

onMounted(() => {
  fetchEvents()
})
</script>

<style scoped>
.event-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
