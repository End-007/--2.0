<template>
  <div class="document-list">
    <!-- 查询表单 -->
    <el-form :model="queryForm" inline>
      <el-form-item label="文件名称">
        <el-input v-model="queryForm.docName" placeholder="请输入文件名称" clearable />
      </el-form-item>
      <el-form-item label="制度类型">
        <el-select v-model="queryForm.docType" placeholder="请选择制度类型" clearable>
          <el-option label="党字" value="党字" />
          <el-option label="院字" value="院字" />
          <el-option label="学字" value="学字" />
        </el-select>
      </el-form-item>
      <el-form-item label="废改立情况">
        <el-select v-model="queryForm.status" placeholder="请选择废改立情况" clearable>
          <el-option label="有效" value="有效" />
          <el-option label="废止" value="废止" />
          <el-option label="修订" value="修订" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="docNumber" label="文号" />
      <el-table-column prop="docName" label="文件名称" show-overflow-tooltip />
      <el-table-column prop="docType" label="制度类型">
        <template #default="{ row }">
          <el-tag :type="getDocType(row.docType)">{{ row.docType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="issueDate" label="出台日期" />
      <el-table-column prop="status" label="废改立情况">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="relatedDoc" label="关联文件" show-overflow-tooltip />
      <el-table-column prop="interpreter" label="解释权部门/人员" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.size"
      :total="pagination.total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="文号" prop="docNumber">
          <el-input v-model="formData.docNumber" placeholder="请输入文号，如：院字[2023]01号" />
        </el-form-item>
        <el-form-item label="文件名称" prop="docName">
          <el-input v-model="formData.docName" placeholder="请输入文件名称" />
        </el-form-item>
        <el-form-item label="制度类型" prop="docType">
          <el-select v-model="formData.docType" placeholder="请选择制度类型">
            <el-option label="党字" value="党字" />
            <el-option label="院字" value="院字" />
            <el-option label="学字" value="学字" />
          </el-select>
        </el-form-item>
        <el-form-item label="出台日期" prop="issueDate">
          <el-date-picker
            v-model="formData.issueDate"
            type="date"
            placeholder="选择出台日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="废改立情况" prop="status">
          <el-select v-model="formData.status" placeholder="请选择废改立情况">
            <el-option label="有效" value="有效" />
            <el-option label="废止" value="废止" />
            <el-option label="修订" value="修订" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联文件" prop="relatedDoc">
          <el-input v-model="formData.relatedDoc" placeholder="请输入关联文件" />
        </el-form-item>
        <el-form-item label="解释权部门/人员" prop="interpreter">
          <el-input v-model="formData.interpreter" placeholder="请输入解释权部门/人员" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getDocumentList,
  addDocument,
  updateDocument,
  deleteDocument
} from '@/api/hr'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const isEdit = ref(false)

const queryForm = reactive({
  docName: '',
  docType: '',
  status: ''
})

const formData = reactive({
  id: null,
  docNumber: '',
  docName: '',
  docType: '',
  issueDate: '',
  status: '',
  relatedDoc: '',
  interpreter: ''
})

const formRules = {
  docNumber: [{ required: true, message: '请输入文号', trigger: 'blur' }],
  docName: [{ required: true, message: '请输入文件名称', trigger: 'blur' }],
  docType: [{ required: true, message: '请选择制度类型', trigger: 'change' }],
  issueDate: [{ required: true, message: '请选择出台日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择废改立情况', trigger: 'change' }]
}

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 获取制度类型标签样式
const getDocType = (type) => {
  const typeMap = {
    '党字': 'danger',
    '院字': 'warning',
    '学字': 'success'
  }
  return typeMap[type] || ''
}

// 获取状态类型标签样式
const getStatusType = (status) => {
  const typeMap = {
    '有效': 'success',
    '废止': 'info',
    '修订': 'warning'
  }
  return typeMap[status] || ''
}

// 查询列表
const handleQuery = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      docName: queryForm.docName,
      docType: queryForm.docType,
      status: queryForm.status
    }
    const res = await getDocumentList(params)
    tableData.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('查询失败')
  } finally {
    loading.value = false
  }
}

// 重置查询
const handleReset = () => {
  queryForm.docName = ''
  queryForm.docType = ''
  queryForm.status = ''
  pagination.page = 1
  handleQuery()
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增学院文件制度'
  resetFormData()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑学院文件制度'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该条记录吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteDocument(row.id)
      ElMessage.success('删除成功')
      handleQuery()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          await updateDocument(formData.id, formData)
          ElMessage.success('修改成功')
        } else {
          await addDocument(formData)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        handleQuery()
      } catch (error) {
        ElMessage.error(isEdit.value ? '修改失败' : '新增失败')
      }
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
  resetFormData()
}

// 重置表单数据
const resetFormData = () => {
  formData.id = null
  formData.docNumber = ''
  formData.docName = ''
  formData.docType = ''
  formData.issueDate = ''
  formData.status = ''
  formData.relatedDoc = ''
  formData.interpreter = ''
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.size = val
  handleQuery()
}

// 当前页改变
const handleCurrentChange = (val) => {
  pagination.page = val
  handleQuery()
}

// 初始化查询
handleQuery()
</script>

<style lang="scss" scoped>
.document-list {
  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
