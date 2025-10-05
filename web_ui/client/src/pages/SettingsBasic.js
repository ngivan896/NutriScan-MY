import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Switch,
  Button,
  Select,
  InputNumber,
  Space,
  Tabs,
  Tag,
  Alert,
} from 'antd';
import {
  SettingOutlined,
  SaveOutlined,
  MonitorOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

const SettingsBasic = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const saveSettings = async (values) => {
    try {
      setLoading(true);
      
      // 模拟保存设置
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('保存设置:', values);
      alert('设置保存成功！');
      
    } catch (error) {
      console.error('保存设置失败:', error);
      alert('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const systemSettings = (
    <div>
      <Alert
        message="系统设置"
        description="配置系统参数和训练选项。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      
      <Form
        form={form}
        layout="vertical"
        onFinish={saveSettings}
        initialValues={{
          autoBackup: true,
          logLevel: 'info',
          maxLogSize: 100,
          backupInterval: 24,
          defaultEpochs: 100,
          defaultBatchSize: 16,
          autoSave: true,
          gpuEnabled: false,
        }}
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

        <Space style={{ marginTop: 24 }}>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
          >
            保存设置
          </Button>
          
          <Button 
            onClick={() => form.resetFields()}
          >
            重置为默认
          </Button>
        </Space>
      </Form>
    </div>
  );

  const aboutInfo = (
    <div>
      <Alert
        message="系统信息"
        description="查看系统版本和资源使用情况。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      
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
                <Tag color="green">v20.19.3</Tag>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>操作系统</span>
                <Tag color="purple">{navigator.platform}</Tag>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>浏览器</span>
                <Tag color="orange">{navigator.userAgent.split(' ')[0]}</Tag>
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

export default SettingsBasic;
