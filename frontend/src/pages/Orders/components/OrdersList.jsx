import { memo } from "react";
import OrderCard from "./OrderCard";

const OrdersList = memo(function OrdersList({
  orders,
  role,
  onCancel,
  onStatusUpdate,
  onEditOpen,
  onRefund,
}) {
  return (
    <div className="ord-list">
      {orders.map((order, index) => (
        <OrderCard
          key={order.orderId}
          order={order}
          role={role}
          index={index}
          onCancel={onCancel}
          onStatusUpdate={onStatusUpdate}
          onEditOpen={onEditOpen}
          onRefund={onRefund}
        />
      ))}
    </div>
  );
});

export default OrdersList;
