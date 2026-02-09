// js/admin.js
import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import * as dbService from "./services.js";

// ================= CẤU HÌNH & KHỞI TẠO =================

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const role = await dbService.getUserRole(user.uid); //
    if (role === "admin") {
      setupNavigation();
      initDataListeners();
    } else {
      alert("Bạn không có quyền truy cập!");
      window.location.href = "../index.html";
    }
  } else {
    window.location.href = "../login.html";
  }
});

const initDataListeners = () => {
  loadProducts();
  loadCustomers();
  loadOrders();
};

// ================= ĐIỀU HƯỚNG TABS =================

const setupNavigation = () => {
  const navLinks = document.querySelectorAll(
    "#sidebar-wrapper .list-group-item",
  );
  const sections = document.querySelectorAll(".admin-section");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const sectionTarget = link.getAttribute("data-section");
      if (!sectionTarget) return;

      e.preventDefault();
      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");

      sections.forEach((s) => s.classList.add("d-none"));
      const targetDiv = document.getElementById(`section-${sectionTarget}`);
      if (targetDiv) targetDiv.classList.remove("d-none");

      document.querySelector("#page-content-wrapper h2").innerText =
        link.innerText.trim();
    });
  });
};

// ================= QUẢN LÝ SẢN PHẨM =================

// --- Hiển thị danh sách sản phẩm ---
const loadProducts = () => {
  dbService.subscribeProducts((snapshot) => {
    const list = document.getElementById("product-list-render");
    const statProducts = document.getElementById("stat-products");

    if (statProducts) statProducts.innerText = snapshot.size;
    if (!list) return;

    list.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const p = docSnap.data();
      const timeString = p.createdAt
        ? p.createdAt.toDate().toLocaleString("vi-VN")
        : "Đang xử lý...";

      list.innerHTML += `
        <tr>
          <td><img src="${p.imageUrl}" width="40" height="40" class="rounded" style="object-fit:cover"></td>
          <td>${p.name}</td>
          <td>${p.price.toLocaleString()}đ</td>
          <td>${timeString}</td>
          <td>
            <button onclick="editProduct('${docSnap.id}', '${p.name}', ${p.price}, '${p.imageUrl}')" class="btn btn-sm btn-warning me-2">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteProduct('${docSnap.id}')" class="btn btn-sm btn-danger">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>`;
    });
  });
};

// --- Xử lý Form Thêm/Sửa sản phẩm ---
const productForm = document.getElementById("productForm");
if (productForm) {
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("productId").value;
    const data = {
      name: document.getElementById("pName").value,
      price: Number(document.getElementById("pPrice").value),
      imageUrl: document.getElementById("pImg").value,
    };

    try {
      if (id) {
        await dbService.updateProduct(id, data);
        alert("Cập nhật thành công!");
      } else {
        await dbService.addProduct(data);
        alert("Thêm món mới thành công!");
      }
      bootstrap.Modal.getInstance(
        document.getElementById("productModal"),
      ).hide();
      productForm.reset();
    } catch (error) {
      console.error("Lỗi:", error);
    }
  });
}

window.openAddModal = () => {
  productForm.reset();
  document.getElementById("productId").value = "";
  document.getElementById("modalTitle").innerText = "Thêm Sản Phẩm Mới";
  new bootstrap.Modal(document.getElementById("productModal")).show();
};

window.editProduct = (id, name, price, img) => {
  document.getElementById("productId").value = id;
  document.getElementById("pName").value = name;
  document.getElementById("pPrice").value = price;
  document.getElementById("pImg").value = img;
  document.getElementById("modalTitle").innerText = "Chỉnh sửa sản phẩm";
  new bootstrap.Modal(document.getElementById("productModal")).show();
};

window.deleteProduct = async (id) => {
  if (confirm("Bạn có chắc muốn xóa món này?")) {
    try {
      await dbService.deleteProductById(id);
    } catch (error) {
      alert("Lỗi khi xóa: " + error.message);
    }
  }
};

// ================= QUẢN LÝ ĐƠN HÀNG =================

// --- Hiển thị danh sách đơn hàng ---
const loadOrders = () => {
  dbService.subscribeOrders((snapshot) => {
    const list = document.getElementById("order-list-render");
    const statOrders = document.getElementById("stat-orders");
    if (statOrders) statOrders.innerText = snapshot.size;
    if (!list) return;

    list.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const o = docSnap.data();
      const timeString = o.createdAt
        ? o.createdAt.toDate().toLocaleString("vi-VN")
        : "Đang xử lý...";
      list.innerHTML += `
        <tr>
          <td>#${docSnap.id.slice(0, 5)}</td>
          <td>${o.customerName || "Khách tại quầy"}</td>
          <td>${(o.total || 0).toLocaleString()}đ</td>
          <td><span class="badge ${o.status === "Hoàn thành" ? "bg-success" : "bg-warning"}">${o.status}</span></td>
          <td>${timeString}</td>
          <td><button onclick="viewOrderDetail('${docSnap.id}')" class="btn btn-sm btn-primary">Chi tiết</button></td>
        </tr>`;
    });
  });
};

