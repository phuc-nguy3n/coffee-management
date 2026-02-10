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

    // Clear safely
    list.textContent = "";

    snapshot.forEach((docSnap) => {
      const p = docSnap.data();
      const tr = document.createElement("tr");

      // Image cell
      const tdImg = document.createElement("td");
      const img = document.createElement("img");
      img.width = 40;
      img.height = 40;
      img.className = "rounded";
      img.style.objectFit = "cover";
      img.alt = p?.name || "product";
      img.src = p?.imageUrl || "";
      img.onerror = () => {
        img.onerror = null;
        img.src = "";
      };
      tdImg.appendChild(img);

      // Name
      const tdName = document.createElement("td");
      tdName.textContent = p?.name || "";

      // Price
      const tdPrice = document.createElement("td");
      const price = Number(p?.price ?? 0);
      tdPrice.textContent = `${price.toLocaleString()}đ`;

      // Time
      const tdTime = document.createElement("td");
      const timeString =
        p?.createdAt && typeof p.createdAt.toDate === "function"
          ? p.createdAt.toDate().toLocaleString("vi-VN")
          : "Đang xử lý...";
      tdTime.textContent = timeString;

      // Actions
      const tdActions = document.createElement("td");

      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-sm btn-warning me-2";
      const editIcon = document.createElement("i");
      editIcon.className = "fas fa-edit";
      editBtn.appendChild(editIcon);
      editBtn.addEventListener("click", () =>
        window.editProduct(
          docSnap.id,
          p?.name || "",
          Number(p?.price ?? 0),
          p?.imageUrl || "",
        ),
      );

      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-sm btn-danger";
      const delIcon = document.createElement("i");
      delIcon.className = "fas fa-trash";
      delBtn.appendChild(delIcon);
      delBtn.addEventListener("click", () => window.deleteProduct(docSnap.id));

      tdActions.appendChild(editBtn);
      tdActions.appendChild(delBtn);

      tr.appendChild(tdImg);
      tr.appendChild(tdName);
      tr.appendChild(tdPrice);
      tr.appendChild(tdTime);
      tr.appendChild(tdActions);

      list.appendChild(tr);
    });
  });
};

// --- Xử lý Form Thêm/Sửa sản phẩm ---
const productForm = document.getElementById("productForm");
const imgFileInput = document.getElementById("pImgFile");
const imgUrlInput = document.getElementById("pImgUrl");
const imgPreview = document.getElementById("pImgPreview");
const imgError = document.getElementById("pImgError");

// Track current object URL to prevent memory leaks when updating previews
let currentObjectUrl = null;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const setImageError = (message) => {
  if (!imgError || !imgFileInput) return;
  if (message) {
    imgError.textContent = message;
    imgError.classList.remove("d-none");
    imgFileInput.classList.add("is-invalid");
  } else {
    imgError.textContent = "";
    imgError.classList.add("d-none");
    imgFileInput.classList.remove("is-invalid");
  }
};

const clearImageSelection = () => {
  if (imgFileInput) imgFileInput.value = "";
  if (imgPreview) {
    // Revoke any existing object URL when clearing selection
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }
    imgPreview.src = "";
    imgPreview.classList.add("d-none");
  }
  setImageError("");
};

const validateImageFile = (file) => {
  if (!file) return { ok: false, message: "Vui lòng chọn ảnh sản phẩm!" };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      ok: false,
      message:
        "Định dạng ảnh không hợp lệ. Vui lòng chọn ảnh JPG, PNG hoặc WEBP.",
    };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      message: "Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.",
    };
  }
  return { ok: true };
};

const renderPreviewFromUrl = (url) => {
  if (!imgPreview) return;
  // If switching to a normal URL, ensure any previous object URL is revoked
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
  if (url) {
    imgPreview.src = url;
    imgPreview.classList.remove("d-none");
  } else {
    imgPreview.src = "";
    imgPreview.classList.add("d-none");
  }
};

const renderPreviewFromFile = (file) => {
  if (!imgPreview) return;
  // Revoke previous object URL before creating a new one
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
  }
  currentObjectUrl = URL.createObjectURL(file);
  imgPreview.src = currentObjectUrl;
  imgPreview.classList.remove("d-none");
  imgPreview.onerror = () => {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }
    imgPreview.src = "";
    imgPreview.classList.add("d-none");
    setImageError("Khong the hien thi anh.");
  };
};

if (imgFileInput) {
  imgFileInput.addEventListener("change", () => {
    const file = imgFileInput.files?.[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.ok) {
        clearImageSelection();
        setImageError(validation.message);
        return;
      }
      setImageError("");
      renderPreviewFromFile(file);
    } else {
      setImageError("");
      renderPreviewFromUrl(imgUrlInput?.value || "");
    }
  });
}

