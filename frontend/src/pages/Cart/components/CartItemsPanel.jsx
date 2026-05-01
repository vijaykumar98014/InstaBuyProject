import { memo } from "react";

const CartItemsPanel = memo(function CartItemsPanel({
  cartItems,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
}) {
  return (
    <div className="cart-items-panel">
      <div className="cart-items-wrap">
        <div className="cart-items-header">
          <span className="cart-items-header__title">Cart Items</span>
          <span className="cart-items-header__badge">
            {cartItems.length} items
          </span>
        </div>

        {cartItems.map((item, i) => (
          <div key={item.id || item.productId || i} className="cart-item">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.productName}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <div className="cart-item__icon">📦</div>
            )}

            <div className="cart-item__info">
              <div className="cart-item__name">
                {item.productName || item.name || `Product #${item.productId}`}
              </div>
              <div className="cart-item__meta">
                <span>₹{Number(item.price).toLocaleString()}</span>
              </div>
            </div>

            <div className="cart-item__right-section">
              <div className="cart-item__subtotal">
                ₹{(item.price * item.quantity).toLocaleString()}
              </div>

              <div className="cart-item__controls">
                <button
                  className="cart-item__qty-btn cart-item__qty-btn--decrease"
                  onClick={() => onDecreaseQuantity(item.productId, item.quantity)}
                  title="Decrease quantity"
                >
                  ➖
                </button>
                <span className="cart-item__qty-display">{item.quantity}</span>
                <button
                  className="cart-item__qty-btn cart-item__qty-btn--increase"
                  onClick={() => onIncreaseQuantity(item.productId, item.quantity)}
                  title="Increase quantity"
                >
                  ➕
                </button>
              </div>

              <button
                className="cart-item__remove"
                onClick={() => onRemoveItem(item.productId)}
                title="Remove item"
              >
                ❌
              </button>
            </div>
          </div>
        ))}

        <div className="cart-shipping-notice">
          🚚 Free delivery on this order
        </div>
      </div>
    </div>
  );
});

export default CartItemsPanel;
