import request from '@/utils/request'

// 获取教学统计数据
export function getTeachingStats(params) {
  return request({
    url: '/dashboard/teaching',
    method: 'get',
    params
  })
}

// 获取科研统计数据
export function getResearchStats(params) {
  return request({
    url: '/dashboard/research',
    method: 'get',
    params
  })
}

// 获取学习统计数据
export function getLearningStats(params) {
  return request({
    url: '/dashboard/learning',
    method: 'get',
    params
  })
}

// 获取整体概况数据
export function getOverviewStats(params) {
  return request({
    url: '/dashboard/overview',
    method: 'get',
    params
  })
}

// 导出数据
export function exportData(params) {
  return request({
    url: '/dashboard/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
