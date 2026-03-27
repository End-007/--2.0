<template>
  <div class="project-list">
    <!-- 查询表单 -->
    <el-form :model="queryForm" inline>
      <el-form-item label="项目名称">
        <el-input v-model="queryForm.name" placeholder="请输入项目名称" clearable />
      </el-form-item>
      <el-form-item label="项目来源">
        <el-select v-model="queryForm.source" placeholder="请选择项目来源" clearable>
          <el-option label="横向" value="横向" />
          <el-option label="纵向" value="纵向" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="queryForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
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
      <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip />
      <el-table-column prop="principalName" label="负责人" />
      <el-table-column prop="source" label="项目来源">
        <template #default="{ row }">
          <el-tag :type="row.source === '纵向' ? 'primary' : 'success'">{{ row.source }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="项目金额(元)" />
      <el-table-column prop="startDate" label="开始日期" />
      <el-table-column prop="endDate" label="结束日期" />
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
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="formData.projectName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="负责人ID" prop="principalId">
          <el-input v-model="formData.principalId" placeholder="请输入负责人ID" />
        </el-form-item>
        <el-form-item label="项目来源" prop="source">
          <el-select v-model="formData.source" placeholder="请选择项目来源">
            <el-option label="横向" value="横向" />
            <el-option label="纵向" value="纵向" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目金额" prop="amount">
          <el-input-number v-model="formData.amount" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="formData.startDate"
            type="date"
            placeholder="选择开始日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="formData.endDate"
            type="date"
            placeholder="选择结束日期"
            value-format="YYYY-MM-DD"
          />
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
  getProjectList,
  addProject,
  updateProject,
  deleteProject
} from '@/api/research'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const isEdit = ref(false)

const queryForm = reactive({
  name: '',
  source: '',
  dateRange: []
})

const formData = reactive({
  id: null,
  projectName: '',
  principalId: '',
  source: '',
  amount: 0,
  startDate: '',
  endDate: ''
})

const formRules = {
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  principalId: [{ required: true, message: '请输入负责人ID', trigger: 'blur' }],
  source: [{ required: true, message: '请选择项目来源', trigger: 'change' }],
  amount: [{ required: true, message: '请输入项目金额', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }]
}

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 查询列表
const handleQuery = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      name: queryForm.name,
      source: queryForm.source,
      startDate: queryForm.dateRange?.[0],
      endDate: queryForm.dateRange?.[1]
    }
    const res = await getProjectList(params)
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
  queryForm.name = ''
  queryForm.source = ''
  queryForm.dateRange = []
  pagination.page = 1
  handleQuery()
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增科研项目'
  resetFormData()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑科研项目'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该条记录吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteProject(row.id)
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
          await updateProject(formData.id, formData)
          ElMessage.success('修改成功')
        } else {
          await addProject(formData)
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
  formData.projectName = ''
  formData.principalId = ''
  formData.source = ''
  formData.amount = 0
  formData.startDate = ''
  formData.endDate = ''
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
.project-list {
  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
