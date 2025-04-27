import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Typography, Button } from 'antd'
import { 
  CameraOutlined, 
  InfoCircleOutlined, 
  HomeOutlined,
  MenuOutlined,
  CloseOutlined
} from '@ant-design/icons'

const { Header, Content, Footer } = AntLayout
const { Title } = Typography

const Layout = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/about',
      icon: <InfoCircleOutlined />,
      label: <Link to="/about">关于</Link>,
    },
  ]

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1, 
        width: '100%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CameraOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '8px' }} />
          <Title level={4} style={{ margin: 0 }}>卡路里计算器</Title>
        </div>
        
        <div className="mobile-menu-button" style={{ display: 'none', '@media (max-width: 768px)': { display: 'block' } }}>
          <Button 
            type="text" 
            icon={mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />} 
            onClick={toggleMobileMenu}
          />
        </div>
        
        <div className="desktop-menu" style={{ '@media (max-width: 768px)': { display: 'none' } }}>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ minWidth: '200px', border: 'none' }}
          />
        </div>
      </Header>
      
      {mobileMenuOpen && (
        <div className="mobile-menu" style={{ 
          display: 'none', 
          '@media (max-width: 768px)': { 
            display: 'block',
            position: 'fixed',
            top: '64px',
            left: 0,
            width: '100%',
            background: '#fff',
            zIndex: 999,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          } 
        }}>
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}
      
      <Content className="container" style={{ padding: '24px 0' }}>
        <Outlet />
      </Content>
      
      <Footer style={{ textAlign: 'center', background: '#f0f2f5', padding: '12px' }}>
        卡路里计算器 ©{new Date().getFullYear()} 基于GPT-4.1技术
      </Footer>
    </AntLayout>
  )
}

export default Layout 