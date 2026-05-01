import { memo, useCallback, useState } from "react";

const EditModal = memo(function EditModal({ order, onSave, onCancel }) {
  const [address, setAddress] = useState(order.shippingAddress || "");
  const [phone, setPhone] = useState(order.phone || "");

  const handleSave = useCallback(() => {
    onSave(order.orderId, address, phone);
  }, [onSave, order.orderId, address, phone]);

  return (
    <div className="ord-modal-overlay">
      <div className="ord-modal-box ord-modal-box--wide">
        <div className="ord-modal-box__icon">✏️</div>
        <h3 className="ord-modal-box__title">Update Delivery Details</h3>
        <p className="ord-modal-box__msg">Order #{order.orderId}</p>

        <div className="ord-edit-fields">
          <div className="ord-edit-field">
            <label className="ord-edit-label">Shipping Address</label>
            <input
              className="ord-edit-input"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full address..."
            />
          </div>
          <div className="ord-edit-field">
            <label className="ord-edit-label">Phone Number</label>
            <input
              className="ord-edit-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
            />
          </div>
        </div>

        <div className="ord-modal-box__btns">
          <button className="ord-modal-box__keep" onClick={onCancel}>Cancel</button>
          <button className="ord-modal-box__save" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
});

export default EditModal;
