// Import đối tượng auth từ file cấu hình Firebase của bạn.
import { auth } from "./firebase-config.js";

// Import hàm từ Firebase Auth SDK.
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ================= TỰ ĐỘNG QUẢN LÝ NAVBAR =================

/**
 * Hàm cập nhật giao diện Navbar dựa trên trạng thái người dùng
 * @param {Object|null} user - Đối tượng người dùng từ Firebase
 */
const updateNavbarUI = (user) => {
  const userDropdown = document.getElementById("userDropdown");
  const dropdownMenu = document.querySelector("#userDropdown + .dropdown-menu");

  if (!userDropdown || !dropdownMenu) return; // Nếu trang không có Navbar thì bỏ qua

  if (user) {
    // Trường hợp: Đã đăng nhập
    userDropdown.innerHTML = `<i class="fa-regular fa-user me-1"></i> ${user.displayName || "Thành viên"}`;

    dropdownMenu.innerHTML = `
      <li><a class="dropdown-item text-white" href="#"><i class="fa-solid fa-circle-user me-2"></i>Tài khoản</a></li>
      <li><a class="dropdown-item text-white" href="#"><i class="fa-solid fa-clock-rotate-left me-2"></i>Lịch sử đơn</a></li>
      <li><hr class="dropdown-divider bg-secondary"></li>
      <li><a class="dropdown-item text-white" href="#" id="logoutBtn"><i class="fa-solid fa-right-from-bracket me-2"></i>Đăng xuất</a></li>
    `;

    // Gắn sự kiện đăng xuất
    document
      .getElementById("logoutBtn")
      .addEventListener("click", handleLogout);
  } else {
    // Trường hợp: Chưa đăng nhập
    userDropdown.innerHTML = `<i class="fa-regular fa-user"></i>`;
    dropdownMenu.innerHTML = `
      <li><a class="dropdown-item text-white" href="login.html">Đăng nhập</a></li>
      <li><a class="dropdown-item text-white" href="register.html">Đăng ký</a></li>
    `;
  }
};

// ================= ĐĂNH XUẤT =================
const handleLogout = async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
    alert("Đã đăng xuất!");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
  }
};

// Lắng nghe trạng thái đăng nhập của Firebase trên toàn hệ thống
onAuthStateChanged(auth, (user) => {
  updateNavbarUI(user);
});

// ================= ĐĂNG KÝ TAI KHOẢN MỚI =================

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

// ================= ĐĂNG NHẬP (EMAIL/PASSWORD) =================

// Lấy thẻ <form> có id="loginForm" trong HTML và gán vào biến loginForm.
const loginForm = document.getElementById("loginForm");

// Kiểm tra form có tồn tại không
if (loginForm) {
  // Bắt sự kiện submit của form
  // Lắng nghe sự kiện khi người dùng bấm nút Đăng nhập (submit form).
  // Dùng async để có thể dùng await với Firebase API.
  loginForm.addEventListener("submit", async (e) => {
    // Ngăn hành vi mặc định của form (reload trang khi submit).
    e.preventDefault();

    // Lấy dữ liệu người dùng nhập
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Bọc trong try...catch để xử lý lỗi nếu đăng nhập thất bại.
    try {
      // Gọi Firebase Authentication để đăng nhập:
      // - auth: đối tượng xác thực Firebase
      // - email: email người dùng nhập
      // - password: mật khẩu người dùng nhập
      // Nếu thành công, Firebase trả về userCredential (chứa thông tin user đăng nhập)

      await signInWithEmailAndPassword(auth, email, password);

      //   Hiện thông báo cho người dùng biết đăng nhập thành công.
      alert("Đăng nhập thành công!");

      //   Chuyển sang trang chủ index.html.
      window.location.replace("./index.html");
    } catch (error) {
      // Hiện thông báo lỗi cho người dùng.
      alert("Email hoặc mật khẩu không chính xác!");
    }
  });
}
