// src/utils/apiConfig.js

/**
 * Hàm chuẩn hóa link API từ biến môi trường
 * Giúp tự động thêm /api và xử lý dấu gạch chéo thừa
 */
export const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  // Xóa dấu / ở cuối nếu có
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  
  // Tự động thêm /api nếu chưa có
  if (!url.endsWith("/api")) {
    url += "/api";
  }
  
  return url;
};

export const BASE_URL = getBaseURL();
