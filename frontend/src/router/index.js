import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '数据大屏', icon: 'DataAnalysis' }
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('@/views/statistics/index.vue'),
        meta: { title: '统计查询', icon: 'DataLine' }
      },
      {
        path: 'personal',
        name: 'Personal',
        component: () => import('@/views/personal/index.vue'),
        meta: { title: '个人中心', icon: 'User' }
      },
      {
        path: 'research',
        name: 'Research',
        component: () => import('@/views/research/index.vue'),
        meta: { title: '科研管理', icon: 'Document' }
      },
      {
        path: 'hr',
        name: 'HR',
        component: () => import('@/views/hr/index.vue'),
        meta: { title: '人事档案', icon: 'UserFilled' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 学管平台` : '学管平台'
  next()
})

export default router
