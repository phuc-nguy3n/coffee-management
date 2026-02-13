import { UI_TEXTS } from "../config/constants.js";

export const formatFirestoreDate = (
  value,
  locale = "vi-VN",
  fallback = "N/A",
) => {
  return value && typeof value.toDate === "function"
    ? value.toDate().toLocaleDateString(locale)
    : fallback;
};

export const formatFirestoreDateTime = (
  value,
  locale = "vi-VN",
  fallback = UI_TEXTS.loading,
) => {
  return value && typeof value.toDate === "function"
    ? value.toDate().toLocaleString(locale)
    : fallback;
};
