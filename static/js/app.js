const socket = io();
let currentTaskId = null;
let generatedCodes = [];

// 語言系統 - 支援未來擴充
const translations = {
  zh: {
    // 頁面基本信息
    title: "專屬碼產生器 - powered by StreetVoice",
    headerTitle: "專屬碼產生器", 
    headerSubtitle: "快速產生大量專屬碼",
    
    // 表單標籤
    countLabel: "產生數量（最多 100,000 筆）",
    codeLengthLabel: "專屬碼長度（4-20 字元）",
    compositionTitle: "專屬碼內容組成",
    letterCountLabel: "英文字母數量",
    digitCountLabel: "數字數量", 
    letterCaseLabel: "英文字母大小寫",
    prefixLabel: "前綴",
    suffixLabel: "後綴",
    formatPreviewTitle: "格式預覽",
    compositionNote: "留空或設為0會自動分配。英文+數字總數不能超過專屬碼長度。",
    caseNote: "僅影響自動產生部分，不影響前後綴",
    
    // 按鈕
    generateBtn: "開始產生",
    downloadBtn: "下載完整 .CSV", 
    restartBtn: "重新來過",
    
    // 進度相關
    progressTitle: "正在產生專屬碼...",
    progressLabels: {
      progress: "完成進度",
      completed: "已完成",
      remaining: "預估剩餘", 
      batch: "批次"
    },
    progressText: "準備開始...",
    
    // 結果相關
    resultsTitle: "產生完成！",
    
    // 主題切換
    themeToggle: {
      dark: "🌙 深色模式",
      light: "☀️ 淺色模式"
    },
    
    // 頁尾
    footerText: "專屬碼產生器 · powered by",
    footerNote: "所有功能均在瀏覽器端執行，確保您的資料安全。"
  },
  
  en: {
    // Basic page info
    title: "Exclusive Code Generator - powered by StreetVoice",
    headerTitle: "Exclusive Code Generator",
    headerSubtitle: "Quick bulk exclusive code generation",
    
    // Form labels
    countLabel: "Generation Count (Max 100,000)",
    codeLengthLabel: "Code Length (4-20 characters)", 
    compositionTitle: "Code Content Composition",
    letterCountLabel: "Number of Letters",
    digitCountLabel: "Number of Digits",
    letterCaseLabel: "Letter Case",
    prefixLabel: "Prefix",
    suffixLabel: "Suffix",
    formatPreviewTitle: "Format Preview", 
    compositionNote: "Leave empty or set to 0 for automatic allocation. Letters + digits total cannot exceed code length.",
    caseNote: "Only affects auto-generated parts, not prefixes/suffixes",
    
    // Buttons
    generateBtn: "Start Generation",
    downloadBtn: "Download Complete .CSV",
    restartBtn: "Start Over",
    
    // Progress related
    progressTitle: "Generating exclusive codes...",
    progressLabels: {
      progress: "Progress",
      completed: "Completed", 
      remaining: "Est. Remaining",
      batch: "Batch"
    },
    progressText: "Ready to start...",
    
    // Results related
    resultsTitle: "Generation Complete!",
    
    // Theme toggle  
    themeToggle: {
      dark: "🌙 Dark Mode",
      light: "☀️ Light Mode"
    },
    
    // Footer
    footerText: "Exclusive Code Generator · powered by", 
    footerNote: "All functions run in the browser to ensure your data security."
  }
};

// 當前語言設定
let currentLanguage = 'zh';

// 語言切換函數
function switchLanguage(lang) {
  if (!translations[lang]) return;
  currentLanguage = lang;
  
  // 保存到 localStorage
  localStorage.setItem('language', lang);
  
  // 更新所有文本
  updateAllTexts();
  
  // 更新語言切換器狀態
  updateLanguageSwitcher();
}

