// Import các hàm cần thiết từ Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getDocs,
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Cấu hình Firebase của riêng bạn (Lấy từ Firebase Console)
// Lưu ý: Hãy thay thế các giá trị bên dưới bằng mã bạn copy được từ Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDdjiuYsxXA-TPYEajWcKECoaG3g569B-c",
  authDomain: "coffee-management-ff2a2.firebaseapp.com",
  projectId: "coffee-management-ff2a2",
  storageBucket: "coffee-management-ff2a2.firebasestorage.app",
  messagingSenderId: "255370865286",
  appId: "1:255370865286:web:93538bb6f6f50eae5b3f07",
  measurementId: "G-4TTPLYX0EL",
};

// Khởi tạo ứng ụng
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
const db = getFirestore(app);

// Khởi tạo Authentication
export const auth = getAuth(app);
