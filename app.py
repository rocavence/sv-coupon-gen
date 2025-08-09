from flask import Flask, render_template, request, jsonify, Response
from flask_socketio import SocketIO, emit
import random
import string
import time
import json
import threading
from datetime import datetime
import uuid

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
socketio = SocketIO(app, cors_allowed_origins="*")

# 全域變數來追蹤產生任務
generation_tasks = {}

class DiscountCodeGenerator:
    def __init__(self, count, prefix="", suffix="", code_length=8, letter_count=0, digit_count=0, letter_case="uppercase"):
        self.count = count
        self.prefix = prefix
        self.suffix = suffix
        self.code_length = code_length
        self.letter_count = letter_count or 0
        self.digit_count = digit_count or 0
        self.letter_case = letter_case
        self.batch_size = 1000  # 每批處理1000筆
        
    def generate_single_code(self):
        """產生單一專屬碼"""
        # 計算前後綴長度
        affix_total_length = len(self.prefix) + len(self.suffix)
        actual_code_length = self.code_length - affix_total_length
        
        # 根據大小寫設定選擇字母
        if self.letter_case == "lowercase":
            letters = string.ascii_lowercase
        elif self.letter_case == "mixed":
            letters = string.ascii_letters
        else:  # uppercase (預設)
            letters = string.ascii_uppercase
            
        digits = string.digits
        
        # 決定字母和數字的數量
        if self.letter_count == 0 and self.digit_count == 0:
            # 自動分配：混合字母和數字
            characters = letters + digits
            code = ''.join(random.choice(characters) for _ in range(actual_code_length))
        else:
            # 指定分配
            letter_count = self.letter_count
            digit_count = self.digit_count
            
            # 如果指定的總數小於實際專屬碼長度，剩餘部分隨機分配
            remaining = actual_code_length - letter_count - digit_count
            if remaining > 0:
                # 隨機分配剩餘字元
                extra_letters = random.randint(0, remaining)
                extra_digits = remaining - extra_letters
                letter_count += extra_letters
                digit_count += extra_digits
            
            # 產生指定數量的字母和數字
            code_chars = []
            code_chars.extend(random.choices(letters, k=letter_count))
            code_chars.extend(random.choices(digits, k=digit_count))
            
            # 打亂順序
            random.shuffle(code_chars)
            code = ''.join(code_chars)
        
        result = code
        
        # 添加前綴（如果有）
        if self.prefix:
            result = self.prefix + result
        
        # 添加後綴（如果有）
        if self.suffix:
            result = result + self.suffix
                
        return result
    
    def generate_batch(self, task_id, socket_session):
        """批量產生專屬碼"""
        codes = []
        start_time = time.time()
        
        total_batches = (self.count + self.batch_size - 1) // self.batch_size
        
        for batch_num in range(total_batches):
            batch_start = batch_num * self.batch_size
            batch_end = min((batch_num + 1) * self.batch_size, self.count)
            batch_size_actual = batch_end - batch_start
            
            # 產生當前批次
            batch_codes = []
            for _ in range(batch_size_actual):
                code = self.generate_single_code()
                batch_codes.append(code)
            
            codes.extend(batch_codes)
            
            # 計算進度
            completed = batch_end
            progress = (completed / self.count) * 100
            
            # 計算預估剩餘時間
            elapsed_time = time.time() - start_time
            if completed > 0:
                avg_time_per_code = elapsed_time / completed
                remaining_codes = self.count - completed
                estimated_remaining = avg_time_per_code * remaining_codes
            else:
                estimated_remaining = 0
            
            # 發送進度更新
            progress_data = {
                'task_id': task_id,
                'progress': round(progress, 2),
                'completed': completed,
                'total': self.count,
                'estimated_remaining': round(estimated_remaining, 1),
                'batch_num': batch_num + 1,
                'total_batches': total_batches
            }
            
            socketio.emit('progress_update', progress_data, room=socket_session)
            
            # 短暫延遲避免過度佔用CPU
            time.sleep(0.01)
        
        # 完成通知
        total_time = time.time() - start_time
        completion_data = {
            'task_id': task_id,
            'status': 'completed',
            'codes': codes,
            'total_time': round(total_time, 2),
            'total_codes': len(codes)
        }
        
        socketio.emit('generation_complete', completion_data, room=socket_session)
        
        # 清理任務
        if task_id in generation_tasks:
            del generation_tasks[task_id]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/health')
