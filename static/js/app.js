const socket = io();
let currentTaskId = null;
let generatedCodes = [];

// 翻譯系統現在從 i18n.js 載入
// translations 對象將從 i18n.js 提供

// 當前語言設定
let currentLanguage = 'zh';

// 語言切換函數
function switchLanguage(lang) {
  if (!translations[lang]) return;
  currentLanguage = lang;
  
  // 保存到 localStorage
  localStorage.setItem('language', lang);
  
  // 更新 URL 路徑結構
  updateUrlForLanguage(lang);
  
  // 更新所有文本
  updateAllTexts();
  
  // 更新隱私提示文字
  updatePrivacyText();
  
  // 更新格式預覽
  updateFormatPreview();
  
  // 控制格式預覽顯示（只在中文模式顯示）
  const formatPreview = document.getElementById('formatPreview');
  if (formatPreview) {
    formatPreview.style.display = (lang === 'zh') ? 'block' : 'none';
  }
  
  // 更新表單驗證訊息
  updateFormValidationMessages();
  
  // 更新語言切換器狀態
  updateLanguageSwitcher();
}

// 更新 URL 路徑結構
function updateUrlForLanguage(lang) {
  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;
  const currentHash = window.location.hash;
  
  let newPath;
  
  // 先清理現有路徑，移除所有語言前綴
  let cleanPath = currentPath;
  if (cleanPath.startsWith('/zh-hant/')) {
    cleanPath = cleanPath.replace('/zh-hant/', '/');
  } else if (cleanPath === '/zh-hant' || cleanPath === '/zh-hant/') {
    cleanPath = '/';
  }
  
  if (lang === 'zh') {
    // 中文版：加上 /zh-hant/ 前綴（帶尾斜線）
    if (cleanPath === '/') {
      newPath = '/zh-hant/';
    } else {
      newPath = '/zh-hant' + cleanPath;
    }
  } else {
    // 英文版：使用清理後的路徑
    newPath = cleanPath;
  }
  
  // 如果路徑有變化，更新 URL（不重新載入頁面）
  if (newPath !== currentPath) {
    const newUrl = newPath + currentSearch + currentHash;
    window.history.pushState({ language: lang }, '', newUrl);
    console.log('URL updated from', currentPath, 'to', newPath);
  }
}

// 從 URL 判斷當前應該使用的語言
function detectLanguageFromUrl() {
  const path = window.location.pathname;
  
  if (path.startsWith('/zh-hant/') || path === '/zh-hant' || path === '/zh-hant/') {
    return 'zh';
  } else {
    return 'en';
  }
}

// 從瀏覽器偵測用戶偏好語言
function detectBrowserLanguage() {
  // 獲取瀏覽器語言設定
  const browserLang = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;
  const browserLangs = navigator.languages || [browserLang];
  
  // 中文相關的語言代碼
  const chineseLanguageCodes = [
    'zh',           // 中文（通用）
    'zh-CN',        // 中文（簡體，中國）
    'zh-TW',        // 中文（繁體，台灣）
    'zh-HK',        // 中文（繁體，香港）
    'zh-MO',        // 中文（繁體，澳門）
    'zh-SG',        // 中文（簡體，新加坡）
    'zh-Hans',      // 中文（簡體）
    'zh-Hant',      // 中文（繁體）
    'zh-Hans-CN',   // 中文（簡體，中國）
    'zh-Hant-TW',   // 中文（繁體，台灣）
    'zh-Hant-HK',   // 中文（繁體，香港）
    'zh-Hant-MO'    // 中文（繁體，澳門）
  ];
  
  // 檢查主要語言設定
  for (const lang of browserLangs) {
    const normalizedLang = lang.toLowerCase();
    
    // 檢查是否為中文相關語言
    if (chineseLanguageCodes.some(code => 
      normalizedLang === code.toLowerCase() || 
      normalizedLang.startsWith(code.toLowerCase() + '-')
    )) {
      return 'zh';
    }
    
    // 檢查是否為英文
    if (normalizedLang.startsWith('en')) {
      return 'en';
    }
  }
  
  // 預設回傳中文（因為這是中文為主的應用）
  return 'zh';
}

// 處理瀏覽器的前進/後退按鈕
function handlePopState(event) {
  const urlLang = detectLanguageFromUrl();
  if (urlLang !== currentLanguage) {
    // 不要觸發 URL 更新，只更新語言狀態
    const oldCurrentLanguage = currentLanguage;
    currentLanguage = urlLang;
    localStorage.setItem('language', urlLang);
    
    // 更新所有 UI 元素
    updateAllTexts();
    updatePrivacyText();
    updateFormatPreview();
    updateFormValidationMessages();
    updateLanguageSwitcher();
    
    // 控制格式預覽顯示
    const formatPreview = document.getElementById('formatPreview');
    if (formatPreview) {
      formatPreview.style.display = (urlLang === 'zh') ? 'block' : 'none';
    }
  }
}

