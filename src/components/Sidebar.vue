<template>
  <div class="sidebar-container">
    <div class="collapse-btn" @click="toggleCollapse">
      <el-icon :size="20">
        <component :is="isCollapse ? 'ArrowRight' : 'ArrowLeft'" />
      </el-icon>
    </div>
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
  </div>
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
  Setting,
  ArrowRight,
  ArrowLeft
} from '@element-plus/icons-vue'

const route = useRoute()
const userStore = useUserStore()

const isCollapse = ref(false)

// 添加折叠按钮控制
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
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
        title: '活动发布',
        path: '/teacher/events',
        icon: 'Calendar'
      },
      {
        title: '个人信息',
        path: '/teacher/profile',
        icon: 'User'
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
      },
      {
        title: '个人信息',
        path: '/admin/profile',
        icon: 'User'
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
  background-color: #1a3a8f;
}

.sidebar-menu .el-menu-item,
.sidebar-menu .el-sub-menu__title {
  color: #ffffff;
}

.sidebar-menu .el-menu-item:hover,
.sidebar-menu .el-sub-menu__title:hover {
  background-color: #2a4a9f;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #2a4a9f;
  color: #ffffff;
}

.sidebar-container {
  position: relative;
  height: 100%;
  transition: all 0.3s;
}

.collapse-btn {
  position: absolute;
  right: -20px;
  top: 20px;
  width: 20px;
  height: 40px;
  background: #1a3a8f;
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  color: white;
  transition: all 0.3s;
  border: 1px solid #0d2a6b;
}

.collapse-btn:hover {
  background: #0d2a6b;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 220px;
  transition: width 0.3s;
}
</style>