def health_check():
    """健康檢查端點 - Health check endpoint for monitoring"""
    return {
        'status': 'healthy',
        'service': '街聲專屬碼產生器',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    }

@app.route('/generate', methods=['POST'])
def generate_codes():
    try:
        data = request.get_json()
        
        count = int(data.get('count', 1000))
        prefix = data.get('prefix', '').strip()
        suffix = data.get('suffix', '').strip()
        code_length = int(data.get('code_length', 8))
        letter_count = int(data.get('letter_count', 0))
        digit_count = int(data.get('digit_count', 0))
        letter_case = data.get('letter_case', 'uppercase')
        
        # 驗證輸入
        if count <= 0 or count > 100000:
            return jsonify({'error': '專屬碼數量必須在 1 到 100,000 之間'}), 400
        
        if code_length < 4 or code_length > 20:
            return jsonify({'error': '專屬碼長度必須在 4 到 20 之間'}), 400
            
        if letter_count < 0 or digit_count < 0:
            return jsonify({'error': '英文字母和數字數量不能為負數'}), 400
        
        # 計算前後綴總長度
        affix_total_length = len(prefix) + len(suffix)
        actual_code_length = code_length - affix_total_length
        
        # 驗證前後綴長度
        if affix_total_length >= code_length:
            return jsonify({'error': f'前後綴總長度({affix_total_length})不能大於等於專屬碼長度({code_length})'}), 400
        
        if actual_code_length < 1:
            return jsonify({'error': f'扣除前後綴後，實際專屬碼長度必須至少為1'}), 400
            
        if letter_count + digit_count > actual_code_length:
            return jsonify({'error': f'英文字母數量({letter_count}) + 數字數量({digit_count}) = {letter_count + digit_count} 不能超過實際專屬碼長度({actual_code_length})'}), 400
        
        # 產生任務ID
        task_id = str(uuid.uuid4())
        
        # 回傳任務ID給前端
        return jsonify({
            'task_id': task_id,
            'message': '開始產生專屬碼...',
            'estimated_time': round(count * 0.0001, 2)  # 粗略估算
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')

@socketio.on('start_generation')
def handle_start_generation(data):
    try:
        task_id = data.get('task_id')
        count = int(data.get('count', 1000))
        prefix = data.get('prefix', '').strip()
        suffix = data.get('suffix', '').strip()
        code_length = int(data.get('code_length', 8))
        letter_count = int(data.get('letter_count', 0))
        digit_count = int(data.get('digit_count', 0))
        letter_case = data.get('letter_case', 'uppercase')
        
        # 建立產生器
        generator = DiscountCodeGenerator(
            count=count,
            prefix=prefix,
            suffix=suffix,
            code_length=code_length,
            letter_count=letter_count,
            digit_count=digit_count,
            letter_case=letter_case
        )
        
        # 記錄任務
        generation_tasks[task_id] = {
            'status': 'running',
            'start_time': datetime.now(),
            'session': request.sid
        }
        
        # 在背景執行緒中開始產生
        thread = threading.Thread(
            target=generator.generate_batch,
            args=(task_id, request.sid)
        )
        thread.daemon = True
        thread.start()
        
        emit('generation_started', {'task_id': task_id, 'status': 'started'})
        
    except Exception as e:
        emit('error', {'message': str(e)})

if __name__ == '__main__':
    import os
    
    # 從環境變數取得設定，Render 會自動提供 PORT
    port = int(os.environ.get('PORT', 8000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    
    print(f"🚀 啟動街聲專屬碼產生器...")
    print(f"   Port: {port}")
    print(f"   Debug: {debug}")
    print(f"   Environment: {os.environ.get('FLASK_ENV', 'development')}")
    
    socketio.run(app, debug=debug, host='0.0.0.0', port=port, allow_unsafe_werkzeug=True)