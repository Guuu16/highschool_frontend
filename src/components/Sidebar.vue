<template>
  <el-menu
    :default-active="activeMenu"
    class="sidebar-menu"
    :collapse="isCollapse"
    :router="false"
  >
    <template v-for="item in menuItems" :key="item.path">
      <el-menu-item 
        v-if="!item.children" 
        :index="item.index || item.path"
        @click="handleMenuItemClick(item)"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.title }}</span>
      </el-menu-item>
      
      <el-sub-menu v-else :index="item.path">
        <template #title>
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item 
          v-for="child in item.children" 
          :key="child.path" 
          :index="child.path"
        >
          {{ child.title }}
        </el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  House,
  Document,
  User,
  Message,
  DocumentChecked,
  Calendar,
  Setting
} from '@element-plus/icons-vue'

const route = useRoute()
const userStore = useUserStore()

const isCollapse = ref(false)
const activeMenu = computed(() => route.path)

const router = useRouter()

const handleMenuItemClick = (item) => {
  console.log('菜单项点击:', item.title, '路径:', item.path)
  if (item.path === '/dashboard') {
    const role = userStore.role.toLowerCase()
    console.log('首页点击 - 当前角色:', role)
    const targetPath = `/${role}/dashboard`
    console.log('路由跳转目标:', targetPath)
    router.push(targetPath)
  } else {
    router.push(item.path)
  }
}

// 根据用户角色返回不同的菜单项
const menuItems = computed(() => {
  const role = userStore.role
  console.log('当前用户角色:', role)
  const commonMenus = [
      {
        title: '首页',
        path: '/dashboard',
        icon: 'House',
        exact: true,
        index: '/dashboard'
      }
  ]
  
  const normalizedRole = role?.toLowerCase()
  
  if (normalizedRole === 'student') {
    return [
      ...commonMenus,
      {
        title: '项目管理',
        path: '/student/projects',
        icon: 'Document'
      },
      {
        title: '导师申请',
        path: '/student/mentor-application',
        icon: 'User'
      },
      {
        title: '消息中心',
        path: '/student/messages',
        icon: 'Message'
      },
      {
        title: '个人信息',
        path: '/student/profile',
        icon: 'User'
      },
      {
        title: '项目进度',
        path: '/student/progress',
        icon: 'Document'
      }
    ]
  } else if (normalizedRole === 'teacher') {
    return [
      ...commonMenus,
      {
        title: '项目审核', 
        path: '/teacher/project-review',
        icon: 'DocumentChecked'
      },
      {
        title: '导师申请审核',
        path: '/teacher/mentor-review',
        icon: 'User'
      },
      {
        title: '活动发布',
        path: '/teacher/events',
        icon: 'Calendar'
      }
    ]
  } else if (normalizedRole === 'admin') {
    return [
      ...commonMenus,
      {
        title: '用户管理',
        path: '/admin/users',
        icon: 'User'
      },
      {
        title: '系统设置',
        path: '/admin/settings',
        icon: 'Setting'
      }
    ]
  }
  return commonMenus
})
</script>

<style scoped>
.sidebar-menu {
  height: 100%;
  border-right: none;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 220px;
}
</style>
