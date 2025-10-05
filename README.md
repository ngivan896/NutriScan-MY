# NutriScan MY

马来西亚食物智能识别系统 - AI学术项目

## 📋 项目简介

基于深度学习的移动端应用，专门识别马来西亚本地食物并提供即时营养分析。

**核心技术**：
- YOLOv8 食物识别
- Gemini Vision API 营养分析
- React Native 移动应用
- 多语言支持（中/英/马来文）

## 🎯 目标用户

- 外国游客 - 快速了解马来西亚美食
- 本地多元种族居民 - 跨文化饮食理解
- 健康管理人群 - 饮食营养追踪

## 📊 项目状态

- ✅ Week 1: 环境配置完成
- 🔶 Week 2: 数据收集进行中（目标：1000+ 张图像）
- ⏳ Week 3-4: 模型训练
- ⏳ Week 5-6: App 开发
- ⏳ Week 7-8: 优化和交付

## 🍜 识别的食物（20种）

1. Nasi Lemak（椰浆饭）
2. Bak Kut Teh（肉骨茶）
3. Rojak（罗惹）
4. Nasi Kerabu（蓝花饭）
5. Char Kway Teow（炒粿条）
6. Hokkien Mee（福建面）
7. Cendol（煎蕊）
8. Roti Canai（印度煎饼）
9. Chicken Rice（海南鸡饭）
10. Ramly Burger
11. Curry Laksa（咖喱叻沙）
12. Satay（沙爹）
13. Wantan Mee（云吞面）
14. Nasi Kandar（嘛嘛档饭）
15. Kolo Mee（干捞面）
16. Chili Pan Mee（辣椒板面）
17. Chee Cheong Fun（猪肠粉）
18. Claypot Chicken Rice（砂煲鸡饭）
19. Apam Balik（曼煎糕）
20. Lemang（竹筒糯米饭）

## 📁 项目结构

```
NutriScan MY/
├── Project.md                    # 主项目文档
├── food_list.md                  # 20种食物详细信息
├── food_categories.json          # 食物配置文件
├── WEEK2_DATA_COLLECTION_GUIDE.md  # Week 2数据收集指南
├── check_images.js              # 数据收集进度检查工具
├── create_food_folders.js       # 自动创建食物分类文件夹
├── scripts/                     # 辅助脚本
│   ├── download_images.js       # 在线图像下载工具
│   └── README.md
├── raw_images/                  # 原始图像数据（本地）
│   ├── nasi_lemak/
│   ├── roti_canai/
│   └── ... (20种食物)
├── test_images/                 # 测试图像
└── training/                    # 训练相关（Week 3-4准备）
    ├── notebooks/
    │   ├── yolov8_train.ipynb   # YOLOv8训练notebook
    │   └── requirements.txt
    ├── models/                  # 训练好的模型
    ├── results/                 # 训练结果
    └── README.md
```

## 🛠️ 使用工具

### Week 2: 数据收集工具

**检查数据收集进度**
```bash
node check_images.js
```

**下载在线图像** (需要Pexels API Key)
```bash
node scripts/download_images.js
```

**创建食物分类文件夹**
```bash
node create_food_folders.js
```

### Week 3-4: 模型训练准备

**训练环境已准备**:
- 📓 `training/notebooks/yolov8_train.ipynb` - 完整训练流程
- 📋 `training/README.md` - 训练指南和技巧
- 📦 `training/notebooks/requirements.txt` - 依赖包列表

**🔥 用3张照片测试训练** (推荐先做):
- 📓 `training/notebooks/quick_test_train.ipynb` - 快速测试训练
- 📋 `training/TEST_TRAINING.md` - 测试指南
- ⏱️ 5-10分钟验证环境和流程

**数据收集完成后即可开始训练！**

## 🔧 技术栈

**AI/ML**:
- YOLOv8 (Ultralytics)
- TensorFlow Lite
- Gemini Vision API
- Roboflow (数据管理)

**移动端**:
- React Native + Expo
- React Native Reanimated + Skia
- NativeWind (Tailwind)
- react-i18next

**后端**:
- Firebase
- Google Cloud

**训练**:
- Google Colab (Free Tier)
- Google Drive (200GB)

## 📖 文档

- `Project.md` - 完整项目文档和架构
- `food_list.md` - 20种食物的拍摄和识别指南

## 🎓 学术贡献

- 首个公开的马来西亚食物AI识别数据集
- 基于视觉AI的个性化营养分析方法
- 多语言跨文化食物识别系统

## 📅 时间线

- **Week 1** (2025-10-03): ✅ 环境配置完成
- **Week 2** (进行中): 数据收集（1000+ 张图像）
- **Week 3-4**: YOLOv8 模型训练
- **Week 5-6**: React Native App 开发
- **Week 7**: 优化和测试
- **Week 8**: 最终交付

## 🔗 相关链接

- Roboflow 项目: https://app.roboflow.com/malaysian-food-detection/malaysian-food-detection-wy3kt/

---

**创建日期**: 2025-10-03  
**项目周期**: 8 周  
**类型**: 学术研究项目

