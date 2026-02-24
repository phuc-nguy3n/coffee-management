// Cart Service Module
import { db } from "../config/firebase-config.js";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { COLLECTIONS } from "../config/constants.js";

const cartCol = collection(db, COLLECTIONS.carts);

const normalizeItems = (items = []) => {
  return items.map((item) => ({
    productId: item?.id ?? item?.productId ?? null,
    name: item?.name || "Sản phẩm",
    price: item?.price ?? 0,
    imageUrl: item?.imageUrl || "",
    quantity: item?.quantity ?? 1,
  }));
};

export const subscribeCart = (uid, callback) => {
  if (!uid) return () => {};
  const cartRef = doc(cartCol, uid);
  return onSnapshot(cartRef, (docSnap) => {
    callback(docSnap.exists() ? docSnap.data() : null);
  });
};

export const saveCart = (uid, items = []) => {
  if (!uid) return Promise.resolve();
  const cartRef = doc(cartCol, uid);
  return setDoc(
    cartRef,
    {
      userId: uid,
      items: normalizeItems(items),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const clearCart = (uid) => {
  if (!uid) return Promise.resolve();
  const cartRef = doc(cartCol, uid);
  return setDoc(
    cartRef,
    {
      userId: uid,
      items: [],
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};
