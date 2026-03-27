import request from '@/utils/request'

// 竞赛获奖相关
export function getCompetitionList(params) {
  return request({
    url: '/research/competition',
    method: 'get',
    params
  })
}

export function addCompetition(data) {
  return request({
    url: '/research/competition',
    method: 'post',
    data
  })
}

export function updateCompetition(id, data) {
  return request({
    url: `/research/competition/${id}`,
    method: 'put',
    data
  })
}

export function deleteCompetition(id) {
  return request({
    url: `/research/competition/${id}`,
    method: 'delete'
  })
}

// 大创项目相关
export function getInnovationList(params) {
  return request({
    url: '/research/innovation',
    method: 'get',
    params
  })
}

export function addInnovation(data) {
  return request({
    url: '/research/innovation',
    method: 'post',
    data
  })
}

export function updateInnovation(id, data) {
  return request({
    url: `/research/innovation/${id}`,
    method: 'put',
    data
  })
}

export function deleteInnovation(id) {
  return request({
    url: `/research/innovation/${id}`,
    method: 'delete'
  })
}

// 论文发表相关
export function getPaperList(params) {
  return request({
    url: '/research/paper',
    method: 'get',
    params
  })
}

export function addPaper(data) {
  return request({
    url: '/research/paper',
    method: 'post',
    data
  })
}

export function updatePaper(id, data) {
  return request({
    url: `/research/paper/${id}`,
    method: 'put',
    data
  })
}

export function deletePaper(id) {
  return request({
    url: `/research/paper/${id}`,
    method: 'delete'
  })
}

// 科研项目相关
export function getProjectList(params) {
  return request({
    url: '/research/project',
    method: 'get',
    params
  })
}

export function addProject(data) {
  return request({
    url: '/research/project',
    method: 'post',
    data
  })
}

export function updateProject(id, data) {
  return request({
    url: `/research/project/${id}`,
    method: 'put',
    data
  })
}

export function deleteProject(id) {
  return request({
    url: `/research/project/${id}`,
    method: 'delete'
  })
}

// 教研/科研奖励相关
export function getAwardList(params) {
  return request({
    url: '/research/award',
    method: 'get',
    params
  })
}

export function addAward(data) {
  return request({
    url: '/research/award',
    method: 'post',
    data
  })
}

export function updateAward(id, data) {
  return request({
    url: `/research/award/${id}`,
    method: 'put',
    data
  })
}

export function deleteAward(id) {
  return request({
    url: `/research/award/${id}`,
    method: 'delete'
  })
}
