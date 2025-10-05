# Training Directory

## 📂 结构说明

```
training/
├── notebooks/           # Jupyter训练笔记本
│   └── yolov8_train.ipynb
├── models/             # 训练好的模型
│   └── nutriscan_v1/
│       ├── best.pt              # PyTorch权重
│       ├── model.tflite         # TFLite模型(移动端)
│       ├── classes.txt          # 类别名称
│       └── metrics.txt          # 性能指标
└── results/            # 训练结果和日志
    └── runs/

```

## 🚀 快速开始

### 1. 环境准备

**Google Colab (推荐)**
```python
# 上传 yolov8_train.ipynb 到 Colab
# 确保运行时类型为 GPU (T4)
# 直接运行所有单元格
```

**本地环境**
```bash
# 安装依赖
pip install ultralytics roboflow opencv-python pillow

# 启动 Jupyter
jupyter notebook notebooks/yolov8_train.ipynb
```

### 2. 配置Roboflow API

在 notebook 中找到这一行：
```python
rf = Roboflow(api_key="YOUR_ROBOFLOW_API_KEY")
```

替换为你的API密钥：
- 访问: https://app.roboflow.com/settings/api
- 复制 API Key
- 粘贴到代码中

### 3. 开始训练

运行所有单元格即可完成：
1. ✅ 环境检查
2. ✅ 下载数据集
3. ✅ 数据可视化
4. ✅ 模型训练
5. ✅ 性能评估
6. ✅ 导出TFLite
7. ✅ 保存结果

## 📊 性能目标

| 指标 | 目标值 | 用途 |
|------|--------|------|
| **mAP50** | > 80% | 识别准确率 |
| **推理速度** | < 100ms | 实时体验 |
| **模型大小** | < 20MB | 移动端部署 |

## 🔧 训练配置

### 模型选择
```python
# YOLOv8n - 最轻量 (推荐移动端)
model = YOLO('yolov8n.pt')

# YOLOv8s - 平衡性能和速度
model = YOLO('yolov8s.pt')

# YOLOv8m - 更高精度
model = YOLO('yolov8m.pt')
```

### 超参数调整

**训练时长**
```python
epochs=100      # 默认100轮
patience=50     # 早停耐心值
```

**Batch Size (根据GPU调整)**
```python
# Google Colab T4: batch=16
# V100/A100: batch=32
# CPU: batch=8
```

**数据增强**
```python
hsv_h=0.015     # 色调增强
hsv_s=0.7       # 饱和度增强
hsv_v=0.4       # 亮度增强
fliplr=0.5      # 左右翻转
mosaic=1.0      # Mosaic增强
```

## 📈 训练过程监控

### 实时指标
- **Loss**: 训练/验证损失曲线
- **mAP**: 平均精度曲线
- **Precision/Recall**: P-R曲线

### 可视化输出
- `results.png` - 训练指标总览
- `confusion_matrix.png` - 混淆矩阵
- `val_batch*_pred.jpg` - 验证集预测可视化

## 🎯 训练建议

### 首次训练
1. 使用默认配置
2. 观察训练曲线
3. 记录最终mAP50

### 如果mAP50 < 80%
```python
# 策略1: 增加训练轮数
epochs=150

# 策略2: 调整学习率
lr0=0.005  # 降低初始学习率

# 策略3: 增强数据增强
mosaic=1.0
mixup=0.1

# 策略4: 使用更大模型
model = YOLO('yolov8s.pt')
```

### 如果推理速度 > 100ms
```python
# 策略1: 使用更小模型
model = YOLO('yolov8n.pt')

# 策略2: 降低输入分辨率
imgsz=416  # 从640降到416

# 策略3: INT8量化
tflite_model = model.export(format='tflite', int8=True)
```

## 🔥 Colab训练技巧

### GPU使用
```python
# 检查GPU配额
!nvidia-smi

# 使用T4 GPU (免费)
# 运行时 → 更改运行时类型 → T4 GPU
```

### 数据持久化
```python
# 挂载Google Drive
from google.colab import drive
drive.mount('/content/drive')

# 保存模型到Drive
output_dir = '/content/drive/MyDrive/NutriScan/models/'
```

### 防止断连
```python
# 启用后台运行
# 工具 → 设置 → 杂项 → 自动保存输出
```

## 📦 模型导出

### PyTorch (.pt)
```python
# 用于进一步微调
model.export(format='torchscript')
```

### TensorFlow Lite (.tflite)
```python
# 移动端部署 (React Native)
model.export(format='tflite', imgsz=640, int8=False)
```

### ONNX (.onnx)
```python
# 跨平台部署
model.export(format='onnx')
```

### CoreML (.mlmodel)
```python
# iOS部署
model.export(format='coreml')
```

## 🐛 常见问题

### 1. CUDA out of memory
```python
# 降低batch size
batch=8  # 原来16
```

### 2. 数据集下载失败
```python
# 检查Roboflow API key
# 检查项目名称是否正确
```

### 3. 训练速度慢
```python
# 确保使用GPU
device = 'cuda'

# 启用多线程
workers=8
```

### 4. mAP50不达标
- 增加数据量 (每类50+张)
- 改善标注质量
- 使用更大模型
- 调整数据增强

## 📚 相关资源

- [Ultralytics YOLOv8 文档](https://docs.ultralytics.com/)
- [Roboflow 教程](https://docs.roboflow.com/)
- [YOLOv8 性能基准](https://github.com/ultralytics/ultralytics)

## ✅ 训练检查清单

Week 3-4准备：
- [ ] 完成1000+张图像收集
- [ ] 全部上传到Roboflow
- [ ] 完成所有标注 (bounding box)
- [ ] 生成数据集版本
- [ ] 获取Roboflow API key

训练过程：
- [ ] 配置训练环境 (Colab/本地)
- [ ] 下载数据集
- [ ] 运行训练 (100 epochs)
- [ ] 验证mAP50 > 80%
- [ ] 测试推理速度 < 100ms
- [ ] 导出TFLite模型 < 20MB

下一步 (Week 5-6)：
- [ ] 将TFLite模型集成到React Native
- [ ] 实现Gemini Vision API调用
- [ ] 开发UI界面

---

**创建日期**: 2025-10-04  
**用途**: Week 3-4 模型训练准备  
**状态**: Ready for data collection completion