// 更新表單驗證訊息
function updateFormValidationMessages() {
  const t = translations[currentLanguage];
  
  // 為各個表單輸入元素設置自定義驗證訊息
  const countInput = document.getElementById('count');
  const codeLengthInput = document.getElementById('codeLength');
  const letterCountInput = document.getElementById('letterCount');
  const digitCountInput = document.getElementById('digitCount');
  const prefixInput = document.getElementById('prefix');
  const suffixInput = document.getElementById('suffix');
  
  // 設置數量輸入的驗證訊息
  if (countInput) {
    countInput.setCustomValidity('');
    countInput.oninvalid = function(e) {
      const value = parseInt(this.value);
      if (this.validity.valueMissing) {
        this.setCustomValidity(t.alerts.countRange);
      } else if (value < 1 || value > 100000) {
        this.setCustomValidity(t.alerts.countRange);
      } else {
        this.setCustomValidity('');
      }
    };
    countInput.oninput = function(e) { this.setCustomValidity(''); };
  }
  
  // 設置專屬碼長度的驗證訊息
  if (codeLengthInput) {
    codeLengthInput.setCustomValidity('');
    codeLengthInput.oninvalid = function(e) {
      const value = parseInt(this.value);
      if (this.validity.valueMissing) {
        this.setCustomValidity(t.alerts.lengthRange);
      } else if (value < 4 || value > 20) {
        this.setCustomValidity(t.alerts.lengthRange);
      } else {
        this.setCustomValidity('');
      }
    };
    codeLengthInput.oninput = function(e) { this.setCustomValidity(''); };
  }
  
  // 設置英文字母數量的驗證訊息  
  if (letterCountInput) {
    letterCountInput.setCustomValidity('');
    letterCountInput.oninvalid = function(e) {
      const value = parseInt(this.value);
      if (value < 0) {
        this.setCustomValidity(t.alerts.negativeNumbers);
      } else {
        this.setCustomValidity('');
      }
    };
    letterCountInput.oninput = function(e) { this.setCustomValidity(''); };
  }
  
  // 設置數字數量的驗證訊息
  if (digitCountInput) {
    digitCountInput.setCustomValidity('');
    digitCountInput.oninvalid = function(e) {
      const value = parseInt(this.value);
      if (value < 0) {
        this.setCustomValidity(t.alerts.negativeNumbers);
      } else {
        this.setCustomValidity('');
      }
    };
    digitCountInput.oninput = function(e) { this.setCustomValidity(''); };
  }
  
  // 前綴和後綴的長度限制訊息
  if (prefixInput) {
    prefixInput.setCustomValidity('');
    prefixInput.oninvalid = function(e) {
      if (this.validity.tooLong) {
        this.setCustomValidity(t.alerts.prefixTooLong);
      } else {
        this.setCustomValidity('');
      }
    };
    prefixInput.oninput = function(e) { this.setCustomValidity(''); };
  }
  
  if (suffixInput) {
    suffixInput.setCustomValidity('');
    suffixInput.oninvalid = function(e) {
      if (this.validity.tooLong) {
        this.setCustomValidity(t.alerts.suffixTooLong);
      } else {
        this.setCustomValidity('');
      }
    };
    suffixInput.oninput = function(e) { this.setCustomValidity(''); };
  }
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
  
  // 更新進階設定標題
  const advancedTitle = document.querySelector('.collapsible-title');
  if (advancedTitle) advancedTitle.textContent = t.advancedSettings;
  
  // 更新表單佔位符
  const letterCountInput = document.getElementById('letterCount');
  if (letterCountInput) letterCountInput.placeholder = t.placeholders.autoAllocation;
  
  const digitCountInput = document.getElementById('digitCount');
  if (digitCountInput) digitCountInput.placeholder = t.placeholders.autoAllocation;
  
  const prefixInput = document.getElementById('prefix');
  if (prefixInput) prefixInput.placeholder = t.placeholders.prefixExample;
  
  const suffixInput = document.getElementById('suffix');
  if (suffixInput) suffixInput.placeholder = t.placeholders.suffixExample;
  
  // 更新下拉選單選項
  const uppercaseOption = document.querySelector('option[value="uppercase"]');
  if (uppercaseOption) uppercaseOption.textContent = t.letterCaseOptions.uppercase;
  
  const lowercaseOption = document.querySelector('option[value="lowercase"]');
  if (lowercaseOption) lowercaseOption.textContent = t.letterCaseOptions.lowercase;
  
  const mixedOption = document.querySelector('option[value="mixed"]');
  if (mixedOption) mixedOption.textContent = t.letterCaseOptions.mixed;
  
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
  
  // 更新主題切換按鈕文字
  updateThemeToggleText();
}

