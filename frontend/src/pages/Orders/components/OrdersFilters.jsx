import { memo } from "react";

const OrdersFilters = memo(function OrdersFilters({ role, filters, activeFilter, ordersCount, onFilterChange }) {
  if (role === "ADMIN") {
    return null;
  }

  return (
    <div className="ord-filters">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`ord-filter-btn ${activeFilter === filter ? "ord-filter-btn--active" : ""}`}
          onClick={() => onFilterChange(filter)}
        >
          {filter === "ALL" ? `All (${ordersCount})` : filter}
        </button>
      ))}
    </div>
  );
});

export default OrdersFilters;
