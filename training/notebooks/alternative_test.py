#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Quick Test Training Script - Python版本
如果Jupyter有问题，可以直接运行这个Python脚本
"""

import os
import sys
from pathlib import Path
import shutil
import warnings
warnings.filterwarnings('ignore')

print("=" * 60)
print("NutriScan MY - Quick Test Training (Python Script)")
print("=" * 60)
print()

# ============================================
# 1. 检查环境
# ============================================
print("Step 1/6: Check Environment")
print("-" * 60)

try:
    import torch
    import ultralytics
    from ultralytics import YOLO
    from PIL import Image
    import yaml
    
    print(f"[OK] Ultralytics: {ultralytics.__version__}")
    print(f"[OK] PyTorch: {torch.__version__}")
    
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"[OK] Device: {device}")
    if device == 'cuda':
        print(f"     GPU: {torch.cuda.get_device_name(0)}")
    else:
        print("     [WARNING] Using CPU - training will be slow (5-10 min)")
    print()
    
except ImportError as e:
    print(f"[ERROR] Missing dependencies: {e}")
    print("\nPlease install dependencies:")
    print("  pip install ultralytics pillow pyyaml torch")
    sys.exit(1)

# ============================================
# 2. Prepare Dataset
# ============================================
print("\nStep 2/6: Prepare Test Dataset")
print("-" * 60)

dataset_root = Path('test_dataset')
dataset_root.mkdir(exist_ok=True)

# 创建目录结构
for split in ['train', 'valid', 'test']:
    (dataset_root / split / 'images').mkdir(parents=True, exist_ok=True)
    (dataset_root / split / 'labels').mkdir(parents=True, exist_ok=True)

# 复制测试图像
test_images_dir = Path('../../test_images/nasi_lemak')
if not test_images_dir.exists():
    print(f"[ERROR] Cannot find test images: {test_images_dir.absolute()}")
    print("\nPlease ensure test_images/nasi_lemak/ exists with 3 images")
    sys.exit(1)

images = list(test_images_dir.glob('*.jpg'))
if len(images) < 3:
    print(f"[ERROR] Not enough images! Found {len(images)}, need at least 3")
    sys.exit(1)

print(f"Found {len(images)} test images")

# Split images
train_images = images[:2]
val_images = images[2:3]

for img in train_images:
    shutil.copy(img, dataset_root / 'train' / 'images' / img.name)

for img in val_images:
    shutil.copy(img, dataset_root / 'valid' / 'images' / img.name)
    shutil.copy(img, dataset_root / 'test' / 'images' / img.name)

print(f"[OK] Training set: {len(train_images)} images")
print(f"[OK] Validation set: {len(val_images)} images")

# ============================================
# 3. Create Labels
# ============================================
print("\nStep 3/6: Create Dummy Labels")
print("-" * 60)

def create_dummy_label(image_path, label_path, class_id=0):
    """创建覆盖整张图的虚拟标注"""
    img = Image.open(image_path)
    width, height = img.size
    label_content = f"{class_id} 0.5 0.5 0.9 0.9\n"
    with open(label_path, 'w') as f:
        f.write(label_content)

for split in ['train', 'valid', 'test']:
    images_dir = dataset_root / split / 'images'
    labels_dir = dataset_root / split / 'labels'
    
    for img_path in images_dir.glob('*.jpg'):
        label_path = labels_dir / f"{img_path.stem}.txt"
        create_dummy_label(img_path, label_path, class_id=0)
    
    label_count = len(list(labels_dir.glob('*.txt')))
    print(f"[OK] {split}: Created {label_count} labels")

print("\n[WARNING] These are dummy labels, for testing only!")

# ============================================
# 4. Create Config
# ============================================
print("\nStep 4/6: Create data.yaml Config")
print("-" * 60)

data_config = {
    'path': str(dataset_root.absolute()),
    'train': 'train/images',
    'val': 'valid/images',
    'test': 'test/images',
    'nc': 1,
    'names': ['nasi_lemak']
}

data_yaml = dataset_root / 'data.yaml'
with open(data_yaml, 'w') as f:
    yaml.dump(data_config, f, default_flow_style=False)

print("[OK] data.yaml created")

# ============================================
# 5. Train Model
# ============================================
print("\nStep 5/6: Quick Training Test")
print("-" * 60)
print("Starting training...")
print(f"Estimated time: {'1-2 min (GPU)' if device == 'cuda' else '5-10 min (CPU)'}")
print()

try:
    model = YOLO('yolov8n.pt')
    
    results = model.train(
        data=str(data_yaml),
        epochs=3,
        imgsz=640,
        batch=1,
        device=device,
        project='test_runs',
        name='quick_test',
        patience=0,
        save=True,
        plots=False,
        verbose=True,
        hsv_h=0,
        hsv_s=0,
        hsv_v=0,
        mosaic=0
    )
    
    print()
    print("=" * 60)
    print("[SUCCESS] Training test completed!")
    print("=" * 60)
    
except Exception as e:
    print()
    print("=" * 60)
    print(f"[ERROR] Training failed: {e}")
    print("=" * 60)
    print("\nPossible reasons:")
    print("  1. Insufficient memory (try closing other programs)")
    print("  2. PyTorch installation issue")
    print("  3. Image format problem")
    sys.exit(1)

# ============================================
# 6. Test Inference
# ============================================
print("\nStep 6/6: Test Inference")
print("-" * 60)

try:
    trained_model = YOLO('test_runs/quick_test/weights/best.pt')
    test_img = list((dataset_root / 'test/images').glob('*.jpg'))[0]
    
    results = trained_model(test_img)
    
    print("[OK] Inference test successful!")
    print(f"     Model file: test_runs/quick_test/weights/best.pt")
    print(f"     Test image: {test_img.name}")
    print()
    
except Exception as e:
    print(f"[ERROR] Inference test failed: {e}")
    print()

# ============================================
# Summary
# ============================================
print("=" * 60)
print("TEST SUMMARY")
print("=" * 60)
print()
print("Completed steps:")
print("  1. Environment check")
print("  2. Data preparation")
print("  3. Label creation")
print("  4. Config file")
print("  5. Model training (3 epochs)")
print("  6. Inference test")
print()
print("[IMPORTANT]")
print("  - This is just a test, model won't have real recognition ability")
print("  - Need 1000+ images to train a good model")
print("  - Continue with Week 2 data collection!")
print()
print("Generated files:")
print(f"  - Test data: {dataset_root.absolute()}")
print(f"  - Training results: test_runs/quick_test/")
print(f"  - Model file: test_runs/quick_test/weights/best.pt")
print()
print("Next steps:")
print("  1. Continue data collection (goal: 1000+ images)")
print("  2. Upload to Roboflow and annotate")
print("  3. Week 3: Train with full dataset")
print()
print("=" * 60)
print("Test completed!")
print("=" * 60)

