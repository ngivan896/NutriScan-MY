@echo off
echo ============================================
echo 启动 Jupyter Notebook
echo ============================================
echo.

cd /d "C:\Users\ngiva\Desktop\NutriScan MY\training\notebooks"

echo 当前目录: %CD%
echo.

echo 正在启动 Jupyter Notebook...
echo 浏览器会自动打开，或手动访问显示的链接
echo.
echo 提示: 要停止服务器，按 Ctrl+C 两次
echo ============================================
echo.

jupyter notebook

pause

