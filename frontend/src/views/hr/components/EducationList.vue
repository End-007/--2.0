<template>
  <div class="education-list">
    <!-- 查询表单 -->
    <el-form :model="queryForm" inline>
      <el-form-item label="院校名称">
        <el-input v-model="queryForm.schoolName" placeholder="请输入院校名称" clearable />
      </el-form-item>
      <el-form-item label="学位">
        <el-select v-model="queryForm.degree" placeholder="请选择学位" clearable>
          <el-option label="博士" value="博士" />
          <el-option label="硕士" value="硕士" />
          <el-option label="本科" value="本科" />
          <el-option label="专科" value="专科" />
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
      <el-table-column prop="schoolName" label="院校名称" />
      <el-table-column prop="degree" label="学位">
        <template #default="{ row }">
          <el-tag :type="getDegreeType(row.degree)">{{ row.degree }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="major" label="专业" />
      <el-table-column prop="startDate" label="起始时间" />
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
        <el-form-item label="院校名称" prop="schoolName">
          <el-input v-model="formData.schoolName" placeholder="请输入院校名称" />
        </el-form-item>
        <el-form-item label="学位" prop="degree">
          <el-select v-model="formData.degree" placeholder="请选择学位">
            <el-option label="博士" value="博士" />
            <el-option label="硕士" value="硕士" />
            <el-option label="本科" value="本科" />
            <el-option label="专科" value="专科" />
          </el-select>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="formData.major" placeholder="请输入专业" />
        </el-form-item>
        <el-form-item label="起始时间" prop="startDate">
          <el-date-picker
            v-model="formData.startDate"
            type="date"
            placeholder="选择起始时间"
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
        <el-form-item label="毕业证书" prop="gradCertPath">
          <el-upload
            class="upload-demo"
            action="/api/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="gradCertList"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="学位证书" prop="degCertPath">
          <el-upload
            class="upload-demo"
            action="/api/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="degCertList"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
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
  getEducationList,
  addEducation,
  updateEducation,
  deleteEducation
} from '@/api/hr'

const userStore = useUserStore()
const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const isEdit = ref(false)
const gradCertList = ref([])
const degCertList = ref([])

const queryForm = reactive({
  schoolName: '',
  degree: ''
})

const formData = reactive({
  id: null,
  schoolName: '',
  degree: '',
  major: '',
  startDate: '',
  endDate: '',
  gradCertPath: '',
  degCertPath: ''
})

const formRules = {
  schoolName: [{ required: true, message: '请输入院校名称', trigger: 'blur' }],
  degree: [{ required: true, message: '请选择学位', trigger: 'change' }],
  major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择起始时间', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
}

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 获取学位类型标签样式
const getDegreeType = (degree) => {
  const typeMap = {
    '博士': 'danger',
    '硕士': 'warning',
    '本科': 'success',
    '专科': 'info'
  }
  return typeMap[degree] || ''
}

// 查询列表
const handleQuery = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      schoolName: queryForm.schoolName,
      degree: queryForm.degree
    }
    const res = await getEducationList(userStore.userInfo?.id)
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
  queryForm.schoolName = ''
  queryForm.degree = ''
  pagination.page = 1
  handleQuery()
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增学习经历'
  resetFormData()
  gradCertList.value = []
  degCertList.value = []
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑学习经历'
  Object.assign(formData, row)
  if (row.gradCertPath) {
    gradCertList.value = [{ name: '毕业证书', url: row.gradCertPath }]
  }
  if (row.degCertPath) {
    degCertList.value = [{ name: '学位证书', url: row.degCertPath }]
  }
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该条记录吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteEducation(row.id)
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
          await updateEducation(formData.id, formData)
          ElMessage.success('修改成功')
        } else {
          await addEducation(formData)
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
  gradCertList.value = []
  degCertList.value = []
}

// 重置表单数据
const resetFormData = () => {
  formData.id = null
  formData.schoolName = ''
  formData.degree = ''
  formData.major = ''
  formData.startDate = ''
  formData.endDate = ''
  formData.gradCertPath = ''
  formData.degCertPath = ''
}

// 文件预览
const handlePreview = (file) => {
  window.open(file.url)
}

// 文件移除
const handleRemove = (file, fileList) => {
  if (file.name === '毕业证书') {
    formData.gradCertPath = ''
  } else if (file.name === '学位证书') {
    formData.degCertPath = ''
  }
}

// 文件移除前确认
const beforeRemove = (file) => {
  return ElMessage.confirm(`确认移除 ${file.name}？`)
}

// 文件超出限制
const handleExceed = (files) => {
  ElMessage.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`)
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
.education-list {
  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
