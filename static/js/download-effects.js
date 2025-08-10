// 下載按鈕動畫效果模組 - 包含爆炸特效
// Download Button Animation Effects Module with Explosive Effects

class DownloadButtonEffects {
    constructor() {
        this.downloadBtn = null;
        this.resultsSection = null;
        this.downloadPressStartTime = 0;
        this.clickCount = 0;
        this.isExploded = false;
        this.isReappeared = false; // 是否已重新出現
        this.escapeMode = false; // 是否啟動逃跑模式
        this.initialized = false;
        this.audio = null;
        this.hasPlayedAudio = false;
        this.escapeCount = 0; // 逃跑次數計數器
    }

    // 初始化動畫效果
    init() {
        if (this.initialized) return;
        
        this.downloadBtn = document.getElementById('downloadBtn');
        this.resultsSection = document.getElementById('resultsSection');
        
        if (!this.downloadBtn) {
            console.warn('Download button not found, effects not initialized');
            return;
        }

        // 初始化音效
        this.audio = new Audio('/static/audio/what.mp3');
        this.audio.preload = 'auto';
        this.audio.volume = 0.7;

        this.setupEventListeners();
        this.injectStyles();
        this.initialized = true;
        console.log('Download button effects with explosion initialized');
    }

    // 注入爆炸動畫相關的 CSS
    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes violentShake {
                0%   { transform: rotate(0deg) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                10%  { transform: rotate(-8deg) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                20%  { transform: rotate(12deg) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                30%  { transform: rotate(-15deg) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                40%  { transform: rotate(10deg) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                50%  { transform: rotate(-12deg) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                60%  { transform: rotate(8deg) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                70%  { transform: rotate(-10deg) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                80%  { transform: rotate(6deg) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                90%  { transform: rotate(-4deg) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                100% { transform: rotate(0deg) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
            }

            @keyframes finalBounce {
                0%   { transform: translateY(0px) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                15%  { transform: translateY(-30px) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                30%  { transform: translateY(0px) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                40%  { transform: translateY(-30px) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                50%  { transform: translateY(0px) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                58%  { transform: translateY(-30px) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                66%  { transform: translateY(0px) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                72%  { transform: translateY(-30px) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                78%  { transform: translateY(0px) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                83%  { transform: translateY(-30px) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                88%  { transform: translateY(0px) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                92%  { transform: translateY(-30px) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                96%  { transform: translateY(0px) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
                100% { transform: translateY(0px) translate(var(--offset-x, 0px), var(--offset-y, 0px)); }
            }

            .animate-shake {
                animation: violentShake 0.5s ease-in-out;
                transform-origin: center center;
            }
            
            .animate-bounce {
                animation: finalBounce 0.6s ease-in;
            }
            
            .explosion-particle {
                position: absolute;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1001;
            }
            
            .explosion-ash {
                position: absolute;
                width: 3px;
                height: 3px;
                background: #666;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1001;
            }
            
            .explosion-flash {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: white;
                pointer-events: none;
                opacity: 0;
                z-index: 1000;
                transition: opacity 0.1s;
            }
        `;
        document.head.appendChild(style);
    }

    // 設置事件監聽器
    setupEventListeners() {
        // 滑鼠按壓效果
        this.downloadBtn.addEventListener('mousedown', () => {
            if (!this.isExploded) this.downloadPressStartTime = Date.now();
        });

        this.downloadBtn.addEventListener('mouseup', (e) => {
            if (this.isExploded) return;
            const duration = Date.now() - this.downloadPressStartTime;
            const fakeForce = Math.min(1, duration / 500);
            this.triggerDownloadBounce(e, fakeForce);
            this.checkExplosion();
        });

        // 觸控支援
        this.downloadBtn.addEventListener('touchstart', () => {
            if (!this.isExploded) this.downloadPressStartTime = Date.now();
        });

        this.downloadBtn.addEventListener('touchend', (e) => {
            if (this.isExploded) return;
            const touch = e.changedTouches[0];
            let force = 0;
            if (touch.force !== undefined && touch.force > 0) {
                force = Math.min(1, touch.force);
            } else {
                const duration = Date.now() - this.downloadPressStartTime;
                force = Math.min(1, duration / 500);
            }
            this.triggerDownloadBounce(e, force);
            this.checkExplosion();
        });

        // 滑鼠靠近閃避效果
        document.addEventListener('mousemove', (e) => {
            this.handleMouseHover(e);
        });
    }

    // Q 彈動畫效果
    triggerDownloadBounce(e, force) {
        if (!this.downloadBtn || this.isExploded) return;

        const rect = this.downloadBtn.getBoundingClientRect();
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
        this.downloadBtn.style.setProperty('--angle', `${rawAngle}deg`);

        // 力道影響壓縮比例
        const squashX = 1 + 0.15 * force;
        const squashY = 1 - 0.15 * force;
        const stretchX = 1 - 0.08 * force;
        const stretchY = 1 + 0.08 * force;

        this.downloadBtn.style.setProperty('--squash-transform', `scale(${squashX}, ${squashY}) rotate(${rawAngle}deg)`);
        this.downloadBtn.style.setProperty('--stretch-transform', `scale(${stretchX}, ${stretchY}) rotate(${rawAngle}deg)`);

        // 觸發動畫
        this.downloadBtn.classList.remove('animate-squash');
        void this.downloadBtn.offsetWidth; // 強制重排
        this.downloadBtn.classList.add('animate-squash');
    }

    // 滑鼠靠近閃避效果
    handleMouseHover(e) {
        if (!this.downloadBtn || !this.resultsSection) return;
        if (!this.resultsSection.classList.contains('show')) return;
        
        const rect = this.downloadBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 判斷感應範圍和行為模式
        const radius = this.escapeMode ? 200 : 120;
        
        if (distance < radius) {
            let offsetX, offsetY;

            // 檢查是否為爆炸後首次靠近（啟動逃跑模式）
            if (this.isReappeared && !this.escapeMode) {
                this.escapeMode = true; // 啟動逃跑模式
                
                // 播放第一次音效
                if (this.audio && !this.hasPlayedAudio) {
                    this.hasPlayedAudio = true;
                    this.audio.currentTime = 0;
                    this.audio.play().catch(e => console.log('Audio play failed:', e));
                }
            }

            if (this.escapeMode) {
                // 逃跑模式：瘋狂逃跑
                this.escapeCount++;
                
                // 每逃跑5次播放音效
                if (this.escapeCount % 5 === 0 && this.audio) {
                    this.audio.currentTime = 0;
                    this.audio.play().catch(e => console.log('Audio play failed:', e));
                }

                // 逃跑到畫面任意位置
                const escapeMultiplier = 2 + Math.random() * 3;
                const avoidanceRadius = Math.min(window.innerWidth, window.innerHeight) * 0.3;
                
                // 計算逃跑方向（遠離滑鼠）
                const escapeAngle = Math.atan2(-dy, -dx);
                const escapeDistance = avoidanceRadius * escapeMultiplier;
                
                offsetX = Math.cos(escapeAngle) * escapeDistance;
                offsetY = Math.sin(escapeAngle) * escapeDistance;
                
                // 確保按鈕移動後仍在畫面內
                const buttonWidth = rect.width;
                const buttonHeight = rect.height;
                const margin = 30;
                
                let newX = centerX + offsetX;
                let newY = centerY + offsetY;
                
                // 邊界檢查
                if (newX - buttonWidth/2 < margin) {
                    newX = margin + buttonWidth/2;
                } else if (newX + buttonWidth/2 > window.innerWidth - margin) {
                    newX = window.innerWidth - margin - buttonWidth/2;
                }
                
                if (newY - buttonHeight/2 < margin) {
                    newY = margin + buttonHeight/2;
                } else if (newY + buttonHeight/2 > window.innerHeight - margin) {
                    newY = window.innerHeight - margin - buttonHeight/2;
                }
                
                // 計算最終偏移量
                offsetX = newX - centerX;
                offsetY = newY - centerY;
                
                // 添加隨機抖動
                offsetX += (Math.random() - 0.5) * 50;
                offsetY += (Math.random() - 0.5) * 50;
                
                this.downloadBtn.style.transition = 'transform 0.3s ease-out';
                
            } else {
                // 爆炸前：小範圍閃避
                const factor = (radius - distance) / radius;
                const maxOffset = 20;
                offsetX = Math.min(maxOffset, dx * factor * 0.5) * -1;
                offsetY = Math.min(maxOffset, dy * factor * 0.5) * -1;
                this.downloadBtn.style.transition = 'transform 0.1s ease-out';
            }

            this.downloadBtn.style.setProperty('--offset-x', `${offsetX}px`);
            this.downloadBtn.style.setProperty('--offset-y', `${offsetY}px`);
            this.downloadBtn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        } else {
            // 只有在非逃跑模式才回到原位
            if (!this.escapeMode) {
                this.downloadBtn.style.setProperty('--offset-x', `0px`);
                this.downloadBtn.style.setProperty('--offset-y', `0px`);
                this.downloadBtn.style.transform = `translate(0px, 0px)`;
                this.downloadBtn.style.transition = 'transform 0.2s ease-out';
            }
        }
    }

    // 檢查爆炸條件
    checkExplosion() {
        this.clickCount++;
        
        if (this.clickCount >= 3) {
            this.isExploded = true;
            
            // 先播放抖動動畫
            this.downloadBtn.classList.remove('animate-squash');
            this.downloadBtn.classList.add('animate-shake');
            
            // 0.5秒後播放彈跳動畫
            setTimeout(() => {
                this.downloadBtn.classList.remove('animate-shake');
                this.downloadBtn.classList.add('animate-bounce');
                
                // 再0.6秒後爆炸
                setTimeout(() => {
                    this.createExplosion();
                }, 600);
            }, 500);
        }
    }

    // 創建爆炸效果
    createExplosion() {
        const rect = this.downloadBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const buttonSize = Math.max(rect.width, rect.height);
        const maxRange = buttonSize * 2;
        const groundLevel = rect.bottom;
        
        // 隱藏按鈕
        this.downloadBtn.style.opacity = '0';
        this.downloadBtn.style.pointerEvents = 'none';
        
        // 創建閃光效果
        const flash = document.createElement('div');
        flash.className = 'explosion-flash';
        document.body.appendChild(flash);
        
        // 閃光動畫
        setTimeout(() => {
            flash.style.opacity = '0.7';
            setTimeout(() => {
                flash.style.opacity = '0';
                setTimeout(() => {
                    flash.remove();
                }, 200);
            }, 100);
        }, 10);
        
        // 創建90個爆炸粒子
        for (let i = 0; i < 90; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            
            const colors = ['#ff6b6b', '#ff9f43', '#ee5a52', '#feca57', '#ff7675'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            const size = Math.random() * 6 + 3;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / 90;
            const velocity = Math.random() * 150 + 50;
            
            let x = 0;
            let y = 0;
            let vx = Math.cos(angle) * velocity;
            let vy = Math.sin(angle) * velocity;
            let startTime = Date.now();
            let hasLanded = false;
            
            const animateParticle = () => {
                const elapsed = (Date.now() - startTime) / 1000;
                
                if (!hasLanded) {
                    const distance = Math.sqrt(x*x + y*y);
                    if (distance < maxRange) {
                        vx *= 0.99;
                        vy = vy * 0.99 + 300 * elapsed;
                        
                        x += vx * elapsed;
                        y += vy * elapsed;
                        
                        if (centerY + y >= groundLevel) {
                            hasLanded = true;
                            y = groundLevel - centerY;
                            
                            particle.className = 'explosion-ash';
                            particle.style.background = '#666';
                            particle.style.width = '2px';
                            particle.style.height = '2px';
                        }
                    } else {
                        vx *= 0.8;
                        vy *= 0.8;
                        x += vx * elapsed;
                        y += vy * elapsed;
                    }
                    
                    particle.style.transform = `translate(${x}px, ${y}px)`;
                    particle.style.opacity = Math.max(0, 1 - elapsed * 0.8);
                } else {
                    particle.style.transform = `translate(${x}px, ${y}px)`;
                    particle.style.opacity = Math.max(0, 0.8 - elapsed * 0.3);
                }
                
                if (elapsed < 4) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            };
            
            animateParticle();
        }
        
        // 3秒後讓按鈕重新出現在原位
        setTimeout(() => {
            this.reappearButton();
        }, 3000);
    }

    // 讓按鈕重新出現在原位（但保持爆炸狀態）
    reappearButton() {
        this.isReappeared = true;
        
        if (this.downloadBtn) {
            this.downloadBtn.style.opacity = '1';
            this.downloadBtn.style.pointerEvents = 'auto';
            this.downloadBtn.classList.remove('animate-shake', 'animate-bounce');
            // 重置位置到原點
            this.downloadBtn.style.setProperty('--offset-x', '0px');
            this.downloadBtn.style.setProperty('--offset-y', '0px');
            this.downloadBtn.style.transform = 'translate(0px, 0px)';
        }
    }

    // 重置爆炸狀態
    resetExplosion() {
        this.isExploded = false;
        this.isReappeared = false;
        this.escapeMode = false;
        this.clickCount = 0;
        this.hasPlayedAudio = false;
        this.escapeCount = 0;
        
        if (this.downloadBtn) {
            this.downloadBtn.style.opacity = '1';
            this.downloadBtn.style.pointerEvents = 'auto';
            this.downloadBtn.classList.remove('animate-shake', 'animate-bounce');
            // 重置位置到原點
            this.downloadBtn.style.setProperty('--offset-x', '0px');
            this.downloadBtn.style.setProperty('--offset-y', '0px');
            this.downloadBtn.style.transform = 'translate(0px, 0px)';
        }
    }

    // 重置動畫狀態
    reset() {
        if (!this.downloadBtn) return;
        
        this.downloadBtn.classList.remove('animate-squash', 'animate-shake', 'animate-bounce');
        this.downloadBtn.style.setProperty('--offset-x', '0px');
        this.downloadBtn.style.setProperty('--offset-y', '0px');
        this.downloadBtn.style.transform = 'translate(0px, 0px)';
        this.downloadBtn.style.setProperty('--angle', '0deg');
        this.resetExplosion();
    }

    // 銷毀實例
    destroy() {
        this.reset();
        this.downloadBtn = null;
        this.resultsSection = null;
        this.initialized = false;
    }
}

// 創建全局實例
const downloadEffects = new DownloadButtonEffects();

// DOM 載入完成後初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        downloadEffects.init();
    });
} else {
    // 如果 DOM 已經載入完成
    downloadEffects.init();
}

// 導出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DownloadButtonEffects;
} else {
    // 瀏覽器環境下掛載到全局對象
    window.DownloadButtonEffects = DownloadButtonEffects;
    window.downloadEffects = downloadEffects;
}