// 更新所有文本
function updateAllTexts() {
  const t = translations[currentLanguage];
  
  // 更新頁面標題
  document.title = t.title;
  
  // 更新標題區域
  const headerTitle = document.querySelector('.header h1');
  if (headerTitle) headerTitle.textContent = t.headerTitle;
  
  const headerSubtitle = document.querySelector('.header .subtitle');
  if (headerSubtitle) headerSubtitle.textContent = t.headerSubtitle;
  
  // 更新表單標籤
  const countLabel = document.querySelector('label[for="count"]');
  if (countLabel) countLabel.textContent = t.countLabel;
  
  const codeLengthLabel = document.querySelector('label[for="codeLength"]');
  if (codeLengthLabel) codeLengthLabel.textContent = t.codeLengthLabel;
  
  const compositionTitle = document.querySelector('.composition-title');
  if (compositionTitle) compositionTitle.textContent = t.compositionTitle;
  
  const letterCountLabel = document.querySelector('label[for="letterCount"]');  
  if (letterCountLabel) letterCountLabel.textContent = t.letterCountLabel;
  
  const digitCountLabel = document.querySelector('label[for="digitCount"]');
  if (digitCountLabel) digitCountLabel.textContent = t.digitCountLabel;
  
  const letterCaseLabel = document.querySelector('label[for="letterCase"]');
  if (letterCaseLabel) letterCaseLabel.textContent = t.letterCaseLabel;
  
  const prefixLabel = document.querySelector('label[for="prefix"]');
  if (prefixLabel) prefixLabel.textContent = t.prefixLabel;
  
  const suffixLabel = document.querySelector('label[for="suffix"]');
  if (suffixLabel) suffixLabel.textContent = t.suffixLabel;
  
  const formatPreviewTitle = document.querySelector('.preview-title');
  if (formatPreviewTitle) formatPreviewTitle.textContent = t.formatPreviewTitle;
  
  const compositionNote = document.querySelector('.composition-note');
  if (compositionNote) compositionNote.textContent = t.compositionNote;
  
  const caseNote = document.querySelector('.case-note');
  if (caseNote) caseNote.textContent = t.caseNote;
  
  // 更新按鈕
  const generateBtnText = document.querySelector('.btn-text');
  if (generateBtnText) generateBtnText.textContent = t.generateBtn;
  
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) downloadBtn.textContent = t.downloadBtn;
  
  const restartBtn = document.getElementById('restartBtn');
  if (restartBtn) restartBtn.textContent = t.restartBtn;
  
  // 更新進度相關
  const progressTitle = document.querySelector('.progress-title');
  if (progressTitle) progressTitle.textContent = t.progressTitle;
  
  // 更新結果標題 (如果存在)
  const resultsTitle = document.querySelector('.results-title');
  if (resultsTitle && resultsTitle.textContent === translations.zh.resultsTitle) {
    resultsTitle.textContent = t.resultsTitle;
  }
  
  // 更新頁尾
  const footerText = document.querySelector('.footer p');
  if (footerText) {
    const currentYear = new Date().getFullYear();
    footerText.innerHTML = `&copy; <span id="currentYear">${currentYear}</span> ${t.footerText} <a href="https://streetvoice.com" target="_blank">StreetVoice</a>`;
  }
  
  const footerNote = document.querySelector('.footer-note');
  if (footerNote) footerNote.textContent = t.footerNote;
}

// 更新語言切換器狀態
function updateLanguageSwitcher() {
  const langOptions = document.querySelectorAll('.lang-option');
  langOptions.forEach(option => {
    const lang = option.getAttribute('data-lang');
    option.classList.toggle('active', lang === currentLanguage);
  });
}

// 初始化語言系統
function initializeLanguage() {
  // 從 localStorage 讀取保存的語言設定
  const savedLanguage = localStorage.getItem('language') || 'zh';
  switchLanguage(savedLanguage);
}

// DOM 元素
const form = document.getElementById('generatorForm');
const generateBtn = document.getElementById('generateBtn');
const progressSection = document.getElementById('progressSection');
const resultsSection = document.getElementById('resultsSection');
const codesContainer = document.getElementById('codesContainer');
const downloadBtn = document.getElementById('downloadBtn');

// 進度相關元素
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');
const completedCount = document.getElementById('completedCount');
const estimatedTime = document.getElementById('estimatedTime');
const currentBatch = document.getElementById('currentBatch');
const progressText = document.getElementById('progressText');

