import { APP_CONFIG, NAVIGATION_PATHS, UI_TEXTS } from "../config/constants.js";
import { formatPrice } from "../utils/number.js";

export function loadNavbar() {
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="${NAVIGATION_PATHS.home}">
          <img src="${APP_CONFIG.logoUrl}" width="${APP_CONFIG.logoWidth}" class="me-2" />
          <strong>${APP_CONFIG.name}</strong>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto" id="nav-menu-items">
            <li class="nav-item"><a class="nav-link" href="${NAVIGATION_PATHS.home}">${UI_TEXTS.navbarHome}</a></li>
            <li class="nav-item"><a class="nav-link" href="#">${UI_TEXTS.navbarMenu}</a></li>
            <li class="nav-item cart-item">
              <a class="nav-link d-flex align-items-center gap-2" id="cart-toggle" href="${NAVIGATION_PATHS.cart}" role="button" aria-expanded="false" aria-haspopup="true">
                <i class="fa-solid fa-cart-shopping"></i>
                <span>${UI_TEXTS.navbarCart}</span>
                <span class="cart-dot" id="cart-dot" aria-hidden="true"></span>
              </a>
              <div class="cart-preview" id="cart-preview" role="dialog" aria-label="${UI_TEXTS.navbarCart}">
                <p class="mb-2 fw-semibold">${UI_TEXTS.navbarCart}</p>
                <div class="cart-preview-body" id="cart-preview-body"></div>
              </div>
            </li>
            <li class="nav-item" id="admin-feature"></li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="userDropdown" data-bs-toggle="dropdown">
                <i class="fa-regular fa-user"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end bg-dark" id="user-menu-list">
                </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>`;

  // Insert at the beginning of the body
  document.body.insertAdjacentHTML("afterbegin", navbarHTML);

  const cartToggle = document.getElementById("cart-toggle");
  const cartPreview = document.getElementById("cart-preview");
  const cartPreviewBody = document.getElementById("cart-preview-body");
  const cartDot = document.getElementById("cart-dot");

  if (cartToggle && cartPreview && cartPreviewBody && cartDot) {
    const updateCartDot = () => {
      const cart = window.cart || [];
      cartDot.classList.toggle("show", cart.length > 0);
    };

    const updateCartItemQuantity = (index, change) => {
      const cart = window.cart || [];
      const item = cart[index];
      if (!item) return;
      const current = item.quantity ?? 1;
      const next = current + change;
      if (next <= 0) {
        cart.splice(index, 1);
      } else {
        item.quantity = next;
      }
      document.dispatchEvent(new CustomEvent("cart:updated"));
    };

    const renderCartPreview = () => {
      const cart = window.cart || [];
      if (!cart.length) {
        cartPreviewBody.innerHTML = `<p class="mb-0 text-white-50">Giỏ hàng trống</p>`;
        return;
      }

      cartPreviewBody.innerHTML = cart
        .map((item, index) => {
          const name = item?.name || "Sản phẩm";
          const imageUrl = item?.imageUrl || "";
          const price = item?.price ?? 0;
          const qty = item?.quantity ?? 1;
          return `
            <div class="cart-preview-item">
              <img class="cart-preview-img" src="${imageUrl}" alt="${name}" />
              <div class="cart-preview-info">
                <p class="mb-0 cart-preview-name">${name}</p>
                <p class="mb-0 text-white-50">${formatPrice(price)}</p>
                <div class="cart-preview-qty" data-index="${index}">
                  <button type="button" class="cart-qty-btn" data-change="-1" aria-label="Decrease quantity">-</button>
                  <span class="cart-qty-value">${qty}</span>
                  <button type="button" class="cart-qty-btn" data-change="1" aria-label="Increase quantity">+</button>
                </div>
              </div>
            </div>
          `;
        })
        .join("");
    };

    renderCartPreview();
    updateCartDot();

    const closeCart = () => {
      cartPreview.classList.remove("show");
      cartToggle.setAttribute("aria-expanded", "false");
    };

    cartToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      renderCartPreview();
      updateCartDot();
      const isOpen = cartPreview.classList.toggle("show");
      cartToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!cartPreview.contains(target) && !cartToggle.contains(target)) {
        closeCart();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeCart();
      }
    });

    cartPreviewBody.addEventListener("click", (event) => {
      const button = event.target.closest(".cart-qty-btn");
      if (!button) return;
      const wrapper = button.closest(".cart-preview-qty");
      if (!wrapper) return;
      const index = Number(wrapper.dataset.index);
      const change = Number(button.dataset.change || 0);
      if (Number.isNaN(index) || Number.isNaN(change) || !change) return;
      updateCartItemQuantity(index, change);
    });

    document.addEventListener("cart:updated", () => {
      renderCartPreview();
      updateCartDot();
    });
  }
}


