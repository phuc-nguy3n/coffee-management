// Order Service Module
import { db } from "../config/firebase-config.js";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  getDoc,
  query,
  orderBy,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { COLLECTIONS, DEFAULT_VALUES } from "../config/constants.js";

// ================= CẤU HÌNH COLLECTIONS =================
const orderCol = collection(db, COLLECTIONS.orders);

// ================= DỊCH VỤ ĐƠN HÀNG =================

export const subscribeOrders = (callback) => {
  const q = query(orderCol, orderBy("createdAt", "desc"));
  return onSnapshot(q, callback);
};

export const subscribeOrdersByUser = (uid, callback) => {
  if (!uid) return () => {};
  const q = query(orderCol, where("userId", "==", uid));
  return onSnapshot(q, callback);
};

export const getOrderById = (id) => {
  return getDoc(doc(db, "orders", id));
};

export const createOrder = (orderData) => {
  return addDoc(orderCol, {
    ...orderData,
    status: DEFAULT_VALUES.orderStatus,
    createdAt: serverTimestamp(),
  });
};

export const updateOrderStatus = (id, status) => {
  return updateDoc(doc(db, "orders", id), {
    status: status,
    updatedAt: serverTimestamp(),
  });
};
