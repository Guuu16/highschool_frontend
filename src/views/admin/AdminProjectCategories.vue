<template>
  <div class="categories-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>项目类别管理</h2>
        </div>
      </template>

      <el-button 
        type="primary" 
        @click="showAddDialog = true"
        class="add-btn"
      >
        添加类别
      </el-button>

      <el-table :data="categories" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="类别名称" />
        <el-table-column prop="description" label="描述" />
      </el-table>

      <el-dialog v-model="showAddDialog" title="添加新类别">
        <el-form :model="newCategory" :rules="rules" ref="formRef">
          <el-form-item label="类别名称" prop="name">
            <el-input v-model="newCategory.name" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="newCategory.description" type="textarea" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="handleAddCategory">确定</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '@/api/admin'

const categories = ref([])
const showAddDialog = ref(false)
const newCategory = ref({
  name: '',
  description: ''
})
const formRef = ref()

const rules = {
  name: [{ required: true, message: '请输入类别名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入类别描述', trigger: 'blur' }]
}

// 加载类别列表
const loadCategories = async () => {
  try {
    const res = await adminApi.getCategories()
    categories.value = res.data.data
  } catch (error) {
    ElMessage.error('获取类别列表失败')
    console.error(error)
  }
}

// 添加新类别
const handleAddCategory = async () => {
  try {
    await formRef.value.validate()
    const res = await adminApi.addCategory(newCategory.value)
    ElMessage.success('添加成功')
    showAddDialog.value = false
    newCategory.value = { name: '', description: '' }
    await loadCategories()
  } catch (error) {
    if (error.response) {
      ElMessage.error(error.response.data.message || '添加失败')
    }
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.categories-container {
  padding: 20px;
}
.add-btn {
  margin-bottom: 20px;
}
</style>
