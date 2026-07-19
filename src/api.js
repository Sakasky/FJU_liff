// API 基底：本地/測試環境以 VITE_API_BASE 覆寫（.env 系列檔案），未設定時打生產後端
export const API_BASE = import.meta.env.VITE_API_BASE || 'https://fju-line-app.herokuapp.com';

// LIFF ID：測試環境以 VITE_LIFF_ID_* 覆寫，未設定時為生產 LIFF
export const LIFF_IDS = {
  survey: import.meta.env.VITE_LIFF_ID_SURVEY || '1657869644-jDxqpoMV',
  order: import.meta.env.VITE_LIFF_ID_ORDER || '1657869644-x3BZd5wE',
  orderV2: import.meta.env.VITE_LIFF_ID_ORDER_V2 || '1657869644-z0PLNaQD',
  familyBind: import.meta.env.VITE_LIFF_ID_FAMILY_BIND || '1657869644-wuZuat4c',
};
