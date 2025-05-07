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
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { commonApi } from '@/api/common'
import { ElMessage } from 'element-plus'
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
const router = useRouter()
const isCollapse = ref(false)

// 获取最新公告
const fetchLatestPolicies = async () => {
  try {
    const res = await commonApi.getLatestPolicies()
    if (res.data?.success && res.data.data?.length > 0) {
      // 这里可以添加弹窗显示最新公告的逻辑
      console.log('最新公告:', res.data.data)
    }
  } catch (error) {
    ElMessage.error('获取最新公告失败: ' + (error.response?.data?.message || error.message))
  }
}

onMounted(() => {
  fetchLatestPolicies()
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const activeMenu = computed(() => route.path)

const handleMenuItemClick = (item) => {
  if (item.path === '/dashboard') {
    const role = userStore.role.toLowerCase()
    router.push(`/${role}/dashboard`)
  } else {
    router.push(item.path)
  }
}

// 根据用户角色返回不同的菜单项
const menuItems = computed(() => {
  const role = userStore.role?.toLowerCase()
  const commonMenus = [
    {
      title: '首页',
      path: '/dashboard',
      icon: 'House',
      exact: true,
      index: '/dashboard'
    }
  ]
  
  if (role === 'student') {
    return [
      ...commonMenus,
      {
        title: '项目管理',
        path: '/student/projects',
        icon: 'Document'
      },
      {
        title: '公告通知',
        path: '/student/policies',
        icon: 'Document'
      },
      {
        title: '活动通知', 
        path: '/student/events',
        icon: 'Calendar'
      },
      {
        title: '个人信息',
        path: '/student/profile',
        icon: 'User'
      }
    ]
  } else if (role === 'teacher') {
    return [
      ...commonMenus,
      {
        title: '项目审核', 
        path: '/teacher/project-review',
        icon: 'DocumentChecked'
      },
      {
        title: '公告通知',
        path: '/teacher/policies',
        icon: 'Document'
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
  } else if (role === 'admin') {
    return [
      ...commonMenus,
      {
        title: '用户管理',
        path: '/admin/users',
        icon: 'User'
      },
      {
        title: '公告管理',
        path: '/admin/policies',
        icon: 'Document',
        meta: { role: 'admin' }
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
