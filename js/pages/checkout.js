import { auth } from "../config/firebase-config.js";
import { NAVIGATION_PATHS, MESSAGES } from "../config/constants.js";
import { formatPrice } from "../utils/number.js";
import { createOrder } from "../services/orderService.js";
import { clearCart } from "../services/cartService.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const summaryEl = document.getElementById("checkout-summary");
const formEl = document.getElementById("checkout-form");

const getCart = () => {
  if (!Array.isArray(window.cart)) {
    window.cart = [];
  }
  return window.cart;
};

const requireLoginRedirect = () => {
  alert(MESSAGES.loginRequired || "Vui lòng đăng nhập để tiếp tục.");
  window.location.href = NAVIGATION_PATHS.login;
};

const getTotal = (cart) =>
  cart.reduce((sum, item) => {
    const price = item?.price ?? 0;
    const qty = item?.quantity ?? 1;
    return sum + price * qty;
  }, 0);

const renderSummary = () => {
  if (!summaryEl) return;
  const cart = getCart();
  if (!cart.length) {
    summaryEl.innerHTML = `
      <div class="checkout-empty">
        <p class="text-muted mb-3">Giỏ hàng của bạn đang trống.</p>
        <a class="btn btn-outline-primary" href="${NAVIGATION_PATHS.home}">Quay lại trang chủ</a>
      </div>
    `;
    return;
  }

  const total = getTotal(cart);
  summaryEl.innerHTML = `
    <div class="checkout-summary-list">
      ${cart
        .map((item) => {
          const name = item?.name || "Sản phẩm";
          const qty = item?.quantity ?? 1;
          const price = item?.price ?? 0;
          return `
            <div class="checkout-summary-item">
              <div>
                <p class="mb-1">${name}</p>
                <p class="text-muted mb-0">x${qty}</p>
              </div>
              <strong>${formatPrice(price * qty)}</strong>
            </div>
          `;
        })
        .join("")}
    </div>
    <div class="checkout-summary-total">
      <span>Tạm tính</span>
      <strong>${formatPrice(total)}</strong>
    </div>
  `;
};

const handleSubmit = async (event) => {
  event.preventDefault();
  if (!auth.currentUser?.uid) {
    requireLoginRedirect();
    return;
  }

  const cart = getCart();
  if (!cart.length) {
    alert("Giỏ hàng đang trống.");
    return;
  }

  const name = document.getElementById("checkout-name").value.trim();
  if (!name) {
    alert("Vui lòng nhập tên khách hàng.");
    return;
  }

  const phone = document.getElementById("checkout-phone").value.trim();
  const note = document.getElementById("checkout-note").value.trim();
  const type = document.querySelector('input[name="checkout-type"]:checked')?.value;
  const payment = document.querySelector(
    'input[name="checkout-payment"]:checked'
  )?.value;

  const items = cart.map((item) => ({
    productId: item?.id ?? item?.productId ?? null,
    name: item?.name || "Sản phẩm",
    quantity: item?.quantity ?? 1,
    price: item?.price ?? 0,
    imageUrl: item?.imageUrl || "",
  }));

  const total = getTotal(cart);

  try {
    await createOrder({
      userId: auth.currentUser.uid,
      customerName: name,
      phone,
      note,
      orderType: type,
      paymentMethod: payment,
      items,
      total,
    });
    await clearCart(auth.currentUser.uid);
    window.cart = [];
    document.dispatchEvent(new CustomEvent("cart:updated"));
    alert(MESSAGES.orderCreated || "Đặt hàng thành công!");
    window.location.href = NAVIGATION_PATHS.home;
  } catch (error) {
    alert(MESSAGES.errorPrefix + error.message);
  }
};

const initCheckout = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      requireLoginRedirect();
      return;
    }

    renderSummary();
    if (formEl && !formEl.dataset.bound) {
      formEl.dataset.bound = "true";
      formEl.addEventListener("submit", handleSubmit);
    }
    document.addEventListener("cart:updated", () => {
      renderSummary();
    });
  });
};

initCheckout();
