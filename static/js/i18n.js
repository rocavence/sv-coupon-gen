// 國際化翻譯系統 - 專屬碼產生器
// Internationalization (i18n) system for Exclusive Code Generator

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
    
    // 動態完成訊息
    completionMessages: [
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
    ],
    
    // 隱私提示（動態隨機內容）
    privacyTexts: [
      "請放心！我們不會儲存你產生的專屬碼，<br>所有專屬碼都在本地產生且只存在於你的瀏覽器中。",
      "專屬碼：生於瀏覽器，死於分頁關閉。",
      "我們不存，你不存，誰都不存。", 
      "專屬碼不會上雲，因為它懶，根本懶得爬。",
      "本地現做，關掉就掰。",
      "伺服器：我哪有看到專屬碼？蛤？"
    ],
    
    // 表單佔位符
    placeholders: {
      autoAllocation: "0 = 自動分配",
      prefixExample: "例如: SALE",
      suffixExample: "例如: 2024"
    },
    
    // 下拉選單選項
    letterCaseOptions: {
      uppercase: "全部大寫",
      lowercase: "全部小寫",
      mixed: "大小寫混合"
    },
    
    // 說明文字
    advancedSettings: "進階設定",
    
    // 預覽內容
    formatPreview: {
      uppercase: "大寫英文字",
      lowercase: "小寫英文字", 
      mixed: "混合英文字",
      uppercaseWithDigits: "大寫英文字及數字",
      lowercaseWithDigits: "小寫英文字及數字",
      mixedWithDigits: "混合英文字及數字",
      digits: "數字",
      totalChars: "共{0}碼",
      and: "及"
    },
    
    // Alert 訊息
    alerts: {
      countRange: "專屬碼數量必須在 1 到 100,000 之間",
      lengthRange: "專屬碼長度必須在 4 到 20 之間",
      affixTooLong: "前後綴總長度({0})不能大於等於專屬碼長度({1})",
      actualLengthTooShort: "扣除前後綴後，實際專屬碼長度必須至少為1",
      negativeNumbers: "英文字母和數字數量不能為負數",
      compositionExceedsLength: "英文字母數量({0}) + 數字數量({1}) = {2} 不能超過實際專屬碼長度({3})",
      generateSuccess: "成功產生 {0} 個專屬碼（耗時 {1} 秒）",
      connectionLost: "與伺服器連線中斷，請重新整理頁面",
      affixLengthError: "前後綴總長度({0}) >= 專屬碼長度({1})",
      compositionError: "英文({0}) + 數字({1}) = {2} > 實際專屬碼長度({3})",
      prefixTooLong: "前綴長度不能超過 10 個字元",
      suffixTooLong: "後綴長度不能超過 10 個字元"
    },
    
    // 主題切換
    themeToggle: {
      dark: "🌚 深色模式",
      light: "🌝 淺色模式"
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
    
    // Dynamic completion messages
    completionMessages: [
      "Woohoo~ All codes are born perfectly! 🥺✨",
      "Whoa! What are these exclusive codes~ Haha~ 💦",
      "Wow wow~ Exclusive code army assembled! 🎵",
      "Uwu~ All done!",
      "Weeee~ Exclusive code babies are born! 👶",
      "Code generation ✅ Boss happy ✅ Off work time ❌",
      "These codes are more organized than my life 🤡",
      "Great code harvest! Better than gacha pulls 🎰",
      "Congrats! You got rare SSR exclusive codes! 🌟",
      "Code manufacturing complete, factory closed today 🏭",
      "Zen generation complete, Amitabha 🙏",
      "Exclusive code farm mega harvest! Super awesome 🌾",
      "Code cuisine ready, please enjoy~ 👨‍🍳",
      "Beep beep~ Code shipment complete! 📦",
      "Exclusive code generation jutsu・Success! ⚡",
      "Discount code factory: Today's sales target achieved! 💰",
      "Code Pokémon: Wild exclusive codes appeared en masse!",
      "Mission complete! EXP +999999 ✨",
      "Code printer: Out of ink, please refill 🖨️",
      "Discount password unlocked, boss please accept 😎"
    ],
    
    // Privacy texts (dynamic random content)
    privacyTexts: [
      "Rest assured! We don't store your generated codes.<br>All codes are generated locally and exist only in your browser.",
      "Exclusive codes: Born in browser, die when tab closes.",
      "We don't store, you don't store, nobody stores.", 
      "Codes won't go to cloud, they're too lazy to climb up.",
      "Locally made, gone when closed.",
      "Server: Did I see any codes? Huh?"
    ],
    
    // Form placeholders
    placeholders: {
      autoAllocation: "0 = Auto allocate",
      prefixExample: "e.g.: SALE",
      suffixExample: "e.g.: 2024"
    },
    
    // Dropdown options
    letterCaseOptions: {
      uppercase: "All Uppercase",
      lowercase: "All Lowercase",
      mixed: "Mixed Case"
    },
    
    // Help texts
    advancedSettings: "Advanced Settings",
    
    // Format preview content
    formatPreview: {
      uppercase: "uppercase letters",
      lowercase: "lowercase letters", 
      mixed: "mixed case letters",
      uppercaseWithDigits: "uppercase letters and digits",
      lowercaseWithDigits: "lowercase letters and digits",
      mixedWithDigits: "mixed case letters and digits",
      digits: "digits",
      totalChars: "{0} characters total",
      and: " and "
    },
    
    // Alert messages
    alerts: {
      countRange: "Code count must be between 1 and 100,000",
      lengthRange: "Code length must be between 4 and 20 characters",
      affixTooLong: "Total prefix/suffix length ({0}) cannot be greater than or equal to code length ({1})",
      actualLengthTooShort: "After subtracting prefix/suffix, actual code length must be at least 1",
      negativeNumbers: "Letter and digit counts cannot be negative",
      compositionExceedsLength: "Letter count ({0}) + digit count ({1}) = {2} cannot exceed actual code length ({3})",
      generateSuccess: "Successfully generated {0} codes in {1} seconds",
      connectionLost: "Connection to server lost, please refresh the page",
      affixLengthError: "Total prefix/suffix length ({0}) >= code length ({1})",
      compositionError: "Letters ({0}) + digits ({1}) = {2} > actual code length ({3})",
      prefixTooLong: "Prefix length cannot exceed 10 characters",
      suffixTooLong: "Suffix length cannot exceed 10 characters"
    },
    
    // Theme toggle  
    themeToggle: {
      dark: "🌚 Dark Mode",
      light: "🌝 Light Mode"
    },
    
    // Footer
    footerText: "Exclusive Code Generator · powered by", 
    footerNote: "All functions run in the browser to ensure your data security."
  }
};

// 導出翻譯對象供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = translations;
} else {
  // 瀏覽器環境下直接掛載到全局對象
  window.translations = translations;
}