# 卡路里计算服务

基于FastAPI + Node.js + GPT-4.1的卡路里计算服务，可以通过上传食物照片识别食物并计算热量。

## 项目结构

项目由两部分组成：

- `backend`: FastAPI后端，负责接收图片并调用GPT-4.1进行分析
- `frontend`: React前端，提供用户界面，支持上传/拍摄食物照片

## 功能特点

- 食物自动识别：使用GPT-4.1视觉模型识别照片中的食物
- 卡路里估算：为识别出的食物计算卡路里值
- 营养分析：提供食物的主要营养素估计
- 移动端友好：支持在手机上直接拍照上传
- 快速响应：高效的图像处理和分析

## 安装与使用

### 运行后端

```bash
cd backend
# 安装依赖
pip install -r requirements.txt
# 配置环境变量
cp .env.example .env
# 编辑.env文件，填入你的OpenAI API密钥
# 启动服务
./start.sh
```

后端将在 http://localhost:8000 启动

### 运行前端

```bash
cd frontend
# 安装依赖
npm install
# 启动开发服务器
npm run dev
```

前端将在 http://localhost:3000 启动

## 技术栈

- **后端**:
  - FastAPI
  - Python 3.8+
  - OpenAI GPT-4.1 API

- **前端**:
  - React 18
  - TypeScript
  - Ant Design
  - Vite

## 许可证

MIT
