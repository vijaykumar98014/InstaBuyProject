const STATUS_CLASS = {
  CONFIRMED: "ord-status-badge--confirmed",
  CREATED: "ord-status-badge--created",
  CANCELLED: "ord-status-badge--cancelled",
  SHIPPED: "ord-status-badge--shipped",
  DELIVERED: "ord-status-badge--delivered",
};

const STATUS_ICON = {
  CONFIRMED: "✅",
  CREATED: "🕐",
  CANCELLED: "❌",
  SHIPPED: "🚚",
  DELIVERED: "📦",
};

export function statusClass(status) {
  return STATUS_CLASS[status?.toUpperCase()] || "ord-status-badge--default";
}

export function statusIcon(status) {
  return STATUS_ICON[status?.toUpperCase()] || "📋";
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
