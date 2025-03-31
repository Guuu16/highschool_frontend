<template>
  <div class="profile-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>个人信息管理</h2>
        </div>
      </template>

      <el-form :model="form" label-width="100px">
        <el-form-item label="学号">
          <el-input v-model="form.studentId" disabled />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="学院">
          <el-input v-model="form.college" />
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="form.major" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存修改</el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <h3>修改密码</h3>
      <el-form :model="passwordForm" label-width="100px">
        <el-form-item label="原密码">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleChangePassword">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const form = ref({
  studentId: userStore.userId || '',
  name: userStore.name || '',
  college: '',
  major: '',
  phone: '',
  email: ''
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 加载用户信息
onMounted(async () => {
  try {
    const userInfo = await userStore.getUserInfo()
    if (userInfo) {
      form.value = {
        ...form.value,
        name: userInfo.name || '',
        college: userInfo.college || '',
        major: userInfo.major || '',
        phone: userInfo.phone || '',
        email: userInfo.email || ''
      }
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
})

const handleSave = () => {
  ElMessage.success('个人信息保存成功')
  // TODO: 调用API保存信息
}

const handleChangePassword = () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  ElMessage.success('密码修改成功')
  // TODO: 调用API修改密码
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
}
.card-header {
  text-align: center;
}
</style>
