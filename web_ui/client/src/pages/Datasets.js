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
  Select,
  Upload,
  message,
  Progress,
  Statistic,
  Tabs,
  Alert,
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  SyncOutlined,
  DownloadOutlined,
  DatabaseOutlined,
  CloudSyncOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import toast from 'react-hot-toast';

const { Option } = Select;
const { TabPane } = Tabs;
const { Dragger } = Upload;

const Datasets = () => {
  const [localDatasets, setLocalDatasets] = useState([]);
  const [roboflowDatasets, setRoboflowDatasets] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [roboflowModalVisible, setRoboflowModalVisible] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [form] = Form.useForm();
  const [roboflowForm] = Form.useForm();

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/datasets');
      setLocalDatasets(response.data.local || []);
      setRoboflowDatasets(response.data.roboflow || {});
    } catch (error) {
      console.error('加载数据集失败:', error);
      toast.error('加载数据集失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (values) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('category', values.category);
      
      // 这里需要处理文件上传逻辑
      // 实际实现中需要从Upload组件获取文件
      
      await axios.post('/api/datasets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('数据集上传成功！');
      setUploadModalVisible(false);
      form.resetFields();
      loadDatasets();
    } catch (error) {
      toast.error('上传失败: ' + error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const syncRoboflowDataset = async (values) => {
    try {
      setSyncLoading(true);
      
      await axios.post('/api/datasets/roboflow/sync', {
        apiKey: values.apiKey,
        projectId: values.projectId,
        version: values.version,
      });
      
      toast.success('Roboflow数据集同步成功！');
      setRoboflowModalVisible(false);
      roboflowForm.resetFields();
      loadDatasets();
    } catch (error) {
      toast.error('同步失败: ' + error.response?.data?.error || error.message);
    } finally {
      setSyncLoading(false);
    }
  };

  const localDatasetColumns = [
    {
      title: '数据集名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <DatabaseOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '图像数量',
      dataIndex: 'imageCount',
      key: 'imageCount',
      render: (count) => (
        <Tag color="blue">{count} 张</Tag>
      ),
    },
    {
      title: '最后修改',
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
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            size="small"
          >
            预览
          </Button>
          <Button 
            type="link" 
            icon={<DownloadOutlined />}
            size="small"
          >
            下载
          </Button>
          <Button 
            type="link" 
            danger
            icon={<DeleteOutlined />}
            size="small"
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const roboflowColumns = [
    {
      title: '项目ID',
      dataIndex: 'project',
      key: 'project',
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (version) => (
        <Tag color="purple">v{version}</Tag>
      ),
    },
    {
      title: '连接状态',
      key: 'connected',
      render: (_, record) => (
        <Tag color={record.connected ? 'green' : 'red'}>
          {record.connected ? '已连接' : '未连接'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<SyncOutlined />}
            size="small"
            disabled={!record.connected}
          >
            同步
          </Button>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            size="small"
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  const uploadProps = {
    name: 'images',
    multiple: true,
    accept: 'image/*',
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件!');
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('图片大小不能超过 10MB!');
      }
      return false; // 阻止自动上传
    },
  };

  return (
    <div>
      <Card 
        title="数据集管理"
        extra={
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setUploadModalVisible(true)}
            >
              上传数据集
            </Button>
            <Button 
              icon={<CloudSyncOutlined />}
              onClick={() => setRoboflowModalVisible(true)}
            >
              同步Roboflow
            </Button>
            <Button 
              icon={<SyncOutlined />}
              onClick={loadDatasets}
            >
              刷新
            </Button>
          </Space>
        }
      >
        <Tabs defaultActiveKey="local">
          <TabPane tab="本地数据集" key="local">
            <div style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic 
                    title="总数据集" 
                    value={localDatasets.length} 
                    prefix={<DatabaseOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic 
                    title="总图像数" 
                    value={localDatasets.reduce((sum, item) => sum + item.imageCount, 0)}
                    suffix="张"
                  />
                </Col>
                <Col span={6}>
                  <Statistic 
                    title="存储使用" 
                    value="2.5" 
                    suffix="GB"
                  />
                </Col>
                <Col span={6}>
                  <Statistic 
                    title="最后更新" 
                    value={localDatasets.length > 0 ? 
                      new Date(Math.max(...localDatasets.map(d => new Date(d.lastModified)))).toLocaleDateString() : 
                      '-'
                    }
                  />
                </Col>
              </Row>
            </div>

            <Table
              columns={localDatasetColumns}
              dataSource={localDatasets}
              rowKey="name"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 个数据集`,
              }}
            />
          </TabPane>

          <TabPane tab="Roboflow数据集" key="roboflow">
            <Alert
              message="Roboflow集成"
              description="从Roboflow平台同步标注好的数据集，支持自动下载和版本管理。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Table
              columns={roboflowColumns}
              dataSource={[roboflowDatasets]}
              rowKey="project"
              loading={loading}
              pagination={false}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 上传数据集弹窗 */}
      <Modal
        title="上传数据集"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpload}
        >
          <Form.Item
            name="category"
            label="食物类别"
            rules={[{ required: true, message: '请选择食物类别' }]}
          >
            <Select placeholder="选择食物类别">
              <Option value="nasi_lemak">椰浆饭</Option>
              <Option value="char_kway_teow">炒粿条</Option>
              <Option value="wantan_mee">云吞面</Option>
              <Option value="chee_cheong_fun">猪肠粉</Option>
              <Option value="bak_kut_teh">肉骨茶</Option>
              <Option value="satay">沙爹</Option>
              <Option value="roti_canai">印度煎饼</Option>
              <Option value="curry_laksa">咖喱叻沙</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="images"
            label="上传图片"
            rules={[{ required: true, message: '请上传图片' }]}
          >
            <Dragger {...uploadProps} style={{ padding: 20 }}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
              <p className="ant-upload-hint">
                支持单个或批量上传。支持 JPG、PNG 格式，单个文件不超过 10MB
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                开始上传
              </Button>
              <Button onClick={() => setUploadModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Roboflow同步弹窗 */}
      <Modal
        title="同步Roboflow数据集"
        open={roboflowModalVisible}
        onCancel={() => setRoboflowModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={roboflowForm}
          layout="vertical"
          onFinish={syncRoboflowDataset}
          initialValues={{
            projectId: 'malaysian-food-detection-wy3kt',
            version: 'latest',
          }}
        >
          <Form.Item
            name="apiKey"
            label="Roboflow API Key"
            rules={[{ required: true, message: '请输入API Key' }]}
          >
            <Input.Password placeholder="输入你的Roboflow API Key" />
          </Form.Item>

          <Form.Item
            name="projectId"
            label="项目ID"
            rules={[{ required: true, message: '请输入项目ID' }]}
          >
            <Input placeholder="项目ID" />
          </Form.Item>

          <Form.Item
            name="version"
            label="版本"
            rules={[{ required: true, message: '请选择版本' }]}
          >
            <Select placeholder="选择数据集版本">
              <Option value="latest">最新版本</Option>
              <Option value="1">版本 1</Option>
              <Option value="2">版本 2</Option>
              <Option value="3">版本 3</Option>
            </Select>
          </Form.Item>

          <Alert
            message="同步说明"
            description="同步将下载指定版本的数据集，包括图片和标注文件。建议在网络状况良好时进行同步。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={syncLoading}
                icon={<CloudSyncOutlined />}
              >
                开始同步
              </Button>
              <Button onClick={() => setRoboflowModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Datasets;
