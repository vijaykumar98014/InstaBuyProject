import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useSelector } from "react-redux";
import { useCart } from "./hooks/useCart";
import CartLoadingSkeleton from "./components/CartLoadingSkeleton";
import CartEmptyState from "./components/CartEmptyState";
import CartItemsPanel from "./components/CartItemsPanel";
import CartSummaryPanel from "./components/CartSummaryPanel";
import "./Cart.css";

//  Main Component
function Cart() {
  const navigate = useNavigate();
  const { userId, wallet } = useSelector((state) => state.user);
  const resolvedUserId = userId || localStorage.getItem("userId") || "";
  const {
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
  } = useCart({ resolvedUserId, wallet, navigate });

  const goInventory = useCallback(() => navigate("/inventory"), [navigate]);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="cart-page">
      <div className="cart-glow" />
      <div className="cart-glow-2" />

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <Navbar
        showBackButton={true}
        backText="← Inventory"
        backPath="/inventory"
        showCount={true}
        countText={`${cartItems.length} item${cartItems.length !== 1 ? "s" : ""} in cart`}
        showCartButton={false}
      />

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div className="cart-content">
        <div className="cart-header">
          <h1 className="cart-header__title">🛒 Your Cart</h1>
          <p className="cart-header__subtitle">
            Review your items and fill in delivery details to place your order.
          </p>
        </div>

        {loading ? (
          <CartLoadingSkeleton />
        ) : cartItems.length === 0 ? (
          <CartEmptyState onBrowseProducts={goInventory} />
        ) : (
          <div className="cart-layout">
            <CartItemsPanel
              cartItems={cartItems}
              onIncreaseQuantity={increaseQuantity}
              onDecreaseQuantity={decreaseQuantity}
              onRemoveItem={removeItem}
            />

            <CartSummaryPanel
              cartItems={cartItems}
              total={total}
              address={address}
              phone={phone}
              paymentMethod={paymentMethod}
              placing={placing}
              onAddressChange={setAddress}
              onPhoneChange={setPhone}
              onPaymentMethodChange={setPaymentMethod}
              onPlaceOrder={placeOrder}
              onContinueShopping={goInventory}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(Cart);
