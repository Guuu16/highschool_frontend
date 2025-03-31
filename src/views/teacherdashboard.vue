<template>
  <div class="dashboard-container">
    <h1>教师仪表盘</h1>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="我的课程" name="courses">
        <el-table :data="courses" style="width: 100%">
          <el-table-column prop="name" label="课程名称" />
          <el-table-column prop="class" label="班级" />
          <el-table-column prop="time" label="上课时间" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" @click="handleEditCourse(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeleteCourse(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="add-course-btn" type="primary" @click="showAddCourseDialog = true">添加课程</el-button>
      </el-tab-pane>
      
      <el-tab-pane label="学生成绩" name="grades">
        <el-table :data="students" style="width: 100%">
          <el-table-column prop="name" label="学生姓名" />
          <el-table-column prop="studentId" label="学号" />
          <el-table-column prop="grade" label="成绩">
            <template #default="scope">
              <el-input-number v-model="scope.row.grade" :min="0" :max="100" />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" type="primary" @click="handleSaveGrade(scope.row)">保存</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 添加课程对话框 -->
    <el-dialog v-model="showAddCourseDialog" title="添加课程">
      <el-form :model="newCourse">
        <el-form-item label="课程名称">
          <el-input v-model="newCourse.name" />
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="newCourse.class" />
        </el-form-item>
        <el-form-item label="上课时间">
          <el-input v-model="newCourse.time" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddCourseDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddCourse">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('courses')
const showAddCourseDialog = ref(false)

const courses = ref([
  { name: '数学', class: '高三(1)班', time: '周一 8:00-10:00' },
  { name: '语文', class: '高三(2)班', time: '周二 10:00-12:00' }
])

const students = ref([
  { name: '张三', studentId: '2023001', grade: 85 },
  { name: '李四', studentId: '2023002', grade: 78 },
  { name: '王五', studentId: '2023003', grade: 92 }
])

const newCourse = ref({
  name: '',
  class: '',
  time: ''
})

const handleEditCourse = (course) => {
  // 编辑课程逻辑
  console.log('编辑课程:', course)
}

const handleDeleteCourse = (course) => {
  // 删除课程逻辑
  console.log('删除课程:', course)
}

const handleAddCourse = () => {
  // 添加课程逻辑
  courses.value.push({ ...newCourse.value })
  showAddCourseDialog.value = false
  newCourse.value = { name: '', class: '', time: '' }
}

const handleSaveGrade = (student) => {
  // 保存成绩逻辑
  console.log('保存成绩:', student)
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.add-course-btn {
  margin-top: 20px;
}
</style>