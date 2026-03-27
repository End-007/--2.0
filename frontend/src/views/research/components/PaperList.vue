<template>
  <div class="paper-list">
    <!-- 查询表单 -->
    <el-form :model="queryForm" inline>
      <el-form-item label="论文标题">
        <el-input v-model="queryForm.title" placeholder="请输入论文标题" clearable />
      </el-form-item>
      <el-form-item label="期刊名称">
        <el-input v-model="queryForm.journal" placeholder="请输入期刊名称" clearable />
      </el-form-item>
      <el-form-item label="收录类型">
        <el-select v-model="queryForm.indexType" placeholder="请选择收录类型" clearable>
          <el-option label="SCI" value="SCI" />
          <el-option label="EI" value="EI" />
          <el-option label="CORE" value="CORE" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>
      <el-form-item label="发表时间">
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
      <el-table-column prop="title" label="论文标题" show-overflow-tooltip />
      <el-table-column prop="authorName" label="作者" />
      <el-table-column prop="journalName" label="期刊名称" />
      <el-table-column prop="publishDate" label="发表时间" />
      <el-table-column prop="indexType" label="收录类型">
        <template #default="{ row }">
          <el-tag :type="getIndexType(row.indexType)">{{ row.indexType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip />
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
        <el-form-item label="作者ID" prop="authorId">
          <el-input v-model="formData.authorId" placeholder="请输入作者ID" />
        </el-form-item>
        <el-form-item label="论文标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入论文标题" />
        </el-form-item>
        <el-form-item label="期刊名称" prop="journalName">
          <el-input v-model="formData.journalName" placeholder="请输入期刊名称" />
        </el-form-item>
        <el-form-item label="发表时间" prop="publishDate">
          <el-date-picker
            v-model="formData.publishDate"
            type="date"
            placeholder="选择发表时间"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="收录类型" prop="indexType">
          <el-select v-model="formData.indexType" placeholder="请选择收录类型">
            <el-option label="SCI" value="SCI" />
            <el-option label="EI" value="EI" />
            <el-option label="CORE" value="CORE" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
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
  getPaperList,
  addPaper,
  updatePaper,
  deletePaper
} from '@/api/research'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const isEdit = ref(false)

const queryForm = reactive({
  title: '',
  journal: '',
  indexType: '',
  dateRange: []
})

const formData = reactive({
  id: null,
  authorId: '',
  title: '',
  journalName: '',
  publishDate: '',
  indexType: '',
  remark: ''
})

const formRules = {
  authorId: [{ required: true, message: '请输入作者ID', trigger: 'blur' }],
  title: [{ required: true, message: '请输入论文标题', trigger: 'blur' }],
  journalName: [{ required: true, message: '请输入期刊名称', trigger: 'blur' }],
  publishDate: [{ required: true, message: '请选择发表时间', trigger: 'change' }],
  indexType: [{ required: true, message: '请选择收录类型', trigger: 'change' }]
}

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 获取收录类型标签样式
const getIndexType = (type) => {
  const typeMap = {
    'SCI': 'danger',
    'EI': 'warning',
    'CORE': 'success',
    '其他': 'info'
  }
  return typeMap[type] || ''
}

// 查询列表
const handleQuery = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      title: queryForm.title,
      journal: queryForm.journal,
      indexType: queryForm.indexType,
      startDate: queryForm.dateRange?.[0],
      endDate: queryForm.dateRange?.[1]
    }
    const res = await getPaperList(params)
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
  queryForm.title = ''
  queryForm.journal = ''
  queryForm.indexType = ''
  queryForm.dateRange = []
  pagination.page = 1
  handleQuery()
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增论文发表'
  resetFormData()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑论文发表'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该条记录吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deletePaper(row.id)
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
          await updatePaper(formData.id, formData)
          ElMessage.success('修改成功')
        } else {
          await addPaper(formData)
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
  formData.authorId = ''
  formData.title = ''
  formData.journalName = ''
  formData.publishDate = ''
  formData.indexType = ''
  formData.remark = ''
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
.paper-list {
  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
