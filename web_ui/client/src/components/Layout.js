import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Badge, Space } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ExperimentOutlined,
  DatabaseOutlined,
  RobotOutlined,
  ApiOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = AntLayout;

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 菜单项配置
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/training',
      icon: <ExperimentOutlined />,
      label: '模型训练',
    },
    {
      key: '/datasets',
      icon: <DatabaseOutlined />,
      label: '数据集管理',
    },
    {
      key: '/models',
      icon: <RobotOutlined />,
      label: '模型管理',
    },
    {
      key: '/api',
      icon: <ApiOutlined />,
      label: 'API管理',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }) => {
    switch (key) {
      case 'profile':
        // 处理个人资料
        break;
      case 'logout':
        // 处理退出登录
        break;
      default:
        break;
    }
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        width={250}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #001529'
        }}>
          <div style={{ 
            color: '#fff', 
            fontSize: collapsed ? 16 : 20, 
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}>
            {collapsed ? 'NS' : 'NutriScan AI'}
          </div>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      
      <AntLayout>
        <Header style={{ 
          padding: '0 24px', 
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #475569',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              style: {
                fontSize: '18px',
                lineHeight: '64px',
                cursor: 'pointer',
                transition: 'color 0.3s',
                color: '#cbd5e1',
              },
              onClick: () => setCollapsed(!collapsed),
            })}
          </div>
          
          <Space size="middle">
            <Badge count={5} size="small" color="#ef4444">
              <BellOutlined style={{ 
                fontSize: 18, 
                cursor: 'pointer',
                color: '#cbd5e1',
                transition: 'color 0.3s'
              }} />
            </Badge>
            
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />} 
                  style={{ 
                    backgroundColor: '#6366f1',
                    border: '2px solid #8b5cf6'
                  }}
                />
                <span style={{ 
                  fontSize: 14, 
                  color: '#f8fafc',
                  fontWeight: '500'
                }}>管理员</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ 
          margin: '24px 16px',
          padding: 24,
          background: 'transparent',
          minHeight: 280,
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
