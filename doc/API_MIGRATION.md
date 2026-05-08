# Google Script API 遷移到 LINE Bot API 指南

## 📋 概述

本文檔說明如何將 LIFF 前端從 Google Apps Script API 遷移到 Django LINE Bot API。

---

## 🔄 API 對應表

| Google Script Method | LINE Bot API 端點 | 功能說明 |
|---------------------|------------------|---------|
| `checkUserIDisExist` | `/infolinebot/check_user_registered` | 檢查使用者 LINE ID 是否已註冊綁定身分證 |
| `checkVIPisExist` | `/infolinebot/check_person_exists` | 檢查身分證是否存在於患者資料表 |
| `addPersonID` | `/infolinebot/add_person_info` | 新增基本資料並綁定裝置 |
| `addPersonVIP` | `/infolinebot/add_person_vip` | 升級為 VIP 會員 |

---

## 📝 API 詳細說明

### 1. check_user_registered（檢查使用者是否已註冊）

**原 Google Script:**
```javascript
method: 'checkUserIDisExist'
```

**新 LINE Bot API:**
- **端點：** `POST/GET /infolinebot/check_user_registered`
- **參數：**
  - `userid` - LINE User ID (必填)

**請求範例：**
```javascript
const formData = new FormData();
formData.append('userid', 'U026dd072b34c71593f4fb6d1176d2c20');

axios({
    method: 'post',
    url: 'http://localhost:8000/infolinebot/check_user_registered',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
})
```

**返回格式：**
```json
// 已註冊
{
  "status": "success",
  "result": "useridisexist",
  "personid": "A123456789"
}

// 未註冊
{
  "status": "success",
  "result": "useridnotexist"
}
```

---

### 2. check_person_exists（檢查身分證是否存在）

**原 Google Script:**
```javascript
method: 'checkVIPisExist'
```

**新 LINE Bot API:**
- **端點：** `POST/GET /infolinebot/check_person_exists`
- **參數：**
  - `personid` - 身分證字號 (必填)
  - `userid` - LINE User ID (選填)

**請求範例：**
```javascript
const formData = new FormData();
formData.append('personid', 'A123456789');
formData.append('userid', 'U026dd072b34c71593f4fb6d1176d2c20');

axios({
    method: 'post',
    url: 'http://localhost:8000/infolinebot/check_person_exists',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
})
```

**返回格式：**
```json
// 存在
{
  "status": "success",
  "result": "personidisexist",
  "personname": "王小明",
  "personphone": "0912345678"
}

// 不存在
{
  "status": "success",
  "result": "personidnotexist"
}
```

---

### 3. add_person_info（新增基本資料）

**原 Google Script:**
```javascript
method: 'addPersonID'
```

**新 LINE Bot API:**
- **端點：** `POST /infolinebot/add_person_info`
- **參數：**
  - `method` - 固定值 `addPersonID`
  - `personname` - 姓名 (必填)
  - `personphone` - 電話 (必填)
  - `personid` - 身分證字號 (必填)
  - `userid` - LINE User ID (必填)

**請求範例：**
```javascript
const formData = new FormData();
formData.append('method', 'addPersonID');
formData.append('personname', '王小明');
formData.append('personphone', '0912345678');
formData.append('personid', 'A123456789');
formData.append('userid', 'U026dd072b34c71593f4fb6d1176d2c20');

axios({
    method: 'post',
    url: 'http://localhost:8000/infolinebot/add_person_info',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
})
```

---

### 4. add_person_vip（升級 VIP 會員）

**原 Google Script:**
```javascript
method: 'addPersonVIP'
```

**新 LINE Bot API:**
- **端點：** `POST /infolinebot/add_person_vip`
- **參數：**
  - `method` - 固定值 `addPersonVIP`
  - `personid` - 身分證字號 (必填)
  - `userid` - LINE User ID (必填)

**請求範例：**
```javascript
const formData = new FormData();
formData.append('method', 'addPersonVIP');
formData.append('personid', 'A123456789');
formData.append('userid', 'U026dd072b34c71593f4fb6d1176d2c20');

axios({
    method: 'post',
    url: 'http://localhost:8000/infolinebot/add_person_vip',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
})
```

---

## 🔧 LIFF 前端修改指南

### 修改前（Google Script）
```javascript
const checkUserIDisExistFunc = () => {
    const formData = new FormData();
    formData.append('method', 'checkUserIDisExist');
    formData.append('userid', user.userid);

    axios({
        method: 'post',
        url: 'https://script.google.com/macros/s/AKfycbxv0X4hKmjRsqICHL8WTa4nqpql6Rbq9w1njra_4jcFN-OcbZ4zxARyuyN9h2PCvvnB/exec',
        data: formData,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
    .then(response => {
        if(response.data.result === "useridisexist"){
            // 處理已註冊
        }
    })
}
```

### 修改後（LINE Bot API）
```javascript
const checkUserIDisExistFunc = () => {
    const formData = new FormData();
    formData.append('userid', user.userid);  // 不需要 method 參數

    axios({
        method: 'post',
        url: 'http://localhost:8000/infolinebot/check_user_registered',  // 改為 LINE Bot API
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(response => {
        if(response.data.result === "useridisexist"){
            // 處理已註冊 - 邏輯不變
        }
    })
}
```

---

## 🚀 部署建議

### 開發環境
```
http://localhost:8000/infolinebot/
```

### 生產環境（需設定）
```
https://your-domain.com/infolinebot/
```

---

## ⚡ 性能優勢

新 API 相較於 Google Script：
- ✅ 更快的響應時間（本地部署）
- ✅ 更好的日誌追蹤
- ✅ 完整的性能監控
- ✅ 可自定義錯誤處理
- ✅ 支援 CORS 配置

---

## 📊 測試指令

### 使用 curl 測試

```bash
# 1. 測試 check_user_registered
curl -X POST http://localhost:8000/infolinebot/check_user_registered \
  -d "userid=U026dd072b34c71593f4fb6d1176d2c20"

# 2. 測試 check_person_exists
curl -X POST http://localhost:8000/infolinebot/check_person_exists \
  -d "personid=A123456789" \
  -d "userid=U026dd072b34c71593f4fb6d1176d2c20"

# 3. 測試 add_person_info
curl -X POST http://localhost:8000/infolinebot/add_person_info \
  -d "method=addPersonID" \
  -d "personname=王小明" \
  -d "personphone=0912345678" \
  -d "personid=A123456789" \
  -d "userid=U026dd072b34c71593f4fb6d1176d2c20"

# 4. 測試 add_person_vip
curl -X POST http://localhost:8000/infolinebot/add_person_vip \
  -d "method=addPersonVIP" \
  -d "personid=A123456789" \
  -d "userid=U026dd072b34c71593f4fb6d1176d2c20"
```

---

## ✅ 檢查清單

遷移前請確認：

- [ ] 後端 API 已部署並可訪問
- [ ] CORS 設定正確（允許 `https://liff.line.me`）
- [ ] 環境變數已正確配置
- [ ] Google Sheets API 連接正常
- [ ] 所有 API 端點測試通過
- [ ] 前端 URL 已更新
- [ ] 錯誤處理邏輯檢查完成

---

## 📞 技術支援

如有問題，請查看：
- Django 日誌：`docker-compose logs -f web`
- API 文檔：`http://localhost:8000/`
- 性能日誌：所有 API 都包含詳細的性能追蹤

---

**最後更新：** 2025-10-18
**版本：** 2.0.0
