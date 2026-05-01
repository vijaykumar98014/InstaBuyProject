import { memo } from "react";

const CartSummaryPanel = memo(function CartSummaryPanel({
  cartItems,
  total,
  address,
  phone,
  paymentMethod,
  placing,
  onAddressChange,
  onPhoneChange,
  onPaymentMethodChange,
  onPlaceOrder,
  onContinueShopping,
}) {
  return (
    <div className="cart-summary-panel">
      <div className="cart-summary-box">
        <h3 className="cart-summary-box__title">Order Summary</h3>

        <div className="cart-summary-rows">
          <div className="cart-summary-row">
            <span>Items ({cartItems.length})</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <div className="cart-summary-row cart-summary-row--free">
            <span>Delivery</span>
            <span>Free</span>
          </div>
          <div className="cart-summary-divider" />
          <div className="cart-summary-total">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="cart-address-form">
          <div className="cart-address-form__title">Delivery Details</div>

          <div className="cart-address-form__field">
            <label className="cart-address-form__label">Shipping Address</label>
            <input
              className="cart-address-form__input"
              type="text"
              placeholder="Enter full address..."
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
            />
          </div>

          <div className="cart-address-form__field">
            <label className="cart-address-form__label">Phone Number</label>
            <input
              className="cart-address-form__input"
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
            />
          </div>
        </div>

        <div className="cart-payment-methods">
          <label className="cart-payment-option">
            <input
              type="radio"
              value="ONLINE"
              checked={paymentMethod === "ONLINE"}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
            />
            <span className="cart-payment-option__label">💳 Wallet</span>
          </label>

          <label className="cart-payment-option">
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
            />
            <span className="cart-payment-option__label">🚚 COD</span>
          </label>

          <label className="cart-payment-option">
            <input
              type="radio"
              value="RAZORPAY"
              checked={paymentMethod === "RAZORPAY"}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
            />
            <span className="cart-payment-option__label">📱 Razorpay</span>
          </label>
        </div>

        <button
          className="cart-place-btn"
          onClick={onPlaceOrder}
          disabled={placing}
        >
          {placing ? (
            <>
              <span className="cart-place-btn__spinner" />
              Placing order...
            </>
          ) : (
            "✅ Place Order"
          )}
        </button>

        <button className="cart-continue-btn" onClick={onContinueShopping}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
});

export default CartSummaryPanel;