// 表單提交處理
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const letterCount = parseInt(document.getElementById('letterCount').value) || 0;
    const digitCount = parseInt(document.getElementById('digitCount').value) || 0;
    const codeLength = parseInt(document.getElementById('codeLength').value);

    const prefix = document.getElementById('prefix').value.trim();
    const suffix = document.getElementById('suffix').value.trim();
    const letterCase = document.getElementById('letterCase').value;
    
    const formData = {
        count: parseInt(document.getElementById('count').value),
        prefix: prefix,
        suffix: suffix,
        code_length: codeLength,
        letter_count: letterCount,
        digit_count: digitCount,
        letter_case: letterCase
    };

    // 驗證輸入
    if (formData.count <= 0 || formData.count > 100000) {
        showAlert('專屬碼數量必須在 1 到 100,000 之間', 'error');
        return;
    }

    if (codeLength < 4 || codeLength > 20) {
        showAlert('專屬碼長度必須在 4 到 20 之間', 'error');
        return;
    }

    // 計算前後綴總長度
    const affixTotalLength = prefix.length + suffix.length;
    const actualCodeLength = codeLength - affixTotalLength;
    
    // 驗證前後綴長度
    if (affixTotalLength >= codeLength) {
        showAlert(`前後綴總長度(${affixTotalLength})不能大於等於專屬碼長度(${codeLength})`, 'error');
        return;
    }
    
    if (actualCodeLength < 1) {
        showAlert(`扣除前後綴後，實際專屬碼長度必須至少為1`, 'error');
        return;
    }

    // 驗證專屬碼組成
    if (letterCount < 0 || digitCount < 0) {
        showAlert('英文字母和數字數量不能為負數', 'error');
        return;
    }

    if (letterCount + digitCount > actualCodeLength) {
        showAlert(`英文字母數量(${letterCount}) + 數字數量(${digitCount}) = ${letterCount + digitCount} 不能超過實際專屬碼長度(${actualCodeLength})`, 'error');
        return;
    }

    // 如果數量 > 1000，先產生預覽
    if (formData.count > 1000) {
        await showPreviewConfirmation(formData);
        return;
    }

    // 直接產生
    await startGeneration(formData);
});

// Socket.IO 事件處理
socket.on('generation_started', (data) => {
    progressText.textContent = '開始產生專屬碼...';
});

socket.on('progress_update', (data) => {
    if (data.task_id !== currentTaskId) return;

    // 更新進度條
    progressBar.style.width = data.progress + '%';
    progressPercent.textContent = data.progress + '%';
    completedCount.textContent = data.completed.toLocaleString();
    estimatedTime.textContent = data.estimated_remaining > 0 ? data.estimated_remaining : '--';
    currentBatch.textContent = `${data.batch_num}/${data.total_batches}`;
    
    progressText.textContent = `正在處理第 ${data.batch_num} 批，共 ${data.total_batches} 批...`;
});

socket.on('generation_complete', (data) => {
    if (data.task_id !== currentTaskId) return;

    generatedCodes = data.codes;

    // 隱藏進度區域
    progressSection.classList.remove('show');

    // 顯示結果
    displayResults(data.codes, data.total_time);

    // 重置按鈕
    resetGenerateButton();

    showAlert(`成功產生 ${data.total_codes.toLocaleString()} 個專屬碼（耗時 ${data.total_time} 秒）`, 'success');
});

socket.on('error', (data) => {
    showAlert(data.message, 'error');
    progressSection.classList.remove('show');
    resetGenerateButton();
});

// 隨機完成訊息
const completionMessages = [
    "嗚哇～專屬碼都生好好惹！🥺✨",
    "嗚拉！專屬碼是什麼呀～～哈～💦", 
    "嗚嗚嗚～專屬碼軍團集合完畢！🎵",
    "嗚咿～全部做完惹！",
    "嗚薩薩～專屬碼寶寶們誕生惹！👶",
    "專屬碼產生 ✅ 老闆開心 ✅ 下班時間 ❌",
    "這些專屬碼比我的人生還要有秩序 🤡",
    "專屬碼大豐收！比抽卡還爽 🎰",
    "恭喜獲得稀有專屬碼 SSR 一批！🌟",
    "專屬碼製造完成，工廠今日收工 🏭",
    "佛系產生完成，阿彌陀佛 🙏",
    "專屬碼農場大豐收！收成超讚 der 🌾",
    "專屬碼料理完成，請慢用～ 👨‍🍳",
    "嗶嗶嗶～專屬碼出貨完成！📦",
    "專屬碼產生術・發動成功！⚡",
    "折扣專屬碼工廠：本日營業額達標！💰",
    "專屬碼寶可夢：野生專屬碼大量出現！",
    "任務完成！經驗值 +999999 ✨",
    "專屬碼印表機：墨水用完，請補充 🖨️",
    "折扣密碼解鎖完成，老闆請笑納 😎"
];

