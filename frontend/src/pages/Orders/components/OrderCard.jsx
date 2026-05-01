import { memo, useEffect, useState } from "react";
import Invoice from "../../../components/Invoice/Invoice";
import { formatDate, statusClass, statusIcon } from "../utils/orderUtils";

const OrderCard = memo(function OrderCard({
  order,
  role,
  onCancel,
  onStatusUpdate,
  onEditOpen,
  onRefund,
  index,
}) {
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(order.orderStatus || "CREATED");

  useEffect(() => {
    setNewStatus(order.orderStatus || "CREATED");
  }, [order.orderStatus]);

  const items = order.items || [];
  const isCancelled = order.orderStatus?.toUpperCase() === "CANCELLED";
  const canAct = !isCancelled;

  return (
    <div className="ord-card" style={{ animationDelay: `${index * 0.06}s` }}>
      <div className="ord-card__header" onClick={() => setOpen((o) => !o)}>
        <div className="ord-card__header-left">
          <div className="ord-card__icon">{statusIcon(order.orderStatus)}</div>
          <div>
            <div className="ord-card__id">Order #{order.orderId}</div>
            <div className="ord-card__date">{formatDate(order.orderDate)}</div>
          </div>
        </div>

        <div className="ord-card__header-right">
          <span className={`ord-status-badge ${statusClass(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
          <span className="ord-card__total">
            ₹{Number(order.totalAmount || 0).toLocaleString()}
          </span>
          <span className={`ord-card__chevron ${open ? "ord-card__chevron--open" : ""}`}>▼</span>
        </div>
      </div>

      <div className={`ord-card__body ${open ? "ord-card__body--open" : ""}`}>
        {items.length > 0 && (
          <>
            <div className="ord-items-title">Items in this order</div>
            {items.map((item, i) => (
              <div key={item.orderItemId || item.productId || i} className="ord-item-row">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="ord-item-row__icon"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  <div className="ord-item-row__icon">📦</div>
                )}
                <div style={{ flex: 1 }}>
                  <div className="ord-item-row__name">
                    {item.productName || `Product #${item.productId}`}
                  </div>
                  <div className="ord-item-row__meta">
                    Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}
                  </div>
                </div>
                <div className="ord-item-row__price">
                  ₹{Number(item.totalPrice || item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </>
        )}

        <div className="ord-card__footer">
          <div className="ord-card__footer-info">
            {order.shippingAddress && <div>📍 <span>{order.shippingAddress}</span></div>}
            {order.phone && <div>📞 <span>{order.phone}</span></div>}
            {order.paymentStatus && (<div>💳 Payment: <span>{order.paymentStatus || "—"}</span></div>)}
          </div>

          <div className="ord-card__actions">
            {role !== "ADMIN" && canAct && (
              <>
                {(order.orderStatus === "CONFIRMED" || order.orderStatus === "SHIPPED") && (
                  <button
                    className="ord-edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditOpen(order);
                    }}
                  >
                    ✏️ Edit Details
                  </button>
                )}

                {items.length > 0 && order.orderStatus === "CONFIRMED" && (
                  <button
                    className="ord-cancel-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel(order.orderId);
                    }}
                  >
                    ✕ Cancel Order
                  </button>
                )}

                <div onClick={(e) => e.stopPropagation()}>
                  <Invoice order={order} />
                </div>
              </>
            )}

            {role === "ADMIN" && (
              <>
                <select
                  className="ord-status-select"
                  value={newStatus}
                  disabled={order.orderStatus === "CANCELLED"}
                  onChange={(e) => setNewStatus(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                >
                  {["CREATED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>

                <button
                  className="ord-status-update-btn"
                  disabled={order.orderStatus === "CANCELLED"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusUpdate(order.orderId, newStatus);
                  }}
                >
                  Update
                </button>

                {order.orderStatus?.toUpperCase() === "CANCELLED" &&
                  order.paymentStatus &&
                  order.paymentStatus?.toUpperCase() !== "REFUNDED" && (
                    <button
                      className="ord-refund-btn"
                      onClick={(e) => {
                        onRefund(order.orderId);
                        e.stopPropagation();
                      }}
                    >
                      💸 Refund
                    </button>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default OrderCard;
