<template>
  <div class="admin-profile">
    <h1>管理员个人信息</h1>
    <el-form label-width="100px">
      <el-form-item label="姓名">
        <el-input v-model="adminInfo.realName" />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="adminInfo.phone" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="adminInfo.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveProfile">保存</el-button>
      </el-form-item>
    </el-form>

    <el-divider />
    <h2>修改密码</h2>
    <el-form label-width="100px" :model="passwordForm" :rules="passwordRules" ref="passwordFormRef">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="passwordForm.oldPassword" type="password" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="passwordForm.newPassword" type="password" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changePassword">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { userApi } from '@/api/user'

const userStore = useUserStore()

const adminInfo = ref({
  realName: '',
  phone: '',
  email: ''
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordFormRef = ref()

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.value.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 加载用户信息
onMounted(async () => {
  try {
    const response = await userApi.getCurrentUser()
    const userInfo = response.data.data
    if (userInfo) {
      adminInfo.value = {
        realName: userInfo.realName || '',
        phone: userInfo.phone || '',
        email: userInfo.email || ''
      }
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  }
})

const saveProfile = async () => {
  try {
    await userApi.updateUserInfo({
      realName: adminInfo.value.realName,
      email: adminInfo.value.email,
      phone: adminInfo.value.phone
    })
    ElMessage.success('个人信息保存成功')
  } catch (error) {
    console.error('保存用户信息失败:', error)
    ElMessage.error(error.response?.data?.message || '保存失败')
  }
}

const changePassword = async () => {
  try {
    await passwordFormRef.value.validate()
    await userApi.changePassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword,
      confirmPassword: passwordForm.value.confirmPassword
    })
    ElMessage.success('密码修改成功')
    passwordForm.value = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '密码修改失败')
  }
}
</script>

<style scoped>
.admin-profile {
  padding: 20px;
}
</style>
