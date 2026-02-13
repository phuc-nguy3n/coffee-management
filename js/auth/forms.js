import { auth, db } from "../config/firebase-config.js";
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
import {
  DEFAULT_VALUES,
  MESSAGES,
  NAVIGATION_PATHS,
} from "../config/constants.js";

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
      alert(MESSAGES.passwordMismatch);
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
        role: DEFAULT_VALUES.userRole,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await signOut(auth);
      alert(MESSAGES.registerSuccess);
      window.location.href = NAVIGATION_PATHS.login;
    } catch (error) {
      alert(MESSAGES.errorPrefix + error.message);
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
      alert(MESSAGES.loginSuccess);
      window.location.replace("./index.html");
    } catch (error) {
      alert(MESSAGES.errorPrefix + error.message);
    }
  });
};
