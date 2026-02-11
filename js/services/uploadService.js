// Upload Service Module
import { API_ENDPOINTS, MESSAGES } from "../config/constants.js";

//  ================= DỊCH VỤ TẢI FILE NÀY MÁY TÍNH LÊN MÁY CHỦ =================
export const uploadImageToServer = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(API_ENDPOINTS.uploadImage, {
      method: "POST",
      body: formData,
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        url: null,
        errorMessage: result?.message || MESSAGES.uploadFailed,
      };
    }

    if (!result?.url) {
      return {
        url: null,
        errorMessage: MESSAGES.invalidImageUrl,
      };
    }

    return { url: result.url, errorMessage: null }; // Trả về URL ảnh nếu thành công
  } catch (error) {
    console.error("Lỗi upload:", error);
    return {
      url: null,
      errorMessage: MESSAGES.uploadError,
    };
  }
};
