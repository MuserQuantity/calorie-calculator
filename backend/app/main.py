from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import food_recognition
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 获取环境变量
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
PROD = os.getenv("PROD", "false").lower() == "true"

app = FastAPI(
    title="卡路里计算服务",
    description="基于GPT-4.1的食物识别和卡路里计算服务",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(food_recognition.router, prefix="/api", tags=["食物识别"])

@app.get("/")
async def read_root():
    return {"message": "欢迎使用卡路里计算服务"}

if __name__ == "__main__":
    import uvicorn
    
    # 从环境变量获取配置
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    log_level = os.getenv("LOG_LEVEL", "info")
    
    # 根据环境变量决定是否启用自动重载
    reload = not PROD
    
    uvicorn.run("app.main:app", host=host, port=port, log_level=log_level, reload=reload) 