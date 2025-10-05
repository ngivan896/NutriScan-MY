#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Train with Local Data - 使用本地数据训练
使用你已经收集的3种食物数据开始训练
"""

import os
import sys
from pathlib import Path
import shutil
import warnings
warnings.filterwarnings('ignore')

print("=" * 60)
print("NutriScan MY - Train with Local Data")
print("=" * 60)
print()

# ============================================
# 1. Check Environment
# ============================================
print("Step 1/7: Check Environment")
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
        print("     [WARNING] Using CPU - training will be slow (2-4 hours)")
    print()
    
except ImportError as e:
    print(f"[ERROR] Missing dependencies: {e}")
    print("\nPlease install dependencies:")
    print("  pip install ultralytics pillow pyyaml torch")
    sys.exit(1)

# ============================================
# 2. Find Your Data
# ============================================
print("Step 2/7: Find Your Data")
print("-" * 60)

# Check different possible locations
possible_locations = [
    Path("../../raw_images"),
    Path("../../datasets/raw_images"),
    Path("../../datasets"),
    Path("../../"),
    Path("../../test_images"),  # Also check test_images
]

found_images = {}
food_categories = ["char_kway_teow", "wantan_mee", "chee_cheong_fun", "nasi_lemak"]

for location in possible_locations:
    if location.exists():
        print(f"Checking: {location}")
        for food in food_categories:
            food_path = location / food
            if food_path.exists():
                images = list(food_path.glob('*.jpg')) + list(food_path.glob('*.png'))
                if len(images) > 0:
                    found_images[food] = {
                        'path': food_path,
                        'images': images,
                        'count': len(images)
                    }
                    print(f"  [FOUND] {food}: {len(images)} images")

print(f"\nTotal food categories with data: {len(found_images)}")

if len(found_images) == 0:
    print("[ERROR] No images found!")
    print("\nPlease ensure your images are in one of these locations:")
    for food in food_categories:
        print(f"  - raw_images/{food}/")
        print(f"  - datasets/raw_images/{food}/")
        print(f"  - {food}/")
    print("\nOr tell me where your images are located.")
    sys.exit(1)

# ============================================
# 3. Create Dataset Structure
# ============================================
print("\nStep 3/7: Create Dataset Structure")
print("-" * 60)

# Create dataset directory
dataset_root = Path('local_dataset')
dataset_root.mkdir(exist_ok=True)

# Create train/val/test splits
for split in ['train', 'valid', 'test']:
    (dataset_root / split / 'images').mkdir(parents=True, exist_ok=True)
    (dataset_root / split / 'labels').mkdir(parents=True, exist_ok=True)

print(f"[OK] Dataset structure created at: {dataset_root}")

# ============================================
# 4. Copy and Split Images
# ============================================
print("\nStep 4/7: Copy and Split Images")
print("-" * 60)

def split_images(images, train_ratio=0.6, val_ratio=0.2):
    """Split images into train/val/test"""
    n_images = len(images)
    
    # Ensure at least 1 image in each split
    if n_images == 1:
        return images, [], []
    elif n_images == 2:
        return images[:1], images[1:], []
    elif n_images == 3:
        return images[:2], images[2:3], []
    else:
        n_train = max(1, int(n_images * train_ratio))
        n_val = max(1, int(n_images * val_ratio))
        
        train_imgs = images[:n_train]
        val_imgs = images[n_train:n_train + n_val]
        test_imgs = images[n_train + n_val:]
        
        return train_imgs, val_imgs, test_imgs

class_mapping = {}
for idx, (food_name, food_data) in enumerate(found_images.items()):
    class_mapping[food_name] = idx
    
    print(f"\nProcessing {food_name}:")
    images = food_data['images']
    
    # Split images
    train_imgs, val_imgs, test_imgs = split_images(images)
    
    print(f"  Train: {len(train_imgs)}, Val: {len(val_imgs)}, Test: {len(test_imgs)}")
    
    # Copy images to dataset
    for img_path in train_imgs:
        shutil.copy(img_path, dataset_root / 'train' / 'images' / img_path.name)
    
    for img_path in val_imgs:
        shutil.copy(img_path, dataset_root / 'valid' / 'images' / img_path.name)
    
    for img_path in test_imgs:
        shutil.copy(img_path, dataset_root / 'test' / 'images' / img_path.name)

total_train = len(list((dataset_root / 'train/images').glob('*')))
total_val = len(list((dataset_root / 'valid/images').glob('*')))
total_test = len(list((dataset_root / 'test/images').glob('*')))

print(f"\nTotal images:")
print(f"  Train: {total_train}")
print(f"  Valid: {total_val}")
print(f"  Test: {total_test}")

# ============================================
# 5. Create Labels
# ============================================
print("\nStep 5/7: Create Labels")
print("-" * 60)

def create_label_file(image_path, label_path, class_id):
    """Create a simple label file (covering the whole image)"""
    img = Image.open(image_path)
    width, height = img.size
    
    # YOLO format: class_id x_center y_center width height (normalized)
    # Cover whole image: center(0.5, 0.5), size(0.9, 0.9)
    label_content = f"{class_id} 0.5 0.5 0.9 0.9\n"
    
    with open(label_path, 'w') as f:
        f.write(label_content)

# Create labels for all splits
for split in ['train', 'valid', 'test']:
    images_dir = dataset_root / split / 'images'
    labels_dir = dataset_root / split / 'labels'
    
    for img_path in images_dir.glob('*'):
        # Determine class based on filename or path
        class_id = None
        for food_name, food_id in class_mapping.items():
            if food_name in img_path.name.lower() or food_name in str(img_path):
                class_id = food_id
                break
        
        if class_id is None:
            # Default to first class if not found
            class_id = 0
        
        label_path = labels_dir / f"{img_path.stem}.txt"
        create_label_file(img_path, label_path, class_id)
    
    label_count = len(list(labels_dir.glob('*.txt')))
    print(f"  {split}: {label_count} labels created")

print("\n[WARNING] These are simple labels covering the whole image.")
print("For better results, use proper bounding box annotations.")

# ============================================
# 6. Create Config File
# ============================================
print("\nStep 6/7: Create Config File")
print("-" * 60)

# Create YOLO config
data_config = {
    'path': str(dataset_root.absolute()),
    'train': 'train/images',
    'val': 'valid/images',
    'test': 'test/images',
    'nc': len(found_images),
    'names': list(found_images.keys())
}

data_yaml = dataset_root / 'data.yaml'
with open(data_yaml, 'w') as f:
    yaml.dump(data_config, f, default_flow_style=False)

print("[OK] data.yaml created")
print(f"Classes: {data_config['nc']}")
print(f"Names: {data_config['names']}")

# ============================================
# 7. Train Model
# ============================================
print("\nStep 7/7: Train Model")
print("-" * 60)

print("Starting training...")
print(f"Estimated time: {'1-2 hours (GPU)' if device == 'cuda' else '3-4 hours (CPU)'}")
print()

try:
    # Load model
    model = YOLO('yolov8n.pt')
    
    # Training configuration
    results = model.train(
        data=str(data_yaml),
        epochs=50,              # Reduced for faster training
        imgsz=640,
        batch=16 if device == 'cuda' else 4,
        device=device,
        project='../../results',
        name='nutriscan_local_v1',
        
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
        patience=20,            # Early stopping
        save=True,
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
    print("  2. Not enough data")
    print("  3. GPU/CPU compatibility issue")
    sys.exit(1)

# ============================================
# Summary
# ============================================
print("\n" + "=" * 60)
print("TRAINING SUMMARY")
print("=" * 60)
print()
print("Completed steps:")
print("  1. Environment check")
print("  2. Data discovery")
print("  3. Dataset structure creation")
print("  4. Image splitting")
print("  5. Label creation")
print("  6. Config file creation")
print("  7. Model training")
print()
print("Dataset info:")
print(f"  Food categories: {len(found_images)}")
print(f"  Total images: {total_train + total_val + total_test}")
print(f"  Classes: {list(found_images.keys())}")
print()
print("Generated files:")
print(f"  - Training results: ../../results/nutriscan_local_v1/")
print(f"  - Model file: ../../results/nutriscan_local_v1/weights/best.pt")
print(f"  - Local dataset: {dataset_root}")
print()
print("Next steps:")
print("  1. Check training results")
print("  2. Test model on new images")
print("  3. Collect more data for better accuracy")
print("  4. Integrate into mobile app")
print()
print("=" * 60)
print("Training completed successfully!")
print("=" * 60)
