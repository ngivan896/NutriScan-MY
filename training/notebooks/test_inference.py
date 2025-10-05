#!/usr/bin/env python3
"""
Model Inference Test Script
测试模型推理功能
"""

import argparse
import json
import sys
from pathlib import Path
import cv2
import numpy as np

def test_model_inference(model_id, image_path):
    """
    测试模型推理
    """
    try:
        # 添加项目根目录到Python路径
        project_root = Path(__file__).parent.parent.parent
        sys.path.insert(0, str(project_root))
        
        from ultralytics import YOLO
        
        print(f"🔍 正在测试模型推理...")
        print(f"🤖 模型ID: {model_id}")
        print(f"🖼️ 图片路径: {image_path}")
        
        # 检查模型文件是否存在
        model_path = Path(f"models/{model_id}/best.pt")
        if not model_path.exists():
            # 尝试其他可能的模型文件
            model_path = Path(f"models/{model_id}/last.pt")
            if not model_path.exists():
                raise Exception(f"模型文件不存在: {model_id}")
        
        # 加载模型
        model = YOLO(str(model_path))
        
        # 检查图片是否存在
        if not Path(image_path).exists():
            raise Exception(f"图片文件不存在: {image_path}")
        
        # 进行推理
        results = model(image_path)
        
        # 处理结果
        predictions = []
        for result in results:
            if result.boxes is not None:
                boxes = result.boxes.xyxy.cpu().numpy()
                confidences = result.boxes.conf.cpu().numpy()
                classes = result.boxes.cls.cpu().numpy()
                
                for i, (box, conf, cls) in enumerate(zip(boxes, confidences, classes)):
                    predictions.append({
                        "bbox": box.tolist(),
                        "confidence": float(conf),
                        "class": int(cls),
                        "class_name": model.names[int(cls)]
                    })
        
        print(f"✅ 推理完成!")
        print(f"📊 检测到 {len(predictions)} 个目标")
        
        # 返回结果
        return {
            "success": True,
            "predictions": predictions,
            "model": model_id,
            "image": image_path,
            "count": len(predictions)
        }
        
    except Exception as e:
        print(f"❌ 推理失败: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

def main():
    parser = argparse.ArgumentParser(description='测试模型推理')
    parser.add_argument('--model-id', required=True, help='模型ID')
    parser.add_argument('--image', required=True, help='图片路径')
    
    args = parser.parse_args()
    
    result = test_model_inference(args.model_id, args.image)
    
    print(json.dumps(result, indent=2))
    
    if result["success"]:
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
