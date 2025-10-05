import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Switch,
  Button,
  Select,
  InputNumber,
  message,
  Alert,
  Divider,
  Space,
  Tag,
  Tabs,
} from 'antd';
import {
  SettingOutlined,
  SaveOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  DatabaseOutlined,
  CloudOutlined,
  SecurityScanOutlined,
  MonitorOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import toast from 'react-hot-toast';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    system: {
      autoBackup: true,
      logLevel: 'info',
      maxLogSize: 100,
      backupInterval: 24,
    },
    training: {
      defaultEpochs: 100,
      defaultBatchSize: 16,
      autoSave: true,
      gpuEnabled: false,
    },
    api: {
      rateLimit: 1000,
      timeout: 30,
      corsEnabled: true,
      apiKeyRequired: true,
    },
    storage: {
      maxDatasetSize: 5000,
      autoCleanup: true,
      compressionEnabled: true,
    },
  });

  const loadSettings = useCallback(async () => {
    try {
      // 模拟加载设置
      form.setFieldsValue(settings);
    } catch (error) {
      console.error('加载设置失败:', error);
      // 设置默认值
      form.setFieldsValue({
        system: {
          autoBackup: true,
          logLevel: 'info',
          maxLogSize: 100,
          backupInterval: 24,
        },
        training: {
          defaultEpochs: 100,
          defaultBatchSize: 16,
          autoSave: true,
          gpuEnabled: false,
        }
      });
    }
  }, [form, settings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const saveSettings = async (values) => {
    try {
      setLoading(true);
      
      // 模拟保存设置
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings(values);
      toast.success('设置保存成功！');
    } catch (error) {
      toast.error('保存设置失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    form.resetFields();
    toast.success('设置已重置为默认值');
  };

  const systemSettings = (
    <Form
      form={form}
      layout="vertical"
      onFinish={saveSettings}
      initialValues={settings.system}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="系统设置" size="small">
            <Form.Item
              name="autoBackup"
              label="自动备份"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="logLevel"
              label="日志级别"
            >
              <Select>
                <Option value="debug">Debug</Option>
                <Option value="info">Info</Option>
                <Option value="warn">Warning</Option>
                <Option value="error">Error</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="maxLogSize"
              label="最大日志大小 (MB)"
            >
              <InputNumber min={10} max={1000} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="backupInterval"
              label="备份间隔 (小时)"
            >
              <InputNumber min={1} max={168} style={{ width: '100%' }} />
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="训练设置" size="small">
            <Form.Item
              name="defaultEpochs"
              label="默认训练轮次"
            >
              <InputNumber min={1} max={1000} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="defaultBatchSize"
              label="默认批次大小"
            >
              <InputNumber min={1} max={64} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="autoSave"
              label="自动保存模型"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="gpuEnabled"
              label="启用GPU训练"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="API设置" size="small">
            <Form.Item
              name="rateLimit"
              label="请求频率限制 (次/分钟)"
            >
              <InputNumber min={100} max={10000} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="timeout"
              label="请求超时 (秒)"
            >
              <InputNumber min={5} max={300} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="corsEnabled"
              label="启用CORS"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="apiKeyRequired"
              label="需要API密钥"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="存储设置" size="small">
            <Form.Item
              name="maxDatasetSize"
              label="最大数据集大小 (MB)"
            >
              <InputNumber min={100} max={50000} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="autoCleanup"
              label="自动清理临时文件"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="compressionEnabled"
              label="启用压缩"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Space>
        <Button 
          type="primary" 
          htmlType="submit"
          loading={loading}
          icon={<SaveOutlined />}
        >
          保存设置
        </Button>
        
        <Button 
          onClick={resetSettings}
          icon={<ReloadOutlined />}
        >
          重置为默认
        </Button>
      </Space>
    </Form>
  );

  const aboutInfo = (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="系统信息" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>应用版本</span>
                <Tag color="blue">v1.0.0</Tag>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Node.js版本</span>
                <Tag color="green">{process.version}</Tag>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>操作系统</span>
                <Tag color="purple">{navigator.platform}</Tag>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>浏览器</span>
                <Tag color="orange">{navigator.userAgent.split(' ')[0]}</Tag>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>运行时间</span>
                <Tag color="cyan">2天 5小时</Tag>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="系统资源" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>内存使用</span>
                <Tag color="blue">2.1GB / 8GB</Tag>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>CPU使用率</span>
                <Tag color="green">15%</Tag>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>磁盘使用</span>
                <Tag color="orange">45GB / 500GB</Tag>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>网络状态</span>
                <Tag color="green">正常</Tag>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="技术栈" size="small">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>⚛️</div>
                  <div>React 18</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>前端框架</div>
                </div>
              </Col>
              
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🚀</div>
                  <div>Node.js</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>后端服务</div>
                </div>
              </Col>
              
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🤖</div>
                  <div>YOLOv8</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>AI模型</div>
                </div>
              </Col>
              
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🎨</div>
                  <div>Ant Design</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>UI组件</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const securitySettings = (
    <div>
      <Alert
        message="安全设置"
        description="配置系统安全参数和访问控制。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="访问控制" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>API访问控制</span>
                <Switch defaultChecked />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>IP白名单</span>
                <Switch />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>HTTPS强制</span>
                <Switch defaultChecked />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>API密钥验证</span>
                <Switch defaultChecked />
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="数据安全" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>数据加密</span>
                <Switch defaultChecked />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>自动备份</span>
                <Switch defaultChecked />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>日志记录</span>
                <Switch defaultChecked />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>敏感数据脱敏</span>
                <Switch />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="API密钥管理" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Gemini API Key</span>
                <Tag color="green">已配置</Tag>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Roboflow API Key</span>
                <Tag color="green">已配置</Tag>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>系统API Key</span>
                <Tag color="orange">需要更新</Tag>
              </div>
            </Space>
            
            <div style={{ marginTop: 16 }}>
              <Button type="primary" icon={<SecurityScanOutlined />}>
                更新API密钥
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <div>
      <Card title="系统设置">
        <Tabs defaultActiveKey="general">
          <TabPane 
            tab={
              <span>
                <SettingOutlined />
                常规设置
              </span>
            } 
            key="general"
          >
            {systemSettings}
          </TabPane>

          <TabPane 
            tab={
              <span>
                <SecurityScanOutlined />
                安全设置
              </span>
            } 
            key="security"
          >
            {securitySettings}
          </TabPane>

          <TabPane 
            tab={
              <span>
                <MonitorOutlined />
                系统监控
              </span>
            } 
            key="monitor"
          >
            {aboutInfo}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Settings;
