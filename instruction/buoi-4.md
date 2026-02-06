# BÀI 4: FIREBASE VÀ XÁC THỰC NGƯỜI DÙNG

## 1. Firebase Authentication

Là một dịch vụ do Google cung cấp, hỗ trợ các nhà phát triển trong việc quản lý người dùng một cách dễ dàng và bảo mật.

### Công dụng chính:

- Firebase Auth giúp giải quyết các yêu cầu xác thực người dùng (login/signup).
- Biết tới các phương thức đăng nhập khác nhau gồm: Email/Password, Google, Facebook, GitHub, và sđt.

---

## 2. Cấu hình Authentication

1. Truy cập vào **[Firebase Console](https://console.firebase.google.com/)** và chọn dự án đã tạo trước đó.
2. Từ giao diện chính của Firebase console, chọn mục Build -> Authentication từ bảng điều kiển bên trái
3. Tại trang Authentication, nhấn nút **Get Started** để bắt đầu cài đặt tính năng này.
4. Trình bày về các phương thức xác thực mà Firebase hỗ trợ, như Email/Password, Google, Facebook, và các nhà cung cấp khác.
5. Mở tính năng Authentication: 

Email/Password bằng các thao tác sau:
    - Trong tab **Sign-in method**, chọn phương thức **Email/Password**.
    - Nhấn vào biểu tượng bút chì (hoặc "Edit") để bật phương thức Email/Password.
    - Chon **Enable** (Email/Password) và nhấn **Save** để lưu lại thay đổi.

Google Authentication bằng các thao tác sau:
    - Trong tab **Sign-in method**, chon phương thức **Google**.
    - Nhấn vào biểu tượng bút chì (hoặc "Edit") để bật phương thức Google.
    - Nhấn **Enable** và nhập thông tin OAuth Client ID nếu cần. Đối với hầu hết dự án, Firebase sẽ tự động tạo và tích hợp thông tin này.
    - Nhấn **Save** để lưu lại thiết lập.

---

## 3. Tích hợp Firebase Auth

Thêm các đoạn code này vào file `js/firebase-config.js`:

```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";  // Thêm dòng này để dùng Authentication


    const firebaseConfig = {
      apiKey: "YOUR_API_KEY_HERE",
      authDomain: "YOUR_PROJECT.firebaseapp.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
    };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app); // Dùng export để xuất biến auth để các file khác sử dụng

```

---

## 4. Xây dựng chức năng Auth

### Đăng ký

Tạo file `js/auth.js` (file này dùng để đăng nhập/đăng ký,..) và sao các đoạn mã này:


```javascript

// Import đối tượng auth từ file cấu hình Firebase của bạn.
import { auth } from "./firebase-config.js";

// Import 2 hàm từ Firebase Auth SDK.
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
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

```

Tại file `register.html` liên kết file script `auth.js`, để ở trước thẻ đóng </body>:

```javascript
    <script type="module" src="./js/auth.js"></script>
```

### Đăng nhập (Email/Password)

Tại file `js/auth.js` sao các đoạn mã này và dán ở cuối file:

```javascript
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

```

Tại file `login.html` liên kết file script `auth.js`, để ở trước thẻ đóng `</body>`:

```javascript
    <script type="module" src="./js/auth.js"></script>
```

### Đăng xuất

Tại file `js/auth.js` sao các đoạn mã này và dán ở cuối file:

```javascript
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
```

Tại file `index.html` liên kết file script `auth.js`, để ở trước thẻ đóng `</body>`: