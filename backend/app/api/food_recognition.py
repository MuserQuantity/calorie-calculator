from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List, Dict, Any
import os
import tempfile
from app.services.gpt_service import analyze_food_image
from app.models.food import FoodAnalysisResponse

router = APIRouter()

@router.post("/recognize-food", response_model=FoodAnalysisResponse)
async def recognize_food(
    file: UploadFile = File(...),
):
    """
    上传食物图片，使用GPT-4.1进行分析，返回食物信息和卡路里估计
    """
    # 检查文件格式
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="只接受图片文件")
    
    try:
        # 创建临时文件保存上传的图片
        suffix = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
            temp_path = temp.name
            # 写入上传的图片数据
            content = await file.read()
            temp.write(content)
        
        # 调用GPT-4.1服务分析图片
        analysis_result = await analyze_food_image(temp_path)
        
        # 删除临时文件
        os.unlink(temp_path)
        
        return analysis_result
    
    except Exception as e:
        # 删除临时文件（如果存在）
        if 'temp_path' in locals():
            os.unlink(temp_path)
        raise HTTPException(status_code=500, detail=f"分析图片时出错: {str(e)}")

@router.get("/health")
async def health_check():
    """健康检查接口"""
    return {"status": "ok"} 