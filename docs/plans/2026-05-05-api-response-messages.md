# API Response Messages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 為每個後端 API 的所有可能回應（成功、特定錯誤、網路錯誤）設計並實作對應的使用者介面訊息，移除所有 `alert()` 呼叫，改用 inline 元件內顯示錯誤。

**Architecture:** 在 Survey.vue 和 Order.vue 中加入 `errorMsg` ref，每次 API 呼叫前清空，呼叫後依回應內容設定具體訊息並顯示在表單下方。不新增共用元件，維持目前每個元件獨立的設計。

**Tech Stack:** Vue 3 Composition API (`ref`), Axios, TailwindCSS（使用已存在的 bg-red-50/border-red-500 pattern）

---

## 後端 API 回應完整對照表

### Survey.vue 使用的端點

#### `POST /infolinebot/check_user_registered`
| HTTP | 回應 JSON | 現行處理 | 應有處理 |
|------|-----------|---------|---------|
| 200 | `{ result: 'useridisexist', personid }` | ✅ 顯示已綁定畫面 | 不變 |
| 200 | `{ result: 'useridnotexist' }` | ✅ 顯示身分證輸入 | 不變 |
| 403/400/500 | `{ status: 'error', message }` | ❌ alert 系統錯誤 | 顯示「服務暫時無法使用，請稍後再試」並保留 idPending=false |

#### `POST /infolinebot/check_vip`
| HTTP | 回應 JSON | 現行處理 | 應有處理 |
|------|-----------|---------|---------|
| 200 | `{ result: 'personidisexist', personname }` | ✅ 顯示確認姓名 | 不變 |
| 200 | `{ result: 'personidnotexist' }` | ✅ 進入新用戶表單 | 不變 |
| 200 | `{ is_vip: false, message: 'VIP 資料表為空' }` (無 result) | ❌ 靜默進入新用戶表單 | 顯示「系統資料讀取失敗，請聯繫診所」並停在身分證輸入頁 |
| 403/500 | `{ status: 'error', message }` | ❌ alert 驗證失敗 | inline 顯示 `response.data.message` 或「驗證失敗，請稍後再試」 |

#### `POST /infolinebot/add_person_vip`
| HTTP | 回應 JSON | 現行處理 | 應有處理 |
|------|-----------|---------|---------|
| 200 | `{ status: 'success', data: { name, phone } }` | ❌ 顯示 finishAddVIPPersonID 但未顯示姓名 | 傳遞 name 到成功畫面顯示「{name} 綁定成功！」 |
| 400 | `{ status: 'error', message: '查無此身分證號的 VIP 資料' }` | ❌ alert 綁定失敗 | inline 顯示具體訊息 |
| 500 | `{ status: 'error', message: 'Google Sheet 操作失敗: ...' }` | ❌ alert 綁定失敗 | inline 顯示「系統錯誤，請稍後再試」（不顯示內部錯誤細節）|

#### `POST /infolinebot/add_person_info`
| HTTP | 回應 JSON | 現行處理 | 應有處理 |
|------|-----------|---------|---------|
| 200 | `{ status: 'success' }` | ✅ 顯示 finishAddPersonID | 不變 |
| 400 | `{ status: 'error', message: '此身分證號已存在' }` | ❌ **alert '註冊失敗，請稍後再試'** | ⚠️ **inline 顯示「此身分證號已有帳號，如需協助請聯繫診所」** |
| 400 | `{ status: 'error', message: '缺少必要欄位' }` | ❌ alert 註冊失敗 | inline 顯示「請確認姓名與電話欄位已填寫」 |
| 500 | `{ status: 'error', message: 'Google Sheet 操作失敗: ...' }` | ❌ alert 註冊失敗 | inline 顯示「系統錯誤，請稍後再試」|

### Order.vue 使用的端點

#### `POST /infolinebot/check_user_registered`（待遷移，目前仍為 GAS）
> 遷移目標：`POST /infolinebot/order_get_user_registered`

GAS 回應 vs Django `order_get_user_registered` 回應：
| 情況 | GAS 回應 | Django 回應 |
|------|---------|------------|
| 已綁定 | `{ result: 'useridisexist', personid }` | `{ result: 'success', personid, personname, personphone, family_members: [] }` |
| 未綁定 | `{ result: 'useridnotexist' }` | `{ result: 'useridnotexist' }` |
| 基本資料不存在 | (無) | `{ result: 'personidnotexist', message: '請重新綁定或聯絡診所' }` |

遷移後需處理的新案例：`result: 'personidnotexist'` → 顯示「LINE 帳號綁定資料不完整，請前往重新設定」並顯示「前往設定」按鈕

#### `POST /infolinebot/add_order`
| HTTP | 回應 JSON | 現行處理 | 應有處理 |
|------|-----------|---------|---------|
| 200 | `{ status: 'success', message: '預約單建立成功' }` | ✅ 顯示 finishOrder | 不變 |
| 400 | `{ status: 'error', message: '找不到使用者資料，請先完成基本資料填寫' }` | ❌ alert 顯示訊息但無動作 | 顯示「{message}」並附「前往設定」按鈕（`$router.push('/')`） |
| 400 | `{ status: 'error', message: '缺少必要欄位' }` | ✅ alert 顯示具體訊息 | 改為 inline 訊息 |
| 500 | `{ status: 'error', message: 'Google Sheet 操作失敗: ...' }` | ✅ alert 顯示具體訊息 | 改為 inline 訊息「預約系統暫時無法使用，請稍後再試」（不顯示內部細節）|

