import * as dbService from "../services/index.js";
import { formatFirestoreDateTime } from "../utils/date.js";
import { formatPrice } from "../utils/number.js";
import { startButtonLoading, stopButtonLoading } from "../utils/ui.js";

const productForm = document.getElementById("productForm");
const imgFileInput = document.getElementById("pImgFile");
const imgUrlInput = document.getElementById("pImgUrl");
const imgPreview = document.getElementById("pImgPreview");
const imgError = document.getElementById("pImgError");

let currentObjectUrl = null;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const setImageError = (message) => {
  if (!imgError || !imgFileInput) return;
  imgError.textContent = message || "";
  imgError.classList.toggle("d-none", !message);
  imgFileInput.classList.toggle("is-invalid", Boolean(message));
};

const clearImageSelection = () => {
  if (imgFileInput) imgFileInput.value = "";
  if (imgPreview) {
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

  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }

  imgPreview.src = url || "";
  imgPreview.classList.toggle("d-none", !url);
};

const renderPreviewFromFile = (file) => {
  if (!imgPreview) return;

  if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);

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
    setImageError(
      "Không thể hiển thị ảnh đã chọn. Vui lòng thử lại với một ảnh khác.",
    );
  };
};

const bindImageInput = () => {
  if (!imgFileInput) return;

  imgFileInput.addEventListener("change", () => {
    const file = imgFileInput.files?.[0];
    if (!file) {
      setImageError("");
      renderPreviewFromUrl(imgUrlInput?.value || "");
      return;
    }

    const validation = validateImageFile(file);
    if (!validation.ok) {
      clearImageSelection();
      setImageError(validation.message);
      return;
    }

    setImageError("");
    renderPreviewFromFile(file);
  });
};

const bindProductForm = () => {
  if (!productForm) return;

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = productForm.querySelector('[type="submit"]');
    const originalHtml = startButtonLoading(submitBtn);

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
      const data = { name, price, imageUrl };

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
      stopButtonLoading(submitBtn, originalHtml);
    }
  });
};

const loadProducts = () => {
  dbService.subscribeProducts((snapshot) => {
    const list = document.getElementById("product-list-render");
    const statProducts = document.getElementById("stat-products");

    if (statProducts) statProducts.innerText = snapshot.size;
    if (!list) return;

    list.textContent = "";

    snapshot.forEach((docSnap) => {
      const p = docSnap.data();
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td><img width="40" height="40" class="rounded" style="object-fit:cover" alt="${p?.name || "product"}" src="${p?.imageUrl || ""}" /></td>
        <td>${p?.name || ""}</td>
        <td>${formatPrice(p?.price)}</td>
        <td>${formatFirestoreDateTime(p?.createdAt)}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2 js-edit-product"><i class="fas fa-edit"></i></button>
          <button class="btn btn-sm btn-danger js-delete-product"><i class="fas fa-trash"></i></button>
        </td>
      `;

      tr.querySelector("img").onerror = (e) => {
        e.target.onerror = null;
        e.target.src = "";
      };

      tr.querySelector(".js-edit-product").addEventListener("click", () =>
        window.editProduct(
          docSnap.id,
          p?.name || "",
          Number(p?.price ?? 0),
          p?.imageUrl || "",
        ),
      );
      tr.querySelector(".js-delete-product").addEventListener("click", () =>
        window.deleteProduct(docSnap.id),
      );

      list.appendChild(tr);
    });
  });
};

const registerWindowActions = () => {
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
    if (!confirm("Bạn có chắc muốn xóa món này?")) return;
    try {
      await dbService.deleteProductById(id);
    } catch (error) {
      alert("Lỗi khi xóa: " + error.message);
    }
  };
};

export const initProductsModule = () => {
  loadProducts();
  bindImageInput();
  bindProductForm();
  registerWindowActions();
};
