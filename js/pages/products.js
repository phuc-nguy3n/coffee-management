import { subscribeProducts } from "../services/productService.js";
import { UI_TEXTS } from "../config/constants.js";
import {
  createAddToCartHandler,
  renderMessage,
  renderProductCards,
} from "../utils/productCards.js";

const container = document.getElementById("products-list");
const addToCart = createAddToCartHandler();

const initProductsPage = () => {
  if (!container) return;
  renderMessage(container, "Đang tải...");

  subscribeProducts((snapshot) => {
    if (!snapshot.size) {
      renderMessage(container, UI_TEXTS?.noData || "Không có dữ liệu");
      return;
    }

    const products = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    renderProductCards(container, products, addToCart);
  });
};

initProductsPage();
