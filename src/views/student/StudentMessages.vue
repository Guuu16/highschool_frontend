<template>
  <div class="wechat-container">
    <div class="left-panel">
      <div class="search-bar">
        <el-input placeholder="搜索" v-model="searchText">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="contact-list">
        <div 
          v-for="contact in filteredContacts" 
          :key="contact.id"
          class="contact-item"
          :class="{active: activeContact?.id === contact.id}"
          @click="() => {
            selectContact(contact)
            markAsRead(contact.id)
          }"
        >
          <el-avatar :size="40">👨🏫</el-avatar>
          <div class="contact-info">
            <div class="name">{{ contact.name }}</div>
            <div class="last-msg">{{ contact.lastMsg }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="right-panel">
      <div class="chat-header">
        <el-avatar :size="40">👨🏫</el-avatar>
        <div class="contact-name">{{ activeContact?.name }}</div>
      </div>
      
      <div class="chat-messages" ref="messagesRef">
        <div 
          v-for="msg in messages" 
          :key="msg.id"
          class="message-item"
          :class="{self: msg.senderId == currentUserId}"
        >
          <div class="message-content">{{ msg.content }}</div>
          <div class="message-time">{{ formatTime(msg.sentAt) }}</div>
        </div>
      </div>
      
      <div class="chat-input">
        <el-input
          v-model="newMessage"
          type="textarea"
          :rows="3"
          placeholder="输入消息..."
          @keyup.enter="sendMessage"
        />
        <el-button type="primary" @click="sendMessage">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { studentApi } from '@/api/student'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const currentUserId = localStorage.getItem('userId')
const searchText = ref('')
const newMessage = ref('')
const activeContact = ref(null)
const messagesRef = ref(null)

// 获取联系人数据
const contacts = ref([])

const fetchTeachers = async () => {
  try {
    const res = await studentApi.getTeachers()
    if (res.data?.success) {
      contacts.value = res.data.data.map(teacher => ({
        id: teacher.id,
        name: teacher.realName || teacher.username,
        avatar: '',
        lastMsg: '',
        unread: 0
      }))
      
      // 自动选中第一个老师
      if (contacts.value.length > 0) {
        selectContact(contacts.value[0])
      }
    }
  } catch (error) {
    ElMessage.error('获取老师列表失败: ' + (error.response?.data?.message || error.message))
  }
}

onMounted(fetchTeachers)

// 消息列表
const messages = ref([])

const filteredContacts = computed(() => {
  return contacts.value.filter(c => 
    c.name.includes(searchText.value) || 
    c.lastMsg.includes(searchText.value))
})

const formatTime = (timeStr) => {
  return new Date(timeStr).toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})
}

const selectContact = (contact) => {
  console.log('1. 开始selectContact，联系人ID:', contact.id)
  activeContact.value = contact
  console.log('2. 准备调用fetchMessages')
  fetchMessages(contact.id)
  console.log('3. fetchMessages调用完成')
}

const markAsRead = async (contactId) => {
  try {
    console.log('开始标记联系人ID的消息为已读:', contactId)
    
    // 获取当前联系人的所有未读消息ID
    const unreadMessageIds = messages.value
      .filter(msg => msg.senderId === contactId && !msg.isRead)
      .map(msg => msg.id)
    
    console.log('未读消息IDs:', unreadMessageIds)
    console.log('所有消息:', JSON.stringify(messages.value, null, 2))
    
    if (unreadMessageIds.length > 0) {
      // 批量标记为已读
      const results = await Promise.all(
        unreadMessageIds.map(id => {
          console.log('正在标记消息ID为已读:', id)
          return studentApi.markMessageAsRead(id)
        })
      )
      console.log('标记已读API调用结果:', results)
      
      // 更新本地消息状态和未读计数
      messages.value = messages.value.map(msg => {
        if (msg.senderId === contactId && !msg.isRead) {
          return {...msg, isRead: true}
        }
        return msg
      })
      
      contacts.value = contacts.value.map(c => {
        if (c.id === contactId) {
          return {...c, unread: 0}
        }
        return c
      })
      
      console.log('本地状态更新完成')
    }
  } catch (error) {
    console.error('标记已读失败:', error)
  }
}

const fetchMessages = async (contactId) => {
  try {
    console.log('1. 开始fetchMessages，联系人ID:', contactId)
    const messagesRes = await studentApi.getMessages(contactId)
    console.log('2. API响应:', messagesRes)
    messages.value = messagesRes.data?.data || []
    console.log('3. 设置messages:', messages.value)


    
    // 获取未读消息数并标记为已读
    const unreadCountRes = await studentApi.getUnreadMessageCount()
    console.log('4. 未读消息数响应:', unreadCountRes)
    if (unreadCountRes.data?.success) {
      const unreadCount = unreadCountRes.data.data?.count || 0
      console.log('5. 未读消息数:', unreadCount)
      if (unreadCount > 0) {
        for (const msg of messages.value) {
          await studentApi.markMessageAsRead(msg.id)
          console.log('6. 开始标记未读消息为已读')
    }
       
       
      }
    }
    scrollToBottom()
  } catch (error) {
    console.error('获取消息失败:', error)
    ElMessage.error('获取消息失败: ' + (error.response?.data?.message || error.message))
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  
  try {
    const res = await studentApi.sendMessage({
      receiverId: activeContact.value.id,
      content: newMessage.value
    })
    
    if (res.data?.success) {
      // 立即显示发送的消息
      messages.value.push({
        id: Date.now(), // 临时ID
        senderId: currentUserId,
        receiverId: activeContact.value.id,
        content: newMessage.value,
        sentAt: new Date().toISOString(),
        isRead: true
      })
      newMessage.value = ''
      scrollToBottom()
    }
  } catch (error) {
    ElMessage.error('发送失败: ' + (error.response?.data?.message || error.message))
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

// 初始化选中第一个联系人
const timer = ref(null)
onMounted(() => {
  if (contacts.value.length > 0) {
    selectContact(contacts.value[0])
  }
  
  // 定时获取未读消息数
  timer.value = setInterval(fetchUnreadCount, 30000)
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

// 获取未读消息数
const fetchUnreadCount = async () => {
  try {
    const res = await studentApi.getUnreadMessageCount()
    if (res.data?.success) {
      // 更新联系人未读消息数
      contacts.value.forEach(contact => {
        contact.unread = res.data.data.count[contact.id] || 0
      })
    }
  } catch (error) {
    console.error('获取未读消息数失败', error)
  }
}
</script>

<style scoped>
/* 复用教师端相同的样式 */
.wechat-container {
  display: flex;
  height: calc(100vh - 60px);
  background: #f5f5f5;
}

.left-panel {
  width: 300px;
  background: #fff;
  border-right: 1px solid #e6e6e6;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.search-bar {
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
}

.contact-list {
  overflow-y: auto;
  height: calc(100% - 52px);
}

.contact-item {
  display: flex;
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.contact-item:hover {
  background: #f5f5f5;
}

.contact-item.active {
  background: #e6e6e6;
}

.contact-info {
  margin-left: 10px;
}

.name {
  font-weight: bold;
}

.last-msg {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.chat-header {
  padding: 12px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
}

.contact-name {
  margin-left: 10px;
  font-weight: bold;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #e5e5e5;
}

.message-item {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.message-item.self {
  align-items: flex-end;
}

.message-content {
  background: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  max-width: 60%;
  word-break: break-word;
}

.message-item.self .message-content {
  background: #95ec69;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.chat-input {
  padding: 10px;
  background: #fff;
  border-top: 1px solid #e6e6e6;
}
</style>
