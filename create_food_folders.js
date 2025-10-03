// ==================== 创建所有食物分类文件夹 ====================
const fs = require('fs');
const path = require('path');

// 20 种马来西亚食物
const food_categories = [
    'nasi_lemak',
    'bak_kut_teh',
    'rojak',
    'nasi_kerabu',
    'char_kway_teow',
    'hokkien_mee',
    'cendol',
    'roti_canai',
    'chicken_rice',
    'ramly_burger',
    'curry_laksa',
    'satay',
    'wantan_mee',
    'nasi_kandar',
    'kolo_mee',
    'chili_pan_mee',
    'chee_cheong_fun',
    'claypot_chicken_rice',
    'apam_balik',
    'lemang'
];

const RAW_IMAGES_DIR = './raw_images';

console.log('=' .repeat(60));
console.log('📁 创建食物分类文件夹');
console.log('=' .repeat(60));

// 确保 raw_images 文件夹存在
if (!fs.existsSync(RAW_IMAGES_DIR)) {
    fs.mkdirSync(RAW_IMAGES_DIR);
    console.log('✅ 已创建 raw_images 文件夹\n');
}

// 为每种食物创建文件夹
let created = 0;
let existed = 0;

food_categories.forEach((food, index) => {
    const folderPath = path.join(RAW_IMAGES_DIR, food);
    
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`✅ [${index + 1}/20] 创建: ${food}/`);
        created++;
    } else {
        console.log(`⏭️  [${index + 1}/20] 已存在: ${food}/`);
        existed++;
    }
});

console.log('\n' + '=' .repeat(60));
console.log('📊 创建完成:');
console.log('=' .repeat(60));
console.log(`   新建文件夹: ${created}`);
console.log(`   已存在: ${existed}`);
console.log(`   总计: ${food_categories.length}`);

console.log('\n📂 文件夹结构:');
console.log('   raw_images/');
console.log('   ├── nasi_lemak/           (目标: 50 张)');
console.log('   ├── bak_kut_teh/          (目标: 50 张)');
console.log('   ├── rojak/                (目标: 50 张)');
console.log('   └── ... (其他 17 种)');

console.log('\n💡 使用方法:');
console.log('   1. 拍摄食物照片');
console.log('   2. 传输到电脑');
console.log('   3. 移动到对应的文件夹');
console.log('   4. 每种食物 50 张图像');
console.log('   5. 运行 check_images.js 检查进度');

console.log('\n✅ 文件夹准备完成！');
console.log('=' .repeat(60));