// 顯示結果
function displayResults(codes, totalTime) {
    const preview = codes.slice(0, 50); // 只顯示前50個
    const remaining = codes.length - preview.length;

    // 隨機選擇完成訊息
    const randomMessage = completionMessages[Math.floor(Math.random() * completionMessages.length)];
    document.querySelector('.results-title').textContent = randomMessage;

    codesContainer.innerHTML = preview.map(code => 
        `<div class="code-item">${code}</div>`
    ).join('');

    if (remaining > 0) {
        codesContainer.innerHTML += `<div class="code-item" style="color: #888; font-style: italic;">... 還有 ${remaining.toLocaleString()} 個專屬碼（點擊下載查看完整清單）</div>`;
    }

    // 隱藏表單區塊
    const formSection = document.querySelector('.form-section');
    if (formSection) {
        formSection.style.display = 'none';
    }

    resultsSection.classList.add('show');
}

// 下載按鈕 Q 彈動畫效果
let downloadPressStartTime = 0;

function triggerDownloadBounce(e, force) {
    const rect = downloadBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    // 限制旋轉角度
    let rawAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (rawAngle > 100) rawAngle = 100;
    if (rawAngle < -100) rawAngle = -100;
    downloadBtn.style.setProperty('--angle', `${rawAngle}deg`);

    // 力道影響壓縮比例
    const squashX = 1 + 0.15 * force;
    const squashY = 1 - 0.15 * force;
    const stretchX = 1 - 0.08 * force;
    const stretchY = 1 + 0.08 * force;

    downloadBtn.style.setProperty('--squash-transform', `scale(${squashX}, ${squashY}) rotate(${rawAngle}deg)`);
    downloadBtn.style.setProperty('--stretch-transform', `scale(${stretchX}, ${stretchY}) rotate(${rawAngle}deg)`);

    downloadBtn.classList.remove('animate-squash');
    void downloadBtn.offsetWidth;
    downloadBtn.classList.add('animate-squash');
}

// 滑鼠力道模擬
downloadBtn.addEventListener('mousedown', () => {
    downloadPressStartTime = Date.now();
});

downloadBtn.addEventListener('mouseup', (e) => {
    const duration = Date.now() - downloadPressStartTime;
    const fakeForce = Math.min(1, duration / 500);
    triggerDownloadBounce(e, fakeForce);
});

// 觸控力道
downloadBtn.addEventListener('touchstart', () => {
    downloadPressStartTime = Date.now();
});

downloadBtn.addEventListener('touchend', (e) => {
    const touch = e.changedTouches[0];
    let force = 0;
    if (touch.force !== undefined && touch.force > 0) {
        force = Math.min(1, touch.force);
    } else {
        const duration = Date.now() - downloadPressStartTime;
        force = Math.min(1, duration / 500);
    }
    triggerDownloadBounce(e, force);
});

// 滑鼠靠近閃避效果
document.addEventListener('mousemove', (e) => {
    if (!downloadBtn || !resultsSection.classList.contains('show')) return;
    
    const rect = downloadBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const distance = Math.sqrt(dx*dx + dy*dy);
    const radius = 120; // 感應範圍
    const maxOffset = 20; // 最大位移 px

    if (distance < radius) {
        // 計算反方向位移
        const factor = (radius - distance) / radius; // 越近位移越大
        const offsetX = Math.min(maxOffset, dx * factor * 0.5) * -1;
        const offsetY = Math.min(maxOffset, dy * factor * 0.5) * -1;

        downloadBtn.style.setProperty('--offset-x', `${offsetX}px`);
        downloadBtn.style.setProperty('--offset-y', `${offsetY}px`);
        downloadBtn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    } else {
        // 回到原位
        downloadBtn.style.setProperty('--offset-x', `0px`);
        downloadBtn.style.setProperty('--offset-y', `0px`);
        downloadBtn.style.transform = `translate(0px, 0px)`;
    }
});

