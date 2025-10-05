// ==================== 在线图像下载脚本 ====================
// 用途：从Pexels API批量下载马来西亚食物图像
// 需要Pexels API Key: https://www.pexels.com/api/

const fs = require('fs');
const path = require('path');
const https = require('https');

// 配置
const PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY'; // 从 https://www.pexels.com/api/ 获取
const OUTPUT_DIR = './raw_images';
const IMAGES_PER_FOOD = 30; // 每种食物下载数量

// 食物搜索关键词
const FOOD_SEARCHES = [
    { folder: 'nasi_lemak', query: 'nasi lemak malaysian food' },
    { folder: 'roti_canai', query: 'roti canai indian flatbread' },
    { folder: 'char_kway_teow', query: 'char kway teow fried noodles' },
    { folder: 'chicken_rice', query: 'hainanese chicken rice' },
    { folder: 'satay', query: 'satay skewers malaysian' },
    { folder: 'curry_laksa', query: 'curry laksa noodle soup' },
    { folder: 'bak_kut_teh', query: 'bak kut teh pork ribs soup' },
    { folder: 'hokkien_mee', query: 'hokkien mee noodles' },
    { folder: 'cendol', query: 'cendol malaysian dessert' },
    { folder: 'nasi_kerabu', query: 'nasi kerabu blue rice' },
    { folder: 'wantan_mee', query: 'wonton noodles' },
    { folder: 'rojak', query: 'rojak fruit salad malaysia' },
    { folder: 'nasi_kandar', query: 'nasi kandar rice curry' },
    { folder: 'kolo_mee', query: 'kolo mee sarawak noodles' },
    { folder: 'chili_pan_mee', query: 'chili pan mee noodles' },
    { folder: 'chee_cheong_fun', query: 'chee cheong fun rice rolls' },
    { folder: 'claypot_chicken_rice', query: 'claypot chicken rice' },
    { folder: 'ramly_burger', query: 'ramly burger malaysian' },
    { folder: 'apam_balik', query: 'apam balik malaysian pancake' },
    { folder: 'lemang', query: 'lemang bamboo glutinous rice' }
];

// 检查API Key
if (PEXELS_API_KEY === 'YOUR_PEXELS_API_KEY') {
    console.log('❌ 请先设置 Pexels API Key!');
    console.log('   1. 访问: https://www.pexels.com/api/');
    console.log('   2. 注册/登录并获取API Key');
    console.log('   3. 在脚本中替换 PEXELS_API_KEY');
    process.exit(1);
}

// 从Pexels搜索图像
async function search_images(query, per_page = 30) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.pexels.com',
            path: `/v1/search?query=${encodeURIComponent(query)}&per_page=${per_page}`,
            headers: {
                'Authorization': PEXELS_API_KEY
            }
        };

        https.get(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.photos || []);
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

// 下载单张图像
async function download_image(url, file_path) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(file_path);
        
        https.get(url, (response) => {
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(file_path, () => {});
            reject(err);
        });
    });
}

// 等待函数（避免API限流）
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 主函数
async function main() {
    console.log('=' .repeat(60));
    console.log('🚀 NutriScan MY - 图像下载脚本');
    console.log('=' .repeat(60));
    console.log();

    let total_downloaded = 0;
    let total_failed = 0;

    for (const food of FOOD_SEARCHES) {
        console.log(`\n📥 正在下载: ${food.folder}`);
        console.log(`   搜索关键词: "${food.query}"`);
        
        const folder_path = path.join(OUTPUT_DIR, food.folder);
        
        // 确保文件夹存在
        if (!fs.existsSync(folder_path)) {
            fs.mkdirSync(folder_path, { recursive: true });
        }

        // 检查已有图像数量
        const existing_files = fs.readdirSync(folder_path)
            .filter(f => /\.(jpg|jpeg|png)$/i.test(f));
        
        if (existing_files.length >= IMAGES_PER_FOOD) {
            console.log(`   ✅ 已有 ${existing_files.length} 张图像，跳过`);
            continue;
        }

        try {
            // 搜索图像
            const photos = await search_images(food.query, IMAGES_PER_FOOD);
            
            if (photos.length === 0) {
                console.log(`   ⚠️  未找到图像`);
                continue;
            }

            console.log(`   找到 ${photos.length} 张图像`);

            // 下载图像
            let downloaded = 0;
            for (let i = 0; i < Math.min(photos.length, IMAGES_PER_FOOD); i++) {
                const photo = photos[i];
                const file_name = `pexels-${photo.id}.jpg`;
                const file_path = path.join(folder_path, file_name);

                // 跳过已存在的文件
                if (fs.existsSync(file_path)) {
                    continue;
                }

                try {
                    // 使用large尺寸（适合训练）
                    await download_image(photo.src.large, file_path);
                    downloaded++;
                    process.stdout.write(`\r   下载进度: ${downloaded}/${IMAGES_PER_FOOD}`);
                    
                    // 避免API限流
                    await sleep(200);
                } catch (error) {
                    total_failed++;
                }
            }

            console.log(`\n   ✅ 完成下载 ${downloaded} 张`);
            total_downloaded += downloaded;

        } catch (error) {
            console.log(`   ❌ 下载失败: ${error.message}`);
        }

        // 每个食物之间等待
        await sleep(1000);
    }

    // 总结
    console.log('\n' + '=' .repeat(60));
    console.log('📊 下载完成');
    console.log('=' .repeat(60));
    console.log(`✅ 成功下载: ${total_downloaded} 张`);
    console.log(`❌ 失败: ${total_failed} 张`);
    console.log();
    console.log('💡 下一步:');
    console.log('   1. 运行 node check_images.js 查看进度');
    console.log('   2. 补充自行拍摄的图像');
    console.log('   3. 上传到 Roboflow 进行标注');
    console.log('=' .repeat(60));
}

// 运行
main().catch(console.error);

