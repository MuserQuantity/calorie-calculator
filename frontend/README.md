# 卡路里计算服务前端

这是一个基于React和TypeScript的卡路里计算服务前端，提供食物图片上传和卡路里分析功能。

## 功能

- 食物图片上传/拍摄
- 调用后端API进行图像分析
- 展示食物卡路里和营养信息
- 移动端友好的UI设计

## 技术栈

- React 18
- TypeScript
- Vite
- Ant Design
- Axios

## 安装与运行

### 环境要求

- Node.js 16+
- npm 7+ 或 yarn 1.22+

### 安装步骤

1. 克隆仓库

```bash
git clone <仓库地址>
cd calorie-calculator/frontend
```

2. 安装依赖

```bash
npm install
# 或
yarn
```

3. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

应用将在 http://localhost:3000 启动。

## 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建产物将输出到 `dist` 目录。

## 预览生产版本

```bash
npm run preview
# 或
yarn preview
```

## 项目结构

```
src/
  ├── components/     # 可复用组件
  ├── pages/          # 页面组件
  ├── services/       # API服务
  ├── utils/          # 工具函数
  ├── App.tsx         # 应用入口组件
  ├── main.tsx        # 应用启动入口
  └── index.css       # 全局样式
```

## 代理配置

开发环境下，API请求会被代理到后端服务。配置位于 `vite.config.ts` 文件。默认配置为代理 `/api` 路径到 `http://localhost:8000`。 