// File js quản lý chung, như load navbar, lưu trang hiện tại, v.v.
import { loadNavbar } from "./components.js";
import { saveCurrentPage } from "./utils/storage.js";

// Hàm lưu trang hiện tại vào localStorage
saveCurrentPage();

// Sau đó mới gọi logic check Auth của Firebase để cập nhật menu
loadNavbar();
