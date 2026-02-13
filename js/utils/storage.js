import { NAVIGATION_PATHS, STORAGE_KEYS } from "../config/constants.js";

// Hàm lưu trang hiện tại vào localStorage
export function saveCurrentPage() {
  const path = window.location.pathname;
  // Chỉ lưu nếu KHÔNG PHẢI là trang login hoặc register
  if (
    !path.includes(NAVIGATION_PATHS.login) &&
    !path.includes(NAVIGATION_PATHS.register)
  ) {
    localStorage.setItem(STORAGE_KEYS.lastVisitedPage, window.location.href);
  }
}
