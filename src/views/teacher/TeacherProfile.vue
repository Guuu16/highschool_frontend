<template>
  <div class="teacher-profile">
    <h1>教师个人信息</h1>
    <el-form label-width="100px">
      <el-form-item label="姓名">
        <el-input v-model="teacherInfo.name" />
      </el-form-item>
      <el-form-item label="工号">
        <el-input v-model="teacherInfo.employeeId" disabled />
      </el-form-item>
      <el-form-item label="所属学院">
        <el-input v-model="teacherInfo.department" />
      </el-form-item>
      <el-form-item label="职称">
        <el-input v-model="teacherInfo.title" />
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

const teacherInfo = ref({
  name: userStore.name || '',
  employeeId: userStore.userId || '',
  department: '',
  title: ''
})

const saveProfile = () => {
  // 保存逻辑
}
</script>

<style scoped>
.teacher-profile {
  padding: 20px;
}
</style>
