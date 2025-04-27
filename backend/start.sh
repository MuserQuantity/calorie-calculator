#!/bin/bash

# 设置并确保Python环境（使用uv）已准备好
if [ ! -f "./setup_env.sh" ]; then
    echo "找不到setup_env.sh脚本，无法设置环境"
    exit 1
fi

# 运行环境设置脚本
bash ./setup_env.sh

# 确保虚拟环境已激活
if [ -d ".venv" ]; then
    source .venv/bin/activate
else
    echo "找不到虚拟环境，请确保setup_env.sh脚本正确执行"
    exit 1
fi

# 如果.env文件不存在，从示例文件复制
if [ ! -f .env ]; then
    cp .env.example .env
    echo "已创建.env文件，请编辑它并提供必要的环境变量值"
    exit 1
fi

# 加载环境变量
export $(grep -v '^#' .env | xargs)

# 设置默认值
PORT=${PORT:-8000}
HOST=${HOST:-0.0.0.0}
WORKERS=${WORKERS:-4}
LOG_LEVEL=${LOG_LEVEL:-info}
PROD=${PROD:-false}

echo "正在启动卡路里计算服务后端..."
echo "地址: $HOST:$PORT"
echo "工作进程数: $WORKERS"
echo "日志级别: $LOG_LEVEL"
echo "生产模式: $PROD"
echo "Python环境: $(which python)"

# 根据环境决定是否启用自动重载
if [ "$PROD" = "true" ]; then
    echo "以生产模式启动，禁用自动重载"
    RELOAD_FLAG=""
else
    echo "以开发模式启动，启用自动重载"
    RELOAD_FLAG="--reload"
fi

# 使用uvicorn启动应用
python -m uvicorn app.main:app \
    --host $HOST \
    --port $PORT \
    --workers $WORKERS \
    --log-level $LOG_LEVEL \
    $RELOAD_FLAG 