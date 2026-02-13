import { UI_TEXTS } from "../config/constants.js";

const DEFAULT_LOADING_HTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>${UI_TEXTS.loading}`;

export const startButtonLoading = (
  button,
  loadingHtml = DEFAULT_LOADING_HTML,
) => {
  if (!button) return null;
  const originalHtml = button.innerHTML;
  button.disabled = true;
  button.innerHTML = loadingHtml;
  return originalHtml;
};

export const stopButtonLoading = (button, originalHtml) => {
  if (!button) return;
  button.disabled = false;
  button.innerHTML = originalHtml ?? button.innerHTML;
};
