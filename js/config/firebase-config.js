// Import các hàm cần thiết từ Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { FIREBASE_CONFIG } from "./constants.js";

// Cấu hình Firebase của riêng bạn (Lấy từ Firebase Console)
// Lưu ý: Hãy thay thế các giá trị bên dưới bằng mã bạn copy được từ Firebase
const firebaseConfig = FIREBASE_CONFIG;

// Khởi tạo ứng ụng
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
export const db = getFirestore(app);

// Khởi tạo Authentication
export const auth = getAuth(app);
