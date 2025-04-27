import { useState } from 'react'
import { 
  Upload, 
  Button, 
  Card, 
  Typography, 
  Spin, 
  message, 
  Space, 
  Divider, 
  List, 
  Statistic,
  Tag,
  Empty
} from 'antd'
import { 
  CameraOutlined, 
  UploadOutlined, 
  DeleteOutlined,
  FileImageOutlined
} from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { RcFile } from 'antd/es/upload'
import { analyzeFood } from '../services/foodService'

const { Title, Text, Paragraph } = Typography

interface FoodItem {
  name: string
  quantity: string | null
  calories: number
  confidence: number
  nutrients?: {
    [key: string]: number
  } | null
}

interface AnalysisResult {
  items: FoodItem[]
  total_calories: number
  meal_type: string | null
  analysis_summary: string
}

const Home = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewImage, setPreviewImage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  
  const handleBeforeUpload = (file: RcFile) => {
    // 检查文件类型
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('只能上传图片文件!')
      return false
    }
    
    // 检查文件大小 (10MB)
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      message.error('图片必须小于10MB!')
      return false
    }
    
    // 预览图片
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    
    // 保存文件到状态中
    setFileList([file])
    
    // 阻止自动上传
    return false
  }
  
  const handleRemove = () => {
    setFileList([])
    setPreviewImage('')
    setAnalysisResult(null)
  }
  
  const handleAnalyze = async () => {
    if (fileList.length === 0) {
      message.warning('请先上传食物图片!')
      return
    }
    
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', fileList[0] as any)
      
      const result = await analyzeFood(formData)
      setAnalysisResult(result)
      message.success('分析完成!')
    } catch (error) {
      console.error('分析失败:', error)
      message.error('分析失败，请重试!')
    } finally {
      setLoading(false)
    }
  }
  
  const uploadProps: UploadProps = {
    beforeUpload: handleBeforeUpload,
    onRemove: handleRemove,
    fileList,
    showUploadList: false,
    accept: 'image/*',
    multiple: false,
  }

  // 格式化置信度为百分比
  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(0)}%`
  }
  
  return (
    <div className="home-container">
      <div className="text-center mb-16">
        <Title level={2}>卡路里计算服务</Title>
        <Paragraph>
          拍摄或上传您的食物照片，我们将使用AI分析食物内容并估算卡路里
        </Paragraph>
      </div>
      
      <div className="upload-section mb-16">
        <Card className="text-center p-16">
          <Upload.Dragger {...uploadProps} className="mb-16">
            {previewImage ? (
              <div style={{ padding: '8px' }}>
                <img 
                  src={previewImage} 
                  alt="食物照片预览" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '300px', 
                    objectFit: 'contain' 
                  }} 
                />
              </div>
            ) : (
              <div style={{ padding: '32px 0' }}>
                <p className="ant-upload-drag-icon">
                  <FileImageOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text">
                  点击或拖拽图片到此区域上传
                </p>
                <p className="ant-upload-hint">
                  支持单张图片上传，请确保拍摄清晰完整
                </p>
              </div>
            )}
          </Upload.Dragger>
          
          <Space>
            <Button 
              icon={<CameraOutlined />} 
              type="primary"
              onClick={() => {
                // 模拟点击隐藏的文件输入
                const hiddenFileInput = document.querySelector('.ant-upload input[type="file"]') as HTMLElement
                hiddenFileInput?.click()
              }}
            >
              拍摄照片
            </Button>
            
            <Button 
              icon={<UploadOutlined />} 
              onClick={() => {
                const hiddenFileInput = document.querySelector('.ant-upload input[type="file"]') as HTMLElement
                hiddenFileInput?.click()
              }}
            >
              上传图片
            </Button>
            
            {fileList.length > 0 && (
              <Button 
                icon={<DeleteOutlined />} 
                onClick={handleRemove}
                danger
              >
                删除图片
              </Button>
            )}
          </Space>
          
          <Divider />
          
          <Button 
            type="primary" 
            size="large" 
            onClick={handleAnalyze}
            loading={loading}
            disabled={fileList.length === 0}
            style={{ minWidth: '200px' }}
          >
            {loading ? '正在分析...' : '开始分析'}
          </Button>
        </Card>
      </div>
      
      {/* 分析结果区域 */}
      {loading ? (
        <Card className="text-center p-16">
          <Spin tip="分析中，请稍候..." size="large">
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Paragraph>正在使用AI分析您的食物图片...</Paragraph>
            </div>
          </Spin>
        </Card>
      ) : analysisResult ? (
        <Card className="result-section p-16" title="分析结果">
          <div className="flex justify-between items-center mb-16">
            <Title level={4}>
              总热量: <span style={{ color: '#ff4d4f' }}>{analysisResult.total_calories.toFixed(1)}</span> 卡路里
            </Title>
            {analysisResult.meal_type && (
              <Tag color="blue">{analysisResult.meal_type}</Tag>
            )}
          </div>
          
          <Paragraph>{analysisResult.analysis_summary}</Paragraph>
          
          <Divider orientation="left">食物明细</Divider>
          
          <List
            itemLayout="horizontal"
            dataSource={analysisResult.items}
            renderItem={(item) => (
              <List.Item
                key={item.name}
                extra={
                  <Statistic 
                    value={item.calories} 
                    suffix="卡路里" 
                    precision={1}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                }
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Text strong>{item.name}</Text>
                      <Tag color="blue">{formatConfidence(item.confidence)}</Tag>
                    </Space>
                  }
                  description={
                    <>
                      {item.quantity && <div>数量: {item.quantity}</div>}
                      {item.nutrients && (
                        <div className="nutrients mt-16">
                          <Text type="secondary">营养素: </Text>
                          <Space wrap size={[0, 8]}>
                            {Object.entries(item.nutrients).map(([name, value]) => (
                              <Tag key={name} color="green">
                                {name}: {value}g
                              </Tag>
                            ))}
                          </Space>
                        </div>
                      )}
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      ) : (
        <Card className="p-16 text-center">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="上传食物图片后将在此显示分析结果"
          />
        </Card>
      )}
    </div>
  )
}

export default Home 