import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import Layout from '@/views/Layout.vue'

// 学生模块
import StudentDashboard from '@/views/student/StudentDashboard.vue'
import StudentProjectList from '@/views/student/StudentProjectList.vue'
import StudentMentorApplication from '@/views/student/StudentMentorApplication.vue'
import StudentProgressSubmit from '@/views/student/StudentProgressSubmit.vue'
import StudentMessages from '@/views/student/StudentMessages.vue'

// 教师模块
import TeacherDashboard from '@/views/teacher/TeacherDashboard.vue'
import TeacherProjectReview from '@/views/teacher/TeacherProjectReview.vue'
import TeacherMentorReview from '@/views/teacher/TeacherMentorReview.vue'
import TeacherEvents from '@/views/teacher/TeacherEvents.vue'

// 管理员模块
import AdminUserList from '@/views/admin/AdminUserList.vue'
import AdminPolicyCreate from '@/views/admin/AdminPolicyCreate.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/',
    component: Layout,
    children: [
      // 仪表盘重定向
      {
        path: 'dashboard',
        name: 'Dashboard',
        redirect: (to) => {
          const role = localStorage.getItem('role')
          switch(role) {
            case 'admin':
              return { path: '/admin/dashboard' }
            case 'teacher':
              return { path: '/teacher/dashboard' }
            case 'student':
              return { path: '/student/dashboard' }
            default:
              return { path: '/' }
          }
        }
      },
      // 学生路由
      {
        path: 'student/dashboard',
        name: 'StudentDashboard',
        component: StudentDashboard,
        meta: { role: 'student' }
      },
      {
        path: 'student/projects',
        name: 'StudentProjects',
        component: StudentProjectList,
        meta: { role: 'student' }
      },
      {
        path: 'student/mentor-application',
        name: 'StudentMentorApplication',
        component: StudentMentorApplication,
        meta: { role: 'student' }
      },
      {
        path: 'student/progress',
        name: 'StudentProgress',
        component: StudentProgressSubmit,
        meta: { role: 'student' }
      },
      {
        path: 'student/messages',
        name: 'StudentMessages',
        component: StudentMessages,
        meta: { role: 'student' }
      },

      // 教师路由
      {
        path: 'teacher/dashboard',
        name: 'TeacherDashboard',
        component: TeacherDashboard,
        meta: { role: 'teacher' }
      },
      {
        path: 'teacher/project-review',
        name: 'TeacherProjectReview',
        component: TeacherProjectReview,
        meta: { role: 'teacher' }
      },
      {
        path: 'teacher/mentor-review',
        name: 'TeacherMentorReview',
        component: TeacherMentorReview,
        meta: { role: 'teacher' }
      },
      {
        path: 'teacher/events',
        name: 'TeacherEvents',
        component: TeacherEvents,
        meta: { role: 'teacher' }
      },

      // 管理员路由
      {
        path: 'admin/dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboard.vue'),
        meta: { role: 'admin' }
      },
      {
        path: 'admin/users',
        name: 'AdminUserList',
        component: AdminUserList,
        meta: { role: 'admin' }
      },
      {
        path: 'student/messages',
        name: 'StudentMessages',
        component: StudentMessages,
        meta: { role: 'student' }
      },
      {
        path: '/student/profile',
        name: 'StudentProfile',
        component: () => import('@/views/student/StudentProfile.vue'),
        meta: { 
          role: 'student',
          title: '学生个人信息'
        }
      },
      {
        path: '/admin/settings',
        name: 'AdminSettings',
        component: () => import('@/views/admin/AdminSettings.vue'),
        meta: { 
          role: 'admin',
          title: '系统设置'
        }
      },
      {
        path: '/teacher/profile',
        name: 'TeacherProfile',
        component: () => import('@/views/teacher/TeacherProfile.vue'),
        meta: { role: 'teacher' }
      },
      {
        path: '/admin/profile',
        name: 'AdminProfile',
        component: () => import('@/views/admin/AdminProfile.vue'),
        meta: { role: 'admin' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 权限控制
router.beforeEach((to, from, next) => {
  console.log('路由守卫触发: from', from.path, 'to', to.path)
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')

  // 不需要登录的页面
  if (to.path === '/login' || to.path === '/register') {
    console.log('允许访问登录/注册页')
    return next()
  }

  // 检查是否登录
  if (!token) {
    console.log('未登录，跳转到登录页')
    return next('/login')
  }

  // 检查角色权限
  if (to.meta.role) {
    console.log('路由要求的角色:', to.meta.role, '当前用户角色:', userRole)
    const requiredRole = to.meta.role?.toLowerCase()
    const currentRole = userRole?.toLowerCase()
    
    // 管理员可以访问所有页面
    if (currentRole === 'admin') {
      console.log('管理员权限，允许访问')
      return next()
    }
    
    // 其他角色只能访问自己权限的页面
    if (!requiredRole || !currentRole || requiredRole !== currentRole) {
      console.log('角色权限不符，跳转到首页')
      return next('/dashboard') // 无权限则跳转到首页
    }
  }

  console.log('允许访问:', to.path)
  next()
})

export default router
