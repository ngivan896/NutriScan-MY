const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// 静态文件服务
const buildPath = path.join(__dirname, 'client', 'build');
app.use(express.static(buildPath));

// 处理React路由
app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../datasets/uploaded');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// ============================================
// API Routes
// ============================================

// 获取系统状态
app.get('/api/status', async (req, res) => {
  try {
    const status = {
      timestamp: new Date().toISOString(),
      system: {
        node_version: process.version,
        platform: process.platform,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      },
      services: {
        training: await checkTrainingStatus(),
        dataset: await getDatasetInfo(),
        models: await getModelsInfo()
      }
    };
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取数据集信息
app.get('/api/datasets', async (req, res) => {
  try {
    const datasets = await getDatasetsInfo();
    res.json(datasets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取模型列表
app.get('/api/models', async (req, res) => {
  try {
    const models = await getModelsList();
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取训练历史
app.get('/api/training/history', async (req, res) => {
  try {
    const history = await getTrainingHistory();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 开始训练
app.post('/api/training/start', async (req, res) => {
  try {
    const { config } = req.body;
    
    // 验证配置
    if (!config.dataset || !config.epochs) {
      return res.status(400).json({ error: 'Missing required training parameters' });
    }

    // 启动训练进程
    const trainingId = `training_${Date.now()}`;
    const result = await startTraining(config, trainingId);
    
    res.json({ 
      success: true, 
      trainingId, 
      message: 'Training started successfully',
      processId: result.pid
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 停止训练
app.post('/api/training/stop', async (req, res) => {
  try {
    const { trainingId } = req.body;
    const result = await stopTraining(trainingId);
    res.json({ success: true, message: 'Training stopped' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 上传数据集
app.post('/api/datasets/upload', upload.array('images', 100), async (req, res) => {
  try {
    const files = req.files;
    const { category } = req.body;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const result = await processUploadedImages(files, category);
    res.json({ 
      success: true, 
      message: `${files.length} images uploaded successfully`,
      files: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 从Roboflow同步数据
app.post('/api/datasets/roboflow/sync', async (req, res) => {
  try {
    const { apiKey, projectId, version } = req.body;
    
    if (!apiKey || !projectId) {
      return res.status(400).json({ error: 'Missing Roboflow credentials' });
    }

    const result = await syncRoboflowDataset(apiKey, projectId, version);
    res.json({ 
      success: true, 
      message: 'Roboflow dataset synced successfully',
      dataset: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 测试模型推理
app.post('/api/models/test', upload.single('image'), async (req, res) => {
  try {
    const { modelId } = req.body;
    const imageFile = req.file;
    
    if (!imageFile || !modelId) {
      return res.status(400).json({ error: 'Missing image or model ID' });
    }

    const result = await testModelInference(modelId, imageFile.path);
    res.json({ 
      success: true, 
      predictions: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取API配置
app.get('/api/config', async (req, res) => {
  try {
    const config = {
      gemini: {
        apiKey: process.env.GEMINI_API_KEY ? 'sk-***hidden***' : '',
        enabled: !!process.env.GEMINI_API_KEY,
        status: process.env.GEMINI_API_KEY ? 'connected' : 'disconnected'
      },
      roboflow: {
        apiKey: process.env.ROBOFLOW_API_KEY ? 'rf-***hidden***' : '',
        project: process.env.ROBOFLOW_PROJECT || '',
        version: process.env.ROBOFLOW_VERSION || '',
        enabled: !!process.env.ROBOFLOW_API_KEY,
        status: process.env.ROBOFLOW_API_KEY ? 'connected' : 'disconnected'
      }
    };
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取API统计
app.get('/api/stats', async (req, res) => {
  try {
    const stats = {
      totalRequests: 0,
      successRate: 100,
      avgResponseTime: 0,
      errorCount: 0,
      geminiRequests: 0,
      roboflowSyncs: 0,
      lastRequest: null
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取API日志
app.get('/api/logs', async (req, res) => {
  try {
    const logs = [];
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gemini API配置
app.post('/api/gemini/config', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    // 保存API密钥到环境变量
    process.env.GEMINI_API_KEY = apiKey;
    
    // 测试连接
    const testResult = await testGeminiConnection();
    
    res.json({ 
      success: true, 
      message: 'Gemini API configured successfully',
      test: testResult
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Socket.IO 实时通信
// ============================================

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // 加入训练房间
  socket.on('join_training', (trainingId) => {
    socket.join(`training_${trainingId}`);
    console.log(`Client ${socket.id} joined training ${trainingId}`);
  });
  
  // 离开训练房间
  socket.on('leave_training', (trainingId) => {
    socket.leave(`training_${trainingId}`);
    console.log(`Client ${socket.id} left training ${trainingId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ============================================
// Helper Functions
// ============================================

async function checkTrainingStatus() {
  // 检查是否有正在运行的训练进程
  try {
    const trainingDir = path.join(__dirname, '../training/results');
    const results = await fs.readdir(trainingDir);
    return {
      running: results.length > 0,
      active_training: results
    };
  } catch (error) {
    return { running: false, active_training: [] };
  }
}

async function getDatasetInfo() {
  try {
    const datasetsDir = path.join(__dirname, '../datasets');
    const datasets = await fs.readdir(datasetsDir);
    return {
      count: datasets.length,
      datasets: datasets
    };
  } catch (error) {
    return { count: 0, datasets: [] };
  }
}

async function getModelsInfo() {
  try {
    const modelsDir = path.join(__dirname, '../models');
    const models = await fs.readdir(modelsDir);
    return {
      count: models.length,
      models: models
    };
  } catch (error) {
    return { count: 0, models: [] };
  }
}

async function getDatasetsInfo() {
  // 返回详细的数据集信息
  return {
    local: await getLocalDatasets(),
    roboflow: await getRoboflowDatasets()
  };
}

async function getLocalDatasets() {
  try {
    const datasetsDir = path.join(__dirname, '../datasets');
    const datasets = [];
    
    for (const item of await fs.readdir(datasetsDir)) {
      const itemPath = path.join(datasetsDir, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isDirectory()) {
        const images = await fs.readdir(path.join(itemPath, 'images')).catch(() => []);
        datasets.push({
          name: item,
          path: itemPath,
          imageCount: images.length,
          lastModified: stats.mtime
        });
      }
    }
    
    return datasets;
  } catch (error) {
    return [];
  }
}

async function getRoboflowDatasets() {
  // 返回Roboflow数据集信息
  return {
    project: process.env.ROBOFLOW_PROJECT || 'malaysian-food-detection-wy3kt',
    version: process.env.ROBOFLOW_VERSION || '2',
    connected: !!process.env.ROBOFLOW_API_KEY
  };
}

async function getModelsList() {
  try {
    const modelsDir = path.join(__dirname, '../models');
    const models = [];
    
    for (const item of await fs.readdir(modelsDir)) {
      const itemPath = path.join(modelsDir, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isDirectory()) {
        const modelFiles = await fs.readdir(itemPath);
        models.push({
          name: item,
          path: itemPath,
          files: modelFiles,
          lastModified: stats.mtime,
          size: await getDirectorySize(itemPath)
        });
      }
    }
    
    return models;
  } catch (error) {
    return [];
  }
}

async function getDirectorySize(dirPath) {
  let size = 0;
  try {
    const files = await fs.readdir(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await fs.stat(filePath);
      size += stats.size;
    }
  } catch (error) {
    // 忽略错误
  }
  return size;
}

async function getTrainingHistory() {
  try {
    const resultsDir = path.join(__dirname, '../training/results');
    const trainingRuns = [];
    
    for (const item of await fs.readdir(resultsDir)) {
      const itemPath = path.join(resultsDir, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isDirectory()) {
        const configFile = path.join(itemPath, 'args.yaml');
        const resultsFile = path.join(itemPath, 'results.csv');
        
        let config = {};
        let results = {};
        
        try {
          if (await fs.pathExists(configFile)) {
            const yaml = require('js-yaml');
            config = yaml.load(await fs.readFile(configFile, 'utf8'));
          }
          
          if (await fs.pathExists(resultsFile)) {
            const csv = require('csv-parser');
            const rows = [];
            await new Promise((resolve) => {
              fs.createReadStream(resultsFile)
                .pipe(csv())
                .on('data', (row) => rows.push(row))
                .on('end', () => {
                  results = rows[rows.length - 1]; // 最后一行的结果
                  resolve();
                });
            });
          }
        } catch (error) {
          // 忽略解析错误
        }
        
        trainingRuns.push({
          name: item,
          path: itemPath,
          config,
          results,
          lastModified: stats.mtime,
          status: 'completed'
        });
      }
    }
    
    return trainingRuns.sort((a, b) => b.lastModified - a.lastModified);
  } catch (error) {
    return [];
  }
}

async function startTraining(config, trainingId) {
  return new Promise((resolve, reject) => {
    const trainingScript = path.join(__dirname, '../training/notebooks/train_from_roboflow.py');
    const args = [
      trainingScript,
      '--config', JSON.stringify(config),
      '--training-id', trainingId
    ];
    
    const child = spawn('python', args, {
      cwd: path.join(__dirname, '../training/notebooks'),
      env: { ...process.env }
    });
    
    // 存储训练进程
    trainingProcesses[trainingId] = child;
    
    child.stdout.on('data', (data) => {
      const message = data.toString();
      io.to(`training_${trainingId}`).emit('training_log', {
        timestamp: new Date().toISOString(),
        message: message.trim()
      });
    });
    
    child.stderr.on('data', (data) => {
      const message = data.toString();
      io.to(`training_${trainingId}`).emit('training_error', {
        timestamp: new Date().toISOString(),
        error: message.trim()
      });
    });
    
    child.on('close', (code) => {
      delete trainingProcesses[trainingId];
      io.to(`training_${trainingId}`).emit('training_complete', {
        timestamp: new Date().toISOString(),
        exitCode: code
      });
    });
    
    resolve(child);
  });
}

async function stopTraining(trainingId) {
  const process = trainingProcesses[trainingId];
  if (process) {
    process.kill('SIGTERM');
    delete trainingProcesses[trainingId];
    return true;
  }
  return false;
}

async function processUploadedImages(files, category) {
  const processedFiles = [];
  
  for (const file of files) {
    // 移动到正确的类别目录
    const targetDir = path.join(__dirname, '../datasets/raw_images', category);
    await fs.ensureDir(targetDir);
    
    const targetPath = path.join(targetDir, file.filename);
    await fs.move(file.path, targetPath);
    
    processedFiles.push({
      originalName: file.originalname,
      filename: file.filename,
      category,
      size: file.size,
      path: targetPath
    });
  }
  
  return processedFiles;
}

async function syncRoboflowDataset(apiKey, projectId, version) {
  // 调用Roboflow同步脚本
  const scriptPath = path.join(__dirname, '../training/notebooks/sync_roboflow.py');
  
  return new Promise((resolve, reject) => {
    const child = spawn('python', [
      scriptPath,
      '--api-key', apiKey,
      '--project-id', projectId,
      '--version', version || 'latest'
    ]);
    
    let output = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, output });
      } else {
        reject(new Error(output));
      }
    });
  });
}

async function testModelInference(modelId, imagePath) {
  // 调用模型推理脚本
  const scriptPath = path.join(__dirname, '../training/notebooks/test_inference.py');
  
  return new Promise((resolve, reject) => {
    const child = spawn('python', [
      scriptPath,
      '--model-id', modelId,
      '--image', imagePath
    ]);
    
    let output = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (error) {
          resolve({ predictions: output });
        }
      } else {
        reject(new Error(output));
      }
    });
  });
}

async function testGeminiConnection() {
  // 测试Gemini API连接
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
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
}

// 存储活跃的训练进程
const trainingProcesses = {};

// ============================================
// 启动服务器
// ============================================

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 NutriScan Backend UI Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔧 API Endpoint: http://localhost:${PORT}/api`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down server...');
  
  // 停止所有训练进程
  Object.values(trainingProcesses).forEach(process => {
    process.kill('SIGTERM');
  });
  
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;
