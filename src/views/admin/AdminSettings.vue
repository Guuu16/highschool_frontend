<template>
  <div class="admin-settings">
    <h1>系统设置</h1>
    
    <el-tabs v-model="activeTab">
      <!-- 创新创业政策管理 -->
      <el-tab-pane label="政策管理" name="policy">
        <div class="toolbar">
          <el-button type="primary" @click="showPolicyDialog = true">
            发布新政策
          </el-button>
        </div>
        
        <el-table :data="policies" style="width: 100%">
          <el-table-column prop="title" label="政策标题" width="200" />
          <el-table-column prop="category" label="政策类别" width="150" />
          <el-table-column prop="publishDate" label="发布时间" width="180" />
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button size="small" @click="editPolicy(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deletePolicy(row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      
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
    
    <!-- 政策编辑对话框 -->
    <el-dialog v-model="showPolicyDialog" :title="currentPolicy.id ? '编辑政策' : '发布新政策'">
      <el-form :model="currentPolicy" label-width="100px">
        <el-form-item label="政策标题" required>
          <el-input v-model="currentPolicy.title" />
        </el-form-item>
        <el-form-item label="政策类别">
          <el-select v-model="currentPolicy.category" placeholder="请选择">
            <el-option 
              v-for="item in policyCategories"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="政策内容">
          <el-input v-model="currentPolicy.content" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showPolicyDialog = false">取消</el-button>
        <el-button type="primary" @click="savePolicy">保存</el-button>
      </template>
    </el-dialog>
    
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

const activeTab = ref('policy')

// 政策管理相关
const policies = ref([
  {
    id: 1,
    title: '2025年创新创业扶持政策',
    category: '资金扶持',
    content: '详细政策内容...',
    publishDate: '2025-01-15'
  },
  {
    id: 2,
    title: '优秀项目孵化计划',
    category: '项目孵化',
    content: '详细政策内容...',
    publishDate: '2025-02-20'
  }
])

const policyCategories = ref(['资金扶持', '项目孵化', '导师指导', '场地支持'])
const showPolicyDialog = ref(false)
const currentPolicy = ref({
  id: null,
  title: '',
  category: '',
  content: '',
  publishDate: ''
})

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

const editPolicy = (policy) => {
  currentPolicy.value = { ...policy }
  showPolicyDialog.value = true
}

const deletePolicy = (id) => {
  // 实际项目中这里调用API删除
  policies.value = policies.value.filter(p => p.id !== id)
  ElMessage.success('删除成功')
}

const savePolicy = () => {
  if (!currentPolicy.value.title) {
    ElMessage.error('请填写政策标题')
    return
  }
  
  if (currentPolicy.value.id) {
    // 更新现有政策
    const index = policies.value.findIndex(p => p.id === currentPolicy.value.id)
    policies.value[index] = { ...currentPolicy.value }
    ElMessage.success('政策更新成功')
  } else {
    // 添加新政策
    currentPolicy.value.id = policies.value.length + 1
    currentPolicy.value.publishDate = new Date().toISOString().split('T')[0]
    policies.value.push({ ...currentPolicy.value })
    ElMessage.success('政策发布成功')
  }
  
  showPolicyDialog.value = false
  resetPolicyForm()
}

const resetPolicyForm = () => {
  currentPolicy.value = {
    id: null,
    title: '',
    category: '',
    content: '',
    publishDate: ''
  }
}

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
