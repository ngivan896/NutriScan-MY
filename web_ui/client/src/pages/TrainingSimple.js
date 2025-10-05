import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Space,
  Alert,
} from 'antd';
import {
  PlayCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const { Option } = Select;

const TrainingSimple = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const startTraining = async (values) => {
    try {
      setLoading(true);
      
      // 模拟训练开始
      console.log('开始训练:', values);
      
      // 模拟训练过程
      setTimeout(() => {
        setLoading(false);
        alert('训练已开始！');
      }, 2000);
      
    } catch (error) {
      console.error('训练失败:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="训练配置">
            <Form
              form={form}
              layout="vertical"
              onFinish={startTraining}
              initialValues={{
                dataset: 'roboflow',
                epochs: 100,
                batch_size: 16,
                learning_rate: 0.01,
                model_size: 'yolov8n',
                augmentation: true,
              }}
            >
              <Form.Item
                name="dataset"
                label="数据集"
                rules={[{ required: true, message: '请选择数据集' }]}
              >
                <Select>
                  <Option value="roboflow">Roboflow数据集</Option>
                  <Option value="local">本地数据集</Option>
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="epochs"
                    label="训练轮次"
                    rules={[{ required: true, message: '请输入训练轮次' }]}
                  >
                    <InputNumber min={1} max={1000} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="batch_size"
                    label="批次大小"
                    rules={[{ required: true, message: '请输入批次大小' }]}
                  >
                    <InputNumber min={1} max={64} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="learning_rate"
                    label="学习率"
                    rules={[{ required: true, message: '请输入学习率' }]}
                  >
                    <InputNumber 
                      min={0.0001} 
                      max={1} 
                      step={0.001}
                      style={{ width: '100%' }} 
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="model_size"
                    label="模型大小"
                    rules={[{ required: true, message: '请选择模型大小' }]}
                  >
                    <Select>
                      <Option value="yolov8n">YOLOv8 Nano (最快)</Option>
                      <Option value="yolov8s">YOLOv8 Small</Option>
                      <Option value="yolov8m">YOLOv8 Medium</Option>
                      <Option value="yolov8l">YOLOv8 Large</Option>
                      <Option value="yolov8x">YOLOv8 XLarge (最准确)</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="augmentation"
                label="数据增强"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlayCircleOutlined />}
                    loading={loading}
                    size="large"
                  >
                    开始训练
                  </Button>
                  
                  <Button
                    icon={<ReloadOutlined />}
                    size="large"
                  >
                    刷新
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="训练状态">
            <Alert
              message="训练功能"
              description="配置参数后点击开始训练，系统将自动开始模型训练过程。"
              type="info"
              showIcon
            />
            
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }}>
                🧠
              </div>
              <div style={{ color: '#8c8c8c' }}>
                准备开始训练
              </div>
              <div style={{ color: '#bfbfbf', fontSize: 12, marginTop: 8 }}>
                配置参数后点击"开始训练"
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TrainingSimple;
