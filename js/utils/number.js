export const formatPrice = (value, suffix = "đ", locale) => {
  const formatted = Number(value ?? 0).toLocaleString(locale);
  return `${formatted}${suffix}`;
};
