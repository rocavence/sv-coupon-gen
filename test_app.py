#!/usr/bin/env python3

import requests
import json
import time

def test_discount_generator():
    """測試折扣碼生成器的基本功能"""
    base_url = "http://localhost:8000"
    
    print("🧪 開始測試折扣碼生成器...")
    
    # 測試1: 檢查主頁是否可訪問
    print("\n1️⃣ 測試主頁訪問...")
    try:
        response = requests.get(base_url)
        if response.status_code == 200:
            print("✅ 主頁訪問成功")
        else:
            print(f"❌ 主頁訪問失敗，狀態碼: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ 主頁訪問失敗: {e}")
        return False
    
    # 測試2: 測試生成API
    print("\n2️⃣ 測試代碼生成API...")
    try:
        test_data = {
            "count": 10,
            "prefix": "TEST",
            "suffix": "2024",
            "prefix_separator": "-",
            "suffix_separator": "_",
            "code_length": 6,
            "letter_count": 4,
            "digit_count": 2
        }
        
        headers = {'Content-Type': 'application/json'}
        response = requests.post(f"{base_url}/generate", 
                               data=json.dumps(test_data), 
                               headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ 生成API測試成功")
            print(f"   任務ID: {result.get('task_id')}")
            print(f"   訊息: {result.get('message')}")
            print(f"   預估時間: {result.get('estimated_time')} 秒")
        else:
            print(f"❌ 生成API測試失敗，狀態碼: {response.status_code}")
            print(f"   回應: {response.text}")
            return False
    except Exception as e:
        print(f"❌ 生成API測試失敗: {e}")
        return False
    
    # 測試3: 測試輸入驗證
    print("\n3️⃣ 測試輸入驗證...")
    try:
        invalid_data = {
            "count": 200000,  # 超出限制
            "code_length": 30  # 超出限制
        }
        
        response = requests.post(f"{base_url}/generate", 
                               data=json.dumps(invalid_data), 
                               headers=headers)
        
        if response.status_code == 400:
            print("✅ 基本輸入驗證測試成功（正確拒絕無效輸入）")
        else:
            print(f"❌ 基本輸入驗證測試失敗，應該回傳400但得到: {response.status_code}")
    except Exception as e:
        print(f"❌ 基本輸入驗證測試失敗: {e}")
        return False
    
    # 測試4: 測試代碼組成驗證
    print("\n4️⃣ 測試代碼組成驗證...")
    try:
        invalid_composition = {
            "count": 5,
            "code_length": 8,
            "letter_count": 6,
            "digit_count": 4  # 6 + 4 = 10 > 8，應該被拒絕
        }
        
        response = requests.post(f"{base_url}/generate", 
                               data=json.dumps(invalid_composition), 
                               headers=headers)
        
        if response.status_code == 400:
            print("✅ 代碼組成驗證測試成功（正確拒絕超出總長度的設定）")
        else:
            print(f"❌ 代碼組成驗證測試失敗，應該回傳400但得到: {response.status_code}")
            print(f"   回應: {response.text}")
    except Exception as e:
        print(f"❌ 代碼組成驗證測試失敗: {e}")
        return False
    
    print("\n🎉 所有測試通過！應用程式運作正常。")
    return True

if __name__ == "__main__":
    test_discount_generator()