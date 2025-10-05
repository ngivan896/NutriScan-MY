#!/usr/bin/env python3
"""
设置真实数据的脚本
连接Roboflow并下载数据集
"""

import os
import sys
from pathlib import Path

def setup_environment():
    """设置环境变量"""
    print("Setting up environment variables...")
    
    # 创建.env文件
    env_content = """# NutriScan Backend Configuration
PORT=3001

# Roboflow Configuration - 请替换为你的真实API密钥
ROBOFLOW_API_KEY=your_roboflow_api_key_here
ROBOFLOW_PROJECT=malaysian-food-detection-wy3kt
ROBOFLOW_VERSION=2

# Gemini API Configuration - 请替换为你的真实API密钥
GEMINI_API_KEY=your_gemini_api_key_here

# Training Configuration
TRAINING_DEVICE=cpu
DEFAULT_EPOCHS=100
DEFAULT_BATCH_SIZE=16

# File Upload Configuration
MAX_FILE_SIZE=52428800
ALLOWED_IMAGE_TYPES=jpg,jpeg,png,webp

# Development Mode
NODE_ENV=development
"""
    
    with open('.env', 'w', encoding='utf-8') as f:
        f.write(env_content)
    
    print("SUCCESS: .env file created, please edit and add your real API keys")

def download_roboflow_data():
    """下载Roboflow数据集"""
    print("\nDownloading Roboflow dataset...")
    
    try:
        from roboflow import Roboflow
        
        # 检查API密钥
        api_key = os.getenv('ROBOFLOW_API_KEY')
        if not api_key or api_key == 'your_roboflow_api_key_here':
            print("ERROR: Please set ROBOFLOW_API_KEY in .env file first")
            return False
        
        # 下载数据集
        rf = Roboflow(api_key=api_key)
        project = rf.workspace("malaysian-food-detection").project("malaysian-food-detection-wy3kt")
        dataset = project.version(2).download("yolov8")
        
        print(f"SUCCESS: Dataset downloaded: {dataset.location}")
        return True
        
    except Exception as e:
        print(f"ERROR: Download failed: {e}")
        return False

def copy_existing_data():
    """复制现有的测试数据"""
    print("\nCopying existing test data...")
    
    # 复制test_images到raw_images
    test_images_dir = Path("test_images")
    raw_images_dir = Path("datasets/raw_images")
    
    if test_images_dir.exists():
        import shutil
        
        for item in test_images_dir.iterdir():
            if item.is_dir():
                target_dir = raw_images_dir / item.name
                target_dir.mkdir(parents=True, exist_ok=True)
                
                for img_file in item.glob("*.jpg"):
                    shutil.copy2(img_file, target_dir)
                    print(f"Copied: {img_file} -> {target_dir}")
        
        print("SUCCESS: Test data copied")
    else:
        print("WARNING: test_images directory not found")

def main():
    print("NutriScan Real Data Setup Wizard")
    print("=" * 50)
    
    # 1. 设置环境
    setup_environment()
    
    # 2. 复制现有数据
    copy_existing_data()
    
    # 3. 提示用户设置API密钥
    print("\n" + "=" * 50)
    print("Next Steps:")
    print("1. Edit .env file and add your real API keys")
    print("2. Run: python setup_real_data.py --download-roboflow")
    print("3. Restart Web UI server")
    print("\nTip: Or use existing data for development testing")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--download-roboflow":
        download_roboflow_data()
    else:
        main()
