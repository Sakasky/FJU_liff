// API 基底：本地/測試環境以 VITE_API_BASE 覆寫（.env 系列檔案），未設定時打生產後端
export const API_BASE = import.meta.env.VITE_API_BASE || 'https://fju-line-app.herokuapp.com';
