// Product Service Module
import { db } from "../firebase-config.js";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { COLLECTIONS } from "../config/constants.js";

// ================= CẤU HÌNH COLLECTIONS =================
const productCol = collection(db, COLLECTIONS.products);

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
