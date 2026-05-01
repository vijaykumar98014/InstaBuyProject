export function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}

export function calculateCartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
