import request from '@/utils/request'

// 人事详细信息相关
export function getPersonnelInfo(teacherId) {
  return request({
    url: `/hr/personnel/${teacherId}`,
    method: 'get'
  })
}

export function updatePersonnelInfo(teacherId, data) {
  return request({
    url: `/hr/personnel/${teacherId}`,
    method: 'put',
    data
  })
}

// 学习经历相关
export function getEducationList(teacherId) {
  return request({
    url: `/hr/education/${teacherId}`,
    method: 'get'
  })
}

export function addEducation(data) {
  return request({
    url: '/hr/education',
    method: 'post',
    data
  })
}

export function updateEducation(id, data) {
  return request({
    url: `/hr/education/${id}`,
    method: 'put',
    data
  })
}

export function deleteEducation(id) {
  return request({
    url: `/hr/education/${id}`,
    method: 'delete'
  })
}

// 工作/兼职经历相关
export function getWorkList(teacherId) {
  return request({
    url: `/hr/work/${teacherId}`,
    method: 'get'
  })
}

export function addWork(data) {
  return request({
    url: '/hr/work',
    method: 'post',
    data
  })
}

export function updateWork(id, data) {
  return request({
    url: `/hr/work/${id}`,
    method: 'put',
    data
  })
}

export function deleteWork(id) {
  return request({
    url: `/hr/work/${id}`,
    method: 'delete'
  })
}

// 家庭成员相关
export function getFamilyList(teacherId) {
  return request({
    url: `/hr/family/${teacherId}`,
    method: 'get'
  })
}

export function addFamily(data) {
  return request({
    url: '/hr/family',
    method: 'post',
    data
  })
}

export function updateFamily(id, data) {
  return request({
    url: `/hr/family/${id}`,
    method: 'put',
    data
  })
}

export function deleteFamily(id) {
  return request({
    url: `/hr/family/${id}`,
    method: 'delete'
  })
}

// 年度考核相关
export function getAssessmentList(teacherId) {
  return request({
    url: `/hr/assessment/${teacherId}`,
    method: 'get'
  })
}

export function addAssessment(data) {
  return request({
    url: '/hr/assessment',
    method: 'post',
    data
  })
}

export function updateAssessment(id, data) {
  return request({
    url: `/hr/assessment/${id}`,
    method: 'put',
    data
  })
}

export function deleteAssessment(id) {
  return request({
    url: `/hr/assessment/${id}`,
    method: 'delete'
  })
}

// 学院文件制度相关
export function getDocumentList(params) {
  return request({
    url: '/hr/document',
    method: 'get',
    params
  })
}

export function addDocument(data) {
  return request({
    url: '/hr/document',
    method: 'post',
    data
  })
}

export function updateDocument(id, data) {
  return request({
    url: `/hr/document/${id}`,
    method: 'put',
    data
  })
}

export function deleteDocument(id) {
  return request({
    url: `/hr/document/${id}`,
    method: 'delete'
  })
}
