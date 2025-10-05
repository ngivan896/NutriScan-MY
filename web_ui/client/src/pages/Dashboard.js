import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Tag,
  Space,
  Button,
  Timeline,
  Alert,
  Spin,
} from 'antd';
import {
  DatabaseOutlined,
  RobotOutlined,
  ExperimentOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import toast from 'react-hot-toast';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({});
  const [datasets, setDatasets] = useState([]);
  const [models, setModels] = useState([]);
  const [trainingHistory, setTrainingHistory] = useState([]);

  useEffect(() => {
    loadDashboardData();
    // 每30秒刷新一次数据
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statusRes, datasetsRes, modelsRes, trainingRes] = await Promise.all([
        axios.get('/api/status'),
        axios.get('/api/datasets'),
        axios.get('/api/models'),
        axios.get('/api/training/history'),
      ]);

      setSystemStatus(statusRes.data);
      setDatasets(datasetsRes.data.local || []);
      setModels(modelsRes.data || []);
      setTrainingHistory(trainingRes.data || []);
    } catch (error) {
      console.error('加载仪表盘数据失败:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 训练性能图表数据 - 现代配色
  const trainingChartData = {
    labels: Array.isArray(trainingHistory) && trainingHistory.length > 0 
      ? trainingHistory.slice(-10).map(item => 
          new Date(item.lastModified).toLocaleDateString()
        )
      : [],
    datasets: [
      {
        label: 'mAP@0.5',
        data: Array.isArray(trainingHistory) && trainingHistory.length > 0
          ? trainingHistory.slice(-10).map(item => 
              item.results?.['metrics/mAP50(B)'] * 100 || 0
            )
          : [],
        borderColor: '#10b981', // 翠绿色
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Precision',
        data: Array.isArray(trainingHistory) && trainingHistory.length > 0
          ? trainingHistory.slice(-10).map(item => 
              item.results?.['metrics/precision(B)'] * 100 || 0
            )
          : [],
        borderColor: '#f59e0b', // 琥珀色
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // 数据集分布图表数据 - 现代配色
  const datasetChartData = {
    labels: Array.isArray(datasets) && datasets.length > 0 
      ? datasets.map(item => item.name)
      : [],
    datasets: [
      {
        label: '图像数量',
        data: Array.isArray(datasets) && datasets.length > 0
          ? datasets.map(item => item.imageCount)
          : [],
        backgroundColor: [
          '#6366f1', // 紫色
          '#10b981', // 翠绿色
          '#f59e0b', // 琥珀色
          '#ef4444', // 红色
          '#8b5cf6', // 紫罗兰色
          '#06b6d4', // 青色
          '#84cc16', // 酸橙绿
          '#f97316', // 橙色
        ],
        borderColor: [
          '#4f46e5', // 深紫色
          '#059669', // 深翠绿色
          '#d97706', // 深琥珀色
          '#dc2626', // 深红色
          '#7c3aed', // 深紫罗兰色
          '#0891b2', // 深青色
          '#65a30d', // 深酸橙绿
          '#ea580c', // 深橙色
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11
          },
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }
      }
    },
  };

  const datasetChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }
      }
    },
  };

  const recentActivities = [
    {
      color: 'green',
      children: '模型训练完成 - YOLOv8n v2.1',
      time: '2小时前',
    },
    {
      color: 'blue',
      children: '新数据集上传 - Nasi Lemak (50张)',
      time: '4小时前',
    },
    {
      color: 'orange',
      children: 'API密钥更新 - Gemini Vision',
      time: '1天前',
    },
    {
      color: 'green',
      children: '模型部署成功 - 生产环境',
      time: '2天前',
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>加载仪表盘数据...</div>
      </div>
    );
  }

  return (
    <div>
      {/* 系统状态概览 - 现代化设计 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid #475569',
              borderRadius: 16,
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
            }}
            bodyStyle={{ padding: '24px' }}
            hoverable
          >
            <Statistic
              title={<span style={{ color: '#cbd5e1', fontSize: '14px' }}>数据集总数</span>}
              value={datasets.length}
              prefix={<DatabaseOutlined style={{ color: '#10b981', fontSize: '20px' }} />}
              valueStyle={{ 
                color: '#10b981', 
                fontSize: '28px', 
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid #475569',
              borderRadius: 16,
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
            }}
            bodyStyle={{ padding: '24px' }}
            hoverable
          >
            <Statistic
              title={<span style={{ color: '#cbd5e1', fontSize: '14px' }}>模型数量</span>}
              value={models.length}
              prefix={<RobotOutlined style={{ color: '#3b82f6', fontSize: '20px' }} />}
              valueStyle={{ 
                color: '#3b82f6', 
                fontSize: '28px', 
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid #475569',
              borderRadius: 16,
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
            }}
            bodyStyle={{ padding: '24px' }}
            hoverable
          >
            <Statistic
              title={<span style={{ color: '#cbd5e1', fontSize: '14px' }}>训练次数</span>}
              value={trainingHistory.length}
              prefix={<ExperimentOutlined style={{ color: '#8b5cf6', fontSize: '20px' }} />}
              valueStyle={{ 
                color: '#8b5cf6', 
                fontSize: '28px', 
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(139, 92, 246, 0.3)'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid #475569',
              borderRadius: 16,
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
            }}
            bodyStyle={{ padding: '24px' }}
            hoverable
          >
            <Statistic
              title={<span style={{ color: '#cbd5e1', fontSize: '14px' }}>系统运行时间</span>}
              value={Math.floor(systemStatus.system?.uptime / 3600) || 0}
              suffix={<span style={{ color: '#f59e0b', fontSize: '16px' }}>小时</span>}
              prefix={<ClockCircleOutlined style={{ color: '#f59e0b', fontSize: '20px' }} />}
              valueStyle={{ 
                color: '#f59e0b', 
                fontSize: '28px', 
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(245, 158, 11, 0.3)'
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 系统状态 - 现代化设计 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ color: '#f8fafc', fontSize: '18px', fontWeight: '600' }}>系统状态</span>}
            extra={
              <Button 
                type="text" 
                icon={<SyncOutlined />} 
                onClick={loadDashboardData}
                size="small"
                style={{ color: '#6366f1' }}
              >
                刷新
              </Button>
            }
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid #475569',
              borderRadius: 16,
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1', fontSize: '14px' }}>CPU使用率</span>
                <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>
                  {(systemStatus.system?.memory?.heapUsed / systemStatus.system?.memory?.heapTotal * 100 || 0).toFixed(1)}%
                </span>
              </div>
              <Progress 
                percent={systemStatus.system?.memory?.heapUsed / systemStatus.system?.memory?.heapTotal * 100 || 0}
                size="small"
                strokeColor={{
                  '0%': '#6366f1',
                  '100%': '#8b5cf6',
                }}
                trailColor="#475569"
                style={{ marginBottom: 8 }}
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1', fontSize: '14px' }}>内存使用</span>
                <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>
                  {((systemStatus.system?.memory?.heapUsed || 0) / 1024 / 1024 / 1024).toFixed(2)}GB
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1', fontSize: '14px' }}>训练状态</span>
                <Tag 
                  color={systemStatus.services?.training?.running ? 'success' : 'default'}
                  style={{ 
                    borderRadius: 8,
                    fontWeight: '500',
                    padding: '4px 12px'
                  }}
                >
                  {systemStatus.services?.training?.running ? '运行中' : '空闲'}
                </Tag>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ color: '#f8fafc', fontSize: '18px', fontWeight: '600' }}>最近活动</span>}
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid #475569',
              borderRadius: 16,
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Timeline 
              items={recentActivities.map((item, index) => ({
                ...item,
                children: (
                  <div>
                    <div style={{ color: '#f8fafc', fontSize: '14px', marginBottom: 4 }}>
                      {item.children}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                      {item.time}
                    </div>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 - 现代化设计 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ color: '#f8fafc', fontSize: '18px', fontWeight: '600' }}>训练性能趋势</span>}
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid #475569',
              borderRadius: 16,
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            {trainingHistory.length > 0 ? (
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Line data={trainingChartData} options={chartOptions} />
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 0', 
                color: '#94a3b8',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <ExperimentOutlined style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                <div style={{ fontSize: '16px', fontWeight: '500' }}>暂无训练数据</div>
                <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.8 }}>开始您的第一个训练任务吧</div>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ color: '#f8fafc', fontSize: '18px', fontWeight: '600' }}>数据集分布</span>}
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid #475569',
              borderRadius: 16,
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            {datasets.length > 0 ? (
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Bar data={datasetChartData} options={datasetChartOptions} />
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 0', 
                color: '#94a3b8',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <DatabaseOutlined style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                <div style={{ fontSize: '16px', fontWeight: '500' }}>暂无数据集</div>
                <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.8 }}>上传您的第一个数据集开始训练</div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 快速操作 - 现代化设计 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={8}>
          <Card 
            title={<span style={{ color: '#f8fafc', fontSize: '18px', fontWeight: '600' }}>快速操作</span>}
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid #475569',
              borderRadius: 16,
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button 
                type="primary" 
                block 
                icon={<ExperimentOutlined />}
                size="large"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  border: 'none',
                  borderRadius: 12,
                  height: 48,
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                }}
              >
                开始新训练
              </Button>
              <Button 
                block 
                icon={<DatabaseOutlined />}
                size="large"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid #475569',
                  borderRadius: 12,
                  height: 48,
                  fontSize: '16px',
                  color: '#cbd5e1',
                }}
              >
                上传数据集
              </Button>
              <Button 
                block 
                icon={<RobotOutlined />}
                size="large"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid #475569',
                  borderRadius: 12,
                  height: 48,
                  fontSize: '16px',
                  color: '#cbd5e1',
                }}
              >
                测试模型
              </Button>
              <Button 
                block 
                icon={<ApiOutlined />}
                size="large"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid #475569',
                  borderRadius: 12,
                  height: 48,
                  fontSize: '16px',
                  color: '#cbd5e1',
                }}
              >
                API管理
              </Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={<span style={{ color: '#f8fafc', fontSize: '18px', fontWeight: '600' }}>最新模型</span>}
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid #475569',
              borderRadius: 16,
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            {models.length > 0 ? (
              <div>
                <div style={{ marginBottom: 16, padding: '16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ color: '#f8fafc', fontSize: '16px', fontWeight: '600', marginBottom: 8 }}>
                    {models[0].name}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: 4 }}>
                    更新时间: {new Date(models[0].lastModified).toLocaleString()}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '13px' }}>
                    大小: {(models[0].size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 0', 
                color: '#94a3b8',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <RobotOutlined style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.5 }} />
                <div style={{ fontSize: '14px', fontWeight: '500' }}>暂无模型</div>
                <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>训练完成后将显示最新模型</div>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={<span style={{ color: '#f8fafc', fontSize: '18px', fontWeight: '600' }}>系统健康</span>}
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid #475569',
              borderRadius: 16,
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ color: '#cbd5e1', fontSize: '14px' }}>API服务</span>
                <Tag 
                  color="success" 
                  icon={<CheckCircleOutlined />}
                  style={{ borderRadius: 6, fontWeight: '500' }}
                >
                  正常
                </Tag>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ color: '#cbd5e1', fontSize: '14px' }}>数据库</span>
                <Tag 
                  color="success" 
                  icon={<CheckCircleOutlined />}
                  style={{ borderRadius: 6, fontWeight: '500' }}
                >
                  正常
                </Tag>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ color: '#cbd5e1', fontSize: '14px' }}>训练服务</span>
                <Tag 
                  color="success" 
                  icon={<CheckCircleOutlined />}
                  style={{ borderRadius: 6, fontWeight: '500' }}
                >
                  正常
                </Tag>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ color: '#cbd5e1', fontSize: '14px' }}>存储空间</span>
                <Tag 
                  color="warning" 
                  icon={<ExclamationCircleOutlined />}
                  style={{ borderRadius: 6, fontWeight: '500' }}
                >
                  75%
                </Tag>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 告警信息 - 现代化设计 */}
      <Alert
        message={<span style={{ color: '#f8fafc', fontWeight: '600' }}>系统提醒</span>}
        description={<span style={{ color: '#cbd5e1' }}>检测到存储空间使用率较高，建议清理不必要的训练日志文件。</span>}
        type="warning"
        showIcon
        closable
        style={{ 
          marginBottom: 24,
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          border: '1px solid #f59e0b',
          borderRadius: 16,
          boxShadow: '0 8px 25px rgba(245, 158, 11, 0.15)',
        }}
      />
    </div>
  );
};

export default Dashboard;