// --- Logic Tạo Đơn Hàng & Tăng/Giảm Số Lượng ---
window.openOrderModal = () => {
  document.getElementById("orderForm").reset();
  document.getElementById("currentOrderId").value = "";
  document.getElementById("orderModalTitle").innerText = "Tạo Đơn Hàng Mới";

  const statusField = document.getElementById("orderStatus");
  statusField.value = "Đang chờ";
  statusField.disabled = true;

  document.getElementById("product-selection-area").classList.remove("d-none");
  document.getElementById("btnOrderSubmit").innerText = "Xác nhận tạo đơn";

  renderProductCheckboxes();
  new bootstrap.Modal(document.getElementById("orderModal")).show();
};

const renderProductCheckboxes = () => {
  const container = document.getElementById("product-checkbox-list");
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
            <span class="text-warning me-3">${p.price.toLocaleString()}đ</span>
            <div class="d-flex align-items-center bg-dark rounded border border-secondary">
                <button type="button" class="btn btn-sm text-white px-2" onclick="updateQty('${docSnap.id}', -1)">-</button>
                <span id="qty-${docSnap.id}" class="px-2 fw-bold text-white" style="min-width: 30px; text-align: center;">1</span>
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

window.updateQty = (id, change) => {
  const qtyElement = document.getElementById(`qty-${id}`);
  let currentQty = parseInt(qtyElement.innerText) + change;
  qtyElement.innerText = currentQty < 1 ? 1 : currentQty;
  calculateOrderTotal();
};

const calculateOrderTotal = () => {
  let total = 0;
  document.querySelectorAll(".product-select:checked").forEach((chk) => {
    const id = chk.id.replace("chk-", "");
    const qty = parseInt(document.getElementById(`qty-${id}`).innerText);
    total += Number(chk.value) * qty;
  });
  if (document.getElementById("orderTotal"))
    document.getElementById("orderTotal").value = total;
};

// --- Xem Chi Tiết & Lưu Đơn Hàng ---
window.viewOrderDetail = async (id) => {
  const docSnap = await dbService.getOrderById(id);
  if (docSnap.exists()) {
    const o = docSnap.data();
    document.getElementById("currentOrderId").value = id;
    document.getElementById("orderCustomer").value = o.customerName;
    document.getElementById("orderTotal").value = o.total;

    const statusField = document.getElementById("orderStatus");
    statusField.value = o.status;
    statusField.disabled = false;

    document.getElementById("orderModalTitle").innerText = "Chi tiết hóa đơn";
    document.getElementById("btnOrderSubmit").innerText = "Cập nhật trạng thái";

    const container = document.getElementById("product-checkbox-list");
    document
      .getElementById("product-selection-area")
      .classList.remove("d-none");

    container.innerHTML = `<div class="d-flex justify-content-between text-warning mb-2 border-bottom border-secondary pb-1"><span>Món đã đặt</span><span>Số lượng</span></div>`;
    const orderItems = o.items || o.products;
    if (orderItems && orderItems.length > 0) {
      orderItems.forEach((item) => {
        const name = typeof item === "object" ? item.name : item;
        const qty = typeof item === "object" ? item.quantity : 1;
        container.innerHTML += `<div class="text-white border-bottom border-dark py-2 d-flex justify-content-between align-items-center"><span>• ${name}</span><span class="badge bg-primary fs-6">${qty}</span></div>`;
      });
    } else {
      container.innerHTML += `<div class="text-muted text-center">Không có dữ liệu</div>`;
    }
    new bootstrap.Modal(document.getElementById("orderModal")).show();
  }
};

document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("currentOrderId").value;
  try {
    if (id) {
      await dbService.updateOrderStatus(
        id,
        document.getElementById("orderStatus").value,
      );
      alert("Cập nhật trạng thái thành công!");
    } else {
      const items = [];
      document.querySelectorAll(".product-select:checked").forEach((chk) => {
        const qty = parseInt(
          document.getElementById(`qty-${chk.id.replace("chk-", "")}`)
            .innerText,
        );
        items.push({
          name: chk.getAttribute("data-name"),
          quantity: qty,
          price: Number(chk.value),
        });
      });
      if (items.length === 0) return alert("Vui lòng chọn món!");

      await dbService.createOrder({
        customerName: document.getElementById("orderCustomer").value,
        items,
        total: Number(document.getElementById("orderTotal").value),
      });
      alert("Tạo đơn hàng thành công!");
    }
    bootstrap.Modal.getInstance(document.getElementById("orderModal")).hide();
  } catch (error) {
    alert("Lỗi: " + error.message);
  }
});

// ================= QUẢN LÝ KHÁCH HÀNG =================

const loadCustomers = () => {
  dbService.subscribeCustomers((snapshot) => {
    const list = document.getElementById("customer-list-render");
    if (!list) return;
    list.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const u = docSnap.data();
      list.innerHTML += `
        <tr>
          <td>${u.displayName || "N/A"}</td>
          <td>${u.email}</td>
          <td><span class="badge bg-info">${u.role}</span></td>
          <td>${u.createdAt?.toDate().toLocaleDateString("vi-VN") || "N/A"}</td>
        </tr>`;
    });
  });
};
