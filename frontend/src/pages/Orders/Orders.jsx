import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderAPI, userAPI } from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";
import Invoice from "../../components/Invoice/Invoice";
import { toast } from "react-toastify";
import "./Orders.css";

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

function statusClass(s) {
  return STATUS_CLASS[s?.toUpperCase()] || "ord-status-badge--default";
}

function statusIcon(s) {
  return STATUS_ICON[s?.toUpperCase()] || "📋";
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ConfirmModal({ orderId, onConfirm, onCancel }) {
  return (
    <div className="ord-modal-overlay">
      <div className="ord-modal-box">
        <div className="ord-modal-box__icon">🗑</div>
        <h3 className="ord-modal-box__title">Cancel Order?</h3>
        <p className="ord-modal-box__msg">
          Are you sure you want to cancel this order?
          <br />
          Stock will be restored automatically.
        </p>
        <div className="ord-modal-box__btns">
          <button className="ord-modal-box__keep" onClick={onCancel}>Keep Order</button>
          <button className="ord-modal-box__cancel" onClick={onConfirm}>Yes, Cancel</button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ order, onSave, onCancel }) {
  const [address, setAddress] = useState(order.shippingAddress || "");
  const [phone, setPhone] = useState(order.phone || "");

  return (
    <div className="ord-modal-overlay">
      <div className="ord-modal-box ord-modal-box--wide">
        <div className="ord-modal-box__icon">✏️</div>
        <h3 className="ord-modal-box__title">Update Delivery Details</h3>
        <p className="ord-modal-box__msg">Order #{order.orderId}</p>

        <div className="ord-edit-fields">
          <div className="ord-edit-field">
            <label className="ord-edit-label">Shipping Address</label>
            <input
              className="ord-edit-input"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full address..."
            />
          </div>
          <div className="ord-edit-field">
            <label className="ord-edit-label">Phone Number</label>
            <input
              className="ord-edit-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
            />
          </div>
        </div>

        <div className="ord-modal-box__btns">
          <button className="ord-modal-box__keep" onClick={onCancel}>Cancel</button>
          <button
            className="ord-modal-box__save"
            onClick={() => onSave(order.orderId, address, phone)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, role, onCancel, onStatusUpdate, onEditOpen, onRefund, index }) {
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(order.orderStatus || "CREATED");

  useEffect(() => {
    setNewStatus(order.orderStatus || "CREATED");
  }, [order.orderStatus]);

  const items = order.items || [];
  console.log("ORDER ITEMS:", items);
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
        {items.length >= 0 && (
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
                      borderRadius: "8px"
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
            {order.paymentStatus && (<div>💳 Pyment:  <span>{order.paymentStatus || "—"}</span></div>)}
          </div>

          <div className="ord-card__actions">
            {role !== "ADMIN" && canAct && (
              <>
                {(order.orderStatus === "CONFIRMED" || order.orderStatus === "SHIPPED") && (
                  <button
                    className="ord-edit-btn"
                    onClick={(e) => { e.stopPropagation(); onEditOpen(order); }}
                  >
                    ✏️ Edit Details
                  </button>
                )}

                {items.length >= 0 && order.orderStatus === "CONFIRMED" && (
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
                  {["CREATED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <button
                  className="ord-status-update-btn"
                  disabled={order.orderStatus === "CANCELLED"}
                  onClick={(e) => {
                    e.stopPropagation();

                    if (newStatus === "CANCELLED") {
                      onCancel(order.orderId);
                    } else {
                      onStatusUpdate(order.orderId, newStatus);
                    }
                  }}
                >
                  Update
                </button>

                {order.orderStatus?.toUpperCase() === "CANCELLED" &&
                  order.paymentStatus?.toUpperCase() === "PENDING" && (
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
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [usersOrders, setUsersOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userNames, setUserNames] = useState({});

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let res;

      if (role === "ADMIN") {
        res = await orderAPI.get("/api/order-items/admin/grouped");
        const groupedOrders = res.data || [];
        setUsersOrders(groupedOrders);

        // 👇 NEW CODE
        const names = {};
        for (let u of groupedOrders) {
          try {
            const userRes = await userAPI.get(`/api/users/${u.userId}`);
            names[u.userId] = userRes.data.name; // ya username
          } catch {
            names[u.userId] = "Unknown User";
          }
        }
        setUserNames(names);

        if (selectedUser) {
          const refreshedUser = groupedOrders.find((u) => u.userId === selectedUser.userId);
          if (refreshedUser) {
            setSelectedUser(refreshedUser);
            setOrders(refreshedUser.orders || []);
          } else {
            setSelectedUser(null);
            setOrders([]);
          }
        } else {
          setOrders([]);
        }
      } else {
        res = await orderAPI.get(`/api/order-items/user/${userId}`);
        setOrders(res.data || []);
      }
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await orderAPI.post(`/api/order-items/cancel/${orderId}`);
      toast.success("Order cancelled successfully");
      setTimeout(() => {
        setConfirm(null);
      }, 1000);

      fetchOrders();
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  const updateDetails = async (orderId, address, phone) => {
    if (!address.trim()) {
      toast.error("Address is required");
      return;
    }
    if (!phone) {
      toast.error("Phone is required");
      return;
    }
    try {
      await orderAPI.put(
        `/api/order-items/update/${orderId}?address=${encodeURIComponent(address)}&phone=${phone}`
      );
      toast.info("Delivery details updated ✓");
      setEditOrder(null);
      fetchOrders();
    } catch {
      toast.error("Failed to update details");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await orderAPI.put(`/api/order-items/status/${orderId}?status=${status}`);
      toast.info(`Order #${orderId} → ${status}`);
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const refundOrder = async (orderId) => {
    try {
      await orderAPI.post(`/api/order-items/refund/${orderId}`);
      const userRes = await userAPI.get(`/api/users/${userId}`);
      localStorage.setItem("wallet", userRes.data.wallet);

      const updatedWallet = userRes.data.wallet;
      localStorage.setItem("wallet", updatedWallet);
      toast.success("Refund successful 💸");
      fetchOrders();
    } catch {
      toast.error("Refund failed");
    }
  };

  useEffect(() => { fetchOrders(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const FILTERS = ["ALL", "CREATED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
  const filtered = (filter === "ALL"
    ? orders
    : orders.filter((o) => o.orderStatus?.toUpperCase() === filter)
  ).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  const summaryCards = [
    { label: "Total Orders", value: orders.length, icon: "📋", bg: "rgba(108,99,255,0.12)", color: "#6c63ff" },
    { label: "Confirmed", value: orders.filter((o) => o.orderStatus === "CONFIRMED").length, icon: "✅", bg: "rgba(67,233,123,0.1)", color: "#43e97b" },
    { label: "Shipped", value: orders.filter((o) => o.orderStatus === "SHIPPED").length, icon: "🚚", bg: "rgba(108,99,255,0.1)", color: "#8b7fff" },
    { label: "Cancelled", value: orders.filter((o) => o.orderStatus === "CANCELLED").length, icon: "❌", bg: "rgba(255,77,109,0.1)", color: "#ff4d6d" },
  ];

  return (
    <div className="ord-page">
      <div className="ord-glow" />
      <div className="ord-glow-2" />

      <Navbar
        showBackButton={true}
        showOrdersButton={false}
      />

      <div className="ord-content">
        <div className="ord-header">
          <div>
            <h1 className="ord-header__title">
              {role === "ADMIN" ? "🛡 All Orders" : "📋 My Orders"}
            </h1>
            <p className="ord-header__subtitle">
              {role === "ADMIN"
                ? "Manage and update status of all customer orders."
                : "Track, edit or cancel your placed orders."}
            </p>
          </div>
        </div>

        {(role !== "ADMIN" || selectedUser) && (
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
        )}

        {/* ✅ FILTER ONLY FOR USER */}
        {role !== "ADMIN" && (
          <div className="ord-filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`ord-filter-btn ${filter === f ? "ord-filter-btn--active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "ALL" ? `All (${orders.length})` : f}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="ord-skeleton">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="ord-skeleton__row" />
            ))}
          </div>
        ) : role === "ADMIN" ? (

          /* ================= ADMIN VIEW ================= */

          !selectedUser ? (
            <div className="ord-list">
              {usersOrders.map((u) => (
                <div
                  key={u.userId}
                  className="ord-user-card"
                  onClick={() => {
                    setSelectedUser(u);
                    setOrders(u.orders);
                  }}
                >

                  <div className="ord-user-left">
                    <div className="ord-user-id">👤 {userNames[u.userId] || `User ${u.userId}`}</div>
                    <div className="ord-user-sub">Click to view orders</div>
                  </div>

                  <div className="ord-user-right">
                    {u.orders.length} Orders →
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <button
                className="ord-back-btn"
                onClick={() => setSelectedUser(null)}
              >
                ⬅ Back
              </button>

              <h2 style={{ marginBottom: "16px" }}>
                Orders of User {userNames[selectedUser.userId] || `User ${selectedUser.userId}`}
              </h2>

              <div className="ord-list">
                {selectedUser.orders.map((order, i) => (
                  <OrderCard
                    key={order.orderId}
                    order={order}
                    role={role}
                    index={i}
                    onCancel={(itemId) => setConfirm(itemId)}
                    onStatusUpdate={updateStatus}
                    onEditOpen={(o) => setEditOrder(o)}
                    onRefund={refundOrder}
                  />
                ))}
              </div>
            </>
          )

        ) : (

          /* ================= USER VIEW ================= */

          filtered.length === 0 ? (
            <div className="ord-empty">
              <span className="ord-empty__icon">📭</span>
              <h3 className="ord-empty__title">
                {filter === "ALL" ? "No orders yet" : `No ${filter} orders`}
              </h3>
              <p className="ord-empty__sub">
                {filter === "ALL"
                  ? "Place your first order from the inventory."
                  : `You have no orders with status "${filter}".`}
              </p>
              {filter === "ALL" && (
                <button
                  className="ord-empty__btn"
                  onClick={() => navigate("/inventory")}
                >
                  Browse Products →
                </button>
              )}
            </div>
          ) : (
            <div className="ord-list">
              {filtered.map((order, i) => (
                <OrderCard
                  key={order.orderId}
                  order={order}
                  role={role}
                  index={i}
                  onCancel={(itemId) => setConfirm(itemId)}
                  onStatusUpdate={updateStatus}
                  onEditOpen={(o) => setEditOrder(o)}
                  onRefund={refundOrder}
                />
              ))}
            </div>
          )
        )}
      </div>

      {confirm && (
        <ConfirmModal
          orderId={confirm}
          onConfirm={() => cancelOrder(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {editOrder && (
        <EditModal
          order={editOrder}
          onSave={updateDetails}
          onCancel={() => setEditOrder(null)}
        />
      )}
    </div>
  );
}

export default Orders;
