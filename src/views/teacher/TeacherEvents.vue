<template>
  <div class="events-container">
    <div class="header">
      <h1>活动管理</h1>
      <el-button 
        type="primary" 
        @click="showCreateDialog = true"
      >
        发布新活动
      </el-button>
    </div>

    <el-table :data="events" style="width: 100%">
      <el-table-column prop="title" label="活动标题" width="180" />
      <el-table-column prop="type" label="活动类型" width="120">
        <template #default="{ row }">
          <el-tag :type="row.type === 'lecture' ? '' : 'success'">
            {{ row.type === 'lecture' ? '讲座' : '培训' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="活动时间" width="180" />
      <el-table-column prop="location" label="活动地点" width="150" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button 
            size="small" 
            @click="handleEdit(row.id)"
          >
            编辑
          </el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="handleDelete(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 发布活动对话框 -->
    <el-dialog 
      v-model="showCreateDialog" 
      :title="isEdit ? '编辑活动' : '发布新活动'" 
      width="50%"
    >
      <el-form 
        :model="eventForm" 
        :rules="rules" 
        ref="eventFormRef" 
        label-width="100px"
      >
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="eventForm.title" placeholder="请输入活动标题" />
        </el-form-item>
        
        <el-form-item label="活动类型" prop="type">
          <el-radio-group v-model="eventForm.type">
            <el-radio label="lecture">讲座</el-radio>
            <el-radio label="training">培训</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="活动时间" prop="time">
          <el-date-picker
            v-model="eventForm.time"
            type="datetime"
            placeholder="选择活动时间"
            value-format="YYYY-MM-DD HH:mm"
          />
        </el-form-item>
        
        <el-form-item label="活动地点" prop="location">
          <el-input v-model="eventForm.location" placeholder="请输入活动地点" />
        </el-form-item>
        
        <el-form-item label="活动描述" prop="description">
          <el-input 
            v-model="eventForm.description" 
            type="textarea" 
            :rows="4"
            placeholder="请输入活动详细描述"
          />
        </el-form-item>
        
        <el-form-item label="参与人数" prop="maxParticipants">
          <el-input-number 
            v-model="eventForm.maxParticipants" 
            :min="1" 
            :max="500"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button type="primary" @click="submitForm">
            {{ isEdit ? '更新活动' : '发布活动' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { teacherApi } from '@/api/teacher'

const showCreateDialog = ref(false)
const isEdit = ref(false)
const eventFormRef = ref(null)
const currentEventId = ref(null)

const eventForm = ref({
  title: '',
  type: 'lecture',
  time: '',
  location: '',
  description: '',
  maxParticipants: 50
})

const rules = {
  title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  time: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
  location: [{ required: true, message: '请输入活动地点', trigger: 'blur' }]
}

// 模拟活动数据
const events = ref([
  {
    id: 1,
    title: '创新创业讲座',
    type: 'lecture',
    time: '2025-04-05 14:00',
    location: '教学楼A101',
    status: 'published',
    maxParticipants: 100
  },
  {
    id: 2,
    title: '商业计划书撰写培训',
    type: 'training',
    time: '2025-04-10 09:00',
    location: '创业中心201',
    status: 'published',
    maxParticipants: 30
  }
])

const getStatusType = (status) => {
  const map = {
    draft: 'info',
    published: 'success',
    canceled: 'danger'
  }
  return map[status] || ''
}

const getStatusText = (status) => {
  const map = {
    draft: '草稿',
    published: '已发布',
    canceled: '已取消'
  }
  return map[status] || status
}

const handleEdit = (id) => {
  const event = events.value.find(e => e.id === id)
  if (event) {
    currentEventId.value = id
    isEdit.value = true
    eventForm.value = {
      title: event.title,
      type: event.type,
      time: event.time,
      location: event.location,
      description: event.description || '',
      maxParticipants: event.maxParticipants
    }
    showCreateDialog.value = true
  }
}

const handleDelete = async (id) => {
  try {
    await teacherApi.deleteEvent(id)
    events.value = events.value.filter(e => e.id !== id)
    ElMessage.success('活动删除成功')
  } catch (error) {
    console.error('删除失败:', error)
  }
}

const submitForm = async () => {
  try {
    await eventFormRef.value.validate()
    
    if (isEdit.value) {
      await teacherApi.updateEvent(currentEventId.value, eventForm.value)
      const index = events.value.findIndex(e => e.id === currentEventId.value)
      if (index !== -1) {
        events.value[index] = {
          ...events.value[index],
          ...eventForm.value
        }
      }
      ElMessage.success('活动更新成功')
    } else {
      const newEvent = await teacherApi.createEvent(eventForm.value)
      events.value.unshift({
        ...newEvent,
        status: 'published'
      })
      ElMessage.success('活动发布成功')
    }
    
    showCreateDialog.value = false
    resetForm()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const resetForm = () => {
  eventFormRef.value?.resetFields()
  eventForm.value = {
    title: '',
    type: 'lecture',
    time: '',
    location: '',
    description: '',
    maxParticipants: 50
  }
  isEdit.value = false
  currentEventId.value = null
}
</script>

<style scoped>
.events-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
