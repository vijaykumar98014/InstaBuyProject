import { memo, useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import {
  inventoryAPI,
  orderAPI,
  userAPI,
  paymentAPI,
} from "../../services/api";
import DashboardCards from "./components/DashboardCards";
import RecentOrders from "./components/RecentOrders";
import "./Dashboard.css";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    let active = true;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [ordersRes, productsRes, usersRes, paymentsRes] =
          await Promise.all([
            orderAPI.get("/api/order-items/admin/grouped"),
            inventoryAPI.get("/api/inventory/products"),
            userAPI.get("/api/users"),
            paymentAPI.get("/api/payment/admin/revenue"),
          ]);

        const groupedOrders = Array.isArray(ordersRes.data)
          ? ordersRes.data
          : [];
        const flattenedOrders = groupedOrders.flatMap((group) =>
          Array.isArray(group.orders)
            ? group.orders.map((order) => ({
                ...order,
                userId: group.userId,
              }))
            : [],
        );

        const sortedOrders = [...flattenedOrders].sort(
          (a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0),
        );

        const totalRevenue = Number(paymentsRes.data || 0);

        if (!active) return;

        setSummary({
          totalOrders: flattenedOrders.length,
          totalProducts: Array.isArray(productsRes.data)
            ? productsRes.data.length
            : 0,
          totalUsers: Array.isArray(usersRes.data) ? usersRes.data.length : 0,
          totalRevenue,
        });
        setRecentOrders(sortedOrders.slice(0, 50));
      } catch {
        if (!active) return;
        setSummary({
          totalOrders: 0,
          totalProducts: 0,
          totalUsers: 0,
          totalRevenue: 0,
        });
        setRecentOrders([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => {
      active = false;
    };
  }, []);

  const cards = useMemo(
    () => [
      {
        label: "Total Orders",
        value: summary.totalOrders,
        icon: "📋",
        color: "#6c63ff",
      },
      {
        label: "Total Products",
        value: summary.totalProducts,
        icon: "📦",
        color: "#43e97b",
      },
      {
        label: "Total Users",
        value: summary.totalUsers,
        icon: "👥",
        color: "#f5c842",
      },
      {
        label: "Total Revenue",
        value: `₹${summary.totalRevenue.toLocaleString()}`,
        icon: "💰",
        color: "#ff4d6d",
      },
    ],
    [summary],
  );

  return (
    <div className="dash-page">
      <Navbar
        showBackButton={true}
        backText="← Home"
        backPath="/home"
        showOrdersButton={true}
      />

      <div className="dash-content">
        <div className="dash-header">
          <div>
            <h1 className="dash-header__title">Admin Dashboard</h1>
            <p className="dash-header__subtitle">
              Overview of orders, products, users, and recent activity.
            </p>
          </div>
        </div>

        <DashboardCards cards={cards} loading={loading} />

        <RecentOrders orders={recentOrders} loading={loading} />
      </div>
    </div>
  );
}

export default memo(Dashboard);
