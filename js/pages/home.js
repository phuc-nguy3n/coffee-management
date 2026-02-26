import { subscribeProducts } from "../services/productService.js";
import { UI_TEXTS } from "../config/constants.js";
import {
  createAddToCartHandler,
  renderMessage,
  renderProductCards,
} from "../utils/productCards.js";

const container = document.getElementById("home-products");
const addToCart = createAddToCartHandler();

const initHomeProducts = () => {
  if (!container) return;
  renderMessage(container, "Đang tải...");

  subscribeProducts((snapshot) => {
    if (!snapshot.size) {
      renderMessage(container, UI_TEXTS?.noData || "Không có dữ liệu");
      return;
    }

    const limited = snapshot.docs
      .slice(0, 4)
      .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    renderProductCards(container, limited, addToCart);
  });
};

initHomeProducts();
