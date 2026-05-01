import { memo } from "react";

const CartLoadingSkeleton = memo(function CartLoadingSkeleton() {
  return (
    <div className="cart-skeleton">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="cart-skeleton__row" />
      ))}
    </div>
  );
});

export default CartLoadingSkeleton;