// 下載功能
downloadBtn.addEventListener('click', () => {
    if (generatedCodes.length === 0) return;

    // 取得當前的產生設定
    const count = parseInt(document.getElementById('count').value);
    const codeLength = parseInt(document.getElementById('codeLength').value);
    const letterCount = parseInt(document.getElementById('letterCount').value) || 0;
    const digitCount = parseInt(document.getElementById('digitCount').value) || 0;
    const prefix = document.getElementById('prefix').value.trim();
    const suffix = document.getElementById('suffix').value.trim();

    // 產生規則說明
    let ruleDescription = `規則,共產生${count}個專屬碼，長度${codeLength}字元`;
    
    if (letterCount > 0 || digitCount > 0) {
        ruleDescription += `，英文字母${letterCount}個，數字${digitCount}個`;
    } else {
        ruleDescription += `，英文字母與數字隨機分配`;
    }
    
    if (prefix) {
        ruleDescription += `，前綴"${prefix}"`;
    }
    
    if (suffix) {
        ruleDescription += `，後綴"${suffix}"`;
    }

    // 建立 CSV 內容
    let csvContent = ruleDescription + '\n\n序號,專屬碼\n';
    
    generatedCodes.forEach((code, index) => {
        csvContent += `${index + 1},${code}\n`;
    });

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    
    // 格式化時間為 yyyymmddhhmmss
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${year}${month}${day}${hour}${minute}${second}`;
    
    a.download = `discount_codes_${count}_${timestamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
});

// 重置產生按鈕
function resetGenerateButton() {
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<span class="btn-text">開始產生</span>';
}

// 顯示提示訊息
function showAlert(message, type) {
    // 移除現有提示
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    // 使用專用的 alert 容器
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.appendChild(alert);

    // 3秒後自動移除
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 3000);
}

// Socket.IO 連線狀態
socket.on('connect', () => {
    console.log('已連接到伺服器');
});

socket.on('disconnect', () => {
    console.log('與伺服器連線中斷');
    showAlert('與伺服器連線中斷，請重新整理頁面', 'error');
});

// 主題切換功能
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// 載入儲存的主題偏好
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-theme');
    themeToggle.textContent = '🌙 深色模式';
} else {
    themeToggle.textContent = '☀️ 淺色模式';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    
    if (isLight) {
        themeToggle.textContent = '🌙 深色模式';
        localStorage.setItem('theme', 'light');
    } else {
        themeToggle.textContent = '☀️ 淺色模式';
        localStorage.setItem('theme', 'dark');
    }
});

// 摺疊功能
const advancedToggle = document.getElementById('advancedToggle');
const advancedContent = document.getElementById('advancedContent');
const advancedIcon = advancedToggle.querySelector('.collapsible-icon');

advancedToggle.addEventListener('click', () => {
    const isExpanded = advancedContent.classList.contains('expanded');
    
    if (isExpanded) {
        advancedContent.classList.remove('expanded');
        advancedIcon.textContent = '▼';
        advancedIcon.style.transform = 'rotate(0deg)';
    } else {
        advancedContent.classList.add('expanded');
        advancedIcon.textContent = '▲';
        advancedIcon.style.transform = 'rotate(180deg)';
    }
});

// 自動加總和驗證專屬碼組成
const letterCountInput = document.getElementById('letterCount');
const digitCountInput = document.getElementById('digitCount');
const codeLengthInput = document.getElementById('codeLength');
let isAutoCalculating = false; // 防止無限循環

