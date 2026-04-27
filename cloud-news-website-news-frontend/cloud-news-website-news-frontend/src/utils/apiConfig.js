// src/utils/apiConfig.js

/**
 * Hàm chuẩn hóa link API từ biến môi trường
 * Giúp tự động thêm /api và xử lý dấu gạch chéo thừa
 */
export const getBaseURL = () => {
  // Nếu đang chạy trên môi trường thật (Azure), giao diện và backend chung 1 nhà
  // nên chỉ cần gọi /api là trình duyệt tự hiểu
  if (import.meta.env.PROD) {
    return '/api';
  }

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
