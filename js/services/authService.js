import { auth } from '../config/firebase.js';
import { createUserProfile } from './userService.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

/**
 * Đăng ký người dùng mới bằng email và mật khẩu.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Sau khi đăng ký thành công, tạo hồ sơ người dùng trong Firestore
    await createUserProfile(userCredential.user, { role: 'user' });
    return userCredential;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error; // Ném lỗi ra để UI có thể xử lý
  }
};

/**
 * Đăng nhập người dùng bằng email và mật khẩu.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Đăng xuất người dùng hiện tại.
 * @returns {Promise<void>}
 */
export const logoutUser = () => {
  return signOut(auth);
};

/**
 * Lắng nghe sự thay đổi trạng thái xác thực.
 * @param {function} callback - Hàm sẽ được gọi khi trạng thái thay đổi,
 *                              nhận vào đối tượng user hoặc null.
 * @returns {import("firebase/auth").Unsubscribe}
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};