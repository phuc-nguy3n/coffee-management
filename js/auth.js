// Import đối tượng auth từ file cấu hình Firebase của bạn.
import { auth } from "./firebase-config.js";

// Import 2 hàm từ Firebase Auth SDK để tạo tài khoản và cập nhật profile.
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Lấy thẻ <form> có id là registerForm trong HTML và gán vào biến registerForm.
const registerForm = document.getElementById("registerForm");

// Kiểm tra xem form có tồn tại không
if (registerForm) {
  // Bắt sự kiện submit của form.
  // Lắng nghe sự kiện khi người dùng bấm nút Submit form.
  // async để dùng được await khi gọi Firebase API.
  registerForm.addEventListener("submit", async (e) => {
    // Ngăn trình duyệt reload trang khi submit form
    e.preventDefault();

    // Lấy dữ liệu người dùng nhập
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPass = document.getElementById("confirmPassword").value;

    // So sánh mật khẩu và mật khẩu xác nhận
    if (password !== confirmPass) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Thử tạo tài khoản với Firebase
    // Bọc trong try...catch để bắt lỗi nếu Firebase trả về lỗi.
    try {
      // Gọi Firebase để tạo user mới bằng:
      // - auth: đối tượng xác thực Firebase
      // - email: email người dùng nhập
      // - password: mật khẩu người dùng nhập
      // Nếu thành công, Firebase trả về userCredential (chứa thông tin user vừa tạo)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Cập nhật tên hiển thị cho người dùng
      //   userCredential.user: user hiện tại
      //   { displayName: name }: set tên hiển thị = tên người dùng nhập
      await updateProfile(userCredential.user, { displayName: name });

      //   Hiện thông báo đăng ký thành công
      alert("Đăng ký thành công!");

      //   Chuyển người dùng sang trang đăng nhập login.html
      window.location.href = "login.html";
    } catch (error) {
      // Nếu có lỗi khi tạo tài khoản hoặc update profile thì nhảy vào đây
      // Hiện thông báo lỗi từ Firebase (ví dụ: email đã tồn tại, mật khẩu quá yếu, v.v.)
      alert("Lỗi: " + error.message);
    }
  });
}
