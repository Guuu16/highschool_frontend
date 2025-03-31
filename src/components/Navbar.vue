<template>
  <el-header class="navbar">
    <div class="left-menu">
      <el-icon @click="toggleSidebar">
        <Fold v-if="!isCollapse" />
        <Expand v-else />
      </el-icon>
    </div>
    
    <div class="right-menu">
      <el-dropdown>
        <div class="user-info">
          <el-avatar :size="30" :src="userStore.avatar" />
          <span class="username">{{ userStore.name }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleProfile">个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Fold, Expand } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const isCollapse = ref(false)

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
  // 触发自定义事件通知Sidebar组件
  const event = new CustomEvent('toggle-sidebar', { 
    detail: { collapsed: isCollapse.value }
  })
  window.dispatchEvent(event)
}

const handleProfile = () => {
  console.log('执行handleProfile')
  const role = userStore.role.toLowerCase()
  console.log('跳转路径:', `/${role}/profile`)
  router.push(`/${role}/profile`)
    .then(() => {
      console.log('路由跳转成功')
      console.log('当前路由:', router.currentRoute.value)
    })
    .catch(err => {
      console.error('路由跳转失败:', err)
    })
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  height: 60px;
}

.left-menu {
  display: flex;
  align-items: center;
}

.right-menu {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 10px;
  font-size: 14px;
}
</style>
