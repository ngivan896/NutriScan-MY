@echo off
echo ========================================
echo NutriScan AI Web UI 启动脚本
echo ========================================
echo.

echo 检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo 进入Web UI目录...
cd web_ui

echo 检查依赖...
if not exist node_modules (
    echo 安装后端依赖...
    npm install
)

if not exist client\node_modules (
    echo 安装前端依赖...
    cd client
    npm install
    cd ..
)

echo 构建前端...
cd client
npm run build
if errorlevel 1 (
    echo 错误: 前端构建失败
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo 启动Web UI服务器...
echo ========================================
echo.
echo 服务器地址: http://localhost:3001
echo 按 Ctrl+C 停止服务器
echo.

node server.js

pause
