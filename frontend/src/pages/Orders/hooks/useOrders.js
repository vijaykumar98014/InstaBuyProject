import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { orderAPI, userAPI } from "../../../services/api";
import { updateWallet } from "../../../redux/userSlice";
import { useNotifications } from "../../../hooks";

export function useOrders({ role, resolvedUserId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [usersOrders, setUsersOrders] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userNames, setUserNames] = useState({});

  const dispatch = useDispatch();
  const { addNotification: addAdminNotification } = useNotifications("ADMIN");
  const { addNotification: addSelectedUserNotification } = useNotifications(selectedUserId);

  const fetchOrders = useCallback(async () => {
    // Guard: don't fetch if user is not logged in
    if (!resolvedUserId && role !== "ADMIN") {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let response;

      if (role === "ADMIN") {
        response = await orderAPI.get("/api/order-items/admin/grouped");
        const groupedOrders = response.data || [];
        setUsersOrders(groupedOrders);

        const nameEntries = await Promise.all(
          groupedOrders.map(async (userGroup) => {
            try {
              const userRes = await userAPI.get(`/api/users/${userGroup.userId}`);
              return [userGroup.userId, userRes.data.name || `User ${userGroup.userId}`];
            } catch {
              return [userGroup.userId, "Unknown User"];
            }
          })
        );

        const names = Object.fromEntries(nameEntries);
        setUserNames(names);

        if (selectedUserId !== null) {
          const refreshedUser = groupedOrders.find(
            (userGroup) => String(userGroup.userId) === String(selectedUserId)
          );

          if (refreshedUser) {
            setOrders(Array.isArray(refreshedUser.orders) ? refreshedUser.orders : []);
          } else {
            setSelectedUserId(null);
            setOrders([]);
          }
        } else {
          setOrders([]);
        }
      } else {
        response = await orderAPI.get(`/api/order-items/user/${resolvedUserId}`);
        setOrders(response.data || []);
      }
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [role, selectedUserId, resolvedUserId]);

  const cancelOrder = useCallback(async (orderId) => {
    try {
      await orderAPI.post(`/api/order-items/cancel/${orderId}`);
      toast.success("Order cancelled successfully");

      if (role !== "ADMIN" && resolvedUserId) {
        addAdminNotification(`Order #${orderId} cancelled by User ${resolvedUserId}`);
      }

      setTimeout(() => {
        setConfirm(null);
      }, 1000);

      fetchOrders();
    } catch {
      toast.error("Failed to cancel order");
    }
  }, [addAdminNotification, fetchOrders, resolvedUserId, role]);

  const updateDetails = useCallback(async (orderId, address, phone) => {
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
  }, [fetchOrders]);

  const updateStatus = useCallback(async (orderId, status) => {
    try {
      await orderAPI.put(`/api/order-items/status/${orderId}?status=${status}`);
      toast.info(`Order #${orderId} → ${status}`);
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  }, [fetchOrders]);

  const refundOrder = useCallback(async (orderId) => {
    try {
      await orderAPI.post(`/api/order-items/refund/${orderId}`);

      if (role !== "ADMIN" && resolvedUserId) {
        const userRes = await userAPI.get(`/api/users/${resolvedUserId}`);
        const updatedWallet = userRes.data.wallet;
        dispatch(updateWallet(updatedWallet));
      }

      toast.success("Refund successful 💸");

      if (role === "ADMIN" && selectedUserId) {
        addSelectedUserNotification(`Refund processed for Order #${orderId}`);
      }

      fetchOrders();
    } catch {
      toast.error("Refund failed");
    }
  }, [addSelectedUserNotification, dispatch, fetchOrders, resolvedUserId, role, selectedUserId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const FILTERS = useMemo(
    () => ["ALL", "CREATED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
    []
  );

  const filteredOrders = useMemo(() => {
    const nextOrders = Array.isArray(orders) ? orders : [];
    const byFilter = filter === "ALL"
      ? nextOrders
      : nextOrders.filter((order) => order.orderStatus?.toUpperCase() === filter);

    return [...byFilter].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  }, [filter, orders]);

  const summaryCards = useMemo(() => [
    {
      label: "Total Orders",
      value: orders.length,
      icon: "📋",
      bg: "rgba(108,99,255,0.12)",
      color: "#6c63ff",
    },
    {
      label: "Confirmed",
      value: orders.filter((order) => order.orderStatus === "CONFIRMED").length,
      icon: "✅",
      bg: "rgba(67,233,123,0.1)",
      color: "#43e97b",
    },
    {
      label: "Shipped",
      value: orders.filter((order) => order.orderStatus === "SHIPPED").length,
      icon: "🚚",
      bg: "rgba(108,99,255,0.1)",
      color: "#8b7fff",
    },
    {
      label: "Cancelled",
      value: orders.filter((order) => order.orderStatus === "CANCELLED").length,
      icon: "❌",
      bg: "rgba(255,77,109,0.1)",
      color: "#ff4d6d",
    },
  ], [orders]);

  const selectedUserData = useMemo(
    () => usersOrders.find((userGroup) => String(userGroup.userId) === String(selectedUserId)) || null,
    [usersOrders, selectedUserId]
  );

  return {
    orders,
    loading,
    confirm,
    editOrder,
    filter,
    usersOrders,
    selectedUserId,
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
    fetchOrders,
    cancelOrder,
    updateDetails,
    updateStatus,
    refundOrder,
  };
}