function autoCalculateComposition(changedField) {
    if (isAutoCalculating) return; // 防止遞迴呼叫
    
    isAutoCalculating = true;
    
    const codeLength = parseInt(codeLengthInput.value) || 8;
    
    // 計算前後綴長度
    const prefix = document.getElementById('prefix').value.trim();
    const suffix = document.getElementById('suffix').value.trim();
    
    const affixTotalLength = prefix.length + suffix.length;
    const actualCodeLength = Math.max(0, codeLength - affixTotalLength);
    
    if (changedField === 'letter') {
        const letterCount = parseInt(letterCountInput.value);
        if (!isNaN(letterCount) && letterCount >= 0) {
            const remainingDigits = Math.max(0, actualCodeLength - letterCount);
            digitCountInput.value = remainingDigits;
        }
    } else if (changedField === 'digit') {
        const digitCount = parseInt(digitCountInput.value);
        if (!isNaN(digitCount) && digitCount >= 0) {
            const remainingLetters = Math.max(0, actualCodeLength - digitCount);
            letterCountInput.value = remainingLetters;
        }
    } else if (changedField === 'length') {
        // 當專屬碼長度改變時，重新計算比例
        const letterCount = parseInt(letterCountInput.value) || 0;
        const digitCount = parseInt(digitCountInput.value) || 0;
        
        if (letterCount > 0 || digitCount > 0) {
            const total = letterCount + digitCount;
            if (total > actualCodeLength) {
                if (actualCodeLength > 0) {
                    // 按比例縮減
                    const letterRatio = letterCount / total;
                    const newLetterCount = Math.floor(actualCodeLength * letterRatio);
                    const newDigitCount = actualCodeLength - newLetterCount;
                    
                    letterCountInput.value = newLetterCount;
                    digitCountInput.value = newDigitCount;
                } else {
                    letterCountInput.value = 0;
                    digitCountInput.value = 0;
                }
            }
        }
    }
    
    validateCodeComposition();
    updateFormatPreview();
    isAutoCalculating = false;
}

function validateCodeComposition() {
    const letterCount = parseInt(letterCountInput.value) || 0;
    const digitCount = parseInt(digitCountInput.value) || 0;
    const codeLength = parseInt(codeLengthInput.value) || 8;
    
    // 計算前後綴長度
    const prefix = document.getElementById('prefix').value.trim();
    const suffix = document.getElementById('suffix').value.trim();
    
    const affixTotalLength = prefix.length + suffix.length;
    const actualCodeLength = codeLength - affixTotalLength;

    // 清除之前的樣式
    letterCountInput.style.borderColor = '';
    digitCountInput.style.borderColor = '';
    codeLengthInput.style.borderColor = '';

    if (affixTotalLength >= codeLength) {
        const errorMsg = `前後綴總長度(${affixTotalLength}) >= 專屬碼長度(${codeLength})`;
        codeLengthInput.style.borderColor = '#ff6b6b';
        showAlert(errorMsg, 'error');
    } else if (letterCount + digitCount > actualCodeLength) {
        const errorMsg = `英文(${letterCount}) + 數字(${digitCount}) = ${letterCount + digitCount} > 實際專屬碼長度(${actualCodeLength})`;
        letterCountInput.style.borderColor = '#ff6b6b';
        digitCountInput.style.borderColor = '#ff6b6b';
        showAlert(errorMsg, 'error');
    }
}

// 清空輸入框時也清空對應的輸入框
function handleInputClear(field) {
    if (letterCountInput.value === '' && digitCountInput.value === '') {
        // 兩個都空白時，不做任何處理（系統隨機處理）
        return;
    }
    
    if (field === 'letter' && letterCountInput.value === '') {
        digitCountInput.value = '';
    } else if (field === 'digit' && digitCountInput.value === '') {
        letterCountInput.value = '';
    }
}

letterCountInput.addEventListener('input', () => {
    if (letterCountInput.value === '') {
        handleInputClear('letter');
    } else {
        autoCalculateComposition('letter');
    }
    updateFormatPreview();
});

digitCountInput.addEventListener('input', () => {
    if (digitCountInput.value === '') {
        handleInputClear('digit');
    } else {
        autoCalculateComposition('digit');
    }
    updateFormatPreview();
});

codeLengthInput.addEventListener('input', () => {
    autoCalculateComposition('length');
    updateFormatPreview();
});

// 前後綴變化時重新計算
document.getElementById('prefix').addEventListener('input', (e) => {
    // 特殊處理：如果前後綴被清空且目前有指定字母數字分配，重新計算最佳分配
    handleAffixChange();
});

document.getElementById('suffix').addEventListener('input', (e) => {
    handleAffixChange();
});

// 字母大小寫變化時更新預覽
document.getElementById('letterCase').addEventListener('change', () => {
    updateFormatPreview();
});

