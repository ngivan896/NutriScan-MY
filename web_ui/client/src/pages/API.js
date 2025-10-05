import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Switch,
  Statistic,
  Table,
  Tag,
  Space,
  Modal,
  message,
  Alert,
  Tabs,
  Progress,
  Tooltip,
} from 'antd';
import {
  ApiOutlined,
  KeyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import toast from 'react-hot-toast';

const { TextArea } = Input;
const { TabPane } = Tabs;

const API = () => {
  const [geminiConfig, setGeminiConfig] = useState({
    apiKey: '',
    enabled: false,
    status: 'disconnected',
  });
  const [apiStats, setApiStats] = useState({
    totalRequests: 0,
    successRate: 0,
    avgResponseTime: 0,
    errorCount: 0,
  });
  const [apiLogs, setApiLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadAPIConfig();
    loadAPIStats();
    loadAPILogs();
  }, []);

  const loadAPIConfig = async () => {
    try {
      // 从服务器获取API配置
      const response = await axios.get('/api/config');
      setGeminiConfig(response.data.gemini || {
        apiKey: '',
        enabled: false,
        status: 'disconnected',
      });
    } catch (error) {
      console.error('加载API配置失败:', error);
      setGeminiConfig({
        apiKey: '',
        enabled: false,
        status: 'error',
      });
    }
  };

  const loadAPIStats = async () => {
    try {
      // 从服务器获取API统计
      const response = await axios.get('/api/stats');
      setApiStats(response.data || {
        totalRequests: 0,
        successRate: 0,
        avgResponseTime: 0,
        errorCount: 0,
      });
    } catch (error) {
      console.error('加载API统计失败:', error);
      setApiStats({
        totalRequests: 0,
        successRate: 0,
        avgResponseTime: 0,
        errorCount: 0,
      });
    }
  };

  const loadAPILogs = async () => {
    try {
      // 从服务器获取API日志
      const response = await axios.get('/api/logs');
      setApiLogs(response.data || []);
    } catch (error) {
      console.error('加载API日志失败:', error);
      setApiLogs([]);
    }
  };

  const saveGeminiConfig = async (values) => {
    try {
      setLoading(true);
      
      await axios.post('/api/gemini/config', {
        apiKey: values.apiKey,
      });
      
      toast.success('Gemini API配置保存成功！');
      
      // 测试连接
      const testResult = await testGeminiConnection(values.apiKey);
      setGeminiConfig({
        apiKey: values.apiKey,
        enabled: true,
        status: testResult.connected ? 'connected' : 'error',
      });
      
    } catch (error) {
      toast.error('配置保存失败: ' + error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const testGeminiConnection = async (apiKey) => {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return { connected: true, models: data.models?.length || 0 };
      } else {
        return { connected: false, error: 'Invalid API key' };
      }
    } catch (error) {
      return { connected: false, error: error.message };
    }
  };

  const testAPI = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post('/api/test', {
        test: 'nutrition_analysis',
        image: 'sample_food.jpg'
      });
      
      toast.success('API测试成功！');
      
    } catch (error) {
      toast.error('API测试失败: ' + error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const apiLogColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (time) => new Date(time).toLocaleString(),
      width: 150,
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      render: (method) => (
        <Tag color={method === 'POST' ? 'blue' : 'green'}>
          {method}
        </Tag>
      ),
      width: 80,
    },
    {
      title: '端点',
      dataIndex: 'endpoint',
      key: 'endpoint',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status >= 200 && status < 300 ? 'green' :
          status >= 400 && status < 500 ? 'orange' : 'red'
        }>
          {status}
        </Tag>
      ),
      width: 80,
    },
    {
      title: '响应时间',
      dataIndex: 'responseTime',
      key: 'responseTime',
      render: (time) => time > 0 ? `${time}ms` : '-',
      width: 100,
    },
    {
      title: '用户代理',
      dataIndex: 'userAgent',
      key: 'userAgent',
      ellipsis: true,
    },
  ];

  const apiStatsCards = [
    {
      title: '总请求数',
      value: apiStats.totalRequests,
      prefix: <ApiOutlined />,
      color: '#1890ff',
    },
    {
      title: '成功率',
      value: apiStats.successRate,
      suffix: '%',
      prefix: <CheckCircleOutlined />,
      color: '#52c41a',
    },
    {
      title: '平均响应时间',
      value: apiStats.avgResponseTime,
      suffix: 'ms',
      prefix: <ThunderboltOutlined />,
      color: '#faad14',
    },
    {
      title: '错误数',
      value: apiStats.errorCount,
      prefix: <ExclamationCircleOutlined />,
      color: '#ff4d4f',
    },
  ];

  return (
    <div>
      <Card title="API管理" style={{ marginBottom: 24 }}>
        <Tabs defaultActiveKey="config">
          <TabPane tab="API配置" key="config">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="Gemini Vision API" size="small">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={saveGeminiConfig}
                    initialValues={{
                      apiKey: geminiConfig.apiKey,
                    }}
                  >
                    <Form.Item
                      name="apiKey"
                      label="API密钥"
                      rules={[{ required: true, message: '请输入API密钥' }]}
                    >
                      <Input.Password
                        placeholder="输入Gemini Vision API密钥"
                        iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                      />
                    </Form.Item>

                    <Form.Item>
                      <Space>
                        <Button 
                          type="primary" 
                          htmlType="submit"
                          loading={loading}
                          icon={<KeyOutlined />}
                        >
                          保存配置
                        </Button>
                        
                        <Button 
                          onClick={testAPI}
                          loading={loading}
                          icon={<SyncOutlined />}
                        >
                          测试连接
                        </Button>
                      </Space>
                    </Form.Item>
                  </Form>

                  <div style={{ marginTop: 16 }}>
                    <Alert
                      message="API状态"
                      description={
                        <div>
                          <div>状态: 
                            <Tag color={geminiConfig.status === 'connected' ? 'green' : 'red'}>
                              {geminiConfig.status === 'connected' ? '已连接' : '未连接'}
                            </Tag>
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <Progress 
                              percent={geminiConfig.status === 'connected' ? 100 : 0} 
                              size="small"
                              status={geminiConfig.status === 'connected' ? 'success' : 'exception'}
                            />
                          </div>
                        </div>
                      }
                      type={geminiConfig.status === 'connected' ? 'success' : 'error'}
                      showIcon
                    />
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="API统计" size="small">
                  <Row gutter={16}>
                    {apiStatsCards.map((stat, index) => (
                      <Col span={12} key={index} style={{ marginBottom: 16 }}>
                        <Statistic
                          title={stat.title}
                          value={stat.value}
                          prefix={stat.prefix}
                          suffix={stat.suffix}
                          valueStyle={{ color: stat.color, fontSize: 20 }}
                        />
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="API监控" key="monitor">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card 
                  title="API日志" 
                  extra={
                    <Button 
                      icon={<SyncOutlined />} 
                      onClick={loadAPILogs}
                      size="small"
                    >
                      刷新
                    </Button>
                  }
                >
                  <Table
                    columns={apiLogColumns}
                    dataSource={apiLogs}
                    rowKey="id"
                    size="small"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total) => `共 ${total} 条记录`,
                    }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="API文档" key="docs">
            <Alert
              message="API文档"
              description="NutriScan AI API接口文档和使用说明。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="营养分析API" size="small">
                  <div style={{ marginBottom: 16 }}>
                    <Tag color="blue">POST</Tag>
                    <code>/api/nutrition/analyze</code>
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <h4>请求参数:</h4>
                    <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
{`{
  "image": "base64_encoded_image",
  "options": {
    "include_calories": true,
    "include_nutrients": true
  }
}`}
                    </pre>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <h4>响应示例:</h4>
                    <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
{`{
  "success": true,
  "data": {
    "food_name": "Nasi Lemak",
    "confidence": 0.95,
    "nutrition": {
      "calories": 350,
      "protein": 12,
      "carbs": 45,
      "fat": 15
    }
  }
}`}
                    </pre>
                  </div>

                  <Button type="primary" icon={<ApiOutlined />}>
                    测试API
                  </Button>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="模型推理API" size="small">
                  <div style={{ marginBottom: 16 }}>
                    <Tag color="green">POST</Tag>
                    <code>/api/model/predict</code>
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <h4>请求参数:</h4>
                    <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
{`{
  "image": "base64_encoded_image",
  "model_id": "nutriscan_v1",
  "confidence_threshold": 0.5
}`}
                    </pre>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <h4>响应示例:</h4>
                    <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
{`{
  "success": true,
  "predictions": [
    {
      "class": "nasi_lemak",
      "confidence": 0.95,
      "bbox": [100, 150, 200, 250]
    }
  ]
}`}
                    </pre>
                  </div>

                  <Button type="primary" icon={<RobotOutlined />}>
                    测试推理
                  </Button>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="使用限制" key="limits">
            <Alert
              message="API使用限制"
              description="了解API的调用限制和计费规则。"
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Row gutter={[24, 24]}>
              <Col xs={24} lg={8}>
                <Card title="免费额度" size="small">
                  <Statistic
                    title="每月请求数"
                    value="1000"
                    suffix="次"
                    prefix={<DatabaseOutlined />}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Progress percent={25} status="active" />
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                      已使用 250/1000 次
                    </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card title="响应时间" size="small">
                  <Statistic
                    title="平均延迟"
                    value="245"
                    suffix="ms"
                    prefix={<ThunderboltOutlined />}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Tag color="green">正常</Tag>
                  <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                    目标: &lt; 500ms
                  </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card title="错误率" size="small">
                  <Statistic
                    title="成功率"
                    value="98.5"
                    suffix="%"
                    prefix={<CheckCircleOutlined />}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Tag color="green">优秀</Tag>
                  <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                    目标: &gt; 95%
                  </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default API;
