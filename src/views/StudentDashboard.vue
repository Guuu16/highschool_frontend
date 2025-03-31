<template>
  <div class="dashboard-container">
    <h1>学生仪表盘</h1>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>我的课程</span>
            </div>
          </template>
          <el-table :data="courses" style="width: 100%">
            <el-table-column prop="name" label="课程名称" />
            <el-table-column prop="teacher" label="授课教师" />
            <el-table-column prop="time" label="上课时间" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>作业列表</span>
            </div>
          </template>
          <el-table :data="homeworks" style="width: 100%">
            <el-table-column prop="course" label="课程" />
            <el-table-column prop="title" label="作业标题" />
            <el-table-column prop="deadline" label="截止日期" />
            <el-table-column label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.status === '已完成' ? 'success' : 'warning'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const courses = ref([
  { name: '数学', teacher: '张老师', time: '周一 8:00-10:00' },
  { name: '语文', teacher: '李老师', time: '周二 10:00-12:00' },
  { name: '英语', teacher: '王老师', time: '周三 14:00-16:00' }
])

const homeworks = ref([
  { course: '数学', title: '习题集第5章', deadline: '2023-11-15', status: '已完成' },
  { course: '语文', title: '作文:我的家乡', deadline: '2023-11-20', status: '进行中' },
  { course: '英语', title: '单词背诵', deadline: '2023-11-18', status: '未开始' }
])
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.box-card {
  margin-bottom: 20px;
}

.card-header {
  font-weight: bold;
}
</style>