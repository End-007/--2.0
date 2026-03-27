<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar-container">
      <div class="logo">
        <span v-if="!isCollapse">学管平台</span>
        <span v-else>学管</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <template v-for="route in menuRoutes" :key="route.path">
          <el-menu-item v-if="!route.meta?.hidden" :index="route.path">
            <el-icon v-if="route.meta?.icon">
              <component :is="route.meta.icon" />
            </el-icon>
            <template #title>{{ route.meta?.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header-container">
        <div class="header-left">
          <el-icon class="hamburger" @click="toggleSidebar">
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>
          <breadcrumb />
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <el-icon><User /></el-icon>
              <span>{{ userStore.name }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-container">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'
import Breadcrumb from '@/components/Breadcrumb/index.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()

const isCollapse = computed(() => !appStore.isSidebarOpened)
const activeMenu = computed(() => route.path)

// 获取菜单路由
const menuRoutes = computed(() => {
  return router.options.routes.find(r => r.path === '/')?.children || []
})

// 切换侧边栏
const toggleSidebar = () => {
  appStore.toggleSidebar()
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  if (command === 'personal') {
    router.push('/personal')
  } else if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100%;
}

.sidebar-container {
  background-color: #304156;
  transition: width 0.28s;
  overflow-x: hidden;

  .logo {
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-weight: bold;
    font-size: 20px;
    overflow: hidden;
  }

  :deep(.el-menu) {
    border-right: none;
  }
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .header-left {
    display: flex;
    align-items: center;

    .hamburger {
      font-size: 20px;
      cursor: pointer;
      margin-right: 20px;
    }
  }

  .header-right {
    .el-dropdown-link {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #606266;

      .el-icon {
        margin-right: 5px;
      }
    }
  }
}

.main-container {
  background-color: #f0f2f5;
  padding: 20px;
}

/* 页面切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
