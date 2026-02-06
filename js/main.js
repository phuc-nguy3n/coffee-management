// Trong js/home.js hoặc một file js quản lý trang
import { loadNavbar } from "./components.js";

// Hàm lưu trang hiện tại vào localStorage
function saveCurrentPage() {
  const path = window.location.pathname;
  // Chỉ lưu nếu KHÔNG PHẢI là trang login hoặc register
  if (!path.includes("login.html") && !path.includes("register.html")) {
    localStorage.setItem("lastVisitedPage", window.location.href);
  }
}

// Chạy hàm này ngay khi trang tải
saveCurrentPage();

// Sau đó mới gọi logic check Auth của Firebase để cập nhật menu
loadNavbar();
