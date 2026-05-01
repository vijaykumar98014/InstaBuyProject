import React, { useMemo, useEffect } from "react";
import "./InventoryForm.css";

/**
 * Form component for adding and editing products
 */
function InventoryForm({
  editId,
  name,
  setName,
  price,
  setPrice,
  quantity,
  setQuantity,
  image,
  setImage,
  submitting,
  onImageChange,
  onAddProduct,
  onUpdateProduct,
  onCancel,
}) {
  const imagePreviewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image]
  );

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const formFields = useMemo(
    () => [
      {
        label: "Product Name",
        value: name,
        setter: setName,
        type: "text",
      },
      {
        label: "Price",
        value: price,
        setter: setPrice,
        type: "number",
      },
      {
        label: "Quantity",
        value: quantity,
        setter: setQuantity,
        type: "number",
      },
    ],
    [name, setName, price, setPrice, quantity, setQuantity]
  );

  return (
    <div className="inv-form">
      <div className="inv-form__header">
        <div>
          <h3 className="inv-form__title">
            {editId ? "✏️ Update Product" : "✦ Add New Product"}
          </h3>
          <p className="inv-form__subtitle">
            {editId
              ? "Modify the product details below"
              : "Fill in the details to add a new product"}
          </p>
        </div>
        <button className="cancel-btn" onClick={onCancel}>
          ✕ Cancel
        </button>
      </div>

      <div className="inv-form__grid">
        {formFields.map(({ label, value, setter, type }) => (
          <div key={label}>
            <label className="inv-form__label">{label}</label>
            <div className="inv-form__input-wrap">
              <input
                className="inv-form__input"
                type={type}
                placeholder=""
                value={value}
                onChange={(e) => setter(e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="inv-upload">
        <label className="inv-form__label">Product Image</label>
        <label className="inv-upload__box">
          <input
            className="inv-upload__input"
            type="file"
            accept="image/*"
            onChange={onImageChange}
          />
          <div className="inv-upload__icon">{image ? "🖼️" : "📤"}</div>
          <div className="inv-upload__content">
            <div className="inv-upload__title">
              {image ? "Image Selected" : "Upload Product Image"}
            </div>
            <div className="inv-upload__sub">
              {image ? image.name : "Click to choose an image for this product"}
            </div>
          </div>
          <span className="inv-upload__chip">{image ? "Change" : "Browse"}</span>
        </label>
        {image && (
          <div className="inv-upload__preview">
            <img
              src={imagePreviewUrl}
              alt="Selected product preview"
              className="inv-upload__preview-img"
            />

            <div className="inv-upload__preview-meta">
              <div className="inv-upload__preview-name">{image.name}</div>
              <div className="inv-upload__preview-size">
                {(image.size / (1024 * 1024)).toFixed(2)} MB
              </div>
              <button
                type="button"
                className="inv-upload__remove"
                onClick={() => setImage(null)}
              >
                Remove image
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="inv-form__actions">
        <button
          className={`submit-btn ${editId ? "submit-btn--edit" : "submit-btn--add"}`}
          onClick={editId ? onUpdateProduct : onAddProduct}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="spinner" /> Processing...
            </>
          ) : editId ? (
            "Update Product"
          ) : (
            "Add to Inventory"
          )}
        </button>
        <button className="cancel-btn cancel-btn--lg" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default InventoryForm;
