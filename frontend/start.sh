#!/bin/bash

echo "正在启动卡路里计算服务前端..."

# 检查是否已安装pnpm
if ! command -v pnpm &> /dev/null; then
    echo "未检测到pnpm，正在安装..."
    # 安装pnpm
    npm install -g pnpm
fi

# 安装依赖
echo "安装依赖..."
pnpm install

# 设置默认值
PORT=${PORT:-3000}
HOST=${HOST:-localhost}

echo "前端将在 http://$HOST:$PORT 启动"

# 启动开发服务器
echo "启动开发服务器..."
pnpm run dev --host $HOST --port $PORT 