#!/bin/bash

# 折扣碼生成器啟動腳本

echo "🚀 啟動折扣碼生成器..."

# 檢查是否已建立虛擬環境
if [ ! -d "venv" ]; then
    echo "📦 建立虛擬環境..."
    python3 -m venv venv
fi

# 啟動虛擬環境並安裝相依套件
echo "📋 安裝相依套件..."
source venv/bin/activate
python3 -m pip install -r requirements.txt

echo "🌟 啟動伺服器..."
echo "📱 請開啟瀏覽器並前往: http://localhost:8000"
echo "⚠️  按 Ctrl+C 停止伺服器"
echo ""

# 啟動應用程式
python3 app.py