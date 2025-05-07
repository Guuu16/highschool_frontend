<template>
  <div class="admin-settings">
    <h1>系统设置</h1>
    
    <el-tabs v-model="activeTab">
      <!-- 项目类别设置 -->
      <el-tab-pane label="项目类别" name="category">
        <div class="toolbar">
          <el-button type="primary" @click="showCategoryDialog = true">
            添加类别
          </el-button>
        </div>
        
        <el-table :data="categories" style="width: 100%">
          <el-table-column prop="name" label="类别名称" width="200" />
          <el-table-column prop="description" label="类别描述" />
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button size="small" @click="editCategory(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteCategory(row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 类别编辑对话框 -->
    <el-dialog v-model="showCategoryDialog" :title="currentCategory.id ? '编辑类别' : '添加类别'">
      <el-form :model="currentCategory" label-width="100px">
        <el-form-item label="类别名称" required>
          <el-input v-model="currentCategory.name" />
        </el-form-item>
        <el-form-item label="类别描述">
          <el-input v-model="currentCategory.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showCategoryDialog = false">取消</el-button>
        <el-button type="primary" @click="saveCategory">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '@/api/admin'

const activeTab = ref('category')

// 项目类别相关
const categories = ref([])

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

onMounted(() => {
  loadCategories()
})

const showCategoryDialog = ref(false)
const currentCategory = ref({
  id: null,
  name: '',
  description: ''
})

const editCategory = (category) => {
  currentCategory.value = { ...category }
  showCategoryDialog.value = true
}

const deleteCategory = async (id) => {
  try {
    await adminApi.deleteCategory(id)
    categories.value = categories.value.filter(c => c.id !== id)
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '删除失败')
  }
}

const saveCategory = async () => {
  try {
    if (!currentCategory.value.name) {
      ElMessage.error('请填写类别名称')
      return
    }
    
    if (currentCategory.value.id) {
      // TODO: 需要添加更新类别API
      const index = categories.value.findIndex(c => c.id === currentCategory.value.id)
      categories.value[index] = { ...currentCategory.value }
      ElMessage.success('类别更新成功')
    } else {
      const res = await adminApi.addCategory({
        name: currentCategory.value.name,
        description: currentCategory.value.description
      })
      categories.value.push(res.data.data)
      ElMessage.success('类别添加成功')
    }
    
    showCategoryDialog.value = false
    resetCategoryForm()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '操作失败')
  }
}

const resetCategoryForm = () => {
  currentCategory.value = {
    id: null,
    name: '',
    description: ''
  }
}
</script>

<style scoped>
.admin-settings {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
}
</style>
