import { BASE_URL } from "../utils/apiConfig";

/**
 * Đăng nhập với email + mật khẩu
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let errorMsg = "Đăng nhập thất bại";
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch (e) {
      errorMsg = `Lỗi hệ thống (${res.status})`;
    }
    throw new Error(errorMsg);
  }

  const data = await res.json();

  // ✅ FIX: Lưu cả token và thông tin user để đồng bộ giao diện bạn nhé
  if (data.token) {
    localStorage.setItem("access_token", data.token);
  }
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
}

/**
 * Đăng ký tài khoản mới
 */
export async function register(fullname, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullname, email, password }),
  });

  if (!res.ok) {
    let errorMsg = "Đăng ký thất bại";
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch (e) {
      errorMsg = `Lỗi hệ thống (${res.status})`;
    }
    throw new Error(errorMsg);
  }

  const data = await res.json();

  return data;
}

/**
 * FIX: Gửi ảnh đại diện mới lên máy chủ để lưu vĩnh viễn bạn nhé
 * Đã khớp với Backend MongoDB 100% rồi bạn ơi!
 */
export async function updateAvatar(email, avatar) {
  const res = await fetch(`${BASE_URL}/auth/update-avatar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, avatar }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Cập nhật ảnh đại diện thất bại");

  return data;
}

/**
 * Đăng xuất - xóa sạch dấu vết bạn nhé
 */
export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user"); // Xóa luôn thông tin user khi thoát
}

export function getToken() {
  return localStorage.getItem("access_token");
}

export function isAuthenticated() {
  return !!getToken();
}

/**
 * Lấy thông tin user hiện tại (bạn nhớ check Backend xem có route /me chưa nhé)
 */
export async function getCurrentUser() {
  const token = getToken();
  if (!token) throw new Error("Chưa đăng nhập");

  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không thể lấy thông tin người dùng");

  return data;
}