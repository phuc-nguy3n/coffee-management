import { auth } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { updateNavbarUI } from "./navbar.js";

const getRedirectUrl = () => {
  const lastPage = localStorage.getItem("lastVisitedPage");
  if (!lastPage) return "index.html";

  try {
    // Ensure lastPage is a string to prevent prototype pollution.
    const parsed = new URL(String(lastPage), window.location.origin);
    return parsed.origin === window.location.origin ? parsed.href : "index.html";
  } catch (error) {
    console.error("Invalid URL in lastVisitedPage:", error);
    return "index.html";
  }
};

const isAuthPage = () => {
  const currentPage = window.location.pathname;
  return currentPage.includes("login.html") || currentPage.includes("register.html");
};

export const initAuthStateListener = (isRegistering) => {
  onAuthStateChanged(auth, async (user) => {
    await updateNavbarUI(user);

    if (user && isAuthPage() && !isRegistering()) {
      const redirectUrl = getRedirectUrl();
      console.log("Đã đăng nhập, đẩy về:", redirectUrl);
      window.location.replace(redirectUrl);
    }
  });
};
