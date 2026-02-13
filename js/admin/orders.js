import * as dbService from "../services/index.js";
import { formatFirestoreDateTime } from "../utils/date.js";
import { formatPrice } from "../utils/number.js";
import { startButtonLoading, stopButtonLoading } from "../utils/ui.js";
import {
  DEFAULT_VALUES,
  MESSAGES,
  ORDER_STATUS,
  UI_TEXTS,
} from "../config/constants.js";

const calculateOrderTotal = () => {
  let total = 0;
  document.querySelectorAll(".product-select:checked").forEach((chk) => {
    const id = chk.id.replace("chk-", "");
    const qty = parseInt(document.getElementById(`qty-${id}`).value || "0");
    total += Number(chk.value) * qty;
  });

  const totalInput = document.getElementById("orderTotal");
  if (totalInput) totalInput.value = total;
};

const renderProductCheckboxes = () => {
  const container = document.getElementById("product-checkbox-list");
  if (!container) return;

  dbService.subscribeProducts((snapshot) => {
    container.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const p = docSnap.data();
      container.innerHTML += `
        <div class="form-check d-flex justify-content-between align-items-center mb-2 p-2 border-bottom border-dark">
          <div class="d-flex align-items-center">
            <input class="form-check-input product-select me-2" type="checkbox" value="${p.price}" id="chk-${docSnap.id}" data-name="${p.name}">
            <label class="form-check-label text-white" for="chk-${docSnap.id}">${p.name}</label>
          </div>
          <div class="d-flex align-items-center">
            <span class="text-warning me-3">${formatPrice(p.price)}</span>
            <div class="d-flex align-items-center bg-dark rounded border border-secondary">
                <button type="button" class="btn btn-sm text-white px-2" onclick="updateQty('${docSnap.id}', -1)">-</button>
                <input
                  id="qty-${docSnap.id}"
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  value="1"
                  class="form-control form-control-sm text-center text-white bg-dark border-0 px-2"
                  style="width: 60px;"
                  oninput="setQty('${docSnap.id}', this.value, false)"
                  onblur="setQty('${docSnap.id}', this.value, true)"
                />
                <button type="button" class="btn btn-sm text-white px-2" onclick="updateQty('${docSnap.id}', 1)">+</button>
            </div>
          </div>
        </div>`;
    });

    document
      .querySelectorAll(".product-select")
      .forEach((chk) => chk.addEventListener("change", calculateOrderTotal));
  });
};

