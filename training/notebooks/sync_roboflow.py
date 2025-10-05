#!/usr/bin/env python3
"""
Roboflow Dataset Sync Script
同步Roboflow数据集到本地
"""

import argparse
import os
import sys
import json
from pathlib import Path

def sync_roboflow_dataset(api_key, project_id, version='latest'):
    """
    从Roboflow同步数据集
    """
    try:
        # 添加项目根目录到Python路径
        project_root = Path(__file__).parent.parent.parent
        sys.path.insert(0, str(project_root))
        
        from roboflow import Roboflow
        
        print(f"🔄 正在同步Roboflow数据集...")
        print(f"📁 项目ID: {project_id}")
        print(f"📋 版本: {version}")
        
        # 初始化Roboflow
        rf = Roboflow(api_key=api_key)
        
        # 获取项目
        project = rf.workspace("malaysian-food-detection").project(project_id)
        
        # 获取指定版本
        if version == 'latest':
            versions = project.list_versions()
            if not versions:
                raise Exception("没有找到可用的版本")
            version_obj = versions[-1]
            print(f"📋 使用最新版本: {version_obj.version}")
        else:
            version_obj = project.version(int(version))
            print(f"📋 使用指定版本: {version_obj.version}")
        
        # 下载数据集
        dataset = version_obj.download("yolov8")
        
        print(f"✅ 数据集同步完成!")
        print(f"📂 下载位置: {dataset.location}")
        print(f"📊 数据集信息:")
        print(f"   - 训练集: {len(dataset.train)} 张图片")
        print(f"   - 验证集: {len(dataset.val)} 张图片")
        if hasattr(dataset, 'test') and dataset.test:
            print(f"   - 测试集: {len(dataset.test)} 张图片")
        
        # 返回数据集信息
        return {
            "success": True,
            "location": dataset.location,
            "train_count": len(dataset.train),
            "val_count": len(dataset.val),
            "test_count": len(dataset.test) if hasattr(dataset, 'test') and dataset.test else 0,
            "version": version_obj.version
        }
        
    except Exception as e:
        print(f"❌ 同步失败: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

def main():
    parser = argparse.ArgumentParser(description='同步Roboflow数据集')
    parser.add_argument('--api-key', required=True, help='Roboflow API密钥')
    parser.add_argument('--project-id', required=True, help='项目ID')
    parser.add_argument('--version', default='latest', help='版本号 (默认: latest)')
    
    args = parser.parse_args()
    
    result = sync_roboflow_dataset(args.api_key, args.project_id, args.version)
    
    if result["success"]:
        print(json.dumps(result, indent=2))
        sys.exit(0)
    else:
        print(json.dumps(result, indent=2))
        sys.exit(1)

if __name__ == "__main__":
    main()
