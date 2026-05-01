import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { orderAPI, userAPI } from "../../../services/api";
import { updateWallet } from "../../../redux/userSlice";
import { useNotifications } from "../../../hooks";
import { calculateCartTotal, isValidPhone } from "../utils/cartUtils";

export function useCart({ resolvedUserId, wallet, navigate }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  const dispatch = useDispatch();
  const { addNotification: addUserNotification } = useNotifications(resolvedUserId);
  const { addNotification: addAdminNotification } = useNotifications("ADMIN");

  const fetchCart = useCallback(async () => {
    if (!resolvedUserId) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await orderAPI.get(`/api/orders/cart/${resolvedUserId}`);
      setCartItems(res.data || []);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [resolvedUserId]);

  const removeItem = useCallback(async (productId) => {
    if (!resolvedUserId) {
      toast.error("User not loaded yet");
      return;
    }

    try {
      await orderAPI.get(`/api/orders/cart/remove/${resolvedUserId}/${productId}`);
      toast.info("Item removed ❌");
      fetchCart();
    } catch {
      toast.error("Failed to remove item");
    }
  }, [fetchCart, resolvedUserId]);

  const updateQuantity = useCallback(async (productId, newQuantity) => {
    if (!resolvedUserId) {
      toast.error("User not loaded yet");
      return;
    }

    if (newQuantity < 1) {
      return;
    }

    try {
      const currentItem = cartItems.find((item) => item.productId === productId);
      if (!currentItem) {
        return;
      }

      const updatedCart = cartItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCartItems(updatedCart);

      await orderAPI.get(`/api/orders/cart/remove/${resolvedUserId}/${productId}`);

      await orderAPI.post(`/api/orders/cart/add/${resolvedUserId}`, {
        productId,
        quantity: newQuantity,
        price: currentItem.price,
      });
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update quantity");
      fetchCart();
    }
  }, [cartItems, fetchCart, resolvedUserId]);

  const increaseQuantity = useCallback((productId, currentQty) => {
    updateQuantity(productId, currentQty + 1);
  }, [updateQuantity]);

  const decreaseQuantity = useCallback((productId, currentQty) => {
    if (currentQty <= 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
    updateQuantity(productId, currentQty - 1);
  }, [updateQuantity]);

  const total = useMemo(() => calculateCartTotal(cartItems), [cartItems]);

  const placeOrder = useCallback(async () => {
    // ─── Pre-validation ──────────────────────────────────────────────────────
    if (!resolvedUserId) {
      toast.error("User not loaded yet");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // ─── Validate Address ────────────────────────────────────────────────────
    if (!address.trim()) {
      toast.error("Please enter a shipping address");
      return;
    }

    // ─── Validate Phone ─────────────────────────────────────────────────────
    if (!phone.trim()) {
      toast.error("Please enter a phone number");
      return;
    }

    if (!isValidPhone(phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    // ─── Wallet Balance Check (for ONLINE payment) ──────────────────────────
    if (paymentMethod === "ONLINE" && wallet < total) {
      toast.error("❌ Insufficient wallet balance");
      return;
    }

    // ─── Place Order ────────────────────────────────────────────────────────
    setPlacing(true);
    try {
      const res = await orderAPI.post(`/api/orders/place/${resolvedUserId}`, {
        shippingAddress: address,
        phone,
        paymentMethod,
      });

      // ─── Success Handler ────────────────────────────────────────────────
      if (res?.data?.status === "CONFIRMED") {
        // Show appropriate success message based on payment method
        if (paymentMethod === "COD") {
          toast.success("Order Placed Successfully 🎉");
        } else if (paymentMethod === "ONLINE") {
          toast.success("Wallet Payment Successful 🎉");
        } else if (paymentMethod === "RAZORPAY") {
          toast.success("Razorpay Payment Successful 🎉");
        }

        // Add user notification
        addUserNotification(
          `Order placed successfully (${cartItems.length} item${
            cartItems.length !== 1 ? "s" : ""
          })`
        );

        // Add admin notification
        addAdminNotification(`New order placed by User ${resolvedUserId}`);

        // Update wallet balance from backend
        const userRes = await userAPI.get(`/api/users/${resolvedUserId}`);
        const updatedWallet = userRes.data.wallet;
        dispatch(updateWallet(updatedWallet));

        // Clear cart and form
        setCartItems([]);
        setAddress("");
        setPhone("");
        setPaymentMethod("ONLINE");

        // Redirect to orders page
        setTimeout(() => navigate("/orders"), 1500);
      }
    } catch (error) {
      // ─── Error Handler ──────────────────────────────────────────────────
      const errorMessage =
        error?.response?.data?.message || "❌ Payment failed. Please try again";
      toast.error(errorMessage);
      console.error("Order placement error:", error);
    } finally {
      // ─── Cleanup ────────────────────────────────────────────────────────
      setPlacing(false);
    }
  }, [
    addAdminNotification,
    addUserNotification,
    address,
    cartItems,
    dispatch,
    navigate,
    paymentMethod,
    phone,
    resolvedUserId,
    total,
    wallet,
  ]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cartItems,
    loading,
    placing,
    address,
    phone,
    paymentMethod,
    total,
    setAddress,
    setPhone,
    setPaymentMethod,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    placeOrder,
  };
}