// 更新語言切換器狀態
function updateLanguageSwitcher() {
  const langOptions = document.querySelectorAll('.lang-option');
  langOptions.forEach(option => {
    const lang = option.getAttribute('data-lang');
    option.classList.toggle('active', lang === currentLanguage);
  });
}

// 更新主題切換按鈕文字
function updateThemeToggleText() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const t = translations[currentLanguage];
    const isLight = document.body.classList.contains('light-theme');
    
    if (isLight) {
      themeToggle.textContent = t.themeToggle.dark;
    } else {
      themeToggle.textContent = t.themeToggle.light;
    }
  }
}

// 初始化語言系統
function initializeLanguage() {
  let selectedLanguage;
  
  // 優先順序：URL > localStorage > 瀏覽器語言 > 預設中文
  const urlLanguage = detectLanguageFromUrl();
  const savedLanguage = localStorage.getItem('language');
  const browserLanguage = detectBrowserLanguage();
  const currentPath = window.location.pathname;
  
  if ((currentPath.startsWith('/zh-hant/') || currentPath === '/zh-hant' || currentPath === '/zh-hant/') && urlLanguage === 'zh') {
    // 1. 如果 URL 有明確的中文語言路徑，優先使用
    selectedLanguage = 'zh';
    console.log('Language detected from URL:', urlLanguage, 'Path:', currentPath);
  } else if (currentPath === '/' && savedLanguage) {
    // 2. 根路徑且有保存的用戶偏好，使用保存的設定
    selectedLanguage = savedLanguage;
    console.log('Language loaded from localStorage:', savedLanguage);
    // 更新 URL 以反映保存的語言偏好
    updateUrlForLanguage(savedLanguage);
  } else if (currentPath === '/') {
    // 3. 根路徑的新用戶：根據瀏覽器語言自動判斷
    selectedLanguage = browserLanguage;
    console.log('Language auto-detected from browser:', browserLanguage, 'from languages:', navigator.languages);
    // 更新 URL 和 localStorage
    updateUrlForLanguage(selectedLanguage);
  } else {
    // 4. 其他情況（如英文路徑），使用 URL 偵測結果
    selectedLanguage = urlLanguage || 'en';
    console.log('Language fallback to URL detection or English:', selectedLanguage);
  }
  
  // 應用選定的語言
  currentLanguage = selectedLanguage;
  localStorage.setItem('language', selectedLanguage);
  
  // 更新所有 UI 元素
  updateAllTexts();
  updatePrivacyText();
  updateFormatPreview();
  updateFormValidationMessages();
  updateLanguageSwitcher();
  
  // 控制格式預覽顯示
  const formatPreview = document.getElementById('formatPreview');
  if (formatPreview) {
    formatPreview.style.display = (currentLanguage === 'zh') ? 'block' : 'none';
  }
  
  // 輸出最終選定的語言資訊（開發用）
  console.log('Final language selected:', currentLanguage, 'URL:', window.location.pathname);
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
        showAlert(getAlertMessage('countRange'), 'error');
        return;
    }

    if (codeLength < 4 || codeLength > 20) {
        showAlert(getAlertMessage('lengthRange'), 'error');
        return;
    }

    // 計算前後綴總長度
    const affixTotalLength = prefix.length + suffix.length;
    const actualCodeLength = codeLength - affixTotalLength;
    
    // 驗證前後綴長度
    if (affixTotalLength >= codeLength) {
        showAlert(getAlertMessage('affixTooLong', affixTotalLength, codeLength), 'error');
        return;
    }
    
    if (actualCodeLength < 1) {
        showAlert(getAlertMessage('actualLengthTooShort'), 'error');
        return;
    }

    // 驗證專屬碼組成
    if (letterCount < 0 || digitCount < 0) {
        showAlert(getAlertMessage('negativeNumbers'), 'error');
        return;
    }

    if (letterCount + digitCount > actualCodeLength) {
        showAlert(getAlertMessage('compositionExceedsLength', letterCount, digitCount, letterCount + digitCount, actualCodeLength), 'error');
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

    showAlert(getAlertMessage('generateSuccess', data.total_codes.toLocaleString(), data.total_time), 'success');
});

socket.on('error', (data) => {
    showAlert(data.message, 'error');
    progressSection.classList.remove('show');
    resetGenerateButton();
});

// 隨機完成訊息
// 完成訊息現在使用翻譯系統

