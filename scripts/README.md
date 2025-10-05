# Scripts Directory

数据收集和管理脚本工具集

## 📁 脚本列表

### 1. `download_images.js`
从Pexels API批量下载马来西亚食物图像

**使用方法**:
```bash
# 1. 获取Pexels API Key
# 访问: https://www.pexels.com/api/

# 2. 在脚本中设置API Key
# 编辑 download_images.js，替换 YOUR_PEXELS_API_KEY

# 3. 运行脚本
node scripts/download_images.js
```

**功能**:
- ✅ 自动搜索20种食物图像
- ✅ 批量下载到对应文件夹
- ✅ 避免重复下载
- ✅ API限流保护
- ✅ 每种食物下载30张

**配置**:
```javascript
const PEXELS_API_KEY = 'YOUR_API_KEY';  // API密钥
const IMAGES_PER_FOOD = 30;             // 每种食物数量
```

## 🔧 其他工具

### 根目录脚本

- `check_images.js` - 检查图像收集进度
- `create_food_folders.js` - 创建食物分类文件夹

### 使用示例

```bash
# 创建文件夹结构
node create_food_folders.js

# 下载在线图像
node scripts/download_images.js

# 检查收集进度
node check_images.js
```

## 📝 注意事项

1. **API Key**: Pexels免费额度为 200 次/小时
2. **图像质量**: 下载的是 large 尺寸（适合训练）
3. **补充拍摄**: 建议在线图像 + 自行拍摄混合使用
4. **许可协议**: Pexels图像可免费用于个人和商业用途

## 🔗 相关资源

- Pexels API: https://www.pexels.com/api/
- Unsplash API: https://unsplash.com/developers
- Pixabay API: https://pixabay.com/api/docs/

---

**创建日期**: 2025-10-04

