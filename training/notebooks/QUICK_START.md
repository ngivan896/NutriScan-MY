# 快速开始 - Jupyter Notebook 测试训练

## 🚀 Jupyter已启动！

Jupyter Notebook服务器正在后台运行。

---

## 📖 使用步骤

### 1. 打开浏览器

Jupyter应该会自动打开浏览器，如果没有：

**手动打开**: 
- 浏览器访问: `http://localhost:8888`
- 如果需要token，查看终端输出的链接

### 2. 打开测试Notebook

在浏览器中：
1. 你会看到文件列表
2. 点击 `quick_test_train.ipynb`
3. Notebook会在新标签页打开

### 3. 运行测试训练

**方法A: 运行所有cell (推荐)**
```
菜单栏 → Cell → Run All
```

**方法B: 逐个运行**
```
点击一个cell → 按 Shift+Enter
```

### 4. 观察输出

每个cell运行后会显示输出：
- ✅ 绿色勾号 = 成功
- ❌ 红色叉号 = 失败
- 数字进度条 = 训练进度

---

## ⏱️ 训练时间

- **检查环境**: 10秒
- **准备数据**: 5秒
- **训练3轮**: 3-8分钟 (取决于CPU/GPU)
- **测试推理**: 5秒

**总共**: 约5-10分钟

---

## 📊 预期输出

### Cell 1: 环境检查
```
✅ Ultralytics: 8.x.x
✅ PyTorch: 2.x.x
✅ Device: cuda (或 cpu)
```

### Cell 2: 数据准备
```
找到 3 张测试图像
✅ 训练集: 2 张
✅ 验证集: 1 张
```

### Cell 5: 训练过程
```
🚀 开始测试训练...

Epoch 1/3: 100%|██████████| loss: 4.5
Epoch 2/3: 100%|██████████| loss: 3.2
Epoch 3/3: 100%|██████████| loss: 2.8

✅ 训练流程测试成功！
```

### Cell 6: 推理测试
```
✅ 推理测试成功！
（会显示测试图像）
```

---

## ⚠️ 常见问题

### Q1: Cell运行很慢
**A**: CPU训练较慢，这是正常的。可以：
- 等待完成（5-10分钟）
- 或使用Google Colab (有免费GPU)

### Q2: 显示 "Kernel busy"
**A**: 等待当前cell完成，不要重复点击运行

### Q3: 训练卡在某个epoch
**A**: CPU训练时可能看起来卡住，实际在运行，请耐心等待

### Q4: 出现红色错误
**A**: 
1. 查看错误信息
2. 常见原因：
   - 内存不足 → 关闭其他程序
   - 依赖包缺失 → 重新运行第一个cell
   - 图像路径错误 → 检查test_images文件夹

---

## 🎯 成功标志

如果看到这些，说明测试成功：

- ✅ 所有cell都有输出
- ✅ 没有红色错误信息
- ✅ 生成了 `test_runs/quick_test/` 文件夹
- ✅ 存在 `weights/best.pt` 模型文件
- ✅ 最后一个cell显示了测试图像

---

## 📋 训练完成后

### 查看生成的文件

在Jupyter左侧文件列表中，你会看到：
```
test_dataset/          # 测试数据集
  ├── train/
  ├── valid/
  └── test/
test_runs/             # 训练结果
  └── quick_test/
      └── weights/
          └── best.pt  # 训练好的模型
```

### 下一步

**如果测试成功** ✅:
1. 恭喜！训练环境配置正确
2. 可以继续Week 2数据收集
3. 收集完1000+张图像后，使用 `yolov8_train.ipynb` 正式训练

**如果遇到问题** ❌:
1. 查看 `TEST_TRAINING.md` 的问题排查部分
2. 可以继续数据收集（Week 3再解决）
3. 或考虑使用Google Colab

---

## 🔄 重新运行

如果想重新测试：

**方法1**: 在Jupyter中
```
Kernel → Restart & Run All
```

**方法2**: 删除生成的文件
```python
# 在notebook最后添加cell
import shutil
shutil.rmtree('test_dataset', ignore_errors=True)
shutil.rmtree('test_runs', ignore_errors=True)
```
然后重新运行所有cell

---

## 🛑 关闭Jupyter

完成后关闭：

**方法1**: 在终端
- 按 `Ctrl+C` 两次

**方法2**: 在浏览器
- 关闭所有Jupyter标签页
- 在终端按 `Ctrl+C`

---

## 💡 小贴士

1. **保存进度**: Jupyter会自动保存
2. **查看变量**: 可以在新cell中打印变量查看
3. **修改代码**: 直接编辑cell，然后重新运行
4. **Markdown注释**: 以 `#` 开头的是注释

---

## 📚 Jupyter快捷键

| 快捷键 | 功能 |
|--------|------|
| Shift+Enter | 运行当前cell并移到下一个 |
| Ctrl+Enter | 运行当前cell |
| A | 在上方插入cell |
| B | 在下方插入cell |
| DD | 删除当前cell |
| M | 转为Markdown cell |
| Y | 转为Code cell |

---

**现在去浏览器打开 http://localhost:8888 开始测试吧！** 🚀

如果遇到问题，随时告诉我！

