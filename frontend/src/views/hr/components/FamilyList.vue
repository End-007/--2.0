<template>
  <div class="family-list">
    <!-- 查询表单 -->
    <el-form :model="queryForm" inline>
      <el-form-item label="姓名">
        <el-input v-model="queryForm.name" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="关系">
        <el-select v-model="queryForm.relation" placeholder="请选择关系" clearable>
          <el-option label="子女" value="子女" />
          <el-option label="配偶" value="配偶" />
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
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="relation" label="关系">
        <template #default="{ row }">
          <el-tag :type="row.relation === '子女' ? 'success' : 'primary'">
            {{ row.relation }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="birthDate" label="出生日期" />
      <el-table-column prop="schoolInfo" label="上学情况/幼儿园信息" show-overflow-tooltip />
      <el-table-column prop="feeStatus" label="费用相关情况" show-overflow-tooltip />
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
        label-width="140px"
      >
        <el-form-item label="关系" prop="relation">
          <el-select v-model="formData.relation" placeholder="请选择关系">
            <el-option label="子女" value="子女" />
            <el-option label="配偶" value="配偶" />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="出生日期" prop="birthDate">
          <el-date-picker
            v-model="formData.birthDate"
            type="date"
            placeholder="选择出生日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="上学情况/幼儿园信息" prop="schoolInfo">
          <el-input
            v-model="formData.schoolInfo"
            type="textarea"
            :rows="3"
            placeholder="请输入上学情况/幼儿园信息"
          />
        </el-form-item>
        <el-form-item label="费用相关情况" prop="feeStatus">
          <el-input
            v-model="formData.feeStatus"
            type="textarea"
            :rows="3"
            placeholder="请输入费用相关情况"
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
  getFamilyList,
  addFamily,
  updateFamily,
  deleteFamily
} from '@/api/hr'

const userStore = useUserStore()
const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const isEdit = ref(false)

const queryForm = reactive({
  name: '',
  relation: ''
})

const formData = reactive({
  id: null,
  relation: '',
  name: '',
  birthDate: '',
  schoolInfo: '',
  feeStatus: ''
})

const formRules = {
  relation: [{ required: true, message: '请选择关系', trigger: 'change' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  birthDate: [{ required: true, message: '请选择出生日期', trigger: 'change' }]
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
      relation: queryForm.relation
    }
    const res = await getFamilyList(userStore.userInfo?.id)
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
  queryForm.relation = ''
  pagination.page = 1
  handleQuery()
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增家庭成员'
  resetFormData()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑家庭成员'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该条记录吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteFamily(row.id)
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
          await updateFamily(formData.id, formData)
          ElMessage.success('修改成功')
        } else {
          await addFamily(formData)
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
  formData.relation = ''
  formData.name = ''
  formData.birthDate = ''
  formData.schoolInfo = ''
  formData.feeStatus = ''
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
.family-list {
  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
