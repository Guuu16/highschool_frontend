<template>
  <div class="policy-container">
    <div class="header">
      <h1>政策公告管理</h1>
      <el-button 
        type="primary" 
        @click="showCreateDialog = true"
      >
        发布新公告
      </el-button>
    </div>

    <el-table :data="policies" style="width: 100%">
      <el-table-column prop="title" label="公告标题" width="200" />
      <el-table-column prop="category" label="分类" width="120">
        <template #default="{ row }">
          <el-tag>{{ row.category }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="发布人" width="120" />
      <el-table-column prop="publishTime" label="发布时间" width="180" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'info'">
            {{ row.status === 'published' ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button 
            size="small" 
            @click="handleEdit(row.id)"
          >
            编辑
          </el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="handleDelete(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 发布公告对话框 -->
    <el-dialog 
      v-model="showCreateDialog" 
      :title="isEdit ? '编辑公告' : '发布新公告'" 
      width="60%"
    >
      <el-form 
        :model="policyForm" 
        :rules="rules" 
        ref="policyFormRef" 
        label-width="100px"
      >
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="policyForm.title" placeholder="请输入公告标题" />
        </el-form-item>
        
        <el-form-item label="公告分类" prop="category">
          <el-select v-model="policyForm.category" placeholder="请选择分类">
            <el-option
              v-for="item in categories"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="公告内容" prop="content">
          <el-input 
            v-model="policyForm.content" 
            type="textarea" 
            :rows="8"
            placeholder="请输入公告内容"
          />
        </el-form-item>
        
        <el-form-item label="附件" prop="attachments">
          <el-upload
            action="#"
            multiple
            :file-list="policyForm.attachments"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持上传文档、图片等附件
              </div>
            </template>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="发布状态" prop="status">
          <el-radio-group v-model="policyForm.status">
            <el-radio label="published">立即发布</el-radio>
            <el-radio label="draft">保存草稿</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button type="primary" @click="submitForm">
            {{ isEdit ? '更新公告' : '发布公告' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/admin'

const showCreateDialog = ref(false)
const isEdit = ref(false)
const policyFormRef = ref(null)
const currentPolicyId = ref(null)

const categories = ref([
  '创新创业政策',
  '项目申报指南',
  '导师管理办法',
  '其他通知'
])

const policyForm = ref({
  title: '',
  category: '',
  content: '',
  attachments: [],
  status: 'published'
})

const rules = {
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择公告分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
  status: [{ required: true, message: '请选择发布状态', trigger: 'change' }]
}

// 模拟政策公告数据
const policies = ref([
  {
    id: 1,
    title: '2025年度创新创业项目申报通知',
    category: '项目申报指南',
    content: '关于开展2025年度大学生创新创业训练计划项目申报工作的通知...',
    author: '管理员',
    publishTime: '2025-03-01',
    status: 'published'
  },
  {
    id: 2,
    title: '创新创业学分认定办法',
    category: '创新创业政策',
    content: '关于大学生创新创业学分认定与管理办法...',
    author: '管理员',
    publishTime: '2025-02-15',
    status: 'published'
  }
])

onMounted(() => {
  fetchPolicies()
})

const fetchPolicies = async () => {
  try {
    const res = await adminApi.getPolicyList()
    policies.value = res.data
  } catch (error) {
    console.error('获取政策公告列表失败:', error)
  }
}

const handleFileChange = (file, fileList) => {
  policyForm.value.attachments = fileList
}

const handleFileRemove = (file, fileList) => {
  policyForm.value.attachments = fileList
}

const handleEdit = (id) => {
  const policy = policies.value.find(p => p.id === id)
  if (policy) {
    currentPolicyId.value = id
    isEdit.value = true
    policyForm.value = {
      title: policy.title,
      category: policy.category,
      content: policy.content,
      attachments: policy.attachments || [],
      status: policy.status
    }
    showCreateDialog.value = true
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该公告吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await adminApi.deletePolicy(id)
    policies.value = policies.value.filter(p => p.id !== id)
    ElMessage.success('公告删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

const submitForm = async () => {
  try {
    await policyFormRef.value.validate()
    
    if (isEdit.value) {
      await adminApi.updatePolicy(currentPolicyId.value, policyForm.value)
      const index = policies.value.findIndex(p => p.id === currentPolicyId.value)
      if (index !== -1) {
        policies.value[index] = {
          ...policies.value[index],
          ...policyForm.value,
          author: '管理员',
          publishTime: new Date().toLocaleDateString()
        }
      }
      ElMessage.success('公告更新成功')
    } else {
      const newPolicy = await adminApi.createPolicy(policyForm.value)
      policies.value.unshift({
        ...newPolicy,
        author: '管理员',
        publishTime: new Date().toLocaleDateString()
      })
      ElMessage.success('公告发布成功')
    }
    
    showCreateDialog.value = false
    resetForm()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const resetForm = () => {
  policyFormRef.value?.resetFields()
  policyForm.value = {
    title: '',
    category: '',
    content: '',
    attachments: [],
    status: 'published'
  }
  isEdit.value = false
  currentPolicyId.value = null
}
</script>

<style scoped>
.policy-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
