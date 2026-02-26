import { formatPrice } from "./number.js";
import { MESSAGES, NAVIGATION_PATHS } from "../config/constants.js";
import { auth } from "../config/firebase-config.js";
import { saveCart } from "../services/cartService.js";

const getCart = () => {
  if (!Array.isArray(window.cart)) {
    window.cart = [];
  }
  return window.cart;
};

export const createAddToCartHandler = () => {
  return (product) => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert(MESSAGES.loginRequired || "Vui lòng đăng nhập để tiếp tục.");
      window.location.href = NAVIGATION_PATHS.login;
      return;
    }

    const id = product?.id;
    const name = product?.name || "Sản phẩm";
    const price = product?.price ?? 0;
    const imageUrl = product?.imageUrl || "";

    const cart = getCart();

    if (id) {
      const existing = cart.find((item) => item.id === id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({
          id,
          name,
          imageUrl,
          price,
          quantity: 1,
        });
      }
    } else {
      cart.push({
        name,
        imageUrl,
        price,
        quantity: 1,
      });
    }

    saveCart(uid, cart).catch((error) => {
      console.error("Failed to save cart:", error);
    });

    document.dispatchEvent(new CustomEvent("cart:updated"));
  };
};

export const renderMessage = (container, message) => {
  if (!container) return;
  container.innerHTML = `
    <div class="col-12">
      <p class="text-muted mb-0">${message}</p>
    </div>
  `;
};

export const buildProductCard = (product, onAddToCart) => {
  const name = product?.name || "Sản phẩm";
  const price = product?.price ?? 0;
  const imageUrl = product?.imageUrl || "";

  const col = document.createElement("div");
  col.className = "col-6 col-md-3";

  const card = document.createElement("div");
  card.className = "card product-card";

  const img = document.createElement("img");
  img.className = "card-img-top";
  img.alt = name;
  img.loading = "lazy";
  img.src = imageUrl;
  img.onerror = () => {
    img.onerror = null;
    img.src = "";
  };

  const body = document.createElement("div");
  body.className = "card-body";

  const header = document.createElement("div");
  header.className = "d-flex justify-content-between align-items-center mb-2";

  const title = document.createElement("h6");
  title.className = "card-title mb-0";
  title.textContent = name;

  const priceEl = document.createElement("span");
  priceEl.className = "price-text";
  priceEl.textContent = formatPrice(price);

  header.appendChild(title);
  header.appendChild(priceEl);

  const button = document.createElement("button");
  button.className = "btn btn-order d-block ms-auto";
  button.type = "button";
  button.textContent = "Thêm vào giỏ";
  button.addEventListener("click", () => onAddToCart(product));

  body.appendChild(header);
  body.appendChild(button);

  card.appendChild(img);
  card.appendChild(body);
  col.appendChild(card);

  return col;
};

export const renderProductCards = (container, products, onAddToCart) => {
  if (!container) return;
  container.textContent = "";
  products.forEach((product) => {
    container.appendChild(buildProductCard(product, onAddToCart));
  });
};
