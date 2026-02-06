// Trong js/home.js hoặc một file js quản lý trang
import { loadNavbar } from "./components.js";

loadNavbar(); // Gọi hàm này ngay khi trang tải
// Sau đó mới gọi logic check Auth của Firebase để cập nhật menu
