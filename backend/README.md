# 卡路里计算服务后端

这是一个基于FastAPI和GPT-4.1的食物识别和卡路里计算服务的后端部分。

## 功能

- 接收并处理食物图片
- 使用GPT-4.1进行图像识别和食物分析
- 返回估计的卡路里和营养信息

## 安装与运行

### 环境要求

- Python 3.8+
- OpenAI API密钥

### 安装步骤

1. 克隆仓库

```bash
git clone <仓库地址>
cd calorie-calculator/backend
```

2. 设置环境（使用uv）

项目使用uv管理Python环境和依赖，运行以下命令自动设置环境：

```bash
chmod +x setup_env.sh
./setup_env.sh
```

这将自动：
- 安装uv（如果尚未安装）
- 创建虚拟环境
- 安装所有依赖

如果您不想使用uv，也可以手动安装依赖：

```bash
pip install -r requirements.txt
```

3. 配置环境变量

复制`.env.example`文件为`.env`，并填入必要的环境变量：

```bash
cp .env.example .env
# 编辑.env文件，填入你的OpenAI API密钥和其他配置
```

主要环境变量说明：
- `OPENAI_API_KEY`: OpenAI API密钥
- `PORT`: 服务端口号，默认8000
- `HOST`: 服务主机，默认0.0.0.0
- `WORKERS`: uvicorn工作进程数量，默认4
- `LOG_LEVEL`: 日志级别，可选值：debug, info, warning, error, critical，默认info
- `ALLOWED_ORIGINS`: 允许的CORS源，多个源用逗号分隔

4. 启动服务

```bash
./start.sh
```

或者直接使用uvicorn：

```bash
# 激活虚拟环境（如果使用uv设置的环境）
source .venv/bin/activate

# 单进程开发模式
python -m uvicorn app.main:app --reload

# 多进程生产模式
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4 --no-reload
```

服务将在 http://localhost:8000 启动，API文档可在 http://localhost:8000/docs 访问。

## API端点

- `GET /`: 根路径，返回欢迎信息
- `GET /api/health`: 健康检查端点
- `POST /api/recognize-food`: 食物识别端点，接收图片并返回分析结果

## 使用示例

使用curl发送请求：

```bash
curl -X POST http://localhost:8000/api/recognize-food \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/food/image.jpg"
```

响应示例：

```json
{
  "items": [
    {
      "name": "沙拉",
      "quantity": "1碗",
      "calories": 120.5,
      "confidence": 0.92,
      "nutrients": {
        "蛋白质": 3.2,
        "脂肪": 5.1,
        "碳水化合物": 12.4
      }
    }
  ],
  "total_calories": 120.5,
  "meal_type": "午餐",
  "analysis_summary": "这是一顿低热量的健康餐点"
}
```

## 使用uv进行依赖管理

本项目使用[uv](https://github.com/astral-sh/uv)工具管理Python环境和依赖，相比传统的pip，uv具有以下优势：

- 更快的依赖解析和安装速度
- 更可靠的依赖锁定
- 更好的虚拟环境管理
- 与现代Python项目标准兼容

uv相关命令：

```bash
# 创建虚拟环境
uv venv .venv

# 激活虚拟环境
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate   # Windows

# 安装依赖
uv pip install -r requirements.txt

# 或者从pyproject.toml安装
uv pip install -e .

# 添加新依赖
uv pip install package_name

# 生成锁文件（精确锁定依赖版本）
uv pip freeze > requirements-lock.txt
```

## 部署建议

### Docker 部署

创建一个Dockerfile：

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# 安装uv
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.astral/bin:${PATH}"

# 复制项目文件
COPY . .

# 使用uv安装依赖
RUN uv pip install -r requirements.txt

# 运行应用
CMD ["bash", "start.sh"]
```

构建和运行容器：

```bash
docker build -t calorie-calculator-backend .
docker run -p 8000:8000 --env-file .env calorie-calculator-backend
```

### 负载均衡

在高负载情况下，可以通过以下方式提高性能：

1. 增加工作进程数（通过环境变量`WORKERS`调整）
2. 使用Nginx作为反向代理
3. 使用容器编排工具（如Kubernetes）进行水平扩展 