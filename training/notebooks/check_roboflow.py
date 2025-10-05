#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Check Roboflow Project Status
检查Roboflow项目状态和数据集
"""

from roboflow import Roboflow

print("=" * 60)
print("Roboflow Project Status Check")
print("=" * 60)

try:
    # Initialize Roboflow
    print("Connecting to Roboflow...")
    rf = Roboflow(api_key="BwTemPbP39LHLFH4teds")
    
    # Try to access the specific project directly
    print("\nAccessing project: malaysian-food-detection-wy3kt")
    project = rf.workspace("malaysian-food-detection").project("malaysian-food-detection-wy3kt")
    
    print("Project found successfully!")
    print(f"Project name: {project.name}")
    
    # Check versions
    print("\nChecking dataset versions...")
    versions = project.versions()
    print(f"Available versions: {len(versions)}")
    
    if len(versions) == 0:
        print("\n[WARNING] No dataset versions found!")
        print("\nThis means:")
        print("  1. Dataset hasn't been created yet")
        print("  2. Images haven't been uploaded")
        print("  3. Dataset hasn't been generated")
        print("\nNext steps:")
        print("  1. Upload images to Roboflow")
        print("  2. Create annotations")
        print("  3. Generate dataset version")
    else:
        print("\nAvailable versions:")
        for version in versions:
            print(f"  - Version {version.version}: {version.name}")
        
        # Try to download the latest version
        latest = versions[-1]
        print(f"\nTrying to download version {latest.version}...")
        dataset = latest.download("yolov8")
        print(f"[SUCCESS] Downloaded to: {dataset.location}")
        
        # Show dataset info
        from pathlib import Path
        dataset_path = Path(dataset.location)
        train_images = list((dataset_path / 'train/images').glob('*'))
        valid_images = list((dataset_path / 'valid/images').glob('*'))
        
        print(f"\nDataset info:")
        print(f"  Train images: {len(train_images)}")
        print(f"  Valid images: {len(valid_images)}")
        
        if len(train_images) > 0:
            print("\n[READY] Dataset is ready for training!")
        else:
            print("\n[WARNING] Dataset is empty!")
    
except Exception as e:
    print(f"[ERROR] Error: {e}")
    print("\nPossible solutions:")
    print("  1. Check API key is correct")
    print("  2. Check project name is correct")
    print("  3. Ensure you have access to the project")
    print("  4. Create the project if it doesn't exist")

print("\n" + "=" * 60)
print("Check completed")
print("=" * 60)