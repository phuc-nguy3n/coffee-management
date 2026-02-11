// App Constants
export const APP_CONFIG = {
  name: "Cafe",
  logoUrl: "https://cdn-icons-png.flaticon.com/512/924/924514.png",
  logoWidth: 40,
  homePage: "index.html",
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDdjiuYsxXA-TPYEajWcKECoaG3g569B-c",
  authDomain: "coffee-management-ff2a2.firebaseapp.com",
  projectId: "coffee-management-ff2a2",
  storageBucket: "coffee-management-ff2a2.firebasestorage.app",
  messagingSenderId: "255370865286",
  appId: "1:255370865286:web:93538bb6f6f50eae5b3f07",
  measurementId: "G-4TTPLYX0EL",
};

// Navigation Paths
export const NAVIGATION_PATHS = {
  home: "index.html",
  login: "login.html",
  register: "register.html",
  adminDashboard: "../admin/dashboard.html",
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

// Messages
export const MESSAGES = {
  registerSuccess: "Đăng ký thành công!",
  loginSuccess: "Đăng nhập thành công!",
  uploadFailed: "Upload thất bại",
  invalidImageUrl: "Server không trả về URL ảnh hợp lệ.",
  uploadError: "Không thể tải ảnh lên server!",
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
};
