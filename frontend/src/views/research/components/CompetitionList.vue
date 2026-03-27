<template>
  <div class="competition-list">
    <!-- 查询表单 -->
    <el-form :model="queryForm" inline>
      <el-form-item label="竞赛名称">
        <el-input v-model="queryForm.name" placeholder="请输入竞赛名称" clearable />
      </el-form-item>
      <el-form-item label="级别">
        <el-select v-model="queryForm.level" placeholder="请选择级别" clearable>
          <el-option label="国赛" value="国赛" />
          <el-option label="省赛" value="省赛" />
        </el-select>
      </el-form-item>
      <el-form-item label="获奖日期">
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
      <el-table-column prop="compName" label="竞赛名称" />
      <el-table-column prop="participantName" label="参与者" />
      <el-table-column prop="level" label="级别" />
      <el-table-column prop="awardGrade" label="奖项等级" />
      <el-table-column prop="awardDate" label="获奖日期" />
      <el-table-column prop="dataSource" label="数据来源" />
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
        <el-form-item label="参与者" prop="participantId">
          <el-input v-model="formData.participantId" placeholder="请输入参与者ID" />
        </el-form-item>
        <el-form-item label="参与者类型" prop="participantType">
          <el-select v-model="formData.participantType" placeholder="请选择参与者类型">
            <el-option label="学生" value="STUDENT" />
            <el-option label="教师" value="TEACHER" />
          </el-select>
        </el-form-item>
        <el-form-item label="竞赛名称" prop="compName">
          <el-input v-model="formData.compName" placeholder="请输入竞赛名称" />
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-select v-model="formData.level" placeholder="请选择级别">
            <el-option label="国赛" value="国赛" />
            <el-option label="省赛" value="省赛" />
          </el-select>
        </el-form-item>
        <el-form-item label="奖项等级" prop="awardGrade">
          <el-input v-model="formData.awardGrade" placeholder="请输入奖项等级" />
        </el-form-item>
        <el-form-item label="数据来源" prop="dataSource">
          <el-select v-model="formData.dataSource" placeholder="请选择数据来源">
            <el-option label="学院统计" value="学院统计" />
            <el-option label="学校下发" value="学校下发" />
          </el-select>
        </el-form-item>
        <el-form-item label="获奖日期" prop="awardDate">
          <el-date-picker
            v-model="formData.awardDate"
            type="date"
            placeholder="选择获奖日期"
            value-format="YYYY-MM-DD"
          />
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
  getCompetitionList,
  addCompetition,
  updateCompetition,
  deleteCompetition
} from '@/api/research'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const isEdit = ref(false)

const queryForm = reactive({
  name: '',
  level: '',
  dateRange: []
})

const formData = reactive({
  id: null,
  participantId: '',
  participantType: '',
  compName: '',
  level: '',
  awardGrade: '',
  dataSource: '',
  awardDate: '',
  remark: ''
})

const formRules = {
  participantId: [{ required: true, message: '请输入参与者ID', trigger: 'blur' }],
  participantType: [{ required: true, message: '请选择参与者类型', trigger: 'change' }],
  compName: [{ required: true, message: '请输入竞赛名称', trigger: 'blur' }],
  level: [{ required: true, message: '请选择级别', trigger: 'change' }],
  awardGrade: [{ required: true, message: '请输入奖项等级', trigger: 'blur' }],
  dataSource: [{ required: true, message: '请选择数据来源', trigger: 'change' }],
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
      level: queryForm.level,
      startDate: queryForm.dateRange?.[0],
      endDate: queryForm.dateRange?.[1]
    }
    const res = await getCompetitionList(params)
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
  queryForm.level = ''
  queryForm.dateRange = []
  pagination.page = 1
  handleQuery()
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增竞赛获奖'
  resetFormData()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑竞赛获奖'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该条记录吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteCompetition(row.id)
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
          await updateCompetition(formData.id, formData)
          ElMessage.success('修改成功')
        } else {
          await addCompetition(formData)
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
  formData.participantId = ''
  formData.participantType = ''
  formData.compName = ''
  formData.level = ''
  formData.awardGrade = ''
  formData.dataSource = ''
  formData.awardDate = ''
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
.competition-list {
  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
