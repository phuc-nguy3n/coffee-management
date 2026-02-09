// Hàm lưu trang hiện tại vào localStorage
export function saveCurrentPage() {
  const path = window.location.pathname;
  // Chỉ lưu nếu KHÔNG PHẢI là trang login hoặc register
  if (!path.includes("login.html") && !path.includes("register.html")) {
    localStorage.setItem("lastVisitedPage", window.location.href);
  }
}
