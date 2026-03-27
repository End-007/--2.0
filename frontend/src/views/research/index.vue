<template>
  <div class="research-container">
    <el-card>
      <el-tabs v-model="activeTab">
        <!-- 竞赛获奖 -->
        <el-tab-pane label="竞赛获奖" name="competition">
          <competition-list />
        </el-tab-pane>

        <!-- 大创项目 -->
        <el-tab-pane label="大创项目" name="innovation">
          <innovation-list />
        </el-tab-pane>

        <!-- 论文发表 -->
        <el-tab-pane label="论文发表" name="paper">
          <paper-list />
        </el-tab-pane>

        <!-- 科研项目 -->
        <el-tab-pane label="科研项目" name="project">
          <project-list />
        </el-tab-pane>

        <!-- 教研/科研奖励 -->
        <el-tab-pane label="教研/科研奖励" name="award">
          <award-list />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CompetitionList from './components/CompetitionList.vue'
import InnovationList from './components/InnovationList.vue'
import PaperList from './components/PaperList.vue'
import ProjectList from './components/ProjectList.vue'
import AwardList from './components/AwardList.vue'

const activeTab = ref('competition')
</script>

<style lang="scss" scoped>
.research-container {
  :deep(.el-tabs__content) {
    padding: 20px 0;
  }
}
</style>
