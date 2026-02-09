// Import đối tượng auth từ file cấu hình Firebase của bạn.
import { auth, db } from "./firebase-config.js";

// Import hàm từ Firebase Auth SDK.
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Import các hàm Firestore cần thiết
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { saveCurrentPage } from "./utils.js";

// Chạy hàm này ngay khi trang tải
saveCurrentPage();

// Thêm một biến kiểm soát ở đầu file auth.js
let isRegistering = false;

// ================ LẮNG NGHE TRẠNG THÁI ĐĂNG NHẬP CỦA FIREBASE TRÊN TOÀN HỆ THỐNG =================
onAuthStateChanged(auth, (user) => {
  // Cập nhật UI Navbar (hàm bạn đã viết)
  updateNavbarUI(user);

  // Logic điều hướng tức thì
  const currentPage = window.location.pathname;
  const isAuthPage =
    currentPage.includes("login.html") || currentPage.includes("register.html");

  if (user && isAuthPage && !isRegistering) {
    // Lấy đường dẫn đã lưu từ localStorage
    const lastPage = localStorage.getItem("lastVisitedPage");

    let redirectUrl = "index.html";
    if (lastPage) {
      try {
        const parsed = new URL(lastPage, window.location.origin);
        // Chỉ cho phép redirect nội bộ cùng origin
        if (parsed.origin === window.location.origin) {
          redirectUrl = parsed.href;
        }
      } catch (error) {
        // ignore invalid URL and keep fallback
        console.error("Invalid URL in lastVisitedPage:", error);
      }
    }

    console.log("Đã đăng nhập, đẩy về:", redirectUrl);

    window.location.replace(redirectUrl);
  }
});

// ================= TỰ ĐỘNG QUẢN LÝ NAVBAR =================

/**
 * Hàm cập nhật giao diện Navbar dựa trên trạng thái người dùng
 * @param {Object|null} user - Đối tượng người dùng từ Firebase
 */
const updateNavbarUI = async (user) => {
  const userDropdown = document.getElementById("userDropdown");
  const dropdownMenu = document.querySelector("#userDropdown + .dropdown-menu");
  const adminFeatureContainer = document.getElementById("admin-feature");

  // Xóa nội dung cũ của vùng admin mỗi khi trạng thái thay đổi
  if (adminFeatureContainer) adminFeatureContainer.innerHTML = "";

  if (user) {
    // 1. Lấy dữ liệu Role từ Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();

      // 2. Kiểm tra Role và thêm nút Dashboard bằng DOM
      if (userData.role === "admin" && adminFeatureContainer) {
        adminFeatureContainer.innerHTML = `
                    <a class="nav-link text-warning" href="../admin/dashboard.html">
                        <i class="fa-solid fa-gauge"></i> Dashboard
                    </a>`;
      }
    }

    // Cập nhật tên hiển thị
    userDropdown.innerHTML = `<i class="fa-regular fa-user me-1"></i> ${user.displayName || "Thành viên"}`;

    dropdownMenu.innerHTML = `
            <li><a class="dropdown-item text-white" href="#"><i class="fa-solid fa-circle-user me-2"></i>Tài khoản</a></li>
            <li><hr class="dropdown-divider bg-secondary"></li>
            <li><a class="dropdown-item text-white" href="#" id="logoutBtn">Đăng xuất</a></li>
        `;
    document
      .getElementById("logoutBtn")
      .addEventListener("click", () => signOut(auth));
  } else {
    // Trạng thái chưa đăng nhập
    userDropdown.innerHTML = `<i class="fa-regular fa-user"></i>`;
    dropdownMenu.innerHTML = `
            <li><a class="dropdown-item text-white" href="login.html">Đăng nhập</a></li>
            <li><a class="dropdown-item text-white" href="register.html">Đăng ký</a></li>
        `;
  }
};

// ================= ĐĂNG KÝ TÀI KHOẢN MỚI =================

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

    // Bật cờ đăng ký để ngăn onAuthStateChanged chuyển hướng
    isRegistering = true;

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
      const user = userCredential.user;

      // Cập nhật tên hiển thị cho người dùng
      //   userCredential.user: user hiện tại
      //   { displayName: name }: set tên hiển thị = tên người dùng nhập
      await updateProfile(user, { displayName: name });

      // Lưu thông tin bổ sung vào Firestore
      // Chúng ta dùng UID làm Document ID để dễ dàng truy vấn sau này

      await setDoc(doc(db, "users", user.uid), {
        displayName: name,
        email: email,
        role: "customer",
        createdAt: serverTimestamp(), // Lưu thời gian theo chuẩn Firebase
        updatedAt: serverTimestamp(),
      });

      // Sau khi lưu xong mọi thứ, đăng xuất để user không bị tự động đăng nhập
      await signOut(auth);

      //   Hiện thông báo đăng ký thành công
      alert("Đăng ký thành công!");

      //   Chuyển người dùng sang trang đăng nhập login.html
      window.location.href = "login.html";
    } catch (error) {
      // Nếu có lỗi khi tạo tài khoản hoặc update profile thì nhảy vào đây
      // Hiện thông báo lỗi từ Firebase (ví dụ: email đã tồn tại, mật khẩu quá yếu, v.v.)
      alert("Lỗi: " + error.message);
    } finally {
      // Luôn tắt cờ ở cuối quá trình
      isRegistering = false;
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
      alert("Lỗi: " + error.message);
    }
  });
}

// ================= ĐĂNH XUẤT =================
const handleLogout = async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
    // Chuyển hướng ngay lập tức sau khi đăng xuất thành công.
    window.location.replace("index.html");
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
    alert("Đăng xuất thất bại. Vui lòng thử lại.");
  }
};
