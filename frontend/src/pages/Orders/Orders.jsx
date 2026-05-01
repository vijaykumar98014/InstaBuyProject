import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useSelector } from "react-redux";
import { useOrders } from "./hooks/useOrders";
import OrdersList from "./components/OrdersList";
import OrdersFilters from "./components/OrdersFilters";
import OrdersSummary from "./components/OrdersSummary";
import ConfirmModal from "./components/ConfirmModal";
import EditModal from "./components/EditModal";
import "./Orders.css";

function Orders() {
  const navigate = useNavigate();
  const { role, userId } = useSelector((state) => state.user);
  const resolvedUserId = userId || localStorage.getItem("userId") || "";
  const {
    orders,
    loading,
    confirm,
    editOrder,
    filter,
    usersOrders,
    userNames,
    FILTERS,
    filteredOrders,
    summaryCards,
    selectedUserData,
    setOrders,
    setConfirm,
    setEditOrder,
    setFilter,
    setSelectedUserId,
    cancelOrder,
    updateDetails,
    updateStatus,
    refundOrder,
  } = useOrders({ role, resolvedUserId });

  const goInventory = useCallback(() => navigate("/inventory"), [navigate]);

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

        <OrdersSummary
          role={role}
          selectedUserData={selectedUserData}
          summaryCards={summaryCards}
        />

        <OrdersFilters
          role={role}
          filters={FILTERS}
          activeFilter={filter}
          ordersCount={orders.length}
          onFilterChange={setFilter}
        />

        {loading ? (
          <div className="ord-skeleton">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="ord-skeleton__row" />
            ))}
          </div>
        ) : role === "ADMIN" ? (

          /* ================= ADMIN VIEW ================= */

          !selectedUserData ? (
            <div className="ord-list">
              {usersOrders.map((u) => (
                <div
                  key={u.userId}
                  className="ord-user-card"
                  onClick={() => {
                    setSelectedUserId(u.userId);
                    setOrders(Array.isArray(u.orders) ? u.orders : []);
                  }}
                >

                  <div className="ord-user-left">
                    <div className="ord-user-id">👤 {userNames[u.userId] || `User ${u.userId}`}</div>
                    <div className="ord-user-sub">Click to view orders</div>
                  </div>

                  <div className="ord-user-right">
                    {(Array.isArray(u.orders) ? u.orders.length : 0)} Orders →
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <button
                className="ord-back-btn"
                onClick={() => {
                  setSelectedUserId(null);
                  setOrders([]);
                }}
              >
                ⬅ Back
              </button>

              <h2 style={{ marginBottom: "16px" }}>
                Orders of User {userNames[selectedUserData.userId] || `User ${selectedUserData.userId}`}
              </h2>

              <OrdersList
                orders={orders}
                role={role}
                onCancel={(itemId) => setConfirm(itemId)}
                onStatusUpdate={updateStatus}
                onEditOpen={(order) => setEditOrder(order)}
                onRefund={refundOrder}
              />
            </>
          )

        ) : (

          /* ================= USER VIEW ================= */

          filteredOrders.length === 0 ? (
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
                  onClick={goInventory}
                >
                  Browse Products →
                </button>
              )}
            </div>
          ) : (
            <OrdersList
              orders={filteredOrders}
              role={role}
              onCancel={(itemId) => setConfirm(itemId)}
              onStatusUpdate={updateStatus}
              onEditOpen={(order) => setEditOrder(order)}
              onRefund={refundOrder}
            />
          )
        )}
      </div>

      {confirm && (
        <ConfirmModal
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

export default memo(Orders);
