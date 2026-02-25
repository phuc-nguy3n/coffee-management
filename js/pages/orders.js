import { auth } from "../config/firebase-config.js";
import { NAVIGATION_PATHS, MESSAGES } from "../config/constants.js";
import { formatFirestoreDateTime } from "../utils/date.js";
import { formatPrice } from "../utils/number.js";
import { subscribeOrdersByUser } from "../services/orderService.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const container = document.getElementById("orders-content");

const requireLoginRedirect = () => {
  alert(MESSAGES.loginRequired || "Vui lòng đăng nhập để tiếp tục.");
  window.location.href = NAVIGATION_PATHS.login;
};

const renderEmptyState = () => {
  if (!container) return;
  container.innerHTML = `
    <div class="orders-empty">
      <div class="orders-empty-icon">
        <i class="fa-solid fa-receipt"></i>
      </div>
      <h4 class="mb-2">Bạn chưa có đơn hàng nào</h4>
      <p class="text-muted mb-4">Hãy đặt món và quay lại để theo dõi trạng thái.</p>
      <a class="btn btn-primary" href="${NAVIGATION_PATHS.home}">Khám phá menu</a>
    </div>
  `;
};

const renderOrders = (snapshot) => {
  if (!container) return;
  if (!snapshot || !snapshot.size) {
    renderEmptyState();
    return;
  }

  const docs = snapshot.docs.slice().sort((a, b) => {
    const aTime = a.data()?.createdAt?.toDate?.()?.getTime?.() ?? 0;
    const bTime = b.data()?.createdAt?.toDate?.()?.getTime?.() ?? 0;
    return bTime - aTime;
  });

  container.innerHTML = `
    <div class="orders-panel">
      ${docs
        .map((docSnap) => {
          const data = docSnap.data();
          const items = data?.items || [];
          const itemCount = items.reduce(
            (sum, item) => sum + (item?.quantity ?? 1),
            0,
          );
          const status = data?.status || "Đang xử lý";
          const createdAt = formatFirestoreDateTime(data?.createdAt);
          const total = formatPrice(data?.total ?? 0);
          return `
            <div class="orders-card">
              <div class="orders-card-main">
                <div>
                  <p class="orders-code mb-1">Mã đơn: #${docSnap.id.slice(0, 6)}</p>
                  <p class="text-muted mb-0">Ngày đặt: ${createdAt}</p>
                </div>
                <span class="orders-status">${status}</span>
              </div>
              <div class="orders-card-meta">
                <span>${itemCount} món</span>
                <strong>${total}</strong>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
};

const initOrdersPage = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      requireLoginRedirect();
      return;
    }

    subscribeOrdersByUser(user.uid, (snapshot) => {
      renderOrders(snapshot);
    });
  });
};

initOrdersPage();
