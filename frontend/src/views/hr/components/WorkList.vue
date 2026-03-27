<template>
  <div class="work-list">
    <!-- 查询表单 -->
    <el-form :model="queryForm" inline>
      <el-form-item label="单位名称">
        <el-input v-model="queryForm.companyName" placeholder="请输入单位名称" clearable />
      </el-form-item>
      <el-form-item label="经历类型">
        <el-select v-model="queryForm.expType" placeholder="请选择经历类型" clearable>
          <el-option label="社会经历" value="SOCIAL" />
          <el-option label="兼职经历" value="PART_TIME" />
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
      <el-table-column prop="companyName" label="单位名称" />
      <el-table-column prop="expType" label="经历类型">
        <template #default="{ row }">
          <el-tag :type="row.expType === 'SOCIAL' ? 'primary' : 'success'">
            {{ row.expType === 'SOCIAL' ? '社会经历' : '兼职经历' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="position" label="职位" />
      <el-table-column prop="isLegalRep" label="是否法人">
        <template #default="{ row }">
          <el-tag :type="row.isLegalRep ? 'danger' : 'info'">
            {{ row.isLegalRep ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" label="开始时间" />
      <el-table-column prop="endDate" label="结束时间" />
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
        <el-form-item label="经历类型" prop="expType">
          <el-select v-model="formData.expType" placeholder="请选择经历类型">
            <el-option label="社会经历" value="SOCIAL" />
            <el-option label="兼职经历" value="PART_TIME" />
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称" prop="companyName">
          <el-input v-model="formData.companyName" placeholder="请输入单位名称" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="formData.position" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="是否法人" prop="isLegalRep">
          <el-switch v-model="formData.isLegalRep" />
        </el-form-item>
        <el-form-item label="成立日期" prop="regDate" v-if="formData.isLegalRep">
          <el-date-picker
            v-model="formData.regDate"
            type="date"
            placeholder="选择成立日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="startDate">
          <el-date-picker
            v-model="formData.startDate"
            type="date"
            placeholder="选择开始时间"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker
            v-model="formData.endDate"
            type="date"
            placeholder="选择结束时间"
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
import { useUserStore } from '@/store/user'
import {
  getWorkList,
  addWork,
  updateWork,
  deleteWork
} from '@/api/hr'

const userStore = useUserStore()
const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const isEdit = ref(false)

const queryForm = reactive({
  companyName: '',
  expType: ''
})

const formData = reactive({
  id: null,
  expType: '',
  companyName: '',
  position: '',
  isLegalRep: false,
  regDate: '',
  startDate: '',
  endDate: ''
})

const formRules = {
  expType: [{ required: true, message: '请选择经历类型', trigger: 'change' }],
  companyName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
  position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  regDate: [
    { 
      validator: (rule, value, callback) => {
        if (formData.isLegalRep && !value) {
          callback(new Error('请选择成立日期'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
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
      companyName: queryForm.companyName,
      expType: queryForm.expType
    }
    const res = await getWorkList(userStore.userInfo?.id)
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
  queryForm.companyName = ''
  queryForm.expType = ''
  pagination.page = 1
  handleQuery()
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增工作经历'
  resetFormData()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑工作经历'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该条记录吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteWork(row.id)
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
          await updateWork(formData.id, formData)
          ElMessage.success('修改成功')
        } else {
          await addWork(formData)
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
  formData.expType = ''
  formData.companyName = ''
  formData.position = ''
  formData.isLegalRep = false
  formData.regDate = ''
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
.work-list {
  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
