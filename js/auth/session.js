import { auth } from "../config/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { updateNavbarUI } from "./navbar.js";
import { STORAGE_KEYS, NAVIGATION_PATHS } from "../config/constants.js";
import { subscribeCart } from "../services/cartService.js";

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

let cartUnsubscribe = null;

export const initAuthStateListener = (isRegistering) => {
  onAuthStateChanged(auth, async (user) => {
    await updateNavbarUI(user);

    if (cartUnsubscribe) {
      cartUnsubscribe();
      cartUnsubscribe = null;
    }

    if (user?.uid) {
      cartUnsubscribe = subscribeCart(user.uid, (cartDoc) => {
        const items = Array.isArray(cartDoc?.items) ? cartDoc.items : [];
        window.cart = items.map((item) => ({
          id: item?.productId ?? item?.id ?? undefined,
          name: item?.name || "Sản phẩm",
          imageUrl: item?.imageUrl || "",
          price: item?.price ?? 0,
          quantity: item?.quantity ?? 1,
        }));
        document.dispatchEvent(new CustomEvent("cart:updated"));
      });
    } else {
      window.cart = [];
      document.dispatchEvent(new CustomEvent("cart:updated"));
    }

    if (user && isAuthPage() && !isRegistering()) {
      const redirectUrl = getRedirectUrl();
      console.log("Đã đăng nhập, đẩy về:", redirectUrl);
      window.location.replace(redirectUrl);
    }
  });
};
