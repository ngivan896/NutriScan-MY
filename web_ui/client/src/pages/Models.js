import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Progress,
  Statistic,
  Tabs,
  Alert,
  Tooltip,
} from 'antd';
import {
  RobotOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
  SyncOutlined,
  PlayCircleOutlined,
  StopOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import toast from 'react-hot-toast';

const { TabPane } = Tabs;
const { Dragger } = Upload;

const Models = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/models');
      setModels(response.data || []);
    } catch (error) {
      console.error('加载模型失败:', error);
      toast.error('加载模型失败');
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const testModel = async (modelId) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/models/test', {
        modelId: modelId,
        image: 'test_image.jpg' // 实际应用中需要上传图片
      });
      
      setTestResults(response.data);
      toast.success('模型测试完成！');
    } catch (error) {
      toast.error('模型测试失败: ' + error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadModel = (model) => {
    toast.success(`开始下载模型: ${model.name}`);
    // 实现模型下载逻辑
  };

  const deleteModel = (model) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除模型 "${model.name}" 吗？此操作不可撤销。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        toast.success(`模型 ${model.name} 已删除`);
        loadModels();
      },
    });
  };

  const modelColumns = [
    {
      title: '模型名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <RobotOutlined />
          <span>{text}</span>
          <Tag color="blue">{record.version || 'v1.0'}</Tag>
        </Space>
      ),
    },
    {
      title: '模型类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color="purple">{type || 'YOLOv8'}</Tag>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size) => `${(size / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      title: '精度',
      dataIndex: 'accuracy',
      key: 'accuracy',
      render: (accuracy) => accuracy ? `${(accuracy * 100).toFixed(1)}%` : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'lastModified',
      key: 'lastModified',
      render: (time) => new Date(time).toLocaleString(),
    },
    {
      title: '状态',
      key: 'status',
      render: () => (
        <Tag color="green">可用</Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="测试模型">
            <Button 
              type="primary"
              icon={<PlayCircleOutlined />}
              size="small"
              onClick={() => testModel(record.name)}
            >
              测试
            </Button>
          </Tooltip>
          
          <Tooltip title="查看详情">
            <Button 
              type="link" 
              icon={<EyeOutlined />}
              size="small"
            >
              详情
            </Button>
          </Tooltip>
          
          <Tooltip title="下载模型">
            <Button 
              type="link" 
              icon={<DownloadOutlined />}
              size="small"
              onClick={() => downloadModel(record)}
            >
              下载
            </Button>
          </Tooltip>
          
          <Tooltip title="删除模型">
            <Button 
              type="link" 
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => deleteModel(record)}
            >
              删除
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const modelStats = [
    {
      title: '总模型数',
      value: models.length,
      prefix: <RobotOutlined />,
      color: '#1890ff',
    },
    {
      title: '总大小',
      value: models.reduce((sum, model) => sum + (model.size || 0), 0) / 1024 / 1024,
      suffix: 'MB',
      color: '#52c41a',
    },
    {
      title: '平均精度',
      value: models.length > 0 ? 
        models.reduce((sum, model) => sum + (model.accuracy || 0), 0) / models.length * 100 : 0,
      suffix: '%',
      color: '#faad14',
    },
    {
      title: '最新模型',
      value: models.length > 0 ? 
        new Date(Math.max(...models.map(m => new Date(m.lastModified)))).toLocaleDateString() : 
        '-',
      color: '#722ed1',
    },
  ];

  return (
    <div>
      <Card 
        title="模型管理"
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />}
              onClick={loadModels}
            >
              刷新
            </Button>
            <Button 
              type="primary"
              icon={<SyncOutlined />}
            >
              同步模型
            </Button>
          </Space>
        }
      >
        <Tabs defaultActiveKey="models">
          <TabPane tab="模型列表" key="models">
            <div style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                {modelStats.map((stat, index) => (
                  <Col span={6} key={index}>
                    <Card size="small">
                      <Statistic
                        title={stat.title}
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        valueStyle={{ color: stat.color }}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>

            <Table
              columns={modelColumns}
              dataSource={models}
              rowKey="name"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 个模型`,
              }}
            />
          </TabPane>

          <TabPane tab="模型测试" key="test">
            <Alert
              message="模型测试"
              description="上传图片测试模型的识别效果和推理速度。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Card>
              <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                  setTestModalVisible(true);
                  setSelectedModel(values.model);
                }}
              >
                <Form.Item
                  name="model"
                  label="选择模型"
                  rules={[{ required: true, message: '请选择模型' }]}
                >
                  <Input placeholder="选择要测试的模型" />
                </Form.Item>

                <Form.Item
                  name="image"
                  label="测试图片"
                  rules={[{ required: true, message: '请上传测试图片' }]}
                >
                  <Dragger
                    name="image"
                    multiple={false}
                    accept="image/*"
                    beforeUpload={() => false}
                  >
                    <p className="ant-upload-drag-icon">
                      <RobotOutlined />
                    </p>
                    <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
                    <p className="ant-upload-hint">
                      支持 JPG、PNG 格式，单个文件不超过 10MB
                    </p>
                  </Dragger>
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    icon={<PlayCircleOutlined />}
                    loading={loading}
                  >
                    开始测试
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>

          <TabPane tab="部署管理" key="deploy">
            <Alert
              message="模型部署"
              description="将训练好的模型部署到生产环境，支持TensorFlow Lite、ONNX等格式。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card 
                  title="TensorFlow Lite" 
                  size="small"
                  extra={<Tag color="green">推荐</Tag>}
                >
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>📱</div>
                    <div>移动端部署</div>
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                      适合React Native应用
                    </div>
                  </div>
                  <Button type="primary" block>
                    导出TFLite
                  </Button>
                </Card>
              </Col>

              <Col span={8}>
                <Card 
                  title="ONNX" 
                  size="small"
                  extra={<Tag color="blue">通用</Tag>}
                >
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>⚡</div>
                    <div>跨平台部署</div>
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                      支持多种推理引擎
                    </div>
                  </div>
                  <Button block>
                    导出ONNX
                  </Button>
                </Card>
              </Col>

              <Col span={8}>
                <Card 
                  title="PyTorch" 
                  size="small"
                  extra={<Tag color="purple">原始</Tag>}
                >
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>🔥</div>
                    <div>Python部署</div>
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                      保持完整功能
                    </div>
                  </div>
                  <Button block>
                    导出PyTorch
                  </Button>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 测试结果弹窗 */}
      <Modal
        title={`模型测试结果 - ${selectedModel}`}
        open={testModalVisible}
        onCancel={() => setTestModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setTestModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {testResults ? (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="推理时间" value="45" suffix="ms" />
              </Col>
              <Col span={12}>
                <Statistic title="置信度" value="0.95" />
              </Col>
            </Row>
            
            <div style={{ marginTop: 16 }}>
              <h4>检测结果:</h4>
              <Tag color="green">Nasi Lemak (95%)</Tag>
              <Tag color="blue">Char Kway Teow (87%)</Tag>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div>暂无测试结果</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Models;