const loadOrders = () => {
  dbService.subscribeOrders((snapshot) => {
    const list = document.getElementById("order-list-render");
    const statOrders = document.getElementById("stat-orders");

    if (statOrders) statOrders.innerText = snapshot.size;
    if (!list) return;

    list.textContent = "";

    snapshot.forEach((docSnap) => {
      const o = docSnap.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>#${docSnap.id.slice(0, 5)}</td>
        <td>${o?.customerName || UI_TEXTS.orderWalkInCustomer}</td>
        <td>${formatPrice(o?.total)}</td>
        <td><span class="badge ${o?.status === ORDER_STATUS.completed ? "bg-success" : "bg-warning"}">${o?.status || ""}</span></td>
        <td>${formatFirestoreDateTime(o?.createdAt)}</td>
        <td><button class="btn btn-sm btn-primary">${UI_TEXTS.orderDetail}</button></td>
      `;

      tr.querySelector("button").addEventListener("click", () =>
        window.viewOrderDetail(docSnap.id),
      );
      list.appendChild(tr);
    });
  });
};

const bindOrderForm = () => {
  const orderFormEl = document.getElementById("orderForm");
  if (!orderFormEl) return;

  orderFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn =
      document.getElementById("btnOrderSubmit") ||
      orderFormEl.querySelector('[type="submit"]');
    const originalHtml = startButtonLoading(submitBtn);

    const id = document.getElementById("currentOrderId").value;

    try {
      if (id) {
        await dbService.updateOrderStatus(
          id,
          document.getElementById("orderStatus").value,
        );
        alert(MESSAGES.orderStatusUpdated);
      } else {
        const items = [];
        document.querySelectorAll(".product-select:checked").forEach((chk) => {
          const qty = parseInt(
            document.getElementById(`qty-${chk.id.replace("chk-", "")}`)
              .value || "1",
          );
          items.push({
            name: chk.getAttribute("data-name"),
            quantity: qty,
            price: Number(chk.value),
          });
        });

        if (items.length === 0) {
          alert(MESSAGES.orderSelectItem);
          return;
        }

        await dbService.createOrder({
          customerName: document.getElementById("orderCustomer").value,
          items,
          total: Number(document.getElementById("orderTotal").value),
        });
        alert(MESSAGES.orderCreated);
      }

      bootstrap.Modal.getInstance(document.getElementById("orderModal")).hide();
    } catch (error) {
      alert(MESSAGES.errorPrefix + error.message);
    } finally {
      stopButtonLoading(submitBtn, originalHtml);
    }
  });
};

const registerWindowActions = () => {
  window.openOrderModal = () => {
    document.getElementById("orderForm").reset();
    document.getElementById("currentOrderId").value = "";
    document.getElementById("orderModalTitle").innerText =
      UI_TEXTS.orderModalCreateTitle;

    const statusField = document.getElementById("orderStatus");
    statusField.value = DEFAULT_VALUES.orderStatus;
    statusField.disabled = true;

    document
      .getElementById("product-selection-area")
      .classList.remove("d-none");
    document.getElementById("btnOrderSubmit").innerText =
      UI_TEXTS.orderModalCreateSubmit;

    renderProductCheckboxes();
    new bootstrap.Modal(document.getElementById("orderModal")).show();
  };

  window.updateQty = (id, change) => {
    const qtyElement = document.getElementById(`qty-${id}`);
    const current = parseInt(qtyElement.value || "1");
    const next = Number.isFinite(current) ? current + change : 1 + change;
    qtyElement.value = next < 1 ? 1 : next;
    calculateOrderTotal();
  };

  window.setQty = (id, value, enforceMin) => {
    const qtyElement = document.getElementById(`qty-${id}`);
    if (value === "") {
      if (enforceMin) qtyElement.value = 1;
      calculateOrderTotal();
      return;
    }

    const digitsOnly = value.replace(/\D+/g, "");
    if (digitsOnly !== value) qtyElement.value = digitsOnly;

    const parsed = parseInt(digitsOnly);
    if (enforceMin)
      qtyElement.value = !Number.isFinite(parsed) || parsed < 1 ? 1 : parsed;
    calculateOrderTotal();
  };

  window.viewOrderDetail = async (id) => {
    const docSnap = await dbService.getOrderById(id);
    if (!docSnap.exists()) return;

    const o = docSnap.data();
    document.getElementById("currentOrderId").value = id;
    document.getElementById("orderCustomer").value = o.customerName;
    document.getElementById("orderTotal").value = o.total;

    const statusField = document.getElementById("orderStatus");
    statusField.value = o.status;
    statusField.disabled = false;

    document.getElementById("orderModalTitle").innerText =
      UI_TEXTS.orderModalDetailTitle;
    document.getElementById("btnOrderSubmit").innerText =
      UI_TEXTS.orderModalUpdateSubmit;

    const container = document.getElementById("product-checkbox-list");
    document
      .getElementById("product-selection-area")
      .classList.remove("d-none");

    container.innerHTML = `<div class="d-flex justify-content-between text-warning mb-2 border-bottom border-secondary pb-1"><span>${UI_TEXTS.orderItemsHeader}</span><span>${UI_TEXTS.orderItemsQtyHeader}</span></div>`;

    const orderItems = o.items || o.products;
    if (orderItems && orderItems.length > 0) {
      orderItems.forEach((item) => {
        const name = typeof item === "object" ? item.name : item;
        const qty = typeof item === "object" ? item.quantity : 1;
        container.innerHTML += `<div class="text-white border-bottom border-dark py-2 d-flex justify-content-between align-items-center"><span>• ${name}</span><span class="badge bg-primary fs-6">${qty}</span></div>`;
      });
    } else {
      container.innerHTML += `<div class="text-muted text-center">${UI_TEXTS.noData}</div>`;
    }

    new bootstrap.Modal(document.getElementById("orderModal")).show();
  };
};

export const initOrdersModule = () => {
  loadOrders();
  bindOrderForm();
  registerWindowActions();
};
