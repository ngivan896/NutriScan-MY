# 测试图像文件夹

## 📁 用途

这个文件夹用于存放**测试用的食物图像**，用于：
- 测试 Roboflow 上传流程
- 练习标注技巧
- 验证工作流程

## 📂 文件夹结构

```
test_images/
├── nasi_lemak/          ← Nasi Lemak 测试图像
│   ├── test_1.jpg
│   ├── test_2.jpg
│   └── test_3.jpg
├── roti_canai/          ← 其他食物测试图像（可选）
└── README.md            ← 本文件
```

## 📥 下载测试图像

### 方法 1: 免费图库
- **Unsplash**: https://unsplash.com/s/photos/nasi-lemak
- **Pexels**: https://www.pexels.com/search/nasi-lemak/

### 方法 2: Google 图像搜索
1. 搜索 "nasi lemak malaysia food"
2. 选择高质量图像
3. 右键保存到 `test_images/nasi_lemak/`

## 📤 上传到 Roboflow

1. 访问: https://app.roboflow.com/malaysian-food-detection/malaysian-food-detection-wy3kt/upload
2. 拖拽整个文件夹或选择图像
3. 点击 Upload

## 🏷️ 标注规范

- **工具**: Bounding Box（边界框）
- **标签**: `nasi_lemak`（小写，下划线）
- **范围**: 紧贴食物主体，包含所有配菜
- **质量**: 确保边界准确

## ✅ 测试目标

- [ ] 下载 3-5 张测试图像
- [ ] 成功上传到 Roboflow
- [ ] 完成标注
- [ ] 生成数据集版本 1
- [ ] 熟悉整个流程

## 🚀 下一步

测试完成后，开始正式数据收集：
- 移动到 `raw_images/` 文件夹
- 每种食物 50 张图像
- 20 种食物共 1000+ 张

---

**创建日期**: 2025-10-03  
**状态**: 测试阶段

