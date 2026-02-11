import { auth } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { updateNavbarUI } from "./navbar.js";
import { STORAGE_KEYS, NAVIGATION_PATHS } from "../config/constants.js";

const getRedirectUrl = () => {
  const lastPage = localStorage.getItem(STORAGE_KEYS.lastVisitedPage);
  if (!lastPage) return NAVIGATION_PATHS.home;

  try {
    // Ensure lastPage is a string to prevent prototype pollution.
    const parsed = new URL(String(lastPage), window.location.origin);
    return parsed.origin === window.location.origin
      ? parsed.href
      : NAVIGATION_PATHS.home;
  } catch (error) {
    console.error("Invalid URL in lastVisitedPage:", error);
    return NAVIGATION_PATHS.home;
  }
};

const isAuthPage = () => {
  const currentPage = window.location.pathname;
  return (
    currentPage.includes(NAVIGATION_PATHS.login) ||
    currentPage.includes(NAVIGATION_PATHS.register)
  );
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
