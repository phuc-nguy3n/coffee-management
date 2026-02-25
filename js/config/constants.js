// App Constants
export const APP_CONFIG = {
  name: "Cafe",
  logoUrl: "https://cdn-icons-png.flaticon.com/512/924/924514.png",
  logoWidth: 40,
  homePage: "index.html",
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Navigation Paths
export const NAVIGATION_PATHS = {
  home: "index.html",
  login: "login.html",
  register: "register.html",
  adminDashboard: "../admin/dashboard.html",
  cart: "cart.html",
  checkout: "checkout.html",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  lastVisitedPage: "lastVisitedPage",
};

// Default Values
export const DEFAULT_VALUES = {
  userRole: "customer",
  orderStatus: "Đang chờ",
};

// Order Statuses
export const ORDER_STATUS = {
  pending: "Đang chờ",
  confirmed: "Đã xác nhận",
  completed: "Hoàn thành",
  canceled: "Đã hủy",
};

// UI Texts
export const UI_TEXTS = {
  loading: "Đang xử lý...",
  navbarHome: "Trang chủ",
  navbarMenu: "Menu",
  navbarLogin: "Đăng nhập",
  navbarRegister: "Đăng ký",
  navbarAccount: "Tài khoản",
  navbarLogout: "Đăng xuất",
  navbarMember: "Thành viên",
  navbarCart: "Giỏ hàng",
  adminDashboard: "Dashboard",
  orderWalkInCustomer: "Khách tại quầy",
  orderDetail: "Chi tiết",
  orderModalCreateTitle: "Tạo Đơn Hàng Mới",
  orderModalCreateSubmit: "Xác nhận tạo đơn",
  orderModalDetailTitle: "Chi tiết hóa đơn",
  orderModalUpdateSubmit: "Cập nhật trạng thái",
  orderItemsHeader: "Món đã đặt",
  orderItemsQtyHeader: "Số lượng",
  noData: "Không có dữ liệu",
  productModalCreateTitle: "Thêm Sản Phẩm Mới",
  productModalEditTitle: "Chỉnh sửa sản phẩm",
};

// Messages
export const MESSAGES = {
  accessDenied: "Bạn không có quyền truy cập!",
  passwordMismatch: "Mật khẩu xác nhận không khớp!",
  errorPrefix: "Lỗi: ",
  loginRequired: "Vui lòng đăng nhập để thêm món vào giỏ hàng.",
  productDeleteErrorPrefix: "Lỗi khi xóa: ",
  registerSuccess: "Đăng ký thành công!",
  loginSuccess: "Đăng nhập thành công!",
  orderStatusUpdated: "Cập nhật trạng thái thành công!",
  orderSelectItem: "Vui lòng chọn món!",
  orderQuantityRequired: "Vui lòng nhập số lượng cho món",
  orderCreated: "Tạo đơn hàng thành công!",
  productUpdated: "Cập nhật thành công!",
  productAdded: "Thêm món mới thành công!",
  confirmDeleteProduct: "Bạn có chắc muốn xóa món này?",
  selectProductImage: "Vui lòng chọn ảnh sản phẩm!",
  invalidImageType:
    "Định dạng ảnh không hợp lệ. Vui lòng chọn ảnh JPG, PNG hoặc WEBP.",
  imageTooLarge: "Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.",
  imagePreviewError: "Không thể hiển thị ảnh đã chọn. Vui lòng thử lại.",
  uploadFailed: "Upload thất bại",
  invalidImageUrl: "Server không trả về URL ảnh hợp lệ.",
  uploadError: "Không thể tải ảnh lên server!",
  uploadImageFailed: "Không thể tải ảnh lên server. Vui lòng thử lại.",
};

// API Endpoints
export const API_ENDPOINTS = {
  uploadImage: "http://localhost:5000/api/upload",
};

// Collection Names
export const COLLECTIONS = {
  products: "products",
  orders: "orders",
  users: "users",
  carts: "carts",
};
