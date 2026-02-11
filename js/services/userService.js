// User Service Module
import { db } from "../config/firebase-config.js";
import {
  collection,
  onSnapshot,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { COLLECTIONS } from "../config/constants.js";

// ================= CẤU HÌNH COLLECTIONS =================
const userCol = collection(db, COLLECTIONS.users);

// ================= DỊCH VỤ NGƯỜI DÙNG =================

export const subscribeCustomers = (callback) => {
  return onSnapshot(userCol, callback);
};

export const getUserRole = async (uid) => {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.exists() ? userDoc.data().role : null;
};
