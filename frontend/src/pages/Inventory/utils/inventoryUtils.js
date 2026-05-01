import React from "react";

// Stock Status Helper
export function stockStatus(qty) {
  if (qty <= 0) return { label: "Out of Stock", cls: "inv-stock-badge--out" };
  if (qty <= 5) return { label: "Low Stock", cls: "inv-stock-badge--low" };
  return { label: "In Stock", cls: "inv-stock-badge--in" };
}

// Skeleton Row Component
export const SkeletonRow = React.memo(function SkeletonRow() {
  return (
    <tr>
      {[1, 2, 3, 4].map((i) => (
        <td key={i} style={{ padding: "18px 20px" }}>
          <div
            className="skeleton-cell"
            style={{ width: i === 3 ? "60px" : "100%" }}
          />
        </td>
      ))}
    </tr>
  );
});

// Product Card Skeleton Component
export const ProductCardSkeleton = React.memo(function ProductCardSkeleton() {
  return (
    <div className="inv-card-skeleton">
      <div className="inv-card-skeleton__media" />
      <div className="inv-card-skeleton__line inv-card-skeleton__line--title" />
      <div className="inv-card-skeleton__line" />
      <div className="inv-card-skeleton__footer">
        <div className="inv-card-skeleton__price" />
        <div className="inv-card-skeleton__button" />
      </div>
    </div>
  );
});
