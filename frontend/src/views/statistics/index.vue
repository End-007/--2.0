<template>
  <div class="statistics-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>数据统计与查询</span>
        </div>
      </template>

      <!-- 查询表单 -->
      <el-form :model="queryForm" inline>
        <el-form-item label="统计类型">
          <el-select v-model="queryForm.type" placeholder="请选择统计类型">
            <el-option label="教学数据" value="teaching" />
            <el-option label="科研数据" value="research" />
            <el-option label="学习数据" value="learning" />
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
          <el-button type="success" @click="handleExport">导出</el-button>
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
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="count" label="数量" />
        <el-table-column prop="percentage" label="占比" />
        <el-table-column prop="date" label="日期" />
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
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getTeachingStats, getResearchStats, getLearningStats, exportData } from '@/api/dashboard'

const loading = ref(false)
const tableData = ref([])

const queryForm = reactive({
  type: 'teaching',
  dateRange: []
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 查询数据
const handleQuery = async () => {
  loading.value = true
  try {
    let res
    const params = {
      page: pagination.page,
      size: pagination.size,
      startDate: queryForm.dateRange?.[0],
      endDate: queryForm.dateRange?.[1]
    }

    switch (queryForm.type) {
      case 'teaching':
        res = await getTeachingStats(params)
        break
      case 'research':
        res = await getResearchStats(params)
        break
      case 'learning':
        res = await getLearningStats(params)
        break
    }

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
  queryForm.type = 'teaching'
  queryForm.dateRange = []
  pagination.page = 1
  handleQuery()
}

// 导出数据
const handleExport = async () => {
  try {
    const res = await exportData({
      type: queryForm.type,
      startDate: queryForm.dateRange?.[0],
      endDate: queryForm.dateRange?.[1]
    })

    const url = window.URL.createObjectURL(new Blob([res]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `statistics_${queryForm.type}_${new Date().getTime()}.xlsx`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
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
.statistics-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