// 顯示結果
function displayResults(codes, totalTime) {
    const preview = codes.slice(0, 50); // 只顯示前50個
    const remaining = codes.length - preview.length;

    // 隨機選擇完成訊息（使用翻譯系統）
    const t = translations[currentLanguage];
    const randomMessage = t.completionMessages[Math.floor(Math.random() * t.completionMessages.length)];
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

// 下載按鈕動畫效果現在由 download-effects.js 處理

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
    showAlert(getAlertMessage('connectionLost'), 'error');
});

// 主題切換功能
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// 載入儲存的主題偏好
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-theme');
}
// 主題按鈕文字將在語言初始化後設置

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    
    // 保存主題偏好
    if (isLight) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
    
    // 更新主題切換按鈕文字（使用翻譯系統）
    updateThemeToggleText();
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
        codeLengthInput.style.borderColor = '#ff6b6b';
        showAlert(getAlertMessage('affixLengthError', affixTotalLength, codeLength), 'error');
    } else if (letterCount + digitCount > actualCodeLength) {
        letterCountInput.style.borderColor = '#ff6b6b';
        digitCountInput.style.borderColor = '#ff6b6b';
        showAlert(getAlertMessage('compositionError', letterCount, digitCount, letterCount + digitCount, actualCodeLength), 'error');
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
    const t = translations[currentLanguage];
    if (actualCodeLength <= 0) {
        codeDescription = currentLanguage === 'zh' ? '無可用空間' : 'No available space';
    } else if (letterCount === 0 && digitCount === 0) {
        // 自動混合分配
        const t = translations[currentLanguage];
        let caseText = '';
        switch (letterCase) {
            case 'uppercase':
                caseText = t.formatPreview.uppercaseWithDigits;
                break;
            case 'lowercase':
                caseText = t.formatPreview.lowercaseWithDigits;
                break;
            case 'mixed':
                caseText = t.formatPreview.mixedWithDigits;
                break;
        }
        codeDescription = `${caseText} ${t.formatPreview.totalChars.replace('{0}', actualCodeLength)}`;
    } else {
        // 指定分配
        const t = translations[currentLanguage];
        let parts = [];
        if (letterCount > 0) {
            let caseText = '';
            switch (letterCase) {
                case 'uppercase':
                    caseText = t.formatPreview.uppercase;
                    break;
                case 'lowercase':
                    caseText = t.formatPreview.lowercase;
                    break;
                case 'mixed':
                    caseText = t.formatPreview.mixed;
                    break;
            }
            parts.push(`${letterCount} ${caseText}`);
        }
        if (digitCount > 0) {
            parts.push(`${digitCount} ${t.formatPreview.digits}`);
        }
        
        // 如果還有剩餘空間，添加隨機部分
        const specifiedTotal = letterCount + digitCount;
        const remaining = actualCodeLength - specifiedTotal;
        if (remaining > 0) {
            let caseText = '';
            switch (letterCase) {
                case 'uppercase':
                    caseText = t.formatPreview.uppercaseWithDigits;
                    break;
                case 'lowercase':
                    caseText = t.formatPreview.lowercaseWithDigits;
                    break;
                case 'mixed':
                    caseText = t.formatPreview.mixedWithDigits;
                    break;
            }
            parts.push(`${remaining} ${caseText}`);
        }
        
        codeDescription = parts.join(t.formatPreview.and);
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
// 隱私提示現在使用翻譯系統
function getRandomPrivacyText() {
    const t = translations[currentLanguage];
    const random = Math.random();
    
    if (random < 0.7) {
        // 70% 機率顯示標準版本
        return t.privacyTexts[0];
    } else {
        // 30% 機率隨機選擇其他趣味版本
        const funnyTexts = t.privacyTexts.slice(1);
        return funnyTexts[Math.floor(Math.random() * funnyTexts.length)];
    }
}

// 更新隱私提示文字
function updatePrivacyText() {
    const privacyTextElement = document.getElementById('privacyText');
    if (privacyTextElement) {
        privacyTextElement.innerHTML = getRandomPrivacyText();
    }
}

// 獲取翻譯後的 alert 訊息（支援參數替換）
function getAlertMessage(key, ...args) {
    const t = translations[currentLanguage];
    let message = t.alerts[key];
    
    // 替換參數 {0}, {1}, etc.
    args.forEach((arg, index) => {
        message = message.replace(`{${index}}`, arg);
    });
    
    return message;
}

// 語言切換事件監聽器
document.addEventListener('DOMContentLoaded', function() {
    // 初始化語言系統
    initializeLanguage();
    
    // 監聽瀏覽器前進/後退按鈕
    window.addEventListener('popstate', handlePopState);
    
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
    
    // 初始化隱私提示文字（使用翻譯系統）
    updatePrivacyText();
    
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