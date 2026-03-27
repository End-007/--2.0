<template>
  <div class="hr-container">
    <el-card>
      <el-tabs v-model="activeTab">
        <!-- 人事信息 -->
        <el-tab-pane label="人事信息" name="personnel">
          <personnel-info />
        </el-tab-pane>

        <!-- 学习经历 -->
        <el-tab-pane label="学习经历" name="education">
          <education-list />
        </el-tab-pane>

        <!-- 工作经历 -->
        <el-tab-pane label="工作经历" name="work">
          <work-list />
        </el-tab-pane>

        <!-- 家庭成员 -->
        <el-tab-pane label="家庭成员" name="family">
          <family-list />
        </el-tab-pane>

        <!-- 年度考核 -->
        <el-tab-pane label="年度考核" name="assessment">
          <assessment-list />
        </el-tab-pane>

        <!-- 学院文件制度 -->
        <el-tab-pane label="学院文件制度" name="document">
          <document-list />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PersonnelInfo from './components/PersonnelInfo.vue'
import EducationList from './components/EducationList.vue'
import WorkList from './components/WorkList.vue'
import FamilyList from './components/FamilyList.vue'
import AssessmentList from './components/AssessmentList.vue'
import DocumentList from './components/DocumentList.vue'

const activeTab = ref('personnel')
</script>

<style lang="scss" scoped>
.hr-container {
  :deep(.el-tabs__content) {
    padding: 20px 0;
  }
}
</style>