if (productForm) {
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = productForm.querySelector('[type="submit"]');
    const originalHtml = submitBtn ? submitBtn.innerHTML : null;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Đang xử lý...';
    }

    try {
      const id = document.getElementById("productId").value;
      const name = document.getElementById("pName").value;
      const price = Number(document.getElementById("pPrice").value);

      let imageUrl = imgUrlInput?.value || "";
      const file = imgFileInput?.files?.[0];

      if (file) {
        const validation = validateImageFile(file);
        if (!validation.ok) {
          clearImageSelection();
          setImageError(validation.message);
          return;
        }

        const uploadResult = await dbService.uploadImageToServer(file);
        if (!uploadResult?.url) {
          setImageError(
            uploadResult?.errorMessage ||
              "Không thể tải ảnh lên server. Vui lòng thử lại.",
          );
          return;
        }
        imageUrl = uploadResult.url;
      } else if (!imageUrl) {
        setImageError("Vui lòng chọn ảnh sản phẩm!");
        return;
      }

      setImageError("");
      const data = {
        name,
        price,
        imageUrl,
      };

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
      renderPreviewFromUrl("");
      setImageError("");
      if (imgFileInput) imgFileInput.required = true;
      if (imgUrlInput) imgUrlInput.value = "";
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml ?? submitBtn.innerHTML;
      }
    }
  });
}

window.openAddModal = () => {
  productForm.reset();
  document.getElementById("productId").value = "";
  document.getElementById("modalTitle").innerText = "Thêm Sản Phẩm Mới";
  if (imgFileInput) {
    imgFileInput.value = "";
    imgFileInput.required = true;
  }
  if (imgUrlInput) imgUrlInput.value = "";
  renderPreviewFromUrl("");
  setImageError("");
  new bootstrap.Modal(document.getElementById("productModal")).show();
};

window.editProduct = (id, name, price, img) => {
  document.getElementById("productId").value = id;
  document.getElementById("pName").value = name;
  document.getElementById("pPrice").value = price;
  if (imgUrlInput) imgUrlInput.value = img || "";
  if (imgFileInput) {
    imgFileInput.value = "";
    imgFileInput.required = false;
  }
  renderPreviewFromUrl(img || "");
  setImageError("");
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

    list.textContent = "";

    snapshot.forEach((docSnap) => {
      const o = docSnap.data();
      const tr = document.createElement("tr");

      const tdId = document.createElement("td");
      tdId.textContent = `#${docSnap.id.slice(0, 5)}`;

      const tdCustomer = document.createElement("td");
      tdCustomer.textContent = o?.customerName || "Khách tại quầy";

      const tdTotal = document.createElement("td");
      tdTotal.textContent = `${Number(o?.total ?? 0).toLocaleString()}đ`;

      const tdStatus = document.createElement("td");
      const badge = document.createElement("span");
      const status = o?.status || "";
      badge.className = `badge ${status === "Hoàn thành" ? "bg-success" : "bg-warning"}`;
      badge.textContent = status;
      tdStatus.appendChild(badge);

      const tdTime = document.createElement("td");
      const timeString =
        o?.createdAt && typeof o.createdAt.toDate === "function"
          ? o.createdAt.toDate().toLocaleString("vi-VN")
          : "Đang xử lý...";
      tdTime.textContent = timeString;

      const tdAction = document.createElement("td");
      const btn = document.createElement("button");
      btn.className = "btn btn-sm btn-primary";
      btn.textContent = "Chi tiết";
      btn.addEventListener("click", () => window.viewOrderDetail(docSnap.id));
      tdAction.appendChild(btn);

      tr.appendChild(tdId);
      tr.appendChild(tdCustomer);
      tr.appendChild(tdTotal);
      tr.appendChild(tdStatus);
      tr.appendChild(tdTime);
      tr.appendChild(tdAction);

      list.appendChild(tr);
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
  if (enforceMin) {
    qtyElement.value = !Number.isFinite(parsed) || parsed < 1 ? 1 : parsed;
  }
  calculateOrderTotal();
};

const calculateOrderTotal = () => {
  let total = 0;
  document.querySelectorAll(".product-select:checked").forEach((chk) => {
    const id = chk.id.replace("chk-", "");
    const qty = parseInt(document.getElementById(`qty-${id}`).value || "0");
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

const orderFormEl = document.getElementById("orderForm");
orderFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById("btnOrderSubmit") || orderFormEl.querySelector('[type="submit"]');
  const originalHtml = submitBtn ? submitBtn.innerHTML : null;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Đang xử lý...';
  }

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
          document.getElementById(`qty-${chk.id.replace("chk-", "")}`).value ||
            "1",
        );
        items.push({
          name: chk.getAttribute("data-name"),
          quantity: qty,
          price: Number(chk.value),
        });
      });
      if (items.length === 0) {
        alert("Vui lòng chọn món!");
        return;
      }

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
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml ?? submitBtn.innerHTML;
    }
  }
});

// ================= QUẢN LÝ KHÁCH HÀNG =================

const loadCustomers = () => {
  dbService.subscribeCustomers((snapshot) => {
    const list = document.getElementById("customer-list-render");
    if (!list) return;

    list.textContent = "";
    snapshot.forEach((docSnap) => {
      const u = docSnap.data();
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.textContent = u?.displayName || "N/A";

      const tdEmail = document.createElement("td");
      tdEmail.textContent = u?.email || "";

      const tdRole = document.createElement("td");
      const roleBadge = document.createElement("span");
      roleBadge.className = "badge bg-info";
      roleBadge.textContent = u?.role || "";
      tdRole.appendChild(roleBadge);

      const tdCreated = document.createElement("td");
      const createdText =
        u?.createdAt && typeof u.createdAt.toDate === "function"
          ? u.createdAt.toDate().toLocaleDateString("vi-VN")
          : "N/A";
      tdCreated.textContent = createdText;

      tr.appendChild(tdName);
      tr.appendChild(tdEmail);
      tr.appendChild(tdRole);
      tr.appendChild(tdCreated);

      list.appendChild(tr);
    });
  });
};
