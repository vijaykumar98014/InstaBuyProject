import { memo } from "react";

const CartEmptyState = memo(function CartEmptyState({ onBrowseProducts }) {
  return (
    <div className="cart-empty">
      <span className="cart-empty__icon">🛒</span>
      <h3 className="cart-empty__title">Your cart is empty</h3>
      <p className="cart-empty__sub">
        Browse the inventory and add some products!
      </p>
      <button className="cart-empty__btn" onClick={onBrowseProducts}>
        Browse Products →
      </button>
    </div>
  );
});

export default CartEmptyState;
