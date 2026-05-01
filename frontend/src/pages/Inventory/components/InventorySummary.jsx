import React, { useMemo } from "react";
import "./InventorySummary.css";

/**
 * Summary cards showing inventory statistics
 */
function InventorySummary({ products }) {
  const summaryCards = useMemo(
    () => [
      {
        label: "Total Products",
        value: products.length,
        icon: "📦",
        color: "#6c63ff",
      },
      {
        label: "In Stock",
        value: products.filter((p) => p.quantity > 5).length,
        icon: "✅",
        color: "#43e97b",
      },
      {
        label: "Low Stock",
        value: products.filter((p) => p.quantity > 0 && p.quantity <= 5).length,
        icon: "⚠️",
        color: "#f5c842",
      },
      {
        label: "Out of Stock",
        value: products.filter((p) => p.quantity <= 0).length,
        icon: "❌",
        color: "#ff4d6d",
      },
    ],
    [products]
  );

  return (
    <div className="inv-summary">
      {summaryCards.map(({ label, value, icon, color }) => (
        <div key={label} className="inv-summary__card">
          <span className="inv-summary__icon">{icon}</span>
          <div>
            <div className="inv-summary__value" style={{ color }}>
              {value}
            </div>
            <div className="inv-summary__label">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default InventorySummary;
