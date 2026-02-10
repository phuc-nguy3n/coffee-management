// js/services.js
import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  getDoc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ================= CẤU HÌNH COLLECTIONS =================
const productCol = collection(db, "products");
const orderCol = collection(db, "orders");
const userCol = collection(db, "users");

// ================= DỊCH VỤ SẢN PHẨM =================

export const subscribeProducts = (callback) => {
  const q = query(productCol, orderBy("createdAt", "desc"));
  return onSnapshot(q, callback);
};

export const addProduct = (data) => {
  return addDoc(productCol, { ...data, createdAt: serverTimestamp() });
};

export const updateProduct = (id, data) => {
  return updateDoc(doc(db, "products", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProductById = (id) => {
  return deleteDoc(doc(db, "products", id));
};

// ================= DỊCH VỤ ĐƠN HÀNG =================

export const subscribeOrders = (callback) => {
  const q = query(orderCol, orderBy("createdAt", "desc"));
  return onSnapshot(q, callback);
};

export const getOrderById = (id) => {
  return getDoc(doc(db, "orders", id));
};

export const createOrder = (orderData) => {
  return addDoc(orderCol, {
    ...orderData,
    status: "Đang chờ",
    createdAt: serverTimestamp(),
  });
};

export const updateOrderStatus = (id, status) => {
  return updateDoc(doc(db, "orders", id), {
    status: status,
    updatedAt: serverTimestamp(),
  });
};

// ================= DỊCH VỤ NGƯỜI DÙNG =================

export const subscribeCustomers = (callback) => {
  return onSnapshot(userCol, callback);
};

export const getUserRole = async (uid) => {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.exists() ? userDoc.data().role : null;
};

//  ================= DỊCH VỤ TẢI FILE NÀY MÁY TÍNH LÊN MÁY CHỦ =================
export const uploadImageToServer = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Upload thất bại");

    const result = await response.json();
    return result.url; // Đây là link ảnh từ Cloudinary
  } catch (error) {
    console.error("Lỗi upload:", error);
    alert("Không thể tải ảnh lên server!");
    return null;
  }
};
