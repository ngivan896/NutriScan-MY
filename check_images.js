// ==================== 图像文件夹检查脚本 ====================
// 用途：检查测试图像和原始图像文件夹的状态

const fs = require('fs');
const path = require('path');

const TEST_IMAGES_DIR = './test_images';
const RAW_IMAGES_DIR = './raw_images';

// 检查单个文件夹
function checkImageFolder(folderName, folderPath, isRawImages = false) {
    console.log('=' .repeat(60));
    console.log(`📂 ${folderName}`);
    console.log('=' .repeat(60));
    
    if (!fs.existsSync(folderPath)) {
        console.log(`❌ 文件夹不存在: ${folderPath}`);
        return { totalFolders: 0, totalImages: 0 };
    }
    
    console.log(`✅ 文件夹存在\n`);
    
    // 读取子文件夹
    const folders = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    if (folders.length === 0) {
        console.log('⚠️  文件夹为空');
        return { totalFolders: 0, totalImages: 0 };
    }
    
    console.log(`📊 找到 ${folders.length} 个食物分类:\n`);
    
    let totalImages = 0;
    const stats = [];
    
    folders.forEach(folder => {
        const subFolderPath = path.join(folderPath, folder);
        const files = fs.readdirSync(subFolderPath)
            .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
        
        const count = files.length;
        totalImages += count;
        
        const target = isRawImages ? 50 : 5;
        const percentage = (count / target * 100).toFixed(0);
        
        let status;
        if (count === 0) {
            status = '❌';
        } else if (count < target * 0.5) {
            status = '⚠️';
        } else if (count < target) {
            status = '🔶';
        } else {
            status = '✅';
        }
        
        stats.push({
            folder,
            count,
            percentage: Math.min(100, percentage),
            status
        });
        
        console.log(`  ${status} ${folder}/`);
        console.log(`     图像数量: ${count}${isRawImages ? '/50' : ''} (${Math.min(100, percentage)}%)`);
        
        // 如果是测试图像且数量少，显示文件列表
        if (!isRawImages && count > 0 && count <= 5) {
            files.slice(0, 3).forEach(file => {
                const filePath = path.join(subFolderPath, file);
                const stats = fs.statSync(filePath);
                const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
                console.log(`       • ${file} (${sizeMB} MB)`);
            });
            if (files.length > 3) {
                console.log(`       ... 还有 ${files.length - 3} 个文件`);
            }
        }
    });
    
    console.log();
    
    return { 
        totalFolders: folders.length, 
        totalImages,
        stats
    };
}

// 主程序
console.log('=' .repeat(60));
console.log('🎯 NutriScan MY - 图像收集进度检查');
console.log('=' .repeat(60));
console.log();

// 检查测试图像
const testResults = checkImageFolder('测试图像 (test_images)', TEST_IMAGES_DIR, false);

// 检查原始图像
const rawResults = checkImageFolder('原始图像 (raw_images)', RAW_IMAGES_DIR, true);

// 总结
console.log('=' .repeat(60));
console.log('📊 总体统计');
console.log('=' .repeat(60));

console.log('\n🧪 测试图像:');
console.log(`   分类数: ${testResults.totalFolders}`);
console.log(`   图像数: ${testResults.totalImages}`);

console.log('\n📸 原始图像:');
console.log(`   分类数: ${rawResults.totalFolders}/20`);
console.log(`   图像数: ${rawResults.totalImages}/1000+`);
if (rawResults.totalFolders > 0) {
    const avgPerCategory = (rawResults.totalImages / rawResults.totalFolders).toFixed(1);
    const overallProgress = (rawResults.totalImages / 1000 * 100).toFixed(1);
    console.log(`   平均每类: ${avgPerCategory} 张`);
    console.log(`   总体进度: ${overallProgress}%`);
}

// 下一步建议
console.log('\n' + '=' .repeat(60));
console.log('💡 下一步行动');
console.log('=' .repeat(60));

if (testResults.totalImages === 0) {
    console.log('\n🧪 测试阶段:');
    console.log('   1. 下载 3-5 张 Nasi Lemak 测试图像');
    console.log('   2. 保存到 test_images/nasi_lemak/');
    console.log('   3. 上传到 Roboflow 并练习标注');
} else if (testResults.totalImages < 5 && rawResults.totalImages === 0) {
    console.log('\n✅ 测试图像已准备好！');
    console.log('   • 上传: https://app.roboflow.com/malaysian-food-detection/malaysian-food-detection-wy3kt/upload');
    console.log('   • 标注: 使用 Bounding Box 工具');
    console.log('   • 标签: nasi_lemak');
} else if (rawResults.totalImages < 50) {
    console.log('\n📸 开始正式数据收集:');
    console.log('   1. 拍摄第一批食物（Nasi Lemak, Roti Canai, Chicken Rice）');
    console.log('   2. 传输到 raw_images/ 对应文件夹');
    console.log('   3. 每种食物 50 张图像');
    console.log('   4. 批量上传到 Roboflow');
} else if (rawResults.totalImages < 250) {
    console.log('\n🔥 继续收集数据:');
    console.log(`   当前进度: ${rawResults.totalImages}/1000+`);
    console.log('   保持节奏，稳定前进！');
} else if (rawResults.totalImages < 1000) {
    console.log('\n🚀 进展顺利！');
    console.log(`   已完成: ${(rawResults.totalImages / 1000 * 100).toFixed(0)}%`);
    console.log('   继续加油，接近目标！');
} else {
    console.log('\n🎉 数据收集完成！');
    console.log('   • 确保全部上传到 Roboflow');
    console.log('   • 完成所有标注');
    console.log('   • 生成数据集版本');
    console.log('   • 准备 Week 3: 模型训练');
}

console.log('\n' + '=' .repeat(60));
