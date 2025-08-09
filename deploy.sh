#!/bin/bash

# 街聲專屬碼生成器 - Render 部署腳本
# StreetVoice Discount Code Generator - Render Deployment Script

set -e  # 遇到錯誤立即停止

echo "🚀 開始部署街聲專屬碼生成器到 Render..."
echo "🚀 Starting deployment of StreetVoice Discount Code Generator to Render..."

# 顯示 Python 版本
echo "📋 檢查 Python 版本..."
python3 --version

# 升級 pip
echo "📦 升級 pip..."
python3 -m pip install --upgrade pip

# 安裝依賴套件
echo "📋 安裝 Python 依賴套件..."
python3 -m pip install -r requirements.txt

# 檢查重要檔案是否存在
echo "🔍 檢查重要檔案..."
if [ ! -f "app.py" ]; then
    echo "❌ 錯誤：找不到 app.py"
    exit 1
fi

if [ ! -f "requirements.txt" ]; then
    echo "❌ 錯誤：找不到 requirements.txt"
    exit 1
fi

if [ ! -d "templates" ]; then
    echo "❌ 錯誤：找不到 templates 目錄"
    exit 1
fi

if [ ! -d "static" ]; then
    echo "❌ 錯誤：找不到 static 目錄"
    exit 1
fi

echo "✅ 所有必要檔案檢查完成"

# 設定環境變數 (Render 會自動提供 PORT)
export FLASK_APP=app.py
export FLASK_ENV=production
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# 顯示部署資訊
echo "📊 部署資訊："
echo "   - Python: $(python3 --version)"
echo "   - Flask App: ${FLASK_APP}"
echo "   - Environment: ${FLASK_ENV}"
echo "   - Port: ${PORT:-8000}"
echo "   - Working Directory: $(pwd)"

# 測試應用程式啟動
echo "🧪 測試應用程式..."
timeout 10s python3 -c "
import app
print('✅ 應用程式模組載入成功')
print('✅ Flask app 初始化成功')
print('✅ SocketIO 初始化成功')
" || {
    echo "❌ 應用程式測試失敗"
    exit 1
}

echo "🎉 部署準備完成！"
echo "🎉 Deployment preparation completed!"

# 在 Render 環境中，這個腳本執行後會自動啟動應用程式
# Render 會使用 start command 來啟動服務
echo "🌟 準備啟動服務..."
echo "🌟 Ready to start service..."

# 顯示啟動提示
echo ""
echo "📱 應用程式將在以下地址運行："
echo "📱 Application will be available at:"
echo "   - 本地開發: http://localhost:8000"
echo "   - Render URL: 由 Render 自動提供"
echo ""
echo "⚡ 功能特色："
echo "   ✨ 高性能批量專屬碼生成 (最多 100,000 筆)"
echo "   ✨ 實時進度追蹤與 WebSocket 通信"
echo "   ✨ 可自定義專屬碼格式與前後綴"
echo "   ✨ CSV 匯出功能"
echo "   ✨ 深色/淺色主題切換"
echo "   ✨ 響應式設計"
echo ""
echo "🔧 如需支援，請聯繫開發團隊"
echo "🔧 For support, please contact the development team"