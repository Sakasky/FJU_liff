# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FJU LIFF (LINE Frontend Framework) application for a clinic system that handles:
- User registration and device binding with personal ID verification
- Medical appointment booking with department selection
- Integration with LINE's LIFF platform for authentication

## Build & Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **Framework**: Vue 3 with Composition API (`<script setup>` syntax)
- **Build Tool**: Vite 5
- **Styling**: TailwindCSS with PostCSS
- **State Management**: Pinia (configured but not actively used in components)
- **Routing**: Vue Router with HTML5 history mode
- **LINE Integration**: @line/liff v2.23.0
- **HTTP Client**: Axios
- **Debugging**: VConsole (available but commented out)

## Application Architecture

### Routes & LIFF IDs

The application has two main routes, each with different LINE LIFF IDs:

1. **Home Route (`/`)** → [Home.vue](src/views/Home.vue)
   - LIFF ID: `1657869644-jDxqpoMV`
   - Purpose: User registration and device binding
   - Component: [Survey.vue](src/components/Survey.vue)

2. **Order Route (`/order`)** → [OrderView.vue](src/views/OrderView.vue)
   - LIFF ID: `1657869644-x3BZd5wE`
   - Purpose: Medical appointment booking
   - Component: [Order.vue](src/components/Order.vue)

### Backend APIs

所有 API 基底：`https://fju-line-app.herokuapp.com/infolinebot/`

#### Survey.vue（已遷移至 Heroku Django API）
- `check_user_registered`：查詢 LINE PID 是否已綁定
- `check_vip`：查詢身分證是否存在於 VIP 資料表
- `add_person_vip`：綁定現有 VIP 到 LINE PID
- `add_person_info`：新增患者基本資料並綁定
- **格式**：FormData，`Content-Type: multipart/form-data`

#### Order.vue（部分仍使用舊 GAS，待遷移）
- 初始用戶驗證：仍呼叫 Google Apps Script URL（`script.google.com/macros/s/.../exec`），`Content-Type: text/plain; charset=utf-8`
- `add_order`：線上預約提交（已使用 Heroku）
- **格式**：URLSearchParams，`Content-Type: application/x-www-form-urlencoded`

### User Registration Flow (Survey Component)

The [Survey.vue](src/components/Survey.vue) component implements a multi-step state machine:

1. **Initial Check** (`idPending` → `checkUserIDisExistFunc`)
   - Checks if LINE user ID already exists
   - If exists → show "device already configured" message with bound personal ID
   - If not exists → proceed to step 2

2. **Personal ID Input** (`showCheckUserIDisNotExist`)
   - User enters their personal ID (Taiwan ID format: 1 uppercase letter + 9 digits)
   - Validates format with pattern: `[A-Za-z][0-9]{9}`

3. **VIP Check** (`checkVIPisExist`)
   - Verifies if personal ID exists in VIP database
   - If exists → show name for confirmation (`checkUserVIPisExist`)
   - If not exists → proceed to new user registration

4. **User Action Branch**:
   - **Existing VIP** → `addPersonVIP()`: Binds VIP to LINE user ID
   - **New User** → `addPersonID` form: Collect name and phone, then call `addPersonIDFunc()`

5. **Completion** (`finishAddPersonID` or `finishAddVIPPersonID`)
   - Shows confirmation and link to appointment form

### Appointment Booking Flow (Order Component)

The [Order.vue](src/components/Order.vue) component implements appointment booking:

1. **User Verification** (`checkUserIDisExistFunc`)
   - Checks if LINE user ID is registered
   - If not registered → redirect to home for registration
   - If registered → show appointment form

2. **Appointment Form** (`showCheckUserIDisExist`)
   - **Required fields**: Name, phone, department, order date
   - **Optional fields**: Issue/notes, doctor preference, additional notes
   - Department selection from predefined list (32 departments)
   - Implements 2-second debounce to prevent duplicate submissions

3. **Form Submission** (`addOrderFunc`)
   - Validates required fields
   - Sends data to Heroku backend via URLSearchParams
   - Shows loading state during submission (`isSending`)

4. **Completion** (`finishOrder`)
   - Shows confirmation and close button

## Important Implementation Details

### LIFF Initialization Pattern

Both views follow this pattern:
```javascript
onMounted(async () => {
  liff.init({ liffId: "..." })
    .then(() => {
      if(liff.isLoggedIn()){
        isLogin.value = liff.isLoggedIn();
        userdataUID.value = liff.getDecodedIDToken().sub;
        userdataEmail.value = liff.getDecodedIDToken().email;
      }
    })
    .catch((err) => {
      console.log(err.code, err.message);
    });
})
```

### API Request Patterns

**For Google Apps Script** (Survey component):
```javascript
const formData = new FormData();
formData.append('method', 'methodName');
formData.append('userid', user.userid);
// ... other fields

axios({
  method: 'post',
  url: 'https://script.google.com/...',
  data: formData,
  headers: { 'Content-Type': 'multipart/form-data' }
  // OR 'Content-Type': 'text/plain; charset=utf-8'
})
```

**For Heroku Backend** (Order component):
```javascript
const params = new URLSearchParams();
params.append('method', 'addOrder');
params.append('userid', user.userid);
// ... other fields

axios({
  method: 'post',
  url: 'https://fju-line-app.herokuapp.com/infolinebot/add_order',
  data: params,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})
```

### State Management Pattern

Components use Vue 3 ref() for reactive state with boolean flags for UI flow control:
- `idPending`: Shows loading state
- `showCheckUserIDisExist`: Shows main content for registered users
- `showCheckUserIDisNotExist`: Shows registration prompt
- `checkUserVIPisExist`: Shows VIP confirmation
- `addPersonID`: Shows new user registration form
- `finishAddPersonID`: Shows completion message

### Component Communication

- Parent views pass `userid` prop to child components
- Child components emit `close-window` event to trigger `liff.closeWindow()`
- Uses Vue Router for navigation between registration and booking flows

## OrderV2 Route（開發中）

`/orderv2` 路由對應 `OrderV2.vue`（497 行），新增家屬預約功能（按鈕目前禁用，功能未完成）。

## 部署

自動部署：push 到 `main` 分支後，GitHub Actions（`.github/workflows/gh-pages-deploy.yml`）執行 `npm run build` 並將 `dist/` 推送到 `gh-pages` 分支。Vite 使用相對路徑 `base: './'` 以支援 GitHub Pages 子路徑部署。

## 技術債

- `Order.vue` 的用戶驗證仍呼叫舊 Google Apps Script URL（`script.google.com/macros/s/...`），應遷移至 Django 後端 `/check_user_registered`（Survey.vue 已完成遷移可參考）
- API URL 硬編碼在各元件中，無 `.env` 設定機制

## Development Notes

- The VConsole debugger is available but commented out in [OrderView.vue:5-7](src/views/OrderView.vue#L5-7)
- Vite config uses relative base path (`./`) for deployment flexibility
- Path alias `@` maps to `src/` directory
- Tailwind scans all `.html`, `.js`, and `.vue` files in `src/`
- Personal ID validation enforces uppercase letters (pattern enforcement in form input)

## Department Codes

The Order component includes 32 medical departments with standardized codes (e.g., "ANES/麻醉疼痛科", "CV/心臟內科"). The full list is defined in [Order.vue:85-117](src/components/Order.vue#L85-117).
