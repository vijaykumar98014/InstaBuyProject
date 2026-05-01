import { memo } from "react";

const OrdersSummary = memo(function OrdersSummary({ role, selectedUserData, summaryCards }) {
  if (role === "ADMIN" && !selectedUserData) {
    return null;
  }

  return (
    <div className="ord-summary-row">
      {summaryCards.map(({ label, value, icon, bg, color }) => (
        <div key={label} className="ord-summary-card">
          <div className="ord-summary-card__icon" style={{ background: bg }}>{icon}</div>
          <div>
            <div className="ord-summary-card__value" style={{ color }}>{value}</div>
            <div className="ord-summary-card__label">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default OrdersSummary;
