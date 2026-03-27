<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>整体概况</span>
              <el-button type="primary" @click="handleExport">导出数据</el-button>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="6" v-for="item in overviewData" :key="item.title">
              <div class="stat-item">
                <div class="stat-icon" :style="{ background: item.color }">
                  <el-icon :size="30">
                    <component :is="item.icon" />
                  </el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ item.value }}</div>
                  <div class="stat-title">{{ item.title }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>教学情况统计</span>
          </template>
          <div ref="teachingChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>科研情况统计</span>
          </template>
          <div ref="researchChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>学习情况趋势</span>
          </template>
          <div ref="learningChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { getOverviewStats, getTeachingStats, getResearchStats, getLearningStats, exportData } from '@/api/dashboard'

const teachingChartRef = ref(null)
const researchChartRef = ref(null)
const learningChartRef = ref(null)

let teachingChart = null
let researchChart = null
let learningChart = null

const overviewData = ref([
  { title: '学生总数', value: 0, icon: 'User', color: '#409EFF' },
  { title: '教师总数', value: 0, icon: 'UserFilled', color: '#67C23A' },
  { title: '课程总数', value: 0, icon: 'Reading', color: '#E6A23C' },
  { title: '科研项目', value: 0, icon: 'Document', color: '#F56C6C' }
])

// 初始化教学情况图表
const initTeachingChart = (data) => {
  teachingChart = echarts.init(teachingChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '课程分布',
        type: 'pie',
        radius: '50%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  teachingChart.setOption(option)
}

// 初始化科研情况图表
const initResearchChart = (data) => {
  researchChart = echarts.init(researchChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.categories
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '项目数',
        type: 'bar',
        data: data.values,
        itemStyle: {
          color: '#409EFF'
        }
      }
    ]
  }
  researchChart.setOption(option)
}

// 初始化学习情况图表
const initLearningChart = (data) => {
  learningChart = echarts.init(learningChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['平均成绩', '出勤率']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.dates
    },
    yAxis: [
      {
        type: 'value',
        name: '平均成绩',
        min: 0,
        max: 100
      },
      {
        type: 'value',
        name: '出勤率',
        min: 0,
        max: 100
      }
    ],
    series: [
      {
        name: '平均成绩',
        type: 'line',
        data: data.scores,
        smooth: true
      },
      {
        name: '出勤率',
        type: 'line',
        yAxisIndex: 1,
        data: data.attendance,
        smooth: true
      }
    ]
  }
  learningChart.setOption(option)
}

// 获取数据
const fetchData = async () => {
  try {
    // 获取整体概况
    const overviewRes = await getOverviewStats()
    overviewData.value = overviewRes.data

    // 获取教学统计
    const teachingRes = await getTeachingStats()
    initTeachingChart(teachingRes.data)

    // 获取科研统计
    const researchRes = await getResearchStats()
    initResearchChart(researchRes.data)

    // 获取学习统计
    const learningRes = await getLearningStats()
    initLearningChart(learningRes.data)
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

// 导出数据
const handleExport = async () => {
  try {
    const res = await exportData()
    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([res]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `dashboard_${new Date().getTime()}.xlsx`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('导出失败:', error)
  }
}

// 窗口大小改变时重新渲染图表
const handleResize = () => {
  teachingChart && teachingChart.resize()
  researchChart && researchChart.resize()
  learningChart && learningChart.resize()
}

onMounted(() => {
  fetchData()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  teachingChart && teachingChart.dispose()
  researchChart && researchChart.dispose()
  learningChart && learningChart.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  .overview-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-item {
      display: flex;
      align-items: center;
      padding: 20px 0;

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        margin-right: 15px;
      }

      .stat-content {
        flex: 1;

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .stat-title {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }

  .charts-row {
    margin-top: 20px;

    .chart-container {
      width: 100%;
      height: 350px;
    }
  }
}
</style>
