#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Train from Roboflow Dataset - 从Roboflow训练脚本
直接下载Roboflow数据集并开始训练
"""

import os
import sys
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

print("=" * 60)
print("NutriScan MY - Train from Roboflow Dataset")
print("=" * 60)
print()

# ============================================
# 1. Check Environment
# ============================================
print("Step 1/8: Check Environment")
print("-" * 60)

try:
    import torch
    import ultralytics
    from ultralytics import YOLO
    from roboflow import Roboflow
    from PIL import Image
    import yaml
    
    print(f"[OK] Ultralytics: {ultralytics.__version__}")
    print(f"[OK] PyTorch: {torch.__version__}")
    
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"[OK] Device: {device}")
    if device == 'cuda':
        print(f"     GPU: {torch.cuda.get_device_name(0)}")
    else:
        print("     [WARNING] Using CPU - training will be slow (2-4 hours)")
    print()
    
except ImportError as e:
    print(f"[ERROR] Missing dependencies: {e}")
    print("\nPlease install dependencies:")
    print("  pip install ultralytics pillow pyyaml torch roboflow")
    sys.exit(1)

# ============================================
# 2. Download Dataset from Roboflow
# ============================================
print("Step 2/8: Download Dataset from Roboflow")
print("-" * 60)

try:
    # Initialize Roboflow
    print("Connecting to Roboflow...")
    rf = Roboflow(api_key="BwTemPbP39LHLFH4teds")
    
    # Access project
    print("Accessing Malaysian Food Detection project...")
    project = rf.workspace("malaysian-food-detection").project("malaysian-food-detection-wy3kt")
    
    # Check available versions
    print("Checking available versions...")
    versions = project.versions()
    print(f"Available versions: {[v.version for v in versions]}")
    
    # Use version 2 (has proper train/val/test split)
    try:
        version_2 = project.version(2)
        print(f"Using version 2 (proper data split)")
        latest_version = version_2
    except:
        # Fallback to latest version
        latest_version = versions[-1]
        print(f"Using latest version: {latest_version.version}")
    
    # Download dataset
    print("Downloading dataset...")
    dataset = latest_version.download("yolov8")
    
    print(f"[OK] Dataset downloaded to: {dataset.location}")
    
    # Check dataset structure
    dataset_path = Path(dataset.location)
    data_yaml = dataset_path / "data.yaml"
    
    print(f"[OK] Dataset path: {dataset_path}")
    print(f"[OK] Config file: {data_yaml}")
    
except Exception as e:
    print(f"[ERROR] Failed to download dataset: {e}")
    print("\nPossible reasons:")
    print("  1. API key is incorrect")
    print("  2. Project name is wrong")
    print("  3. Network connection issue")
    sys.exit(1)

# ============================================
# 3. Verify Dataset Structure
# ============================================
print("\nStep 3/8: Verify Dataset Structure")
print("-" * 60)

# Check if files exist
train_images = list((dataset_path / 'train/images').glob('*'))
valid_images = list((dataset_path / 'valid/images').glob('*'))
test_images = list((dataset_path / 'test/images').glob('*'))

print(f"Train images: {len(train_images)}")
print(f"Valid images: {len(valid_images)}")
print(f"Test images: {len(test_images)}")

if len(train_images) == 0:
    print("[ERROR] No training images found!")
    sys.exit(1)

# Read data.yaml
try:
    with open(data_yaml, 'r') as f:
        data_config = yaml.safe_load(f)
    
    print(f"\nDataset info:")
    print(f"  Classes: {data_config['nc']}")
    print(f"  Names: {data_config['names']}")
    
except Exception as e:
    print(f"[ERROR] Cannot read data.yaml: {e}")
    sys.exit(1)

# ============================================
# 4. Preview Sample Images
# ============================================
print("\nStep 4/8: Preview Sample Images")
print("-" * 60)

try:
    import matplotlib.pyplot as plt
    import cv2
    import random
    
    # Show 4 sample images
    sample_images = random.sample(train_images, min(4, len(train_images)))
    
    fig, axes = plt.subplots(2, 2, figsize=(12, 12))
    axes = axes.ravel()
    
    for idx, img_path in enumerate(sample_images):
        img = cv2.imread(str(img_path))
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        axes[idx].imshow(img)
        axes[idx].set_title(img_path.name)
        axes[idx].axis('off')
    
    plt.tight_layout()
    plt.savefig('sample_images.png', dpi=100, bbox_inches='tight')
    plt.close()
    
    print("[OK] Sample images saved as 'sample_images.png'")
    
except Exception as e:
    print(f"[WARNING] Could not create preview: {e}")
    print("Continuing without preview...")

# ============================================
# 5. Train Model
# ============================================
print("\nStep 5/8: Train YOLOv8 Model")
print("-" * 60)

print("Starting training...")
print(f"Estimated time: {'1-2 hours (GPU)' if device == 'cuda' else '3-4 hours (CPU)'}")
print()

try:
    # Load model
    model = YOLO('yolov8n.pt')  # Start with nano model
    
    # Training configuration
    results = model.train(
        data=str(data_yaml),
        epochs=100,              # Full training
        imgsz=640,
        batch=16 if device == 'cuda' else 4,  # Adjust based on device
        device=device,
        project='../../results',
        name='nutriscan_roboflow_v1',
        
        # Hyperparameters
        lr0=0.01,
        lrf=0.01,
        momentum=0.937,
        weight_decay=0.0005,
        warmup_epochs=3.0,
        warmup_momentum=0.8,
        
        # Augmentation
        hsv_h=0.015,
        hsv_s=0.7,
        hsv_v=0.4,
        degrees=0.0,
        translate=0.1,
        scale=0.5,
        fliplr=0.5,
        mosaic=1.0,
        
        # Training settings
        patience=50,             # Early stopping
        save=True,
        save_period=10,          # Save checkpoint every 10 epochs
        plots=True,
        verbose=True
    )
    
    print()
    print("=" * 60)
    print("[SUCCESS] Training completed!")
    print("=" * 60)
    
except Exception as e:
    print()
    print("=" * 60)
    print(f"[ERROR] Training failed: {e}")
    print("=" * 60)
    print("\nPossible reasons:")
    print("  1. Insufficient memory (try smaller batch size)")
    print("  2. Dataset format issue")
    print("  3. GPU/CPU compatibility issue")
    sys.exit(1)

# ============================================
# 6. Evaluate Model
# ============================================
print("\nStep 6/8: Evaluate Model Performance")
print("-" * 60)

try:
    # Evaluate on validation set
    metrics = model.val()
    
    print("Performance Metrics:")
    print(f"  mAP50: {metrics.box.map50:.3f}")
    print(f"  mAP50-95: {metrics.box.map:.3f}")
    print(f"  Precision: {metrics.box.p:.3f}")
    print(f"  Recall: {metrics.box.r:.3f}")
    
    # Check if target is met
    if metrics.box.map50 > 0.80:
        print("\n[SUCCESS] Target achieved! mAP50 > 80%")
    else:
        print(f"\n[WARNING] Need improvement. Current: {metrics.box.map50:.1%}, Target: 80%")
        print("Consider:")
        print("  - More training epochs")
        print("  - Better data quality")
        print("  - Data augmentation")
    
except Exception as e:
    print(f"[ERROR] Evaluation failed: {e}")

# ============================================
# 7. Test Inference Speed
# ============================================
print("\nStep 7/8: Test Inference Speed")
print("-" * 60)

try:
    import time
    import numpy as np
    
    # Load best model
    best_model = YOLO('../../results/nutriscan_roboflow_v1/weights/best.pt')
    
    # Test on sample image
    test_image = train_images[0]
    
    # Warmup
    for _ in range(5):
        _ = best_model(test_image, verbose=False)
    
    # Benchmark
    times = []
    for _ in range(20):
        start = time.time()
        _ = best_model(test_image, verbose=False)
        times.append((time.time() - start) * 1000)  # Convert to ms
    
    avg_time = np.mean(times)
    print(f"Inference speed: {avg_time:.2f}ms (avg of 20 runs)")
    
    if avg_time < 100:
        print("[SUCCESS] Target achieved! Inference < 100ms")
    else:
        print(f"[WARNING] Need optimization. Current: {avg_time:.1f}ms, Target: < 100ms")
    
except Exception as e:
    print(f"[ERROR] Speed test failed: {e}")

# ============================================
# 8. Export to TensorFlow Lite
# ============================================
print("\nStep 8/8: Export to TensorFlow Lite")
print("-" * 60)

try:
    # Export to TFLite
    tflite_model = model.export(format='tflite', imgsz=640, int8=False)
    
    print(f"[OK] TFLite model exported: {tflite_model}")
    
    # Check model size
    model_size = os.path.getsize(tflite_model) / (1024 * 1024)  # MB
    print(f"Model size: {model_size:.2f} MB")
    
    if model_size < 20:
        print("[SUCCESS] Target achieved! Model < 20MB")
    else:
        print(f"[WARNING] Model too large. Current: {model_size:.1f}MB, Target: < 20MB")
    
    # Save to models directory
    import shutil
    output_dir = Path('../../models/nutriscan_roboflow_v1')
    output_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy(tflite_model, output_dir / 'model.tflite')
    
    print(f"[OK] Model saved to: {output_dir / 'model.tflite'}")
    
except Exception as e:
    print(f"[ERROR] TFLite export failed: {e}")

# ============================================
# Summary
# ============================================
print("\n" + "=" * 60)
print("TRAINING SUMMARY")
print("=" * 60)
print()
print("Completed steps:")
print("  1. Environment check")
print("  2. Dataset download from Roboflow")
print("  3. Dataset verification")
print("  4. Sample image preview")
print("  5. Model training (100 epochs)")
print("  6. Performance evaluation")
print("  7. Inference speed test")
print("  8. TFLite export")
print()
print("Generated files:")
print(f"  - Training results: ../../results/nutriscan_roboflow_v1/")
print(f"  - Model file: ../../models/nutriscan_roboflow_v1/model.tflite")
print(f"  - Sample images: sample_images.png")
print()
print("Next steps:")
print("  1. Test the TFLite model on mobile device")
print("  2. Integrate into React Native app")
print("  3. Implement Gemini Vision API for nutrition analysis")
print()
print("=" * 60)
print("Training completed successfully!")
print("=" * 60)
