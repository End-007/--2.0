<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in levelList" :key="item.path" :to="item.path">
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const levelList = ref([])

const getBreadcrumb = () => {
  let matched = route.matched.filter(item => item.meta && item.meta.title)
  const first = matched[0]

  // 如果第一个不是首页，则添加首页
  if (first && first.path !== '/') {
    matched = [{ path: '/', meta: { title: '首页' } }].concat(matched)
  }

  levelList.value = matched.filter(item => item.path !== route.path)
}

watch(
  () => route.path,
  () => {
    getBreadcrumb()
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  line-height: 50px;
  font-size: 14px;
}
</style>
