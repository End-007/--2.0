<template>
  <div class="personal-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>个人信息</span>
          </template>
          <div class="user-info">
            <el-avatar :size="100" :src="userInfo.avatar" />
            <h3>{{ userInfo.name }}</h3>
            <el-tag :type="getRoleType(userInfo.role)">{{ getRoleText(userInfo.role) }}</el-tag>
            <div class="info-list">
              <div class="info-item">
                <span class="label">用户名：</span>
                <span>{{ userInfo.username }}</span>
              </div>
              <div class="info-item">
                <span class="label">邮箱：</span>
                <span>{{ userInfo.email || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">手机：</span>
                <span>{{ userInfo.phone || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">注册时间：</span>
                <span>{{ userInfo.createdAt || '-' }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card>
          <template #header>
            <span>修改密码</span>
          </template>
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="100px"
          >
            <el-form-item label="原密码" prop="oldPassword">
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                show-password
                placeholder="请输入原密码"
              />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                show-password
                placeholder="请输入新密码"
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                show-password
                placeholder="请再次输入新密码"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleUpdatePassword">确认修改</el-button>
              <el-button @click="handleResetPassword">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card style="margin-top: 20px">
          <template #header>
            <span>操作日志</span>
          </template>
          <el-table :data="logData" border>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="operation" label="操作类型" />
            <el-table-column prop="ip" label="IP地址" />
            <el-table-column prop="time" label="操作时间" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { getUserInfo, updatePassword } from '@/api/user'

const userStore = useUserStore()
const passwordFormRef = ref(null)

const userInfo = ref({
  username: '',
  name: '',
  role: '',
  email: '',
  phone: '',
  avatar: '',
  createdAt: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const logData = ref([])

// 获取角色类型
const getRoleType = (role) => {
  const typeMap = {
    ADMIN: 'danger',
    TEACHER: 'warning',
    STUDENT: 'success'
  }
  return typeMap[role] || ''
}

// 获取角色文本
const getRoleText = (role) => {
  const textMap = {
    ADMIN: '管理员',
    TEACHER: '教师',
    STUDENT: '学生'
  }
  return textMap[role] || ''
}

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const res = await getUserInfo()
    userInfo.value = res.data
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
}

// 修改密码
const handleUpdatePassword = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await updatePassword({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
        ElMessage.success('密码修改成功，请重新登录')
        userStore.logout()
        window.location.href = '/login'
      } catch (error) {
        ElMessage.error(error.message || '密码修改失败')
      }
    }
  })
}

// 重置密码表单
const handleResetPassword = () => {
  if (!passwordFormRef.value) return
  passwordFormRef.value.resetFields()
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style lang="scss" scoped>
.personal-container {
  .user-info {
    text-align: center;

    h3 {
      margin: 20px 0 10px 0;
      font-size: 20px;
      color: #333;
    }

    .info-list {
      margin-top: 30px;
      text-align: left;

      .info-item {
        margin-bottom: 15px;
        font-size: 14px;

        .label {
          color: #909399;
          display: inline-block;
          width: 80px;
        }
      }
    }
  }
}
</style>
