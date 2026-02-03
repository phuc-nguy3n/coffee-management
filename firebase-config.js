// Import các hàm cần thiết từ Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getDocs,
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Cấu hình Firebase của riêng bạn (Lấy từ Firebase Console)
// Lưu ý: Hãy thay thế các giá trị bên dưới bằng mã bạn copy được từ Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// 1. Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// 2. Khởi tạo Firestore
const db = getFirestore(app);

try {
  // 3. Thử đọc dữ liệu từ collection "users"
  const querySnapshot = await getDocs(collection(db, "users"));

  // 4. Nếu tới được đây => Kết nối OK + Đọc DB OK
  console.log(
    `✅ Kết nối Firebase thành công! Collection "users" hiện có ${querySnapshot.size} tài liệu.`,
  );
} catch (error) {
  // 5. Nếu config sai / không kết nối được / bị chặn quyền
  console.error("❌ Lỗi Firebase:", error);
  console.log("❌ Kết nối Firebase thất bại! Vui lòng kiểm tra lại cấu hình.");
}
