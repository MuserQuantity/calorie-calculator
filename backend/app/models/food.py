from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class FoodItem(BaseModel):
    """食物项目模型"""
    name: str = Field(..., description="食物名称")
    quantity: Optional[str] = Field(None, description="食物数量或重量估计")
    calories: float = Field(..., description="预估卡路里")
    confidence: float = Field(..., description="识别置信度", ge=0, le=1)
    nutrients: Optional[Dict[str, float]] = Field(None, description="营养素估计（蛋白质、脂肪、碳水等）")

class FoodAnalysisResponse(BaseModel):
    """食物分析响应模型"""
    items: List[FoodItem] = Field(..., description="识别出的食物列表")
    total_calories: float = Field(..., description="总卡路里")
    meal_type: Optional[str] = Field(None, description="餐点类型（早餐、午餐、晚餐等）")
    analysis_summary: str = Field(..., description="分析概述")
    
    class Config:
        schema_extra = {
            "example": {
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
                    },
                    {
                        "name": "烤鸡胸肉",
                        "quantity": "100克",
                        "calories": 165.0,
                        "confidence": 0.85,
                        "nutrients": {
                            "蛋白质": 31.0,
                            "脂肪": 3.6,
                            "碳水化合物": 0.0
                        }
                    }
                ],
                "total_calories": 285.5,
                "meal_type": "午餐",
                "analysis_summary": "这顿饭总热量约为285.5卡路里，是一顿低热量、高蛋白的健康餐点。"
            }
        } 