import os
import base64
import aiohttp
import json
import re
from typing import Dict, Any, List
from dotenv import load_dotenv
from app.models.food import FoodAnalysisResponse, FoodItem


# 加载环境变量
load_dotenv()

# 从环境变量获取API密钥
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
API_URL = os.getenv("OPENAI_API_URL", "https://api.openai.com/v1/chat/completions")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "2000"))

async def analyze_food_image(image_path: str) -> FoodAnalysisResponse:
    """
    使用GPT-4.1分析食物图片，返回食物信息和卡路里估计
    
    Args:
        image_path: 图片文件的路径
        
    Returns:
        FoodAnalysisResponse: 食物分析结果
    """
    if not OPENAI_API_KEY:
        raise ValueError("未设置OPENAI_API_KEY环境变量")
    
    # 将图片转换为base64
    with open(image_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    # 准备请求头
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }
    
    # 准备请求体
    payload = {
        "model": OPENAI_MODEL,  # 使用支持图像识别的模型
        "messages": [
            {
                "role": "system",
                "content": "你是一个专业的食物卡路里分析专家。请分析图片中的食物，识别出每种食物，并估计它们的卡路里值和主要营养素。返回的格式应包括：食物名称、数量估计、卡路里估计、识别置信度、营养素估计（蛋白质、脂肪、碳水等）。最后给出总卡路里和简短的总结。"
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "请分析这张食物图片，告诉我图中所有食物的名称、大致数量和热量估计。"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": MAX_TOKENS
    }
    
    # 发送请求
    async with aiohttp.ClientSession() as session:
        async with session.post(API_URL, headers=headers, json=payload) as response:
            if response.status != 200:
                error_text = await response.text()
                raise Exception(f"API请求失败: {response.status} - {error_text}")
            
            response_data = await response.json()
    
    # 处理响应
    try:
        gpt_response = response_data["choices"][0]["message"]["content"]
        print(gpt_response)
        # 尝试解析GPT返回的JSON，如果不是标准JSON格式，则进行处理
        try:
            # 尝试直接解析完整JSON
            analysis_data = json.loads(gpt_response)
        except json.JSONDecodeError:
            # 尝试从文本中提取JSON部分
            json_match = re.search(r'```json\n([\s\S]*?)\n```', gpt_response)
            if json_match:
                json_str = json_match.group(1)
                analysis_data = json.loads(json_str)
            else:
                # 如果没有JSON格式的响应，则进行自定义解析
                analysis_data = parse_gpt_response(gpt_response)
        
        # 构造FoodAnalysisResponse对象
        food_items = []
        total_calories = 0
        
        for item in analysis_data.get("items", []):
            food_item = FoodItem(
                name=item.get("name", "未知食物"),
                quantity=item.get("quantity"),
                calories=item.get("calories", 0),
                confidence=item.get("confidence", 0.5),
                nutrients=item.get("nutrients")
            )
            food_items.append(food_item)
            total_calories += food_item.calories
        
        return FoodAnalysisResponse(
            items=food_items,
            total_calories=total_calories,
            meal_type=analysis_data.get("meal_type"),
            analysis_summary=analysis_data.get("analysis_summary", "无法提供分析概述")
        )
    
    except Exception as e:
        raise Exception(f"处理GPT响应时出错: {str(e)}\n原始响应: {gpt_response}")

def parse_gpt_response(response_text: str) -> Dict[str, Any]:
    """
    解析非标准JSON格式的GPT响应
    
    Args:
        response_text: GPT返回的文本
        
    Returns:
        Dict: 解析后的数据
    """
    # 这是一个简单的实现，实际应用中可能需要更复杂的解析逻辑
    lines = response_text.strip().split("\n")
    
    items = []
    current_item = {}
    meal_type = None
    analysis_summary = ""
    total_calories = 0
    
    for line in lines:
        line = line.strip()
        
        # 检测食物名称
        if ":" in line and not line.startswith("-") and not "总卡路里" in line:
            parts = line.split(":")
            if len(parts) >= 2:
                # 可能是新的食物项
                if current_item and "name" in current_item:
                    items.append(current_item)
                    current_item = {}
                
                current_item["name"] = parts[0].strip()
                
                # 尝试从剩余文本提取卡路里
                cal_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:卡路里|千卡|kcal)', line)
                if cal_match:
                    current_item["calories"] = float(cal_match.group(1))
                
                # 设置默认值
                current_item["confidence"] = 0.7
                
        # 检测数量
        elif "数量" in line or "份量" in line or "重量" in line:
            quantity_match = re.search(r'(?:数量|份量|重量)[：:]\s*(.+)', line)
            if quantity_match and current_item:
                current_item["quantity"] = quantity_match.group(1)
        
        # 检测卡路里（如果之前没提取到）
        elif "卡路里" in line or "热量" in line:
            cal_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:卡路里|千卡|kcal)', line)
            if cal_match and current_item and "calories" not in current_item:
                current_item["calories"] = float(cal_match.group(1))
        
        # 检测总卡路里
        elif "总卡路里" in line or "总热量" in line:
            total_match = re.search(r'(\d+(?:\.\d+)?)', line)
            if total_match:
                total_calories = float(total_match.group(1))
        
        # 检测餐点类型
        elif "餐点类型" in line or "餐点" in line:
            meal_match = re.search(r'(?:餐点类型|餐点)[：:]\s*(.+)', line)
            if meal_match:
                meal_type = meal_match.group(1)
        
        # 收集分析概述
        elif "分析" in line or "总结" in line or "概述" in line:
            summary_match = re.search(r'(?:分析|总结|概述)[：:]\s*(.+)', line)
            if summary_match:
                analysis_summary = summary_match.group(1)
    
    # 添加最后一个食物项
    if current_item and "name" in current_item:
        items.append(current_item)
    
    # 如果没有提取到总卡路里，则计算所有食物卡路里的总和
    if total_calories == 0:
        for item in items:
            total_calories += item.get("calories", 0)
    
    return {
        "items": items,
        "total_calories": total_calories,
        "meal_type": meal_type,
        "analysis_summary": analysis_summary
    } 