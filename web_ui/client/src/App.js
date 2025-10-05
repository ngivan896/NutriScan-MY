import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { Toaster } from 'react-hot-toast';

// 页面组件
import Dashboard from './pages/Dashboard';
import TrainingSimple from './pages/TrainingSimple';
import Datasets from './pages/Datasets';
import Models from './pages/Models';
import API from './pages/API';
import SettingsMinimal from './pages/SettingsMinimal';

// 布局组件
import Layout from './components/Layout';

// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h2>页面加载出错</h2>
          <p>请刷新页面重试</p>
          <button onClick={() => window.location.reload()}>
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 专业主题配置 - 现代设计风格
const customTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    // 主色调 - 现代紫色渐变
    colorPrimary: '#6366f1',
    colorPrimaryHover: '#5b5bd6',
    colorPrimaryActive: '#4f46e5',
    
    // 功能色 - 更柔和的配色
    colorSuccess: '#10b981', // 翠绿色
    colorWarning: '#f59e0b', // 琥珀色
    colorError: '#ef4444',   // 红色
    colorInfo: '#3b82f6',    // 蓝色
    
    // 背景色 - 深色专业主题
    colorBgBase: '#0f172a',        // 深蓝背景
    colorBgContainer: '#1e293b',   // 卡片背景
    colorBgElevated: '#334155',    // 悬浮背景
    colorBgLayout: '#0f172a',      // 布局背景
    
    // 文字色
    colorText: '#f8fafc',          // 主文字
    colorTextSecondary: '#cbd5e1', // 次要文字
    colorTextTertiary: '#94a3b8',  // 第三级文字
    
    // 边框和分割线
    colorBorder: '#334155',
    colorBorderSecondary: '#475569',
    
    // 圆角和阴影
    borderRadius: 12,
    borderRadiusLG: 16,
    wireframe: false,
    
    // 阴影
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    boxShadowSecondary: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
  },
  components: {
    Layout: {
      headerBg: '#1e293b',
      siderBg: '#0f172a',
      bodyBg: '#0f172a',
    },
    Menu: {
      darkItemBg: '#0f172a',
      darkItemSelectedBg: '#6366f1',
      darkItemHoverBg: '#334155',
      darkItemColor: '#cbd5e1',
      darkItemSelectedColor: '#ffffff',
    },
    Card: {
      colorBgContainer: '#1e293b',
      borderRadiusLG: 16,
      boxShadowTertiary: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    },
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Typography: {
      colorText: '#f8fafc',
      colorTextSecondary: '#cbd5e1',
    },
    Statistic: {
      colorText: '#f8fafc',
      colorTextDescription: '#cbd5e1',
    },
  },
};

function App() {
  return (
    <ConfigProvider theme={customTheme}>
      <Router>
        <ErrorBoundary>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/training" element={<TrainingSimple />} />
              <Route path="/datasets" element={<Datasets />} />
              <Route path="/models" element={<Models />} />
              <Route path="/api" element={<API />} />
              <Route path="/settings" element={<SettingsMinimal />} />
            </Routes>
          </Layout>
        </ErrorBoundary>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </Router>
    </ConfigProvider>
  );
}

export default App;
