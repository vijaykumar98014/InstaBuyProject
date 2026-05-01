import { memo } from "react";

const ConfirmModal = memo(function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="ord-modal-overlay">
      <div className="ord-modal-box">
        <div className="ord-modal-box__icon">🗑</div>
        <h3 className="ord-modal-box__title">Cancel Order?</h3>
        <p className="ord-modal-box__msg">
          Are you sure you want to cancel this order?
          <br />
          Stock will be restored automatically.
        </p>
        <div className="ord-modal-box__btns">
          <button className="ord-modal-box__keep" onClick={onCancel}>Keep Order</button>
          <button className="ord-modal-box__cancel" onClick={onConfirm}>Yes, Cancel</button>
        </div>
      </div>
    </div>
  );
});

export default ConfirmModal;
