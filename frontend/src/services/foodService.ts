import axios from 'axios'

// API基础URL
const API_BASE_URL = '/api'

// 分析食物接口
export const analyzeFood = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/recognize-food`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('食物分析请求失败:', error)
    throw error
  }
}

// 健康检查接口
export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`)
    return response.data
  } catch (error) {
    console.error('健康检查请求失败:', error)
    throw error
  }
} 