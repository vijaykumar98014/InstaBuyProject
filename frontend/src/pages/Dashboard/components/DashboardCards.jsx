import { memo } from "react";

const DashboardCards = memo(function DashboardCards({ cards, loading }) {
  return (
    <div className="dash-cards">
      {cards.map((card) => (
        <div key={card.label} className="dash-card">
          <div className="dash-card__icon" style={{ color: card.color }}>
            {card.icon}
          </div>
          <div className="dash-card__body">
            <div className="dash-card__label">{card.label}</div>
            <div className="dash-card__value">
              {loading ? "—" : card.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default DashboardCards;
