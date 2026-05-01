import React from "react";
import { SkeletonRow } from "../utils/inventoryUtils";
import { stockStatus } from "../utils/inventoryUtils";
import "./InventoryTable.css";

/**
 * Admin table view for managing inventory
 */
function InventoryTable({
  products,
  filtered,
  visibleProducts,
  loading,
  onIncreaseStock,
  onReduceStock,
  onEditProduct,
  onDeleteProduct,
}) {
  const rowActions = (p) => [
    {
      emoji: "➕",
      title: "Increase stock",
      action: () => onIncreaseStock(p.id, p.name),
    },
    {
      emoji: "➖",
      title: "Reduce stock",
      action: () => onReduceStock(p.id, p.name),
    },
    {
      emoji: "✏️",
      title: "Edit product",
      action: () => onEditProduct(p),
    },
    {
      emoji: "🗑",
      title: "Delete product",
      action: () => onDeleteProduct(p.id, p.name),
    },
  ];

  return (
    <div className="inv-table-wrap">
      <table className="inv-table">
        <thead>
          <tr>
            {["Product Name", "Price", "Stock Status", "Actions"].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => <SkeletonRow key={i} />)
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan={4}>
                <div className="inv-empty">
                  <div className="inv-empty__icon">📭</div>
                  <div className="inv-empty__title">No products found</div>
                  <div className="inv-empty__sub">Add your first product below</div>
                </div>
              </td>
            </tr>
          ) : (
            visibleProducts.map((p, i) => {
              const { label, cls } = stockStatus(p.quantity);
              return (
                <tr
                  key={p.id}
                  className="inv-row"
                  style={{
                    borderBottom:
                      i < filtered.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  {/* Name */}
                  <td>
                    <div className="inv-product-cell">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "22px",
                            background: "rgba(255,255,255,0.05)",
                            borderRadius: "6px",
                          }}
                        >
                          📦
                        </div>
                      )}
                      <div>
                        <div className="inv-product-name">{p.name}</div>
                        <div className="inv-product-id">ID #{p.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td>
                    <span className="inv-price">
                      ₹{Number(p.price).toLocaleString()}
                    </span>
                  </td>

                  {/* Stock */}
                  <td>
                    <div className="inv-stock-cell">
                      <span className={`inv-stock-badge ${cls}`}>{label}</span>
                      <span className="inv-stock-qty">
                        Qty: <b>{p.quantity}</b>
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="inv-actions">
                      {rowActions(p).map(({ emoji, title, action }) => (
                        <button
                          key={title}
                          className="icon-btn"
                          onClick={action}
                          title={title}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTable;
