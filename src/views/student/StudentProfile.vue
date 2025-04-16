<template>
  <div class="profile-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>个人信息管理</h2>
        </div>
      </template>

      <el-tabs type="border-card">
        <el-tab-pane label="基础信息">
          <el-form :model="baseInfo" label-width="100px">
            <el-form-item label="姓名">
              <el-input v-model="baseInfo.realName" />
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="baseInfo.phone" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="baseInfo.email" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveBaseInfo">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="详细信息">
          <el-form :model="detailInfo" label-width="100px">
            <el-form-item label="学号">
              <el-input v-model="detailInfo.studentId" disabled />
            </el-form-item>
            <el-form-item label="学院">
              <el-input v-model="detailInfo.college" />
            </el-form-item>
            <el-form-item label="专业">
              <el-input v-model="detailInfo.major" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveDetailInfo">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <el-divider />

      <h3>修改密码</h3>
      <el-form 
        :model="passwordForm" 
        :rules="passwordRules" 
        ref="passwordFormRef"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
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
import { userApi } from '@/api/user'

const passwordFormRef = ref()
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

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

const userStore = useUserStore()

const baseInfo = ref({
  realName: '',
  phone: '',
  email: ''
})

const detailInfo = ref({
  studentId: '',
  college: '',
  major: ''
})

// 加载用户信息
onMounted(async () => {
  try {
    const response = await userApi.getCurrentUser()
    const userInfo = response.data.data
    if (userInfo) {
      baseInfo.value = {
        realName: userInfo.realName || '',
        phone: userInfo.phone || '',
        email: userInfo.email || ''
      }
      detailInfo.value = {
        studentId: userStore.userId || '',
        college: userInfo.college || '',
        major: userInfo.major || ''
      }
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  }
})

const saveBaseInfo = async () => {
  try {
    await userApi.updateUserInfo({
      realName: baseInfo.value.realName,
      email: baseInfo.value.email,
      phone: baseInfo.value.phone
    })
    ElMessage.success('基础信息保存成功')
  } catch (error) {
    console.error('保存基础信息失败:', error)
    ElMessage.error(error.response?.data?.message || '保存失败')
  }
}

const saveDetailInfo = async () => {
  try {
    // TODO: 等待详细信息接口
    ElMessage.success('详细信息保存成功')
  } catch (error) {
    console.error('保存详细信息失败:', error)
    ElMessage.error(error.response?.data?.message || '保存失败')
  }
}

const handleChangePassword = async () => {
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
.profile-container {
  padding: 20px;
}
.card-header {
  text-align: center;
}
</style>