// 處理前後綴變更的統一函數
function handleAffixChange() {
    const letterCount = parseInt(letterCountInput.value) || 0;
    const digitCount = parseInt(digitCountInput.value) || 0;
    const hasSpecifiedAllocation = letterCount > 0 || digitCount > 0;
    
    // 如果用戶有明確指定字母數字分配，則在前後綴變更時重新優化分配
    if (hasSpecifiedAllocation) {
        // 計算新的可用空間
        const codeLength = parseInt(codeLengthInput.value) || 8;
        const prefix = document.getElementById('prefix').value.trim();
        const suffix = document.getElementById('suffix').value.trim();
        
        const affixTotalLength = prefix.length + suffix.length;
        const actualCodeLength = Math.max(0, codeLength - affixTotalLength);
        
        const currentTotal = letterCount + digitCount;
        
        if (currentTotal > actualCodeLength) {
            // 空間不足，按比例縮減
            if (actualCodeLength > 0) {
                const letterRatio = letterCount / currentTotal;
                const newLetterCount = Math.floor(actualCodeLength * letterRatio);
                const newDigitCount = actualCodeLength - newLetterCount;
                
                letterCountInput.value = newLetterCount;
                digitCountInput.value = newDigitCount;
            } else {
                letterCountInput.value = 0;
                digitCountInput.value = 0;
            }
        } else if (currentTotal < actualCodeLength && currentTotal > 0) {
            // 有更多空間可用，按比例擴展到充分利用可用空間
            const letterRatio = letterCount / currentTotal;
            const newLetterCount = Math.floor(actualCodeLength * letterRatio);
            const newDigitCount = actualCodeLength - newLetterCount;
            
            letterCountInput.value = newLetterCount;
            digitCountInput.value = newDigitCount;
        }
    }
    
    // 觸發原有的計算和驗證
    autoCalculateComposition('affix');
    updateFormatPreview();
}

// 更新格式預覽
function updateFormatPreview() {
    const codeLength = parseInt(codeLengthInput.value) || 8;
    const letterCount = parseInt(letterCountInput.value) || 0;
    const digitCount = parseInt(digitCountInput.value) || 0;
    const letterCase = document.getElementById('letterCase').value;
    
    const prefix = document.getElementById('prefix').value.trim();
    const suffix = document.getElementById('suffix').value.trim();
    
    // 計算實際專屬碼長度
    const affixTotalLength = prefix.length + suffix.length;
    const actualCodeLength = Math.max(0, codeLength - affixTotalLength);
    
    let previewParts = [];
    
    // 添加前綴部分
    if (prefix) {
        previewParts.push(prefix);
    }
    
    // 產生中間專屬碼部分描述
    let codeDescription = '';
    if (actualCodeLength <= 0) {
        codeDescription = '無可用空間';
    } else if (letterCount === 0 && digitCount === 0) {
        // 自動混合分配
        let caseText = '';
        switch (letterCase) {
            case 'uppercase':
                caseText = '大寫英文字及數字';
                break;
            case 'lowercase':
                caseText = '小寫英文字及數字';
                break;
            case 'mixed':
                caseText = '混合英文字及數字';
                break;
        }
        codeDescription = `${caseText} 共${actualCodeLength}碼`;
    } else {
        // 指定分配
        let parts = [];
        if (letterCount > 0) {
            let caseText = '';
            switch (letterCase) {
                case 'uppercase':
                    caseText = '大寫英文字';
                    break;
                case 'lowercase':
                    caseText = '小寫英文字';
                    break;
                case 'mixed':
                    caseText = '混合英文字';
                    break;
            }
            parts.push(`${letterCount}${caseText}`);
        }
        if (digitCount > 0) {
            parts.push(`${digitCount}數字`);
        }
        
        // 如果還有剩餘空間，添加隨機部分
        const specifiedTotal = letterCount + digitCount;
        const remaining = actualCodeLength - specifiedTotal;
        if (remaining > 0) {
            let caseText = '';
            switch (letterCase) {
                case 'uppercase':
                    caseText = '大寫英文字及數字';
                    break;
                case 'lowercase':
                    caseText = '小寫英文字及數字';
                    break;
                case 'mixed':
                    caseText = '混合英文字及數字';
                    break;
            }
            parts.push(`${remaining}${caseText}`);
        }
        
        codeDescription = parts.join('及');
    }
    
    previewParts.push(codeDescription);
    
    // 添加後綴部分
    if (suffix) {
        previewParts.push(suffix);
    }
    
    // 更新預覽內容
    const previewContent = document.getElementById('previewContent');
    previewContent.textContent = previewParts.join('');
}

