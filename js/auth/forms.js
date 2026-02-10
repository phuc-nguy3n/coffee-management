import { auth, db } from "../firebase-config.js";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export const setupRegisterForm = (setRegisteringState) => {
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return;

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setRegisteringState(true);

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPass = document.getElementById("confirmPassword").value;

    if (password !== confirmPass) {
      alert("Mật khẩu xác nhận không khớp!");
      setRegisteringState(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        displayName: name,
        email,
        role: "customer",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await signOut(auth);
      alert("Đăng ký thành công!");
      window.location.href = "login.html";
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setRegisteringState(false);
    }
  });
};

export const setupLoginForm = () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Đăng nhập thành công!");
      window.location.replace("./index.html");
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  });
};
