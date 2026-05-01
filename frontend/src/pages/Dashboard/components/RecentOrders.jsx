import { memo } from "react";

const RecentOrders = memo(function RecentOrders({ orders, loading }) {
  return (
    <section className="dash-section">
      <div className="dash-section__header">
        <h2 className="dash-section__title">Recent Orders</h2>
        <p className="dash-section__sub">Latest 50 orders from the system</p>
      </div>

      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(50)
                .fill(0)
                .map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4}>
                      <div className="dash-table__skeleton" />
                    </td>
                  </tr>
                ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="dash-empty">
                    No recent orders found.
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId || "—"}</td>
                  <td>{order.userId || "—"}</td>
                  <td>₹{Number(order.totalAmount || 0).toLocaleString()}</td>
                  <td>
                    <span className={`dash-status dash-status--${String(order.orderStatus || "unknown").toLowerCase()}`}>
                      {order.orderStatus || "UNKNOWN"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
});

export default RecentOrders;
