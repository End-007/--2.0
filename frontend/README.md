# 学管平台前端

学管平台前端项目，基于 Vue 3 + Element Plus + Vite 构建。

## 技术栈

- Vue 3.x
- Element Plus
- Vite
- Vue Router
- Pinia
- Axios
- ECharts
- Sass

## 项目结构

```
frontend/
├── public/              # 静态资源
├── src/
│   ├── api/            # API 接口
│   ├── assets/         # 资源文件
│   ├── components/     # 公共组件
│   ├── layout/         # 布局组件
│   ├── router/         # 路由配置
│   ├── store/          # 状态管理
│   ├── styles/         # 全局样式
│   ├── utils/          # 工具函数
│   ├── views/          # 页面组件
│   │   ├── dashboard/   # 数据大屏
│   │   ├── hr/         # 人事档案
│   │   ├── login/      # 登录页
│   │   ├── personal/   # 个人中心
│   │   ├── research/   # 科研管理
│   │   └── statistics/ # 统计查询
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── index.html          # HTML 模板
├── package.json        # 项目依赖
└── vite.config.js      # Vite 配置
```

## 功能模块

### 1. 数据大屏
- 教学情况展示
- 科研情况展示
- 学习情况展示
- 整体概况展示
- 数据筛选和导出

### 2. 统计查询
- 数据统计功能
- 数据查询功能
- 数据导出功能

### 3. 个人中心
- 个人信息展示
- 密码修改
- 操作日志

### 4. 科研管理
- 竞赛获奖管理
- 大创项目管理
- 论文发表管理
- 科研项目管理
- 教研/科研奖励管理

### 5. 人事档案
- 人事信息管理
- 学习经历管理
- 工作经历管理
- 家庭成员管理
- 年度考核管理
- 学院文件制度管理

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 生产环境构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 配置说明

### API 接口配置

在 `vite.config.js` 中配置 API 代理：

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 环境变量

创建 `.env.development` 和 `.env.production` 文件配置不同环境的变量：

```env
# .env.development
VITE_API_BASE_URL=http://localhost:8080
```

```env
# .env.production
VITE_API_BASE_URL=https://api.example.com
```

## 开发规范

### 组件命名

- 组件文件名使用 PascalCase
- 组件名使用多个单词，避免与 HTML 标签冲突

### 代码风格

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化

### Git 提交规范

提交信息格式：`type: subject`

- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- test: 测试相关
- chore: 构建/工具相关

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT
