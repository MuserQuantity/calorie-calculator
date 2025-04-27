import { Typography, Card, Divider, Space } from 'antd'
import { RocketOutlined, ExperimentOutlined, SafetyOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const About = () => {
  return (
    <div className="about-container">
      <Card className="p-16">
        <Title level={2} className="text-center">关于卡路里计算服务</Title>
        
        <Paragraph>
          卡路里计算服务是一个基于人工智能的食物识别和热量估算应用。我们利用最先进的GPT-4.1视觉模型来分析您的食物照片，识别食物种类，并提供详细的卡路里和营养信息。
        </Paragraph>
        
        <Divider orientation="left">
          <Space>
            <RocketOutlined />
            <Text strong>核心功能</Text>
          </Space>
        </Divider>
        
        <ul>
          <li>
            <Text strong>食物识别：</Text>
            <Paragraph>
              上传食物照片，AI会自动识别照片中的所有食物种类。
            </Paragraph>
          </li>
          <li>
            <Text strong>卡路里估算：</Text>
            <Paragraph>
              为每种识别的食物提供准确的卡路里估算。
            </Paragraph>
          </li>
          <li>
            <Text strong>营养成分分析：</Text>
            <Paragraph>
              分析食物的主要营养成分，包括蛋白质、脂肪和碳水化合物。
            </Paragraph>
          </li>
          <li>
            <Text strong>摄入总结：</Text>
            <Paragraph>
              提供整体的营养摄入总结和建议。
            </Paragraph>
          </li>
        </ul>
        
        <Divider orientation="left">
          <Space>
            <ExperimentOutlined />
            <Text strong>技术实现</Text>
          </Space>
        </Divider>
        
        <Paragraph>
          本服务使用前沿的技术栈构建：
        </Paragraph>
        
        <ul>
          <li>前端：基于React、TypeScript和Ant Design的现代化移动端友好界面</li>
          <li>后端：使用FastAPI构建的高性能Python后端</li>
          <li>AI模型：集成OpenAI的GPT-4.1视觉模型进行图像识别和分析</li>
        </ul>
        
        <Divider orientation="left">
          <Space>
            <SafetyOutlined />
            <Text strong>隐私保护</Text>
          </Space>
        </Divider>
        
        <Paragraph>
          我们高度重视用户隐私：
        </Paragraph>
        
        <ul>
          <li>所有上传的图片仅用于分析目的，不会永久存储</li>
          <li>分析完成后，图片会立即从服务器删除</li>
          <li>不收集任何个人身份信息</li>
          <li>不与第三方共享用户数据</li>
        </ul>
        
        <Divider />
        
        <Paragraph className="text-center" type="secondary">
          © {new Date().getFullYear()} 卡路里计算服务 | 本服务仅供参考，不应作为医疗或专业营养建议
        </Paragraph>
      </Card>
    </div>
  )
}

export default About 