---

## Task 1: Survey.vue — 加入 inline 錯誤顯示機制

**Files:**
- Modify: `FJU_liff/src/components/Survey.vue`

**Step 1: 在 `<script setup>` 加入 errorMsg ref**

```javascript
const errorMsg = ref('');
```

**Step 2: 在 template 中每個表單區塊加入錯誤顯示元件**

在 `showCheckUserIDisNotExist` 的 form 按鈕前加入：
```html
<div v-if="errorMsg" class="bg-red-50 border-l-4 border-red-500 p-4 mt-2">
    <p class="text-sm text-red-700">{{ errorMsg }}</p>
</div>
```

在 `addPersonID` 的 form 按鈕前也加入同樣的元件。

在 `checkUserVIPisExist` 的按鈕下方加入同樣的元件。

**Step 3: 修改 `checkVIPisExist` 的 catch handler**

```javascript
.catch(error => {
    idPending.value = false;
    showCheckUserIDisNotExist.value = true;
    errorMsg.value = error.code === 'ECONNABORTED'
        ? '連線逾時，請檢查網路後再試'
        : (error.response?.data?.message || '驗證失敗，請稍後再試');
});
```

**Step 4: 修改 `checkVIPisExist` 的 then handler，處理 VIP 表空的 edge case**

```javascript
.then(response => {
    errorMsg.value = '';
    if (response.data.result === "personidisexist") {
        idPending.value = false;
        checkUserVIPisExist.value = true;
        personName.value = response.data.personname;
    } else if (response.data.result === "personidnotexist") {
        idPending.value = false;
        addPersonID.value = true;
    } else {
        // edge case: is_vip=false 但無 result（VIP 表為空等情況）
        idPending.value = false;
        showCheckUserIDisNotExist.value = true;
        errorMsg.value = response.data.message || '系統資料讀取失敗，請聯繫診所';
    }
})
```

**Step 5: 確保每次發出 API 請求前清空 errorMsg**

在每個 API 呼叫函數的最頂端加入 `errorMsg.value = '';`

**Step 6: 手動在本地測試（LIFF 無法本地 login，用 browser devtools 模擬）**

確認 `errorMsg` 顯示在正確位置，樣式與其他 warning 一致。

**Step 7: Commit**
```bash
cd FJU_liff
git add src/components/Survey.vue
git commit -m "feat: add inline error display mechanism to Survey.vue"
```

---

## Task 2: Survey.vue — `add_person_info` 具體錯誤訊息

**Files:**
- Modify: `FJU_liff/src/components/Survey.vue`

**Step 1: 修改 `addPersonIDFunc` 的 catch handler**

```javascript
.catch(error => {
    idPending.value = false;
    addPersonID.value = true;
    if (error.code === 'ECONNABORTED') {
        errorMsg.value = '連線逾時，請檢查網路後再試';
    } else if (error.response?.data?.message === '此身分證號已存在') {
        errorMsg.value = '此身分證號已有帳號，如需協助請聯繫診所';
    } else if (error.response?.data?.message === '缺少必要欄位') {
        errorMsg.value = '請確認姓名與電話欄位已填寫';
    } else {
        errorMsg.value = '系統錯誤，請稍後再試';
    }
});
```

**Step 2: Commit**
```bash
git add src/components/Survey.vue
git commit -m "feat: show specific error message for duplicate ID in add_person_info"
```

---

## Task 3: Survey.vue — `add_person_vip` 個人化成功畫面

**Files:**
- Modify: `FJU_liff/src/components/Survey.vue`

**Step 1: 加入 `vipName` ref 儲存綁定的 VIP 姓名**

```javascript
const vipName = ref('');
```

**Step 2: 修改 `addPersonVIP` 的 then handler**

```javascript
.then(response => {
    idPending.value = false;
    vipName.value = response.data.data?.name || personName.value;
    finishAddVIPPersonID.value = true;
})
```

**Step 3: 修改 `addPersonVIP` 的 catch handler**

```javascript
.catch(error => {
    idPending.value = false;
    checkUserVIPisExist.value = true;
    if (error.code === 'ECONNABORTED') {
        errorMsg.value = '連線逾時，請檢查網路後再試';
    } else {
        errorMsg.value = error.response?.data?.message || '綁定失敗，請稍後再試';
    }
});
```

**Step 4: 修改 `finishAddVIPPersonID` 畫面，顯示姓名**

將目前的 `<h2>綁定成功！</h2>` 改為：
```html
<h2 class="text-2xl font-bold text-green-600 mb-2">{{ vipName }} 綁定成功！</h2>
```

**Step 5: Commit**
```bash
git add src/components/Survey.vue
git commit -m "feat: show VIP name in success screen and specific error in add_person_vip"
```

