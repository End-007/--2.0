<template>
  <div class="award-list">
    <!-- 查询表单 -->
    <el-form :model="queryForm" inline>
      <el-form-item label="奖励名称">
        <el-input v-model="queryForm.name" placeholder="请输入奖励名称" clearable />
      </el-form-item>
      <el-form-item label="奖励类型">
        <el-select v-model="queryForm.type" placeholder="请选择奖励类型" clearable>
          <el-option label="教学" value="TEACHING" />
          <el-option label="科研" value="RESEARCH" />
        </el-select>
      </el-form-item>
      <el-form-item label="级别">
        <el-input v-model="queryForm.level" placeholder="请输入级别" clearable />
      </el-form-item>
      <el-form-item label="获奖时间">
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
      <el-table-column prop="awardName" label="奖励名称" />
      <el-table-column prop="recipientName" label="获得者" />
      <el-table-column prop="awardType" label="奖励类型">
        <template #default="{ row }">
          <el-tag :type="row.awardType === 'TEACHING' ? 'primary' : 'success'">
            {{ row.awardType === 'TEACHING' ? '教学' : '科研' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="级别" />
      <el-table-column prop="awardDate" label="获奖日期" />
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
        <el-form-item label="获得者ID" prop="recipientId">
          <el-input v-model="formData.recipientId" placeholder="请输入获得者ID" />
        </el-form-item>
        <el-form-item label="奖励名称" prop="awardName">
          <el-input v-model="formData.awardName" placeholder="请输入奖励名称" />
        </el-form-item>
        <el-form-item label="奖励类型" prop="awardType">
          <el-select v-model="formData.awardType" placeholder="请选择奖励类型">
            <el-option label="教学" value="TEACHING" />
            <el-option label="科研" value="RESEARCH" />
          </el-select>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-input v-model="formData.level" placeholder="请输入级别" />
        </el-form-item>
        <el-form-item label="获奖日期" prop="awardDate">
          <el-date-picker
            v-model="formData.awardDate"
            type="date"
            placeholder="选择获奖日期"
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
  getAwardList,
  addAward,
  updateAward,
  deleteAward
} from '@/api/research'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const isEdit = ref(false)

const queryForm = reactive({
  name: '',
  type: '',
  level: '',
  dateRange: []
})

const formData = reactive({
  id: null,
  recipientId: '',
  awardName: '',
  awardType: '',
  level: '',
  awardDate: ''
})

const formRules = {
  recipientId: [{ required: true, message: '请输入获得者ID', trigger: 'blur' }],
  awardName: [{ required: true, message: '请输入奖励名称', trigger: 'blur' }],
  awardType: [{ required: true, message: '请选择奖励类型', trigger: 'change' }],
  level: [{ required: true, message: '请输入级别', trigger: 'blur' }],
  awardDate: [{ required: true, message: '请选择获奖日期', trigger: 'change' }]
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
      type: queryForm.type,
      level: queryForm.level,
      startDate: queryForm.dateRange?.[0],
      endDate: queryForm.dateRange?.[1]
    }
    const res = await getAwardList(params)
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
  queryForm.type = ''
  queryForm.level = ''
  queryForm.dateRange = []
  pagination.page = 1
  handleQuery()
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增教研/科研奖励'
  resetFormData()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑教研/科研奖励'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该条记录吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteAward(row.id)
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
          await updateAward(formData.id, formData)
          ElMessage.success('修改成功')
        } else {
          await addAward(formData)
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
  formData.recipientId = ''
  formData.awardName = ''
  formData.awardType = ''
  formData.level = ''
  formData.awardDate = ''
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
.award-list {
  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
