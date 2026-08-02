// API 基底：本地/測試環境以 VITE_API_BASE 覆寫（.env 系列檔案），未設定時打生產後端
export const API_BASE = import.meta.env.VITE_API_BASE || 'https://fju-line-app.herokuapp.com';

// liff.init 失敗時的畫面診斷文字（取代白畫面；含實際使用的 liffId 便於排錯）
export const liffErrorText = (err, liffId) =>
  `LIFF 初始化失敗，請截圖回報診所\n` +
  `錯誤：${err?.code || ''} ${err?.message || err}\n` +
  `liffId：${liffId}\n` +
  `URL：${location.href}`;

// LIFF ID：測試環境以 VITE_LIFF_ID_* 覆寫，未設定時為生產 LIFF
export const LIFF_IDS = {
  survey: import.meta.env.VITE_LIFF_ID_SURVEY || '1657869644-jDxqpoMV',
  order: import.meta.env.VITE_LIFF_ID_ORDER || '1657869644-x3BZd5wE',
  orderV2: import.meta.env.VITE_LIFF_ID_ORDER_V2 || '1657869644-z0PLNaQD',
};