---

## Task 4: Order.vue — 遷移初始驗證至 `order_get_user_registered`

> 此任務為 GAS 技術債遷移。`order_get_user_registered` 回應比 GAS 豐富（含 personname、family_members）。

**Files:**
- Modify: `FJU_liff/src/components/Order.vue`

**Step 1: 加入 `errorMsg` ref**

```javascript
const errorMsg = ref('');
```

**Step 2: 加入 inline 錯誤顯示元件**

在 `showCheckUserIDisNotExist` 的「前往設定」按鈕前加入：
```html
<div v-if="errorMsg" class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
    <p class="text-sm text-red-700">{{ errorMsg }}</p>
</div>
```

**Step 3: 將 `checkUserIDisExistFunc` 改為呼叫 Django API**

```javascript
const checkUserIDisExistFunc = () => {
    console.log("[Order] checkUserIDisExistFunc 被呼叫, userid:", user.userid);
    const formData = new FormData();
    formData.append('userid', user.userid);

    axios({
        method: 'post',
        url: 'https://fju-line-app.herokuapp.com/infolinebot/order_get_user_registered',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 15000
    })
    .then(response => {
        console.log("[Order] API 回應:", response.data);
        idPending.value = false;
        const { result } = response.data;

        if (result === 'success') {
            personID.value = response.data.personid;
            showCheckUserIDisExist.value = true;
        } else if (result === 'useridnotexist') {
            showCheckUserIDisNotExist.value = true;
        } else if (result === 'personidnotexist') {
            // 有綁定但基本資料不存在（資料異常）
            showCheckUserIDisNotExist.value = true;
            errorMsg.value = response.data.message || 'LINE 帳號綁定資料不完整，請前往重新設定';
        } else {
            showCheckUserIDisNotExist.value = true;
        }
    })
    .catch(error => {
        idPending.value = false;
        showCheckUserIDisNotExist.value = true;
        errorMsg.value = error.code === 'ECONNABORTED'
            ? '連線逾時，請檢查網路後再試'
            : '系統錯誤，請稍後再試';
        console.error("[Order] API 錯誤:", error);
    });
}
```

**Step 4: Commit**
```bash
git add src/components/Order.vue
git commit -m "feat: migrate Order.vue user check from GAS to order_get_user_registered"
```

---

## Task 5: Order.vue — `add_order` 錯誤處理改進

**Files:**
- Modify: `FJU_liff/src/components/Order.vue`

**Step 1: 加入 `orderError` ref 用於表單底部的 inline 錯誤顯示**

```javascript
const orderError = ref('');
```

**Step 2: 在 submit 按鈕下方加入 inline 錯誤訊息**

```html
<div v-if="orderError" class="bg-red-50 border-l-4 border-red-500 p-4 mt-3">
    <p class="text-sm text-red-700">{{ orderError }}</p>
</div>
```

**Step 3: 修改 `addOrderFunc` 的 catch handler**

```javascript
.catch(error => {
    isSending.value = false;
    orderError.value = '';

    if (error.code === 'ECONNABORTED') {
        orderError.value = '連線逾時，請檢查網路後再試';
    } else if (error.response?.data?.message === '找不到使用者資料，請先完成基本資料填寫') {
        // 引導重新綁定
        showCheckUserIDisExist.value = false;
        showCheckUserIDisNotExist.value = true;
        errorMsg.value = '找不到您的帳號資料，請重新完成設定';
    } else if (error.response?.status === 500) {
        orderError.value = '預約系統暫時無法使用，請稍後再試';
    } else {
        orderError.value = error.response?.data?.message || '預約失敗，請稍後再試或聯絡診所';
    }
});
```

**Step 4: 在 `addOrderFunc` 頂部清空 orderError**

```javascript
const addOrderFunc = () => {
    orderError.value = '';
    showError.value = false;
    // ... 其餘不變
```

**Step 5: Commit**
```bash
git add src/components/Order.vue
git commit -m "feat: improve add_order error handling with inline messages and redirect"
```

---

## Task 6: 建置驗證

**Step 1: 執行 build 確認無型別/語法錯誤**

```bash
cd FJU_liff
npm run build
```

Expected: 無 error，build 成功輸出到 `dist/`

**Step 2: 啟動開發伺服器確認 UI 渲染正常**

```bash
npm run dev
```

在瀏覽器開啟 http://localhost:5173，確認各畫面無 JS console error。

**Step 3: Final commit（若有調整）**

```bash
git add .
git commit -m "fix: final adjustments to API response message displays"
```

---

## 驗證清單

- [ ] Survey 頁面所有 API 錯誤不再使用 `alert()`
- [ ] `add_person_info` 重複 ID 時顯示明確的「此身分證號已有帳號」訊息
- [ ] `add_person_vip` 成功畫面顯示 VIP 姓名
- [ ] `check_vip` VIP 表空的 edge case 有明確錯誤訊息
- [ ] Order.vue 初始驗證改用 `order_get_user_registered`（不再依賴 GAS）
- [ ] Order.vue 「找不到使用者」時引導重新設定
- [ ] `npm run build` 成功
