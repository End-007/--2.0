<template>
  <div class="personnel-info">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="140px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="入职日期" prop="hireDate">
            <el-date-picker
              v-model="formData.hireDate"
              type="date"
              placeholder="选择入职日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="首聘期日期" prop="firstContractEnd">
            <el-date-picker
              v-model="formData.firstContractEnd"
              type="date"
              placeholder="选择首聘期日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="转正日期" prop="regularizationDate">
            <el-date-picker
              v-model="formData.regularizationDate"
              type="date"
              placeholder="选择转正日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="引进层次" prop="introLevel">
            <el-input v-model="formData.introLevel" placeholder="请输入引进层次" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="特聘层次" prop="specialLevel">
            <el-input v-model="formData.specialLevel" placeholder="请输入特聘层次" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="特聘合同日期" prop="specialContractDate">
            <el-date-picker
              v-model="formData.specialContractDate"
              type="date"
              placeholder="选择特聘合同日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="宗教信仰" prop="religion">
            <el-input v-model="formData.religion" placeholder="请输入宗教信仰" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="研究领域" prop="researchField">
            <el-input v-model="formData.researchField" placeholder="请输入研究领域" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="特聘合同文件" prop="specialContractFile">
        <el-upload
          class="upload-demo"
          action="/api/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button type="primary">点击上传</el-button>
          <template #tip>
            <div class="el-upload__tip">
              只能上传 pdf/doc/docx 文件，且不超过 10MB
            </div>
          </template>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { getPersonnelInfo, updatePersonnelInfo } from '@/api/hr'

const userStore = useUserStore()
const formRef = ref(null)
const fileList = ref([])

const formData = reactive({
  hireDate: '',
  firstContractEnd: '',
  regularizationDate: '',
  introLevel: '',
  specialLevel: '',
  specialContractDate: '',
  specialContractFile: '',
  religion: '',
  researchField: ''
})

const formRules = {
  hireDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
  firstContractEnd: [{ required: true, message: '请选择首聘期日期', trigger: 'change' }],
  regularizationDate: [{ required: true, message: '请选择转正日期', trigger: 'change' }]
}

// 获取人事信息
const fetchPersonnelInfo = async () => {
  try {
    const res = await getPersonnelInfo(userStore.userInfo?.id)
    Object.assign(formData, res.data)
    if (res.data.specialContractFile) {
      fileList.value = [{
        name: '特聘合同文件',
        url: res.data.specialContractFile
      }]
    }
  } catch (error) {
    ElMessage.error('获取人事信息失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await updatePersonnelInfo(userStore.userInfo?.id, formData)
        ElMessage.success('保存成功')
      } catch (error) {
        ElMessage.error('保存失败')
      }
    }
  })
}

// 重置表单
const handleReset = () => {
  formRef.value?.resetFields()
}

// 文件预览
const handlePreview = (file) => {
  window.open(file.url)
}

// 文件移除
const handleRemove = (file, fileList) => {
  formData.specialContractFile = ''
}

// 文件移除前确认
const beforeRemove = (file) => {
  return ElMessage.confirm(`确认移除 ${file.name}？`)
}

// 文件超出限制
const handleExceed = (files) => {
  ElMessage.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`)
}

onMounted(() => {
  fetchPersonnelInfo()
})
</script>

<style lang="scss" scoped>
.personnel-info {
  .upload-demo {
    width: 100%;
  }
}
</style>
