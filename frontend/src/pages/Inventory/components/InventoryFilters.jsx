import React from "react";
import "./InventoryFilters.css";

/**
 * Filter component for inventory search, price range, and sorting
 */
function InventoryFilters({
  search,
  onSearchChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sortBy,
  onSortChange,
  inStockOnly,
  onInStockToggle,
}) {
  return (
    <div className="inv-search-filters-wrapper">
      {/* Search */}
      <div className="inv-search">
        <span className="inv-search__icon">🔍</span>
        <input
          className="inv-search__input"
          placeholder="Search products..."
          value={search}
          onChange={onSearchChange}
        />
      </div>

      {/* Filters */}
      <div className="inv-filters">
        <div className="inv-filter-group">
          <label className="inv-filter-label">Min Price</label>
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={onMinPriceChange}
            className="inv-filter-input"
            placeholder="0"
          />
        </div>

        <div className="inv-filter-group">
          <label className="inv-filter-label">Max Price</label>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={onMaxPriceChange}
            className="inv-filter-input"
            placeholder="5000"
          />
        </div>

        <div className="inv-filter-group">
          <label className="inv-filter-label">Sort By</label>
          <select value={sortBy} onChange={onSortChange} className="inv-filter-select">
            <option value="DEFAULT">Default</option>
            <option value="PRICE_LOW_HIGH">Price: Low to High</option>
            <option value="PRICE_HIGH_LOW">Price: High to Low</option>
          </select>
        </div>

        <label className="inv-filter-check">
          <input type="checkbox" checked={inStockOnly} onChange={onInStockToggle} />
          In Stock Only
        </label>
      </div>
    </div>
  );
}

export default InventoryFilters;
