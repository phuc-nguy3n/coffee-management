# BUỔI 3: FIREBASE VÀ THIẾT LẬP MÁY CHỦ

## 1. Firebase là gì và Công dụng của nó?

Firebase là một nền tảng phát triển ứng dụng di động và web của Google.  
Hãy tưởng tượng Firebase giống như một **"hệ thống máy chủ có sẵn"**, giúp bạn làm những việc phức tạp mà không cần phải giỏi lập trình Backend (máy chủ).

### Công dụng chính:

- **Realtime Database / Firestore**: Lưu trữ và đồng bộ dữ liệu giữa các người dùng ngay lập tức (ví dụ: tin nhắn chat).
- **Authentication**: Quản lý đăng ký/đăng nhập (Email, Google, Facebook...).
- **Hosting**: Đưa trang web của bạn lên internet miễn phí.
- **Storage**: Lưu trữ hình ảnh, video của người dùng.

---

## 2. Thiết lập Firebase (Tạo dự án)

Trước khi viết code, chúng ta cần tạo một "ngôi nhà" cho dự án trên trình duyệt:

1. Truy cập vào **[Firebase Console](https://console.firebase.google.com/)**.
2. Đăng nhập bằng tài khoản Google của bạn.
3. Nhấn **Add Project (Thêm dự án)**.
4. Đặt tên dự án (ví dụ: `MyFirstWebProject`) và nhấn **Continue**.
5. Ở bước **Google Analytics**, bạn có thể tắt đi cho đơn giản, sau đó nhấn **Create Project**.
6. Đợi một lát rồi nhấn **Continue** để vào giao diện quản lý.

---

## 3. Cách kết nối Firebase vào Website (Sử dụng thẻ `<script>`)

Để trang web "nói chuyện" được với Firebase, chúng ta cần lấy mã cấu hình và nhúng vào HTML.

### Bước A: Đăng ký Web App trên Firebase

1. Tại màn hình chính của dự án, nhấp vào biểu tượng **Web `</>`**.
2. Đặt tên biệt danh cho App (ví dụ: `WebApp1`) và nhấn **Register app**.
3. Firebase sẽ hiện ra một đoạn mã.  
   → Hãy chọn tùy chọn **"Use a `<script>` tag"**.

### Bước B: Triển khai vào mã nguồn (Thực hành)

Tạo file `index.html` và `firebase-config.js` chú ý phần mã trong thẻ:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Coffee management</title>
  </head>
  <body>
    <h1>Chào mừng bạn đến với Website kết nối Firebase!</h1>

  </body>
</html>
```

```javascript
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
        // 3. Thử ghi dữ liệu vào collection "users"
        const docRef = await addDoc(collection(db, "users"), {
          name: "Test User",
          email: "test@example.com",
          createdAt: serverTimestamp(),
        });

        // 4. Nếu tới được đây => Kết nối OK + Ghi DB OK
        console.log("Tạo user thành công, ID:", docRef.id);
      } catch (error) {
        // 5. Nếu config sai / không kết nối được / bị chặn quyền
       console.error("❌ Lỗi Firebase:", error);
       console.log("❌ Kết nối Firebase thất bại! Vui lòng kiểm tra lại cấu hình.");
    }
```

---

## 4. Hướng dẫn triển khai

1. Sao chép mã vào file index.html và firebase-config.js.
2. Thay firebaseConfig bằng cấu hình từ Firebase Console của bạn.
3. Nhập đường dẫn vào thẻ script ở file index.html.

  ```html
    <body>
        <h1>Chào mừng bạn đến với Website kết nối Firebase!</h1>

        <script type="module" src="./firebase-config.js"></script>
    </body>
  ```

4. Chạy bằng Live Server (VS Code).
5. Mở DevTools Console để kiểm tra log.

---

## 5. Cập nhật code

Thay thế thao tác ghi cơ sở dữ liệu (addDoc) bằng thao tác đọc (getDocs) để kiểm tra kết nối. Điều này tránh tạo ra dữ liệu không cần thiết trên mỗi tải trang.
Hãy thay đoạn mã này:

```javascript
    // 1. Khởi tạo Firebase
    const app = initializeApp(firebaseConfig);

    // 2. Khởi tạo Firestore
    const db = getFirestore(app);
    try {
        // 3. Thử ghi dữ liệu vào collection "users"
        const docRef = await addDoc(collection(db, "users"), {
          name: "Test User",
          email: "test@example.com",
          createdAt: serverTimestamp(),
        });

        // 4. Nếu tới được đây => Kết nối OK + Ghi DB OK
        console.log("Tạo user thành công, ID:", docRef.id);
      } catch (error) {
        // 5. Nếu config sai / không kết nối được / bị chặn quyền
       console.error("❌ Lỗi Firebase:", error);
       console.log("❌ Kết nối Firebase thất bại! Vui lòng kiểm tra lại cấu hình.");
    }
```

Thành: 

 ```javascript
    // 1. Khởi tạo Firebase
    const app = initializeApp(firebaseConfig);

    // 2. Khởi tạo Firestore
    const db = getFirestore(app); 

    try {
        // 3. Thử đọc dữ liệu từ collection "users"
        const querySnapshot = await getDocs(collection(db, "users"));

        // 4. Nếu tới được đây => Kết nối OK + Đọc DB OK
        console.log(
            `✅ Kết nối Firebase thành công! Collection "users" hiện có ${querySnapshot.size} tài liệu.`);
    } catch (error) {
        // 5. Nếu config sai / không kết nối được / bị chặn quyền
        console.error("❌ Lỗi Firebase:", error);
        console.log("❌ Kết nối Firebase thất bại! Vui lòng kiểm tra lại cấu hình.");
    }
 ```