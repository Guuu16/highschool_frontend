<template>
  <div class="admin-profile">
    <h1>管理员个人信息</h1>
    <el-form label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="adminInfo.username" disabled />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="adminInfo.name" />
      </el-form-item>
      <el-form-item label="管理员ID">
        <el-input v-model="adminInfo.adminId" disabled />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="adminInfo.phone" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveProfile">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const adminInfo = ref({
  username: userStore.username || '',
  name: userStore.name || '',
  adminId: userStore.userId || '',
  phone: ''
})

const saveProfile = () => {
  // 保存逻辑
}
</script>

<style scoped>
.admin-profile {
  padding: 20px;
}
</style>
