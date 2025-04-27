#!/bin/bash

echo "正在设置Python环境（使用uv）..."

# 检查是否已安装uv
if ! command -v uv &> /dev/null; then
    echo "未检测到uv，正在安装..."
    # 安装uv (根据官方建议使用最新的安装方法)
    curl -LsSf https://astral.sh/uv/install.sh | sh

    # 添加uv到当前会话的PATH
    export PATH="$HOME/.astral/bin:$PATH"
fi

# 创建虚拟环境（如果不存在）
if [ ! -d ".venv" ]; then
    echo "创建虚拟环境..."
    uv venv .venv
fi

# 激活虚拟环境
echo "激活虚拟环境..."
source .venv/bin/activate

# 安装依赖
echo "使用uv安装依赖..."
uv pip install -r requirements.txt

echo "环境设置完成！" 