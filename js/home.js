import { subscribeProducts } from "./services/productService.js";
import { formatPrice } from "./utils/number.js";
import { UI_TEXTS } from "./config/constants.js";

const container = document.getElementById("home-products");

const renderMessage = (message) => {
  if (!container) return;
  container.innerHTML = `
    <div class="col-12">
      <p class="text-muted mb-0">${message}</p>
    </div>
  `;
};

const buildCard = (product) => {
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
  button.className = "btn btn-order";
  button.type = "button";
  button.textContent = "Đặt hàng";

  body.appendChild(header);
  body.appendChild(button);

  card.appendChild(img);
  card.appendChild(body);
  col.appendChild(card);

  return col;
};

const renderProducts = (products) => {
  if (!container) return;
  container.textContent = "";
  products.forEach((product) => {
    container.appendChild(buildCard(product));
  });
};

const initHomeProducts = () => {
  if (!container) return;
  renderMessage("Đang tải...");

  subscribeProducts((snapshot) => {
    if (!snapshot.size) {
      renderMessage(UI_TEXTS?.noData || "Không có dữ liệu");
      return;
    }

    const limited = snapshot.docs.slice(0, 4).map((docSnap) => docSnap.data());
    renderProducts(limited);
  });
};

initHomeProducts();
