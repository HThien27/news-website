import { createContext, useState, useEffect, useContext } from "react";

const SavedArticlesContext = createContext();

export const useSavedArticles = () => useContext(SavedArticlesContext);

export const SavedArticlesProvider = ({ children }) => {
  // 1. Khởi tạo mảng rỗng, không lấy từ localStorage để tránh lẫn lộn User Duy nhé
  const [savedArticleIds, setSavedArticleIds] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email;

  const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL || "http://localhost:5000";
    if (url.endsWith("/")) url = url.slice(0, -1);
    if (!url.endsWith("/api")) url += "/api";
    return url;
  };
  const BASE_URL = getBaseURL();

  // ✅ HÀM MỚI: Lấy danh sách ID đã lưu từ PostgreSQL về để hiển thị icon đỏ Duy nhé
  const fetchSavedIds = async () => {
    if (!userEmail) {
      setSavedArticleIds([]); // Nếu không có user thì xóa sạch ID hiển thị
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/articles/saved/${userEmail}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setSavedArticleIds(data.map(art => String(art.id)));
        } else {
          setSavedArticleIds([]);
        }
      } else {
        console.error(`❌ Server trả về lỗi ${res.status} khi lấy bài đã lưu`);
      }
    } catch (error) {
      console.error("❌ Lỗi mạng khi đồng bộ bài đã lưu:", error);
    }
  };

  // ✅ Tự động gọi đồng bộ khi Duy đổi tài khoản hoặc F5 trang web
  useEffect(() => {
    fetchSavedIds();
  }, [userEmail]);

  // 3. HÀM LƯU BÀI VÀO DATABASE
  const addSavedArticleId = async (article) => {
    const stringId = String(article.id);
    
    if (!savedArticleIds.includes(stringId)) {
      // Optimistic UI: Cập nhật giao diện trước cho Duy thấy mượt nhé
      setSavedArticleIds((prev) => [...prev, stringId]);

      if (userEmail) {
        try {
          await fetch(`${BASE_URL}/articles/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ article, userEmail }),
          });
        } catch (error) {
          console.error("❌ Lỗi gọi API lưu bài:", error);
          // Nếu lỗi thì xóa ID vừa thêm để giao diện khớp với DB Duy nhé
          setSavedArticleIds((prev) => prev.filter(id => id !== stringId));
        }
      }
    }
  };

  // 4. HÀM GỠ BÀI KHỎI DATABASE
  const removeSavedArticleId = async (id) => {
    const stringId = String(id);
    setSavedArticleIds((prev) => prev.filter((item) => item !== stringId));

    if (userEmail) {
      try {
        await fetch(`${BASE_URL}/articles/save/${stringId}/${userEmail}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("❌ Lỗi gọi API xóa bài:", error);
        // Nếu lỗi thì thêm lại ID vào giao diện Duy nhé
        setSavedArticleIds((prev) => [...prev, stringId]);
      }
    }
  };

  // ✅ HÀM MỚI: Dọn dẹp sạch sẽ khi nhấn nút "Thoát"
  const clearSavedArticles = () => {
    setSavedArticleIds([]);
    localStorage.removeItem("savedArticleIds");
  };

  return (
    <SavedArticlesContext.Provider value={{ 
      savedArticleIds, 
      addSavedArticleId, 
      removeSavedArticleId,
      clearSavedArticles // Truyền cái này sang Navbar để dùng Duy nhé
    }}>
      {children}
    </SavedArticlesContext.Provider>
  );
};