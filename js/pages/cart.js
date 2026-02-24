import { auth } from "../config/firebase-config.js";
import { formatPrice } from "../utils/number.js";
import { saveCart } from "../services/cartService.js";
import { NAVIGATION_PATHS } from "../config/constants.js";

const container = document.getElementById("cart-content");

const getCart = () => {
  if (!Array.isArray(window.cart)) {
    window.cart = [];
  }
  return window.cart;
};

const persistCartIfNeeded = (cart) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  saveCart(uid, cart).catch((error) => {
    console.error("Failed to save cart:", error);
  });
};

const getTotal = (cart) => {
  return cart.reduce((sum, item) => {
    const price = item?.price ?? 0;
    const qty = item?.quantity ?? 1;
    return sum + price * qty;
  }, 0);
};

const renderEmptyState = () => {
  if (!container) return;
  container.innerHTML = `
    <div class="cart-empty">
      <div class="cart-empty-icon">
        <i class="fa-solid fa-mug-hot"></i>
      </div>
      <h4 class="mb-2">Giỏ hàng của bạn đang trống</h4>
      <p class="text-muted mb-4">Hãy thêm vài món ngon nhé.</p>
      <a class="btn btn-primary" href="${NAVIGATION_PATHS.home}">Quay lại trang chủ</a>
    </div>
  `;
};

const renderCart = () => {
  if (!container) return;
  const cart = getCart();
  if (!cart.length) {
    renderEmptyState();
    return;
  }

  const total = getTotal(cart);

  container.innerHTML = `
    <div class="cart-panel">
      <div class="cart-list">
        ${cart
          .map((item, index) => {
            const name = item?.name || "Sản phẩm";
            const imageUrl = item?.imageUrl || "";
            const price = item?.price ?? 0;
            const qty = item?.quantity ?? 1;
            const lineTotal = price * qty;
            return `
              <div class="cart-row" data-index="${index}">
                <div class="cart-row-media">
                  <img src="${imageUrl}" alt="${name}" />
                </div>
                <div class="cart-row-info">
                  <h6>${name}</h6>
                  <p class="text-muted mb-0">${formatPrice(price)}</p>
                </div>
                <div class="cart-row-qty">
                  <button type="button" class="btn btn-qty" data-change="-1" aria-label="Decrease quantity">-</button>
                  <span class="cart-qty-value">${qty}</span>
                  <button type="button" class="btn btn-qty" data-change="1" aria-label="Increase quantity">+</button>
                </div>
                <div class="cart-row-total">${formatPrice(lineTotal)}</div>
                <button type="button" class="btn btn-remove" data-remove="${index}" aria-label="Remove item">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            `;
          })
          .join("")}
      </div>
      <div class="cart-summary">
        <div>
          <p class="text-muted mb-1">Tạm tính</p>
          <h4 class="mb-0">${formatPrice(total)}</h4>
        </div>
        <div class="cart-summary-actions">
          <button type="button" class="btn btn-primary" disabled>Thanh toán</button>
          <p class="text-muted mb-0">Thanh toán sẽ được bổ sung sau.</p>
        </div>
      </div>
    </div>
  `;
};

const updateItemQuantity = (index, change) => {
  const cart = getCart();
  const item = cart[index];
  if (!item) return;
  const current = item.quantity ?? 1;
  const next = current + change;
  if (next <= 0) {
    cart.splice(index, 1);
  } else {
    item.quantity = next;
  }
  persistCartIfNeeded(cart);
  renderCart();
  document.dispatchEvent(new CustomEvent("cart:updated"));
};

const removeItem = (index) => {
  const cart = getCart();
  if (!cart[index]) return;
  cart.splice(index, 1);
  persistCartIfNeeded(cart);
  renderCart();
  document.dispatchEvent(new CustomEvent("cart:updated"));
};

const bindEvents = () => {
  if (!container) return;
  container.addEventListener("click", (event) => {
    const removeBtn = event.target.closest("[data-remove]");
    if (removeBtn) {
      const index = Number(removeBtn.dataset.remove);
      if (!Number.isNaN(index)) removeItem(index);
      return;
    }

    const changeBtn = event.target.closest("[data-change]");
    if (!changeBtn) return;
    const row = changeBtn.closest(".cart-row");
    if (!row) return;
    const index = Number(row.dataset.index);
    const change = Number(changeBtn.dataset.change || 0);
    if (Number.isNaN(index) || Number.isNaN(change) || !change) return;
    updateItemQuantity(index, change);
  });
};

const initCartPage = () => {
  renderCart();
  bindEvents();
  document.addEventListener("cart:updated", () => {
    renderCart();
  });
};

initCartPage();
