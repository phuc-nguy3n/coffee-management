import { db } from '../config/firebase.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

/**
 * Lưu thông tin người dùng vào Firestore.
 * @param {User} user - Đối tượng user từ Firebase Authentication.
 * @param {Object} additionalData - Dữ liệu bổ sung (ví dụ: { role: 'user' }).
 */
export const createUserProfile = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, `users/${user.uid}`);

  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: new Date(),
    ...additionalData
  };

  try {
    await setDoc(userRef, userData);
    console.log('User profile created successfully!');
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error; // Ném lỗi ra để nơi gọi có thể xử lý
  }
};