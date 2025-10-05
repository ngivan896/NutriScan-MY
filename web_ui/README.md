# 🚀 NutriScan Backend UI

一个现代化的Web界面，用于管理NutriScan AI系统的所有后端功能，包括模型训练、数据集管理、API管理等。

## ✨ 功能特性

### 📊 仪表盘
- 系统状态监控
- 训练性能图表
- 数据集分布统计
- 实时活动时间线
- 快速操作面板

### 🧠 模型训练管理
- 可视化训练配置
- 实时训练进度监控
- 训练日志查看
- 训练历史管理
- 模型性能评估

### 📂 数据集管理
- 本地数据集上传和管理
- Roboflow数据集同步
- 图像预览和标注
- 数据集统计信息
- 批量操作支持

### 🤖 模型管理
- 模型版本控制
- 模型性能测试
- 模型部署管理
- 推理速度测试
- 模型导出功能

### 🔌 API管理
- Gemini Vision API配置
- API密钥管理
- API使用统计
- 错误监控和日志
- 性能分析

### ⚙️ 系统设置
- 环境配置管理
- 用户权限设置
- 系统参数调优
- 日志管理
- 备份和恢复

## 🛠️ 技术栈

### 后端
- **Node.js** - 服务器运行环境
- **Express.js** - Web框架
- **Socket.IO** - 实时通信
- **Multer** - 文件上传处理
- **Python Shell** - 集成Python训练脚本

### 前端
- **React 18** - 用户界面框架
- **Ant Design** - UI组件库
- **Chart.js** - 数据可视化
- **Socket.IO Client** - 实时数据更新
- **React Router** - 路由管理

### 数据可视化
- **Chart.js** - 图表渲染
- **React ChartJS 2** - React集成
- 实时训练进度图表
- 性能趋势分析
- 数据集分布统计

## 🚀 快速开始

### 1. 环境要求
- Node.js 16+
- Python 3.8+
- 8GB+ RAM (推荐)

### 2. 安装依赖
```bash
# 安装所有依赖
npm run install:all

# 或者分别安装
npm install
cd client && npm install
```

### 3. 环境配置
创建 `.env` 文件：
```env
# 服务器配置
PORT=3001
NODE_ENV=development

# Roboflow配置
ROBOFLOW_API_KEY=your_roboflow_api_key
ROBOFLOW_PROJECT=malaysian-food-detection-wy3kt
ROBOFLOW_VERSION=2

# Gemini API配置
GEMINI_API_KEY=your_gemini_api_key

# 路径配置
TRAINING_DIR=../training
DATASETS_DIR=../datasets
MODELS_DIR=../models
RESULTS_DIR=../results
```

### 4. 启动服务
```bash
# 开发模式 (后端 + 前端)
npm run dev

# 生产模式
npm run build
npm start
```

### 5. 访问界面
- 后端API: http://localhost:3001/api
- Web界面: http://localhost:3001
- 前端开发: http://localhost:3000

## 📁 项目结构

```
web_ui/
├── server.js              # 后端服务器
├── package.json           # 后端依赖
├── client/                # React前端
│   ├── src/
│   │   ├── components/    # 组件
│   │   ├── pages/         # 页面
│   │   ├── App.js         # 主应用
│   │   └── index.js       # 入口文件
│   ├── public/            # 静态资源
│   └── package.json       # 前端依赖
└── README.md              # 说明文档
```

## 🔧 API接口

### 系统状态
- `GET /api/status` - 获取系统状态
- `GET /api/datasets` - 获取数据集信息
- `GET /api/models` - 获取模型列表

### 训练管理
- `POST /api/training/start` - 开始训练
- `POST /api/training/stop` - 停止训练
- `GET /api/training/history` - 训练历史

### 数据集管理
- `POST /api/datasets/upload` - 上传数据集
- `POST /api/datasets/roboflow/sync` - 同步Roboflow

### 模型测试
- `POST /api/models/test` - 测试模型推理

### API配置
- `POST /api/gemini/config` - 配置Gemini API

## 📊 实时功能

### WebSocket事件
- `training_log` - 训练日志
- `training_error` - 训练错误
- `training_complete` - 训练完成
- `system_status` - 系统状态更新

### 实时监控
- 训练进度实时更新
- 系统资源监控
- 错误实时通知
- 性能指标实时显示

## 🎨 界面预览

### 仪表盘
- 系统概览卡片
- 训练性能趋势图
- 数据集分布图表
- 最近活动时间线

### 训练管理
- 训练配置表单
- 实时进度条
- 训练日志查看器
- 历史记录表格

### 数据集管理
- 数据集列表
- 上传界面
- Roboflow同步
- 预览功能

## 🔒 安全特性

- API密钥加密存储
- 文件上传安全检查
- 跨域请求控制
- 输入验证和清理
- 错误信息过滤

## 📱 响应式设计

- 移动端适配
- 平板端优化
- 桌面端完整功能
- 触摸友好界面
- 自适应布局

## 🚀 部署指南

### Docker部署
```bash
# 构建镜像
docker build -t nutriscan-ui .

# 运行容器
docker run -p 3001:3001 nutriscan-ui
```

### PM2部署
```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name nutriscan-ui

# 查看状态
pm2 status
```

### Nginx反向代理
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🐛 故障排除

### 常见问题
1. **端口占用**: 修改PORT环境变量
2. **Python脚本错误**: 检查Python环境和依赖
3. **文件上传失败**: 检查磁盘空间和权限
4. **API连接失败**: 验证API密钥和网络

### 日志查看
```bash
# 查看应用日志
pm2 logs nutriscan-ui

# 查看错误日志
tail -f logs/error.log
```

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 📞 支持

- 问题反馈: GitHub Issues
- 文档: README.md
- 邮件: support@nutriscan.ai

---

**NutriScan AI Backend UI** - 让AI模型训练变得简单高效！ 🚀