// 隱私說明文字版本
const privacyTexts = [
    "請放心！我們不會儲存你產生的專屬碼，<br>所有專屬碼都在本地產生且只存在於你的瀏覽器中。",
    "專屬碼：生於瀏覽器，死於分頁關閉。",
    "我們不存，你不存，誰都不存。", 
    "專屬碼不會上雲，因為它懶，根本懶得爬。",
    "本地現做，關掉就掰。",
    "伺服器：我哪有看到專屬碼？蛤？"
];

// 語言切換事件監聽器
document.addEventListener('DOMContentLoaded', function() {
    // 初始化語言系統
    initializeLanguage();
    
    // 語言切換按鈕事件
    const languageSwitch = document.getElementById('languageSwitch');
    if (languageSwitch) {
        languageSwitch.addEventListener('click', function(e) {
            if (e.target.classList.contains('lang-option')) {
                const selectedLang = e.target.getAttribute('data-lang');
                if (selectedLang !== currentLanguage) {
                    switchLanguage(selectedLang);
                }
            }
        });
    }
    
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
    
    // 隨機選擇隱私說明文字
    const privacyTextElement = document.getElementById('privacyText');
    if (privacyTextElement) {
        const random = Math.random();
        let selectedText;
        
        if (random < 0.7) {
            // 70% 機率顯示原文
            selectedText = privacyTexts[0];
        } else {
            // 30% 機率隨機選擇其他五款
            const funnyTexts = privacyTexts.slice(1);
            selectedText = funnyTexts[Math.floor(Math.random() * funnyTexts.length)];
        }
        
        privacyTextElement.innerHTML = selectedText;
    }
    
    // 初始化預覽
    updateFormatPreview();
});

// 顯示預覽確認對話框
async function showPreviewConfirmation(formData) {
    try {
        // 產生 10 筆預覽專屬碼
        const previewData = { ...formData, count: 10 };
        
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<div class="loading-spinner"></div> <span>產生預覽中...</span>';

        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(previewData)
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || '預覽產生失敗');
        }

        // 產生預覽專屬碼
        const previewTaskId = result.task_id;
        
        // 監聽預覽完成事件
        const previewCompleteHandler = (data) => {
            if (data.task_id === previewTaskId) {
                socket.off('generation_complete', previewCompleteHandler);
                showPreviewModal(data.codes, formData);
            }
        };
        
        socket.on('generation_complete', previewCompleteHandler);
        
        // 開始產生預覽
        socket.emit('start_generation', {
            task_id: previewTaskId,
            ...previewData
        });

    } catch (error) {
        showAlert(error.message, 'error');
        resetGenerateButton();
    }
}

// 顯示預覽模態框
function showPreviewModal(previewCodes, originalFormData) {
    // 創建模態框
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.innerHTML = `
        <div class="preview-modal-content">
            <h3>偵測到大量產生！</h3>
            <p>以下是根據您的設定產生的 ${previewCodes.length} 個專屬碼預覽：</p>
            <div class="preview-codes">
                ${previewCodes.map(code => `<div class="code-item">${code}</div>`).join('')}
            </div>
            <p class="preview-question">
                確認要產生 <strong>${originalFormData.count.toLocaleString()}</strong> 個專屬碼嗎？
            </p>
            <div class="preview-buttons">
                <button class="btn-secondary" id="cancelBtn">取消</button>
                <button class="btn-primary" id="confirmBtn">確認產生</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 綁定事件
    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.body.removeChild(modal);
        resetGenerateButton();
    });

    document.getElementById('confirmBtn').addEventListener('click', () => {
        document.body.removeChild(modal);
        startGeneration(originalFormData);
    });

    // 點擊背景關閉
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            resetGenerateButton();
        }
    });
}

// 開始實際產生
async function startGeneration(formData) {
    try {
        // 禁用按鈕並顯示載入狀態
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<div class="loading-spinner"></div> <span>準備中...</span>';

        // 隱藏結果區域
        resultsSection.classList.remove('show');

        // 發送產生請求到後端
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || '產生失敗');
        }

        currentTaskId = result.task_id;

        // 顯示進度區域
        progressSection.classList.add('show');

        // 透過 Socket.IO 開始產生
        socket.emit('start_generation', {
            task_id: currentTaskId,
            ...formData
        });

    } catch (error) {
        showAlert(error.message, 'error');
        resetGenerateButton();
    }
}