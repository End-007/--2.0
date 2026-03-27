<template>
  <div class="assessment-list">
    <!-- 查询表单 -->
    <el-form :model="queryForm" inline>
      <el-form-item label="考核年份">
        <el-date-picker
          v-model="queryForm.year"
          type="year"
          placeholder="选择考核年份"
          value-format="YYYY"
        />
      </el-form-item>
      <el-form-item label="考核结果">
        <el-select v-model="queryForm.result" placeholder="请选择考核结果" clearable>
          <el-option label="优秀" value="优秀" />
          <el-option label="合格" value="合格" />
          <el-option label="不合格" value="不合格" />
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
      <el-table-column prop="year" label="考核年份" />
      <el-table-column prop="result" label="考核结果">
        <template #default="{ row }">
          <el-tag :type="getResultType(row.result)">{{ row.result }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="考核类型" />
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
        label-width="100px"
      >
        <el-form-item label="考核年份" prop="year">
          <el-date-picker
            v-model="formData.year"
            type="year"
            placeholder="选择考核年份"
            value-format="YYYY"
          />
        </el-form-item>
        <el-form-item label="考核结果" prop="result">
          <el-select v-model="formData.result" placeholder="请选择考核结果">
            <el-option label="优秀" value="优秀" />
            <el-option label="合格" value="合格" />
            <el-option label="不合格" value="不合格" />
          </el-select>
        </el-form-item>
        <el-form-item label="考核类型" prop="type">
          <el-input v-model="formData.type" placeholder="请输入考核类型" />
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
import { useUserStore } from '@/store/user'
import {
  getAssessmentList,
  addAssessment,
  updateAssessment,
  deleteAssessment
} from '@/api/hr'

const userStore = useUserStore()
const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const isEdit = ref(false)

const queryForm = reactive({
  year: '',
  result: ''
})

const formData = reactive({
  id: null,
  year: '',
  result: '',
  type: ''
})

const formRules = {
  year: [{ required: true, message: '请选择考核年份', trigger: 'change' }],
  result: [{ required: true, message: '请选择考核结果', trigger: 'change' }],
  type: [{ required: true, message: '请输入考核类型', trigger: 'blur' }]
}

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 获取考核结果类型标签样式
const getResultType = (result) => {
  const typeMap = {
    '优秀': 'success',
    '合格': 'warning',
    '不合格': 'danger'
  }
  return typeMap[result] || ''
}

// 查询列表
const handleQuery = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      year: queryForm.year,
      result: queryForm.result
    }
    const res = await getAssessmentList(userStore.userInfo?.id)
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
  queryForm.year = ''
  queryForm.result = ''
  pagination.page = 1
  handleQuery()
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增年度考核'
  resetFormData()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑年度考核'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该条记录吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteAssessment(row.id)
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
          await updateAssessment(formData.id, formData)
          ElMessage.success('修改成功')
        } else {
          await addAssessment(formData)
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
  formData.year = ''
  formData.result = ''
  formData.type = ''
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
.assessment-list {
  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
