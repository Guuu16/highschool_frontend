<template>
  <div class="messages-container">
    <h1>消息中心</h1>
    
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="message-list">
          <div class="list-header">
            <el-input
              v-model="searchText"
              placeholder="搜索消息"
              clearable
              prefix-icon="Search"
            />
          </div>
          
          <el-scrollbar height="500px">
            <el-menu
              :default-active="activeMessage"
              @select="handleSelect"
            >
              <el-menu-item 
                v-for="message in filteredMessages"
                :key="message.id"
                :index="message.id"
              >
                <div class="message-item">
                  <div class="message-title">
                    {{ message.title }}
                    <el-tag 
                      v-if="!message.read" 
                      size="small" 
                      type="danger"
                    >
                      未读
                    </el-tag>
                  </div>
                  <div class="message-time">
                    {{ formatTime(message.createdAt) }}
                  </div>
                </div>
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
        </el-card>
      </el-col>
      
      <el-col :span="16">
        <el-card class="message-detail">
          <template v-if="currentMessage">
            <div class="detail-header">
              <h2>{{ currentMessage.title }}</h2>
              <div class="meta">
                <span>发件人: {{ currentMessage.sender }}</span>
                <span>时间: {{ formatTime(currentMessage.createdAt) }}</span>
              </div>
            </div>
            
            <div class="detail-content">
              {{ currentMessage.content }}
            </div>
            
            <div class="detail-footer">
              <el-button 
                type="primary" 
                @click="handleReply"
                v-if="currentMessage.sender !== '系统'"
              >
                回复
              </el-button>
              <el-button @click="handleDelete">
                删除
              </el-button>
            </div>
          </template>
          
          <el-empty v-else description="请选择一条消息" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { studentApi } from '@/api/student'

const searchText = ref('')
const activeMessage = ref('')
const currentMessage = ref(null)

// 模拟消息数据
const messages = ref([
  {
    id: 1,
    title: '项目审核通过通知',
    content: '您的项目"智能校园管理系统"已通过审核',
    sender: '系统',
    createdAt: '2025-03-28T10:30:00',
    read: true
  },
  {
    id: 2,
    title: '导师申请回复',
    content: '张教授已接受您的导师申请',
    sender: '张教授',
    createdAt: '2025-03-29T14:15:00',
    read: false
  },
  {
    id: 3,
    title: '项目进度提醒',
    content: '请尽快提交项目进度报告',
    sender: '李教授',
    createdAt: '2025-03-30T09:00:00',
    read: false
  }
])

const filteredMessages = computed(() => {
  return messages.value.filter(msg => 
    msg.title.includes(searchText.value) || 
    msg.content.includes(searchText.value)
  )
})

const formatTime = (timeStr) => {
  return new Date(timeStr).toLocaleString()
}

const handleSelect = (id) => {
  currentMessage.value = messages.value.find(msg => msg.id === id)
  activeMessage.value = id
  
  // 标记为已读
  if (!currentMessage.value.read) {
    currentMessage.value.read = true
    // 实际项目中应该调用API更新消息状态
    // await studentApi.markMessageAsRead(id)
  }
}

const handleReply = () => {
  // 跳转到回复页面
  console.log('回复消息:', currentMessage.value.id)
}

const handleDelete = async () => {
  try {
    // 实际项目中应该调用API删除消息
    // await studentApi.deleteMessage(currentMessage.value.id)
    messages.value = messages.value.filter(msg => msg.id !== currentMessage.value.id)
    currentMessage.value = null
    ElMessage.success('消息删除成功')
  } catch (error) {
    console.error('删除失败:', error)
  }
}
</script>

<style scoped>
.messages-container {
  padding: 20px;
}

.message-list {
  height: 100%;
}

.list-header {
  margin-bottom: 15px;
}

.message-item {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.message-title {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.message-time {
  color: #999;
  font-size: 12px;
  margin-top: 5px;
}

.message-detail {
  height: 100%;
}

.detail-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.detail-header h2 {
  margin-bottom: 10px;
}

.meta {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
}

.detail-content {
  line-height: 1.6;
  min-height: 300px;
}

.detail-footer {
  margin-top: 20px;
  text-align: right;
}
</style>
