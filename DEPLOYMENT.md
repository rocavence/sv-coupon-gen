# 🚀 街聲折扣碼生成器部署指南
# StreetVoice Discount Code Generator - Deployment Guide

## 📋 部署選項 | Deployment Options

### 1. Render 部署 (推薦)

#### 自動部署 | Automatic Deployment
1. Fork 或連接 GitHub 儲存庫到 Render
2. Render 會自動偵測 `render.yaml` 配置檔案
3. 自動執行 `deploy.sh` 建構腳本
4. 部署完成後服務自動啟動

#### 手動設定 | Manual Setup
1. 在 Render 建立新的 Web Service
2. 連接到 GitHub 儲存庫
3. 設定以下環境變數：
   ```
   FLASK_ENV=production
   FLASK_APP=app.py
   PYTHONUNBUFFERED=1
   ```
4. 建構命令：`./deploy.sh`
5. 啟動命令：`python3 app.py`

### 2. Heroku 部署

1. 安裝 Heroku CLI
2. 登入並建立應用程式：
   ```bash
   heroku create your-app-name
   ```
3. 設定環境變數：
   ```bash
   heroku config:set FLASK_ENV=production
   heroku config:set FLASK_APP=app.py
   ```
4. 部署：
   ```bash
   git push heroku main
   ```

### 3. Railway 部署

1. 連接 GitHub 儲存庫到 Railway
2. Railway 會自動偵測 Python 專案
3. 設定環境變數：
   ```
   FLASK_ENV=production
   FLASK_APP=app.py
   ```
4. 自動部署完成

### 4. DigitalOcean App Platform

1. 連接 GitHub 儲存庫
2. 選擇 Python 運行時
3. 設定建構命令：`./deploy.sh`
4. 設定運行命令：`python3 app.py`
5. 設定環境變數並部署

## 🔧 本地開發環境

### 系統需求
- Python 3.8+
- pip (Python 包管理器)

### 安裝步驟
1. 克隆儲存庫：
   ```bash
   git clone https://github.com/rocavence/sv-coupon-gen.git
   cd sv-coupon-gen
   ```

2. 執行啟動腳本：
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

3. 或手動設定：
   ```bash
   # 建立虛擬環境
   python3 -m venv venv
   
   # 啟動虛擬環境
   source venv/bin/activate  # Linux/Mac
   # 或 venv\Scripts\activate  # Windows
   
   # 安裝依賴
   pip install -r requirements.txt
   
   # 啟動應用程式
   python3 app.py
   ```

4. 開啟瀏覽器訪問 `http://localhost:8000`

## 📊 監控與健康檢查

### 健康檢查端點
- URL: `/health`
- 方法: GET
- 回應：
  ```json
  {
    "status": "healthy",
    "service": "街聲折扣碼生成器",
    "version": "1.0.0",
    "timestamp": "2025-08-09T11:00:00.000Z"
  }
  ```

### 效能指標
- 記憶體使用量：~50-100MB
- CPU 使用率：低負載 <5%，生成時 10-30%
- 並發支援：多用戶同時使用
- 批次處理：1000筆/批，避免阻塞

## 🛠️ 故障排除

### 常見問題

#### 1. 模組未找到錯誤
```bash
# 確保安裝所有依賴
pip install -r requirements.txt
```

#### 2. 端口已被使用
```bash
# 查看佔用端口的進程
lsof -i :8000
# 終止進程或更換端口
```

#### 3. WebSocket 連接問題
- 檢查防火牆設定
- 確認 Flask-SocketIO 版本相容性
- 檢查瀏覽器控制台錯誤

#### 4. 記憶體不足 (大量代碼生成)
- 調整批次大小 (app.py 中的 batch_size)
- 使用更高規格的服務器
- 分批處理大量請求

### 日誌查看
```bash
# Render
render logs

# Heroku  
heroku logs --tail

# 本地開發
# 查看控制台輸出
```

## 🔒 生產環境設定

### 環境變數
```bash
FLASK_ENV=production
FLASK_APP=app.py
PYTHONUNBUFFERED=1
```

### 安全考量
- 使用 HTTPS (Render 自動提供)
- 設定適當的 CORS 政策
- 限制請求頻率 (可選)
- 定期更新依賴套件

### 效能優化
- 使用生產級 WSGI 伺服器 (如 Gunicorn)
- 設定反向代理 (Nginx)
- 啟用 gzip 壓縮
- 使用 CDN 提供靜態資源

## 📞 支援聯繫

如有部署問題或需要技術支援，請：
1. 查看 GitHub Issues
2. 聯繫開發團隊
3. 參考官方文件

---

## 📁 檔案結構

```
sv-coupon-gen/
├── app.py                 # 主應用程式
├── requirements.txt       # Python 依賴
├── start.sh              # 本地啟動腳本
├── deploy.sh             # Render 部署腳本
├── render.yaml           # Render 配置
├── Procfile              # Heroku 配置
├── DEPLOYMENT.md         # 部署指南
├── README.md             # 專案說明
├── static/               # 靜態資源
│   ├── css/style.css     # 樣式表
│   └── js/app.js         # 前端邏輯
├── templates/            # HTML 模板
│   └── index.html        # 主頁面
└── .gitignore           # Git 忽略檔案
```

🎉 祝您部署順利！Happy Deployment!