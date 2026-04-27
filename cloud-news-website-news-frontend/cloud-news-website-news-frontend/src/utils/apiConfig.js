// src/utils/apiConfig.js

/**
 * Hàm chuẩn hóa link API từ biến môi trường
 */
export const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  
  if (!url.endsWith("/api")) {
    url += "/api";
  }
  
  return url;
};

export const BASE_URL = getBaseURL();
