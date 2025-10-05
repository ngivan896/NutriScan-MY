#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
模型数据分析脚本
用于查看训练后的模型性能和数据
"""

import os
import pandas as pd
import yaml
from ultralytics import YOLO
import torch

def analyze_training_results():
    """分析训练结果"""
    print("=" * 60)
    print("🔍 模型数据分析报告")
    print("=" * 60)
    
    # 检查结果文件
    results_file = "test_runs/quick_test/results.csv"
    if os.path.exists(results_file):
        print("\n📊 训练性能数据:")
        print("-" * 40)
        
        # 读取CSV数据
        df = pd.read_csv(results_file)
        
        # 显示最后一轮的数据
        last_epoch = df.iloc[-1]
        print(f"最终轮次: {int(last_epoch['epoch'])}")
        print(f"训练时间: {last_epoch['time']:.2f}秒")
        print(f"训练损失 (Box): {last_epoch['train/box_loss']:.4f}")
        print(f"训练损失 (分类): {last_epoch['train/cls_loss']:.4f}")
        print(f"训练损失 (DFL): {last_epoch['train/dfl_loss']:.4f}")
        print(f"验证损失 (Box): {last_epoch['val/box_loss']:.4f}")
        print(f"验证损失 (分类): {last_epoch['val/cls_loss']:.4f}")
        print(f"验证损失 (DFL): {last_epoch['val/dfl_loss']:.4f}")
        
        print("\n📈 性能指标:")
        print("-" * 40)
        print(f"精确度 (Precision): {last_epoch['metrics/precision(B)']:.4f}")
        print(f"召回率 (Recall): {last_epoch['metrics/recall(B)']:.4f}")
        print(f"mAP@0.5: {last_epoch['metrics/mAP50(B)']:.4f}")
        print(f"mAP@0.5:0.95: {last_epoch['metrics/mAP50-95(B)']:.4f}")
        
        # 显示所有轮次的数据
        print("\n📋 完整训练历史:")
        print("-" * 40)
        print(df.to_string(index=False))
        
    else:
        print("❌ 找不到结果文件")

def analyze_model_weights():
    """分析模型权重"""
    print("\n" + "=" * 60)
    print("🏋️ 模型权重分析")
    print("=" * 60)
    
    weights_dir = "test_runs/quick_test/weights/"
    
    if os.path.exists(weights_dir):
        best_model = os.path.join(weights_dir, "best.pt")
        last_model = os.path.join(weights_dir, "last.pt")
        
        print(f"\n📁 模型文件:")
        print(f"最佳模型: {best_model}")
        print(f"最终模型: {last_model}")
        
        # 加载模型信息
        try:
            model = YOLO(best_model)
            print(f"\n✅ 模型加载成功!")
            print(f"模型类型: {type(model.model).__name__}")
            print(f"设备: {model.device}")
            
            # 获取模型信息
            model_info = model.model
            total_params = sum(p.numel() for p in model_info.parameters())
            trainable_params = sum(p.numel() for p in model_info.parameters() if p.requires_grad)
            
            print(f"\n🔢 模型参数:")
            print(f"总参数数量: {total_params:,}")
            print(f"可训练参数: {trainable_params:,}")
            print(f"模型大小: {os.path.getsize(best_model) / (1024*1024):.2f} MB")
            
        except Exception as e:
            print(f"❌ 模型加载失败: {e}")
    else:
        print("❌ 找不到权重文件")

def analyze_dataset():
    """分析数据集"""
    print("\n" + "=" * 60)
    print("📂 数据集分析")
    print("=" * 60)
    
    # 检查数据集配置
    data_yaml = "test_dataset/data.yaml"
    if os.path.exists(data_yaml):
        with open(data_yaml, 'r', encoding='utf-8') as f:
            data_config = yaml.safe_load(f)
        
        print(f"\n📋 数据集配置:")
        print(f"类别数量: {data_config['nc']}")
        print(f"类别名称: {data_config['names']}")
        
        # 统计图像数量
        train_images = len([f for f in os.listdir("test_dataset/train/images") if f.endswith(('.jpg', '.png', '.jpeg'))])
        val_images = len([f for f in os.listdir("test_dataset/valid/images") if f.endswith(('.jpg', '.png', '.jpeg'))])
        test_images = len([f for f in os.listdir("test_dataset/test/images") if f.endswith(('.jpg', '.png', '.jpeg'))])
        
        print(f"\n📊 图像统计:")
        print(f"训练集: {train_images} 张")
        print(f"验证集: {val_images} 张")
        print(f"测试集: {test_images} 张")
        print(f"总计: {train_images + val_images + test_images} 张")
        
        # 统计标签数量
        train_labels = len([f for f in os.listdir("test_dataset/train/labels") if f.endswith('.txt')])
        val_labels = len([f for f in os.listdir("test_dataset/valid/labels") if f.endswith('.txt')])
        test_labels = len([f for f in os.listdir("test_dataset/test/labels") if f.endswith('.txt')])
        
        print(f"\n🏷️ 标签统计:")
        print(f"训练标签: {train_labels} 个")
        print(f"验证标签: {val_labels} 个")
        print(f"测试标签: {test_labels} 个")
        print(f"总计: {train_labels + val_labels + test_labels} 个")
        
    else:
        print("❌ 找不到数据集配置文件")

def test_model_inference():
    """测试模型推理"""
    print("\n" + "=" * 60)
    print("🧪 模型推理测试")
    print("=" * 60)
    
    best_model_path = "test_runs/quick_test/weights/best.pt"
    
    if os.path.exists(best_model_path):
        try:
            model = YOLO(best_model_path)
            
            # 测试一张图像
            test_image = "test_dataset/test/images/pexels-suhairytriyadhi-11912788.jpg"
            if os.path.exists(test_image):
                print(f"\n🖼️ 测试图像: {test_image}")
                
                results = model(test_image, conf=0.1, verbose=False)
                
                print(f"检测结果:")
                for r in results:
                    boxes = r.boxes
                    if boxes is not None:
                        print(f"检测到 {len(boxes)} 个对象")
                        for i, box in enumerate(boxes):
                            cls_id = int(box.cls[0])
                            conf = float(box.conf[0])
                            print(f"  对象 {i+1}: 类别={cls_id}, 置信度={conf:.3f}")
                    else:
                        print("未检测到任何对象")
            else:
                print("❌ 找不到测试图像")
                
        except Exception as e:
            print(f"❌ 推理测试失败: {e}")
    else:
        print("❌ 找不到训练好的模型")

def main():
    """主函数"""
    print("🚀 开始分析模型数据...")
    
    # 检查环境
    print(f"Python版本: {torch.__version__}")
    print(f"设备: {'CUDA' if torch.cuda.is_available() else 'CPU'}")
    
    # 分析各个部分
    analyze_training_results()
    analyze_model_weights()
    analyze_dataset()
    test_model_inference()
    
    print("\n" + "=" * 60)
    print("✅ 分析完成!")
    print("=" * 60)

if __name__ == "__main__":
    main()
